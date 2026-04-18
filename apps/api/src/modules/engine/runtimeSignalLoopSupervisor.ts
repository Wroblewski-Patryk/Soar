export type RuntimeStallReason = 'runtime_stall_no_event' | 'runtime_stall_no_heartbeat';

type RuntimeSignalLoopSupervisorDeps = {
  watchdogIntervalMs: number;
  stallDetectorEnabled: () => boolean;
  stallNoEventMs: () => number;
  stallNoHeartbeatMs: () => number;
  autoRestartEnabled: () => boolean;
  autoRestartCooldownMs: () => number;
  autoRestartMaxAttempts: () => number;
  autoRestartWindowMs: () => number;
  getIsRunning: () => boolean;
  getLastKnownActiveBotIds: () => string[];
  getLastStreamEventAtMs: () => number | null;
  getLastSessionSyncSuccessAtMs: () => number | null;
  onWatchdogTick: (now: number) => Promise<string[]>;
  onWatchdogError: (error: unknown) => void;
  onStall: (reason: RuntimeStallReason, activeBotIds: string[]) => Promise<void>;
  onAutoRestart: (reason: RuntimeStallReason) => Promise<void>;
  onAutoRestartError: (error: unknown, reason: RuntimeStallReason) => void;
  onAutoRestartMaxAttemptsGuard: () => void;
};

export class RuntimeSignalLoopSupervisor {
  private sessionWatchdogTimer: NodeJS.Timeout | null = null;
  private autoRestartTimer: NodeJS.Timeout | null = null;
  private readonly autoRestartAttempts: number[] = [];

  constructor(private readonly deps: RuntimeSignalLoopSupervisorDeps) {}

  startWatchdog() {
    if (this.sessionWatchdogTimer) return;
    if (!Number.isFinite(this.deps.watchdogIntervalMs) || this.deps.watchdogIntervalMs <= 0) return;

    this.sessionWatchdogTimer = setInterval(() => {
      void (async () => {
        const now = Date.now();
        let activeBotIds: string[] = [];
        try {
          activeBotIds = await this.deps.onWatchdogTick(now);
        } catch (error) {
          this.deps.onWatchdogError(error);
        }
        await this.detectRuntimeStall(now, activeBotIds);
      })();
    }, this.deps.watchdogIntervalMs);
    this.sessionWatchdogTimer.unref?.();
  }

  stopWatchdog() {
    if (this.sessionWatchdogTimer) {
      clearInterval(this.sessionWatchdogTimer);
      this.sessionWatchdogTimer = null;
    }
  }

  cancelPendingAutoRestartTimer() {
    if (this.autoRestartTimer) {
      clearTimeout(this.autoRestartTimer);
      this.autoRestartTimer = null;
    }
  }

  clearAutoRestartState() {
    this.cancelPendingAutoRestartTimer();
    this.autoRestartAttempts.length = 0;
  }

  scheduleAutoRestart(reason: RuntimeStallReason) {
    if (!this.deps.autoRestartEnabled()) return;
    if (this.deps.getIsRunning()) return;
    if (this.autoRestartTimer) return;
    const delayMs = this.deps.autoRestartCooldownMs();
    this.autoRestartTimer = setTimeout(() => {
      this.autoRestartTimer = null;
      void this.performAutoRestart(reason);
    }, delayMs);
    this.autoRestartTimer.unref?.();
  }

  private async detectRuntimeStall(now: number, activeBotIdsFromSync: string[]) {
    if (!this.deps.stallDetectorEnabled() || !this.deps.getIsRunning()) return;
    const activeBotIds =
      activeBotIdsFromSync.length > 0 ? activeBotIdsFromSync : this.deps.getLastKnownActiveBotIds();
    if (activeBotIds.length === 0) return;

    const lastSessionSyncSuccessAtMs = this.deps.getLastSessionSyncSuccessAtMs();
    if (
      lastSessionSyncSuccessAtMs != null &&
      now - lastSessionSyncSuccessAtMs > this.deps.stallNoHeartbeatMs()
    ) {
      await this.deps.onStall('runtime_stall_no_heartbeat', activeBotIds);
      return;
    }

    const lastStreamEventAtMs = this.deps.getLastStreamEventAtMs();
    if (lastStreamEventAtMs != null && now - lastStreamEventAtMs > this.deps.stallNoEventMs()) {
      await this.deps.onStall('runtime_stall_no_event', activeBotIds);
    }
  }

  private pruneAutoRestartAttempts(now: number) {
    const windowMs = this.deps.autoRestartWindowMs();
    for (let index = this.autoRestartAttempts.length - 1; index >= 0; index -= 1) {
      if (now - this.autoRestartAttempts[index] > windowMs) {
        this.autoRestartAttempts.splice(index, 1);
      }
    }
  }

  private async performAutoRestart(reason: RuntimeStallReason) {
    if (!this.deps.autoRestartEnabled()) return;
    if (this.deps.getIsRunning()) return;
    const now = Date.now();
    this.pruneAutoRestartAttempts(now);
    if (this.autoRestartAttempts.length >= this.deps.autoRestartMaxAttempts()) {
      this.deps.onAutoRestartMaxAttemptsGuard();
      this.scheduleAutoRestart(reason);
      return;
    }

    this.autoRestartAttempts.push(now);
    try {
      await this.deps.onAutoRestart(reason);
    } catch (error) {
      this.deps.onAutoRestartError(error, reason);
      this.scheduleAutoRestart(reason);
    }
  }
}

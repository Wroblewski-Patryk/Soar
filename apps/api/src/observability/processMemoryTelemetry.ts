import { createModuleLogger } from '../lib/logger';

const BYTES_PER_MIB = 1024 * 1024;
const SAMPLE_INTERVAL_MS = 60_000;

const toMiB = (bytes: number) => Math.round(bytes / BYTES_PER_MIB);

export const sampleProcessMemory = (
  usage: NodeJS.MemoryUsage = process.memoryUsage(),
  uptimeSeconds = process.uptime()
) => ({
  rssMiB: toMiB(usage.rss),
  heapUsedMiB: toMiB(usage.heapUsed),
  heapTotalMiB: toMiB(usage.heapTotal),
  externalMiB: toMiB(usage.external),
  arrayBuffersMiB: toMiB(usage.arrayBuffers),
  uptimeSeconds: Math.floor(uptimeSeconds),
});

export const startProcessMemoryTelemetry = (
  logger: Pick<ReturnType<typeof createModuleLogger>, 'info'> = createModuleLogger('api.memory'),
  intervalMs = SAMPLE_INTERVAL_MS
) => {
  const report = () => logger.info('memory_snapshot', sampleProcessMemory());
  report();
  const timer = setInterval(report, intervalMs);
  timer.unref();
  return () => clearInterval(timer);
};

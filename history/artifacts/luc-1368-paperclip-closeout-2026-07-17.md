# LUC-1368 Closeout

- Status: `BLOCKED`
- Date: `2026-07-17`
- Scope:
  protected-gate reprobe for the Soar production Redis recovery path only.
- Files changed:
  - `history/tasks/luc-1368-provide-deploy-capable-redis-recovery-path-2026-07-17-task.md`
  - `history/evidence/luc-1368-provide-deploy-capable-redis-recovery-path-2026-07-17.md`
  - `.agents/state/system-health.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Verification:
  - public `https://api.soar.luckysparrow.ch/health` -> `200`
  - public `https://api.soar.luckysparrow.ch/ready` -> `503`
  - public `https://soar.luckysparrow.ch/` -> `200`
  - public `https://soar.luckysparrow.ch/api/build-info` -> `200`
  - Coolify `GET /api/v1/databases/{redis}` -> `restarting:unhealthy`, `restart_count=682`
  - Coolify bearer `POST /api/v1/databases/{redis}/restart` -> `403 Missing required permissions: deploy`
  - Coolify owner-login `POST /login` -> `200 {"two_factor":false}`
  - session-backed `GET /api/v1/teams/current` -> `401 Unauthenticated`
  - session-backed `POST /api/v1/databases/{redis}/restart` -> `401 Unauthenticated`
  - `git diff --check` -> pass with line-ending warnings only
- Repo state:
  no commit created in this heartbeat. The worktree was already dirty with
  unrelated generated/docs changes before this lane, and this issue remains
  blocked rather than source-control complete.
- Residual blocker:
  Security Review Lead or Ops Release Lead must provide a deploy-capable
  Coolify bearer/session mutation path or directly perform the one Redis
  recovery action, then DRE should rerun bounded readiness smoke.

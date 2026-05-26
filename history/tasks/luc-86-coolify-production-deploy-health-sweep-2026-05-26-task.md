# LUC-86 - Coolify production deploy health sweep (2026-05-26)

## Context
Issue continuation failed in adapter bootstrap before lane execution with `EEXIST` on auth symlink creation. Ops lane still needs fresh production health/readiness truth and a clear unblock path for runtime bootstrap.

## Goal
Capture no-secret production deploy-health evidence for current Soar production endpoints and re-triage the local auth bootstrap blocker without mutating production state.

## Constraints
- Read-only production checks only.
- No secret/token value exposure.
- No deploy/restart/rollback mutation.
- Fail closed on runtime bootstrap repair attempts.

## Delivery Stage
`verification`

## Definition of Done
- Fresh API/Web no-secret status captured.
- Auth bootstrap blocker root cause revalidated with file/link evidence.
- Any local repair attempt either succeeds safely or is rolled back immediately.
- Clear unblock owner/action documented.

## Forbidden
- Production mutation (deploy/restart/rollback/env change).
- Secret exposure in logs/artifacts.
- Marking lane done without bootstrap unblock path.

## Actions Executed
1. Verified runtime auth file state:
   - `C:\Users\wrobl\.codex\auth.json`
   - `...\codex-home\auth.json`
   Both exist as regular files (no `LinkType`) and have identical SHA256:
   `FDC5F4A8DA845452EE0A396743E33E6C289310CEA45E1D22FEFE00E585DD756E`.
2. Executed no-secret production probes:
   - `GET https://api.soar.luckysparrow.ch/health` -> `200`
   - `GET https://api.soar.luckysparrow.ch/ready` -> `200`
   - `GET https://soar.luckysparrow.ch/api/build-info` -> `200`
     with `gitSha=4c16305c97566b7680f4feb041601af2af0a0d31` and
     `checkedAt=2026-05-26T01:07:03.382Z`.
3. Attempted local runtime symlink normalization for `codex-home/auth.json`:
   - backup created,
   - replace-with-symlink attempt failed with Windows privilege guard:
     `Administrator privilege required for this operation`.
   - runtime file restored from backup immediately.

## Verification Result
- Production deploy-health read-only baseline: `implemented and verified`.
- Adapter bootstrap symlink repair in current privileges: `blocked by error`
  (`Administrator privilege required for this operation`).
- Runtime auth file integrity after failed repair attempt: restored and verified.

## Residual Risk
- Runtime bootstrap can still fail with `EEXIST` while symlink creation is attempted under non-elevated privileges.
- Temp-domain deploy smoke/readiness packet remains pending until bootstrap path is unblocked.

## Unblock Owner / Action
- Owner: local-board / host operator.
- Action: run runtime with elevated symlink privileges or update bootstrap to avoid symlink creation when target file already exists; then resume LUC-86/LUC-47 temp-domain smoke execution.

## Final Disposition
`blocked`

# Task

## Header
- ID: LUC-6307
- Title: Soar Protected Recheck
- Task Type: release gate recheck
- Current Stage: verification
- Status: DONE
- Owner: Deployment and Reliability Engineer
- Depends on: LUC-241
- Priority: P0
- Mission ID: LUC-6307-SOAR-PROTECTED-RECHECK-2026-06-30
- Mission Status: VERIFIED

## Context
Paperclip wake assigned [LUC-6307](/LUC/issues/LUC-6307) for one read-only
protected auth/smoke recheck after a fresh protected gate fact from
[LUC-2697](/LUC/issues/LUC-2697).

## Goal
Recheck the current Soar production protected smoke/auth gate for root blocker
[LUC-241](/LUC/issues/LUC-241), record redacted proof, and avoid any production
mutation.

## Constraints
- No deploy, restart, runtime mutation, push, live-account mutation, or
  unrelated production probing.
- Do not print or store secret values, cookies, tokens, passwords, or response
  bodies.
- Use existing read-only production smoke/auth scripts.
- Keep result scoped to the current deployed Web SHA.

## Definition of Done
- [x] Production build-info readback captured.
- [x] Current protected input name readiness checked without values.
- [x] Authenticated production deploy smoke rerun.
- [x] Browser auth/session proof rerun.
- [x] Browser cleanup checked.
- [x] Paperclip issue updated with final disposition.

## Forbidden
- Deploying, restarting, pushing, changing runtime state, changing credentials,
  mutating subscriptions, mutating exchange/live-trading settings, or writing
  secrets to artifacts.

## Validation Evidence
- Build-info readback at `2026-06-29T23:03:38.217Z` returned HTTP `200` and
  SHA `c357d957741f56835f27a1fc3a948dad43a91036` for `main`;
  `metadataSource=env-runtime` remains diagnostic, not release-grade build
  provenance.
- `node scripts/checkProtectedInputReadiness.mjs --today 2026-06-30 --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --git-ref main --json`
  returned `PARTIAL`: `11` matching protected input names present, with
  account-access gate still `FAIL` because `ROLLBACK_GUARD_*`, `SOAR_PROD_*`,
  `PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*`
  families are missing in this shell.
- `node scripts/deploySmokeCheck.mjs --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036`
  passed API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, and API
  `/workers/ready`.
- `node scripts/runProdAuthSessionBrowserProof.mjs --i-understand-production-auth-proof --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --today 2026-06-30 --output-json history/artifacts/luc-6307-prod-auth-session-browser-proof-2026-06-30.json --output-md history/evidence/luc-6307-prod-auth-session-browser-proof-2026-06-30.md`
  passed protected browser auth/session proof.
- Cleanup check:
  `Get-Process msedge,chrome,chrome-headless-shell,chromium,playwright -ErrorAction SilentlyContinue`
  returned no validation browser processes.

## Deployment / Ops Evidence
- Application/repo path: `C:/Personal/Projekty/Aplikacje/Soar`.
- Deploy impact: none.
- Push status: not needed.
- Coolify/resource impact: none; no read/write Coolify action was performed.
- Rollback impact: none; no deployment mutation occurred.

## Result Report
- Protected auth/smoke recheck passed for current production Web SHA
  `c357d957741f56835f27a1fc3a948dad43a91036`.
- Account-access release gate remains incomplete because broader protected input
  families are still missing in this shell; this does not invalidate the scoped
  read-only auth/smoke PASS.
- Files changed:
  - `history/evidence/luc-6307-prod-auth-session-browser-proof-2026-06-30.md`
  - `history/artifacts/luc-6307-prod-auth-session-browser-proof-2026-06-30.json`
  - `history/tasks/luc-6307-soar-protected-recheck-2026-06-30-task.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Commit SHA: not committed because the shared Soar worktree was already dirty,
  ahead `20`, behind `3`, with many unrelated active changes.
- Residual risk: release-grade build provenance remains separate because
  build-info reports `metadataSource=env-runtime`; host-level VPS/log-window
  proof and full account-access protected input families remain on separate
  owner paths.

# LUC-6920 API Ready Production Runtime Restoration

## Context

[LUC-6920](/LUC/issues/LUC-6920) was assigned to DRE after the project truth
index reported a critical runtime finding:
`https://api.soar.luckysparrow.ch/ready -> 503`.

Earlier same-day evidence from [LUC-6901](/LUC/issues/LUC-6901) and
[LUC-6904](/LUC/issues/LUC-6904) already suggested production runtime had been
restored, so this task required a fresh read-only verification before any
mutation permit or new child issue.

## Goal

Prove whether the API `/ready` 503 still reproduces, update stale project truth
if it does not, and leave [LUC-6920](/LUC/issues/LUC-6920) with a clear final
disposition.

## Constraints

- No push, deploy, restart, rollback execution, env edit, DB/Redis mutation, or
  Coolify/provider mutation.
- Do not print or persist secret/account values.
- Use the smallest production smoke sufficient to prove or route the runtime
  symptom.
- Do not overwrite unrelated dirty work in the shared checkout.

## Definition Of Done

- Public API `/health` and `/ready` checked.
- Web root and build-info checked.
- Protected worker readiness and rollback guard checked when approved auth
  family names are available.
- Runtime truth indexes match current evidence or a Docs Memory follow-up is
  created.
- Issue receives a final Paperclip disposition.

## Forbidden

- Secret disclosure.
- Live trading/account mutation.
- Production restart, deploy, rollback, DNS edit, provider mutation, or source
  push without explicit permit.
- Reverting unrelated local changes.

## Stage

`verification` -> expected output: fresh production smoke evidence, truth index
refresh, and Paperclip closure.

## Result Report

Status:
`DONE / PUBLIC_API_READY_RESTORED / PROTECTED_WORKERS_READY_PASS / ROLLBACK_GUARD_PASS / PROJECT_TRUTH_INDEX_REFRESHED / NO_PRODUCTION_MUTATION`.

Evidence:

- `corepack pnpm run -s ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers`
  passed: API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` all
  returned `200`.
- Manual `/ready` readback returned `{"status":"ready","service":"api"}`.
- Web build-info returned SHA `c357d957741f56835f27a1fc3a948dad43a91036`, ref
  `main`, metadata source `env-runtime`.
- Protected deploy smoke with fresh-login production audit auth passed,
  including API `/workers/ready -> 200`.
- Rollback guard passed with `shouldRollback=false`, runtime freshness `PASS`,
  worker/market heartbeat age `4194 ms`, runtime signal lag `0 ms`, and `5`
  running sessions.
- Evidence packet:
  `history/evidence/luc-6920-api-ready-production-runtime-restoration-2026-07-02.md`.

Files changed:

- `docs/status/runtime-error-index.json`
- `docs/status/runtime-error-index.md`
- `docs/status/operational-readiness-index.json`
- `docs/status/operational-readiness-index.md`
- `docs/status/project-truth-index.json`
- `docs/status/project-truth-index.md`
- `history/evidence/luc-6920-api-ready-production-runtime-restoration-2026-07-02.md`
- `history/tasks/luc-6920-api-ready-production-runtime-restoration-2026-07-02-task.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

Source control:

- Repo: `C:\Personal\Projekty\Aplikacje\Soar`
- Branch: `main`
- Local HEAD: `6aeb8b8b`
- Relation: `HEAD...origin/main` was `22` ahead and `3` behind.
- Worktree was already dirty before this heartbeat.
- Commit/push: not attempted.
- Deploy impact: none.

Residual risk:

- Web build-info still reports `metadataSource=env-runtime`; release-grade build
  provenance remains a separate gate.
- Host-level VPS pressure/log-window proof was not run.
- Shared checkout remains dirty/divergent from pre-existing work.

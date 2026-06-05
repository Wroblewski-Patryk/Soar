# LUC-2302 Task Contract - Select Next soar-web Recovery Path After Rollback Failed Closed

## Header

- ID: LUC-2302
- Title: Select next `soar-web` recovery path after rollback failed closed
- Task Type: release
- Current Stage: planning / release decision
- Status: DONE
- Owner: CTO Architect
- Depends on: [LUC-2293](/LUC/issues/LUC-2293)
- Priority: P0
- Operation Mode: ARCHITECT
- Mission ID: Soar V1 audit-to-completion loop
- Mission Status: CHECKPOINTED

## Context

[LUC-2293](/LUC/issues/LUC-2293) executed the single permitted rollback or
redeploy of `Soar / production / soar-web` to
`b894e5dd30614dfd2035e91e3d848c842d3ff380`. The action failed closed:
public Web stayed unavailable, `/api/build-info` never exposed the rollback
SHA, and public API `/health` plus `/ready` stayed healthy.

## Goal

Choose the next exact recovery path and convert it into a worker-ready Ops
permit without authorizing an implicit production mutation.

## Scope

- Paperclip issue: [LUC-2302](/LUC/issues/LUC-2302).
- Production target: `Soar / production / soar-web`.
- Architecture/runtime surfaces reviewed:
  - `docs/operations/service-topology.md`
  - `docs/operations/coolify-vps-deployment-contract.md`
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `history/evidence/luc-2293-controlled-soar-web-rollback-2026-06-05.md`
  - `history/evidence/luc-2293-soar-web-rollback-to-previous-candidate-2026-06-05.md`
  - `history/evidence/luc-2286-soar-web-redeploy-failed-closed-2026-06-05.md`

## Decision

Selected path: redacted container/runtime crash investigation for
`Soar / production / soar-web`.

Rationale:

- Restart, branch-head redeploy, and previous-source rollback have all failed
  closed.
- API stays healthy, so the outage is isolated to Web or its immediate runtime
  and routing path.
- Public Web never exposes `/api/build-info`, so another source/image action is
  not yet evidence-backed.
- Prior evidence shows `soar-web` entering `restarting:unknown` and a crash
  restart signal. The next useful fact is the redacted runtime crash class and
  proxy/container reachability state, not another deploy mutation.

Rejected for now:

- Another source/image action: no evidence that the selected source is the
  limiting variable.
- Direct proxy/runtime repair mutation: proxy repair needs a read-only
  classification first to avoid mutating the wrong layer.
- Host-level queue repair as the first next step: visible deploy queue paths
  have already been cleared or exhausted; current symptoms point to runtime
  crash or routing after deploy acceptance.

## Definition of Done

- [x] One next path is selected with rationale.
- [x] Fresh read-only public smoke is recorded.
- [x] Worker-ready Ops child issue [LUC-2305](/LUC/issues/LUC-2305) is
  created.
- [x] No production mutation is performed by CTO.
- [x] Parent rollback issue remains blocked by [LUC-2305](/LUC/issues/LUC-2305).

## Forbidden

- No deploy, restart, rollback, force-start, env edit, database action,
  team/account change, protected smoke, exchange action, or live-trading action
  under this CTO decision task.
- Do not print or persist secrets, tokens, cookies, raw resource ids, raw
  deployment ids, generated database suffixes, generated app/container names,
  host paths, internal IPs, raw logs, account data, or exchange credentials.

## Validation Evidence

- `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha b894e5dd30614dfd2035e91e3d848c842d3ff380 --no-workers`
  - Result: failed only Web checks.
  - API `/health`: `200`.
  - API `/ready`: `200`.
  - Web `/`: `503`.
  - Web `/api/build-info`: `503`; expected SHA not observable.
- `pnpm run ops:coolify-stack:env-check:test`
  - Result: pass, `8/8`.

## Result Report

- Task summary: selected redacted container/runtime crash investigation as the
  next recovery path.
- Files changed:
  - `history/tasks/luc-2302-select-next-soar-web-recovery-path-after-rollback-failed-closed-2026-06-05-task.md`
  - `history/evidence/luc-2302-soar-web-next-recovery-decision-2026-06-05.md`
  - `.agents/state/system-health.md`
  - `.agents/state/active-mission.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: read-only public smoke and focused Coolify stack env test.
- What is incomplete: production Web is still degraded; Ops must execute the
  [LUC-2305](/LUC/issues/LUC-2305) diagnostic permit.
- Next steps: Ops Release Lead owns [LUC-2305](/LUC/issues/LUC-2305) for
  redacted container/runtime crash investigation.
- Decisions made: do not authorize another source/image action until crash or
  routing class is known.

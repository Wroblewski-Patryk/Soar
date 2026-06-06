# LUC-2341 Source Control Closure Post-Aggregate-Proof Dirty State

## Header
- ID: LUC-2341
- Title: Classify post-aggregate-proof dirty state
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: 11 SPM / Source Control Closure
- Depends on: [LUC-2351](/LUC/issues/LUC-2351)
- Priority: P0
- Mission ID: LUC-2341-SOURCE-CONTROL-CLOSURE-2026-06-06
- Mission Status: VERIFIED

## Context

[LUC-2341](/LUC/issues/LUC-2341) owns source-control closure after the
aggregate proof and repair wave. The closure was previously blocked because
the exact aggregate e2e rerun failed after [LUC-2342](/LUC/issues/LUC-2342).
[LUC-2351](/LUC/issues/LUC-2351) then repaired the source-closure rerun
failure.

## Goal

Classify the current dirty set, run the smallest meaningful validation for the
Backend aggregate repair and state/evidence files, and preserve coherent local
work in a commit without pushing or deploying.

## Scope

- Backend aggregate code/test changes:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Project state/context/evidence files already modified by the aggregate repair
  and gap-refresh lanes.
- Source-control disposition only; no production mutation.

## Constraints

- No push unless explicitly authorized.
- No deploy, restart, rollback, protected production smoke, account, exchange,
  secret, credential, database mutation, or live-trading action.
- Do not revert or overwrite active work from other agents.

## Definition Of Done

- [x] Dirty paths classified by lane/owner.
- [x] Exact Backend aggregate e2e proof passes.
- [x] API typecheck passes.
- [x] Diff and redaction checks pass.
- [x] Coherent dirty set committed locally.
- [x] Push/deploy impact recorded.

## Validation Evidence

- PASS `pnpm --filter api exec vitest run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --testTimeout=30000`
  - `19` tests passed.
  - Command duration: `101.78s`.
- PASS `pnpm --filter api run typecheck`.
- PASS `git diff --check` with line-ending warnings only.
- PASS dirty-file secret/redaction scan: no secret-pattern matches.

## Dirty Set Classification

| Lane | Paths | Disposition |
| --- | --- | --- |
| Backend API | `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`, `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts` | Include in local source closure commit after aggregate proof passed. |
| State / project control | `.agents/state/*`, `.codex/context/*` | Include as source-of-truth updates from the repair and gap-refresh lanes. |
| Task evidence | `history/tasks/luc-2342-*`, `history/tasks/luc-2351-*`, `history/tasks/luc-2354-*`, this file | Include as durable task evidence for closed lanes. |

## Result Report

- Task summary: source-control closure validated the aggregate repair wave and
  packaged the coherent dirty set locally.
- Commit disposition: committed locally, not pushed.
- Deploy impact: none.
- Production actions: none.
- Residual risk: production promotion, protected runtime smoke, worker
  readiness, and SLO/RC proof remain separate release gates.

# LUC-1944 Assistant Dry-Run Boundary And Schema Drift

## Header
- ID: LUC-1944
- Title: [Soar][AI Runtime] Close assistant dry-run boundary and schema drift from security review
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: AI Agent Runtime Engineer
- Priority: P1
- Mission ID: LUC-1944-ASSISTANT-DRY-RUN-BOUNDARY-SCHEMA-DRIFT-2026-06-04
- Mission Status: PARTIALLY_VERIFIED

## Context
The scoped Paperclip wake assigned `LUC-1944` with no new comments and
`fallbackFetchNeeded=false`. The security-review issue required four closures:
the dry-run route must keep rejecting `LIVE`, disabled-main dry-run must not
orchestrate enabled subagent slots, subagent roles must be allowlisted, and
model profiles must be allowlisted before any runtime/model behavior can use
them.

Pre-existing dirty workspace state from neighboring graph/Ops/rate-limit issues
was present and left intact.

## Goal
Close the assistant dry-run boundary so the implemented route and Web client
cannot treat `LIVE` as a valid dry-run mode, disabled-main dry-run cannot run
subagent orchestration, and role/profile schema drift is rejected at the API
boundary.

## Scope
- `apps/api/src/modules/bots/bots.types.ts`
- `apps/api/src/modules/bots/botAssistant.service.ts`
- `apps/api/src/modules/bots/botAssistant.service.test.ts`
- `apps/api/src/modules/bots/bots.types.test.ts`
- `apps/api/src/modules/engine/assistantOrchestrator.parity.test.ts`
- `apps/web/src/features/bots/components/BotsAssistantTab.tsx`
- `apps/web/src/features/bots/hooks/useBotsAssistantController.ts`
- `apps/web/src/features/bots/services/bots.service.ts`
- `apps/web/src/features/bots/types/bot.type.ts`

## Implementation Plan
1. Extract `AssistantDryRunModeSchema` as the single API dry-run mode contract.
2. Re-parse dry-run service input through that schema before orchestration.
3. Add canonical assistant role and approved model-profile schemas.
4. Suppress subagent slots at the service handoff when `mainAgentEnabled=false`.
5. Remove `LIVE` from the Web dry-run client payload type and replace
   free-text role/profile controls with allowlist selects.
6. Add a no-DB schema regression for accepted `BACKTEST | PAPER`, default
   `PAPER`, and rejected `LIVE`.
7. Add a no-DB service regression for disabled-main subagent suppression.
8. Update orchestrator parity regression to prove `BACKTEST` and `PAPER`
   remain deterministic while default `LIVE` hot-path stays fail-closed.

## Acceptance Criteria
- API dry-run schema accepts `BACKTEST` and `PAPER` only.
- Internal dry-run service calls cannot pass `LIVE` through unchecked.
- Disabled-main dry-run suppresses enabled subagent rows before orchestration.
- Invalid subagent role/model profile is rejected by the API schema.
- Web dry-run client cannot type a `LIVE` payload.
- Web assistant controls expose role/profile allowlists instead of arbitrary
  free-text entry.
- `LIVE` orchestrator input remains fail-closed by default rather than being
  treated as an active assistant decision path.
- Evidence records any broader validation blockers honestly.

## Validation Evidence
- PASS: `pnpm --filter api exec vitest run src/modules/bots/bots.types.test.ts src/modules/bots/botAssistant.service.test.ts src/modules/engine/assistantOrchestrator.parity.test.ts src/modules/engine/assistantOrchestrator.protocol.test.ts`
  - `4` files / `8` tests passed.
- PASS: `pnpm --filter web run typecheck`.
- BLOCKED_UNRELATED: `pnpm --filter api run typecheck` failed on pre-existing
  unrelated test typing errors:
  - `src/modules/positions/positions.orphan-repair.contract.e2e.test.ts`
    missing fields on `ExternalTakeoverRebindResponse` mock.
  - `src/router/workers-health-readiness.test.ts` Prisma `user.findUnique`
    mock type mismatch.
- BLOCKED_ENV: focused route e2e
  `pnpm --filter api exec vitest run src/modules/bots/bots.orchestration.e2e.test.ts -t "returns explainable assistant dry-run trace including NO_TRADE output"`
  failed before assertions because local PostgreSQL at `localhost:5432` is not
  reachable.
- Cleanup: no listener remained on local port `3001` after the failed e2e; no
  Node process was killed because the visible Node processes were pre-existing
  or not uniquely attributable to this task.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/assistant-runtime-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, Web client payload type still allowed `LIVE`, API
  role/profile schemas were too broad, and disabled-main dry-run relied on
  enabled subagent rows instead of suppressing orchestration.
- Decision required from user: no.
- Follow-up architecture doc updates: none to the contract text; new test-file
  graph registry coverage is tracked separately by `LUC-1948`.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: yes.
- Security scope covered in this slice: fail-closed dry-run mode validation,
  no unauthorized `LIVE` dry-run mode, disabled-main subagent suppression,
  role/profile allowlists, deterministic protocol scenarios retained.
- Data leakage/tool abuse risk: no new external tool, exchange adapter, order,
  wallet, credential, or execution command path added.
- Result: partially verified locally; DB-backed route proof remains blocked by
  local database availability.

## Deployment / Ops Evidence
- Deploy impact: low, code/test/type contract only.
- Env or secret changes: none.
- Health-check impact: none.
- Rollback note: revert the scoped code/test changes.
- Staged rollout or feature flag: existing `ASSISTANT_HOTPATH_LIVE_ENABLED`
  behavior remains unchanged for deferred hot-path orchestration.

## Result Report
- Task summary: tightened assistant dry-run mode, disabled-main orchestration,
  role allowlist, and model-profile allowlist contracts across API schema,
  service boundary, Web client typing/UI controls, and focused regressions.
- Files changed: listed in Scope.
- What is incomplete: DB-backed route e2e and full API typecheck were not clean
  in this runner for the blockers listed above.
- Next steps: let `LUC-1948` map the new schema test into the architecture graph
  registry; rerun DB-backed assistant route e2e when local PostgreSQL is
  available.
- Production mutation: none.

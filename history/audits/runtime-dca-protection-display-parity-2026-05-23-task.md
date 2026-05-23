# Runtime DCA Protection Display Parity - 2026-05-23

## Header
- ID: RUNTIME-DCA-PROTECTION-DISPLAY-PARITY-2026-05-23
- Title: Keep dashboard TSL/TTP display aligned with DCA protection state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder + Coordinator
- Depends on: `RUNTIME-ARCHITECTURE-DCA-TP-PARITY-2026-05-22`
- Priority: P0
- Module Confidence Rows: `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, `SOAR-POSITIONS-001`, `SOAR-DASHBOARD-001`
- Requirement Rows: runtime DCA-first close gating, fill authority for LIVE DCA state
- Quality Scenario Rows: live-trading safety, operator-visible runtime truth
- Risk Rows: misleading protection read models, false DCA progress state
- Iteration: 2026-05-23 runtime safety follow-up
- Operation Mode: BUILDER
- Mission ID: `REPO-SOT-FUNCTION-PARITY-2026-05-23`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the selected runtime safety fix.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` and mission state were reviewed through the active mission packet.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: fix the operator-reported Positions table drift where TSL appeared while loss-side DCA levels were still pending.
- Release objective advanced: restore dashboard truth for DCA-first close protection.
- Included slices: API read-model protection gating, DCA exchange-fill runtime state persistence, focused regressions.
- Explicit exclusions: no production LIVE mutation, no strategy setting changes, no UI redesign.
- Checkpoint cadence: local regression proof before commit/push/deploy.
- Stop conditions: failing runtime safety tests or architecture mismatch.
- Handoff expectation: dashboard should not expose TSL/TTP protection as active until the relevant side of the DCA ladder is satisfied.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, active mission, module confidence | Integration, state docs | Task evidence and final acceptance | Parent validation gate | COMPLETE |
| Architecture | Coordinator | `docs/architecture/reference/live-protection-state-parity-contract.md`, runtime DCA parity task | DCA-first close/display semantics | Confirmed no architecture change needed | Code/test evidence | COMPLETE |
| Implementation | Backend Builder | Runtime read services and exchange fill handling | API read-model and runtime state | Protection display gates and exact DCA indices | Focused API tests | COMPLETE |
| QA/Test | Coordinator | Quality gates | API regressions | Regression pass/fail evidence | Vitest + typecheck | COMPLETE |
| Documentation/Memory | Coordinator | Project state and task board | Source-of-truth note | Durable evidence | This task file | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed by reading current mission state.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.

## Context
The operator reported a Binance bot dashboard inconsistency: a strategy with
three DCA levels showed TSL after DCA count `2`, and `SOLUSDT` showed TSL while
the table still showed DCA count `0`. Runtime execution had earlier been
hardened so SL/TSL closes are gated by remaining loss-side DCA, but the
Positions API read-model still serialized dynamic TSL/TTP display from runtime
state or strategy fallback without applying the same side-aware DCA gate.

## Goal
Make the dashboard-visible dynamic protection fields match the runtime
contract:
- TP/TTP display is allowed only when no profit-side DCA level remains pending.
- SL/TSL display is allowed only when no loss-side DCA level remains pending.
- LIVE exchange DCA fill synchronization preserves exact executed DCA level
  indices in runtime state when the dedupe fingerprint contains a DCA level.

## Success Signal
- User or operator problem: Positions table no longer shows TSL as active for `DCA=2/3` or `DCA=0` when loss-side DCA is still pending.
- Expected product or reliability outcome: dashboard and backend protection state tell the same story.
- How success will be observed: API tests prove display suppression and DCA fill state persistence.
- Post-launch learning needed: yes, verify production dashboard after deploy against the user's real open positions.

## Deliverable For This Stage
A verified local fix with focused regression tests and source-of-truth updates.

## Constraints
- use existing runtime position serialization and read-model systems
- do not introduce a new protection subsystem
- do not change live strategy settings or execute live orders
- do not hide DCA count truth; only suppress protection fields that are not eligible yet

## Definition of Done
- [x] DCA side-aware protection gates are applied before serializing dynamic TTP/TSL.
- [x] Exchange-confirmed DCA fill state persists `executedDcaLevelIndices`.
- [x] Focused API regressions and API typecheck pass.
- [x] Source-of-truth state records the fix and remaining production verification need.

## Forbidden
- temporary dashboard-only masking
- treating submitted DCA as executed
- live exchange mutation without explicit approval
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/bots/runtimePositionSerialization.service.test.ts src/modules/bots/runtimeSessionPositionsRead.service.test.ts --run` => PASS, `32/32`.
  - First DB-backed exchange-event test run failed because Postgres was unavailable at `localhost:5432`.
  - `pnpm run go-live:infra:up` started repo Postgres/Redis.
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run` => PASS, `19/19`.
  - `pnpm --filter api exec vitest run src/modules/engine/positionManagement.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` => PASS, `62/62`.
  - `pnpm --filter api run typecheck` => PASS.
- Manual checks: screenshot symptoms mapped to read-model gating: BNB `DCA=2` with 3 planned loss-side DCA levels remains ineligible for TSL display; SOL `DCA=0` remains ineligible for TSL display while loss-side DCA remains pending.
- High-risk checks: no production LIVE mutation was performed.
- Module confidence ledger updated: yes.
- Reality status: verified locally.

## Architecture Evidence
- Architecture source reviewed: DCA-first runtime parity state and live protection parity contracts.
- Fits approved architecture: yes.
- Mismatch discovered: implementation/read-model drift only.
- Decision required from user: no.
- Follow-up architecture doc updates: not required; code now follows existing contract.

## UX/UI Evidence
- Design source type: not applicable.
- Existing shared pattern reused: existing Positions table data contract.
- Required states: existing table states unchanged.
- Responsive checks: not changed.
- Accessibility checks: not changed.
- Parity evidence: frontend consumes API `dynamicTslStopLoss`/`dynamicTtpStopLoss`; API now suppresses ineligible dynamic protection fields before Web derivation.

## Deployment / Ops Evidence
- Deploy impact: medium, runtime safety/display correctness.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert this commit to restore previous display behavior if a production regression appears.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not used.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: dynamic TSL/TTP display could be shown before the side-aware DCA gate was satisfied.
- Gap: exchange fill sync updated `currentAdds` but did not persist exact executed DCA indices.
- Architecture constraints: DCA progress must be fill-authoritative; TP/TTP gates profit-side DCA, SL/TSL gates loss-side DCA.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: active mission, runtime read service, serialization service, exchange events service, runtime state store, focused tests.
- Blocking unknowns: none for local fix.
- Why it was safe to continue: user reported a concrete runtime safety/display defect and approved ongoing architecture parity work.

### 2. Select One Priority Mission Objective
- Selected task: repair dashboard-visible DCA protection parity.
- Priority rationale: live-trading safety and operator trust.
- Why other candidates were deferred: production verification follows after commit/deploy.

### 3. Plan Implementation
- Files or surfaces to modify: runtime position serialization/read service, exchange fill sync, focused tests, source-of-truth docs.
- Logic: compute pending DCA per side from planned levels and executed count; pass display gates into dynamic stop serialization.
- Edge cases: no planned DCA levels, mixed profit/loss DCA levels, stale runtime TSL/TTP state while DCA is still pending, exchange fill replay from dedupe fingerprint.

### 4. Execute Implementation
- Implementation notes: reused existing serialization path and runtime DCA count helper. Added exact DCA level index persistence from dedupe fingerprint without changing order lifecycle authority.

### 5. Verify and Test
- Validation performed: focused API regression packs and API typecheck.
- Result: pass after starting local repo Postgres/Redis for DB-backed exchange-event tests.

### 6. Self-Review
- Simpler option considered: hiding TSL only in frontend. Rejected because backend API truth would remain misleading.
- Technical debt introduced: no.
- Scalability assessment: side-aware helper is small and derived from already-returned DCA plan/count data.
- Refinements made: persisted `executedDcaLevelIndices` on exchange-confirmed DCA fill to make future runtime state less ambiguous.

### 7. Update Documentation and Knowledge
- Docs updated: this task file plus project state/task board/module confidence note.
- Context updated: yes.
- Learning journal updated: not applicable; unavailable Postgres is already a known local-infra pattern and was handled with `go-live:infra:up`.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

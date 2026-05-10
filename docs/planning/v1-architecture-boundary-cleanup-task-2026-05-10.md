# Task

## Header
- ID: V1-ARCH-BOUNDARY-CLEANUP-2026-05-10
- Title: Close V1 architecture audit exchange-boundary drift
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder
- Depends on: V1-ARCH-FUNCTION-AUDIT-2026-05-10
- Priority: P1
- Iteration: 2026-05-10
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The 2026-05-10 architecture function audit found one implementation boundary
mismatch and two documentation drifts. The implementation mismatch was direct
CCXT client construction inside the profile API-key probe module instead of
behind `modules/exchange`.

## Goal
Resolve the audit findings without creating an architecture exception: keep
profile as API-key form/probe orchestration owner and move exchange SDK client
construction behind the exchange module.

## Scope
- `apps/api/src/modules/exchange/exchangeApiKeyProbeClient.service.ts`
- `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts`
- `docs/architecture/04_runtime-contexts.md`
- `docs/modules/api-exchange.md`
- `docs/operations/v1-architecture-function-audit-2026-05-10.md`
- `.agents/state/*`
- `.codex/context/*`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add an exchange-owned API-key probe client factory.
2. Rewire the profile API-key probe service to consume that exchange boundary.
3. Preserve existing probe behavior, error mapping, and tests.
4. Refresh Gate.io-era architecture/module docs.
5. Record the audit findings as resolved in source-of-truth context.
6. Run focused tests, API typecheck, architecture boundary grep, guardrails,
   docs parity, and diff check.

## Acceptance Criteria
- `profile/apiKey` no longer dynamically imports or constructs `ccxt` clients.
- CCXT construction for API-key probing lives under `modules/exchange`.
- Gate.io is present in the runtime context example.
- The exchange module doc describes current Binance and Gate.io per-operation
  ownership instead of stale Binance-only framing.
- Focused probe tests and API typecheck pass.
- Repository guardrails, docs parity, and diff check pass.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this focused boundary fix.
- [x] The exchange SDK boundary mismatch from `ARCH-AUDIT-01` is closed.
- [x] Docs drift from `ARCH-AUDIT-02` and `ARCH-AUDIT-03` is closed.
- [x] Validation evidence is recorded.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `apps/api`: `.\node_modules\.bin\vitest.CMD run src/modules/profile/apiKey/exchangeApiKeyProbe.service.test.ts` => PASS, 6 tests.
  - `apps/api`: `.\node_modules\.bin\tsc.CMD --noEmit` => PASS.
- Manual checks:
  - Direct dynamic `import('ccxt')` outside `modules/exchange`: no matches.
  - Direct `from 'ccxt'` imports outside `modules/exchange`: no matches.
  - Stale Gate.io docs phrases in touched docs: no matches.
- Screenshots/logs: not applicable.
- High-risk checks:
  - The change does not run live-money actions.
  - The profile service still maps probe failures through the existing
    fail-closed error path.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/09_integrations-deployment-and-runtime-services.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/modules/api-exchange.md`
  - `docs/operations/v1-architecture-function-audit-2026-05-10.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, in the predecessor audit; resolved here.
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/modules/api-exchange.md`

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the commit to restore previous probe factory location.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: API-key probe client construction violated the exchange boundary.
- Gaps: Gate.io-era docs drift remained after exchange implementation work.
- Inconsistencies: module docs still described Binance-centered ownership.
- Architecture constraints: exchange SDK/client construction belongs behind
  `modules/exchange`.

### 2. Select One Priority Task
- Selected task: close `ARCH-AUDIT-01` plus directly related docs drift.
- Priority rationale: this was the only implementation mismatch found by the
  architecture function audit.
- Why other candidates were deferred: protected V1 proof lanes require
  operator credentials or formal approvals and are separate from this local
  architecture cleanup.

### 3. Plan Implementation
- Files or surfaces to modify: exchange probe factory, profile probe service,
  architecture/module docs, and source-of-truth state.
- Logic: move CCXT bootstrap to exchange-owned factory and keep profile as
  orchestration consumer.
- Edge cases: Gate.io futures keeps `defaultType=swap`; other futures keep
  `defaultType=future`; spot keeps `defaultType=spot`.

### 4. Execute Implementation
- Implementation notes: added an exchange-owned client factory and re-exported
  stable helpers from the profile service to keep existing tests/imports stable.

### 5. Verify and Test
- Validation performed: focused probe tests, API typecheck, boundary grep,
  docs stale-phrase grep, guardrails, docs parity, and diff check.
- Result: PASS after local pnpm/Corepack fallback to package-local binaries.

### 6. Self-Review
- Simpler option considered: documenting an exception.
- Technical debt introduced: no
- Scalability assessment: new exchanges can now extend the probe factory inside
  exchange ownership instead of profile ownership.
- Refinements made: Gate.io `FUTURES` default type remains `swap`, matching
  existing Gate.io adapter semantics.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/modules/api-exchange.md`
  - `docs/operations/v1-architecture-function-audit-2026-05-10.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/current-focus.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `docs/planning/mvp-next-commits.md`
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
This task closes the architecture-cleanliness gap from the audit. It does not
close V1 release blockers that depend on protected production evidence:
`LIVEIMPORT-03`, rollback proof PASS, authenticated/admin UI clickthrough,
authenticated Gate 2 SLO, RC approval/sign-off/checklist, and final non-dry-run
release gate.

## Production-Grade Required Contract
- Goal: close the exchange-boundary mismatch found by the V1 architecture audit.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: satisfied with focused tests and source-of-truth updates.
- Result Report: listed below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, the existing profile API-key probe service.
- Endpoint and client contract match: yes
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: existing service tests cover failure mapping.
- Refresh/restart behavior verified: API typecheck and focused service tests.
- Regression check performed: focused probe suite.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: developers/operators relying on adapter-based
  exchange isolation.
- Existing workaround or pain: direct CCXT bootstrap in profile created a hidden
  second exchange SDK ownership point.
- Smallest useful slice: move only probe client construction behind exchange.
- Success metric or signal: boundary grep and tests pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: yes
- Feedback item IDs: user requested architecture-aligned, adapter-based exchange
  implementation.
- Feedback accepted: yes
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: protected production proof remains blocked
  until credentials/approvals exist.
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: not applicable
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: profile API-key connection test for exchange
  credentials.
- SLI: probe request succeeds/fails through the exchange-owned client factory.
- SLO: not separately defined for this internal boundary cleanup.
- Error budget posture: not applicable
- Health/readiness check: API typecheck and focused probe tests.
- Logs, dashboard, or alert route: existing audit/error mapping preserved.
- Smoke command or manual smoke: focused service test.
- Rollback or disable path: revert the commit.

## AI Testing Evidence
Not applicable. This task does not change AI behavior.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: API keys/secrets are sensitive.
- Trust boundaries: profile accepts user-owned credentials; exchange module owns
  external exchange client bootstrap.
- Permission or ownership checks: existing profile API-key ownership flow
  unchanged.
- Abuse cases: invalid credentials, unsupported exchange IDs, and probe failure
  continue to fail closed.
- Secret handling: no secrets are logged or committed.
- Security tests or scans: focused service tests and boundary grep.
- Fail-closed behavior: preserved through existing probe error mapping.
- Residual risk: production exchange behavior still needs protected evidence
  before final V1 GO.

## Result Report
- Task summary: moved profile API-key probe CCXT bootstrap into an
  exchange-owned factory and refreshed Gate.io architecture/module docs.
- Files changed:
  - `apps/api/src/modules/exchange/exchangeApiKeyProbeClient.service.ts`
  - `apps/api/src/modules/profile/apiKey/exchangeApiKeyProbe.service.ts`
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/modules/api-exchange.md`
  - `docs/operations/v1-architecture-function-audit-2026-05-10.md`
  - source-of-truth state files
- How tested: focused probe tests, API typecheck, boundary grep, guardrails,
  docs parity, and diff check.
- What is incomplete: protected production V1 evidence and formal approvals.
- Next steps: continue final blocker execution pack when protected inputs are
  available.
- Decisions made: no architecture exception was introduced.

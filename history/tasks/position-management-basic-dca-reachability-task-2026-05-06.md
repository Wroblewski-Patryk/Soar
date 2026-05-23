# Task

## Header
- ID: PMPLC-03
- Title: Block unreachable DCA levels in basic TP/SL mode
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend Builder / Frontend Builder
- Depends on: `PMPLC-01`
- Priority: P1
- Iteration: 2026-05-06 strategy validation slice
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this implementation iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The canonical PnL lifecycle contract requires `basic` close mode to warn or
block DCA levels that cannot execute before hard `TP` or `SL` closes the
position. Existing strategy validation only guarded trailing threshold shape.

## Goal
Prevent users from saving a strategy where basic `TP/SL` makes configured DCA
levels unreachable.

## Scope
- `apps/api/src/modules/strategies/strategyConfigValidation.ts`
- `apps/api/src/modules/strategies/strategyConfigValidation.test.ts`
- `apps/web/src/features/strategies/utils/strategyCloseValidation.ts`
- `apps/web/src/features/strategies/utils/strategyCloseValidation.test.ts`
- `apps/web/src/features/strategies/components/StrategyForm.tsx`
- `apps/web/src/features/strategies/components/StrategyForm.test.tsx`
- `apps/web/src/i18n/namespaces/dashboard-strategies.en.ts`
- `apps/web/src/i18n/namespaces/dashboard-strategies.pl.ts`
- `apps/web/src/i18n/namespaces/dashboard-strategies.pt.ts`
- `apps/web/src/i18n/namespaces/dashboard-strategies.de-CH.ts`
- `history/artifacts/_artifacts-l10nq-d-coverage-audit-latest.json`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: the app must not present DCA levels as executable
  when basic hard close settings make them impossible.
- Expected product or reliability outcome: invalid money-impacting strategy
  configuration is blocked before bots or backtests consume it.
- How success will be observed: API and web tests reject positive DCA above
  basic TP and negative DCA below basic SL.
- Post-launch learning needed: no.

## Deliverable For This Stage
API fail-closed validation, web form validation, focused tests, i18n copy, and
source-of-truth synchronization.

## Constraints
- reuse existing strategy validation mechanisms
- do not add a new strategy schema
- do not change advanced `TTP/TSL` semantics
- keep repository artifacts in English

## Implementation Plan
1. Extend API strategy config validation for basic TP/SL DCA reachability.
2. Add focused API unit coverage for reachable, positive-unreachable,
   negative-unreachable, repeated-basic, and advanced-close cases.
3. Extend the existing web close-validation helper with the same rule.
4. Wire the web form validation summary to block submit before API call.
5. Add localized validation copy.
6. Run focused tests, typechecks, lint, guardrails, i18n audit, and diff review.

## Acceptance Criteria
- Basic mode rejects positive DCA levels greater than `TP`.
- Basic mode rejects negative DCA levels below `-SL`.
- Basic repeated DCA uses the repeated trigger for reachability checks.
- Advanced close mode is not constrained by basic TP/SL reachability rules.
- Web form blocks invalid submit with localized validation summary.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed for applicable runtime/config rules.
- [x] API validation and focused tests passing.
- [x] Web validation and focused tests passing.
- [x] API and web typecheck passing.
- [x] Repository guardrails, lint, and route-reachable i18n audit passing.
- [x] Planning/context files updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- silently accepting unreachable DCA levels in basic close mode
- changing advanced close authority
- relying only on UI validation without API enforcement
- adding a temporary bypass for imports

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/strategies/strategyConfigValidation.test.ts --run` PASS (`5/5`).
- Tests: `pnpm --filter web exec vitest run src/features/strategies/utils/strategyCloseValidation.test.ts src/features/strategies/components/StrategyForm.test.tsx --run` PASS (`12/12`).
- Typecheck: `pnpm --filter api run typecheck` PASS.
- Typecheck: `pnpm --filter web run typecheck` PASS.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Lint: `pnpm run lint` PASS.
- I18n audit: `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`).
- Manual checks: diff review PASS.
- High-risk checks: invalid imported strategy configs also pass through the API
  validator and are blocked.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, strategy validation lacked basic-mode DCA
  reachability enforcement.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: existing dashboard strategy form system.
- Design source reference: `docs/ux/dashboard-design-system.md`.
- Existing shared pattern reused: `FormValidationSummary`.
- New shared pattern introduced: no.
- Required states: validation error.
- Responsive checks: not applicable for logic-only form validation copy.
- Accessibility checks: validation summary remains `role="alert"` through the
  shared form component.
- Parity evidence: API and web enforce the same reachability rule.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the validation and docs changes.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: basic TP/SL strategy configs could still save unreachable DCA levels.
- Gaps: no API or web regression for the PMPLC reachability rule.
- Inconsistencies: architecture required warning/blocking, implementation did
  neither.
- Architecture constraints: API must be fail-closed; web validation improves
  operator feedback but cannot be the only guard.

### 2. Select One Priority Task
- Selected task: block unreachable DCA levels in basic TP/SL mode.
- Priority rationale: money-impacting invalid strategy config can propagate to
  runtime/backtest if not blocked.
- Why other candidates were deferred: live venue protection reshaping is a
  larger runtime slice.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: derive DCA level percents from basic or advanced DCA config, then
  compare positive levels to `TP` and negative levels to `-SL` only in basic
  close mode.
- Edge cases: disabled DCA, advanced close mode, repeated basic DCA, and import
  path validation.

### 4. Execute Implementation
- Implementation notes: extended existing validators instead of creating a new
  validation system.

### 5. Verify and Test
- Validation performed: focused API/web tests, typechecks, lint, guardrails,
  i18n audit, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: web-only warning.
- Technical debt introduced: no.
- Scalability assessment: validator helper can be reused for future strategy
  configuration guards.
- Refinements made: kept advanced close mode outside this basic-only rule.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence plus planning/context source-of-truth files.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to task nature.
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
This task blocks levels strictly beyond the basic hard close threshold. Equal
thresholds remain outside this slice because the existing lifecycle evaluates
DCA before close in the same pass.

## Production-Grade Required Contract
- Goal: recorded above.
- Scope: recorded above.
- Implementation Plan: recorded above.
- Acceptance Criteria: recorded above.
- Definition of Done: recorded above.
- Result Report: recorded below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes, strategy create/update/import validator.
- Endpoint and client contract match: yes, web blocks before submit and API
  remains authoritative.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: validation summary covered.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: focused API and web validation tests.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: bot/backtest operators configuring DCA with hard
  basic TP/SL.
- Existing workaround or pain: users could create logically impossible DCA
  ladders.
- Smallest useful slice: fail-closed strategy validation plus form feedback.
- Success metric or signal: invalid configs are rejected before runtime.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: strategy configuration before bot runtime.
- SLI: not applicable.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: none.
- Smoke command or manual smoke: focused automated tests listed above.
- Rollback or disable path: revert commit.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: strategy config only, no secrets.
- Trust boundaries: user-submitted strategy config.
- Permission or ownership checks: unchanged.
- Abuse cases: malformed import payloads cannot bypass reachability validation.
- Secret handling: none.
- Security tests or scans: not applicable.
- Fail-closed behavior: API rejects invalid configs.
- Residual risk: equal TP/SL and DCA thresholds remain allowed by this slice.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable.
- Memory consistency scenarios: not applicable.
- Multi-step context scenarios: not applicable.
- Adversarial or role-break scenarios: not applicable.
- Prompt injection checks: not applicable.
- Data leakage and unauthorized access checks: not applicable.
- Result: not applicable.

## Result Report
- Task summary: Added API and web validation that blocks unreachable DCA levels
  in basic TP/SL mode.
- Files changed: listed in Scope.
- How tested: focused API/web tests, API/web typecheck, lint, guardrails, i18n
  audit, and diff review.
- What is incomplete: live venue-side TP/SL protection-order reshaping remains
  a separate runtime slice.
- Next steps: audit live exchange protection placement so hard venue orders do
  not contradict DCA-first lifecycle semantics.
- Decisions made: API blocks invalid strategy configs; web mirrors the rule for
  earlier operator feedback.

# Task

## Header
- ID: V1UI-36
- Title: fix(web-i18n): restore de-CH exchange order id parity
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-35
- Priority: P1
- Iteration: 36
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
ARCHITECT-mode review found an i18n structure drift: runtime order surfaces now render backend `exchangeOrderId` on Dashboard Home and Bots Monitoring, and EN/PL/PT namespaces contain the matching labels, but `de-CH` is missing those keys. Full namespace parity tests report missing `dashboard.home.runtime.exchangeOrderId` and `dashboard.bots.monitoring.table.exchangeOrderId`.

## Goal
Restore locale namespace parity for exchange-backed order identifiers so the Web runtime surfaces remain structurally consistent across supported locales.

## Scope
- `apps/web/src/i18n/namespaces/dashboard-home.de-CH.ts`
- `apps/web/src/i18n/namespaces/dashboard-bots.de-CH.ts`
- Planning/context docs for this slice

## Success Signal
- User or operator problem: German-Swiss locale should not miss runtime order labels that exist in other locales.
- Expected product or reliability outcome: namespace parity tests pass for the affected dashboard runtime labels.
- How success will be observed: focused i18n parity tests pass and route-reachable audit remains clean.
- Post-launch learning needed: no

## Deliverable For This Stage
Add the missing `de-CH` labels using existing namespace structure and verify parity.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add `exchangeOrderId` to `dashboard-home.de-CH.ts` next to the matching runtime source/order labels.
2. Add `exchangeOrderId` to `dashboard-bots.de-CH.ts` inside the monitoring table namespace matching EN order.
3. Run focused namespace parity tests and relevant guardrails.
4. Update task board, project state, and MVP queue evidence.

## Acceptance Criteria
- `dashboard.home.runtime.exchangeOrderId` exists in `de-CH`.
- `dashboard.bots.monitoring.table.exchangeOrderId` exists in `de-CH`.
- EN/PL/PT/de-CH translation key parity tests pass.
- No UI behavior, backend behavior, API contract, DB schema, auth, order execution, or trading logic changes.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` applicable items satisfied with evidence.
- [x] Focused i18n parity tests pass.
- [x] Relevant workspace gates pass.
- [x] Planning/context docs are updated.

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
- Tests: PASS `pnpm.cmd --dir apps/web exec vitest run src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts` (`9/9`); PASS `pnpm.cmd i18n:audit:route-reachable:web` (`findings=0`); PASS `pnpm.cmd --filter web run typecheck`; PASS `pnpm.cmd --filter web run lint`; PASS `pnpm.cmd run quality:guardrails`; PASS `git diff --check`; PASS `pnpm.cmd run build`.
- Manual checks: not applicable; label-only namespace parity fix covered by focused i18n tests.
- Screenshots/logs: route-reachable i18n audit output `findings=0`.
- High-risk checks: no money movement, secrets, permissions, live trading, AI, or DB changes in scope

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/08_operator-surfaces-and-routing.md`, `docs/governance/language-policy.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, locale namespace drift for existing runtime order labels
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing runtime order tables
- Canonical visual target: current implementation
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: existing i18n namespace structure
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none in this slice
- Required states: success
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: labels remain textual
- Parity evidence: full translation key parity and namespace registry tests pass.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the two `de-CH` translation key additions
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: full namespace parity reports two missing `de-CH` keys for `exchangeOrderId`.
- Gaps: EN/PL/PT include labels, while `de-CH` does not.
- Inconsistencies: runtime order UI can reference backend exchange order IDs in two dashboard surfaces, but one locale namespace is structurally incomplete.
- Architecture constraints: supported locale namespaces must stay key-parity aligned.

### 2. Select One Priority Task
- Selected task: restore `de-CH` exchange order ID label parity.
- Priority rationale: ARCHITECT-mode structural consistency issue with a tiny, reversible fix.
- Why other candidates were deferred: broader rendered dashboard drift checks continue after the active i18n parity failure is closed.

### 3. Plan Implementation
- Files or surfaces to modify: two `de-CH` namespace files.
- Logic: add literal labels matching existing route-owned namespaces.
- Edge cases: preserve existing key nesting and avoid touching mojibake/legacy translations outside this slice.

### 4. Execute Implementation
- Implementation notes: added `exchangeOrderId: "Exchange-ID"` to Dashboard Home runtime and Bots Monitoring table `de-CH` namespaces.

### 5. Verify and Test
- Validation performed: focused i18n parity tests, route-reachable i18n audit, Web typecheck, Web lint, repository guardrails, whitespace diff check, and full workspace build.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: no-op because route-reachable audit passed, rejected because full parity tests found real namespace drift.
- Technical debt introduced: no
- Scalability assessment: restores existing locale structure without new abstractions.
- Refinements made: route-reachable audit artifact timestamp was not committed because the audit content did not change.

### 7. Update Documentation and Knowledge
- Docs updated: task artifact, MVP queue, task board, and project state.
- Context updated: task board and project state.
- Learning journal updated: not applicable

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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: not applicable
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused i18n parity regression

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: `de-CH` dashboard operator viewing exchange-backed runtime orders
- Existing workaround or pain: fallback or missing locale key risk in the German-Swiss locale
- Smallest useful slice: add the two missing labels
- Success metric or signal: focused i18n parity tests pass
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: localized runtime order inspection
- SLI: i18n namespace parity tests pass
- SLO: not applicable
- Error budget posture: not applicable
- Health/readiness check: build/test gates
- Logs, dashboard, or alert route: test output
- Smoke command or manual smoke: not applicable
- Rollback or disable path: revert the two key additions

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: label-only localization
- Trust boundaries: unchanged
- Permission or ownership checks: unchanged
- Abuse cases: not applicable
- Secret handling: unchanged
- Security tests or scans: not applicable
- Fail-closed behavior: unchanged
- Residual risk: low

## Result Report
The German-Swiss dashboard namespaces now include the missing `exchangeOrderId` labels for Dashboard Home runtime orders and Bots Monitoring open orders. This restores EN/PL/PT/de-CH key parity for the backend-backed exchange order identifier without changing runtime logic, API contracts, DB schema, auth, order execution, or trading behavior.

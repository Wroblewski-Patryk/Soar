# LUC-2645 Dashboard Language Switcher Missing-Test Link

## Header
- ID: LUC-2645
- Title: [Soar][Frontend][LUC-2644] Cover dashboard language switcher missing-test link
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Depends on: LUC-2644
- Priority: P1
- Module Confidence Rows: Web dashboard layout/i18n; Architecture Evidence Graph relation confidence
- Requirement Rows: REQ-DOC-031; REQ-I18N-022
- Quality Scenario Rows: UX/A11y/Mobile
- Risk Rows: RISK-019; RISK-034
- Iteration: 2026-06-07 LUC-2645
- Operation Mode: BUILDER
- Mission ID: LUC-2645-DASHBOARD-LANGUAGE-SWITCHER-MISSING-TEST-LINK-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this direct Frontend repair slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was represented through current AGENTS/project-state startup context.
- [x] `.agents/core/mission-control.md` was represented through active mission refresh.
- [x] Missing or template-like state tables were not encountered for this slice.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by reducing architecture proof ambiguity.

## Mission Block
- Mission objective: cover `apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx#handleSelect` with focused Web proof and scanner-readable relation metadata.
- Release objective advanced: reduce local architecture missing-test ambiguity without changing runtime behavior.
- Included slices: focused `LanguageSwitcher` test assertion, priority test-link row, architecture graph regeneration, guardrail proof, state/evidence updates.
- Explicit exclusions: deploy, push, restart, rollback, production smoke, credentials, accounts, exchange state, database state, live-trading behavior.
- Checkpoint cadence: one heartbeat.
- Stop conditions: focused test or guardrails fail; architecture mismatch found; unrelated dirty work must be modified.
- Handoff expectation: issue can close `done`; only future architecture-awareness refresh can reintroduce work.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | Wake payload; AGENTS.md; active mission | Task closure, source-of-truth updates | Mission packet and final acceptance | Parent validation gate | DONE |
| Implementation | Frontend Web Engineer | `LanguageSwitcher.tsx`; existing test | `LanguageSwitcher.test.tsx` | Dropdown close assertion after language selection | Focused Vitest | DONE |
| Architecture Evidence | Frontend Web Engineer | `priority-test-links.csv`; graph scripts | relation CSV, graph artifacts | Direct `LUC-2645` relation row | graph generate, guardrails | DONE |
| Documentation/Memory | Frontend Web Engineer | task board, project state, ledgers | history/state/context docs | Evidence-backed closure notes | source readback | DONE |

## Context
[LUC-2644](/LUC/issues/LUC-2644) refreshed the architecture-awareness gap register and delegated [LUC-2645](/LUC/issues/LUC-2645) after the report generated `2026-06-07T02:47:58.055Z` listed `apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx#handleSelect` as an actionable missing-test sample. The component already had a focused language switcher test, but the missing function-level behavior and scanner-readable relation needed to be made explicit.

## Goal
Prove the dashboard language switcher selection handler closes the dropdown after changing locale and map that proof directly to `LanguageSwitcher.tsx#handleSelect`.

## Success Signal
- User or operator problem: architecture repair queue no longer has to treat the dashboard language switcher handler as unproven.
- Expected product or reliability outcome: local dashboard i18n switcher behavior remains locked by focused proof.
- How success will be observed: focused Web Vitest passes and `priority-test-links.csv` contains a direct `LUC-2645` relation row.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verified local proof, scanner-readable relation metadata, and source-of-truth closure notes.

## Constraints
- Use existing `I18nProvider` and `LanguageSwitcher` test harness.
- Do not introduce new UI behavior or copy.
- Do not touch production, deploy, credentials, accounts, database, exchange, or live-trading state.
- Preserve unrelated dirty work already present in the workspace.

## Definition of Done
- [x] `LanguageSwitcher.test.tsx` explicitly covers dropdown close after language selection.
- [x] `priority-test-links.csv` maps `LanguageSwitcher.tsx#handleSelect` to the focused test.
- [x] Focused Web test, architecture graph generation, and repository guardrails pass.
- [x] Task/source-of-truth evidence is updated.

## Forbidden
- New systems without approval.
- Duplicated i18n or dropdown logic.
- Temporary bypasses or workaround-only paths.
- Architecture changes beyond direct proof metadata.
- Production/runtime mutation.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/ui/layout/dashboard/LanguageSwitcher.test.tsx` PASS (`1` file / `1` test).
- Manual checks: `rg "LUC-2645|LanguageSwitcher\\.tsx#handleSelect"` readback found the direct relation in `docs/architecture/relations/priority-test-links.csv` and function proof row in `docs/graphs/architecture-proof-register.csv`.
- Screenshots/logs: not applicable; no visual change.
- High-risk checks: no secret, account, database, exchange, deploy, protected smoke, or live-trading mutation.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: Web dashboard layout/i18n; Architecture Evidence Graph relation confidence.
- Requirements matrix updated: not directly; existing `REQ-DOC-031` and `REQ-I18N-022` evidence referenced through state updates.
- Quality scenarios updated: no behavior change.
- Risk register updated: no behavior change.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/architecture/relations/priority-test-links.csv`, `docs/graphs/architecture-proof-register.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: direct priority relation row and regenerated graph artifacts.

## UX/UI Evidence
- Design source type: existing shared component contract.
- Design source reference: `apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx`.
- Canonical visual target: existing dashboard/footer language switcher behavior.
- Fidelity target: structurally_faithful.
- Existing shared pattern reused: `LanguageSwitcher`, `I18nProvider`, `useDetailsDropdown`.
- New shared pattern introduced: no.
- Required states: success.
- Responsive checks: not applicable; no UI layout change.
- Input-mode checks: pointer via Testing Library click.
- Accessibility checks: existing aria-label lookup retained.
- Parity evidence: no rendered visual change.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: none.
- Rollback note: revert the test assertion and `LUC-2645` relation row if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current report listed `LanguageSwitcher.tsx#handleSelect` as a missing-test sample.
- Gaps: existing switcher test did not explicitly assert dropdown close from the handler and lacked a direct `LUC-2645` relation row.
- Inconsistencies: architecture graph already knew the component/test family, but the function-level link was missing.
- Architecture constraints: use direct relation CSV; avoid new architecture mechanisms.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: wake payload, role/shared contracts, active mission, task board, language switcher component/test, relation CSV, architecture report.
- Blocking unknowns: none.
- Why it was safe to continue: scope was single-lane, local-only, and already delegated to Frontend Web.

### 2. Select One Priority Mission Objective
- Selected task: `LUC-2645` dashboard language switcher missing-test link.
- Priority rationale: assigned high-priority Paperclip issue with direct Frontend ownership.
- Why other candidates were deferred: [LUC-2646](/LUC/issues/LUC-2646) belongs to Test Automation.

### 3. Plan Implementation
- Files or surfaces to modify: `LanguageSwitcher.test.tsx`, `priority-test-links.csv`, graph artifacts, state/evidence docs.
- Logic: assert `<details>` opens before selection and closes after selecting PL.
- Edge cases: preserve locale-switch assertions for PL, PT, and de-CH.

### 4. Execute Implementation
- Implementation notes: added two assertions around existing PL selection path and a direct `LUC-2645` relation row.

### 5. Verify and Test
- Validation performed:
  - `pnpm --filter web exec vitest run src/ui/layout/dashboard/LanguageSwitcher.test.tsx`
  - `pnpm run architecture:graph:generate`
  - `pnpm run quality:guardrails`
- Result: all passed.

### 6. Self-Review
- Simpler option considered: relation-only update. Rejected because the handler also has a concrete close behavior worth locking.
- Technical debt introduced: no.
- Scalability assessment: no new abstraction or runtime path.
- Refinements made: kept the existing test file and component untouched.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, active mission, task board, project state, next steps, module confidence ledger.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the task scope.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal update was not required.
- [x] Required responsibility lanes were integrated.

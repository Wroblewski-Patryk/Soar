# LUC-2793 Mobile Traceability V1 Scope Classification

## Header
- ID: LUC-2793
- Title: Classify mobile traceability as inactive V1 scope or create mobile map seed
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Documentation Steward
- Depends on: LUC-2789
- Priority: P2
- Module Confidence Rows: SOAR-MOBILE-001 / mobile scaffold
- Requirement Rows: REQ-DOC-031 / mobile traceability classification
- Risk Rows: RISK-033
- Iteration: 2026-06-07
- Operation Mode: BUILDER
- Mission ID: LUC-2793-MOBILE-TRACEABILITY-V1-SCOPE-CLASSIFICATION-2026-06-07
- Mission Status: VERIFIED

## Context
LUC-2789 identified that `docs/architecture/traceability-matrix.md` still
described mobile traceability as ambiguous beyond acknowledging `apps/mobile`,
while `docs/architecture/codebase-map.md` still called active V1 mobile
traceability `UNVERIFIED / NEEDS CONFIRMATION`.

Existing Soar source truth already states that `apps/mobile` is scaffold-only,
with no production native runtime or independent mobile backend contracts.

## Goal
Make mobile traceability unambiguous for V1 without starting mobile
implementation.

## Scope
- `docs/architecture/traceability-matrix.md`
- `docs/architecture/codebase-map.md`
- `docs/modules/mobile-module-index.md`
- `docs/modules/mobile-bootstrap.md`
- `docs/planning/mobile-parity-contract.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`
- `.agents/state/next-steps.md`
- `.agents/state/active-mission.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`

## Implementation Plan
1. Read current mobile source-of-truth docs and architecture traceability docs.
2. Classify native/mobile as `out_of_scope_for_v1`.
3. Keep the existing documentation seed as scaffold-only, not as active product scope.
4. Update state ledgers and task evidence.
5. Verify with focused readback searches.

## Acceptance Criteria
- Mobile traceability status is no longer ambiguous for V1.
- Closure cites exact docs changed.
- No mobile implementation, deploy, protected smoke, secrets, or runtime mutation occurs.

## Definition of Done
- V1 mobile status is recorded as `out_of_scope_for_v1`.
- Scaffold-only seed docs are linked from architecture traceability.
- State/context files record the decision and residual activation gate.
- Focused readback proves the classification is present.

## Validation Evidence
- Tests:
  - `corepack pnpm run docs:parity:check` -> PASS (`22/22` API modules,
    `16/16` Web features, `39/39` routes).
- Manual checks:
  - `rg -n "out_of_scope_for_v1|Native/mobile scaffold|SOAR-MOBILE-001|LUC-2793" docs/architecture docs/modules docs/planning .agents/state .codex/context history/tasks/luc-2793-mobile-traceability-v1-scope-classification-2026-06-07-task.md`
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/traceability-matrix.md`
  - `docs/architecture/codebase-map.md`
  - `docs/modules/mobile-module-index.md`
  - `docs/modules/mobile-bootstrap.md`
  - `docs/planning/mobile-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, wording drift only
- Decision required from user: no
- Follow-up architecture doc updates: none required until Product/CTO approves mobile activation.

## Result Report
- Task summary: Classified native/mobile as `out_of_scope_for_v1` and kept current mobile docs as a scaffold-only traceability seed.
- Files changed: listed in Scope.
- How tested: focused readback search.
- What is incomplete: no native mobile implementation or mobile CI proof, by design.
- Next steps: reopen only after Product/CTO-approved mobile activation issue with non-scaffold runtime scope.
- Decisions made: responsive Web mobile proof remains Web/UX evidence and does not count as native/mobile parity.

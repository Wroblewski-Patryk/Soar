# Task

## Header
- ID: LUC-389
- Title: [Soar][ARB-005] Enforce mandatory pipeline hooks/checklists for `docs:parity:endpoints:api` and web route audit
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P1
- Operation Mode: TESTER

## Goal
Verify and close enforcement for mandatory API endpoint docs parity and web route-reachable i18n checks across CI and reusable-audit checklist validators.

## Scope
- `.github/workflows/ci.yml`
- `docs/automation/guardrail-commands.md`
- `scripts/checkAuditRemediationPlan.*`
- `scripts/checkFullReusableAuditHandoff.*`
- `scripts/checkReusableAuditRerunPlaybook.*`
- `scripts/checkReusableAuditToolingIndex.*`

## Implementation Plan
1. Confirm enforcement deltas exist in CI + checklist validators.
2. Execute focused validator test pack.
3. Execute both mandatory parity commands and capture outcomes.
4. Sync task/state records with final disposition.

## Acceptance Criteria
- CI `repo-guardrails` job runs:
  - `pnpm run docs:parity:endpoints:api`
  - `pnpm run i18n:audit:route-reachable:web`
- Reusable audit validator scripts require both commands in closure/validation fragments.
- Focused validator tests pass.
- Both mandatory commands pass on current tree.

## Definition of Done
- [x] Mandatory hook/checklist enforcement present in CI and validator contracts.
- [x] Focused test evidence captured.
- [x] Runtime command evidence captured.
- [x] Task and state records updated with final status.

## Result Report
- Task summary:
  Enforcement is present and verified. CI now hard-runs API endpoint docs parity + web route-reachable i18n audit in guardrails stage, and reusable-audit check validators now require both commands.
- Files changed:
  No additional product-code edits by this heartbeat; QA verified existing LUC-389 delta in tracked files listed in Scope.
- How tested:
  - `node --test scripts/checkAuditRemediationPlan.test.mjs scripts/checkFullReusableAuditHandoff.test.mjs scripts/checkReusableAuditRerunPlaybook.test.mjs scripts/checkReusableAuditToolingIndex.test.mjs` -> `39/39 PASS`
  - `pnpm run docs:parity:endpoints:api` -> `PASS` (`Endpoints: 109; documented: 109; gaps: 0`)
  - `pnpm run i18n:audit:route-reachable:web` -> `PASS` (`findings=0`)
- What is incomplete:
  None for QA lane scope.
- Next steps:
  1. Commit and merge verified LUC-389 delta.
  2. Let CI rerun to produce pipeline-side proof artifact.

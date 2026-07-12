# LUC-549 Account Access getPreviousSecretExpiry Proof

## Header

- ID: LUC-549
- Title: Prove Account access getPreviousSecretExpiry JWT rotation-window behavior
- Task Type: qa
- Current Stage: verification
- Status: DONE
- Owner: Test Automation Engineer
- Priority: P1
- Module Confidence Rows: Account access / API auth JWT secret rotation /
  app-completion truth
- Requirement Rows: Account access JWT previous-secret expiry behavior must have
  linked automated proof before leaving `implemented_needs_proof`
- Quality Scenario Rows: maintainability/traceability for auth/session proof
  linkage
- Risk Rows: project truth could keep routing a locally tested JWT helper as
  unproven
- Operation Mode: TESTER
- Mission ID: LUC-549-ACCOUNT-ACCESS-GETPREVIOUSSECRETEXPIRY-PROOF-2026-07-12
- Mission Status: VERIFIED_LOCAL_INDEX_LINK

## Process Self-Audit

- [x] Analyze current state.
- [x] Select one priority mission objective.
- [x] Plan the smallest proof closure.
- [x] Execute test-only proof and source-truth linkage.
- [x] Verify with focused test and generated-index refresh.
- [x] Self-review boundaries and residual risk.
- [x] Update documentation/state evidence.

## Mission Block

- Mission objective: close the Account access
  `auth.jwt.ts#getPreviousSecretExpiry` `implemented_needs_proof` row with fresh
  automated proof.
- Release objective advanced: app-completion/project-truth burn-down for
  Account access.
- Included slices: focused auth JWT test extension, scanner override/test
  relation, generated index refresh, evidence/state updates.
- Explicit exclusions: runtime auth implementation changes, protected
  credential access, secret/account readback, DB/Redis mutation,
  deploy/restart/rollback, exchange/payment/subscription mutation, order,
  position, or LIVE trading action.
- Checkpoint cadence: one heartbeat proof closure.
- Stop conditions: focused proof fails, generated indexes fail, or row cannot
  be linked without changing behavior.
- Handoff expectation: issue can close with evidence; next row routes to Docs
  Memory Lead + Project Manager.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, active mission, task board | final integration and Paperclip status | closure packet | project-truth readback | DONE |
| QA/Test | Test Automation Engineer | `auth.jwt.test.ts`, project-truth row | focused expiry behavior tests and test link | automated proof | vitest `5/5` pass | DONE |
| Documentation/Memory | Active chat | scanner overrides, priority test links, state ledgers | generated truth linkage and evidence | durable evidence rows | generated index refresh | DONE |

## Context

[LUC-547](/LUC/issues/LUC-547) resolved the documentation link for
`apps/api/src/modules/auth/auth.jwt.ts#getPreviousSecretExpiry` and created
[LUC-549](/LUC/issues/LUC-549) because project truth then routed the same row as
`implemented_needs_proof`.

## Goal

Record fresh, machine-readable automated proof for `getPreviousSecretExpiry`
without changing auth runtime implementation behavior.

## Scope

- `apps/api/src/modules/auth/auth.jwt.test.ts`
- `docs/architecture/scanner-overrides.json`
- `docs/architecture/relations/priority-test-links.csv`
- generated architecture/app-completion/project-truth outputs
- task/evidence/state files for [LUC-549](/LUC/issues/LUC-549)

## Implementation Plan

1. Extend focused JWT helper tests for the previous-secret expiry edge cases.
2. Link `getPreviousSecretExpiry` to `auth.jwt.test.ts` through the existing
   priority test-link and scanner override mechanisms.
3. Run focused test and formatting checks.
4. Refresh architecture-awareness, app-completion, and project-truth indexes.
5. Record evidence and close the Paperclip issue with the residual next owner.

## Acceptance Criteria

- [x] Focused JWT rotation-window proof passes.
- [x] `getPreviousSecretExpiry` has a direct generated proof link.
- [x] App-completion and project-truth indexes refresh successfully.
- [x] Project-truth first gap advances past `getPreviousSecretExpiry`.
- [x] No runtime/deploy/secret/account/live-trading mutation occurs.

## Definition of Done

- [x] Evidence packet exists under `history/evidence/`.
- [x] Task record exists under `history/tasks/`.
- [x] Relevant project state files record the result and residual next action.
- [x] Validation evidence is listed with exact commands and results.

## Forbidden

- Production deploy, restart, rollback, protected account readback, secret value
  disclosure, DB/Redis mutation, account mutation,
  exchange/payment/subscription mutation, order, position, bot activation, or
  LIVE trading action without explicit permit.

## Validation Evidence

- Tests:
  `corepack pnpm --filter api exec vitest run src/modules/auth/auth.jwt.test.ts`
  PASS (`1` file / `5` tests).
- Formatting:
  `corepack pnpm exec prettier --check docs/architecture/scanner-overrides.json apps/api/src/modules/auth/auth.jwt.test.ts`
  PASS.
- Manual checks:
  CSV readback confirmed the direct `priority-test-links.csv` row.
- Generated indexes:
  architecture-awareness PASS (`10718` entities / `34938` relations,
  `entityOverridesApplied=12`); app-completion PASS
  (`implementedNeedsProof=113`, `missingDocLink=1991`, `riskItems=3530`);
  project-truth `--apply` PASS and first gap advanced to
  `auth.jwt.ts#signAuthToken`.
- Regression/source-truth guard:
  `corepack pnpm run architecture:graph:drift:strict` PASS (`850/850`,
  `0` missing); `git diff --check` PASS with CRLF normalization warnings only.
- High-risk checks:
  no protected credentials, secret/account values, production auth session, DB,
  exchange, order, position, or live-trading state accessed or mutated.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Quality scenarios updated: not applicable.
- Risk register updated: yes.
- Reality status: verified.

## Architecture Evidence

- Architecture source reviewed:
  `docs/status/project-truth-index.md`,
  `docs/status/app-completion-index.json`,
  `docs/architecture/scanner-overrides.json`,
  `docs/architecture/relations/priority-test-links.csv`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates:
  generated status/graph outputs refreshed.

## Deployment / Ops Evidence

- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: test/source-truth metadata change; revert the focused test
  additions, linkage rows, and regenerated outputs if needed.
- Observability or alerting impact: none.

## Result Report

- Task summary: added focused JWT previous-secret expiry edge-case tests,
  linked `getPreviousSecretExpiry` to executable proof, and refreshed generated
  indexes.
- Files changed: auth JWT test, scanner override, priority test-link CSV,
  generated source-truth outputs, evidence/task/state files.
- How tested: focused vitest proof, Prettier check, CSV readback,
  architecture-awareness refresh, app-completion refresh, project-truth apply.
- What is incomplete: no remaining action on [LUC-549](/LUC/issues/LUC-549);
  next Account access row is a separate docs/source-truth row for
  `auth.jwt.ts#signAuthToken`.
- Boundary: no runtime implementation, production, protected, secret, DB,
  exchange, order, position, subscription, or LIVE trading mutation occurred.

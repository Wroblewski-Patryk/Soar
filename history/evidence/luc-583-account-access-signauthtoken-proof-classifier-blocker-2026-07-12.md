# LUC-583 Account Access signAuthToken Proof Classifier Blocker - 2026-07-12

## Status

- Result: `PROOF_PASS / GENERATED_INDEX_REFRESHED / CLASSIFIER_GAP_REMAINS / CHILD_LUC-586_CREATED`
- Issue: [LUC-583](/LUC/issues/LUC-583)
- Child blocker: [LUC-586](/LUC/issues/LUC-586)
- Role: QA and Verification Engineer

## Scope

Verify the Account access app-completion row
`apps/api/src/modules/auth/auth.jwt.ts#signAuthToken` and determine whether
the indexed `implemented_needs_proof` gap can close from QA evidence.

No runtime auth code, production deploy, protected credential access, secret or
account readback, DB/Redis mutation, exchange/payment/subscription mutation,
order, position, bot activation, or live-trading action occurred.

## Evidence

| Layer | Evidence | Result |
| --- | --- | --- |
| Focused runtime proof | `pnpm --filter api exec vitest run src/modules/auth/auth.jwt.test.ts --run --reporter=dot` | PASS, `1` file / `5` tests |
| Test relation | `docs/architecture/relations/priority-test-links.csv` | `signAuthToken` is linked to `apps/api/src/modules/auth/auth.jwt.test.ts` |
| Graph relation readback | `docs/graphs/architecture-awareness.json` | `signAuthToken` has `documents` and `tests` relations |
| App-completion refresh | `build-app-completion-index.mjs --project Soar --root ...` | PASS, but `implementedNeedsProof=114` remains |
| Project-truth refresh | `build-project-truth-indexes.mjs --project Soar --root ... --apply` | PASS, but first gap remains `signAuthToken implemented_needs_proof` |

## Diagnosis

The behavior proof exists and is current. The remaining gap is not a missing QA
test. The app-completion classifier still maps source entities with status
`implemented` to `implemented_needs_proof` after doc/test relations exist. This
keeps `signAuthToken` in the first-gap queue despite linked proof.

## Result Report

- Task summary: verified `signAuthToken` with focused local JWT tests and
  refreshed app-completion/project-truth outputs.
- Files changed in this QA heartbeat:
  - `history/evidence/luc-583-account-access-signauthtoken-proof-classifier-blocker-2026-07-12.md`
  - `history/tasks/luc-583-account-access-signauthtoken-proof-classifier-blocker-2026-07-12-task.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/risk-register.md`
- Pre-existing dirty proof/index files observed and reused:
  - `docs/architecture/relations/priority-test-links.csv`
  - `docs/architecture/scanner-overrides.json`
  - `docs/status/app-completion-index.*`
  - `docs/status/project-truth-index.*`
  - `history/evidence/luc-577-account-access-signauthtoken-proof-2026-07-12.md`
- Residual risk: generated project truth still routes this same row until the
  classifier/source-truth behavior is repaired or explicitly accepted.
- Next owner: [LUC-586](/LUC/issues/LUC-586), assigned to Technical Solution
  Architect for source-truth classifier diagnosis/repair.

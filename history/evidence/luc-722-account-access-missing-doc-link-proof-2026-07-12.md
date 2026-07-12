# LUC-722 Account Access Missing-Doc-Link Proof

Date: 2026-07-12
Owner: 04 DSM (Documentation Steward)
Issue: [LUC-722](/LUC/issues/LUC-722)

## Scope

Prove the current state of the first Account access app-completion gap:

- `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`

## Changed

- Added a task/evidence packet for the scoped proof.
- Recorded project-truth context for the generated mismatch.
- Did not claim or introduce a runtime/product change.

## Verification

- Canonical doc classification readback:
  - PASS: `docs/modules/api-backtests.md` contains the
    `registerAndLogin` classification row in
    `## 12. Architecture-Awareness Doc-Link Classification`.
- Documentation-link registry readback:
  - PASS:
    `docs/architecture/relations/documentation-links.csv` contains
    `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin,docs/modules/api-backtests.md`.
- Scanner override readback:
  - PASS:
    `docs/architecture/scanner-overrides.json` contains a `documents`
    relation override from `docs/modules/api-backtests.md` to the scoped path.
- Generated app-completion row readback:
  - PASS for proof purposes.
  - `docs/status/app-completion-index.json -> priorityReviewItems` for the
    scoped path still reports:
    - `evidence.hasTest=true`
    - `evidence.hasDoc=false`
    - `risk=missing_doc_link`
- Generated architecture-awareness entity readback:
  - PASS for proof purposes.
  - `docs/graphs/architecture-awareness.json` still shows the scoped entity as:
    - `status=tested`
    - `evidence=["apps/api/src/modules/backtests/backtests.e2e.test.ts"]`
    - no generated `documents` relation for the path.
- Generated project-truth readback:
  - PASS for proof purposes.
  - `docs/status/project-truth-index.md` still reports the first gap as:
    `Account access: registerAndLogin has app-completion risk missing_doc_link.`

## Result

Current truth for [LUC-722](/LUC/issues/LUC-722):

- The current workspace already contains canonical doc-link inputs for the
  scoped Backtests auth bootstrap helper.
- The current generated architecture-awareness/app-completion/project-truth
  outputs do not ingest that linkage for the scoped entity.
- This heartbeat proves a classifier or awareness-ingestion mismatch; it does
  not prove that the missing-doc-link has been resolved.

## Next Owner / Action

- Owner: Docs Memory Lead + Project Manager / Delivery tooling lane.
- Action: repair or rerun the architecture-awareness -> app-completion
  ingestion path so the scoped entity gains a generated `documents` relation
  and `evidence.hasDoc=true`, then refresh project-truth readback.

## Boundary

No runtime Backtests/auth code, deploy, push, restart, rollback, env edit,
migration, protected account/session smoke, secret/account readback, DB/Redis
mutation, exchange/payment/subscription mutation, order, position, bot
activation, or LIVE trading action occurred.

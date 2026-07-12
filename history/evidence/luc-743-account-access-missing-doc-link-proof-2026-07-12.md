# LUC-743 Account Access Missing-Doc-Link Proof

Date: 2026-07-12
Owner: 04 DSM (Documentation Steward)
Issue: [LUC-743](/LUC/issues/LUC-743)

## Scope

Prove the current state of the Account access row previously identified as
`missing_doc_link`:

- `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin`

## Changed

- Added a durable proof packet for the scoped row.
- Recorded current generated readback after the LUC-734 ingestion repair.
- Did not claim or introduce any runtime/product change.

## Verification

- Canonical doc-link inputs remain present:
  - `docs/modules/api-backtests.md` contains the `registerAndLogin`
    classification row.
  - `docs/architecture/relations/documentation-links.csv` contains
    `apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin,docs/modules/api-backtests.md`.
  - `docs/architecture/scanner-overrides.json` contains the matching
    `documents` override.
- Generated architecture-awareness readback:
  - PASS: `docs/graphs/architecture-awareness.json` contains the scoped
    `path: "apps/api/src/modules/backtests/backtests.e2e.test.ts#registerAndLogin"`.
- Generated app-completion readback:
  - PASS: `docs/status/app-completion-index.json` no longer matches the scoped
    `backtests.e2e.test.ts#registerAndLogin` path in `priorityReviewItems`.
- Generated project-truth readback:
  - PASS: `docs/status/project-truth-index.md` no longer routes the first gap
    to the scoped path.
  - Current first gap:
    `Account access: getOwnedBotRuntimeSession has app-completion risk missing_doc_link.`

## Result

Current truth for [LUC-743](/LUC/issues/LUC-743):

- The scoped Backtests helper is now represented in the canonical
  documentation-link inputs and the generated awareness graph.
- The generated app-completion/project-truth outputs no longer keep the scoped
  path as the first Account access gap.
- This heartbeat proves the row is no longer the active `missing_doc_link`
  blocker; the next Account access gap is a different row owned by the Docs
  Memory Lead + Project Manager lane.

## Next Owner / Action

- Owner: Docs Memory Lead + Project Manager / Delivery tooling lane.
- Action: continue from the new first Account access gap
  `apps/api/src/modules/bots/botOwnership.service.ts#getOwnedBotRuntimeSession`
  if Account access doc-link burn-down continues.

## Boundary

No runtime Backtests/auth code, deploy, push, restart, rollback, env edit,
migration, protected account/session smoke, secret/account readback, DB/Redis
mutation, exchange/payment/subscription mutation, order, position, bot
activation, or LIVE trading action occurred.

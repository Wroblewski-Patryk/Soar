# LUC-1663 Evidence — Dynamic Bot Runtime Proof Refresh Closure

Date: 2026-07-22

## Classification

The local changes form one coherent documentation, test-evidence, generated
index, and project-memory packet for `LUC-1662`. The exact route is
`apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx`
(`route:page-tsx:52de535d03`).

## Evidence inherited from LUC-1662

- The focused route test verifies redirect to the selected bot's preview page.
- The fresh LUC-1659 browser packet records
  `SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME = PASS` and observes the canonical preview
  destination.
- Direct source-to-test and source-to-documentation relations and the scoped
  scanner override were added.
- Canonical indexes were rebuilt sequentially.
- Project Truth decreased from `47` to `46` gaps and no longer contains the
  exact source item.

## Source-control result

- One local commit is required for the complete packet.
- Push: not performed.
- Deploy/restart/production mutation: not performed.
- Residual: the separate legacy/global bot route rows remain independently
  indexed and must not inherit this dynamic-route proof.

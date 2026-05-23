# Task

## Header
- ID: XADAPT-02
- Title: Classify Binance-specific assumptions across orders, exchange, and reconciliation paths
- Status: DONE
- Owner: Planning Agent
- Depends on: XADAPT-01
- Priority: P1

## Context
`XADAPT-01` froze one canonical capability matrix for authenticated reads and
write-side execution. The next safe step is to classify the current runtime and
adapter seams against that frozen truth before refactoring anything. Without an
audit packet, `XADAPT-03` would still have to rediscover which Binance-specific
assumptions are intentional, which generic seams are tolerated compatibility
bridges, and which generic-looking surfaces now exceed product truth.

## Goal
Publish one concrete audit packet that classifies exchange-related code paths
into:

- intentional Binance-only scope
- compatibility-only generic seams
- generic-looking drift risks that `XADAPT-03` must narrow

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep current V1 Binance-first support truth explicit

## Definition of Done
- [x] Orders, exchange, and reconciliation paths are classified against the frozen capability matrix.
- [x] The audit packet identifies intentional Binance scope, compatibility seams, and generic-looking drift risks separately.
- [x] Queue/context/planning truth moves from `XADAPT-02` to `XADAPT-03`.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- silently broadening support while "just auditing"

## Validation Evidence
- Tests: `pnpm run quality:guardrails`
- Manual checks:
  - compare `orders.service.ts`, `exchangeConnectorFactory.service.ts`,
    `liveOrderAdapter.service.ts`, `positions.service.ts`, and
    `livePositionReconciliation.service.ts` against the `XADAPT-01` matrix
- Screenshots/logs: n/a
- High-risk checks:
  - confirm local cancel route is not documented as exchange cancel support
  - confirm Binance-only reconciliation remains classified as intentional scope,
    not accidental generic drift

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - none in this slice; `XADAPT-03` is the first refactor-bearing step

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: n/a
- Responsive checks: n/a
- Accessibility checks: n/a
- Parity evidence: n/a

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [ ] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The resulting handoff packet for `XADAPT-03` is:

- `history/audits/xadapt-02-binance-assumption-audit-2026-04-25.md`

It deliberately stops at classification and ownership mapping, without changing
runtime behavior yet.

# Task

## Header
- ID: XADAPT-03
- Title: Expose one canonical exchange adapter boundary for write and authenticated-read consumers
- Status: DONE
- Owner: Execution Agent
- Depends on: XADAPT-02
- Priority: P1

## Context
`XADAPT-01` froze one canonical exchange capability matrix and `XADAPT-02`
classified the current code into intentional Binance scope, compatibility seams,
and generic-looking drift risks. The next honest step is to narrow feature
modules behind one explicit adapter boundary so they no longer assemble CCXT
connectors, live-submit adapters, and authenticated-read contracts directly.

## Goal
Introduce one canonical exchange adapter boundary for:

- `LIVE_ORDER_SUBMIT`
- `BALANCE_PREVIEW`
- `POSITIONS_SNAPSHOT`
- `OPEN_ORDERS_SNAPSHOT`

while making `LIVE_ORDER_CANCEL` explicitly unsupported at the same capability
layer.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new product capability
- do not broaden exchange support beyond frozen V1 truth
- keep intentional Binance-only reconciliation scope explicit
- keep unsupported capability families fail-closed

## Definition of Done
- [x] One canonical exchange capability contract exists in code for authenticated reads and write-side execution.
- [x] `orders.service.ts`, `positions.service.ts`, and `wallets.service.ts` consume the boundary instead of directly composing lower-level exchange primitives.
- [x] Lower-level connector and CCXT seams remain infrastructure-only details.
- [x] Queue/context docs move from `XADAPT-03` to `XADAPT-04`.

## Forbidden
- new systems without approval
- duplicated capability matrices
- silent multi-exchange broadening
- treating local order cancel as exchange-side cancel support

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts`
  - `pnpm --filter api exec vitest run src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - verify feature modules no longer import connector factory or live adapter directly
  - verify cancel support is still explicit and fail-closed at the contract layer
- Screenshots/logs: n/a
- High-risk checks:
  - `LIVE_ORDER_SUBMIT` must now be gated by the family-specific contract, not by broad `LIVE_EXECUTION`
  - authenticated read support must stay explicit and Binance-only

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/live-safety-and-contract-truth-remediation-contract.md`
  - `history/audits/xadapt-02-binance-assumption-audit-2026-04-25.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - none expected beyond queue/context sync if implementation stays within the frozen matrix

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
Implementation outcome:

- added `exchangeExecutionCapabilityContract.service.ts` as the single code
  matrix for authenticated reads plus `LIVE_ORDER_SUBMIT` / `LIVE_ORDER_CANCEL`
- added `exchangeAdapterBoundary.service.ts` so feature modules now depend on
  one boundary instead of directly assembling connector factory + live adapter
  + authenticated-read contract
- moved `resolveLiveExecutionApiKey` ownership to the boundary while keeping
  the `orders.service.ts` export stable through re-export

Validation note:

- focused unit/contract checks, API typecheck, and repository guardrails passed
- DB-backed packs were not used as closure evidence for this slice because the
  boundary contract itself is what `XADAPT-04` is meant to strengthen with
  broader Binance-focused regression coverage

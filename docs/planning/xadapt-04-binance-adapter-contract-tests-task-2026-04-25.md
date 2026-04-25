# Task

## Header
- ID: XADAPT-04
- Title: Add focused Binance adapter contract coverage for live submit and reconciliation-facing reads
- Status: DONE
- Owner: Execution Agent
- Depends on: XADAPT-03
- Priority: P1

## Context
`XADAPT-03` introduced one canonical exchange adapter boundary plus one shared
capability matrix in code. The next safe step is to lock that boundary with
focused Binance-first regression coverage, without relying on broad DB-backed
e2e packs that test many unrelated concerns at once.

## Goal
Add stable tests that prove:

- Binance read-side boundary usage for positions and open orders
- fail-closed behavior for unsupported exchanges at the boundary
- Binance live-submit normalization through the new feature-facing boundary

## Constraints
- use existing systems and approved mechanisms
- do not broaden exchange support
- keep Binance-first V1 truth explicit
- keep `LIVE_ORDER_CANCEL` unsupported

## Definition of Done
- [x] Focused tests cover the new execution capability contract for Binance-only submit/read support.
- [x] Focused tests cover the adapter boundary for read-side fetches and live-submit normalization.
- [x] Queue/context docs move from `XADAPT-04` to `XADAPT-05`.

## Forbidden
- new systems without approval
- broad e2e rewrites as a substitute for focused boundary tests
- hiding unsupported exchanges behind generic success fixtures

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/exchange/exchangeAdapterBoundary.service.test.ts src/modules/exchange/exchangeExecutionCapabilityContract.service.test.ts src/modules/exchange/exchangeAuthenticatedRead.service.test.ts`
  - `pnpm --filter api run typecheck`
  - `pnpm run quality:guardrails`
- Manual checks:
  - verify the new tests lock `LIVE_ORDER_CANCEL` as unsupported
  - verify the boundary tests do not require DB-backed runtime fixtures
- Screenshots/logs: n/a
- High-risk checks:
  - read-side support must stay Binance-only
  - live-submit normalization must remain inside the boundary

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/planning/xadapt-03-exchange-adapter-boundary-task-2026-04-25.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - none

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

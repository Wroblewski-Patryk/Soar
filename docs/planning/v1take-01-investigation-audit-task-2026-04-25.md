# Task

## Header
- ID: V1TAKE-01
- Title: Publish confirmed ownership/manual-order investigation packet with DB-backed validation
- Status: DONE
- Owner: Planning Agent
- Depends on: V1TAKE-00
- Priority: P1

## Context
`V1TAKE-00` queued the next post-V1 hardening wave for exchange takeover and
manual-order truth. Before adding new red coverage or changing runtime code,
the repository needs one compact audit packet that freezes the confirmed
symptom map, code hotspots, supported-scope assumptions, and fresh DB-backed
validation evidence.

## Goal
Publish one execution handoff packet that:

- separates confirmed ownership/manual-order findings from speculation,
- records the exact Binance Futures support boundary that still applies,
- proves local DB-backed validation is available again for this wave,
- hands `V1TAKE-02` a concrete red-test target instead of a broad investigation.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep current support truth explicit and fail closed

## Definition of Done
- [x] The audit packet freezes the confirmed symptom map and code-owner map.
- [x] Supported-scope assumptions (`BINANCE + FUTURES`) are recorded explicitly.
- [x] Local DB-backed validation evidence is attached.
- [x] Queue/context/planning truth moves from `V1TAKE-01` to `V1TAKE-02`.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- silently broadening exchange support while documenting the issue

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`
  - `pnpm --filter api exec vitest run src/modules/orders/orders-positions.e2e.test.ts -t "keeps manual LIVE MARKET visibility truthful from submitted order through exchange-synced adoption|keeps LIVE open orders visible in runtime view when order was created before current session start"`
  - `pnpm run quality:guardrails`
- Manual checks:
  - `docker info`
  - `docker context ls`
  - `docker ps -a`
- Screenshots/logs:
  - `docker compose up -d postgres redis` failed on `5432 already allocated`,
    confirming a reachable local Postgres listener already existed.
- High-risk checks:
  - verified DB-backed takeover-status coverage now passes locally again
  - verified the manual `LIVE` submitted -> exchange-synced adoption contract
    stays green before new red-task work starts

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: n/a
- Follow-up architecture doc updates:
  - none in this audit-only slice

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: n/a
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: n/a
- Parity evidence: the audit packet maps remaining dashboard/manual-order work
  back to the API ownership contract instead of treating UI as a separate truth

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
The resulting handoff packet for `V1TAKE-02` is:

- `docs/planning/v1take-01-investigation-audit-2026-04-25.md`

This slice intentionally stops at confirmation and ownership mapping. The next
task must add red coverage for the ownership-contract drift before any fix is
attempted.

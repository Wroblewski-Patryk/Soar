# Task

## Header
- ID: V1TAKE-00
- Title: planning(queue): publish exchange takeover and manual-order closure packet
- Status: DONE
- Owner: Planning Agent
- Depends on:
- Priority: P1

## Context
Fresh user-reported issues on exchange-position takeover and dashboard manual
order flow required a new architecture-aligned execution packet before any fix
work starts. Earlier local investigation was partially infra-blocked by Docker
/ Postgres availability; that blocker is now reduced because Docker Desktop is
available again and focused DB-backed verification passes locally.

## Goal
Publish one canonical, execution-ready plan for the next fix wave covering:
- takeover ownership and visibility truth,
- exchange-synced position/runtime visibility,
- dashboard manual `PAPER` and `LIVE` open truth,
- local Docker recovery guidance for future DB-backed validation.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic

## Definition of Done
- [x] Investigation findings are converted into one canonical planning packet.
- [x] Canonical queue/context files point to the new task sequence.
- [x] Docker recovery guardrail is captured in repository truth for future runs.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/positions/positions.takeover-status.e2e.test.ts`
  - `pnpm --filter api exec vitest run src/modules/orders/orders.service.test.ts -t "keeps LIVE MARKET order submitted when exchange placement returns OPEN without fill truth"`
- Manual checks:
  - `docker info`
  - `docker context ls`
  - `docker ps -a`
- Screenshots/logs:
  - `docker compose up -d postgres redis` failed on `5432 already allocated`, which confirmed a local Postgres listener already existed.
- High-risk checks:
  - verified the previously infra-blocked takeover-status e2e now passes locally.

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed:
  - `docs/architecture/README.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/exchange-access-ownership-matrix.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed:
- Follow-up architecture doc updates:
  - none in this planning-only task

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: investigation only; no UI changes shipped
- Required states: loading | empty | error | success
- Responsive checks: desktop | tablet | mobile
- Accessibility checks: not applicable in this planning-only task
- Parity evidence: manual-order wave includes explicit API + web closure tasks

## Review Checklist (mandatory)
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The new execution wave intentionally starts with red/contract tasks before any
code fix so takeover and manual-order behavior can be corrected under one
verified, DB-backed contract rather than another heuristic patch.

# Current Focus

Last updated: 2026-05-08

## Active Focus

V1 backend paper/live runtime closure before Web visualization, while keeping
production evidence blockers explicit and separate.

## Current System Objective

Build and maintain an AI-assisted self-improving development system for Soar.
The system must let agents continue from repository state, identify the next
smallest valuable task, protect runtime safety, and keep backend/frontend/UI
contracts synchronized.

## Current Delivery Stage

The latest local backend runtime parity slice fixed
`executionOrchestrator.service` so close-settlement entry-fee aggregation uses
the existing `RuntimeTradeGateway` boundary rather than direct Prisma access
inside the shared PAPER/LIVE orchestration path. Focused engine parity/crash
coverage, DB-backed runtime/order/exchange/import/readback packs, API
typecheck, repository guardrails, and the full local API suite are green.
The first DB-backed runtime e2e attempt was blocked by an unhealthy
`desktop-linux` Docker context, but the local Postgres/Redis ports and
`default` Docker context were reachable; rerunning the packs sequentially
closed the local backend evidence gap.

Release verification is blocked on accepted production deployment plus
authenticated production readback for the first open queue item,
`LIVEIMPORT-03`. Local audit gates are closed through `FULLARCH-FIX-11`.
Production web build-info now reports
`da1e52cfec0b70e5a94e59d75fe702a55c348d74`, which contains the V1 backend
PAPER/LIVE adapter-pure runtime fix. GitHub Actions is not an accepted
production deploy mechanism for this project. The latest names-only
prerequisite scan still found no production credentials or ops auth headers in
the current shell, so protected evidence collection remains blocked without an
operator-authenticated environment.

`LIVEIMPORT-03` now has one canonical read-only evidence command. Use the
currently deployed production build-info SHA, currently
`da1e52cfec0b70e5a94e59d75fe702a55c348d74`, unless a newer Coolify/manual
deploy is confirmed:
`pnpm run ops:liveimport:readback -- --expected-sha da1e52cfec0b70e5a94e59d75fe702a55c348d74 --output docs/operations/liveimport-03-prod-readback-2026-05-08.json`.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output cannot be treated as V1
evidence.

A production `ops:release:v1:gate` dry-run on 2026-05-07 generated current
blocker artifacts and reports `readiness=not_ready`: activation audit,
activation plan, RC external gates status, RC sign-off, RC checklist,
backup/restore drill evidence, and rollback proof pack are stale, and dry-run
mode cannot approve production.

The activation audit and activation plan have since been refreshed as
2026-05-07 `NO-GO` artifacts. The latest dry-run now reports those two
families as `fresh`; remaining release-gate blockers are RC external gates
status, RC sign-off, RC checklist, backup/restore drill evidence, rollback
proof pack, and non-dry-run protected execution.

RC external gates status, RC sign-off, and RC checklist have now also been
refreshed as current blocked/open evidence. Latest RC snapshot is `G1=PASS`,
`G2=OPEN`, `G3=PASS`, `G4=OPEN`; sign-off remains `BLOCKED`.

Backup/restore drill and rollback proof are also current for 2026-05-07 but
`FAILED`: restore drill was not executed without production DB/Coolify access,
and rollback proof failed closed on protected `401` responses. V1 remains
NO-GO.

The canonical `LIVEIMPORT-03` command now targets the deployed backend parity
SHA `da1e52cfec0b70e5a94e59d75fe702a55c348d74`, matching public build-info.

Latest continuation recheck: public production build-info matches
`da1e52cfec0b70e5a94e59d75fe702a55c348d74`, but the current shell exposes no
required Soar production auth variable. A no-auth `ops:liveimport:readback`
attempt against that SHA failed closed before protected runtime readback.

Post-regression cleanup: GitHub Actions production promote/rollback entrypoints
and the local GitHub workflow helper are being removed. Future V1 deployment
continuation must use Coolify/manual operator controls, then local verification
scripts for build-info, release gate, readback, rollback proof, and restore
drill evidence.

## Current Priority Order

1. Stability
2. Architecture alignment
3. No regressions
4. Correct flows
5. UX quality
6. Visual polish
7. New features

## Active Constraints

- Do not touch unrelated in-progress code changes.
- Keep source-of-truth docs in English.
- Reuse existing `.codex/context`, planning, governance, and architecture
  systems.
- Do not run live-money or destructive production actions for `LIVEIMPORT-03`;
  the remaining work is authenticated read-only dashboard/API evidence.
- Keep `LIVEIMPORT-03` open until ETH/DOGE production runtime readback evidence
  is captured and redacted.

# Current Focus

Last updated: 2026-05-09

## Active Focus

V1 backend paper/live runtime closure before Web visualization, while keeping
production evidence blockers explicit and separate.

## Current System Objective

Build and maintain an AI-assisted self-improving development system for Soar.
The system must let agents continue from repository state, identify the next
smallest valuable task, protect runtime safety, and keep backend/frontend/UI
contracts synchronized.

## Current Delivery Stage

2026-05-09 production UI public-access refresh: the public/unauthenticated
audit slice is current for deployed `90cd07d6`. Web build-info matches
`90cd07d602f0a31f315719b8a5cd5be3fd112313`, API `/health` and `/ready` pass,
public Web routes return HTTP 200, and unauthenticated dashboard/admin routes
redirect to `/auth/login`. Full production UI module clickthrough remains
blocked until authenticated/admin production app access is available.

2026-05-09 no-secret V1 preflight refresh: deployed `90cd07d6` still passes
build-info and public API/Web smoke, but the current release posture is
`BLOCKED` on missing live-import auth, rollback auth, production DB restore
context, missing `LIVEIMPORT-03`, and stale 2026-05-08 release evidence for
the 2026-05-09 evidence date.

2026-05-09 activation refresh: production activation plan and activation
evidence audit are fresh `NO-GO` artifacts for 2026-05-09, and the follow-up
preflight confirms those blockers are cleared. V1 remains blocked on protected
auth, production DB restore context, stale RC/recovery evidence,
`LIVEIMPORT-03`, and rollback proof.

2026-05-09 RC refresh: RC status, sign-off, and checklist are fresh blocked
evidence for 2026-05-09. Preflight now classifies them as `failed` rather than
`stale`, because real Gate 2 production SLO evidence and Gate 4 approver
approval are still missing.

2026-05-09 rollback proof tooling: rollback proof generation now accepts
`--today <yyyy-mm-dd>` for correct release evidence dating, but the actual
production rollback proof remains blocked on protected auth/network access.

2026-05-09 restore drill tooling: restore drill generation now accepts
`--today <yyyy-mm-dd>` for correct release evidence dating, but the actual
production restore drill remains blocked on approved DB/Coolify context.

2026-05-09 final blocker pack sync: the operator execution pack now defines
one `$releaseDate` and reuses it across supported date-aware preflight,
restore drill, rollback proof, RC evidence, and final gate commands. This is a
runbook/state synchronization only; final production evidence still requires
protected auth and DB/Coolify context.

2026-05-09 deploy freshness: the current V1 evidence batch is deployed at Web
build-info SHA `4792fbca9ab3ca44d08c312f219f70d648707886`, with public API
`/health`, API `/ready`, and Web `/` smoke passing. Continue protected
evidence work from this deployed SHA only.

2026-05-09 final preflight for deployed `4792fbca`: build-info and public
smoke pass, and V1 remains `BLOCKED` only on protected/authenticated or
operator-context evidence: live-import auth, rollback auth, production DB
restore context, RC approval/evidence, `LIVEIMPORT-03`, and current
restore/rollback proof artifacts.

2026-05-09 blocker pack candidate SHA sync: protected evidence commands should
target the verified deployed candidate
`4792fbca9ab3ca44d08c312f219f70d648707886`, not local evidence-only `HEAD`,
until another intended candidate is deployed and proven by build-info.

2026-05-09 continuation update: Gate.io second-exchange planning has been
reconciled after the deployed fail-closed foundation. The plan is complete as a
planning artifact; public catalog and public `FUTURES`/swap market-data
foundation are implemented, while paper pricing, authenticated reads, live
submit, and exchange-side cancel remain unsupported until exact operation
support and evidence exist. The next non-local blockers remain protected
production auth/readback, rollback proof auth, and RC Gate 4 approval.

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
Production web build-info has verified the RC approval gate hardening deploy
at `1100b7fb232ce6195b24522a6a11559fe9fb8634`, which contains the V1 backend
PAPER/LIVE adapter-pure runtime fix, blocker evidence alignment, deploy wait
coordination docs, operator preflight hardening, live-import release-gate
evidence enforcement, build-info freshness enforcement, and strict RC approval
evidence enforcement. GitHub Actions is not an accepted production deploy
mechanism for this project. The latest names-only prerequisite scan still
found no production credentials or ops auth headers in the current shell, so
protected evidence collection remains blocked without an
operator-authenticated environment.

`LIVEIMPORT-03` now has one canonical read-only evidence command. First verify
the currently checked-out `HEAD` through production build-info, then pass that
same SHA to the collector:
`$expectedSha = git rev-parse HEAD; pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30; pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output docs/operations/liveimport-03-prod-readback-2026-05-08.json`.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output cannot be treated as V1
evidence.

Before running protected evidence commands, use the read-only aggregate
preflight:
`pnpm run ops:release:v1:preflight`. It verifies current `HEAD` through
build-info, reports missing prerequisite env names, and classifies current
release evidence blockers without creating protected artifacts.

Latest protected-context sweep after Coolify operator access: production
build-info for `e6e7d4a044ce80279c542412a91bae4a6a012392` passes and public
API/Web smoke passes. Coolify confirms the production Postgres container name
is `x11cfnz1dd9x0yzccftqzcoe`, but local Docker cannot see that remote
container; therefore the existing Docker-based restore drill cannot honestly
produce production PASS evidence from this workstation. The generated
no-secret status reports are
`docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
and
`docs/operations/v1-final-preflight-2026-05-08-protected-context.md`.

Production restore drill is now closed as PASS through approved Coolify
terminal access. Evidence:
`docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`. Latest
verified Coolify deploy is `721fe8482922835a9419f0e529baeef4ff6a74c9`.
Remaining V1 release blockers are protected Soar application/operator auth for
`LIVEIMPORT-03`, rollback proof auth, and real RC Gate 4 approval.

The protected auth context sweep confirmed the current API runtime env-name
surface does not expose `LIVEIMPORT_READBACK_*` or `ROLLBACK_GUARD_*` auth
variables. The final preflight now classifies fresh production restore drill
evidence as satisfying the production DB restore context prerequisite, so the
remaining preflight blockers are live-import auth, rollback guard auth, failed
RC Gate 4 approval evidence, missing `LIVEIMPORT-03`, and failed rollback
proof. Rollback proof remains fail-closed on protected `401` responses until
approved auth is available.

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

The canonical `LIVEIMPORT-03` command now targets the currently checked-out
`HEAD` after production build-info confirms that `HEAD` is deployed.

Latest continuation recheck: public production build-info reached the RC
approval gate hardening commit
`1100b7fb232ce6195b24522a6a11559fe9fb8634`, but the current shell exposes no
required Soar production auth variable. A no-auth `ops:liveimport:readback`
attempt failed closed before protected runtime readback.

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

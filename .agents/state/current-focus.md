# Current Focus

Last updated: 2026-05-10

## Active Focus

V1 backend paper/live runtime closure before Web visualization, while keeping
production evidence blockers explicit and separate.

## Current System Objective

Build and maintain an AI-assisted self-improving development system for Soar.
The system must let agents continue from repository state, identify the next
smallest valuable task, protect runtime safety, and keep backend/frontend/UI
contracts synchronized.

## Current Delivery Stage

2026-05-10 verification/tooling update:
`PROD-UI-MODULE-CLICKTHROUGH-RUNNER-2026-05-10` added a canonical
`ops:ui:prod-clickthrough` runner for production UI route/module audit. The
runner verifies build-info, supports optional dashboard/admin auth, records
redacted JSON/Markdown evidence, and fails closed as `BLOCKED_AUTH` without
credentials. The current production no-auth run for
`84e7c0e012a571f18396556a97198dbed08aba7c` reports public routes PASS and
dashboard/admin/legacy protected routes `BLOCKED_AUTH`. This does not close
authenticated/admin UI clickthrough; it makes the remaining proof executable
once app/admin auth is available. Evidence:
`docs/planning/prod-ui-module-clickthrough-runner-task-2026-05-10.md` and
`docs/operations/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.

2026-05-10 verification update:
`V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-10` refreshed production rollback
proof evidence for the current evidence date. The no-auth production run failed
closed on protected `401` responses (`runtime_freshness_endpoint_http_401` and
`alerts_endpoint_http_401`) and is recorded as current `FAIL` evidence, not
release approval. Follow-up no-secret preflight for deployed
`8df3260b8453be0a39dfa75ce2be281d6571c4de` reports build-info PASS, public
smoke PASS, production DB restore context satisfied, backup/restore fresh, and
rollback proof fresh but failed. V1 remains `BLOCKED / NO-GO` on liveimport
auth/readback, rollback guard auth/proof PASS, RC approval/gates, and
authenticated/admin production UI clickthrough. Evidence:
`docs/planning/v1-rollback-proof-blocked-refresh-task-2026-05-10.md`,
`docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`, and
`docs/operations/v1-final-preflight-8df3260b-2026-05-10.md`.

2026-05-10 verification update:
`V1-PROD-RESTORE-DRILL-REFRESH-2026-05-10` captured fresh PASS production
restore-drill evidence through the approved Coolify terminal for the production
Postgres resource. The isolated backup/restore contract created a temporary
restore database, restored the dump, validated aggregate counts, dropped the
temporary database, removed the dump, and verified zero leftovers. Follow-up
no-secret preflight for deployed
`969df7c8f268146ecff3efb9de2fe1841ac8bc75` now marks production DB restore
context as satisfied and backup/restore drill evidence as fresh for
2026-05-10. V1 remains `BLOCKED / NO-GO` on protected/formal evidence:
liveimport auth/readback, rollback guard auth/proof, RC approval/gates, and
authenticated/admin production UI clickthrough. Evidence:
`docs/planning/v1-prod-restore-drill-refresh-task-2026-05-10.md`,
`docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`, and
`docs/operations/v1-final-preflight-969df7c8-2026-05-10.md`.

2026-05-10 post-release update: `V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10`
cleared the stale Coolify deploy queue for Soar. Production Web build-info and
the fresh `soar-api` redeploy now both point to
`33a2ebc468be3dbfab7c784f375672ebead5ae16`; public API/Web smoke passes and
the Coolify queue is empty. V1 remains `BLOCKED / NO-GO` on protected/formal
release evidence only. Evidence:
`docs/operations/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md` and
`docs/operations/v1-final-preflight-33a2ebc4-2026-05-10.md`.

2026-05-10 verification update: `V1-DEPLOY-CONTROL-READINESS-2026-05-10`
confirms production deploy control is manual Coolify/operator owned. The
repository has CI checks only, no approved no-secret production deploy trigger,
and webhook/API credentials are intentionally operator-held secrets. Evidence:
`docs/operations/v1-deploy-control-readiness-2026-05-10.md`.

2026-05-10 verification update: `DEPLOY-LAG-E70F5CF6-2026-05-10` records that
the pushed protected-input readiness commit
`e70f5cf6229d6fc4d26ea0342b81baab80851800` did not reach production build-info
during two bounded wait windows. Production still reports
`40e9b3c35c96d4acced73bbab980039f9e6b6a22`; public smoke passes. Evidence:
`docs/operations/deploy-lag-e70f5cf6-2026-05-10.md`.

2026-05-10 verification update: `V1-PROTECTED-INPUTS-READINESS-2026-05-10`
confirms this session lacks the protected env families required for
`LIVEIMPORT-03`, rollback proof, and production DB restore context. Privileged
VPS/Docker inspection was rejected by the escalation reviewer and was not
retried. V1 remains `BLOCKED / NO-GO` until the operator provides approved
credentials/context or explicit production infrastructure authorization.
Evidence: `docs/operations/v1-protected-inputs-readiness-2026-05-10.md`.

2026-05-10 verification update: `V1-FINAL-PREFLIGHT-CURRENT-9D28F682`
captured the final no-secret preflight for currently deployed
`9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info and public smoke PASS;
V1 remains `BLOCKED / NO-GO` on the same protected/formal blockers:
liveimport auth/readback, rollback guard auth, production DB restore context,
failed RC evidence, stale backup/restore drill, and stale rollback proof.
Evidence:
`docs/planning/v1-final-preflight-current-9d28f682-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-9d28f682-2026-05-10.md`.

2026-05-10 verification update: `V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10`
published a current no-secret operator unblock checklist for deployed
`822d92fc02067fa122e735ab6cc2783e438dc458` and retargeted the final blocker
execution pack to the same SHA. Current preflight build-info/public smoke
PASS and V1 remains `BLOCKED / NO-GO` until protected liveimport readback,
rollback proof, production restore drill, Gate 2 evidence, and real RC
approvers are provided. Evidence:
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md` and
`docs/operations/v1-final-preflight-822d92fc-2026-05-10.md`.

2026-05-10 verification update: `V1-PROD-ACTIVATION-REFRESH-2026-05-10`
published fresh production activation plan and activation evidence audit
artifacts as explicit `NO-GO` for deployed
`74752f025ef49bf5026ec92e056f59947e00a18f`. Follow-up no-secret final
preflight now reports activation plan/audit fresh, build-info/public smoke
PASS, and V1 still `BLOCKED` on liveimport auth/readback, rollback guard auth,
production DB restore context, failed RC evidence, stale backup/restore drill,
and stale rollback proof. Evidence:
`docs/planning/v1-production-activation-refresh-2026-05-10-task.md` and
`docs/operations/v1-final-preflight-74752f02-2026-05-10.md`.

2026-05-10 verification update: `V1-RC-BLOCKED-REFRESH-2026-05-10`
refreshed RC external gates, RC sign-off, and the RC checklist to the active
evidence date as current blocked evidence. Final preflight for deployed
`1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` now reports build-info/public
smoke PASS, RC evidence fresh but `failed`, and V1 still `BLOCKED` on
protected/formal blockers: liveimport auth/readback, rollback guard auth,
production DB restore context, stale activation audit/plan, stale
backup/restore drill, stale rollback proof, Gate 2 SLO evidence, and real RC
approvers. Evidence:
`docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-1609929e-2026-05-10.md`.

2026-05-10 post-release update: `DEPLOY-FRESHNESS-9C125683` proves production
Web build-info now exposes
`9c12568379ee77cda9c9e9df39879e141b5615fb`, a pushed batch that includes
`b414e523` live order cancel boundary support. Public API/Web smoke passes and
the no-secret final V1 preflight public checks pass, while V1 remains correctly
blocked on protected/formal evidence: liveimport readback auth, rollback guard
auth, production DB restore context, current activation/RC evidence,
`LIVEIMPORT-03` runtime readback, backup/restore drill, rollback proof, and
authenticated/admin UI clickthrough. Evidence:
`docs/planning/deploy-freshness-9c125683-task-2026-05-10.md`,
`docs/operations/deploy-freshness-9c125683-2026-05-10.md`, and
`docs/operations/v1-final-preflight-9c125683-2026-05-10.md`.

2026-05-10 implementation update: `EXCHANGE2-31` adds canonical
exchange-side `LIVE_ORDER_CANCEL` for Binance and Gate.io through
`orders.service.ts` -> `exchangeAdapterBoundary.service.ts` -> authenticated
connector. Exchange-backed local order state now changes only after the
boundary call succeeds; contextless exchange-backed rows remain fail-closed.
No real live-money cancel action is performed in this task. Focused exchange
tests, focused orders cancel tests, API typecheck, guardrails, docs parity, and
diff check passed. Production freshness is now covered by
`DEPLOY-FRESHNESS-9C125683`; the earlier deploy-lag artifact is superseded.
Evidence:
`docs/planning/exchange2-31-live-order-cancel-boundary-task-2026-05-10.md` and
`docs/operations/deploy-freshness-9c125683-2026-05-10.md`.

2026-05-10 implementation/deploy update: `EXCHANGE2-30` enabled Gate.io
`LIVE_ORDER_SUBMIT` through the canonical orders/exchange boundary and enables
Gate.io `LIVE_EXECUTION` compatibility gating. Gate.io exchange-side cancel
remains unsupported. No real live-money action is performed in this task.
Focused exchange tests, wallet e2e, Web capability test, API typecheck, Web
typecheck, production build-info for
`04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public deploy smoke passed.
The no-secret final V1 preflight public checks passed and remains correctly
blocked on protected/formal evidence.
Evidence:
`docs/planning/exchange2-30-gateio-live-order-submit-task-2026-05-10.md` and
`docs/operations/deploy-freshness-04a4204c-2026-05-10.md`.

2026-05-09 implementation update: `EXCHANGE2-29` enabled only Gate.io
`WALLET_CASHFLOW_HISTORY` through the existing exchange adapter boundary.
Focused exchange/wallet cashflow tests, API typecheck, guardrails, docs
parity, and diff check passed. Production build-info now exposes
`8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`, public API/Web smoke passes, and
the no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Gate.io live submit and exchange-side cancel remain unsupported.
Evidence:
`docs/planning/exchange2-29-gateio-wallet-cashflow-history-task-2026-05-09.md`
and `docs/operations/deploy-freshness-8ea7f33b-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-28` enabled only Gate.io
`TRADE_HISTORY_SNAPSHOT` through the existing authenticated-read boundary.
Focused exchange tests, authenticated snapshot service test, API typecheck,
guardrails, docs parity, and diff check passed. Production build-info now
exposes `432f768701300c7ba600fa7633532c0cc9ef4b96`, public API/Web smoke
passes, and the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Gate.io wallet cashflow history, live submit, and
exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-28-gateio-trade-history-snapshot-task-2026-05-09.md`
and `docs/operations/deploy-freshness-432f7687-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-27` enabled only Gate.io
`OPEN_ORDERS_SNAPSHOT` through the existing authenticated-read boundary.
Production build-info now exposes
`214a9c034d38ab8670fd4b43d0f8ed692d78d90c`, public API/Web smoke passes, and
the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Gate.io trade-history, live submit, and
exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-27-gateio-open-orders-snapshot-task-2026-05-09.md`
and `docs/operations/deploy-freshness-214a9c03-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-26` enabled only Gate.io
`POSITIONS_SNAPSHOT` through the existing authenticated-read boundary and
positions exchange-snapshot route. Gate.io open-orders/trade-history, live
submit, and exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-26-gateio-positions-snapshot-task-2026-05-09.md` and
`docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-25` enabled only Gate.io
`BALANCE_PREVIEW` through the existing authenticated-read boundary and wallet
preview route. Gate.io positions/open-orders/trade-history, live submit, and
exchange-side cancel remain unsupported. Evidence:
`docs/planning/exchange2-25-gateio-balance-preview-task-2026-05-09.md` and
`docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-24` enabled only Gate.io
`API_KEY_PROBE` through a shared exchange-aware profile API-key probe service.
Gate.io provided and stored profile API-key connection tests now pass through
the normal endpoint and write audit-safe metadata. The slice does not enable
Gate.io balance preview, positions/open-orders, trade-history, live submit, or
exchange-side cancel. Evidence:
`docs/planning/exchange2-24-gateio-api-key-probe-task-2026-05-09.md` and
`docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.

2026-05-09 implementation update: `EXCHANGE2-23` enabled Gate.io public PAPER
pricing through the shared capability matrix and existing public market-stream
source. The scope is intentionally limited to paper pricing: Gate.io LIVE
execution, API-key probe, authenticated reads, live submit, and exchange-side
cancel remain unsupported. Production build-info now exposes
`1dc55d9623bab11dacb5b9f8ce9634778c139249`, public API/Web smoke passes, and
no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Evidence:
`docs/planning/exchange2-23-gateio-paper-pricing-enable-task-2026-05-09.md`
and `docs/operations/deploy-freshness-1dc55d96-2026-05-09.md`.

2026-05-09 current production handoff: latest observed production Web
build-info is `e8cd748e80b8693087e01beb21b0085ace747c49`. Public API/Web
smoke passes, and no-secret final V1 preflight public checks pass while the
preflight remains correctly `BLOCKED` on protected/formal evidence. This
docs/evidence batch does not change runtime behavior, close protected V1
evidence, or enable Gate.io paper/live/authenticated support. Evidence:
`docs/planning/deploy-freshness-e8cd748e-task-2026-05-09.md`,
`docs/operations/deploy-freshness-e8cd748e-2026-05-09.md`, and
`docs/operations/v1-final-preflight-e8cd748e-2026-05-09.md`.

2026-05-09 public UI access refresh: production Web build-info reached
`745b5f5a45eab3f86b02e023479c8358f760bbf6`. Public routes return HTTP 200 and
unauthenticated dashboard/admin routes redirect to `/auth/login`. This does
not satisfy the full authenticated/admin module clickthrough audit and does
not change Gate.io paper/live/authenticated support. Evidence:
`docs/planning/prod-ui-public-access-refresh-745b5f5a-task-2026-05-09.md` and
`docs/operations/prod-ui-public-access-clickthrough-745b5f5a-2026-05-09.md`.

2026-05-09 protected runtime/preflight baseline: production Web build-info was
verified at `30b027b78544f76b5b638851e8e27c98f6d22ab5`. Public API
`/health`, API `/ready`, Web `/`, and no-secret final V1 preflight public
checks pass after the protected-backlog sync batch. Full authenticated/admin
production UI module clickthrough remains blocked until valid production app
access is available. Evidence:
`docs/planning/deploy-freshness-30b027b7-task-2026-05-09.md`,
`docs/operations/deploy-freshness-30b027b7-2026-05-09.md`, and
`docs/operations/v1-final-preflight-30b027b7-2026-05-09.md`.

2026-05-09 current production handoff: production Web build-info is current at
`ba3d852d5126b625a8cf702ab647d5c644d86f9c`. Public API `/health`, API
`/ready`, Web `/`, and no-secret final V1 preflight public checks pass after
the docs/status sync batch. Full authenticated/admin production UI module
clickthrough remains blocked until valid production app access is available.
Evidence:
`docs/planning/deploy-freshness-ba3d852d-task-2026-05-09.md`,
`docs/operations/deploy-freshness-ba3d852d-2026-05-09.md`, and
`docs/operations/v1-final-preflight-ba3d852d-2026-05-09.md`.

2026-05-09 current production handoff: production Web build-info is current at
`010b4f8b6abfaf4c24d26550eb4761215d119f21`. Public API `/health`, API
`/ready`, Web `/`, and no-secret final V1 preflight public checks pass after
the Gate.io source batch. Full authenticated/admin production UI module
clickthrough remains blocked until valid production app access is available.
Evidence:
`docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md`,
`docs/operations/v1-final-preflight-010b4f8b-2026-05-09.md`, and
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

2026-05-09 historical deploy lag note: pushed `origin/main`
`1f1d9c12e0cc99884eced81546802a261b0925e9` did not reach production within
the accepted 900-second build-info wait, the additional 300-second follow-up
waits, or the later 180-second follow-up wait. Later production build-info
advanced beyond that lag and now reports
`010b4f8b6abfaf4c24d26550eb4761215d119f21`, so `DEPLOY-LAG-1F1D9C12` is no
longer an active deploy-freshness blocker. Evidence:
`docs/planning/deploy-lag-1f1d9c12-task-2026-05-09.md` and
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

2026-05-09 deploy follow-up: the earlier `d355df93` handoff lag is closed,
and the later Gate.io source batch `010b4f8b6abfaf4c24d26550eb4761215d119f21`
is production-current. The temporary `010b4f8b` lag classification was caused
by using an incorrect full SHA in the first wait. Evidence:
`docs/planning/deploy-freshness-010b4f8b-task-2026-05-09.md` and
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.

2026-05-09 no-secret V1 preflight refresh: deployed `010b4f8b` passes
build-info and public API/Web smoke, but the current release posture is
`BLOCKED` on missing live-import auth, rollback auth, production DB restore
context for the active evidence date, failed/open RC evidence, missing
`LIVEIMPORT-03`, stale 2026-05-08 restore evidence, and stale 2026-05-08
rollback proof.

2026-05-09 activation refresh: production activation plan and activation
evidence audit are fresh `NO-GO` artifacts for 2026-05-09 and target the
latest protected operator pack source-of-truth sync. Current production
build-info is `30b027b78544f76b5b638851e8e27c98f6d22ab5`.
V1 remains blocked on protected auth, production DB restore context for the
active evidence date, failed/open RC evidence, `LIVEIMPORT-03`, and rollback
proof.

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

2026-05-09 dashboard runtime deploy freshness: the dashboard runtime aggregate
behavior source is `3c5da34371e22aecb1a7aff0a185018870d35cec`, and the current
production docs/evidence handoff deploy is
`30b027b78544f76b5b638851e8e27c98f6d22ab5`, which includes that runtime
behavior. Continue protected evidence work from `30b027b7` unless a newer
intended code/tooling candidate is first deployed and proven by production
build-info.

2026-05-09 protected access readiness: final V1 evidence is blocked because
the current shell has no `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, or
production DB/Coolify restore context env names. Do not attempt protected
readback, rollback proof, restore drill, final gate, or authenticated/admin UI
clickthrough until operator inputs are supplied.

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
the chosen deployed candidate through production build-info, then pass that
same SHA to the collector. Current protected readback target is deployed
`30b027b78544f76b5b638851e8e27c98f6d22ab5`:
`$releaseDate = Get-Date -Format yyyy-MM-dd; $expectedSha = "30b027b78544f76b5b638851e8e27c98f6d22ab5"; pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30; pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$releaseDate.json"`.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output cannot be treated as V1
evidence.

Before running protected evidence commands, use the read-only aggregate
preflight:
`pnpm run ops:release:v1:preflight -- --expected-sha 30b027b78544f76b5b638851e8e27c98f6d22ab5 --today 2026-05-09`.
It verifies the build-info-proven production SHA, reports missing prerequisite
env names, and classifies current release evidence blockers without creating
protected artifacts.

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

Production restore drill was previously closed as PASS through approved
Coolify terminal access for the 2026-05-08 evidence date. Evidence:
`docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md`. Latest
verified public/no-secret deploy is
`30b027b78544f76b5b638851e8e27c98f6d22ab5`.
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

The canonical `LIVEIMPORT-03` command now targets the latest build-info-proven
production SHA. Do not substitute local evidence-only `HEAD` unless production
build-info proves that SHA is deployed.

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

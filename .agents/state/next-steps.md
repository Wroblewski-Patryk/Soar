# Next Steps

Last updated: 2026-05-10

## Next Tiny Task

Latest production UI audit:
`PROD-UI-PUBLIC-CLICKTHROUGH-88313309-2026-05-10` refreshed no-auth UI
route/module evidence for deployed build-info
`88313309200d35275ba6c0d3465c5045c4b6d99e`. Public routes pass; dashboard,
admin, and legacy protected routes are `BLOCKED_AUTH` and redirect to
`/auth/login`. Next executable UI work requires valid `PROD_UI_AUDIT_*`
dashboard/admin auth and representative production data to perform the full
authenticated/admin module clickthrough. Evidence:
`docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`.

Latest release-gate truth:
`V1-CURRENT-RELEASE-GATE-DRY-RUN-2026-05-10` ran the production V1 release gate
in no-secret `--dry-run` mode against build-info
`8f8630b0ad5abd690409d6173c9b247b95948138`. Readiness is `not_ready`.
Fresh evidence exists for activation audit, activation plan, and production
backup/restore drill. Remaining blockers are `RC external gates failed`,
`RC sign-off failed`, `RC checklist failed`, missing `LIVEIMPORT-03` runtime
readback, rollback proof fresh but failed, and the need to run the final gate
without `--dry-run` after protected inputs are present. Evidence:
`docs/operations/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.

Latest operator target rule:
`V1-OPERATOR-RUNBOOK-DYNAMIC-SHA-2026-05-10` removes the need to re-sync static
SHA targets after docs-only deploys. The final blocker pack now reads
production `https://soar.luckysparrow.ch/api/build-info` and uses that value
as `$expectedSha`, unless an operator intentionally promotes one exact runtime
candidate and compares it first. Next executable V1 work still requires
operator-provided `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
`PROD_UI_AUDIT_*`, authenticated Gate 2 SLO, and real RC approver inputs.
Evidence: `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.

Latest Gate 2 evidence boundary:
`V1-SLO-GATE2-NOAUTH-PROBE-2026-05-10` proves Gate 2 cannot be completed from
this no-auth shell. The one-minute production SLO probe generated blocker
evidence only: protected workers/metrics/alerts returned `401`, queue/API/
live-order metrics were `NO_DATA`, and `/ready` had a short transient that
passed on follow-up public smoke. Next executable Gate 2 work requires an
operator-authenticated 30-minute SLO collector run, then RC gate status refresh.
Evidence: `docs/operations/v1-slo-gate2-noauth-probe-2026-05-10.md`.

Latest operator runbook target:
`V1-OPERATOR-RUNBOOK-CURRENT-SHA-SYNC-2026-05-10` updated the final blocker
execution pack and operator unblock checklist to latest verified deployed audit
SHA `5515f2105d52f25a0d875cbd0b55860a00b4da32`. The next executable V1 step
requires operator-provided `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
`PROD_UI_AUDIT_*`, and real RC approver/gate inputs. If a later docs-only sync
commit has already deployed, first verify the currently observed build-info SHA
and use that as `$expectedSha`; do not treat docs-only deploy freshness as
protected runtime proof. Evidence:
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` and
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md`.

Latest V1 coverage confidence audit:
`V1-COVERAGE-CONFIDENCE-AUDIT-2026-05-10` confirms the project should not be
called 100% V1-ready yet. Current audited production SHA is
`fd8da90bd77c2ddbed800eabd98479c1bd113ac4`; build-info and public preflight
smoke pass, but final preflight remains `BLOCKED` on liveimport auth/readback,
rollback guard auth/proof, failed RC evidence/sign-off/checklist, and missing
`LIVEIMPORT-03`. The no-auth UI module clickthrough reports public routes PASS
and dashboard/admin/legacy routes `BLOCKED_AUTH`. Next executable work requires
operator-provided `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
`PROD_UI_AUDIT_*`, and real RC approver/gate inputs. Evidence:
`docs/operations/v1-coverage-confidence-audit-2026-05-10.md`,
`docs/operations/v1-final-preflight-fd8da90b-2026-05-10.md`, and
`docs/operations/prod-ui-module-clickthrough-fd8da90b-2026-05-10.md`.

Latest production UI audit tooling:
`PROD-UI-MODULE-CLICKTHROUGH-RUNNER-2026-05-10` added
`ops:ui:prod-clickthrough` and captured current no-auth production evidence for
deployed `84e7c0e012a571f18396556a97198dbed08aba7c`. Public routes PASS;
dashboard/admin/legacy protected routes are `BLOCKED_AUTH`, which is correct
until app/admin credentials are supplied. Next executable UI work is to rerun
the same command with `PROD_UI_AUDIT_AUTH_*` and `PROD_UI_AUDIT_ADMIN_*`
inputs, plus representative route IDs through `--extra-routes` when needed.
Evidence:
`docs/planning/prod-ui-module-clickthrough-runner-task-2026-05-10.md` and
`docs/operations/prod-ui-module-clickthrough-84e7c0e0-2026-05-10.md`.

Latest rollback-proof refresh:
`V1-ROLLBACK-PROOF-BLOCKED-REFRESH-2026-05-10` captured current fail-closed
production rollback proof evidence for 2026-05-10. The proof is fresh but
`FAIL` because protected rollback guard auth is missing and production
runtime-freshness/alerts endpoints returned `401`. Final preflight for
deployed `8df3260b8453be0a39dfa75ce2be281d6571c4de` now reports rollback
proof `failed` instead of `stale`. Next executable V1 work requires either
`ROLLBACK_GUARD_*` auth to make rollback proof PASS, `LIVEIMPORT_READBACK_*`
auth to run `LIVEIMPORT-03`, real RC approver identities/gate evidence, or
authenticated/admin production UI access. Evidence:
`docs/planning/v1-rollback-proof-blocked-refresh-task-2026-05-10.md`,
`docs/operations/v1-rollback-proof-prod-2026-05-10T00-00-00-000Z.md`, and
`docs/operations/v1-final-preflight-8df3260b-2026-05-10.md`.

Latest production restore-drill refresh:
`V1-PROD-RESTORE-DRILL-REFRESH-2026-05-10` captured fresh PASS production
Postgres restore evidence through the approved Coolify terminal. The follow-up
no-secret final preflight for deployed
`969df7c8f268146ecff3efb9de2fe1841ac8bc75` now reports production DB restore
context `satisfied_by_evidence` and backup/restore drill evidence `fresh` for
2026-05-10. Next executable V1 work is one of the remaining protected/formal
lanes: provide `LIVEIMPORT_READBACK_*` app auth and run `LIVEIMPORT-03`,
provide `ROLLBACK_GUARD_*` auth and refresh rollback proof, provide real RC
approver identities/gate evidence, or provide authenticated/admin production
UI access for the module clickthrough. Evidence:
`docs/planning/v1-prod-restore-drill-refresh-task-2026-05-10.md`,
`docs/operations/v1-restore-drill-prod-2026-05-10T03-39-56Z.md`, and
`docs/operations/v1-final-preflight-969df7c8-2026-05-10.md`.

Latest Coolify deploy-queue recovery:
`V1-COOLIFY-DEPLOY-QUEUE-RECOVERY-2026-05-10` supersedes the older
`e70f5cf6` deploy-lag blocker. Production Web build-info exposes
`33a2ebc468be3dbfab7c784f375672ebead5ae16`, stale `soar-api` jobs were
cancelled through the operator-approved Coolify UI, one fresh `soar-api`
redeploy finished on the same SHA, public API/Web smoke passes, and the
Coolify queue is empty. Current no-secret final preflight is public PASS and
protected/formal BLOCKED. Next executable work requires protected
`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, production DB restore context,
real RC approver identities, or authenticated/admin production UI access.
Evidence:
`docs/operations/coolify-deploy-queue-recovery-33a2ebc4-2026-05-10.md` and
`docs/operations/v1-final-preflight-33a2ebc4-2026-05-10.md`.

Latest deploy-control readiness:
`V1-DEPLOY-CONTROL-READINESS-2026-05-10` confirms production deploy control is
manual Coolify/operator owned. The repository has CI checks only, no approved
no-secret production deploy trigger, and webhook/API credentials are
operator-held secrets. Next action requires operator-side Coolify
inspection/retrigger, approved deploy credentials, or explicit production
infrastructure authorization. Evidence:
`docs/operations/v1-deploy-control-readiness-2026-05-10.md`.

Latest deploy freshness blocker:
`DEPLOY-LAG-E70F5CF6-2026-05-10` records that pushed commit
`e70f5cf6229d6fc4d26ea0342b81baab80851800` did not reach production
build-info during two bounded wait windows; production still reports
`40e9b3c35c96d4acced73bbab980039f9e6b6a22`, while public smoke passes. Next
action is operator-side Coolify deploy inspection/retrigger or explicit
production infrastructure authorization. Evidence:
`docs/operations/deploy-lag-e70f5cf6-2026-05-10.md`.

Latest protected-input readiness:
`V1-PROTECTED-INPUTS-READINESS-2026-05-10` confirms this session does not have
the required protected env families for `LIVEIMPORT-03`, rollback proof, or
production DB restore context. Privileged VPS/Docker inspection was rejected by
the escalation reviewer and must not be bypassed. Next executable work requires
operator-provided credentials/context or explicit production infrastructure
authorization. Evidence:
`docs/operations/v1-protected-inputs-readiness-2026-05-10.md`.

Latest current preflight:
`V1-FINAL-PREFLIGHT-CURRENT-9D28F682` captured final no-secret preflight for
deployed `9d28f682f23dc176dbbad790bea8ddf213c8ac01`. Build-info and public
smoke pass; V1 remains `BLOCKED / NO-GO` only on protected/formal evidence.
The next executable work requires the operator inputs listed in
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md`: liveimport auth,
rollback guard auth, production DB restore context, and real RC approver
identities. Evidence:
`docs/planning/v1-final-preflight-current-9d28f682-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-9d28f682-2026-05-10.md`.

Latest operator unblock packet:
`V1-OPERATOR-UNBLOCK-CHECKLIST-2026-05-10` published the exact protected
inputs and command order needed to move V1 from `BLOCKED / NO-GO` to final
release evidence. The packet targets deployed
`822d92fc02067fa122e735ab6cc2783e438dc458`; current preflight build-info and
public smoke pass. Next executable work requires operator-provided
`LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, production DB restore context, and
real RC approver identities. Evidence:
`docs/operations/v1-operator-unblock-checklist-2026-05-10.md` and
`docs/operations/v1-final-preflight-822d92fc-2026-05-10.md`.

Latest activation evidence refresh:
`V1-PROD-ACTIVATION-REFRESH-2026-05-10` published fresh activation plan and
activation evidence audit artifacts as explicit `NO-GO`. Final preflight for
deployed `74752f025ef49bf5026ec92e056f59947e00a18f` now reports activation
plan/audit fresh, build-info/public smoke PASS, and V1 `BLOCKED` only on
protected/formal blockers: liveimport auth/readback, rollback guard auth,
production DB restore context, failed RC evidence, stale backup/restore drill,
and stale rollback proof. Next tiny task is protected evidence collection when
operator credentials and DB context are available; if they are not available,
the only useful no-secret task is to publish a concise operator unblock
checklist for those exact inputs. Evidence:
`docs/planning/v1-production-activation-refresh-2026-05-10-task.md` and
`docs/operations/v1-final-preflight-74752f02-2026-05-10.md`.

Latest release evidence refresh:
`V1-RC-BLOCKED-REFRESH-2026-05-10` refreshed RC external gates, RC sign-off,
and RC checklist as current blocked evidence. Final preflight for deployed
`1609929ed3b98c2b794d8a0b48ff0f39c16cd75f` now reports build-info/public
smoke PASS and RC evidence `failed` instead of `stale`. Next tiny task is to
refresh activation audit/plan as current `NO-GO` for the deployed SHA, because
that can be done without protected secrets. Protected tasks after that remain
blocked on liveimport auth/readback, rollback guard auth, production DB restore
context, backup/restore drill, rollback proof, Gate 2 SLO evidence, and real
RC approver identities. Evidence:
`docs/planning/v1-rc-blocked-evidence-refresh-task-2026-05-10.md` and
`docs/operations/v1-final-preflight-1609929e-2026-05-10.md`.

Latest release evidence:
`DEPLOY-FRESHNESS-9C125683-2026-05-10` proves production Web build-info now
exposes `9c12568379ee77cda9c9e9df39879e141b5615fb`, which includes the
`b414e523` live order cancel boundary. Public API/Web smoke passes. The
no-secret final V1 preflight public checks pass and remain correctly blocked
on protected/formal evidence: liveimport readback auth, rollback guard auth,
production DB restore context, current activation/RC evidence,
`LIVEIMPORT-03` runtime readback, backup/restore drill, rollback proof, and
authenticated/admin UI clickthrough. Next tiny task is to refresh one
protected/formal V1 evidence lane when operator credentials and production DB
restore context are available, or continue a no-secret status cleanup if those
inputs remain unavailable. Evidence:
`docs/planning/deploy-freshness-9c125683-task-2026-05-10.md`,
`docs/operations/deploy-freshness-9c125683-2026-05-10.md`, and
`docs/operations/v1-final-preflight-9c125683-2026-05-10.md`.

Current implementation slice:
`EXCHANGE2-31-LIVE-ORDER-CANCEL-BOUNDARY-2026-05-10` adds canonical
exchange-side `LIVE_ORDER_CANCEL` for Binance and Gate.io through the existing
orders/exchange/authenticated connector boundary. Focused exchange tests,
focused orders cancel tests, API typecheck, guardrails, docs parity, and diff
check pass. Production freshness is now proven by `DEPLOY-FRESHNESS-9C125683`;
the earlier deploy-lag artifact is superseded.

Latest local implementation slice:
`EXCHANGE2-30-GATEIO-LIVE-ORDER-SUBMIT-2026-05-10` enabled Gate.io
`LIVE_ORDER_SUBMIT` through the canonical orders/exchange boundary and enables
Gate.io shared `LIVE_EXECUTION` compatibility gating. Gate.io exchange-side
cancel remains unsupported. No real live-money action is performed in this
task. Focused exchange tests, wallet e2e, Web capability test, API typecheck,
Web typecheck, production build-info for
`04a4204ca9090586d49ae77b0dd8c1be048d7bdf`, and public deploy smoke pass. The
no-secret final V1 preflight public checks pass and remain correctly blocked on
protected/formal evidence. The remaining V1 blockers are protected production
evidence and authenticated/admin UI clickthrough. Evidence:
`docs/operations/deploy-freshness-04a4204c-2026-05-10.md`.

Latest local implementation slice:
`EXCHANGE2-29-GATEIO-WALLET-CASHFLOW-HISTORY-2026-05-09` enabled only Gate.io
`WALLET_CASHFLOW_HISTORY` through the existing exchange adapter boundary.
Gate.io live submit and exchange-side cancel remain unsupported. Focused
exchange/wallet cashflow tests, API typecheck, guardrails, docs parity, and
diff check pass. Production build-info now exposes
`8ea7f33b581ec0f3cf7d653168b160c31cbb23a8`, public deploy smoke passes, and
no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Evidence:
`docs/operations/deploy-freshness-8ea7f33b-2026-05-09.md`. The next Gate.io
implementation gap is `LIVE_ORDER_SUBMIT`, which is money-impacting and must
remain a separate protected-evidence task.

Latest local implementation slice:
`EXCHANGE2-28-GATEIO-TRADE-HISTORY-SNAPSHOT-2026-05-09` enabled only Gate.io
`TRADE_HISTORY_SNAPSHOT` through the existing authenticated-read boundary.
Gate.io wallet cashflow history, live submit, and exchange-side cancel remain
unsupported. Focused exchange tests, authenticated snapshot service test, API
typecheck, guardrails, docs parity, and diff check pass. Production build-info
now exposes `432f768701300c7ba600fa7633532c0cc9ef4b96`, public deploy smoke
passes, and no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-432f7687-2026-05-09.md`. The next exact
Gate.io gap is either `WALLET_CASHFLOW_HISTORY` if product scope requires
ledger ingestion parity, or `LIVE_ORDER_SUBMIT` if the user confirms Gate.io
live-money execution belongs in V1.

Latest local implementation slice:
`EXCHANGE2-27-GATEIO-OPEN-ORDERS-SNAPSHOT-2026-05-09` enabled only Gate.io
`OPEN_ORDERS_SNAPSHOT` through the existing authenticated-read boundary.
Gate.io trade-history, live submit, and exchange-side cancel remain
unsupported. Production build-info now exposes
`214a9c034d38ab8670fd4b43d0f8ed692d78d90c`, public deploy smoke passes, and
the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-214a9c03-2026-05-09.md`. The next exact
Gate.io authenticated-read gap is `TRADE_HISTORY_SNAPSHOT`.

Latest local implementation slice:
`EXCHANGE2-26-GATEIO-POSITIONS-SNAPSHOT-2026-05-09` enabled only Gate.io
`POSITIONS_SNAPSHOT` through the existing authenticated-read boundary and
positions exchange-snapshot route. Gate.io open-orders/trade-history, live
submit, and exchange-side cancel remain unsupported. The next exact Gate.io
authenticated-read gap is `OPEN_ORDERS_SNAPSHOT`. Production build-info now
exposes `4c7548acc74295f27676c1f00d79dbf58b873942`, public deploy smoke
passes, and the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-4c7548ac-2026-05-09.md`.

Latest local implementation slice:
`EXCHANGE2-25-GATEIO-BALANCE-PREVIEW-2026-05-09` enabled only Gate.io
`BALANCE_PREVIEW` through the existing authenticated-read boundary and wallet
preview route. Gate.io positions/open-orders/trade-history, live submit, and
exchange-side cancel remain unsupported. The next Gate.io authenticated-read
gap is `POSITIONS_SNAPSHOT`, but it carries higher live-read semantics and
should be implemented only through the exact authenticated snapshot contract.
Production build-info now exposes
`15dfacb9882fc4904a2bfcd91d8b58c05d3ac5dd`, public deploy smoke passes, and
the no-secret final V1 preflight remains correctly blocked on protected/formal
evidence. Evidence:
`docs/operations/deploy-freshness-15dfacb9-2026-05-09.md`.

Latest local implementation slice:
`EXCHANGE2-24-GATEIO-API-KEY-PROBE-2026-05-09` enabled Gate.io
`API_KEY_PROBE` for provided and stored profile API-key connection tests
through a shared exchange-aware probe service. This is credential validation
only; Gate.io balance preview, positions/open-orders, trade-history, live
submit, and exchange-side cancel remain unsupported. The next Gate.io gap is
the first exact authenticated read slice, likely `BALANCE_PREVIEW`, unless
protected production evidence becomes unblocked first. Production build-info
now exposes `e76e08a1a20b12abaeabf4edc44a38ba37619005`, public deploy smoke
passes, and the no-secret final V1 preflight remains correctly blocked on
protected/formal evidence. Evidence:
`docs/operations/deploy-freshness-e76e08a1-2026-05-09.md`.

Latest deployed implementation slice:
`EXCHANGE2-23-GATEIO-PAPER-PRICING-ENABLE-2026-05-09` enabled only Gate.io
public `PAPER_PRICING_FEED` through the shared capability matrix and existing
public market-stream source. Focused local validation passed, and production
Web build-info now exposes
`1dc55d9623bab11dacb5b9f8ce9634778c139249`; public API/Web smoke passes.
Gate.io `LIVE_EXECUTION`, `API_KEY_PROBE`, authenticated reads, live submit,
and exchange-side cancel remain unsupported. The next Gate.io gaps are
authenticated read operations and live submit, not paper capability gating.
Evidence: `docs/operations/deploy-freshness-1dc55d96-2026-05-09.md`.

Latest V1 completion gap report:
`docs/operations/v1-completion-gap-report-2026-05-09.md`.
Short answer: the app is not broadly missing; remaining 100% readiness is
blocked by protected production evidence, authenticated/admin UI clickthrough,
Gate.io paper/live implementation beyond public market data, and a few
product/UX confidence gaps. Use this report before starting more broad
implementation or deploy-evidence loops.

Current deployed production build-info candidate:
`1dc55d9623bab11dacb5b9f8ce9634778c139249`.

Latest observed pushed batch is deployed:
`e8cd748e80b8693087e01beb21b0085ace747c49`. Production build-info matches
this SHA, public API/Web smoke passes, and no-secret final V1 preflight public
checks pass while protected/formal evidence remains correctly `BLOCKED`. This
batch is docs/evidence only over the protected runtime baseline; it does not
change runtime behavior, close protected V1 evidence, or enable Gate.io
paper/live/authenticated capabilities. Evidence:
`docs/planning/deploy-freshness-e8cd748e-task-2026-05-09.md` and
`docs/operations/deploy-freshness-e8cd748e-2026-05-09.md`.

Latest protected runtime/preflight baseline:
`30b027b78544f76b5b638851e8e27c98f6d22ab5`. Production build-info advanced
from `ba3d852d` to the protected-backlog sync batch on the follow-up wait
attempt 11. Public API/Web smoke and no-secret final V1 preflight public checks
pass for this SHA. The batch records the `ba3d852d` deploy evidence and
retargets the protected V1 backlog/runbook instructions.

Previous pushed batch:
`ba3d852d5126b625a8cf702ab647d5c644d86f9c`. Production build-info advanced
from `010b4f8b` to the docs/status sync batch on the corrected wait attempt 2.
Public API/Web smoke and no-secret final V1 preflight public checks pass for
this SHA. The batch records the `010b4f8b` deploy freshness, closes the
historical `1f1d9c12` deploy-lag queue entry, and syncs the stale historical
`V1TRUTH-01` checkbox. It does not change runtime behavior or enable Gate.io
paper/live/authenticated capabilities.

Previous pushed batch:
`010b4f8b6abfaf4c24d26550eb4761215d119f21`. Production build-info advanced
from `d355df93` to the Gate.io source batch after the earlier wait used an
incorrect full SHA for short commit `010b4f8b`; the corrected build-info wait
passed on attempt 1. Public API/Web smoke and the no-secret final preflight
public checks pass for this SHA. The prior evidence batch
`1f1d9c12e0cc99884eced81546802a261b0925e9` timed out during the 900-second
production build-info wait, two additional 300-second follow-up waits, and a
later 180-second follow-up wait with production still on `c50e1e7c`. After the
`d355df93` operator handoff/source-of-truth commit was pushed, a bounded
120-second follow-up wait initially timed out on the same production SHA, but
the next batch wait later showed production on `d355df93`. See
`docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`.
Current shell still has no protected live-import, rollback, production DB, or
authenticated/admin app context, so the next V1 action remains protected
operator evidence rather than another public deploy wait.
Diff scope confirmed pushed `1f1d9c12` had no `apps`, `packages`, `prisma`, or
`scripts` changes over deployed `c50e1e7c`; it was a docs/evidence batch. The
latest deployed `010b4f8b` includes Gate.io source-smoke tooling and public
symbol-rule behavior, while Gate.io paper/live/authenticated capabilities
remain disabled.

Runtime/dashboard behavior source candidate:
`3c5da34371e22aecb1a7aff0a185018870d35cec`.

Completed for that candidate:
- dashboard runtime aggregate current-state API fix
- `HomeLiveWidgets` aggregate current-row regression coverage
- production build-info freshness and public smoke with `--no-workers`
- no-secret final V1 preflight showing public checks PASS
- public/unauthenticated production UI access and auth-gate refresh
- protected operator handoff docs pushed as one batch and verified on
  production build-info
- source-of-truth synchronization batch pushed as one group and verified on
  production build-info
- protected-backlog/source-of-truth sync batch pushed and verified on
  production build-info
- protected operator pack/source-of-truth sync batch pushed and verified on
  production build-info
- public/unauthenticated production UI access refreshed for the same deployed
  batch
- historical pushed evidence lag ending at `1f1d9c12` is closed by later
  build-info progress

Evidence:
- `docs/operations/prod-ui-public-access-clickthrough-745b5f5a-2026-05-09.md`
- `docs/planning/dashboard-runtime-current-state-aggregate-task-2026-05-09.md`
- `docs/planning/dashboard-runtime-widget-aggregate-current-render-task-2026-05-09.md`
- `docs/operations/deploy-freshness-3c5da343-2026-05-09.md`
- `docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`
- `docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`
- `docs/operations/deploy-freshness-4ee1672e-2026-05-09.md`
- `docs/operations/v1-final-preflight-4ee1672e-2026-05-09.md`
- `docs/operations/prod-ui-public-access-clickthrough-4ee1672e-2026-05-09.md`
- `docs/operations/deploy-freshness-55469cdc-2026-05-09.md`
- `docs/operations/v1-final-preflight-55469cdc-2026-05-09.md`
- `docs/operations/deploy-freshness-6c54bb5d-2026-05-09.md`
- `docs/operations/v1-final-preflight-6c54bb5d-2026-05-09.md`
- `docs/operations/deploy-freshness-c50e1e7c-2026-05-09.md`
- `docs/operations/v1-final-preflight-c50e1e7c-2026-05-09.md`
- `docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`
- `docs/operations/deploy-lag-1f1d9c12-2026-05-09.md`

Next executable V1 steps are protected and remain blocked until the operator
supplies authenticated/admin production app access, live-import auth, rollback
auth, production DB/Coolify context for current-date restore evidence, and real
RC approval identities. Do not treat public health/build-info, public UI
access, or local regression suites as completion evidence for `LIVEIMPORT-03`,
rollback proof, restore proof, RC approval, or authenticated module clickthrough.
BOTMULTI-09 is also current against production build-info:
`f3aaa3dca6cf4d4b199372563886165638391a77` is contained in deployed
`30b027b78544f76b5b638851e8e27c98f6d22ab5`, but BOTMULTI remains open until
protected runtime/V1 gate evidence is collected.
Use `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` and the
current protected access readiness artifact before running the full blocker
pack.

UX/UI process note: future UX/UI work must start with the autonomous memory
preflight now documented in `docs/governance/user-feedback-loop.md`,
`docs/ux/design-memory.md`, and `docs/ux/screen-quality-checklist.md`.
Classify user feedback as reusable rule, visual direction, anti-pattern,
screen-specific feedback, open design decision, or recurring agent mistake;
store it in the matching source of truth; and record applied design-memory
entries in the active task before implementation. Evidence:
`docs/planning/ux-ui-memory-autonomy-process-task-2026-05-08.md`.

Second-exchange implementation is now planned with `GATEIO` selected as the
target exchange. Use
`docs/planning/second-exchange-live-readiness-plan-2026-05-08.md` as the
canonical staged plan. Do not enable broad `LIVE_EXECUTION` or
`PAPER_PRICING_FEED` for another exchange until exact operation support is
implemented and verified. Gate.io public market catalog is the first adapter
slice and remains separate from paper/live/authenticated capabilities. The
foundation slices now generalize runtime market events, add an exchange-module
Gate.io public ticker/candle reader, and add an opt-in
`MARKET_STREAM_EXCHANGE=GATEIO` polling adapter that publishes canonical
ticker/candle events without misrepresenting Gate.io as Binance. Runtime
regression coverage now also locks Gate.io ticker and final-candle fallback
consumption context. Remaining required implementation/evidence before Gate.io
paper enablement: verify runtime consumption from the Gate.io event source in a
target environment, then enable `PAPER_PRICING_FEED` only if that evidence is
clean. Remaining required
user/operator decisions: whether the next live slice is API-key probe,
authenticated readback, live order submit, and whether exchange-side cancel is
in scope.
Local source-path regression is now also covered: `EXCHANGE2-07` proves the
Gate.io polling worker publishes through `publishMarketStreamEvent` and
subscribers receive canonical `GATEIO/FUTURES` ticker/candle events. The next
Gate.io paper-readiness boundary is deployed or target-environment source
evidence; do not enable `PAPER_PRICING_FEED` from local mocked evidence alone.
`EXCHANGE2-21` now adds real public source evidence: the new
`ops:exchange:gateio-market-stream-smoke` runner captured `GATEIO/FUTURES`
`BTCUSDT` ticker and final `1m` candle events from
`ExchangePublicPollingMarketStreamWorker` without credentials, writes, or live
orders. This advances source confidence but still does not enable
`PAPER_PRICING_FEED`; deployed build-info/source evidence and exact capability
enablement remain required before paper support.
`EXCHANGE2-22` also decouples public symbol rules from `LIVE_EXECUTION`:
Gate.io can now resolve public symbol rules through the existing
`MARKET_CATALOG`/market-map boundary, while exchanges without market catalog
still fail closed and Gate.io paper/live/authenticated capabilities remain
disabled.
Post-push build-info for `4ef3ec58` remained stale on
`d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` during the 120-second wait, even
though public smoke passed.
Follow-up production build-info now exposes
`36ac02696ac0ce22a6b8bab545fcfb741125ea4b`, and public smoke passed. Gate.io
`PAPER_PRICING_FEED` still remains disabled until target-environment source
evidence proves the live polling source behavior cleanly.
Real public Gate.io adapter smoke is now captured:
`docs/operations/gateio-public-market-data-smoke-2026-05-08.md` shows
`GATEIO/FUTURES/BTCUSDT` ticker and `1m` candle reads passing through
`exchangePublicMarketData.service.ts` without secrets or writes. This still
does not enable `PAPER_PRICING_FEED`; the remaining Gate.io paper boundary is
target worker/source evidence and exact capability enablement.
Post-push public smoke for the evidence commit `d4bdc7f0` passed, but
build-info stayed on `36ac02696ac0ce22a6b8bab545fcfb741125ea4b` during the
120-second wait.
Worker bootstrap source selection is now locally regression-locked:
`EXCHANGE2-09` proves Binance remains the default market-stream source, Gate.io
polling is selected only by `MARKET_STREAM_EXCHANGE=GATEIO`, and invalid env
values fall back to safe defaults. This is still not production target-source
evidence and does not enable Gate.io `PAPER_PRICING_FEED`. Follow-up
production build-info reached
`9382d9317a5ae82d404559398922a253bef9e697`, and public API/Web smoke passed.
Web capability gating is now locally regression-locked: `EXCHANGE2-10` proves
Gate.io appears as a shared exchange option but only supports `MARKET_CATALOG`;
paper pricing, live execution, and API-key probe remain blocked in UI gating.
Post-push public API/Web smoke for `21ec8efa` passed, but build-info stayed on
`9382d9317a5ae82d404559398922a253bef9e697` during the 120-second wait.
Product-facing wallet/bot setup gates are also locally regression-locked:
`EXCHANGE2-11` proves Gate.io PAPER wallet submit and Gate.io bot activation
remain blocked while `PAPER_PRICING_FEED` is unsupported.
Direct API wallet setup is now also locally regression-locked: `EXCHANGE2-12`
proves a direct Gate.io PAPER wallet create request fails closed with
`EXCHANGE_NOT_IMPLEMENTED` for `PAPER_PRICING_FEED` and leaves no user wallet
persisted. This still does not enable Gate.io paper pricing; target
worker/source evidence remains required before capability enablement.
Direct API wallet update is now also locally regression-locked: `EXCHANGE2-13`
proves an existing Binance PAPER wallet cannot be updated to `GATEIO` while
`PAPER_PRICING_FEED` is unsupported, and the persisted wallet remains
unchanged after rejection.
Stored API-key probing is now locally regression-locked: `EXCHANGE2-14` proves
a stored Gate.io placeholder key can exist, but the stored probe endpoint fails
closed with `EXCHANGE_NOT_IMPLEMENTED` for `API_KEY_PROBE` and writes no
connection-test audit log.
Stored-key wallet balance preview is now locally regression-locked:
`EXCHANGE2-15` proves a stored Gate.io placeholder key cannot be used for
wallet preview while `BALANCE_PREVIEW` authenticated reads are unsupported, and
the key remains unused after rejection.
Explicit-key positions snapshot reads are now locally regression-locked:
`EXCHANGE2-16` proves a stored Gate.io placeholder key cannot be selected via
`apiKeyId` while `POSITIONS_SNAPSHOT` is unsupported; the route returns HTTP
501 with unsupported capability details and leaves `lastUsed` unchanged.
Open-orders and trade-history reconciliation snapshots are now locally
regression-locked: `EXCHANGE2-17` proves stored Gate.io placeholder keys cannot
reach `OPEN_ORDERS_SNAPSHOT` or `TRADE_HISTORY_SNAPSHOT` test fallback data
while those authenticated-read operations are unsupported, and `lastUsed`
remains unchanged after rejection.
Gate.io LIVE order submit is now locally regression-locked at the exchange
boundary: `EXCHANGE2-18` proves `LIVE_ORDER_SUBMIT` fails closed before
credential resolution, connector construction, pretrade guards, leverage
convergence, or live order adapter creation.
Exchange-backed cancel is now locally regression-locked at the API route:
`EXCHANGE2-19` proves `/dashboard/orders/:id/cancel` returns HTTP 501 with
`LIVE_ORDER_CANCEL_UNSUPPORTED` for persisted exchange-backed open orders,
leaves the order open, and writes no cancellation audit log. Gate.io and all
other exchange-side cancel capabilities remain disabled until a canonical
adapter operation exists.
The pushed Gate.io fail-closed batch is now deployed: production build-info
exposes `90cd07d602f0a31f315719b8a5cd5be3fd112313`, and public API/Web smoke
passed. Evidence:
`docs/operations/deploy-freshness-90cd07d6-2026-05-08.md`.
Final V1 preflight deploy checks are now portable on this Windows workstation:
`runV1FinalPreflight.mjs` calls bundled Node scripts directly for build-info
and public smoke instead of depending on global `pnpm`. The refreshed no-secret
preflight for deployed `90cd07d6` reports build-info PASS and public smoke
PASS, then blocks only on protected live-import auth/readback, rollback
auth/proof, and RC Gate 4 evidence. Evidence:
`docs/operations/v1-final-preflight-90cd07d6-2026-05-08.md`.
Second-exchange planning is now reconciled with the deployed Gate.io
foundation. Treat `EXCHANGE2-LIVE-READINESS-PLAN-2026-05-08` as complete
planning, not an open implementation blocker. The current supported Gate.io
truth is narrow: public catalog plus public `FUTURES`/swap market-data
foundation only. Keep `PAPER_PRICING_FEED`, authenticated reads,
`LIVE_ORDER_SUBMIT`, and `LIVE_ORDER_CANCEL` unsupported until exact operation
support and evidence exist. Evidence:
`docs/planning/exchange2-20-plan-reconciliation-task-2026-05-09.md`.

After the planned Gate.io/deploy-auth blockers are cleared, execute the
production UI module clickthrough audit from
`docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`. The audit
now has current production build-info at
`c50e1e7cf1e37d9c799031cacbb30a834f57e81d` and latest public access evidence
for the same SHA, but must still wait for
authenticated/admin app access, representative production test data, and
explicit operator approval before any live-money or destructive action.
Public-only checks cannot prove protected dashboard/admin flows.
The public/unauthenticated access slice has been captured at
`docs/operations/prod-ui-public-access-clickthrough-c50e1e7c-2026-05-09.md`:
API health and readiness passed, public routes returned HTTP 200, and
protected dashboard/admin routes redirected to `/auth/login`. It does not
satisfy the full module clickthrough because no authenticated/admin production
app session is available.
After pushing the public-access evidence commit
`d55a86007b80733d67e793c261a5208c6734ab79`, public smoke still passed but
build-info remained stale on `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` during
the 120-second wait.
Refreshed public/unauthenticated production access evidence is now current for
the deployed Gate.io fail-closed batch:
`docs/operations/prod-ui-public-access-clickthrough-90cd07d6-2026-05-09.md`
shows Web build-info matching
`90cd07d602f0a31f315719b8a5cd5be3fd112313`, API `/health` and `/ready`
passing, public Web routes returning HTTP 200, and unauthenticated
dashboard/admin routes returning HTTP 307 to `/auth/login`. This still does
not satisfy the full production UI module clickthrough, which remains blocked
on authenticated/admin production app access.
The current no-secret V1 final preflight for deployed
`90cd07d602f0a31f315719b8a5cd5be3fd112313` is now refreshed for 2026-05-09 at
`docs/operations/v1-final-preflight-90cd07d6-2026-05-09.md`. Build-info and
public smoke pass, but V1 remains `BLOCKED` on missing live-import auth,
rollback auth, production DB restore context, missing `LIVEIMPORT-03`, and
stale 2026-05-08 release evidence for the 2026-05-09 evidence date.
Production activation plan and activation evidence audit are now fresh
2026-05-09 `NO-GO` artifacts:
`docs/planning/v1-production-activation-and-evidence-plan-2026-05-09.md` and
`docs/operations/v1-production-activation-evidence-audit-2026-05-09.md`.
The follow-up preflight confirms those two evidence families are fresh; the
remaining blockers are protected auth, production DB restore context, stale
RC/recovery evidence, missing `LIVEIMPORT-03`, and rollback proof.
RC external gates status, RC sign-off, and RC checklist are now also current
for 2026-05-09 as blocked/open evidence. The final preflight now reports RC
evidence as fresh `failed`, not stale. Remaining V1 blockers are protected
auth, production DB restore context, `LIVEIMPORT-03`, backup/restore freshness,
rollback proof, and real RC approval.
Rollback proof tooling now supports `--today <yyyy-mm-dd>` for the next
authenticated operator run. The actual 2026-05-09 rollback proof is still not
captured because this shell lacks approved protected auth/network execution;
do not accept sandbox fetch failures as production rollback evidence.
Restore drill tooling now also supports `--today <yyyy-mm-dd>` for the next
production DB/Coolify run. The actual 2026-05-09 restore drill is still not
captured because this shell lacks approved production DB/Coolify execution
context; do not accept local or empty restore output as production evidence.
The final blocker execution pack is now synced to those date-aware commands:
set `$releaseDate` once and reuse it for preflight, restore drill, rollback
proof, RC status/sign-off/checklist, live-import output paths, and the final
release gate. Evidence:
`docs/planning/v1-final-blocker-pack-date-overrides-task-2026-05-09.md`.
The dashboard runtime aggregate batch is now deployed: production Web
build-info exposes `3c5da34371e22aecb1a7aff0a185018870d35cec`, and public
API/Web smoke passed for API `/health`, API `/ready`, and Web `/`. Evidence:
`docs/operations/deploy-freshness-3c5da343-2026-05-09.md`. Continue from the
final blocker pack against this deployed SHA; do not treat this public smoke as
protected runtime, restore, rollback, RC approval, or authenticated UI evidence.
The no-secret final V1 preflight for deployed `3c5da343` is now fresh:
`docs/operations/v1-final-preflight-3c5da343-2026-05-09.md`. Build-info and
public smoke pass. Remaining blockers are live-import auth, rollback auth,
production DB restore context, failed RC evidence, missing `LIVEIMPORT-03`, and
stale restore/rollback proof evidence for the 2026-05-09 evidence date.
Public production UI access evidence has been refreshed for the same deployed
candidate at
`docs/operations/prod-ui-public-access-clickthrough-3c5da343-2026-05-09.md`;
it confirms public route reachability and unauthenticated auth gates only.
The final blocker execution pack now separates the deployed code/tooling
candidate from local evidence-only commits. For protected evidence, derive
`$expectedSha` from production `/api/build-info` at the start of the operator
run unless the operator intentionally compares one exact intended runtime
candidate first.
Evidence:
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
Protected access readiness is currently BLOCKED. Names-only checks in this
shell found no `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, or production
DB/Coolify restore context env names. Evidence:
`docs/operations/v1-protected-access-readiness-2026-05-09.md`. The next
executable step requires protected app/operator auth, DB/Coolify context, RC
approval identities, and authenticated/admin UI access.

The local V1 backend paper/live runtime line is closed for this slice: focused
parity/crash coverage, DB-backed runtime/order/exchange/import/readback packs,
and the full local API suite pass. Continue at the remaining production
evidence boundary, not by reopening local backend packs unless code changes or
new failures appear.

Local DB-backed runtime evidence is available if the `default` Docker context
or existing local ports are used; avoid treating the unhealthy `desktop-linux`
context as the only Docker signal.

```powershell
docker --context default info --format '{{.ServerVersion}}'
Test-NetConnection -ComputerName localhost -Port 5432
pnpm --filter api run test -- src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.exchangeEvents.feeBackfill.test.ts src/modules/positions/livePositionReconciliation.service.test.ts src/modules/bots/bots.runtime-takeover.e2e.test.ts --run --sequence.concurrent=false
```

Next production release evidence line:

Latest pushed `main` is deployed through the accepted Coolify operator path,
not GitHub Actions. GitHub Actions production promote/rollback entrypoints have
been removed because the project does not use paid GitHub Actions and workflow
attempts create unwanted email noise.

```powershell
$buildInfo = Invoke-RestMethod "https://soar.luckysparrow.ch/api/build-info"
$expectedSha = $buildInfo.gitSha
$expectedSha
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 15
```

After production build-info exposes the selected SHA, continue with
`docs/operations/v1-final-blocker-execution-pack-2026-05-07.md` once
production auth and DB/Coolify access are available. Start with
`pnpm run ops:release:v1:preflight`; it is read-only and reports deploy
freshness, missing prerequisite env names, and current release evidence
blockers without creating protected artifacts. Then continue with
`LIVEIMPORT-03` authenticated read-only production runtime readback on the
current pushed `main` V1 backend parity candidate or later.
Evidence must cover ownership, `strategyId` or single-strategy provenance
recovery, TTP visibility, actionable state, and import completeness across
assigned bot markets. Do not run live-money or destructive production actions.
The collector is hardened to fail closed when no RUNNING session produces a
runtime positions payload, so no-session output must not be accepted as
release evidence.

Latest protected-context recheck after the final blocker pack confirmed
production build-info is current at
`e6e7d4a044ce80279c542412a91bae4a6a012392`, and public API/Web smoke passes.
Coolify project/resource pages are reachable after switching to Root Team, and
the production Postgres container is visible as
`x11cfnz1dd9x0yzccftqzcoe`. Local Docker does not expose that remote
container, so the existing Docker-based restore drill cannot honestly run as
production PASS evidence from this workstation. The current shell still lacks
the required Soar production auth/access. A no-auth collector attempt failed
closed before runtime readback, which is the expected safe result. The latest
no-secret status reports are:
`docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
and
`docs/operations/v1-final-preflight-2026-05-08-protected-context.md`.

The production restore drill is now PASS through approved Coolify terminal
access. Evidence:
`docs/operations/v1-restore-drill-prod-2026-05-08T15-16-24Z.md` and
`docs/operations/_artifacts-restore-drill-prod-coolify-2026-05-08T15-16-24Z.json`.
The corrected run created a compressed backup, restored it into isolated DB
`postgres_restore_check_20260508151624`, validated key table counts, dropped
the restore DB, removed the backup dump, and cleanup verification returned `0`
matching restore DBs.

Final preflight now treats that fresh restore drill evidence as satisfying the
production DB restore context prerequisite. The current `ops:release:v1:preflight`
run still exits `BLOCKED`, but the remaining blockers are now limited to
live-import auth, rollback guard auth, failed RC Gate 4 approval evidence,
missing `LIVEIMPORT-03` readback, and failed rollback proof. The latest
rollback proof rerun failed closed on protected `401` responses and is recorded
in `docs/operations/v1-rollback-proof-prod-2026-05-08T15-30-28-231Z.md`.
The current no-secret preflight snapshot for deployed SHA
`052df82244ea0f81e8611ff8bb2b677db115bd19` is committed at
`docs/operations/_artifacts-v1-final-preflight-current.json` and
`docs/operations/v1-final-preflight-current.md` for Web/operator status
visualization.

The next executable production evidence step requires approved Soar
application/operator auth for `LIVEIMPORT-03` and rollback proof, or real RC
Gate 4 approver identities. Do not reuse the Coolify login as Soar application
auth unless the user explicitly confirms it is valid for that target.

Post-backend-parity and restore-context check: production web build-info
reached `721fe8482922835a9419f0e529baeef4ff6a74c9`, which includes the
adapter-pure PAPER/LIVE runtime fix, blocker evidence alignment, deploy-wait
coordination docs, live-import release-gate evidence enforcement, build-info
freshness hardening, strict RC approval evidence enforcement, and final
preflight restore-context classification. Public deploy smoke without workers
passed. Continue with
authenticated read-only `LIVEIMPORT-03` production runtime readback once
credentials are available. Do not use GitHub Actions for production
deployment.

Canonical command once auth is available:

```powershell
$releaseDate = Get-Date -Format yyyy-MM-dd
$buildInfo = Invoke-RestMethod "https://soar.luckysparrow.ch/api/build-info"
$expectedSha = $buildInfo.gitSha
$expectedShaShort = $expectedSha.Substring(0, 8)
$expectedSha
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output "docs/operations/liveimport-03-prod-readback-$expectedShaShort-$releaseDate.json"
```

If the operator is promoting one exact intended runtime candidate, compare that
intended SHA with production build-info before protected readback. Do not
substitute local evidence-only `HEAD` unless production build-info proves that
SHA is deployed or the user/operator explicitly confirms those docs-only
changes are irrelevant to the protected readback.

## Candidate Backlog

0. Follow the final blocker execution pack:
   `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`.
0-preflight. Run `pnpm run ops:release:v1:preflight` first. It should be
   `BLOCKED` until live-import auth, rollback auth, RC approval, live-import
   readback, and rollback evidence are all present. Fresh production restore
   drill evidence now satisfies the production DB restore context prerequisite,
   so missing DB envs are not a blocker once that evidence is fresh/PASS. The
   command also runs public API/Web smoke with worker checks disabled, prints
   env variable names only, and writes no protected evidence artifacts. Its
   prerequisite classification and public-smoke skip path are covered by
   focused regression tests in `scripts/runV1FinalPreflight.test.mjs`. For
   later Web/operator visualization, use `--json-output <path>` to write a
   no-secret structured status report; this report is not final V1 release
   evidence. The preflight also emits no-secret `next actions` for known
   blockers, pointing back to the approved commands in the final blocker
   execution pack. Its JSON report includes `blockerDetails` so later
   Web/operator status can render blocker category, severity, protected-input
   requirement, final-evidence requirement, and remediation availability
   without parsing blocker strings. For a human-readable operator handoff from
   the same no-secret data, add `--markdown-output <path>`; the Markdown report
   is status only and not final release evidence.
0a. Production build-info is the default protected evidence target source.
   The final blocker execution pack now reads
   `https://soar.luckysparrow.ch/api/build-info` at the start of the operator
   run and assigns `$expectedSha = $buildInfo.gitSha`. Do not use GitHub
   Actions. If an operator is promoting one exact intended runtime candidate,
   compare that intended SHA with production build-info first. If a future step
   depends on a pushed commit being deployed, wait for build-info before
   continuing; an operator can speed this up with Coolify dashboard force
   deploy, or with deploy webhook/API token if those secrets are available
   outside the repository.
1. If production credentials or ops auth are available, execute
   `ops:liveimport:readback` with the build-info-derived `$expectedSha`.
   Record redacted `LIVEIMPORT-03` evidence only after the protected readback
   succeeds. The latest names-only prerequisite sweep found no required
   `LIVEIMPORT_READBACK_*` inputs in this shell. The collector names the exact
   accepted auth variable choices on the fail-closed missing-auth path. The
   evidence run must include actual protected runtime positions payloads for
   the requested symbols. The final V1 release gate requires this artifact as
   `LIVEIMPORT-03 runtime readback` and blocks with
   `evidence:liveImportReadback:missing` until it exists.
2. If authenticated readback remains unavailable, keep `LIVEIMPORT-03` open and
   do not downgrade it to public health/build-info evidence.
3. After `LIVEIMPORT-03`, continue `BOTMULTI-09` protected runtime readback and
   broader V1 release gate evidence.
4. Refresh production V1 release evidence with real non-dry-run execution:
   backup/restore drill evidence is fresh/PASS; rollback proof is fresh but
   failed in the latest report. Activation audit and activation plan are fresh,
   while RC status, RC sign-off, and RC checklist are fresh blocked/NO-GO
   artifacts for 2026-05-08.
   - Rollback proof and runtime freshness need protected OPS auth. Required
     auth env choices are now explicit in the tool/help path:
     `ROLLBACK_GUARD_AUTH_TOKEN`, or `ROLLBACK_GUARD_AUTH_EMAIL` plus
     `ROLLBACK_GUARD_AUTH_PASSWORD`, with optional OPS basic/header envs.
   - Gate 4 sign-off needs real Engineering, Product, Operations, and RC owner
     names. The sign-off builder now prints missing required Gate 4 fields on
     the blocked path; owner contact is recommended for rollback authority
     handoff. The final V1 release gate now also fails fresh RC artifacts until
     the external-gates status shows Gate 4 `PASS`, the sign-off record reports
     `RC status: APPROVED`, and the checklist shows `G4=PASS`.
   - Final release gate must run without `--dry-run` and with the
     build-info-derived `$expectedSha` plus the deployed web base URL so
     build-info freshness is enforced inside the gate.
5. If the active queue is empty, run a planning-status sweep before saying
   nothing is planned.

## Continuation Command Handling

On "rob dalej", "rób dalej", "kontynuuj", "continue", or "next":

1. Read `.agents/core/operating-system.md`.
2. Read this file.
3. Cross-check canonical planning.
4. Pick one task.
5. Execute through `.agents/core/execution-loop.md`.

# Next Steps

Last updated: 2026-05-08

## Next Tiny Task

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

After the planned Gate.io/deploy-auth blockers are cleared, execute the
production UI module clickthrough audit from
`docs/planning/prod-ui-module-clickthrough-audit-plan-2026-05-08.md`. The audit
must wait for latest `main` in build-info and authenticated/admin app access;
public-only checks cannot prove protected dashboard/admin flows.
The public/unauthenticated access slice has been captured at
`docs/operations/prod-ui-public-access-clickthrough-2026-05-08.md`: API health
and readiness passed, public routes returned HTTP 200, and protected
dashboard/admin routes redirected to `/auth/login`. It does not satisfy the
full module clickthrough because build-info is still stale at
`d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` versus expected `373a0ceb`, and no
authenticated/admin production app session is available.
After pushing the public-access evidence commit
`d55a86007b80733d67e793c261a5208c6734ab79`, public smoke still passed but
build-info remained stale on `d0dc6459e5fa33a8e5f68c5fc36dd29cc1df440d` during
the 120-second wait.

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
$expectedSha = git rev-parse HEAD
pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 15
```

After Coolify deploy exposes the promoted SHA, continue with
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
$expectedSha = git rev-parse HEAD
pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output docs/operations/liveimport-03-prod-readback-2026-05-08.json
```

If production build-info reports a deployed commit older than latest `main`,
wait for the accepted Coolify/manual deploy before protected readback. Do not
start `LIVEIMPORT-03` against a stale deployment unless the user/operator
explicitly confirms the checked-out docs-only changes are irrelevant to the
readback. Latest verified Coolify deploy:
`721fe8482922835a9419f0e529baeef4ff6a74c9`.

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
0a. Production build-info reached the backend parity runtime fix, blocker
   evidence alignment, deploy-wait coordination, operator preflight hardening
   docs, live-import release-gate evidence enforcement, build-info freshness
   enforcement, strict RC approval evidence enforcement, and restore-context
   preflight alignment at
   `721fe8482922835a9419f0e529baeef4ff6a74c9`. Do not use GitHub Actions. If a
   future step depends on a pushed commit being deployed, wait for build-info
   before continuing; an operator can speed this up with Coolify dashboard
   force deploy, or with deploy webhook/API token if those secrets are
   available outside the repository.
1. If production credentials or ops auth are available, execute
   `ops:liveimport:readback` for the currently checked-out `HEAD` after
   build-info confirms that `HEAD` is deployed, and record redacted
   `LIVEIMPORT-03` evidence. The latest names-only prerequisite sweep found
   only `FIGMA_OAUTH_TOKEN` in this shell. The collector now names the exact
   accepted auth variable choices on the fail-closed missing-auth path. The
   evidence run must include actual protected runtime positions payloads for
   the requested symbols. The final V1 release gate now requires this artifact
   as `LIVEIMPORT-03 runtime readback` and blocks with
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
   - Final release gate must run without `--dry-run` and with
     `--expected-sha $(git rev-parse HEAD)` plus the deployed web base URL so
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

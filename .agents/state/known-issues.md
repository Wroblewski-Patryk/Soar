# Known Issues

Last updated: 2026-05-10

## Active Issues

- 2026-05-10 update: the Binance key-readiness blocker is closed after
  deployment of `8cd5c1b3`. Stored key production test now passes with both
  Spot and Futures permissions true. The remaining live-runtime blocker is
  `LIVEIMPORT-03` returning `NO_RUNNING_SESSION`; a controlled runtime session
  proof is still required before V1 can claim live readback readiness. Evidence:
  `docs/operations/prod-api-runtime-readiness-8cd5c1b3-2026-05-10.md`.

- 2026-05-10 update: before
  `FUTURES-ONLY-APIKEY-ACCEPTANCE-2026-05-10`, a Futures-only key could still
  fail profile validation because the generic probe treated missing Spot as
  total failure. This is fixed locally and pending deployment. After deploy,
  production key readiness must be rerun with the corrected endpoint before
  deciding whether the LIVE Futures bot can be started.

- 2026-05-10 update: the production Binance key probe evidence in
  `PROD-API-RUNTIME-READINESS-F3CB9A24-2026-05-10` is ambiguous, not
  authoritative. The operator confirmed the key is Futures-capable; local code
  review found the probe relied on implicit CCXT balance-scope defaults and
  sequential scope checks. `BINANCE-FUTURES-APIKEY-PROBE-SCOPE-FIX-2026-05-10`
  fixes this locally by probing scopes independently and passing explicit
  Binance Futures balance params. The fixed probe still needs deployment and a
  production rerun before key readiness is accepted.

- 2026-05-10 update: LIVE Binance Futures startup is blocked by production
  account/runtime readiness, not by route reachability. Authenticated API
  modules are reachable, but the stored Binance key probe reports
  `spot: true` and `futures: false`; `LIVEIMPORT-03` also cannot pass because
  the configured LIVE bot has no running runtime session. Do not start the
  LIVE Futures bot until the Binance Futures key is remediated and readback is
  rerun successfully. Evidence:
  `docs/operations/prod-api-runtime-readiness-f3cb9a24-2026-05-10.md`.

- 2026-05-10 update: authenticated/admin production UI route/module
  reachability is no longer blocked after
  `PROD-UI-AUTH-CLICKTHROUGH-39A52703-2026-05-10`. The current PASS evidence
  covers route/module reachability only; deeper production action/form
  clickthrough, live-money actions, `LIVEIMPORT-03`, rollback proof PASS,
  Gate 2 SLO, and RC approval remain separate V1 proof lanes. Evidence:
  `docs/operations/prod-ui-module-clickthrough-39a52703-2026-05-10.md`.
- 2026-05-10 update: the architecture function audit's local implementation
  and docs findings are closed by
  `V1-ARCH-BOUNDARY-CLEANUP-2026-05-10`. API-key probe CCXT client
  construction now lives behind `modules/exchange`, and Gate.io runtime/
  exchange docs are refreshed. Remaining V1 issues are protected proof and
  formal approval lanes, not this local architecture mismatch. Evidence:
  `docs/planning/v1-architecture-boundary-cleanup-task-2026-05-10.md` and
  `docs/operations/v1-architecture-function-audit-2026-05-10.md`.
- 2026-05-10 update: function/module coverage audit confirms the remaining V1
  issue is not a broad missing implementation backlog, but protected proof and
  formal release approval. V1 remains blocked on `LIVEIMPORT-03` protected
  runtime readback, rollback proof PASS, authenticated/admin production UI
  clickthrough, authenticated Gate 2 SLO, RC approval/sign-off/checklist, and
  final non-dry-run release gate. Evidence:
  `docs/operations/v1-function-coverage-audit-2026-05-10.md`.
- 2026-05-10 update: final no-secret preflight for production build-info
  `8220532920e484da9ddaa021ac64b5de4cc5e6e1` is current and `BLOCKED`.
  Build-info, public smoke, activation artifacts, and production restore drill
  are fresh/satisfied; remaining blockers are liveimport auth/readback,
  rollback guard auth/proof PASS, RC external gates/sign-off/checklist, and
  authenticated/admin UI proof. Evidence:
  `docs/operations/v1-final-preflight-82205329-2026-05-10.md`.
- 2026-05-10 update: latest no-auth production UI audit for build-info
  `88313309200d35275ba6c0d3465c5045c4b6d99e` passes public routes and shows
  dashboard/admin/legacy protected routes as `BLOCKED_AUTH` redirecting to
  `/auth/login`. This is current fail-closed evidence only; full UI module
  clickthrough still requires valid production dashboard/admin auth and
  representative data. Evidence:
  `docs/operations/prod-ui-module-clickthrough-88313309-2026-05-10.md`.
- 2026-05-10 update: the current production V1 release-gate dry-run for
  build-info `8f8630b0ad5abd690409d6173c9b247b95948138` is `not_ready`.
  Remaining release-gate blockers are failed RC external gates, failed RC
  sign-off, failed RC checklist, missing `LIVEIMPORT-03` runtime readback,
  failed rollback proof, and the fact that production release gate still needs
  a non-dry-run execution once protected inputs are available. Evidence:
  `docs/operations/v1-release-gate-prod-2026-05-10Tcurrent-buildinfo-dry-run.md`.
- 2026-05-10 update: RC Gate 2 SLO evidence cannot be completed without
  protected ops auth. A one-minute no-auth production SLO probe produced
  blocker evidence only: `/health` PASS, `/ready` transient 50% availability
  in the short window, protected workers/metrics/alerts `401`, and queue/API/
  live-order metrics `NO_DATA`. Follow-up public smoke passed, so treat the
  `/ready` result as a monitoring signal and keep Gate 2 blocked on an
  authenticated 30-minute SLO run.
- 2026-05-10 update: authenticated/admin production UI clickthrough remains
  blocked on app/admin auth. The new `ops:ui:prod-clickthrough` runner proves
  public route reachability and fail-closed protected redirects, but the
  accepted V1 UI proof still requires a rerun with production dashboard/admin
  credentials and representative data.
- 2026-05-10 update: rollback proof is fresh for the current evidence date but
  still failed, as expected, because no protected `ROLLBACK_GUARD_*` auth is
  available. The production rollback guard endpoints returned protected `401`
  responses, so the proof correctly reports `shouldRollback=true` and must not
  be treated as release PASS evidence.
- 2026-05-10 update: production restore drill is fresh again for the current
  evidence date. Approved Coolify terminal access produced PASS evidence and
  no-secret preflight now treats production DB restore context as satisfied by
  evidence. This closes only the restore-context lane; remaining V1 blockers
  are liveimport app auth/readback, rollback guard auth/proof, real RC approval
  evidence, and authenticated/admin production UI clickthrough.
- 2026-05-10 update: the `e70f5cf6` deploy lag is superseded. Coolify showed
  stale `soar-api` jobs still queued/in progress after production Web
  build-info had advanced. The stale jobs were cancelled through the
  operator-approved Coolify UI, one fresh `soar-api` redeploy finished on
  `33a2ebc468be3dbfab7c784f375672ebead5ae16`, public API/Web smoke passed,
  and the Coolify queue was empty. Future agents should inspect Coolify before
  pushing another batch when the queue is non-empty.
- Local Docker Desktop `desktop-linux` context is unhealthy on this
  workstation and can return pipe `500 Internal Server Error`, but the
  `default` Docker context and local Postgres/Redis ports were reachable on
  2026-05-08. DB-backed runtime e2e packs passed sequentially after verifying
  the reachable stack. Future runs should check both contexts/ports before
  declaring DB-backed validation blocked.
- Production build-info reached
  `1100b7fb232ce6195b24522a6a11559fe9fb8634`, which contains the V1 backend
  parity runtime fix, blocker evidence alignment, deploy-wait coordination
  docs, live-import release-gate evidence enforcement, build-info freshness
  enforcement, and strict RC approval evidence enforcement. Do not use GitHub
  Actions for production deployment; the operator confirmed that path is not
  allowed and creates unwanted email noise. If a future task depends on a
  pushed commit being deployed, wait for build-info before continuing.
- Production build-info later reached
  `90cd07d602f0a31f315719b8a5cd5be3fd112313`, which contains the Gate.io
  fail-closed regression batch through `EXCHANGE2-19`; public API/Web smoke
  passed. This closes the immediate deploy-freshness lag for that batch, but
  protected/authenticated UI audit and release evidence remain blocked on
  credentials/access.
- After the c50e1e7c evidence/public-access batch was pushed, `origin/main`
  advanced to `1f1d9c12e0cc99884eced81546802a261b0925e9` while production
  build-info remained on `c50e1e7cf1e37d9c799031cacbb30a834f57e81d` for a
  full 900-second wait, two additional 300-second follow-up waits, and a later
  180-second follow-up wait. Treat this as a deploy lag note, not protected
  runtime or final V1 evidence. Current
  shell also has no Coolify deploy hook/API token env names and no working
  authenticated SSH/VPS inspection context.
- 2026-05-09 update: production build-info later advanced to `d355df93`,
  closing that prior handoff lag, and then to the Gate.io source batch
  `010b4f8b6abfaf4c24d26550eb4761215d119f21`. The temporary
  pushed-but-not-deployed classification for `010b4f8b` was caused by using an
  incorrect full SHA in the first wait, not by an actual production lag.
- Final V1 preflight previously depended on global `pnpm` for its internal
  public deploy checks and could falsely report build-info/public-smoke
  blockers on this workstation. The command now invokes bundled Node scripts
  directly for those checks; remaining preflight blockers after deployed
  `90cd07d6` are protected auth/readback, rollback auth/proof, and RC Gate 4
  approval evidence.
- Production restore drill is no longer an active blocker after the approved
  Coolify terminal PASS evidence. `ops:release:v1:preflight` now treats fresh
  restore evidence as satisfying the production DB restore context
  prerequisite, while raw env prerequisite evaluation remains fail-closed.
  Remaining V1 preflight blockers are protected live-import auth/readback,
  rollback guard auth/proof, and real RC Gate 4 approval evidence.
- Production deployment freshness initially lagged after the pushed V1 audit
  candidate, but a later build-info wait passed and production now reports
  `1f816362c93e117e47cfe52a35e0fec93bd0b37d`.
- After the readback collector/docs push, `origin/main` advanced to
  `6bf5de83a482eda08543138d8518e0aa23ccb3c6` while production remained on
  `1f816362c93e117e47cfe52a35e0fec93bd0b37d`. Treat this as a docs/tooling
  deploy-lag note, not a runtime blocker for `LIVEIMPORT-03`.
- After the collector hardening push, `origin/main` advanced to
  `21bb52f1e4b8865aab0dbb83ecffe698061fd7a3` while production build-info
  remained on `6bf5de83b8ed285410ecc10ecc50a2567ac68ee1` after a 180-second
  canonical wait. Public API `/health` and `/ready` are healthy. Treat this as
  another ops-tooling deploy-lag note, not authenticated runtime readback
  evidence. A later canonical wait passed for `21bb52f1...`, so this deploy
  lag is closed for the code/tooling commit.
- `FULLARCH-FIX-01` fixed the confirmed bot runtime visibility regression for
  recovered imported LIVE positions with
  `continuityState=RECOVERED_UNACTIONABLE` and `syncState=DRIFT`. Remaining
  live-import risk is now per-symbol diagnostics and authenticated production
  readback.
- `FULLARCH-FIX-02` added local DB-backed evidence that the approved happy path
  imports six exchange positions into six selected-bot visible runtime
  positions when all six symbols are inside canonical bot ownership scope.
- `FULLARCH-FIX-03` added structured per-symbol reconciliation diagnostics.
  `V1-LIVE-IMPORT-STATUS-ISOLATION-2026-05-07` then fixed the authenticated
  live-status route so those diagnostics are user-scoped instead of global.
  Remaining live-import risk is authenticated production readback and, if
  needed, Web/operator presentation of those diagnostics.
- `FULLARCH-FIX-04` repaired broad Web test harness drift around local
  `next/navigation` mocks missing `usePathname`; full Web tests are green
  again (`145/145` files, `482/482` tests).
- `FULLARCH-FIX-05` repaired the API e2e root-suite blockers around bot
  market-group creation, single-active-scope fixtures, manual LIVE
  exchange-synced open-order wallet proof, and stale DB cleanup. Root workspace
  tests are green again (`api 174/174 files, 1163/1163 tests`; `web 145/145
  files, 482/482 tests`).
- `FULLARCH-FIX-06` closed the remaining local Binance futures snapshot
  normalization coverage gap. Signed `positionAmt` now normalizes to positive
  `contracts`, `positionSide=BOTH` derives one-way side from amount sign, and
  explicit adapter side remains highest-priority truth.
- `FULLARCH-FIX-07` closed the local post-repair runtime validation follow-up:
  focused runtime signal, pre-trade/risk, order lifecycle, exchange events,
  imported-position DCA visibility, takeover readback, and position automation
  suites passed (`16/16` files, `240/240` tests).
- `FULLARCH-FIX-08` closed the local security/isolation release-gate follow-up:
  focused auth/session, trusted origin, rate limit, security headers,
  API-key/profile/admin/subscription/upload, bot entitlement, and
  cross-module data-isolation suites passed (`18/18` files, `87/87` tests).
- `FULLARCH-FIX-09` closed focused local API+Web evidence for strategy,
  backtests, reports, and logs/audit trail after the Web harness repair: API
  pack passed (`12/12` files, `92/92` tests) and Web pack passed (`21/21`
  files, `49/49` tests).
- `FULLARCH-FIX-10` closed focused local API+Web evidence for market stream
  and dashboard/bot monitoring after the Web harness repair: API pack passed
  (`9/9` files, `63/63` tests) and Web pack passed (`19/19` files, `79/79`
  tests).
- `FULLARCH-FIX-11` closed focused local API+Web evidence for wallet/capital,
  market universe, and bot topology configuration paths that support
  exchange-position import and selected-bot runtime scope: API pack passed
  (`11/11` files, `80/80` tests) and Web pack passed (`21/21` files, `49/49`
  tests).
- Operator-reported one-of-six live position import is most likely an exact
  ownership/symbol-scope mismatch until production readback proves otherwise:
  only positions matching `apiKeyId + marketType + symbol` for one active,
  opted-in, wallet-backed bot with `manageExternalPositions=true` can become
  bot-managed.
- `LIVEIMPORT-03` remains open because authenticated read-only production
  runtime positions readback for the reported LIVE ETH/DOGE rows has not been
  captured on current production build-info
  `c50e1e7cf1e37d9c799031cacbb30a834f57e81d`.
  `ops:liveimport:readback` is now the canonical read-only collector once
  credentials are available. It is hardened to fail closed when no RUNNING
  session produces runtime positions readback, so a no-session artifact cannot
  satisfy the release gate.
- `BOTMULTI-09` remains open for protected runtime readback and broader V1
  release gate evidence, even though public build-info now contains the
  original BOTMULTI candidate.
- Production V1 release-gate dry-run on 2026-05-07 reports stale required
  evidence for activation audit, activation plan, RC external gates status, RC
  sign-off, RC checklist, backup/restore drill evidence, and rollback proof
  pack. This is separate from `LIVEIMPORT-03` authenticated runtime readback.
- Activation audit and activation plan were refreshed as 2026-05-07 `NO-GO`
  artifacts. The remaining stale release-gate evidence is RC external gates
  status, RC sign-off, RC checklist, backup/restore drill evidence, and
  rollback proof pack.
- RC external gates status, RC sign-off, and RC checklist are now fresh for
  2026-05-07 but intentionally blocked/open. Remaining stale release-gate
  artifacts are backup/restore drill evidence and rollback proof pack.
- Backup/restore drill and rollback proof are now fresh but failed for
  2026-05-07. Restore needs production DB/Coolify access; rollback proof needs
  protected OPS auth.
- Final blocker prerequisite recheck after the execution pack found only
  `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB` by names-only env scan in this shell.
  Production build-info is now current through the backend parity runtime fix
  at `da1e52cf...`, but no Soar production readback, rollback, or DB/Coolify
  access is available locally.
- 2026-05-08 backend parity production readback attempt found the same local
  auth blocker: `ops:liveimport:readback` against deployed
  `da1e52cfec0b70e5a94e59d75fe702a55c348d74` failed closed with missing
  read-only production auth token or login credentials. Names-only env scan
  found only `FIGMA_OAUTH_TOKEN` and `IGCCSVC_DB`.
- 2026-05-08 V1 release-gate dry-run is `not_ready`:
  `docs/operations/v1-release-gate-prod-2026-05-08T05-36-43-320Z.md` marks
  activation, RC external gates, RC sign-off, and RC checklist fresh for
  2026-05-08. Backup/restore drill is fresh but failed due to missing
  production DB/Coolify access. Rollback proof is fresh but failed because
  protected runtime freshness and alerts endpoints return HTTP `401` without
  auth.
- Follow-up production build-info check observed production at
  `e6ccbedaa1d0074d5dc335935bb6b51a9bb1e387` while latest `main` was
  `d1755b45fc5a6fa901b86519366188efe743a05a`. This is docs/state deploy lag;
  the runtime fix remains deployed. A `LIVEIMPORT-03` collector attempt
  against deployed `e6ccbeda...` still failed closed with missing read-only
  production auth.
- RC strict production evidence check now narrows RC blockers to Gate 4:
  missing Engineering/Product/Operations/RC owner names and final status still
  `BLOCKED`. Gate 1, Gate 2, and Gate 3 are `PASS`.
- 2026-05-08 deploy coordination follow-up: the docs/state deploy wait commit
  `0a2e2353177c15d4a4934c03837835785e01d710` reached production build-info
  and public deploy smoke passed. The remaining blockers are still protected
  access and sign-off blockers, not public deploy freshness.
- 2026-05-08 live-import auth preflight hardening is closed: the collector now
  names the exact accepted auth variable choices when missing auth blocks
  readback, and no-auth validation still creates no artifact. This improves
  operator handoff but does not close `LIVEIMPORT-03`.
- 2026-05-08 recovery proof preflight hardening is closed: restore and
  rollback proof tooling now names exact production DB/auth env choices on
  help or fail-closed paths. This improves operator handoff but does not close
  restore drill or rollback proof evidence.
- 2026-05-08 RC sign-off preflight hardening is closed: blocked sign-off builds
  now print the exact missing required Gate 4 fields, while owner contact is
  reported as recommended handoff metadata. This improves operator handoff but
  does not approve Gate 4.
- 2026-05-08 current deployed-HEAD release-gate dry-run is fresh and still
  `not_ready`: activation and RC evidence families are fresh, backup/restore
  drill and rollback proof are fresh but failed, and dry-run mode blocks final
  approval. This confirms the remaining blockers are protected evidence and
  approval inputs, not deploy freshness.
- 2026-05-08 release-gate live-import evidence enforcement is closed:
  production V1 release gate now requires the protected `LIVEIMPORT-03`
  runtime readback artifact. The latest dry-run blocks on
  `evidence:liveImportReadback:missing`, so final `ready` cannot bypass the
  active bot live-import blocker.
- 2026-05-08 release-gate build-info freshness hardening is closed:
  production V1 release gate now accepts `--expected-sha` and runs the existing
  web build-info wait step before deploy smoke. Final `ready` cannot bypass a
  stale production deploy when the final blocker pack command is used.
- 2026-05-08 release-gate RC approval evidence hardening is closed:
  production V1 release gate now fails fresh RC external-gate, sign-off, and
  checklist artifacts unless Gate 4 is `PASS`, `RC status: APPROVED` is
  present, and the checklist shows `G4=PASS`. Latest dry-run
  `docs/operations/v1-release-gate-prod-2026-05-08Trc-approval-required-dry-run.md`
  reports `evidence:rcExternalGateStatus:failed`,
  `evidence:rcSignoffRecord:failed`, and `evidence:rcChecklist:failed`, so
  final `ready` cannot bypass real Gate 4 approval.
- 2026-05-08 final V1 preflight command is available:
  `pnpm run ops:release:v1:preflight` is the safe first operator command. In
  this shell it passes build-info for current `HEAD`, then blocks on missing
  production auth/DB env names and current release evidence blockers without
  creating protected artifacts.
- 2026-05-08 final V1 preflight prerequisite checks are now regression-locked
  with focused tests. This prevents incomplete production auth/DB env sets from
  being silently accepted by the preflight.
- 2026-05-08 protected-context Coolify sweep confirms deploy freshness and
  public smoke, and identifies production Postgres container
  `x11cfnz1dd9x0yzccftqzcoe`. This does not close restore evidence because the
  existing restore drill runs through `docker exec`, and the local Docker
  daemon does not contain the production container. A VPS shell or Docker
  context that can reach that container is still required.
- 2026-05-08 update: production restore drill is now closed as PASS through
  approved Coolify terminal access for `x11cfnz1dd9x0yzccftqzcoe`. The
  remaining protected evidence blockers are `LIVEIMPORT-03` auth/readback,
  rollback proof auth, and RC Gate 4 approval.

## Known Environment Pitfalls

- `rg` can fail on this Windows workstation with `Odmowa dostepu`; use
  PowerShell `Get-ChildItem` and `Select-String` as fallback.
- Browser plugin validation can fail if it resolves system Node `v22.13.0`
  instead of the bundled Codex runtime. See
  `.codex/context/LEARNING_JOURNAL.md`.
- DB-backed API packs that share cleanup tables should run sequentially when
  used as closure evidence.
- Local Prisma may have migration-history drift; inspect before treating it as
  a current repository regression.

## Product Risk Watchlist

- LIVE/PAPER runtime parity and dashboard truth remain the highest-risk areas.
- Backend/frontend runtime label and lifecycle mappings must stay centralized
  where shared semantics exist.
- Operator-visible UI should stay production-grade and avoid debug-looking
  badges or invented fallback truth.
- Production release evidence tasks that need credentials must not be marked
  done from public health/build-info checks or local regression packs alone.

## 2026-07-02 LUC-6870 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement and blocking release/authenticated production acceptance. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6870-production-performance-server-health-watch-2026-07-02.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance. | 2026-07-02 |

## 2026-07-02 LUC-6846 Duplicate Repair-Lane And Release Overclaim Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| V1 audit-to-completion could create duplicate TSA/Backend/QVE/DRE children or overclaim release readiness while existing blocked owner paths already cover the failed checks. | P1 | mitigating_blocked_on_existing_owner_paths | `history/evidence/luc-6846-v1-audit-to-completion-controller-2026-07-02.md` | Keep [LUC-6331](/LUC/issues/LUC-6331), [LUC-6002](/LUC/issues/LUC-6002), [LUC-6461](/LUC/issues/LUC-6461), [LUC-6468](/LUC/issues/LUC-6468), [LUC-4103](/LUC/issues/LUC-4103), and [LUC-6820](/LUC/issues/LUC-6820) as active owner paths; create new children only for fresh unrouted failed checks. | 2026-07-02 |
| Protected release/account input families remain missing in this runner. | P0 | fail_closed_existing_security_ops_path | `history/artifacts/luc-6846-protected-input-readiness-2026-07-02.json` | Security/Ops or board-capable protected secret owner binds missing families through approved encrypted runtime paths without exposing values. | 2026-07-02 |

## 2026-07-02 LUC-6830 Security Account-Access Gate Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| V1 release/account-access gate could be overclaimed while required protected input families are missing, even though focused local security boundary tests pass. | P0 | blocked | `history/evidence/luc-6830-security-account-access-gate-sweep-2026-07-02.md`; `history/artifacts/luc-6830-security-account-access-gate-readiness-2026-07-02.json` | Security/Ops protected secret owner binds `ROLLBACK_GUARD_*`, `SOAR_PROD_*`, `PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*` through approved encrypted runtime paths; QA/Ops reruns protected proof after binding and production restoration. | 2026-07-02 |

## 2026-07-02 LUC-6784 Duplicate Repair-Lane And Release Overclaim Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Gap-register refresh could create duplicate TSA/Backend/QVE/DRE child lanes or overclaim release readiness while existing blocked owner paths already cover the failed checks. | P1 | mitigating_blocked_on_existing_owner_paths | `history/evidence/luc-6784-gap-register-and-repair-lane-refresh-2026-07-02.md` | Keep [LUC-6331](/LUC/issues/LUC-6331), [LUC-6584](/LUC/issues/LUC-6584), [LUC-6594](/LUC/issues/LUC-6594), [LUC-6002](/LUC/issues/LUC-6002), [LUC-6468](/LUC/issues/LUC-6468), [LUC-6461](/LUC/issues/LUC-6461), and [LUC-4103](/LUC/issues/LUC-4103) as active owner paths; create new children only for fresh unrouted failed checks. | 2026-07-02 |
| Protected account-access families remain missing in this runner. | P0 | fail_closed_existing_security_ops_path | `history/artifacts/luc-6784-protected-input-readiness-2026-07-02.json` | Security/Ops binds missing families through approved encrypted runtime paths without exposing values. | 2026-07-02 |

## 2026-07-02 LUC-6757 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement and blocking release/authenticated production acceptance. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6757-production-performance-server-health-watch-2026-07-02.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance. | 2026-07-02 |

## 2026-07-02 LUC-6750 Duplicate Repair-Lane And Release Overclaim Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Gap-register refresh could create duplicate TSA/Backend/QVE/DRE child lanes or overclaim release readiness while existing blocked owner paths already cover the failed checks. | P1 | mitigating_blocked_on_existing_owner_paths | `history/evidence/luc-6750-gap-register-and-repair-lane-refresh-2026-07-02.md` | Keep [LUC-6331](/LUC/issues/LUC-6331), [LUC-6584](/LUC/issues/LUC-6584), [LUC-6594](/LUC/issues/LUC-6594), [LUC-6002](/LUC/issues/LUC-6002), [LUC-6468](/LUC/issues/LUC-6468), [LUC-6461](/LUC/issues/LUC-6461), and [LUC-4103](/LUC/issues/LUC-4103) as active owner paths; create new children only for fresh unrouted failed checks. | 2026-07-02 |
| Protected account-access families remain missing in this runner. | P0 | fail_closed_existing_security_ops_path | `history/artifacts/luc-6750-protected-input-readiness-2026-07-02.json` | Security/Ops binds missing families through approved encrypted runtime paths without exposing values. | 2026-07-02 |

## 2026-07-02 LUC-6733 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement and blocking release/authenticated production acceptance. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6733-production-performance-server-health-watch-2026-07-02.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance. | 2026-07-02 |

## 2026-07-02 LUC-6720 Duplicate Repair-Lane And Release Overclaim Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Gap-register refresh could create duplicate TSA/Backend/QVE/DRE child lanes or overclaim release readiness while existing blocked owner paths already cover the failed checks. | P1 | mitigating_blocked_on_existing_owner_paths | `history/evidence/luc-6720-gap-register-and-repair-lane-refresh-2026-07-02.md` | Keep [LUC-6331](/LUC/issues/LUC-6331), [LUC-6584](/LUC/issues/LUC-6584), [LUC-6594](/LUC/issues/LUC-6594), [LUC-6002](/LUC/issues/LUC-6002), [LUC-6468](/LUC/issues/LUC-6468), and [LUC-6461](/LUC/issues/LUC-6461) as active owner paths; create new children only for fresh unrouted failed checks. | 2026-07-02 |

## 2026-07-02 LUC-6711 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement and blocking release/authenticated production acceptance. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6711-production-performance-server-health-watch-2026-07-02.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance. | 2026-07-02 |

## 2026-07-01 LUC-6688 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement and blocking authenticated production acceptance. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6688-production-performance-server-health-watch-2026-07-01.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance. | 2026-07-01 |

## 2026-07-01 LUC-6662 Duplicate Repair-Lane And Release Overclaim Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Gap-register refresh could create duplicate TSA/Backend/QVE/DRE child lanes or overclaim release readiness while existing blocked owner paths already cover the failed checks. | P1 | mitigating_blocked_on_existing_owner_paths | `history/evidence/luc-6662-gap-register-and-repair-lane-refresh-2026-07-01.md` | Keep [LUC-6331](/LUC/issues/LUC-6331), [LUC-6584](/LUC/issues/LUC-6584), and [LUC-6594](/LUC/issues/LUC-6594) as active owner paths; create new children only for fresh, unrouted failed checks. | 2026-07-01 |

## 2026-07-01 LUC-6660 Production Acceptance Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Soar V1 can be over-claimed as production accepted while production Web root/build-info return `503` and protected worker readiness returns `503`. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6660-authenticated-production-acceptance-performance-sweep-2026-07-01.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331); QVE reruns acceptance after restoration. | 2026-07-01 |

## 2026-07-01 LUC-6608 Production Acceptance Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Authenticated production acceptance can be overclaimed while production Web root/build-info return `503` and protected runtime checks cannot be accepted from this runner without current approved auth bindings. | P0 | blocked_by_existing_ops_and_security_owner_paths | `history/evidence/luc-6608-authenticated-production-acceptance-performance-sweep-2026-07-01.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331); Security/Ops ensures approved protected runtime auth bindings; QVE reruns acceptance. | 2026-07-01 |

## 2026-07-01 LUC-6594 Security Account-Access Gate Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| V1 release/account-access gate could be overclaimed while required protected input families are missing, even though local server-side security boundary tests pass. | P0 | blocked | `history/evidence/luc-6594-security-account-access-gate-sweep-2026-07-01.md` | Security/Ops protected secret owner binds `ROLLBACK_GUARD_*`, `SOAR_PROD_*`, `PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*` through approved encrypted runtime paths; QA/Ops reruns protected proof after production restoration. | 2026-07-01 |

## 2026-07-01 LUC-6584 Regression Evidence Sweep

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Regression baseline can be overclaimed while Web/API/backtests repeatable smoke is red and public Web is still unavailable. | P1 | blocked | `history/evidence/luc-6584-regression-evidence-sweep-2026-07-01.md` | TAE/FEW triages Web test timeouts; Ops/DRE restores local Docker; Ops/Coolify resolves [LUC-6331](/LUC/issues/LUC-6331); QVE reruns after blockers clear. | 2026-07-01 |

## 2026-07-01 LUC-6546 V1 Release Blocker Routing Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| V1 audit-to-completion could overclaim release readiness or create duplicate TSA repair lanes while production Web/worker restoration and protected-input gates remain unresolved. | P1 | mitigating_blocked_on_existing_owner_paths | `history/evidence/luc-6546-v1-audit-to-completion-controller-2026-07-01.md` | Keep [LUC-6331](/LUC/issues/LUC-6331) with Ops/DRE and missing protected input binding with Security/Ops; create TSA children only for fresh unrouted architecture mismatch. | 2026-07-01 |

## 2026-07-01 LUC-6489 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement and blocking authenticated production acceptance. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6489-production-performance-server-health-watch-2026-07-01.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE/QVE rerun smoke and acceptance. | 2026-07-01 |

## 2026-07-01 LUC-6387 Duplicate Repair-Lane And Release Overclaim Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Gap-register refresh could create duplicate TSA/Backend/QVE/DRE child lanes or overclaim release readiness while existing blocked owner paths already cover the failed checks. | P1 | mitigating | `history/evidence/luc-6387-gap-register-and-repair-lane-refresh-2026-07-01.md` | Keep [LUC-6331](/LUC/issues/LUC-6331), [LUC-6413](/LUC/issues/LUC-6413), [LUC-6416](/LUC/issues/LUC-6416), [LUC-6463](/LUC/issues/LUC-6463), source/build provenance, and host-proof lanes as active owner paths; create new children only for fresh unrouted failed checks. | 2026-07-01 |

## 2026-07-01 LUC-6491 Production Acceptance Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Authenticated production acceptance can be over-claimed while production Web root/build-info and protected `/workers/ready` still return `503`. | P0 | blocked_by_existing_ops_restoration_path | `history/evidence/luc-6491-authenticated-production-acceptance-performance-sweep-2026-07-01.md` | Ops Release Lead / board-approved Coolify mutation owner resolves [LUC-6331](/LUC/issues/LUC-6331), then QVE reruns acceptance. | 2026-07-01 |

## 2026-07-01 LUC-6382 Duplicate Repair-Lane And Release Overclaim Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| V1 audit-to-completion could create duplicate TSA/Backend/QVE/DRE children or overclaim release readiness despite existing blocked owner paths. | P1 | mitigating | `history/evidence/luc-6382-v1-audit-to-completion-controller-2026-07-01.md` | Keep [LUC-6331](/LUC/issues/LUC-6331), [LUC-6413](/LUC/issues/LUC-6413), and [LUC-6416](/LUC/issues/LUC-6416) as active owner paths; create new children only for fresh, unrouted failed checks. | 2026-07-01 |

## 2026-06-30 LUC-6476 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement. | P1 | active | `history/evidence/luc-6476-production-performance-server-health-watch-2026-06-30.md` | DRE/Ops resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE reruns production watch. | 2026-06-30 |

## 2026-06-30 LUC-6439 Production Web And Worker Readiness Risk

| Risk | Severity | Status | Evidence | Owner / next action | Last updated |
| --- | --- | --- | --- | --- | --- |
| Production Web and protected `/workers/ready` return `503`, causing rollback guard action requirement. | P1 | active | `history/evidence/luc-6439-soar-protected-recheck-2026-06-30.md` | DRE/Ops resolves [LUC-6331](/LUC/issues/LUC-6331), then DRE reruns protected recheck. | 2026-06-30 |

# Risk Register

Last updated: 2026-06-30

- 2026-06-30 `LUC-6386-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-30`
  confirms current production acceptance risk is active again: public Web `/`
  and `/api/build-info` return `503`, and rollback guard reports
  `shouldRollback=true` due to `workers_ready_endpoint_http_503`. API
  `/health` and `/ready` passed and runtime freshness passed, so the active
  blocker is Web availability plus protected worker readiness rather than API
  baseline outage. Mitigation: keep [LUC-6386](/LUC/issues/LUC-6386) blocked on
  the existing restoration incident [LUC-6331](/LUC/issues/LUC-6331); rerun QVE
  authenticated acceptance only after Web and worker readiness recover.

- 2026-06-30 `LUC-6303-GAP-REGISTER-AND-REPAIR-LANE-REFRESH-2026-06-30`
  mitigates duplicate repair-lane churn: strict architecture drift passed
  (`849/849`, `0` missing), current app-completion regeneration produced
  `2292` items with `452` browser-review, `1016` missing-test-link, `576`
  missing-doc-link, and `5` blocked rows, and protected-input checker
  regression passed (`7/7`). Residual release risk is unchanged rather than
  newly discovered: [LUC-6234](/LUC/issues/LUC-6234) protected input readiness
  is still `PARTIAL`, release-grade source/build provenance remains open,
  host-level VPS/log-window proof is credential-gated, and app-completion row
  burn-down remains on existing specialist owner paths. Mitigation: do not
  create duplicate TSA or Backend/Auth children; route only fresh unrouted
  failed checks.

- 2026-06-30 `LUC-6296-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-30`
  mitigates current production auth/session regression risk. Evidence
  `history/evidence/luc-6296-authenticated-production-acceptance-performance-sweep-2026-06-30.md`
  shows deploy smoke, auth-session browser proof, UI clickthrough, runtime
  freshness, rollback guard, and timing sample passed for Web SHA
  `c357d957741f56835f27a1fc3a948dad43a91036`. Logout returned `200`; same-cookie
  and same-bearer `/auth/me` after logout returned `401`. Residual watch:
  `/dashboard/markets/catalog` had one cold response at `1779.3 ms`, then
  focused follow-up normalized to max `86.1 ms`; release-grade build
  provenance and host-level VPS/log-window proof remain separate Release/Ops
  gates.

- 2026-06-30 `LUC-6234-SECURITY-ACCOUNT-ACCESS-GATE-SWEEP-2026-06-29`
  confirms the protected release/account-access gate remains fail-closed after
  child [LUC-6242](/LUC/issues/LUC-6242) completed structured checker binding.
  Evidence
  `history/evidence/luc-6234-security-account-access-gate-readiness-c357d957-2026-06-30.md`
  shows `PARTIAL`, `NO-GO`, `accountAccessGate.status=FAIL`, and missing
  required families `ROLLBACK_GUARD_*`, `SOAR_PROD_*`,
  `PROD_DB_CHECK_* or PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*`.
  Focused API security/account tests passed, so the active risk is missing
  approved protected input binding rather than a newly reproduced app security
  regression. Mitigation: board-capable Security/Ops secret owner binds the
  missing families through approved encrypted runtime paths, then protected
  release/account proof reruns.

- 2026-06-29 `LUC-6250-GAP-REGISTER-AND-REPAIR-LANE-REFRESH-2026-06-29`
  mitigates duplicate repair-lane churn: strict architecture drift passed
  (`849/849`, `0` missing), current architecture-awareness readback remains
  actionable-clean, and app-completion regeneration produced `2258` items with
  `452` browser-review, `984` missing-test-link, `575` missing-doc-link, and
  `4` blocked rows. Residual release risk is unchanged rather than newly
  discovered: [LUC-6234](/LUC/issues/LUC-6234) protected input readiness is
  still `PARTIAL/NO-GO`, release-grade source/build provenance remains open,
  host-level VPS/log-window proof is credential-gated, and app-completion row
  burn-down remains on existing specialist owner paths. Mitigation: do not
  create duplicate TSA or Backend/Auth children; route only fresh unrouted
  failed checks.

- 2026-06-29 `LUC-6245-V1-AUDIT-TO-COMPLETION-CONTROLLER-2026-06-29`
  confirms there is no new TSA architecture repair risk: strict architecture
  drift passed (`849/849`, `0` missing) and architecture-awareness remains
  actionable-clean. Release risk remains open because
  [LUC-6234](/LUC/issues/LUC-6234) protected input readiness is
  `PARTIAL/NO-GO` for missing `ROLLBACK_GUARD_*`, `SOAR_PROD_*`,
  `PROD_DB_CHECK_*`, `PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*`
  families. [LUC-6248](/LUC/issues/LUC-6248) mitigates production auth
  acceptance for deployed Web SHA `c357d957741f56835f27a1fc3a948dad43a91036`,
  but does not close protected release/account-access, release-grade
  source/build provenance, or host-level VPS/log-window proof. Mitigation:
  board-capable Security/Ops secret owner binds the missing protected input
  families through approved encrypted runtime paths without value exposure,
  then protected release/account proof reruns.

- 2026-06-29 `LUC-6234-SECURITY-ACCOUNT-ACCESS-GATE-SWEEP-2026-06-29`
  keeps the protected release/account-access gate fail-closed. Evidence
  `history/evidence/luc-6234-security-account-access-gate-readiness-c357d957-2026-06-29.md`
  shows `PARTIAL`, `NO-GO`, and missing `ROLLBACK_GUARD_*`, `SOAR_PROD_*`,
  `PROD_DB_CHECK_*`, `PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE* / GATE_*`
  families. Mitigation: board-capable Security/Ops secret owner binds missing
  families via approved encrypted runtime path, then wakes protected
  release/account proof lane.

- 2026-06-29 `LUC-6205-REGRESSION-EVIDENCE-SWEEP-2026-06-29`
  reduces current regression uncertainty: repeatable Web/API/backtests smoke,
  repository guardrails, strict architecture drift, repeatable-smoke runner
  tests, and public no-worker production smoke all passed. Residual release
  risk remains open for release-grade build provenance, host-level
  VPS/log-window proof, and app-completion row burn-down. Mitigation: keep
  those gates on their existing owner paths; no QA repair child is required
  from this sweep.

- 2026-06-29 `LUC-6134-INVALID-TOKEN-SESSION-EXPIRED-REDIRECT-REPAIR-2026-06-29`
  mitigates the invalid-token redirect parity blocker from
  [LUC-6123](/LUC/issues/LUC-6123). Local Web/Auth repair preserves
  `/auth/login?session=expired` when protected-route auth bootstrap fails
  closed with `/auth/me -> 401`; focused Web tests and Web typecheck passed.
  Residual release risk remains open until this fix is committed/batched onto
  an approved production source path and QVE reruns the production auth proof.

- 2026-06-29 `LUC-6123-PROD-AUTH-SESSION-PROOF-RERUN-2026-06-29`
  reduces the original logout-session repair uncertainty but keeps production
  auth proof blocked. Production build-info matched
  `c357d957741f56835f27a1fc3a948dad43a91036`; logout returned `200`; stale
  cookie and bearer readbacks returned `401`. The full proof still failed
  because an invalid browser token redirected to `/auth/login` without the
  expected `?session=expired` query. Mitigation: route a narrow Auth/Web repair
  or contract decision, then rerun [LUC-6123](/LUC/issues/LUC-6123) proof.

- 2026-06-29 `LUC-6109-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-29`
  raises production auth-session risk: the auth browser proof reproduced
  `POST /auth/logout -> 502` twice and `/auth/me` with the same token returned
  `200` after the failed logout. Other production signals were healthy
  (deploy smoke, route/module clickthrough, runtime freshness, rollback guard,
  and timing sample). Mitigation: block [LUC-6109](/LUC/issues/LUC-6109) on a
  narrow Backend/Auth repair, then rerun the same QVE auth proof before
  acceptance closure.

- 2026-06-29 `LUC-6106-USER-CONFIGURATION-DOC-LINK-RECONCILIATION-2026-06-29`
  reduces User configuration false-gap risk: DSM added `19` direct
  documentation links for already-tested API/support rows and verified
  app-completion readback moved User configuration missing-doc-link rows from
  `49` to `30`. Residual overclaim risk remains if future workers treat this
  as DB-backed route, browser, or Web profile closure; mitigation is to keep
  DB-backed proof with CBE/[LUC-6105](/LUC/issues/LUC-6105) follow-up and route
  the remaining `28` Web profile/Web platform doc-link rows separately.

- 2026-06-29 `LUC-6102-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-29`
  reduces current production-runtime uncertainty: current-binding public and
  protected smoke passed, runtime freshness passed, rollback guard returned
  `shouldRollback=false`, representative public timing stayed below `227.4 ms`,
  and authenticated dashboard/admin reads returned `200`. Residual release risk
  remains open for recurring `/dashboard/markets/catalog` cold first sample
## 2026-06-30 LUC-6271 Production Watch Risk Update

- Current production-watch risk posture:
  `APP_HEALTHY_WITH_RESIDUAL_WATCH_ITEMS`.
- Evidence:
  [LUC-6271](/LUC/issues/LUC-6271) passed deploy smoke, protected workers
  readiness, runtime freshness, rollback guard, public timing, authenticated
  dashboard/admin timing, and Coolify read-only projection.
- Residual risks:
  market-catalog cold first sample repeated once (`1678.1 ms`) then normalized
  (`40.5 ms` focused max); API `/health` had one sub-second cold sample before
  normalizing; Coolify application rows still report `running:unknown`; eight
  queued deployment rows remain across prior/current API-worker commit
  families; production build-info remains `metadataSource=env-runtime`; and
  host-level VPS pressure/log-window proof remains approval-gated.
- Risk action:
  no new DRE repair child from this heartbeat. Escalate only if cold samples
  become persistent, queued deployments coincide with app-level failures,
  rollback guard returns reasons/alerts, or host-level credentials become
  available for approved read-only proof.

  (`1719.3 ms` then normalized), Coolify app rows `running:unknown`, four
  queued Coolify deployments, host-level proof gap, and release-grade build
  provenance. Mitigation: continue routine DRE watches; create a narrow repair
  issue only if the cold sample becomes persistent, queued deployments coincide
  with runtime symptoms, or timing approaches human-visible stall territory.

- 2026-06-29 `LUC-5864-DASHBOARD-TRADING-BROWSER-REVIEW-2026-06-29`
  reduces Dashboard/Trading local browser-review uncertainty: focused Web
  proof passed `8` files / `67` tests and route-reachable i18n audit returned
  `0` findings. Residual overclaim risk remains for exact app-completion row
  closure because the current Trading drill-down does not expose direct
  `HomeLiveWidgets` or `runtimeDataTablePresenters` rows; mitigation is to
  keep exact row-linkage reconciliation on [LUC-6089](/LUC/issues/LUC-6089).

- 2026-06-29 `LUC-6089-TRADING-APP-COMPLETION-ROW-LINKAGE-RECONCILIATION-2026-06-29`
  reduces false-completion risk for Trading operation app-completion. DSM
  verified the [LUC-6004](/LUC/issues/LUC-6004) drill-down contains `219`
  Trading rows but `0` direct `HomeLiveWidgets` or
  `runtimeDataTablePresenters` row hits, so [LUC-6086](/LUC/issues/LUC-6086)
  remains valid behavior proof while direct row-id closure remains `0`.
  Residual risk is scanner taxonomy/linkage drift: backend/API support rows are
  currently typed as browser-review rows and could be overclaimed by browser
  proof. Mitigation: do not claim exact row closure without exact row IDs;
  route scanner taxonomy repair to TSA only if the board wants classification
  changed in code.

- 2026-06-29 `LUC-6086-TRADING-OPERATION-RESIDUAL-NO-LIVE-BROWSER-LINKAGE-PROOF-2026-06-29`
  reduces Trading operation widget behavior uncertainty: focused no-live Web
  proof passed `5` files / `58` tests for `HomeLiveWidgets` full component,
  manual-order states, open-orders/source labels, and runtime table
  presenters. Residual release-confidence risk remains in app-completion
  row-linkage/taxonomy: the current Trading drill-down does not expose direct
  `HomeLiveWidgets` or `runtimeDataTablePresenters` rows, so exact row closure
  from this heartbeat is `0`. Mitigation: route a docs/architecture
  row-linkage reconciliation before additional exact Trading browser-review
  closure is claimed; follow-up [LUC-6089](/LUC/issues/LUC-6089) was created.

- 2026-06-28 `LUC-6066-MUTATE-CENTRAL-SMOKE-AUTH-TOKEN-BINDING-2026-06-28`
  reduces the stale smoke-token release-verification risk: central Paperclip
  agent env bindings for `SMOKE_AUTH_TOKEN` were removed from CTO, DRE, SPM,
  SPA, and IPM by name-only config mutation. Underlying secrets were not
  value-read, deleted, or rotated; login fallback bindings remain. Residual
  verification risk was closed by [LUC-6037](/LUC/issues/LUC-6037):
  current-binding protected smoke passed `/workers/ready -> 200` after the
  binding was absent in the resumed DRE runner.

- 2026-06-28 `LUC-6037-STALE-SMOKE-AUTH-TOKEN-SECRET-MANAGER-ROTATION-2026-06-28`
  closes the stale smoke-token release-verification risk for the DRE runner.
  Earlier current-binding smoke failed protected `/workers/ready` with `401`,
  while fresh-login smoke passed after process-local token clear. After
  [LUC-6065](/LUC/issues/LUC-6065) / [LUC-6066](/LUC/issues/LUC-6066) removed
  the central agent binding, resumed runner presence showed
  `SMOKE_AUTH_TOKEN=ABSENT` and current-binding smoke passed protected
  `/workers/ready -> 200`. Residual release risks now belong to separate
  protected-input, build-provenance, host-level, and Coolify posture lanes.

- 2026-06-28 `LUC-5986-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-28`
  reduces current production-runtime uncertainty: public API/Web smoke passed,
  fresh-login protected `/workers/ready` passed, runtime freshness passed,
  rollback guard returned `shouldRollback=false`, representative authenticated
  dashboard/admin reads returned `200`, and Coolify read-only projection
  returned PostgreSQL/Redis `running:healthy`. Residual release risk remains
  open for the stale `SMOKE_AUTH_TOKEN` path (`401`), recurring
  `/dashboard/markets/catalog` cold first sample (`1659.9 ms` then
  normalized), Coolify app rows `running:unknown`, four queued Coolify
  deployments, host-level proof gap, and release-grade build provenance.
  Mitigation: continue routine DRE watches; create a narrow repair issue only
  if the cold sample becomes persistent, queued deployments coincide with
  runtime symptoms, or timing approaches human-visible stall territory.

- 2026-06-28 `LUC-5947-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-28`
  reduces current production-runtime uncertainty: public API/Web smoke passed,
  fresh-login protected `/workers/ready` passed, runtime freshness passed,
  rollback guard returned `shouldRollback=false`, representative authenticated
  dashboard/admin reads returned `200`, and Coolify read-only projection
  returned PostgreSQL/Redis `running:healthy`. Residual release risk remains
  open for the stale `SMOKE_AUTH_TOKEN` path (`401`), recurring
  `/dashboard/markets/catalog` cold first sample (`1251.7 ms` then
  normalized), Coolify app rows `running:unknown`, four queued Coolify
  deployments, host-level proof gap, and release-grade build provenance.
  Mitigation: continue routine DRE watches; create a narrow repair issue only
  if the cold sample becomes persistent, queued deployments coincide with
  runtime symptoms, or timing approaches human-visible stall territory.

- 2026-06-28 `LUC-5910-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-28`
  reduces current production-runtime uncertainty: public API/Web smoke passed,
  fresh-login protected `/workers/ready` passed, runtime freshness passed,
  rollback guard returned `shouldRollback=false`, representative authenticated
  dashboard/admin reads returned `200`, and Coolify read-only projection
  returned PostgreSQL/Redis `running:healthy`. Residual release risk remains
  open for the stale `SMOKE_AUTH_TOKEN` path (`401`), recurring
  `/dashboard/markets/catalog` cold first sample (`1455.8 ms` then
  normalized), Coolify app rows `running:unknown`, four queued Coolify
  deployments, host-level proof gap, and release-grade build provenance.
  Mitigation: continue routine DRE watches; create a narrow repair issue only
  if the cold sample becomes persistent, queued deployments coincide with
  runtime symptoms, or timing approaches human-visible stall territory.

- 2026-06-28 `LUC-5886-SECURITY-ACCOUNT-ACCESS-GATE-SWEEP-2026-06-28`
  confirms protected release/account-access proof remains `PARTIAL/NO-GO` for
  deployed `3bd65e21d09f294a18d3317d2f59f7a0d4e577b4`. Current shell has `11`
  matching protected input names, limited to `LIVEIMPORT_READBACK_*`,
  `PROD_UI_AUDIT_*`, and `PROD_UI_*`; rollback, production app/operator,
  DB-check, RC, and gate approver families are missing. Local security,
  account-auth, subscription entitlement, and exchange boundary tests pass.
  Mitigation remains fail-closed: do not run protected proof, account/API-key,
  subscription/payment, exchange/live checks, database proof, rollback, deploy,
  restart, or live-trading action until a board-capable Security/Ops secret
  owner binds the missing protected inputs through the approved encrypted
  runtime path.

- 2026-06-28 `LUC-5880-PRODUCTION-PERFORMANCE-SERVER-HEALTH-WATCH-2026-06-28`
  reduces current production-runtime uncertainty: public API/Web smoke passed,
  fresh-login protected `/workers/ready` passed, runtime freshness passed,
  rollback guard returned `shouldRollback=false`, representative authenticated
  dashboard/admin reads returned `200`, and Coolify read-only projection
  returned PostgreSQL/Redis `running:healthy`. Residual release risk remains
  open for the stale `SMOKE_AUTH_TOKEN` path (`401`), recurring
  `/dashboard/markets/catalog` cold first sample (`1395.1 ms` then normalized),
  Coolify app rows `running:unknown`, four queued Coolify deployments,
  host-level proof gap, and release-grade build provenance. Mitigation:
  continue routine DRE watches; create a narrow repair issue only if the cold
  sample becomes persistent, queued deployments coincide with runtime symptoms,
  or timing approaches human-visible stall territory.

- 2026-06-15 `LUC-4121-PROTECTED-TEST-ACCOUNT-SMOKE-PATH-2026-06-15`
  reduces the protected auth/session smoke risk for current production SHA
  `9f61eb9781c323f052f95cae7cf0c1c3c71901c7`: the pre-bound
  `PROD_UI_AUDIT_AUTH_TOKEN` still fails `/auth/me` with HTTP `401`, but the
  protected `PROD_UI_AUDIT_AUTH_EMAIL/PASSWORD` path successfully mints a
  session and passes the redacted production auth browser proof. Residual
  release risk remains open because protected input readiness is still
  `PARTIAL/NO-GO` for runtime readback, rollback, production operator, DB,
  RC, and gate approver families. Mitigation: consume LUC-4121 only as
  protected test-account auth/session evidence and keep unrelated V1 release
  gates fail-closed until their owner proofs land.

- 2026-06-11 `LUC-3461-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-11`
  reduces current unknowns for production public health: API `/health`, API
  `/ready`, Web `/`, and Web `/api/build-info` all passed, and read-only
  Coolify projection still shows the canonical eight production resources with
  PostgreSQL/Redis `running:healthy`. Residual release risk remains open:
  application rows are still `running:unknown`, Web build-info uses diagnostic
  `metadataSource=github-branch`, `workers-execution` retains crash restart
  metadata, and protected `/workers/ready`, worker freshness, rollback,
  restore, SLO, and release approval are not proven by this sweep. Mitigation:
  keep release readiness fail-closed until approved protected inputs and owner
  signoff exist.

- 2026-06-11 `LUC-3457-SECURITY-ACCOUNT-ACCESS-GATE-SWEEP-2026-06-11`
  confirms protected release/account-access proof remains `PARTIAL/NO-GO`.
  The current shell has only production UI audit protected input names
  (`6` matching names); runtime readback, rollback, production app/operator,
  DB-check, RC, and gate approver families are missing. Mitigation remains
  fail-closed: do not run protected proof, account/API-key/subscription/payment
  mutation, exchange/live checks, database proof, rollback, deploy, restart,
  or live-trading action until a board-capable Security/Ops secret owner binds
  the missing protected inputs through the approved encrypted runtime path.

- 2026-06-11 `LUC-3394-GAP-REGISTER-AND-REPAIR-LANE-REFRESH-2026-06-11`
  mitigates duplicate repair-lane churn in the architecture evidence backlog:
  the visible local-safe `runV1StaticIssueScan` and `runV1StageRehearsal` rows
  in the current report are stale relative to completed [LUC-3381](/LUC/issues/LUC-3381)
  and [LUC-3389](/LUC/issues/LUC-3389) direct relation rows. Residual risk
  remains that the architecture-awareness report cannot be fully refreshed in
  this checkout because the canonical awareness generator is absent. Mitigation:
  do not create duplicate children; route the next selection through an
  Architecture/Docs Memory or PM control lane that can run the canonical
  awareness refresh first.

- 2026-06-11 `LUC-3381-STATIC-ISSUE-SCAN-HELPER-MISSING-TEST-ROWS-2026-06-11`
  mitigates architecture evidence-link drift for V1 static issue scan tooling:
  [LUC-3381](/LUC/issues/LUC-3381) now has focused local proof and `22` direct
  scanner-readable relation rows for `scripts/runV1StaticIssueScan.mjs`
  helper anchors. Residual risk remains for graph regeneration in this checkout
  because Windows returned filesystem `UNKNOWN` while opening
  `docs/graphs/architecture-graph.json`; guardrails still reported graph drift
  OK. This lane did not run a real V1 static scan refresh or protected
  production/release evidence.

- 2026-06-11 `LUC-3375-SECURITY-ACCOUNT-ACCESS-GATE-SWEEP-2026-06-11`
  confirms protected release/account-access proof remains `PARTIAL/NO-GO`.
  The current shell has only production UI audit protected input names
  (`6` matching names); runtime readback, rollback, production app/operator,
  DB-check, RC, and gate approver families are missing. Mitigation remains
  fail-closed: do not run protected proof, account/API-key/subscription/payment
  mutation, exchange/live checks, database proof, rollback, deploy, restart,
  or live-trading action until a board-capable Security/Ops secret owner binds
  the missing protected inputs through the approved encrypted runtime path.

- 2026-06-08 `LUC-3001-RESTORE-DRILL-EVIDENCE-HELPER-MISSING-TEST-ROWS-2026-06-08`
  mitigates release Ops helper traceability drift for restore-drill evidence:
  [LUC-3001](/LUC/issues/LUC-3001) now has focused local proof and `7` direct
  scanner-readable relation rows for deterministic helper anchors in
  `scripts/runRestoreDrillEvidence.mjs`. Residual risk remains unchanged for
  protected production/stage restore-drill execution itself; this lane did not
  run a real restore drill, mutate a database, use secrets, deploy, restart,
  roll back, or validate production readiness.

- 2026-06-08 `LUC-2980-RESTORE-LOCAL-DOCKER-POSTGRESQL-RUNTIME-2026-06-08`
  mitigates the local DB dependency risk that blocked
  [LUC-2977](/LUC/issues/LUC-2977). Docker Desktop is running, the stale local
  Compose network/container state was normalized without deleting volumes, and
  `pnpm run go-live:infra:up` starts `postgres` plus `redis` on the expected
  local ports. Proof: TCP checks passed for `localhost:5432` and
  `localhost:6379`, `pg_isready` accepted connections, and the focused API
  proof passed (`2` files / `42` tests). Residual risk: the reused
  `cryptosparrow` volume reports a PostgreSQL collation version mismatch
  warning; current proof is green, but future local DB maintenance may need to
  refresh the collation version or rebuild local objects.

- 2026-06-08 `LUC-2975-PUBLIC-READ-ONLY-BROWSER-PROOF-HELPER-TEST-LANE-2026-06-08`
  mitigates public read-only browser proof helper traceability drift:
  [LUC-2958](/LUC/issues/LUC-2958) now has focused local proof and `16` direct
  scanner-readable relation rows for safe deterministic helpers. The refreshed
  architecture-awareness report generated `2026-06-07T23:10:42.686Z` reports
  `125` actionable missing-test links. Residual risk remains for real browser
  and OS process orchestration helpers (`createPage`, `killProcessTree`,
  `launchBrowser`), which this local-only helper lane intentionally did not
  unit-claim.

- 2026-06-07 `LUC-2920-KNOWN-STATE-REFRESH-RUN-MISSING-TEST-LINK-2026-06-07`
  mitigates architecture evidence-link drift for known-state refresh tooling:
  `scripts/runKnownStateRefresh.mjs#run` has focused local proof and direct
  scanner-readable relation evidence, and the refreshed architecture-awareness
  report no longer lists that anchor in Top Actionable Missing Test Links.
  Residual risk remains for unrelated helper families still reported by the
  scanner and for protected production/release evidence, which this local
  proof intentionally did not exercise.

| ID | Area | Risk | Likelihood | Impact | Trigger | Mitigation | Status | Linked Requirement/Decision | Next Action | Last Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RISK-ARCH-CONTROLLED-LIVE-PROOF-TRACEABILITY-2026-06-07 | Architecture evidence / controlled LIVE proof tooling | Controlled LIVE proof helper anchors can remain under-linked in architecture-awareness, causing repeated audit churn or accidental confusion between local helper proof and protected production readiness. | medium | medium | `docs/status/architecture-awareness-report.md` lists `scripts/runControlledLiveSessionProof.mjs#*` helper anchors as top actionable missing-test links. | [LUC-2827](/LUC/issues/LUC-2827), [LUC-2834](/LUC/issues/LUC-2834), [LUC-2845](/LUC/issues/LUC-2845), [LUC-2847](/LUC/issues/LUC-2847), [LUC-2860](/LUC/issues/LUC-2860), [LUC-2864](/LUC/issues/LUC-2864), [LUC-2878](/LUC/issues/LUC-2878), [LUC-2882](/LUC/issues/LUC-2882), [LUC-2886](/LUC/issues/LUC-2886), [LUC-2892](/LUC/issues/LUC-2892), [LUC-2896](/LUC/issues/LUC-2896), [LUC-2899](/LUC/issues/LUC-2899), [LUC-2904](/LUC/issues/LUC-2904), and [LUC-2906](/LUC/issues/LUC-2906) completed focused local proof/relation rows for current controlled-proof helper anchors. [LUC-2906](/LUC/issues/LUC-2906) refreshed architecture-awareness to `2026-06-07T18:49:12.396Z`, reduced actionable missing-test links to `251`, and removed `waitForRunningSession` from Top Actionable Missing Test Links. | mitigating | REQ-DOC-031 | Continue only with the next non-duplicate architecture-awareness top missing-test family; do not treat local helper traceability as protected production readiness. | 2026-06-07 |
| RISK-ARCH-DEV-TOOLING-TRACEABILITY-2026-06-07 | Architecture evidence / local developer tooling | Local helper scripts can remain under-proved in the architecture-awareness layer, causing repeated audit churn or accidental overclassification of local tooling gaps as production blockers. | medium | medium | `docs/status/architecture-awareness-report.md` lists local helper script anchors as top actionable missing-test links. | [LUC-2775](/LUC/issues/LUC-2775), [LUC-2781](/LUC/issues/LUC-2781), [LUC-2788](/LUC/issues/LUC-2788), [LUC-2806](/LUC/issues/LUC-2806), and [LUC-2812](/LUC/issues/LUC-2812) completed focused local proof/relation rows for current `dev-backend` and `dev-workers` helper anchors. [LUC-2812](/LUC/issues/LUC-2812) refreshed architecture-awareness to `2026-06-07T13:04:38.451Z`, reduced actionable missing-test links to `314`, and removed `handleWorkerExit` from Top Actionable Missing Test Links. [LUC-2817](/LUC/issues/LUC-2817) deduped generator-index helpers to blocked [LUC-2791](/LUC/issues/LUC-2791), go-live smoke helpers to blocked [LUC-2792](/LUC/issues/LUC-2792), and created [LUC-2820](/LUC/issues/LUC-2820) for the next non-duplicate `scripts/runAud07IsolatedDbPacks.mjs#main` anchor. Keep all lanes local-only and forbid production, secret, account, deploy, DB, exchange, Docker Compose, real Prisma, or live-trading mutation. | mitigating | REQ-DOC-031 / RISK-DOC-005 | Execute [LUC-2820](/LUC/issues/LUC-2820); do not reopen dev-workers anchors unless a future refresh reports a new exact uncovered anchor or `scripts/dev-workers.test.mjs` fails. | 2026-06-07 |
| RISK-SEC-SMOKE-AUTH-BINDING-2026-06-07 | Security / operations | Protected worker readiness can remain blocked if the production smoke auth binding is populated with non-accepted or malformed material, causing repeated public-smoke passes but protected `/workers/ready` `401` failures. | high | high | `SMOKE_AUTH_TOKEN` is present but not JWT-shaped, `SMOKE_AUTH_EMAIL` is present but not email-shaped, and worker-included deploy smoke returns `401` on `GET /workers/ready`. | Keep fail-closed behavior; do not treat public checks as protected proof. Require credential/account owner or board-approved secret-store operator to provision one production-smoke appropriate `ADMIN` principal/session accepted by Soar API auth through exactly one supported `SMOKE_*` path. | open | REQ-FUNC-021 / LUC-2619 | Correct the secret-store binding, then wake [LUC-2618](/LUC/issues/LUC-2618) for worker-included smoke rerun. | 2026-06-07 |
| RISK-FE-SHARED-UI-INFERRED-LINKS-2026-06-04 | Frontend / architecture evidence | Shared UI component rows can be misclassified as missing tests/docs when architecture-awareness scanner inference does not directly connect generated `apps/web/src/ui/**` component entities to nearby focused tests or module docs. | medium | medium | A future audit treats inferred missing links as runtime UI defects or, inversely, treats aggregate evidence as fresh browser/production proof. | `LUC-2021` updates `docs/modules/web-shared.md` with exact shared UI test/doc evidence, scanner relation boundary, and real follow-up primitive-test candidates. Focused Web tests passed (`16` files / `87` tests). | mitigating | REQ-DOC-029 / REQ-DOC-030 | Docs Memory can add stable per-component shared UI graph nodes or scanner relation rules; Frontend adds focused primitive tests when modal/brand/navigation/skeleton primitives change. | 2026-06-04 |
| RISK-SEC-2026-05-25-001 | Auth/session | Registration endpoint returns a user-existence-specific message for existing email, enabling account enumeration and targeted credential attacks. | medium | low | Unauthenticated users repeatedly probe register with candidate emails and infer valid identities from distinct failure responses. | Generic auth error is reused for duplicate-registration service errors, removing identity-specific service leakage; auth registration rate-limits remain active. Focused regression proof now passes for duplicate email rejection. | closed | REQ-SEC-LOGIN-001 | Reopen only if duplicate registration response behavior regresses or new identity-specific register errors are introduced. | 2026-05-26 |
| RISK-SEC-2026-05-25-002 | Secrets / key management | Startup can proceed with legacy `API_KEY_ENCRYPTION` when `API_KEY_ENCRYPTION_KEYS` is missing, reducing explicit key-version governance and making forced rotation checks less reliable. | low | medium | `API_KEY_ENCRYPTION_KEYS` absent from env in an environment that relies on startup checks; only legacy key var is set. | Tighten readiness policy to treat missing keyring as a hard fail outside explicit temporary compatibility mode and require migration to versioned keys before production readiness. | open | REQ-SEC-KEYRING-001 | Keep a documented migration window; require evidence of keyring migration completion before claiming readiness for production. | 2026-05-25 |
| RISK-DATA-INTEGRITY-COVERAGE-2026-05-25 | Data persistence / verification coverage | Schema and migration health can appear green while ownership/FK lifecycle regressions remain undetected if DB-backed module packs are not completed. | medium | high | Data lane closes after `prisma validate` and `migrate status` only, without module-level persistence checks for orders/positions/subscriptions/auth flows. | Keep schema+migration checks as baseline, then require narrowed DB-backed API persistence packs and per-invariant evidence before upgrading data confidence. Initial broad focused pack timed out (`124054ms`), then narrowed single-worker file-level proof passed for auth/orders/positions/subscriptions. | mitigating | REQ-DATA-040 | Keep the narrowed file-level persistence pack as the repeatable gate for future auth/orders/positions/subscriptions persistence changes. | 2026-05-26 |
| RISK-DATA-SECRET-HANDLING-2026-05-25 | Data persistence / secret-handling | Session/version and credential persistence can hide secret-handling or unauthorized mutation risks if ownership, encryption family boundaries, and redaction are changed during future schema or migration work without Security review. | medium | high | Auth/session/auth-key persistence is modified or migrations are applied that affect user identifiers, encrypted values, or consent/version fields without concurrent Security validation. | Route this checkpoint gap to the Security and Backend owners. Security should re-run secret-handling validation and red-team checks on auth/key flows, while Backend verifies migration replay, ownership constraints, and audit-log retention impact before declaring completion. | open | REQ-DATA-040 / REQ-SEC-041 | Security: rerun `SECURITY` and `api-security` validation packs on `apps/api` after any auth/API-key schema changes. Backend: run isolated DB-backed invariant pack for `apps/api/src/modules/auth src/modules/orders src/modules/positions src/modules/subscriptions` before confidence upgrade. | 2026-05-25 |
| RISK-DATA-BACKUP-RESTORE-2026-05-25 | Data persistence / backup-restore | Backup/restore evidence can lag behind migration/state changes, so recovery claims may pass for old schema assumptions and fail quietly on newer revisions. | medium | medium | Schema evolves while no post-change restore/replay proof is collected, or restore proof is reused across schema revisions without SHA/date binding. | Keep migration status and validation as baseline only; require restore/replay evidence on the same schema/migration set as this checkpoint before claiming persistence confidence beyond `partially_verified`. | open | REQ-DATA-040 | Backend: run migration replay + DB restore/reload smoke with a current checkpoint artifact before moving `SOAR-DATA` confidence to `verified`. | 2026-05-25 |
| RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25 | Production reliability / Bot Runtime | Runtime monitoring aggregate fanout and nested support readers can overload the API process, causing heap out-of-memory restarts, 500s, and failed SLO gates even when public health eventually recovers. | high | high | RC/SLO pipeline observes elevated 5xx or availability below target, and API logs show OOM around `/dashboard/bots/:id/runtime-monitoring/aggregate`. | First mitigation limited aggregate session concurrency and skipped failed per-session rows. [LUC-2300](/LUC/issues/LUC-2300) adds bounded trade/position materialization: runtime trade visible rows use DB sorting/paging, trade totals/fees use DB count/aggregate, and carry-over/lifecycle support rows have explicit caps. [LUC-2328](/LUC/issues/LUC-2328) repaired the DB-backed aggregate proof by preserving Prisma delegate binding in the bounded-materialization e2e spy and increasing the aggregate subquery default timeout to `15000ms` with environment override intact. [LUC-2333](/LUC/issues/LUC-2333) repaired the failed QA rerun by isolating aggregate nested-reader timeout/error fallback per subquery, so a slow symbol-stats/positions read no longer drops the session row or erases valid trade totals/items. Original combined DB-backed aggregate proof passes under `--testTimeout=30000`; bounded hidden trade proof returns `trades.total === 260`, `trades.items.length === 5`, and bounded `trade.findMany`; API typecheck passes. | mitigating | REQ-FUNC-003 / REQ-FUNC-021 | QA/release can proceed from local verified aggregate proof to protected runtime smoke, production promotion decision, and post-deploy aggregate/SLO proof under Ops gates. | 2026-06-06 |
| RISK-VPS-REACHABILITY-2026-05-25 | Operations / VPS | The production VPS can become unreachable on SSH and HTTPS, blocking Coolify, Web, API, and all production validation even when application-level 5xx is zero before the outage. | high | high | `Test-NetConnection` fails for `141.227.149.67` on SSH `22` and HTTPS `443`, and public Web/API/Coolify requests timeout. | Public DNS still resolves to `141.227.149.67`; current evidence points to host/network reachability rather than route-level 404/500. Keep V1 `NO-GO` and avoid further release activation until host access returns. | open | REQ-FUNC-021 | Restore VPS/OVH/network access, check host uptime and Docker/container status, then rerun production smoke and SLO/RC. | 2026-05-25 |
| RISK-SEC-AI-ASSISTANT-HOTPATH-2026-06-04 | Assistant/AI runtime | Future work could overclaim assistant safety by treating local dry-run/foundation proof as authorization for executable BACKTEST/PAPER/LIVE assistant trading. | medium | high | A product/runtime task wires assistant orchestration into hot-path trading, memory/context enrichment, or tool/model access without a Product/CTO activation decision and Security red-team packet. | `LUC-2018` classifies current assistant foundation as locally verified only for dry-run/foundation and default LIVE fail-closed behavior. Fresh `pnpm run test:adversarial:api-assistant` passed (`8` files / `29` tests). `LUC-2773` confirms `SOAR-ASSISTANT-AI-001` executable hot-path orchestration is accepted deferred V1 scope; the assistant runtime contract still defers executable hot-path chains until separate Product+CTO approval, persisted traces, fail-closed fallback proof, and AI red-team evidence exist. | mitigating | REQ-AI-030 | Keep V1 limited to assistant foundation/dry-run. If Product+CTO activates executable assistant trading after V1, create dedicated AI Runtime, Security red-team, and QA/Test proof issues before enabling hot-path behavior. | 2026-06-07 |
| RISK-DOC-005 | Architecture evidence graph | Future code, tests, docs, routes, prompts, workers, configs, or migrations could become invisible to impact analysis if graph CSV records are not updated in the same task. | medium | high | A changed source/test/doc/config/pipeline path is not referenced by architecture graph CSV records. | The graph contract records full current representative drift closure: `pnpm run architecture:graph:generate` emits `643` nodes, `798` relations, and `27` chains, and `pnpm run architecture:graph:drift:strict` reports `796/796` representative paths covered with `0` missing. `pnpm run quality:guardrails` now runs strict graph drift and fails if missing graph path references reappear. | mitigating | REQ-DOC-005 / REQ-DOC-006 / REQ-DOC-007 / REQ-DOC-008 / REQ-DOC-009 / REQ-DOC-010 / REQ-DOC-011 / REQ-DOC-012 / REQ-DOC-013 / REQ-DOC-014 / REQ-DOC-015 / REQ-DOC-016 / REQ-DOC-017 / REQ-DOC-018 / REQ-DOC-019 / REQ-DOC-020 / REQ-DOC-021 / REQ-DOC-022 / REQ-DOC-023 / REQ-DOC-024 / REQ-DOC-025 / REQ-DOC-026 / REQ-DOC-027 / REQ-DOC-028 / REQ-DOC-029 | Keep graph CSV updates mandatory for future feature/code/test/docs/config/workflow changes; treat strict drift failure as a source-of-truth blocker, not a warning. | 2026-05-24 |
| RISK-FULL-READINESS-2026-05-23 | Release/readiness | The project could be overclaimed as "100%" if public smoke, docs polish, or scoped V1 evidence is confused with whole-product current proof across protected production flows, native mobile, deferred AI hot-path trading, and approval-gated LIVE exchange mutation. | high | high | A coordinator reports "Soar is 100%" without current deploy freshness, authenticated journey proof for the reported broken flows, protected production readbacks, and explicit operator approval for live-money paths. | `PROD-FRESH-DEPLOY-380308D1-2026-05-24` resolves the public deploy-freshness part of the risk: Web/API/workers are deployed to `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`, public build-info returns that SHA, and public no-worker smoke passes. Remaining risk is protected evidence, not public freshness: no authenticated journey proof, protected liveimport/rollback/UI proof, production DB restore proof, or LIVE mutation approval exists in this checkpoint. | mitigating | REQ-FUNC-021 | Run authenticated app-journey triage/proof for reported broken flows with approved app auth; separately run protected liveimport, rollback, UI, and DB restore proof when approved inputs exist; request separate explicit approval before any LIVE mutation proof. | 2026-05-24 |
| RISK-LOCAL-PROD-DOCKER-DRIFT-2026-05-24 | Operations/deployment | Local validation may miss Coolify-only failures if developers run API/Web/workers through pnpm while production runs split Docker services. | medium | medium | A Dockerfile, env, worker ownership, or compose change passes local watch-mode proof but fails on the VPS. | `LOCAL-DOCKER-COOLIFY-PARITY-2026-05-24` adds a local Docker app-stack workflow that reuses `docker-compose.vps.yml` and verifies API/Web/four worker image build plus short local run with API/Web health checks. | mitigating | REQ-FUNC-021 | Use `pnpm run docker:app:config` and `pnpm run docker:app:build` before Docker/Coolify changes; run protected production proof separately after controlled push/deploy. | 2026-05-24 |
| RISK-COOLIFY-STACK-CUTOVER-2026-05-25 | Operations/deployment | A new one-stack Coolify topology could mis-route domains, copy env incorrectly, or start workers before API/migrations are healthy. | high | medium | Stack cutover replaces six known Applications with one Service Stack without sufficient smoke and rollback. | `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25` adds a validated stack manifest with API/Web healthchecks, worker dependency on healthy API, exact `SOURCE_COMMIT`, service FQDN variables, external existing DB/Redis, documented rollback retaining old Applications, and a no-secret env preflight that validates required variable names and deploy-safe shapes without printing secret values. The shared-API-image compose variant is explicitly second-stage only. | mitigating | REQ-FUNC-021 | Deploy only as a parallel stack while old Applications remain available; run env preflight, API/Web/build-info/worker smoke, and SLO proof before domain detachment or old app stop. | 2026-05-25 |
| RISK-PROD-LEGACY-ROUTE-404-2026-05-24 | UX/release | Removed dashboard routes can break old links and fail production protected UI proof if they return 404 instead of redirecting to canonical replacement surfaces. | medium | medium | `/dashboard/exchanges`, `/dashboard/orders`, or `/dashboard/positions` returns 404 for authenticated users. | `PROD-UI-LEGACY-DASHBOARD-REDIRECTS-2026-05-24` restores middleware redirects and production UI clickthrough passes on deployed `0b7eb4c6`. | mitigated | REQ-FUNC-019 | Keep legacy redirect coverage in middleware tests and production UI audit. | 2026-05-24 |
| RISK-DOC-004 | Documentation graph cohesion | Reducing global map link density can leave many current docs as isolated nodes, making the graph cleaner but less useful as one coherent project description. | medium | medium | Semantic area hubs are missing, plain paths replace primary graph edges, or current module/runbook/contract docs have no incoming graph edges. | Added semantic area hubs and linked current files through their nearest domain hub while keeping global maps lightweight. Generic `README.md` / `index.md` graph hubs were renamed to meaningful area filenames. Current scan shows `0` no-incoming docs files excluding root semantic hubs and `0` fully isolated docs files; link check, guardrails, and docs parity pass. | mitigated | REQ-DOC-004 | Keep future docs connected through semantic area hubs rather than the global map. | 2026-05-23 |
| RISK-DOC-003 | Documentation knowledge graph | Even after moving history out of `docs/`, broad index and map files can become oversized Obsidian hubs that make the graph look like a small snowball and hide meaningful topic relationships. | medium | medium | `docs/soar-documentation-map.md` or `docs/maps/*` link to many secondary targets that are useful as text references but not useful graph edges. | Reduced markdown links in docs entrypoints to high-signal routes and converted secondary references to plain code paths. Post-change link-density scan shows the top docs hub at `10` links, `docs/soar-documentation-map.md` at `6`, and docs maps at `4-6`; link check and docs guardrails pass. | mitigated | REQ-DOC-003 | Keep future docs maps sparse; add links only when the relationship should be visible in Obsidian graph. | 2026-05-23 |
| RISK-DOC-002 | Documentation knowledge taxonomy | A flat history archive may still force agents to search through unrelated task, audit, release, evidence, and raw artifact records, increasing context noise and false source-of-truth assumptions. | medium | medium | `history/` has only broad buckets or current docs retain dated/audit/generated artifacts. | Refined history into semantic folders, moved residual historical docs out of `docs/`, updated references and indexes, and validated with link/stale-path checks plus guardrails/docs parity. | mitigated | REQ-DOC-002 | Keep new generated outputs pointed at semantic history folders. | 2026-05-23 |
| RISK-DOC-001 | Documentation knowledge system | Agents may confuse dated execution history, audit logs, and generated proof artifacts with current product, architecture, planning, or operations truth if everything remains inside `docs/`. | medium | medium | Obsidian graph and agent search results are dominated by one-off dated task files, old evidence, and operational proof output under documentation folders. | Split dated planning and operations records into `history/`, add `docs/maps/*` and `history/*` indexes, update governance/agent docs, redirect generated evidence scripts toward `history/evidence`, and validate with stale-path/link scans plus guardrails. | mitigated | REQ-DOC-001 | Keep future task/proof output out of `docs/` unless it is current source-of-truth documentation. | 2026-05-23 |
| RISK-LIVE-EXCHANGE-MUTATION-2026-05-23 | LIVE exchange execution | Gate.io/Binance live proof could open a position larger than the operator intended if symbol resolution mixes spot/swap markets or derivative contract size is ignored in manual context, pretrade, runtime sizing, wallet funds checks, or reused close dedupe truth. | medium | high | A Gate.io swap symbol such as `ADAUSDT` shares a normalized symbol/id with the spot market, a contract-based exchange treats `quantity` as contracts while the app displays/calculates it as base quantity, or a reused submitted close is misreported as closed before fill confirmation. | Local fix now prefers configured CCXT market type, filters market maps by market type, carries `contractSize`, and applies contract-size notional math across manual pretrade, manual context, runtime guard, runtime sizing, and wallet funds checks. Focused tests `129/129`, API typecheck, guardrails, and diff check pass. DB-backed manual-order service and route proof now blocks the exact wrong interpretation that `quantity=4` Gate.io ADAUSDT means roughly `1 USDT` base-size exposure; with `contractSize=10` and `markPrice=0.25`, the context reports `10 USDT` notional and `2 USDT` margin at leverage `5`. LIVE close dedupe now returns `submitted` for reused submitted close orders and reserves `closed` for completed dedupe. Commit `9d1a8387`, docs/state HEAD `a0e4f117`, and Web dashboard follow-up `b703b67f` are publicly deployed and public no-worker smoke passes. No new production LIVE mutation was attempted after the fix. | mitigating | REQ-LIVE-EXCHANGE-PARITY-2026-05-23 | Run protected manual/bot readbacks only with transient Soar app auth; require explicit operator approval for a minimum-contract-size order because ADAUSDT Gate.io cannot satisfy a `<=1 USDT` cap. | 2026-05-23 |
| RISK-039 | Protected release evidence | V1 may be overclaimed as production-ready if healthy deploy, worker readiness, restore, rollback, UI, SLO, and RC evidence are mistaken for `LIVEIMPORT-03` runtime payload proof. | medium | high | Historical `72b547e` proof failed closed for manually requested `ETHUSDT`/`DOGEUSDT`, but the current release proof now uses production auto-discovery and passed `LIVEIMPORT-03` for real open runtime payloads `SOLUSDT` and `BNBUSDT` on deployed `b1ba69edccc639e97943f37fb2b1e6249a62e87c`; follow-up deploy `db07214667a700ba02ea8210629655cf2becd7d6` reached build-info and authenticated deploy smoke passed. | 2026-05-23 final preflight and full non-dry-run release gate are ready after liveimport readback, and the state docs now distinguish historical failed payload requests from current release truth. No secrets were persisted and no LIVE order/position mutation was run by Codex. | mitigated | REQ-FUNC-021 | Keep `--symbols auto` as the default release readback pattern, refresh deploy smoke/build-info after future pushes, and continue forbidding LIVE order/position creation without separate explicit operator approval. | 2026-05-23 |
| RISK-038 | Supply-chain / Ops secrets | Protected ops credentials may leak through CLI argv, shell history, process listings, or command artifacts; local runtime env files may be accidentally tracked if repo policy drifts. | medium | high | Operator passes auth token/password/private OPS header value via CLI, or a `.env` runtime file is committed outside redacted examples. | `SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21` rejects secret-bearing CLI flags across protected ops scripts, requires existing env var families for secret values, adds root env-file ignore policy, and adds guardrails for tracked runtime env files plus secret-bearing ops-script argv parsers. | mitigating | REQ-SEC-041 | External VPS/cloud egress review, protected production `AUD-19`, and operator rotation/removal of any local untracked env secrets remain separate follow-ups. | 2026-05-21 |
| RISK-037 | LIVE cancel entitlement | Exchange-backed LIVE order cancel could reach the adapter boundary after a user subscription downgrade if cancel only checked `riskAck` and ownership. | medium | high | Manual cancel or runtime stale-order lifetime cancel targets an exchange-backed LIVE order after active entitlement no longer allows `liveTrading`. | `MONEY-FLOW-SECURITY-CANCEL-ENTITLEMENT-2026-05-21` adds a current `liveTrading` entitlement check before exchange-backed cancel boundary calls and before local cancel mutation. Parent verification reran the focused DB-backed cancel/API-key pack with local Postgres/Redis; `2` files / `20` tests passed. API/Web typecheck, full Web test pack, guardrails, build, audit, compose config, and diff check also passed. | mitigated | REQ-SEC-040 | Keep real LIVE exchange-side mutation proof separate and approval-gated. | 2026-05-21 |
| RISK-000 | process | Agents may report progress without requirement-level proof. | medium | high | Work changes behavior but matrix/evidence is not updated. | Require requirement matrix updates before DONE. | mitigating | REQ-FUNC-000 | Replace sample row with project-specific risks. | 2026-05-11 |
| RISK-001 | Bots UI actions | Operators may be blocked or confused when deleting active PAPER bots if PAPER activity is treated like LIVE trading risk. | medium | high | Active PAPER bot delete asks for LIVE confirmation or appears not to work. | Restrict LIVE delete confirmation to `mode === "LIVE"` or `liveOptIn`; keep regression coverage for active PAPER and LIVE paths. 2026-05-14 production disposable bot fixture cleanup passed. 2026-05-19 `AUD-10` refreshed local Web bot/runtime evidence (`8` files / `61` tests) and API bot/runtime evidence (`10` files / `88` tests). | closed | REQ-FUNC-001 | Reopen only on a new failing Bots delete/action signal; LIVE mutation remains separately approval-gated. | 2026-05-19 |
| RISK-002 | Dashboard Home | Operators may act on stale or incomplete runtime truth if wallet KPIs or runtime tabs remain bound to the previously selected bot, if backend fields are missing from the Web contract, or if the runtime surface has no usable bot context. | medium | high | Selected bot changes while wallet/tables still show stale symbol, order, or trade rows; initial runtime load fails; empty operator account opens Dashboard Home; backend returns nullable trade relationship IDs, `origin=USER`, aggregate `openPositionQty`, or enum values outside stale Web fixture assumptions but Web assumes a narrower or legacy contract. | Rendered component proof locks loading state, retryable error state, selected-bot switch, wallet KPI recalculation, Orders tab rows, History tab rows, and previous-bot row suppression. Local browser proof locks authenticated empty/onboarding state on desktop and mobile with no console errors. Snapshot import creates PAPER wallet/session/stat/event data; API and browser proof render active open positions and wallet KPIs through the existing runtime contract. 2026-05-13 parity slices align nullable trade IDs, backend `USER` origin, `openPositionQty`, and backend-compatible enum domains. 2026-05-14 production evidence verifies authenticated `/dashboard` route reachability and simultaneous production runtime readback for both Binance PAPER bots plus controlled Binance LIVE observation without order placement. | closed | REQ-FUNC-002 | Reopen only on a new Dashboard/runtime failing signal or a broader Gate.io/2x LIVE scope decision. | 2026-05-14 |
| RISK-003 | Bot Runtime | Operators may lose trust in bot monitoring if the runtime route, API aggregate, positions readback, worker telemetry, completed-session history, and legacy runtime links disagree for a PAPER bot or if Web assumes backend relationship IDs/origins/enum domains use old shapes. | medium | high | Canonical route renders no session while API has a running session, positions are missing from the monitoring view, worker live-loop telemetry is not reflected in runtime APIs, completed history cannot be filtered, symbols disappear at responsive sizes, legacy runtime links strand the operator, a runtime trade without local order/position/strategy IDs crashes or misleads the table, a backend `USER` position origin appears as unknown, Web tests pass with impossible backend enum values, local monitoring prop unions drift from shared runtime aliases, local multi-bot proof is mistaken for production resource readiness, or Binance/Gate.io runtime candles share in-memory series for the same symbol. | Local API/browser proof validates representative running and completed PAPER sessions through approved snapshot import, canonical preview route, runtime sessions, aggregate, positions, symbol stats, trades, responsive screenshots, completed filter, safe view switch, and legacy redirects. Focused worker e2e proof validates real `RuntimeSignalLoop` telemetry readback. 2026-05-13 parity slices close nullable relationship/origin/enum drift, and runtime candle/derivative stores are exchange-scoped. 2026-05-14 production evidence verifies authenticated runtime route/redirect reachability, both Binance PAPER bots with fresh `RUNNING` sessions, controlled no-order-guard Binance LIVE runtime readback, `LIVEIMPORT-03` PASS, and post-cleanup inactive LIVE state. 2026-05-19 `AUD-10` refreshed local runtime truth evidence with Web bot/dashboard runtime pack (`8` files / `61` tests) and API bot/runtime pack (`10` files / `88` tests). | closed | REQ-FUNC-003 | Reopen only on a new runtime failing signal or a broader Gate.io/2x LIVE production resource decision. | 2026-05-19 |
| RISK-004 | Auth | Operators may keep access after logout, expired JWT, deleted user, or malformed duplicate-cookie state if Auth does not fail closed consistently. | medium | high | `/auth/me` accepts a logged-out or expired session; protected routes do not redirect missing/expired sessions; duplicate cookies select stale identity. | Local API proof validates logout clearing, expired JWT clearing, deleted-user expiry, login TTLs, and duplicate-token precedence. Focused Web proof validates AuthProvider logout/session-expired warning, API interceptor redirect, middleware cookie gate, and login fail-closed handling. 2026-05-14 production auth proof on deployed `2fc90a08` found direct pre-logout JWT reuse still returned `/auth/me` `200`; the deployed `84711599` fix increments the matching user's `sessionVersion` on logout. Production rerun passed: unauthenticated protected route redirects to `/auth/login`, authenticated dashboard renders, invalid token redirects to `/auth/login?session=expired`, logout returns `200`, stale pre-logout token returns `/auth/me` `401`, and dashboard after logout redirects to `/auth/login`. 2026-05-19 `AUD-06` refreshed local auth/middleware/header/Web auth evidence: `9` API files / `32` tests, `7` Web files / `28` tests, and public auth cache contract `1` file / `2` tests. | closed | REQ-FUNC-004 | Reopen only on a new failing auth/session signal or changed session architecture. | 2026-05-19 |
| RISK-005 | Profile API Keys | Raw exchange credentials may leak, be stored unencrypted, be tested outside the approved adapter boundary, or be mutated by the wrong user. | medium | high | API key create/list exposes raw secret, provided test credentials are persisted, audit logs contain raw key material, unsupported exchange probes act as if supported, or another user can update/delete/test a key. | Local API proof validates encrypted-only storage, masked responses, no persistence of provided test credentials, audit metadata redaction, Binance/Gate.io probe contracts, placeholder probe fail-closed behavior, bad-key/futures-missing rejection, and owner-only mutation/test behavior. Local Web proof validates connection-test-before-save and delete risk confirmation. 2026-05-14 production fixture proof validates masked create, stored probe fail-closed behavior, audit event readback, and cleanup without raw secret artifacts. 2026-05-19 `AUD-06` refreshed local API-key/probe/ownership and Web form/list evidence inside the focused security packs; no raw secrets were written to audit artifacts. | closed | REQ-FUNC-005 | Reopen only on a new failing API-key secrecy/ownership/probe signal or changed exchange-key scope. | 2026-05-19 |
| RISK-006 | Profile | Operators may believe profile/security updates succeeded when the UI did not submit the intended payload, or security routes may allow weak/invalid password/account-delete behavior. | medium | high | Profile form save fails silently, timezone preference payload drifts, password mismatch still calls the API, invalid current password changes credentials, weak passwords are accepted, or account delete lacks password confirmation. | Local API proof validates timezone persistence/rejection, unauthenticated security rejection, valid-current-password-only change, weak/invalid rejection, old-login failure/new-login success, and password-confirmed account deletion. Local Web proof validates save success/error feedback, timezone payload, password mismatch short-circuit, and password change feedback. 2026-05-14 production fixture proof validates profile read, reversible update, and restore. 2026-05-19 `AUD-06` refreshed local profile basic/security and stage abuse throttling evidence (`7` API files / `47` tests) plus Web profile security evidence (`7` Web files / `28` tests). | closed | REQ-FUNC-006 | Reopen only on a new failing Profile form/security signal or changed profile scope. | 2026-05-19 |
| RISK-007 | Wallets | Operators may configure or mutate the wrong capital context if wallet ownership, LIVE API-key binding, active-bot guards, balance preview, reset, or ledger states drift. | medium | high | Cross-user wallet/API-key access succeeds, LIVE wallet accepts mismatched key or missing allocation, active bot wallet can be edited/deleted, unsupported preview appears successful, paper reset clears unsafe state, or unavailable ledger still shows confident totals. | Local API proof validates CRUD/ownership, active-bot edit/delete guards, LIVE key/allocation validation, preview allocation/fail-closed paths, paper reset guards, reset checkpoint preservation, cashflow classification, and open-PnL scoping. Local Web proof validates list/create/edit/preview/reset/ledger states. 2026-05-14 production fixture proof validates disposable wallet create/update/readback/delete, and wallet/bot cleanup hardening validates active-bot reset fail-closed behavior. 2026-05-19 `AUD-14` refreshed local Web wallet/capital evidence (`10` files / `23` tests) and API wallets/capital evidence (`7` files / `84` tests). | closed | REQ-FUNC-007 | Reopen only on a new failing Wallets safety/CRUD/reset signal; LIVE exchange mutation remains separately approval-gated. Track wallet command audit-log events under `AUD-17`. | 2026-05-19 |
| RISK-008 | Markets | Operators may alter runtime symbol scope incorrectly if market universe composition, catalog capability, active-bot guards, stale legacy links, or ownership isolation drift. | medium | high | Active bot universe can be edited/deleted, inactive bot remains blocked unnecessarily, stale legacy links block the current scope, placeholder catalog looks supported, whitelist/blacklist composition differs from API, or another user can mutate a universe. | Local API proof validates CRUD/ownership, canonical symbol composition, catalog/capability responses, active/inactive/stale-link guards, and cross-user isolation. Local Web proof validates preview composition, empty preview submit, placeholder submit, validation, table clone payload, and route shells. 2026-05-14 production fixture proof validates disposable universe create/update/catalog read/delete. 2026-05-19 `AUD-15` refreshed local Web markets/strategies evidence (`19` files / `60` tests) and API markets/strategies evidence (`4` files / `35` tests). | closed | REQ-FUNC-008 | Reopen only on a new failing Markets scope/catalog/guard signal. Track catalog source freshness telemetry as an observability follow-up. | 2026-05-19 |
| RISK-009 | Strategies | Operators may run or backtest unintended trading logic if strategy CRUD, clone payloads, config validation, indicator metadata, active-bot guards, or ownership isolation drift. | medium | high | Active bot strategy can be edited/deleted, inactive bot update is blocked unnecessarily, invalid config/import payloads persist, clone payload loses rule state, indicator taxonomy drifts, the Web edit page fails to submit an allowed inactive-linked strategy update, or another user can mutate a strategy. | Local API proof validates CRUD/export/import, ownership, active/inactive bot guards, config validation, and indicator catalog. Local Web proof validates clone payloads, routes, form validation, presets, indicators, mapping, numeric normalization, close validation, presentation, and taxonomy. 2026-05-14 production fixture proof validates disposable strategy create/export/update/delete plus bot link/readback and backtest compatibility. 2026-05-14 inactive PAPER strategy edit proof verifies Web submit for the backend-allowed path and active-bot lock recovery while API strategies e2e remains green. 2026-05-19 `AUD-15` refreshed local Web markets/strategies evidence (`19` files / `60` tests) and API markets/strategies evidence (`4` files / `35` tests). | closed | REQ-FUNC-009 | Reopen only on a new failing Strategies config/guard/runtime-compatibility signal. Track typed strategy domain errors and Web i18n/dirty-state follow-ups separately. | 2026-05-19 |
| RISK-010 | Manual Orders | Operators may place, cancel, close, or interpret manual orders incorrectly if selected-bot scope, price truth, lifecycle state, ownership, or live-risk guards drift. | medium | high | PAPER orders open without canonical price truth, reverse-side conflict is allowed, another user's order is visible or mutable, exchange-backed orders are locally canceled without boundary success, Web hides a blocked reason, or LIVE mutation runs without an explicit safe plan. | Local API proof validates manual context, PAPER market truth, selected-bot scope, ownership, quantity rules, live risk guards, exchange-backed fail-closed cancel behavior, fill resolution, and cancel boundary. Local Web proof validates manual submit/validation, context/venue/scope, open-order source/cancel actions, and lifecycle action states. 2026-05-14 production fixture proof on deployed `457bce05` validates manual context, disposable PAPER limit order open/readback, cancel fail-closed without `riskAck`, cancel with `riskAck`, and terminal canceled readback. 2026-05-19 `AUD-12` refreshed local Web manual/open-order evidence (`8` files / `46` tests) and API orders/manual evidence (`10` files / `121` tests). | mitigating | REQ-FUNC-010 | Keep LIVE mutation blocked-risk until explicitly approved; reopen only on a new failing Manual Orders signal. | 2026-05-19 |
| RISK-011 | Positions | Operators may act on stale, cross-user, ambiguous, or unsafe position truth if list/read, update, close, takeover, snapshot, or reconciliation contracts drift. | medium | high | Stale local rows appear active, another user's position is visible or mutable, ambiguous takeover is treated as owned, exchange snapshots pick an unsafe key, manual TP/SL updates closed/stale positions, runtime close hides ignored results, or live mutation runs without a safe plan. | Local API proof validates list/read ownership, live status, snapshots, takeover, orphan repair, imported history, reconciliation, manual update guards, management-mode guards, and close flows. Local Web proof validates runtime PnL derivations and close action states. 2026-05-14 production proof on deployed `2fc90a08` validates PAPER-only position open/read/update/close lifecycle, live-status/takeover-status/exchange-snapshot reads, close-without-ack fail-closed behavior, terminal closed readback, and OPEN-list cleanup without LIVE or exchange-side mutation. 2026-05-19 `AUD-13` refreshed local Web runtime positions evidence (`6` files / `46` tests) and API positions/reconciliation evidence (`11` files / `68` tests). | closed | REQ-FUNC-011 | Reopen only on a new failing Positions signal or changed production position scope; LIVE mutation remains blocked without separate explicit approval. | 2026-05-19 |
| RISK-012 | Orders | Operators may see or mutate unsafe order lifecycle truth if list/read, cancel, fills, fees, exchange events, source labels, or live-risk guards drift. | medium | high | Stale rows stay active, another user's order is visible, exchange-backed orders are locally canceled without boundary success, underfilled events open positions, fees are silently wrong, terminal orders expose cancel, or live mutation runs without a safe plan. | Local API proof validates order lifecycle, ownership, active filtering, exchange-backed fail-closed cancel/close, exchange event fill/fee handling, fee backfill, live fill resolution, quantity rules, position scope, and live cancel boundary. Local Web proof validates source labels, cancel actions, and terminal read-only rows. 2026-05-14 production fixture proof on deployed `457bce05` validates disposable PAPER limit order open/readback, cancel fail-closed without `riskAck`, cancel with `riskAck`, and terminal canceled readback without LIVE or exchange mutation. 2026-05-19 `AUD-12` refreshed local API order lifecycle/exchange-event evidence (`10` files / `121` tests) and Web open-order action/source evidence (`8` files / `46` tests). | mitigating | REQ-FUNC-012 | Keep live mutation blocked-risk until explicitly approved; reopen only on a new failing Orders signal. | 2026-05-19 |
| RISK-013 | Backtests | Operators may trust misleading simulation output if run lifecycle, report readiness, replay parity, symbol scope, worker persistence, or details UI contracts drift. | medium | high | Another user's run is readable, explicit ranges are ignored, report pending state looks missing, empty symbol sets run silently, paper/live parity diagnostics disappear, worker results are not persisted, or Web list/details/timeline views present stale or incomplete state. | Local API proof validates ownership, create/list/get/delete, range validation, pending report contract, worker/job persistence, replay/fill/timeline behavior, strategy/market/backtest/paper/live parity, symbol formula, and fail-closed diagnostics. Local Web proof validates route shells, create form, list/details views, table actions, core-data hook, and timeline/report utilities. 2026-05-14 production fixture proof on deployed `457bce05` validates disposable run create/readback, report readback, trades readback, timeline readback with candles, and delete cleanup. 2026-05-19 `AUD-16` refreshed local Web backtests/reports evidence (`15` files / `37` tests) and API backtests/reports evidence (`13` files / `114` tests). | mitigating | REQ-FUNC-013 | Keep proof fresh after future deploys; non-Binance historical order-book parity remains outside current V1 support. | 2026-05-19 |
| RISK-014 | Reports | Operators may misread performance if cross-mode aggregation, per-run summary tables, empty state, or localized report copy drift from API truth. | medium | medium | BACKTEST win rate is averaged incorrectly, PAPER trade aggregation drops losing trades, route shell renders without the reports view, empty state hides fetch failures, or localized report copy is unreachable. | Local API proof validates weighted backtest and paper trade aggregation. Local Web proof validates route shell, empty state, aggregated cards/tables, and route-reachable locale copy. 2026-05-14 production fixture proof on deployed `457bce05` validates per-run report readback for a disposable production backtest run. 2026-05-19 `AUD-16` refreshed local Web backtests/reports evidence (`15` files / `37` tests) and API backtests/reports evidence (`13` files / `114` tests). | mitigating | REQ-FUNC-014 | Keep proof fresh after future deploys; export/download remains outside the current implemented Reports surface. Track richer filters, snapshot persistence, and i18n hardening as future reporting scope. | 2026-05-19 |
| RISK-015 | Logs/Audit Trail | Operators may miss or over-trust audit evidence if logs are cross-tenant, filters/pagination drift, action-produced events are invisible, or metadata rendering is unsafe. | medium | high | Another user's log is visible, unauthenticated reads succeed, source/actor/severity filters return wrong rows, pagination accepts unsafe bounds, action-generated audit logs are missing, or metadata is rendered as executable markup. | Local API proof validates unauthenticated rejection, owner-only reads, filters, pagination, and action-produced event visibility. Local Web proof validates route shell, empty/loaded states, severity filter request payload, and metadata trace text rendering. 2026-05-14 production fixture proof validates action-produced API-key probe audit event readback, and production route audit validates `/dashboard/logs` render. 2026-05-19 `AUD-17` refreshed local Web logs/audit evidence (`2` files / `3` tests) and API logs/pagination evidence (`2` files / `5` tests). | closed | REQ-FUNC-015 | Reopen only on a new failing Logs/Audit filter/readback/rendering signal. Track total-count envelope, pagination controls, saved filters, index tuning, and command-event write coverage separately. | 2026-05-19 |
| RISK-016 | Exchange Adapter | Trading modules may use wrong exchange capability truth, malformed public symbols, unsupported authenticated reads, unsafe live adapter behavior, or UI gates that imply unsupported operations are safe. | medium | high | Gate.io catalog emits `BTC_USDT` into Soar symbol scope, unsupported exact operations do not fail closed, probes persist or expose secrets, live adapter retry/fill/fee paths drift, Web gating contradicts backend support, or Engine bypasses the Exchange public market-data boundary with Binance REST. | Local fix normalizes public catalog symbols to canonical Soar form. API proof validates probes, capability contracts, public/authenticated reads, connector factory/registry, live adapter and fee boundaries, symbol rules, metadata, snapshot normalization, and runtime exchange guards. 2026-05-13 runtime warmup now uses the Exchange public market-data boundary, with a Gate.io regression proving Binance REST is not called. Web proof validates capability gating and profile API-key integration. 2026-05-14 production proof on deployed `2fc90a08` verifies unsupported exchange probe fail-closed behavior, Binance/Gate.io public catalog reads, Gate.io canonical symbols, and protected readiness details without live mutation. | closed | REQ-FUNC-016 | Reopen only on a new failing exchange-boundary signal or changed exchange support scope; live-money mutation requires a separate explicit safe plan. | 2026-05-14 |
| RISK-017 | Workers | Operators may trust stale or missing background processing if worker topology, readiness, market-stream fanout, queue tuning, job persistence, or runtime freshness checks drift. | medium | high | Split deployment lacks required queues but reports ready, stale market/runtime sessions pass freshness, market-stream publish failures are not retried, backtest worker results are not persisted, runtime-flow telemetry is not visible, or protected worker endpoints leak unauthenticated details. | 2026-05-14 production-safe protected runtime/readiness proof remains historical production evidence. 2026-05-19 `AUD-08` refreshed local worker/runtime operations evidence: API worker/runtime pack passed (`17` files / `85` tests), covering worker ownership/topology, protected worker health/readiness, runtime freshness pass/fail/skip behavior, global `/ready` diagnostics, market-stream source/fanout/subscription/route contracts, exchange polling/Binance stream parsing, backtest job persistence, queue tuning, execution orchestration, and PAPER runtime-flow telemetry. Expected stderr appeared only in the intentional Redis-startup retry test. | mitigating | REQ-FUNC-017 | Refresh production-safe protected worker/process proof after future deployments or worker topology changes; keep Gate.io/second-LIVE production runtime shape outside current claims until explicitly planned. | 2026-05-19 |
| RISK-018 | Security/Privacy | Operators may expose credentials, accept unsafe sessions, leak cross-user data, bypass rate limits, or trust insecure readiness if Security/Privacy contracts drift. | medium | high | Expired or duplicate sessions are accepted incorrectly, unsafe origins mutate state, ops/admin endpoints leak diagnostics, critical secret readiness ignores malformed rotation windows, API key secrets appear in responses/loggable errors, rate-limit degradation allows production requests without Redis, cross-user data is visible, or profile/security abuse flows are unthrottled. | Local API/Web proof validates headers/cache, auth/session/JWT/cookie lifecycle, trusted-origin and ops-network guards, critical secret readiness, crypto/keyring behavior, API error redaction, rate-limit degradation, ownership isolation, Profile API-key masking/encryption/audit/probes, Profile security actions, stage-abuse throttling, authenticated snapshots, and Web auth/profile guard behavior. Test env restoration was tightened for JWT rotation and keyring variables. 2026-05-14 production proof on deployed `2fc90a08` verifies security headers, no-store authenticated profile reads, unauthenticated protected/ops/metrics fail-closed behavior, API-key list redaction, controlled untrusted-origin `403`, unsupported probe fail-closed behavior, and authenticated readiness details. | closed | REQ-FUNC-018 | Reopen only on a new failing security/privacy signal or changed auth/secret/ops scope; external independent security review remains a governance follow-up. | 2026-05-14 |
| RISK-019 | UX/A11y/Mobile | Operators may abandon or misuse core workflows if routes render blank, hide recovery states, break keyboard/mobile navigation, overlap content, or surface runtime errors only outside component tests. | medium | medium | Dashboard route renders a blank shell, mobile navigation cannot open or trap-scrolls incorrectly, empty/error states do not explain next action, keyboard focus is invisible, route locale copy is missing, framework/runtime errors appear only during browser rendering, or production protected routes fail closed despite local proof. | Local proof validates route reachability, desktop Dashboard and Wallets empty states, mobile Dashboard/menu rendering, menu focus/click interaction, shared state/form/table/tab components, responsive header/footer, route locale smoke, no framework overlay, and zero CDP console/exception events. 2026-05-13 authenticated production UI route audit validates deployed public/dashboard/admin/legacy route reachability with no blockers and no secret leakage in artifacts. 2026-05-14 production UI route/module audit and production CDP proof pass on deployed `2fc90a08` with authenticated desktop Dashboard/Wallets/Bots/Profile screenshots, mobile Dashboard screenshot, mobile menu click, keyboard focus, no framework overlay, and no horizontal overflow. | closed | REQ-FUNC-019 | Reopen only on a new failing UX/browser/a11y signal; keep unnamed internal-control warnings as post-V1 polish. | 2026-05-14 |
| RISK-020 | Subscriptions/Admin | Operators could accidentally expose admin-only controls, corrupt entitlement limits, demote their own admin account, or trust a blank/broken admin UI if role and subscription management are not proven together. | medium | high | Non-admin user reaches admin plan/user APIs, invalid entitlement limits persist, admin self-demotion succeeds, active subscription metadata disappears from user list, or protected admin pages render broken/blank HTML. | Local proof validates unauthenticated and non-admin rejection, entitlement update validation, invalid entitlement rejection, self-demotion block, user subscription metadata, direct entitlement fallback/LIVE fail-closed behavior, Web loaded/error/action states, local admin route audit, and Edge/CDP rendered admin pages with no framework overlay. 2026-05-14 production UI module audits validate authenticated admin route rendering for `/admin/users` and `/admin/subscriptions`. 2026-05-19 `AUD-18` refreshed local Web admin/subscription evidence (`4` files / `9` tests) and API admin/subscriptions evidence (`5` files / `25` tests). | closed | REQ-FUNC-020 | Reopen only on a new failing admin access/rendering/entitlement signal or changed admin mutation scope; non-destructive production entitlement mutation remains separately approval-gated. | 2026-05-19 |
| RISK-021 | Operations | V1 could be promoted without enough rollback, SLO, alert, restore, sign-off, liveimport readback evidence, or build-info proof for the actual target candidate. | high | high | Release gate relies on local-only proof, production build-info lags behind pushed `main`, protected worker/runtime/rollback proof lacks approved app/operator auth, stage is unavailable (`503`), liveimport readback has no production artifact/running fixture, rollback evidence is failed/missing, restore evidence is failed/missing, protected input families are absent, public smoke is mistaken for protected release readiness, or the remediation roadmap loses the `AUD-19` blocker or points at missing evidence. | 2026-05-13 production target gate passed for deployed `00169d7f`, including final `LIVEIMPORT-03`, build-info freshness, post-deploy smoke, runtime freshness, rollback guard, and target-only readiness. 2026-05-14 protected gate for `457bce05` verified protected runtime freshness, rollback proof, authenticated production UI clickthrough, controlled no-order-guard `LIVEIMPORT-03`, RC gates/sign-off/checklist, production backup/restore drill, final preflight, and full non-dry-run release gate as ready. 2026-05-19 `AUD-19` refreshed local release evidence: typecheck, lint, build, go-live smoke (`45` API tests and `18` Web tests), and local backup/restore check passed after required local Postgres startup. 2026-05-19 post-push readback for `36ff999d` found production build-info still on `1586f59261cef94d7c513d71bbfcfb697d11ca59` while public smoke passed for the deployed service. Follow-up fast-forwarded `origin/main` to `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`; build-info and public smoke passed for that SHA. No-auth protected preflight for `dd1a1faf` passed build-info/public smoke and blocked on missing protected inputs plus stale 2026-05-14 release evidence. Dated no-secret RC packet for `dd1a1faf` records Gate 2 `OPEN`, Gate 4 `OPEN`, and strict evidence check failure on missing approver/owner fields. Current operator unblock packet for `dd1a1faf` records required inputs, ordered commands, stop conditions, and acceptance rule. Current names-only readiness sweep found `0` matching protected input names in this shell and reusable `ops:protected-inputs:check` tooling now regression-locks no-value output. `audit:remediation-plan:check` now also fails if the machine-readable repair roadmap omits the current `AUD-19` blocker, loosens safety boundaries, references missing source/evidence paths, or omits required cleanup checks. Reusable audit rerun closure now requires `audit:manifest:verify`, `audit:rerun-playbook:check`, and `audit:remediation-plan:check`; tooling-index validation also enforces required closure commands, self-check closure evidence, and required cleanup checks, rerun-playbook validation enforces required cleanup checks, and handoff validation keeps source paths, blockers, rollup summary counts, boundaries, self-check evidence, and safety booleans checkable; tooling-index commands are checked against package scripts, manifest summary/path metadata is checked against actual contents, full reusable audit rollup validation keeps repair queue and safety boundaries checkable, and manifest comparison now uses leading status buckets to avoid false regressions from hybrid current/deferred wording, can persist JSON comparison reports with `--json-output <path>`, and rerun playbook validation requires persisted `compareJson` output, and tooling-index validation checks Markdown/JSON tool ID parity, and manifest validation checks Markdown/JSON summary count parity, and rollup validation checks Markdown/JSON audit ID and summary count parity. | mitigating | REQ-FUNC-021 | Provide approved protected auth/context, collect Gate2 SLO evidence, provide named Gate4 sign-off/owner fields, then execute the current operator unblock packet before any full production readiness claim. | 2026-05-19 |
| RISK-022 | Non-Gate.io runtime proof | Operators may assume "everything except Gate.io works" even though current production only proves active Binance PAPER runtime and not current Binance LIVE runtime. | medium | high | Gate.io is deferred and production readback finds both PAPER bots running, but the Binance LIVE bot remains inactive with no RUNNING session. | Closed for the current non-Gate.io release scope on 2026-05-14: local LIVE/PAPER isolation remained green (`25/25` API tests, `24/24` Web tests); controlled no-order-guard production proof activated the existing Binance LIVE bot only for the observation window; `LIVEIMPORT-03` passed for `TRXUSDT`; simultaneous read-only runtime readback showed the Binance LIVE bot and both Binance PAPER bots RUNNING; and post-cleanup readback confirmed the LIVE bot was inactive again. Gate.io/second-LIVE production shape remains unavailable/deferred rather than hidden. | closed | REQ-FUNC-003 | Reopen only if a second LIVE/Gate.io production bot is intentionally created for a broader 2x LIVE proof or a new failing runtime signal appears. | 2026-05-14 |
| RISK-023 | Bot/backtest market data | Backtests or bot fallback paths may silently reuse Binance candle/ticker/cache data for a non-Binance exchange, creating misleading parity, PnL, and simulation output. | medium | high | Candle, ticker, funding-rate, open-interest, or order-book loading bypasses the Exchange public market-data boundary, runtime position readback only asks Binance for fallback prices, cache uniqueness ignores exchange/source, or Web hides backend exchange/parity diagnostics. | `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` routes backtest and runtime fallback candles through the Exchange public market-data boundary, carries exchange through run/timeline replay, scopes `MarketCandleCache` uniqueness by `source`, and updates Web timeline types. `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` routes generic fallback ticker prices through the Exchange public market-data boundary and renders Backtest venue context in details. `V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13` routes non-Binance futures backtest funding-rate and open-interest history through the Exchange public adapter where CCXT supports it, while keeping non-Binance historical order-book input empty instead of using current snapshots as fake history. `V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13` routes runtime non-Binance funding/open-interest/order-book supplemental fallbacks through Exchange public adapter boundaries and scopes derivative fallback caches by exchange. 2026-05-14 deploy refresh confirms `457bce05` is production build-info fresh and focused LIVE/PAPER runtime tests remain green. | mitigating | REQ-FUNC-022 | Run production-safe multi-bot/runtime/backtest clickthrough after the production LIVE/Gate.io resource shape exists; historical non-Binance order-book backtest support remains separate. | 2026-05-14 |
| RISK-024 | Production fixture action proof | A literal V1 100% push could accidentally mutate existing production data, submit live-money actions, leak secrets in artifacts, or leave disposable proof data behind if remaining `PASS_LOCAL` rows are exercised without an explicit fixture boundary. | medium | high | Production action clickthrough creates, edits, deletes, cancels, closes, probes, or screenshots real data without owner approval, cleanup verification, or redaction. | Published `history/evidence/v1-production-fixture-action-proof-plan-2026-05-14.md` to define approval wording, allowed PAPER-only fixture actions, forbidden LIVE/money mutations, cleanup verification, and redaction rules. 2026-05-14 production proof passed for disposable Profile/API-key/Wallet/Market/Strategy/Bot fixtures, Manual Orders/Orders PAPER limit open/read/cancel lifecycle, Backtests/Reports disposable run/report/trades/timeline/delete lifecycle, Exchange Adapter probe fail-closed behavior, Positions PAPER open/update/close lifecycle, UX/A11y/Mobile production route/browser proof, and audit/readback checks with cleanup or terminal-state proof `PASS`; terminal PAPER proof rows remain only as audit/history. | closed | DEC-001 | Reopen only on a new failing production-proof signal; LIVE order/cancel/close and existing-data mutation remain blocked without separate explicit approval. | 2026-05-14 |
| RISK-025 | Bot and wallet data lifecycle | Deleted bots may leave bot-owned positions, orders, trades, fills, signals, logs, or runtime rows behind, causing stale open state, misleading dashboard history, or blocked PAPER wallet resets. | medium | high | A bot is deleted and later wallet reset reports open positions/orders, or runtime/dashboard tables still show rows directly owned by the deleted bot. | `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` changes bot deletion to remove direct bot-owned runtime/trading artifacts in one transaction while preserving the strategy, and adds an active-bot guard to PAPER wallet reset. Local proof: API typecheck PASS, bot delete cleanup e2e PASS (`1/1`), Bots e2e PASS (`26/26`), Wallets e2e PASS (`24/24`). 2026-05-19 `AUD-10` reran bot delete cleanup inside the focused API bot/runtime pack (`10` files / `88` tests). | closed | REQ-FUNC-025 | Reopen only on a new failing deleted-bot cleanup signal; keep production proof limited to disposable PAPER fixtures unless LIVE mutation is separately approved. | 2026-05-19 |
| RISK-026 | Dashboard icon consistency | Operators may see repeated generic placeholders for common trading assets whenever CoinGecko is unavailable or search results are ambiguous, making symbol tables look broken even though market data is valid. | medium | medium | A common symbol such as `TRXUSDT`, `LINKUSDT`, or `ZECUSDT` is outside the curated fallback map and provider lookup fails. | `POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14` replaces split hint/icon maps with one curated asset catalog and proves a common trading basket resolves to curated icons, not placeholders, under CoinGecko `503`. | closed | REQ-FUNC-026 | Keep future additions catalog-based with verified local icon slugs; reopen only on a new common-symbol placeholder regression. | 2026-05-14 |
| RISK-027 | Backtest history auditability | Operators may compare or trust historical backtests whose visible strategy or market context changed after the run was created. | medium | high | A strategy is renamed/reconfigured after a run, a market universe is edited/deleted, or historical list/timeline/replay uses mutable records instead of creation-time context. | `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14` persists immutable strategy and market-universe snapshots in new backtest seeds, resolves list/timeline/replay from snapshot strategy truth first, and blocks strategy/market-universe deletion while owned backtest history references the mutable source record. Focused API e2e passed (`44/44`). | closed | REQ-FUNC-027 | Extend immutable-history coverage to bot history/versioned bot context and per-symbol best-parameter comparison in separate bounded slices. | 2026-05-14 |
| RISK-028 | Architecture documentation | Agents may plan exchange work from stale Binance-only or one-exchange-family overview wording even though code and newer reference docs support Binance and Gate.io. | medium | high | Future exchange work starts from `01_overview-and-principles.md` or `03_domain-model.md` without reading newer exchange reference docs. | 2026-05-19 `AUD-01` audit confirmed the exact drift. `DEC-AUD-001` accepted Binance + Gate.io as current implementation scope, not Binance-only, and architecture overview/domain docs now keep production/live readiness evidence-bound by exact exchange, market type, and operation. | closed | REQ-ARCH-028 / DEC-AUD-001 | Reopen only if architecture source-of-truth again contradicts the accepted Binance + Gate.io implementation scope or overclaims production/live readiness. | 2026-05-19 |
| RISK-029 | Exchange capability contract | Operation support may be overstated when market-type support diverges if future exchange additions bypass the exact exchange-context capability contract. | medium | high | New spot/futures operation support differs by market type or exchange, but consumers infer support from exchange-level truth. | 2026-05-19 `AUD-09` follow-up closed the exact matrix gap: API exchange execution/authenticated-read contracts and consumers now use `(exchange, marketType, operation)`. Focused exchange tests PASS (`21` tests across contract/registry/boundary files) and API typecheck PASS. Follow-up `AUD-EXCH-007` also closed neutral type naming debt for non-exchange orders/wallet consumers. | closed | REQ-EXCH-029 | Reopen only if a future exchange capability path bypasses `(exchange, marketType, operation)` support truth or non-exchange modules start importing connector-specific CCXT-named types again. | 2026-05-19 |
| RISK-030 | Assistant/AI runtime | Operators or future agents may assume assistant governance is active in trading/runtime decisions when current code only proves config, dry-run, and deterministic orchestrator foundation. | medium | high | Assistant docs are used to reason about BACKTEST/PAPER/LIVE runtime behavior without checking actual hot-path call sites. | 2026-05-19 `AUD-20` evidence records the split truth: orchestrator tests PASS (`2` files, `6` tests), Web route tests PASS (`2` files, `3` tests), bot assistant config/dry-run e2e PASS after local infra (`1` file, `3` tests), but no audited hot-path runtime/backtest/live call site and no full AI red-team protocol proof. `DEC-AUD-002` narrowed current architecture truth to foundation/dry-run and deferred hot-path orchestration to later gated work. 2026-05-23 foundation protocol harness maps all `AI_TESTING_PROTOCOL.md` risk areas, classifies memory/multi-turn model scenarios as foundation-only not applicable, and executes deterministic safety scenarios for forbidden actions, mandates, trace sanitization, and edge confidence handling. 2026-06-07 `LUC-2773` closes the V1 scope ambiguity: hot-path assistant orchestration is accepted deferred V1 scope, not an active specialist implementation lane. | mitigating | REQ-AI-030 / DEC-AUD-002 / LUC-2773 | Keep V1 to assistant foundation/dry-run. Product+CTO must issue a fresh activation decision before AI Runtime + Security execute any gated hot-path implementation with persisted traces, fail-closed boundaries, multi-turn protocol, prompt-injection/data-leak tests, and red-team packet. | 2026-06-07 |
| RISK-031 | Engine decision flow | Runtime may open, close, DCA, or skip incorrectly if signal merge, pre-trade, final-candle decisions, execution dedupe, exchange guard, PAPER/LIVE parity, or position automation drift. | low | high | Engine tests fail, merge tie-break becomes nondeterministic, pre-trade admits unsafe side effects, dedupe duplicates side effects, exchange guard bypasses capability truth, or automation acts without canonical context. | 2026-05-19 `AUD-11` evidence: focused engine service/unit pack PASS (`15` files / `173` tests) and DB-backed engine e2e/smoke pack PASS (`4` files / `13` tests). 2026-05-23 `RUNTIME-DCA-EXCHANGE-PNL-THRESHOLD-2026-05-23` fixes an imported LIVE DCA threshold drift by using exchange `unrealizedPnl / marginUsed` as threshold PnL truth for `EXCHANGE_SYNC` positions; focused runtime tests `38/38`, DCA/position parity `27/27`, API typecheck, guardrails, docs parity, and diff check passed. Expected stderr appears in intentional failover/fail-closed tests. | closed | REQ-ENGINE-032 | Reopen only on a new failing engine/runtime signal; production readback and LIVE exchange-side mutation remain separately protected-auth/approval-gated. | 2026-05-23 |
| RISK-036 | Audit process | Future broad audits may omit layers, mix historical evidence with current proof, or become impossible to compare over time if each run invents a new checklist. | medium | high | User requests a full audit after weeks of work and the agent relies on scattered historical audit files. | `REUSABLE-AUDIT-REGISTRY-2026-05-18` creates stable `AUD-00` through `AUD-23`, a standard run order, required result fields, non-negotiable boundaries, and a dated baseline that separates today-run commands from historical evidence. `FULL-LAYERED-AUDIT-RUN-2026-05-18` extends that baseline with broad local validation, focused API packs, full API/Web tests, i18n audit, go-live smoke, and representative Browser route-state proof while preserving explicit production/LIVE exclusions. `AUTHENTICATED-ROUTE-STATE-AUDIT-2026-05-19` closes the local authenticated Web route-state gap with `53` PASS checks and screenshots. `API-ENDPOINT-DOCS-PARITY-AUDIT-2026-05-19` adds reusable endpoint-level API docs parity; 2026-05-19 gap closure now passes with `109` endpoints, `109` documented, and `0` gaps. 2026-05-19 `AUD-02` follow-up restored risk-ID uniqueness by renumbering this audit-process row from duplicate `RISK-031` to `RISK-036`. `audit:remediation-plan:check` now validates remediation plan structure, source/evidence references, required cleanup checks, and its own self-check closure command for future reruns. `audit:rerun-playbook:check` now validates baseline manifest/rollup path completeness and, with `audit:tooling-index:check`, fails if audit closure omits manifest verification, remediation-plan validation, docs parity, guardrails, or diff check; `audit:handoff:check` now validates the resume packet, tooling-index validation catches missing package scripts, missing self-check closure evidence, and required cleanup-check drift, rerun-playbook validation catches required cleanup-check drift and missing self-check closure evidence, manifest validation catches stale summary/path metadata, rollup validation catches stale rollup summaries, source links, repair queue entries, or safety booleans, and manifest comparison ranks leading status buckets so hybrid current/deferred wording is not misclassified as a regression, writes JSON comparison reports with `--json-output <path>`, and rerun playbook validation rejects stdout-only `compareJson` instructions, and tooling-index validation catches missing Markdown tool entries for JSON tool IDs, and manifest validation catches stale Markdown summary counts, and rollup validation catches missing Markdown audit IDs and stale Markdown summary counts, and handoff validation catches stale rollup summary counts and missing handoff self-check evidence. | mitigating | REQ-AUDIT-031 | Next audit improvement: add deeper keyboard/focus/a11y assertions if needed; keep DB-backed API packs sequential. | 2026-05-19 |
| RISK-032 | Data model / migrations | DB-backed tests or future migration audits may report false failures or hide real FK lifecycle defects if multiple e2e packs share one mutable local database without reset or isolation. | medium | high | Wallets, backtests, bots, or runtime DB-backed tests run together/parallel and cleanup orders conflict with FK constraints or cross-test data. | 2026-05-19 `AUD-07` proves schema validity and local migration replay (`54` migrations) and confirms wallet/backtest/runtime data-contract tests pass when run with isolated reset-and-run. The shared-DB parallel finding is mitigated by `corepack pnpm run audit:data:db-isolated`, which resets before each representative pack and passed wallets `24/24`, backtests `15/15`, and runtime repository `2/2`. | mitigating | REQ-DATA-007 | Use `audit:data:db-isolated` for representative DB audit packs or provide isolated schemas/databases; refresh production migration/backup/restore evidence under `AUD-19` before future deploys. | 2026-05-19 |
| RISK-033 | Mobile scope | Future planning may mistake the mobile scaffold or responsive Web mobile screenshots for an active native/mobile product surface. | medium | medium | A task assumes Expo/native screens, mobile CI, native auth/session shell, or independent mobile backend contracts exist because `apps/mobile` exists or Web mobile screenshots passed. | 2026-05-19 `AUD-21` confirms `apps/mobile` is scaffold-only, build/test scripts are intentional echoes, and mobile docs state no production mobile runtime. 2026-06-07 [LUC-2793](/LUC/issues/LUC-2793) classifies native/mobile traceability as `out_of_scope_for_v1` and keeps only a scaffold documentation seed; responsive Web mobile evidence remains under UX/Web audit scope, not native parity. | mitigating | REQ-MOBILE-021 / REQ-DOC-031 | Reopen only after Product/CTO-approved mobile activation. Then replace scaffold echoes with real Expo/native build/test validation and create feature-level mobile traceability rows. | 2026-06-07 |
| RISK-034 | I18n / copy | Route or copy changes may introduce missing locale keys, fallback Polish leakage, local copy outside namespaces, hardcoded UI literals, BOM markers, or mojibake encoding drift that is missed by normal component tests. | medium | medium | New route, state, or UI copy is added without running route-reachable i18n audit and copy/encoding guardrails. | 2026-05-19 `AUD-22` route-reachable i18n audit passed with findings `0`, localCopy `0`, fallbackPl `0`, hardcoded `0`; focused Web i18n pack passed (`8` files / `26` tests); language policy remains explicit. 2026-06-07 `LUC-2650` added focused local helper proof for `scripts/auditRouteReachableI18n.mjs` and reran the live route-reachable audit with `findings=0`, `localCopy=0`, `fallbackPl=0`, `hardcoded=0`. 2026-06-07 `LUC-2786` repaired Dashboard Home de-CH/pt BOM/mojibake drift and added loaded-translation encoding marker coverage; focused acceptance pack passed (`3` files / `17` tests) and target integrity search returned no matches. | closed | REQ-I18N-022 | Reopen only on a new i18n/copy/encoding finding; rerun route-reachable i18n audit or focused locale integrity checks after route/copy changes. | 2026-06-07 |
| RISK-035 | Requirements / delivery map | Future planning may use stale delivery-map rows or non-unique risk IDs after broad audits, causing duplicated work or false confidence in project state. | medium | high | Delivery map remains dated before the latest audit run, a risk ID appears more than once, or continuation state omits the latest rollup/audit artifact. | 2026-05-19 `AUD-02` found the exact source-of-truth drift, then the follow-up refreshed `.agents/state/delivery-map.md` to current audit truth, synchronized continuation state, and restored risk-ID uniqueness by renumbering the audit-process row to `RISK-036`. | closed | REQ-AUDIT-002 | Reopen only if a future broad audit finds stale delivery rows, duplicate IDs, or missing continuation-state sync. | 2026-05-19 |

## Risk Notes

- 2026-06-08 | DB-backed Gate.io ingestion proof dependency restored and
  verified | QA / DB-Ops | medium | [LUC-2979](/LUC/issues/LUC-2979) /
  [LUC-2980](/LUC/issues/LUC-2980) restored local PostgreSQL for
  [LUC-2977](/LUC/issues/LUC-2977). `127.0.0.1:5432` TCP and `pg_isready`
  passed, and the focused [LUC-1166](/LUC/issues/LUC-1166) verification command
  passed (`2` files / `42` tests). | mitigated | Keep the local
  `cryptosparrow` collation version mismatch warning as a maintenance note;
  no blocker remains for the DB-backed QA proof. UI display path was not
  separately browser-proved in this QA slice. |

- 2026-06-07 `LUC-2905` updated
  `RISK-ARCH-CONTROLLED-LIVE-PROOF-TRACEABILITY-2026-06-07`: the controlled
  LIVE proof helper family remained a traceability churn risk, but the next
  non-duplicate current anchor has been routed to [LUC-2906](/LUC/issues/LUC-2906)
  for local-only QA/Verification coverage or classification. Current report
  generated `2026-06-07T18:35:45.780Z` shows `252` actionable missing-test
  links, and `waitForRunningSession` was still open at that checkpoint.
  [LUC-2906](/LUC/issues/LUC-2906) now supersedes this note with verified
  local proof.

- 2026-06-07 `LUC-2906` updates
  `RISK-ARCH-CONTROLLED-LIVE-PROOF-TRACEABILITY-2026-06-07`: the
  `waitForRunningSession` anchor is now locally verified and scanner-linked.
  Refreshed architecture-awareness generated `2026-06-07T18:49:12.396Z` shows
  `251` actionable missing-test links and no controlled live proof helper
  anchor in Top Actionable Missing Test Links. Remaining risk is generic
  traceability churn in separate helper families, not this child lane.

- 2026-05-26 `COOLIFY-AUTO-DEPLOY-WORKER-RECOVERY-2026-05-26` updates
  Coolify deployment risk: the six existing Soar Applications had `Auto Deploy`
  disabled, which stopped the expected push-triggered deploy path even though
  the official Git App source was configured. By direct operator request,
  `Auto Deploy` was re-enabled on `soar-api`, `soar-web`, and all four worker
  Applications. `workers-market-stream` was recovered with successful deploy
  `gqpmafky0oe2jr3rszkov2is` on SHA `3fedb7a9...`, all resources read back as
  running, and public no-worker smoke passed. Residual risk remains: fanout
  deploy pressure across six Applications must be monitored, protected worker
  readiness still requires token-bearing proof, and the separate Service Stack
  cutover remains blocked until intentionally resumed.
- 2026-05-26 `COOLIFY-PUSH-DEPLOY-FANOUT-71B8D503-2026-05-26` adds a concrete
  operations risk note: full six-Application deploy fanout can exhaust the
  current VPS root filesystem through containerd/build-cache/image growth,
  causing Coolify Redis `MISCONF`, production readiness failures, Postgres
  recovery pressure, and failed deployment queue writes. Immediate recovery
  succeeded with no data-volume deletion, but future release operations should
  preflight disk, prune build cache between large deploy waves, and consider a
  larger disk or the single-stack/shared-image deployment path before treating
  full fanout as low-risk.
- 2026-05-25 `USER-ACTION-EVIDENCE-INDEX-2026-05-25` mitigates the recurring
  risk that agents repair UI surfaces from local file inspection only. The new
  generated `user-action-index.csv` and `architecture:journey:triage` command
  expose route/control to API/backend/data/test/proof boundaries before repair
  claims. Residual risk remains high for protected and money-facing paths until
  fresh authenticated browser/protected production proof exists; the index
  intentionally reports `37` high user-action proof gaps rather than relabeling
  local evidence as end-to-end proof.
- 2026-05-21 `SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21` adds `RISK-038`:
  a local ops/supply-chain audit found confirmed secret-bearing CLI argv
  handling in protected proof/release scripts and a repo-wide env-file policy
  gap. The local code defect is fixed with parser fail-closed behavior,
  existing env-var secret input families, root `.gitignore` env protection,
  and repository guardrails. Validation passed for guardrails/tests,
  production dependency audit, compose config, API/Web typecheck, script syntax,
  manual secret-argv rejection checks, and diff check. Remaining risk is
  external/protected: VPS/cloud egress review, protected `AUD-19`, and operator
  handling of local untracked env files.
- 2026-05-21 `BACKEND-PERMISSION-ISOLATION-REVIEW-2026-05-21` updates
  `RISK-005` and `RISK-018`: defensive review found and repaired a local
  API-key create DTO allowlist defect where validation parsed `req.body` but
  raw request fields still reached Prisma create data. The fix passes parsed
  payloads through the controller and uses explicit service create fields.
  Focused regression proves request-supplied `id`, `userId`, `lastUsed`,
  `createdAt`, and `updatedAt` are not persisted. Validation passed:
  API-key e2e `18/18`, auth/admin/API-key pack `34/34`,
  isolation/reports/wallets pack `28/28`, and API typecheck. Protected
  production `AUD-19`, external penetration/VPS configuration review, and
  explicit LIVE exchange-side mutation proof remain separate gates.
- 2026-05-21 `SECURITY-RED-TEAM-HARDENING-2026-05-21` updates
  `RISK-004`, `RISK-005`, `RISK-010`, `RISK-011`, `RISK-012`, `RISK-021`,
  `RISK-023`, and `RISK-036`: completed second-round security agents found
  confirmed local hardening defects and the coordinator repaired them. Fixes
  covered stale admin-token authorization after demotion, auth IP limiting,
  production ops private-network defaults, weak/placeholder secret readiness,
  unsafe deploy defaults, API-key lifecycle audit events, sensitive logging
  redaction, hidden runtime close `riskAck` defaults, execution-time LIVE
  entitlement checks, Gate.io swap derivative parameters, unknown LIVE status
  fail-closed mapping, min-notional price-truth fail-closed behavior,
  production CSP, production error redaction, and known Next.js/`ws`
  production dependency vulnerabilities. Residual risk remains explicit:
  protected `AUD-19`, external penetration/VPS configuration review, and LIVE
  exchange-side mutation proof were not replaced by local validation.
  Continuation reduced the residual local risk further by fixing frontend
  auth-confirm/admin/API-key P2 items, adding DB-backed LIVE entitlement
  downgrade proof, preventing stage rehearsal secret argv/artifact leakage,
  hardening VPS env template drift, adding non-root runtime Dockerfiles with a
  guardrail, adding production HSTS, and binding local compose DB/Redis to
  localhost.
- 2026-05-21 `LOCAL-CERTAINTY-CLOSURE-2026-05-21` updates `RISK-014`,
  `RISK-021`, `RISK-032`, `RISK-034`, and `RISK-036`: the Reports mutable
  bot-mode risk is locally mitigated for new trades by adding
  `Trade.executionMode`, migration backfill, snapshot-first Reports aggregation,
  and focused regression coverage for bot mode switching. Broad local gates now
  pass after the remaining Web polish fixes: full Web Vitest, full API Vitest
  in one-worker fork mode, build, lint, guardrails, docs parity, i18n audit,
  go-live smoke, Prisma validate/status, and diff check. Residual release risk
  is not code-local: protected production `AUD-19` still requires approved
  protected inputs and same-date production evidence before a production-ready
  claim.
- 2026-05-21 `REST-IMPLEMENTATION-SWEEP-2026-05-21` updates
  `RISK-010`, `RISK-011`, `RISK-012`, `RISK-014`, `RISK-021`, `RISK-030`,
  and `SOAR-SUBSCRIPTIONS-ADMIN-001`: agent-assisted local implementation
  sweep found no new P0 code defect, fixed explicit confirmation gaps for
  Dashboard Home LIVE manual order, LIVE open-order cancel, LIVE runtime
  position close, and Admin Users role/plan changes, removed default Web
  service-layer `riskAck: true` values, and changed LIVE runtime manual close
  to fail closed when no trusted close reference price is available instead of
  falling back to `entryPrice`. Focused Web/API tests and typechecks passed.
  Residual risks remain evidence-bound: protected `AUD-19` production proof is
  still blocked, Assistant hot-path trading orchestration remains deferred, and
  Reports historical mode classification still needs a data-model decision for
  immutable trade execution-mode snapshots.
- 2026-05-20 `V1-PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-20` updates
  `RISK-021`: current production build-info and public smoke pass for
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`, but the protected release path
  remains blocked because this shell has `0` matching protected input names and
  required protected evidence is stale for 2026-05-20. Keep V1 `NO-GO` for any
  new current-date readiness claim until the operator unblock packet produces
  fresh protected evidence and the final non-dry-run release gate returns
  `ready`. Current handoff:
  `history/releases/v1-operator-unblock-packet-dd1a1faf-2026-05-20.md`.
  `ops:operator-unblock:check` now validates that packet before protected
  execution.
- 2026-05-20 `V1-OPERATOR-UNBLOCK-TOOLING-INDEX-SYNC-2026-05-20` updates
  `RISK-021` and `RISK-036`: reusable audit tooling validation now requires
  the operator unblock packet check commands, and `audit:manifest:verify`
  executes the current packet validation. This reduces handoff drift but does
  not replace protected production evidence.
- 2026-05-20 `V1-AGENT-BLOCKER-SWEEP-DD1A1FAF-2026-05-20` updates
  `RISK-021`: two independent read-only agent lanes confirmed there is no
  meaningful non-secret deployment task left; continuing local prep would add
  churn, not reduce production release risk. Protected execution remains the
  only next risk-reducing step.
- 2026-05-19 `AUDIT-HANDOFF-CLEANUP-VALIDATION-COMMAND-2026-05-19`
  updates `RISK-021` and `RISK-036`: handoff validation now catches missing
  cleanup evidence for headless browser processes, local DB/Redis listeners,
  and Docker compose services before a broad-audit handoff can pass.
- 2026-05-19 `AUDIT-HANDOFF-TOOLING-INDEX-SOURCE-CHECK-2026-05-19`
  updates `RISK-021` and `RISK-036`: handoff validation now catches missing
  reusable tooling-index Markdown/JSON source paths before a broad-audit
  handoff can pass.
- 2026-05-19 `AUDIT-HANDOFF-SELF-SOURCE-CHECK-2026-05-19` updates `RISK-021`
  and `RISK-036`: handoff validation now catches missing handoff Markdown/JSON
  self-source paths before a broad-audit handoff can pass.
- 2026-05-19 `AUDIT-MANIFEST-SOURCE-CHAIN-KEY-CHECK-2026-05-19` updates
  `RISK-021` and `RISK-036`: manifest validation now catches missing required
  source-chain keys before a reusable audit manifest can pass.
- 2026-05-19 `AUDIT-MANIFEST-SOURCE-CHAIN-PATH-CHECK-2026-05-19` updates
  `RISK-021` and `RISK-036`: manifest validation now catches empty or
  non-repository required source-chain values before a reusable audit manifest
  can pass.
- 2026-05-19 `AUDIT-MANIFEST-SOURCE-CHAIN-EXACT-KEY-CHECK-2026-05-19`
  updates `RISK-021` and `RISK-036`: manifest validation now catches
  unexpected source-chain keys before a reusable audit manifest can pass.
- 2026-05-19 `AUDIT-MANIFEST-SAFETY-BOUNDARY-CHECK-2026-05-19` updates
  `RISK-021` and `RISK-036`: manifest validation now catches missing or unsafe
  safety-boundary booleans before a reusable audit manifest can pass.
- 2026-05-19 `AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-VALUE-CHECK-2026-05-19`
  updates `RISK-021` and `RISK-036`: rerun playbook validation now catches
  empty or non-repository required baseline values before a reusable audit
  rerun playbook can pass.
- 2026-05-24 `ARCH-GRAPH-FULL-DRIFT-CLOSURE-2026-05-24` updates graph drift
  risk: the representative architecture graph drift audit now reports
  `796/796` covered and `0` missing after adding engine runtime core, market
  data/stream adapter, residual Web/API evidence, infrastructure test, and
  governance documentation records. Residual risk remains that future changes
  can reintroduce drift unless graph CSV updates stay mandatory in the same
  task; this proof also does not replace fresh journey, protected production,
  external security, or live exchange-side mutation evidence.
- 2026-05-24 `ARCH-GRAPH-STRICT-GUARDRAIL-2026-05-24` further mitigates graph
  drift risk: `pnpm run quality:guardrails` now runs the strict graph drift
  audit and fails when representative paths are missing from graph CSV records.

Allowed statuses: `open`, `mitigating`, `accepted`, `closed`, `superseded`.

## Risk Notes

- 2026-06-05 `LUC-2291` rechecked
  `RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25` after
  [LUC-2279](/LUC/issues/LUC-2279) recovered redacted host evidence for the
  `2026-05-31T21:07:45.498997780Z` `soar-api` V8 heap OOM crash. Commit
  `287e77a1`, which capped aggregate session fanout and skipped failed
  per-session rows, is an ancestor of crash source
  `6839cd6b8884e26eca735ce32cea98c1dadccfbe`; therefore the May 31 crash
  happened after the first aggregate mitigation. Remaining accepted backend
  risk is nested runtime positions/trades materialization loading
  production-sized trade sets into Node memory before visible-row slicing under
  `/dashboard/bots/:id/runtime-monitoring/aggregate`. Follow-up:
  [LUC-2300](/LUC/issues/LUC-2300) must implement bounded materialization and
  focused regression proof before this risk can move toward `mitigating` or
  `closed`.
- 2026-06-05 `LUC-2304` mitigates
  `RISK-LOCAL-PROD-DOCKER-DRIFT-2026-05-24` for the Web production startup
  wrapper class: the Web runtime Dockerfile now copies the repo-root
  `scripts/runWebNextProductionCommand.mjs` wrapper required by
  `apps/web/package.json`, and `quality:guardrails` includes a focused
  package/Dockerfile contract check. Local proof passed guardrail tests, Web
  production build, and wrapper-start HTTP probes for `/` plus
  `/api/build-info`. Residual risk remains until source-control closure/push
  and a separate Ops-controlled production deploy smoke prove `soar-web`
  recovery.
- 2026-06-07 | Protected production security/exchange proof conflated with
  local helper tests | Security / Ops / Test Automation | medium | Local
  helper coverage for `scripts/runProdSecurityExchangeProof.mjs` could be
  misread as production security/exchange proof. [LUC-2955](/LUC/issues/LUC-2955)
  created [LUC-2956](/LUC/issues/LUC-2956) with explicit forbidden actions:
  no production proof, auth/session, real account token/cookie, exchange
  credential, secret, deploy, restart, rollback, database/account/exchange/
  order/position/live-trading mutation. | open | Execute only mocked/local
  helper tests and keep protected proof under approved Security/Ops gates. |

- 2026-06-07 | Protected production security/exchange proof conflated with
  local helper tests | Security / Ops / Test Automation | medium | [LUC-2956](/LUC/issues/LUC-2956)
  completed local-only helper proof for `scripts/runProdSecurityExchangeProof.mjs`
  and refreshed architecture-awareness from `181` to `159` actionable
  missing-test links, with no protected production proof, auth/session,
  credential, deploy, database, account, exchange, order, position, or
  live-trading mutation. | mitigating | Keep release readiness blocked on the
# 2026-06-28 LUC-5868 Stale SMOKE_AUTH_TOKEN Runner Binding

- Risk: a stale pre-bound `SMOKE_AUTH_TOKEN` keeps producing false-negative
  protected smoke evidence for `/workers/ready`.
- Severity: P1.
- Status: `blocked`.
- Evidence:
  current-binding smoke failed protected `/workers/ready` with `401`; fresh-
  login smoke passed protected `/workers/ready` with `200` after process-local
  token clear.
- Blocker:
  this Security/Privacy Auditor role cannot access Paperclip secret
  declarations/list (`403`) and cannot rotate/remove the central binding.
- Next action:
  [LUC-5869](/LUC/issues/LUC-5869), assigned to
  [10 CLO](/LUC/agents/10-clo-chief-legal-officer), removes or rotates the
  stale runner binding through approved encrypted secret management, then wakes
  [LUC-5868](/LUC/issues/LUC-5868) for current-binding smoke recheck.
- Evidence files:
  `history/evidence/luc-5868-stale-smoke-auth-token-runner-binding-2026-06-28.md`;
  `history/tasks/luc-5868-stale-smoke-auth-token-runner-binding-2026-06-28-task.md`.

  approved protected Security/Ops production proof gates; do not treat the
  local helper test as production security/exchange evidence. |

- 2026-06-08 | Protected production UI/UX proof conflated with local helper
  traceability | UX / QA / Security / Ops | medium | [LUC-2970](/LUC/issues/LUC-2970)
  added direct relation rows for [LUC-2957](/LUC/issues/LUC-2957) local
  production UI/UX helper tests without running production UI clickthrough,
  production UX/A11y proof, protected auth/session, account, secret, deploy,
  database, exchange, order, position, or live-trading mutation. | mitigating |
  Treat this as architecture traceability only. Browser launch/navigation/
  screenshot helpers and current-target authenticated production proof remain
  under protected browser/UX/Security/Ops gates. |
# 2026-06-11 LUC-3405 Public Browser Process Anchor Classification

- Risk: architecture-awareness can keep routing duplicate unit-test repair work
  for public browser proof anchors that are intentionally OS/CDP process
  boundaries.
- Severity: P2.
- Status: `mitigated_by_classification`.
- Mitigation: [LUC-3405](/LUC/issues/LUC-3405) classifies `createPage`,
  `killProcessTree`, and `launchBrowser` as browser/process orchestration
  boundaries; future work should use public browser proof artifacts or an
  approved integration harness instead of fake unit-test links.
- Evidence:
  `history/tasks/luc-3405-public-read-only-browser-proof-process-anchor-classification-2026-06-11-task.md`.

# 2026-06-11 LUC-3409 Owner Login Proof Session Validity

- Risk: an expired or invalid owner proof session could be mistaken for accepted
  production owner-login evidence.
- Severity: P1.
- Status: `open`.
- Mitigation: [LUC-3409](/LUC/issues/LUC-3409) approved only a redacted proof
  path that proceeds after `/auth/me` returns HTTP `200`; the current
  `PROD_UI_AUDIT_AUTH_TOKEN` reference returned HTTP `401` and is not valid
  proof.
- Next action: operator or board-capable credential owner must bind a fresh
  least-privilege proof session, run supervised proof, or provide an equivalent
  redacted artifact before [LUC-3375](/LUC/issues/LUC-3375) can unblock.
- Evidence:
  `history/tasks/luc-3409-owner-login-verification-path-2026-06-11-task.md`.

# 2026-06-14 LUC-4103 Owner Login Proof Session Validity

- Risk: an expired or invalid owner proof session could be reused for the
  current production build and mistaken for accepted owner-login evidence.
- Severity: P1.
- Status: `open`.
- Mitigation: [LUC-4103](/LUC/issues/LUC-4103) reuses the redacted
  [LUC-3409](/LUC/issues/LUC-3409) proof path and requires `/auth/me` HTTP
  `200` before browser proof. Current production build-info is
  `9f61eb9781c323f052f95cae7cf0c1c3c71901c7` on `main`; the available
  `PROD_UI_AUDIT_AUTH_TOKEN` reference returned HTTP `401` and is not valid
  proof.
- Next action: operator or board-capable credential owner must select one
  approved method and provide a fresh least-privilege proof session, supervised
  proof, or equivalent redacted artifact before owner-login acceptance can
  unblock.
- Evidence:
  `history/tasks/luc-4103-owner-login-verification-path-2026-06-14-task.md`.

# 2026-06-28 LUC-6028 Production Health Watch Residuals

- Risk: Soar production can appear healthy while recurring watch residuals hide
  future degradation signals.
- Severity: P1.
- Status: `mitigating_watch_active`.
- Evidence:
  [LUC-6028](/LUC/issues/LUC-6028) read-only watch passed public smoke,
  fresh-login protected worker readiness, runtime freshness, rollback guard,
  authenticated API timing, and Coolify GET projection.
- Residuals:
  stale `SMOKE_AUTH_TOKEN` still returns `401`; `/dashboard/markets/catalog`
  had one cold `1691.9 ms` sample then normalized to focused max `255.7 ms`;
  Coolify app rows report `running:unknown`; four queued deployment rows
  remain visible; host-level pressure/log-window evidence is unavailable
  without approved read-only host-status credentials.
- Next action:
  continue recurring DRE watch and route a narrow incident only if the
  market-catalog tail becomes persistent, queued deployments coincide with
  runtime symptoms, or host-level credential facts become available.
- Evidence files:
  `history/evidence/luc-6028-production-performance-server-health-watch-2026-06-28.md`;
  `history/tasks/luc-6028-production-performance-server-health-watch-2026-06-28-task.md`.

# 2026-06-28 LUC-6034 Authenticated Acceptance Residuals

- Risk: Soar production acceptance passes for the current deployed SHA, but
  recurring residuals still require separate owner paths before release-grade
  closure claims.
- Severity: P1.
- Status: `accepted_residuals_routed`.
- Evidence:
  [LUC-6034](/LUC/issues/LUC-6034) passed read-only authenticated production
  acceptance: public/protected deploy smoke through audit login mapping,
  auth-session browser proof, UI module clickthrough, runtime freshness,
  rollback guard, and representative timing.
- Residuals:
  stale `SMOKE_AUTH_TOKEN` still returns protected `401`; release-grade build
  provenance is not proven by this QVE sweep; host-level VPS pressure,
  proxy/container log-window evidence, and Coolify deployment-row readback were
  outside this lane.
- Next action:
  no [LUC-6034](/LUC/issues/LUC-6034) blocker remains. Security/Ops/release
  owner paths continue stale-token cleanup, build provenance, and host-level
  proof when approved inputs are available.
- Evidence files:
  `history/evidence/luc-6034-authenticated-production-acceptance-performance-sweep-2026-06-28.md`;
  `history/tasks/luc-6034-authenticated-production-acceptance-performance-sweep-2026-06-28-task.md`.

# 2026-06-29 LUC-6119 Production Auth Acceptance Repair Risk

- Risk: production acceptance can be falsely marked healthy if the logout
  failure is treated as a transient QVE issue instead of a backend auth/session
  repair gap.
- Severity: P0.
- Status: `delegated_repair_open`.
- Evidence:
  [LUC-6109](/LUC/issues/LUC-6109) reproduced the auth-session failure twice:
  `POST /auth/logout -> 502`, then `/auth/me -> 200` with the same token.
  [LUC-6119](/LUC/issues/LUC-6119) verified architecture-awareness is
  actionable-clean and routed this as the current failed-check repair lane.
- Mitigation:
  [LUC-6121](/LUC/issues/LUC-6121) owns backend logout/session invalidation
  repair. QVE must rerun the production auth proof after backend evidence lands
  before production acceptance is restored.
- Next action:
  complete [LUC-6121](/LUC/issues/LUC-6121), then rerun QVE production
  acceptance. Do not create duplicate TSA
  architecture, protected-input, or browser-review lanes from this blocker.
- Evidence files:
  `history/evidence/luc-6119-gap-register-and-repair-lane-refresh-2026-06-29.md`;
  `history/tasks/luc-6119-gap-register-and-repair-lane-refresh-2026-06-29-task.md`.

# 2026-06-29 LUC-6181 Gap Register Residual Risk

- Risk: after the auth acceptance blocker closes, Soar V1 can still be
  over-claimed if app-completion row proof, protected release/account inputs,
  build provenance, and host-level proof are treated as closed by association.
- Severity: P1.
- Status: `mitigated_by_owner_paths`.
- Evidence:
  [LUC-6180](/LUC/issues/LUC-6180) verifies production auth acceptance, and
  [LUC-6181](/LUC/issues/LUC-6181) verifies architecture drift remains clean.
  Current app-completion readback still has `452` browser-review, `1313`
  missing-test-link, `589` missing-doc-link, and `11` blocked rows.
- Mitigation:
  keep residuals on existing owner paths instead of creating duplicate TSA
  repair children: [LUC-6164](/LUC/issues/LUC-6164) for Backtests cleanup,
  [LUC-5996](/LUC/issues/LUC-5996) / [LUC-6002](/LUC/issues/LUC-6002) for
  protected inputs, [LUC-5844](/LUC/issues/LUC-5844) for build provenance, and
  existing proof/linkage lanes for app-completion row burn-down.
- Next action:
  route only fresh, unrouted failed checks; do not reopen the auth repair lane
  unless production acceptance regresses.
- Evidence files:
  `history/evidence/luc-6181-gap-register-and-repair-lane-refresh-2026-06-29.md`;
  `history/tasks/luc-6181-gap-register-and-repair-lane-refresh-2026-06-29-task.md`.
# 2026-06-29 LUC-6248 Risk Update

- 2026-06-29 `LUC-6248-AUTHENTICATED-PRODUCTION-ACCEPTANCE-PERFORMANCE-SWEEP-2026-06-29`
  reduces production acceptance risk: authenticated protected smoke,
  auth-session proof, UI clickthrough, runtime freshness, rollback guard, and
  timing sample passed for SHA `c357d957741f56835f27a1fc3a948dad43a91036`.
  Residual risk remains for host-level VPS/log-window proof, release-grade
  source/build provenance, market-catalog cold first sample (`1506.7 ms`), and
  default runner protected-auth binding drift where no-auth checks fail closed
  with `401`. Mitigation: keep existing Ops/release gates and bind protected
  runner auth families through approved secret paths; do not create a product
  repair child from [LUC-6248](/LUC/issues/LUC-6248).

# 2026-06-30 LUC-6245 Control-Plane Recovery Risk

- Risk: a Paperclip adapter/control-plane timeout can be misread as a fresh
  Soar V1 product or architecture blocker, causing duplicate repair lanes.
- Severity: P1.
- Status: `mitigated_by_local_evidence_and_blocked_disposition`.
- Evidence:
  CTO recovery heartbeat for [LUC-6245](/LUC/issues/LUC-6245) reran strict
  architecture drift successfully (`849/849`, `0` missing). The injected
  Paperclip `/api/health` returned `200`, but issue checkout, heartbeat-context,
  and PATCH-to-`blocked` timed out; health reported `restartRequired=true` for
  `backend_changes`.
- Mitigation:
  treat [LUC-6245](/LUC/issues/LUC-6245) as blocked by the existing
  [LUC-6234](/LUC/issues/LUC-6234) protected-input owner path. Do not create
  duplicate CTO/TSA, Backend/Auth, QVE production acceptance, DRE production
  health, protected-input, build-provenance, host-level, Account,
  Subscription, Exchange, Admin, or broad app-completion lanes from this
  control-plane timeout.
- Next action:
  board-capable Security/Ops secret owner binds missing protected families via
  approved encrypted runtime paths, then protected release/account proof reruns.
# 2026-07-01 LUC-6551 Production Acceptance Risk

- Risk: Soar V1 is over-claimed as production accepted while the Web frontend
  returns `503` and worker readiness is not acceptable for release.
- Severity: P0.
- Status: `blocked_by_existing_ops_restoration_path`.
- Evidence:
  [LUC-6551](/LUC/issues/LUC-6551) deploy smoke passed API `/health` and
  `/ready`, but Web `/` and `/api/build-info` returned `503`; rollback guard
  returned `shouldRollback=true` with `workers_ready_endpoint_http_503`; UI
  clickthrough failed all route groups with `503`.
- Mitigation:
  keep the blocker on [LUC-6331](/LUC/issues/LUC-6331) instead of creating a
  duplicate Backend/Auth or QVE child. Rerun QVE acceptance only after Ops
  restores/rolls back `soar-web` and `workers-backtest` and approved auth
  bindings are available.
- Evidence files:
  `history/evidence/luc-6551-authenticated-production-acceptance-performance-sweep-2026-07-01.md`;
  `history/tasks/luc-6551-authenticated-production-acceptance-performance-sweep-2026-07-01-task.md`.

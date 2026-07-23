# LUC-1796 Soar V1 Exact-Candidate Acceptance Rerun

Date: Thursday, July 23, 2026
Owner: `09 QVE (QA & Verification Engineer)`
Contract: `docs/planning/soar-v1-sale-readiness-contract.md`
Gap register row: `SRG-002`
Candidate SHA: `ca712e98b70e157b643db4f57726a02821a140bc`

## Scope

Execute the exact-candidate sale-readiness acceptance rerun for deployed
production candidate `ca712e98...` and leave a truthful QA disposition for
`SRG-002`.

This lane does not claim owner acceptance. `SRG-003` remains bound to
`LUC-4103`.

## Exact Candidate Binding

- local `HEAD`: `ca712e98b70e157b643db4f57726a02821a140bc`
- public Web `/api/build-info`: `gitSha=ca712e98...`
- public API `/health.release.gitSha`: `ca712e98...`
- production environment under test: `https://soar.luckysparrow.ch` and
  `https://api.soar.luckysparrow.ch`

## Executed Proof Bundle

### 1. Public smoke and worker identity

Command:

```text
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha ca712e98b70e157b643db4f57726a02821a140bc
```

Observed result:

- `GET /health -> 200` with `release.gitSha=ca712e98...`
- `GET /ready -> 200`
- `GET / -> 200`
- `GET /api/build-info -> 200` with `gitSha=ca712e98...`
- `GET /workers/ready -> 200` with `workers=4` and exact candidate SHA

Classification: `implemented and verified`

### 2. Build-info provenance readback

Direct readback:

- `gitSha=ca712e98b70e157b643db4f57726a02821a140bc`
- `gitRef=main`
- `metadataSource=env-runtime`
- `checkedAt=2026-07-23T14:01:39.888Z`

Classification: `implemented and verified`

Boundary:

- release parity for the current candidate is already accepted through
  `LUC-1791`
- `metadataSource=env-runtime` remains a provenance-quality residual, not a
  new `SRG-002` blocker in this lane

### 3. Protected readiness and worker freshness

Commands:

```text
pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch
```

Plus one direct redacted admin readback for `/ready/details`, `/workers/ready`,
and `/workers/runtime-freshness`.

Observed result:

- admin `GET /ready/details -> 200`, `status=ready`, `missingCount=0`,
  `issueCount=0`, `noOrderGuardActive=true`
- admin `GET /workers/ready -> 200`, `status=ready`, `topologyStatus=healthy`
- worker heartbeats observed for `backtest`, `execution`, `market-data`, and
  `market-stream`, all with `releaseSha=ca712e98...`
- `GET /workers/runtime-freshness -> 200`, `status=PASS`
- freshness checks:
  `workerHeartbeat=PASS`, `marketData=PASS`, `runtimeSignalLag=PASS`,
  `runtimeSessions=PASS`, `runtimeDecisionActivity=SKIP`

Classification: `implemented and verified`

Important boundary:

- the generic `ops:prod-security-exchange:proof` helper was run with the
  ordinary production smoke user and stopped when authenticated
  `/ready/details` returned `403`
- this is not a product regression by itself; it is a principal-boundary
  mismatch for that helper context
- the approved protected proof in this lane is the successful admin-smoke
  readback above

### 4. Auth and dashboard/operator baseline

Artifacts:

- `history/artifacts/luc-1796-prod-auth-session-browser-proof-ca712e98-2026-07-23.md`
- `history/artifacts/luc-1796-prod-ui-module-clickthrough-ca712e98-2026-07-23.md`

Observed result:

- production auth session browser proof: `PASS`
- production UI clickthrough audit: `PASS`
- authenticated dashboard routes and admin routes remained reachable under the
  expected principal classes

Classification: `implemented and verified`

### 5. One approved paper-safe write path

Artifact:

- `history/artifacts/luc-1796-prod-fixture-action-proof-ca712e98-2026-07-23.md`

Observed result:

- manual paper limit order open: `201`
- manual paper limit order readback: `200`
- manual paper limit cancel without ack: fail-closed `400`
- manual paper limit cancel with expected path: `200`
- canceled order readback: `200`
- cleanup completed for created disposable fixtures

Classification: `implemented and verified`

Residual from the broader helper:

- the same fixture sweep later stopped because a backtest report remained
  `PENDING` with `reportReady=false`
- that residual does not invalidate the required single approved paper-safe
  write baseline above, but it remains useful follow-up evidence for a broader
  fixture sweep

### 6. Security fail-closed baseline

Artifact:

- `history/artifacts/luc-1796-prod-security-exchange-proof-ca712e98-2026-07-23.md`

Observed read-only/fail-closed results:

- unauthenticated protected dashboard route: `401`
- unauthenticated `/ready/details`: `401`
- unauthenticated `/metrics`: `401`
- untrusted-origin state change: `403`
- unsupported `COINBASE` API-key probe: `501` fail-closed
- profile/api-key payloads remained redacted
- Binance and Gate.io market catalogs remained readable without exposing key
  material

Classification: `implemented and verified`

### 7. Supportability and rollback references

References re-used during this rerun:

- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/service-reliability-and-observability.md`

Classification: `present in docs, behavior known`

## SRG-002 Disposition

`SRG-002` is `RESOLVED_FOR_CURRENT_CANDIDATE`.

Why:

1. exact public smoke passed for deployed candidate `ca712e98...`
2. protected admin readback passed for `/ready/details`, `/workers/ready`, and
   `/workers/runtime-freshness`
3. auth browser proof and UI clickthrough passed on the deployed candidate
4. one approved paper-safe write path passed and cleaned up safely
5. supportability/rollback references remained current and usable

## What Remains Open

`SRG-003 Owner acceptance` remains the only sale-readiness blocker in this
lane family.

- It still belongs to `LUC-4103`
- no owner acceptance is claimed here
- non-owner protected proof and admin-smoke protected proof do not substitute
  for owner acceptance

## Residual Risk

- Web build-info still reports `metadataSource=env-runtime`, so release
  provenance remains diagnostic rather than stronger immutable attestation.
- The broader production fixture helper found a separate residual:
  backtest report lifecycle remained `PENDING` during that sweep. This did not
  block the required single paper-safe write baseline for `SRG-002`, but it is
  useful follow-up evidence if PM wants a broader fixture/readiness lane.

## Evidence Index

- `history/artifacts/luc-1796-prod-auth-session-browser-proof-ca712e98-2026-07-23.json`
- `history/artifacts/luc-1796-prod-auth-session-browser-proof-ca712e98-2026-07-23.md`
- `history/artifacts/luc-1796-prod-ui-module-clickthrough-ca712e98-2026-07-23.json`
- `history/artifacts/luc-1796-prod-ui-module-clickthrough-ca712e98-2026-07-23.md`
- `history/artifacts/luc-1796-prod-security-exchange-proof-ca712e98-2026-07-23.json`
- `history/artifacts/luc-1796-prod-security-exchange-proof-ca712e98-2026-07-23.md`
- `history/artifacts/luc-1796-prod-fixture-action-proof-ca712e98-2026-07-23.json`
- `history/artifacts/luc-1796-prod-fixture-action-proof-ca712e98-2026-07-23.md`
- `history/tasks/luc-1796-exact-candidate-sale-readiness-acceptance-rerun-2026-07-23-task.md`

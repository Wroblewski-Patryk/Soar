# LUC-2879 Web Server Action Deploy Mismatch Diagnosis

## Header
- ID: LUC-2879
- Title: Read-only diagnose Web Server Action deploy mismatch
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Frontend Web Engineer
- Depends on: LUC-2874
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001, SOAR-WEB-RUNTIME-001
- Requirement Rows: deployment provenance gate
- Quality Scenario Rows: deployment/release provenance
- Risk Rows: production Web stale or mixed build
- Iteration: 2026-06-07 FEW heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2879-WEB-SERVER-ACTION-DEPLOY-MISMATCH-2026-06-07
- Mission Status: VERIFIED

## Mission Block
- Mission objective: diagnose the Web Server Action mismatch reported by
  LUC-2874 without mutating production.
- Release objective advanced: production deploy confidence now has a specific
  Web stale-build diagnosis and an Ops-owned recovery recommendation.
- Included slices: issue context readback, source inspection, public no-secret
  endpoint reads, deploy wait reproduction, service-worker/cache source review,
  and source-of-truth update.
- Explicit exclusions: deploy, restart, rollback, env edit, protected smoke,
  account mutation, secret readback, raw log persistence, and live-trading
  action.
- Checkpoint cadence: one bounded heartbeat.
- Stop conditions: need for production mutation approval or unavailable
  read-only Coolify credentials.
- Handoff expectation: Ops Release Lead can request an approved Web redeploy
  and post-deploy smoke using this packet.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Frontend diagnosis | Frontend Web Engineer | LUC-2879, LUC-2874, Web build-info route, PWA cache source | `apps/web`, public Web readback | No-secret decision packet | Source inspection and public endpoint checks | DONE |
| Ops recovery | Ops Release Lead | `docs/operations/*` | Coolify `soar-web` production resource | Approved redeploy/restart/rollback decision if accepted | G3/G4/G5/G7 smoke plan | FOLLOW_UP |

## Context

LUC-2874 confirmed public API and Web availability but found production Web
`/api/build-info` reporting `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`,
`gitRef=main`, and `metadataSource=github-branch`. The same parent found
redacted `soar-web` logs containing repeated Next.js
`Failed to find Server Action` mismatch messages. Raw logs and secrets were not
persisted.

LUC-2506 had already changed source to fail closed on GitHub branch-head
provenance. Therefore, a production readback that still reports
`metadataSource=github-branch` is evidence that production Web is running an
older image or stale deployment, not the current source behavior.

## Goal

Identify the likely cause of the Web Server Action mismatch and give a
no-secret recommendation for whether mutation is needed.

## Scope

- `apps/web/Dockerfile`
- `apps/web/src/app/api/build-info/route.ts`
- `scripts/writeWebBuildMetadata.mjs`
- `scripts/waitForWebBuildInfo.mjs`
- `scripts/runWebNextProductionCommand.mjs`
- `apps/web/src/ui/pwa/ServiceWorkerRegistration.tsx`
- `apps/web/public/sw.js`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/deployment-readiness-gates.md`
- public `https://soar.luckysparrow.ch/`
- public `https://soar.luckysparrow.ch/api/build-info`
- public `https://soar.luckysparrow.ch/sw.js`

## Implementation Plan

1. Read Paperclip issue context and parent LUC-2874 evidence.
2. Inspect Web Dockerfile and build-info source metadata wiring.
3. Compare local source `HEAD` with public build-info readback.
4. Reproduce deploy provenance failure with `scripts/waitForWebBuildInfo.mjs`.
5. Inspect service worker and PWA cache behavior for likely client cache
   contribution.
6. Record a no-secret decision packet and recovery recommendation.

## Acceptance Criteria

- The likely mismatch class is identified.
- Findings include files/docs inspected and commands run.
- No secrets, raw private logs, resource ids, deploy, restart, rollback, or env
  mutation occur.
- The issue has a clear final disposition and next owner.

## Definition of Done

- [x] Current source metadata behavior classified.
- [x] Production Web public build-info compared to local source.
- [x] Deploy wait failure reproduced with no-secret public endpoint read.
- [x] PWA/service-worker cache behavior inspected for client-cache likelihood.
- [x] Recommendation recorded with residual risk.

## Forbidden

- Deploy, restart, rollback, env edit, protected smoke, account mutation,
  secret readback, raw private log persistence, live-trading action, or storing
  Coolify resource ids.

## Validation Evidence

- Tests:
  - Not run; no product code changed.
- Manual checks:
  - `Invoke-RestMethod https://soar.luckysparrow.ch/api/build-info` returned
    `gitSha=56d8d440bfe0fd9ee692e9f669e35414d85d2493`,
    `gitRef=main`, `metadataSource=github-branch`,
    `buildId=Xnn0H5fuVVTeahYMA8tvy`, and checked at
    `2026-06-07T16:39:41.789Z`.
  - `git rev-parse HEAD` returned
    `ed0f1aeb0e60392fe553f46d4931f9d9742f6aec`; recent local history contains
    commits after `56d8d440`.
  - `node scripts/waitForWebBuildInfo.mjs --build-info-url https://soar.luckysparrow.ch/api/build-info --expected-sha ed0f1aeb --timeout-seconds 1 --interval-seconds 1`
    failed as expected because public Web still exposed SHA `56d8d440...` and
    `metadataSource=github-branch`.
  - `curl.exe -I -L https://soar.luckysparrow.ch/` returned HTTP `200`,
    `Cache-Control: s-maxage=31536000`, `X-Nextjs-Cache: HIT`, and
    `X-Nextjs-Prerender: 1`.
  - `curl.exe -I -L https://soar.luckysparrow.ch/sw.js` returned HTTP `200`,
    `Cache-Control: public, max-age=0`, and `Last-Modified: Sat, 06 Jun 2026
    02:55:11 GMT`.
- Screenshots/logs:
  - No screenshots. No raw private logs persisted.
- High-risk checks:
  - No Coolify credentials were present in this heartbeat environment except
    Paperclip variables, so no Coolify API readback was attempted beyond parent
    issue evidence.
- Module confidence ledger updated: no product module changed.
- Requirements matrix updated: no; diagnosis only.
- Quality scenarios updated: no; diagnosis only.
- Risk register updated: no; risk disposition recorded here and in context.
- Reality status: verified for public readback; Coolify deployment-history
  details remain unavailable to this heartbeat.

## Architecture Evidence

- Architecture source reviewed:
  - `docs/operations/coolify-linux-vps-setup-guide.md`
  - `docs/operations/deployment-readiness-gates.md`
  - `apps/web/src/app/api/build-info/route.ts`
  - `scripts/writeWebBuildMetadata.mjs`
  - `scripts/waitForWebBuildInfo.mjs`
- Fits approved architecture: yes.
- Mismatch discovered: production Web runtime does not match current source
  provenance contract.
- Decision required from user: yes for any deploy/restart/rollback mutation.
- Follow-up architecture doc updates: none needed; current docs already state
  `github-branch*` is not release-grade provenance.

## Deployment / Ops Evidence

- Deploy impact: high if recovery is accepted, because the recommended action
  is a Web production redeploy or controlled restart/redeploy decision.
- Env or secret changes: none.
- Health-check impact: Web availability is currently healthy, but G4 deploy
  provenance fails closed.
- Smoke steps updated: no; existing G3/G4/G5/G7 gates apply.
- Rollback note: if an approved Web redeploy is performed, rollback should use
  the previous known healthy image only if Web availability or critical routes
  regress; build-info must be rechecked after either path.
- Observability or alerting impact: repeated Server Action mismatch in parent
  redacted logs should be monitored after recovery.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: public Web is healthy but stale/inconclusive for release provenance;
  parent logs show Next Server Action id mismatch.
- Gaps: deployment history endpoints were unavailable to parent runner; this
  heartbeat had no Coolify env/credentials for additional readback.
- Inconsistencies: production build-info still reports the historical
  `github-branch` source even though current source removed that acceptance
  path.
- Architecture constraints: release gates fail closed when metadata source is
  `github-branch*`.

### 2. Select One Priority Mission Objective
- Selected task: LUC-2879 read-only Web deploy mismatch diagnosis.
- Priority rationale: critical issue assigned by Paperclip wake payload.
- Why other candidates were deferred: scoped wake forbids switching issues.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/context only.
- Logic: classify whether source, production image, or client cache best
  explains the mismatch.
- Edge cases: client PWA cache, static prerender cache, mixed old/new Web
  containers, partial Coolify rollout.

### 4. Execute Implementation
- Implementation notes: no code change; read-only public endpoint checks and
  source inspection only.

### 5. Verify and Test
- Validation performed: public build-info readback, local git HEAD readback,
  deploy wait reproduction, HTTP header checks, source review.
- Result: stale production Web image or mixed/stale Web rollout is the likely
  cause.

### 6. Self-Review
- Simpler option considered: classify as browser cache only. Rejected because
  server-side `/api/build-info` itself reports old branch-head metadata.
- Technical debt introduced: no.
- Scalability assessment: existing deploy provenance gate correctly catches the
  condition.
- Refinements made: diagnosis separates client cache contribution from primary
  server-side stale image evidence.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet plus active context.
- Context updated: task board, project state, active mission, next steps, system
  health.
- Learning journal updated: not applicable.

## Review Checklist

- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

Likely cause: production `soar-web` is serving an older Web build/image, or a
mixed stale rollout where at least the active server-side build-info route is
from the old image. This is not primarily a browser client-cache issue because
the server endpoint `/api/build-info` itself returns old SHA/provenance.

Server Action mismatch classification: repeated Next.js `Failed to find Server
Action` messages are consistent with clients or requests carrying action ids
from a different Web build than the server currently handling the request. The
public build-info and old metadata source make stale or mixed Web deployment
the leading cause. PWA caching can amplify old-client requests, but the service
worker explicitly bypasses `/api/`, `/auth/`, `/dashboard/`, `/admin/`, and RSC
runtime requests and fetches `/_next/static/` with `cache: no-store` before
fallback, so it is not the strongest primary cause.

Recommendation: request explicit Ops approval for a controlled production
`soar-web` redeploy from the selected commit, with `SOURCE_COMMIT` and
`SOURCE_BRANCH` available to the Web build, followed by G3/G4/G5/G7 smoke:
API `/health`, API `/ready`, Web `/`, Web `/api/build-info`, worker readiness,
runtime freshness, and a redacted post-redeploy log scan for recurrence of the
Server Action mismatch. If redeploy is not approved, keep production release
confidence blocked because G4 provenance fails closed.

Residual risk: this heartbeat could not prove whether Coolify has multiple
concurrent old Web containers or a failed/partial rollout because no Coolify
credentials were injected and parent deployment-history endpoints were empty or
404. Ops should verify exact `soar-web` resource status and deployment history
before mutating production.

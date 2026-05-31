# Task

## Header
- ID: LUC-1146
- Title: [Soar][LUC-241][QA] Minimal smoke evidence classification for /workers/ready
- Task Type: qa
- Current Stage: verification
- Status: BLOCKED
- Owner: QA Regression Lead
- Priority: high

## Wake Acknowledgement
- Wake reason: `issue_assigned`
- Pending comments: `0/0`
- Latest comment id: `unknown`
- This wake provided no new human comment delta; next action stayed a minimal fresh smoke probe to classify current `/workers/ready` evidence state.

## Goal
Produce minimal, fresh, redaction-safe smoke evidence classification for protected `GET /workers/ready` on canonical Soar production hosts.

## Scope
- Read-only smoke verification only.
- No deploy/restart/runtime mutation.
- No credential value output.

## Command Run
- `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
- Timestamp: `2026-05-31T18:xx+02:00` (current heartbeat)

## Result Snapshot
- PASS `API /health -> 200`
- PASS `API /ready -> 200`
- PASS `WEB / -> 200`
- PASS `WEB /api/build-info -> 200`
- FAIL `API /workers/ready -> status 401`

## Minimal Evidence Classification
- Public runtime availability (`/health`, `/ready`, web root, `build-info`): `implemented and verified`.
- Protected worker-readiness endpoint availability (`GET /workers/ready`): `blocked by error` (`401 Unauthorized` under current smoke auth path).
- Endpoint contract/test coverage in repo (`apps/api/src/router/workers-health-readiness.test.ts`): `implemented and verified` (local automated contract coverage exists for auth + ready/not_ready states).
- Production protected proof for `/workers/ready` in this heartbeat: `missing` (cannot prove ready/not_ready payload because auth boundary returns `401`).

## Interpretation
The previous `503` runtime outage classification is no longer current for this checkpoint; canonical public endpoints recovered to `200`. The active blocker has narrowed to protected auth/authz for `/workers/ready` in smoke context.

## Blocker And Unblock Owner
1. Auth credential owner + Security/Test owner: provide/confirm a fresh valid approved read-only principal/session path accepted by API auth and authorized for `GET /workers/ready`.
2. Ops Release Lead (or delegated verifier with that approved auth path): execute exactly one read-only protected rerun and publish the redaction-safe `/workers/ready` outcome (`200 ready` or `503 not_ready` payload evidence).

## Disposition
- Final disposition for this heartbeat: `blocked`.
- Reason: protected `/workers/ready` proof is still auth-gated (`401`) despite canonical public runtime recovery.
## Heartbeat - 2026-05-31T20:xx:xxZ (finish_successful_run_handoff)
- Wake acknowledged from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`).
- Concrete action in this heartbeat:
  - kept previously created QA artifact as source-of-truth for minimal smoke classification,
  - left unrelated untracked `LUC-1145` files untouched,
  - finalized issue disposition from fresh evidence without additional reruns.

### Fresh Evidence Used (from current run)
- `corepack pnpm run -s ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
- Results:
  - `PASS` `API /health -> 200`
  - `PASS` `API /ready -> 200`
  - `PASS` `WEB / -> 200`
  - `PASS` `WEB /api/build-info -> 200`
  - `FAIL` `API /workers/ready -> status 401`

### Classification (Minimal Smoke)
- Public runtime path: `implemented and verified`.
- Protected `/workers/ready` smoke proof: `blocked by error` (`401`).
- Protected readiness payload proof (`ready` vs `not_ready` content): `missing` due to auth boundary.

### Final Disposition
- `blocked`
- Unblock owner/action:
  1. Auth credential owner + Security/Test permission owner provide/confirm approved read-only principal/session that is authorized for protected `GET /workers/ready`.
  2. Ops Release Lead (or delegated approved verifier) runs exactly one read-only protected recheck and publishes redaction-safe `/workers/ready` result.

## Heartbeat - 2026-05-31T22:xx:xx+02:00 (issue_commented metadata normalization)
- Wake acknowledged from inline payload:
  - reason: `issue_commented`
  - latest comment id: `772ac514-949d-4b94-a7cc-f96cb6d38e96`
  - comment meaning: delegated worker lane metadata normalization for project visibility (`project=Soar`, `parent=LUC-241`).
- Action taken in this heartbeat:
  - revalidated lane scope and QA-role constraints from Paperclip instructions,
  - confirmed the comment does not change technical evidence or remove the auth boundary for protected `/workers/ready`,
  - preserved existing minimal smoke classification and unblock contract as the current source-of-truth.

### Disposition After Comment Triage
- `blocked` (unchanged)
- blocker remains first-class and actionable:
  1. Auth credential owner + Security/Test owner provide/confirm approved read-only principal/session authorized for `GET /workers/ready`.
  2. Ops Release Lead (or approved delegate) runs one protected read-only recheck and publishes redaction-safe evidence.

## Heartbeat - 2026-05-31T23:xx:xx+02:00 (source_scoped_recovery_action follow-through)
- Wake acknowledged first from inline payload (`fallbackFetchNeeded=false`, comments `0/0`, latest comment id `unknown`); no new human delta changed the blocker class.
- Concrete action in this heartbeat:
  - executed one fresh minimal read-only HTTP status probe with `curl.exe` against canonical hosts,
  - captured public/protected status split for `/workers/ready` evidence classification refresh.

### Repro Command
- `powershell -Command "$urls = @('https://api.soar.luckysparrow.ch/health','https://api.soar.luckysparrow.ch/ready','https://api.soar.luckysparrow.ch/workers/ready','https://soar.luckysparrow.ch/','https://soar.luckysparrow.ch/api/build-info'); foreach ($u in $urls) { $code = (curl.exe -s -o NUL -w \"%{http_code}\" \"$u\"); Write-Output \"$u`t$code\" }"`

### Observed Result
- `https://api.soar.luckysparrow.ch/health -> 200`
- `https://api.soar.luckysparrow.ch/ready -> 200`
- `https://api.soar.luckysparrow.ch/workers/ready -> 401`
- `https://soar.luckysparrow.ch/ -> 200`
- `https://soar.luckysparrow.ch/api/build-info -> 200`

### Evidence Classification Refresh
- Public availability (`/health`, `/ready`, web root, `build-info`): `implemented and verified`.
- Protected `GET /workers/ready`: `blocked by error` (`401` under current unauthenticated smoke path).
- Protected readiness payload proof (`ready` vs `not_ready` body): `missing` (auth boundary not passed in this lane).

### Final Disposition
- `blocked` (unchanged).
- Unblock owner/action remains:
  1. Auth credential owner + Security/Test owner provide/confirm approved read-only principal/session authorized for `GET /workers/ready`.
  2. Ops Release Lead (or approved delegate) executes exactly one protected read-only recheck and publishes redaction-safe evidence.

# LUC-1739 Independent Verification of Release Identity Candidate `46557f4a`

Date: 2026-07-23
Owner: QA and Verification Engineer
Candidate: `46557f4a1cade4492b0e2ec164d4fcfab2628637`

## Scope

Verify locally that the release-identity candidate:

- exposes the exact image-baked source SHA on runtime health surfaces;
- rejects abbreviated or missing SHAs;
- propagates release identity into worker heartbeats;
- fails worker readiness when worker heartbeats come from another release; and
- keeps deploy smoke checks fail-closed on SHA mismatches.

This evidence does not claim deployed-candidate or production parity.

## Source-Control Identity

- `git rev-parse --short=8 HEAD -> 46557f4a`
- `git show --stat --summary 46557f4a --`
  confirms commit
  `46557f4a1cade4492b0e2ec164d4fcfab2628637`
  with subject:
  `ops: attest Soar runtime release identity`
- `git status --short -> <empty>`
  before the QA evidence packet was created.

Classification:

- exact candidate identity: `implemented and verified`
- clean starting workspace state: `implemented and verified`

## Code-Path Verification

### Runtime release identity helper

File: `apps/api/src/lib/releaseIdentity.ts`

- accepts only `SOURCE_COMMIT` values matching a full 40-character hex SHA;
- lowercases accepted SHAs;
- returns `{ gitSha: null, source: 'unavailable' }` for missing or abbreviated
  values.

Classification:

- fail-closed SHA parsing: `implemented and verified`

### API exposure

File: `apps/api/src/router/index.ts`

- `GET /health` returns `release: readReleaseIdentity()`;
- `GET /ready` and `GET /ready/details` also include the same release payload;
- `GET /workers/ready` rejects stale/mixed release identities when any worker
  heartbeat `releaseSha` differs from the API `release.gitSha`.

Classification:

- public API release exposure: `implemented and verified`
- worker/API release mismatch gate: `implemented and verified`

### Worker heartbeat propagation

File: `apps/api/src/workers/workerHeartbeat.ts`

- heartbeat writes now persist JSON containing `at` and `releaseSha`;
- readback preserves backward compatibility for legacy timestamp-only
  heartbeats while extracting valid full SHAs when present.

Classification:

- worker release propagation: `implemented and verified`
- legacy heartbeat compatibility: `implemented and verified`

### Image build contract

File: `apps/api/Dockerfile`

- runtime image now requires `ARG SOURCE_COMMIT`;
- runtime build exports `ENV SOURCE_COMMIT=$SOURCE_COMMIT`;
- a Node validation step aborts the image build when the value is absent or not
  a full SHA.

Classification:

- image-baked release identity requirement: `present in code, behavior known via build contract inspection`

## Automated Verification

### Focused API tests

Command:

```powershell
pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts src/router/workers-health-readiness.test.ts src/workers/workerHeartbeat.test.ts
```

Result:

- `PASS`
- `4` files passed
- `16` tests passed

What this proves:

- helper accepts a full SHA and rejects abbreviated values;
- `/health` returns the exact release payload;
- worker readiness rejects split-worker release mismatch states;
- heartbeat storage/readback preserves `releaseSha`.

Classification:

- focused API contract proof: `implemented and verified`

### Smoke-tool verification

First attempt:

```powershell
pnpm exec vitest run scripts/deploySmokeCheck.test.mjs
```

Result:

- `blocked by error`
- exact failure:
  `No test suite found in file C:/Personal/Projekty/Aplikacje/Soar/scripts/deploySmokeCheck.test.mjs`

Interpretation:

- the file is authored for the built-in Node test runner, not Vitest.

Correct command:

```powershell
node --test scripts/deploySmokeCheck.test.mjs
```

Result:

- `PASS`
- `4` tests passed

What this proves:

- deploy smoke retries transient timeout failures only;
- deploy smoke does not retry real HTTP status failures;
- deploy smoke accepts worker readiness only when every heartbeat matches the
  expected candidate SHA;
- deploy smoke rejects a fresh worker heartbeat from another release.

Classification:

- deploy smoke SHA gate: `implemented and verified`
- runner-selection pitfall: `blocked by error`, corrected in the same heartbeat

## Release-Safe Conclusion

Independent local QA verification for candidate
`46557f4a1cade4492b0e2ec164d4fcfab2628637` is `verified` for the release
identity contract.

Specifically verified:

- exact local candidate identity;
- fail-closed SHA parsing;
- API release payload exposure;
- worker heartbeat release propagation;
- worker/API mismatch rejection;
- deploy smoke SHA enforcement.

Not verified by this heartbeat:

- GitHub parity of the candidate;
- pushed image provenance;
- deployed runtime freshness on this exact candidate;
- protected production readback;
- production rollback/readiness/sign-off gates.

## Residual Risk

- The Dockerfile guard was verified by code inspection and contract tests, not
  by a full image build in this heartbeat.
- This candidate can support release-truth proof, but it does not inherit
  production acceptance automatically until the exact SHA is pushed, deployed,
  and re-smoked in the target environment.

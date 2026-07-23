# Task

## Header
- ID: LUC-1739
- Title: Independent verification of release identity candidate 46557f4a
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Priority: P0
- Iteration: 2026-07-23
- Operation Mode: BUILDER
- Mission ID: LUC-1739-RELEASE-IDENTITY-CANDIDATE-46557F4A-VERIFICATION-2026-07-23
- Mission Status: VERIFIED

## Context
`LUC-27` remains release-blocked until the exact local source candidate gains
independent review instead of inheriting older production proof. Commit
`46557f4a1cade4492b0e2ec164d4fcfab2628637` introduces the release-identity
attestation contract, so QVE must verify that the candidate fails closed for
invalid SHAs, exposes the exact image-baked SHA on health/readiness surfaces,
and rejects worker/API release mismatches.

## Goal
Produce independent local QA evidence that candidate `46557f4a` correctly
attests release identity across the API runtime, worker heartbeat contract, and
deploy smoke tooling.

## Scope
- Verify the workspace HEAD and source-control cleanliness for the exact local
  candidate.
- Inspect the release-identity implementation and runtime wiring added by
  commit `46557f4a`.
- Run focused tests for API release identity, worker heartbeat release
  propagation, worker readiness mismatch handling, and deploy smoke SHA checks.
- Refresh local QA evidence and source-of-truth state for this verification
  issue only.
- Do not push, deploy, mutate secrets, or claim production parity.

## Constraints
- Verification only; no runtime/product code edits.
- Use the smallest sufficient proof for the changed contract.
- Keep artifact wording release-safe: local verification does not equal
  deployed-candidate proof.
- Record failed verification attempts exactly when a wrong runner or command is
  used.

## Implementation Plan
1. Confirm the exact candidate SHA and starting worktree state.
2. Inspect the release-identity code, Docker build contract, router exposure,
   worker heartbeat propagation, and smoke assertions.
3. Run focused API Vitest coverage for the new contract.
4. Run the smoke-tool test suite with the correct `node:test` runner.
5. Record QA evidence, scope boundary, and residual risk in repo truth and
   Paperclip closeout.

## Acceptance Criteria
- Local `HEAD` equals `46557f4a1cade4492b0e2ec164d4fcfab2628637`.
- The release-identity helper accepts only a full 40-character SHA and lowers
  it to canonical form.
- Public API `/health` exposes `release.gitSha`; readiness fails closed when
  required worker heartbeats report another release SHA.
- Runtime Docker build contract rejects images without a valid full
  `SOURCE_COMMIT`.
- Deploy smoke checks verify the expected candidate SHA for API, Web build-info,
  and worker heartbeats.

## Definition of Done
- [x] Focused verification commands are recorded with pass/fail results.
- [x] The wrong-runner attempt is documented accurately and corrected.
- [x] Source-of-truth state reflects the independent verification outcome.
- [x] Paperclip can close `LUC-1739` with evidence-backed `done`.

## Validation Evidence
- Command:
  `git rev-parse --short=8 HEAD`
- Result:
  `PASS`; returned `46557f4a`.
- Command:
  `git status --short`
- Result:
  `PASS`; the workspace was clean before this QA evidence packet was written.
- Command:
  `pnpm --filter api exec vitest run src/lib/releaseIdentity.test.ts src/router/release-identity-health.test.ts src/router/workers-health-readiness.test.ts src/workers/workerHeartbeat.test.ts`
- Result:
  `PASS`; `4` files and `16` tests passed.
- Command:
  `pnpm exec vitest run scripts/deploySmokeCheck.test.mjs`
- Result:
  `blocked by error`; Vitest correctly reported `No test suite found` because
  `scripts/deploySmokeCheck.test.mjs` uses the Node built-in `node:test`
  runner rather than Vitest.
- Command:
  `node --test scripts/deploySmokeCheck.test.mjs`
- Result:
  `PASS`; `4` smoke-contract tests passed, including SHA mismatch rejection for
  stale worker heartbeats.
- Evidence:
  `history/tasks/luc-1739-release-identity-candidate-46557f4a-independent-verification-2026-07-23-task.md`;
  `history/evidence/luc-1739-release-identity-candidate-46557f4a-independent-verification-2026-07-23.md`.

## Result Report
- Outcome:
  candidate `46557f4a` is independently verified locally on Thursday, July 23,
  2026 for the release-identity contract.
- Verified behavior:
  `apps/api/src/lib/releaseIdentity.ts` accepts only full 40-character SHAs and
  emits canonical lowercase `release.gitSha`; the API router exposes that value
  on `/health`, `/ready`, and `/ready/details`; worker readiness now fails
  closed when fresh worker heartbeats report another release SHA; and
  `scripts/deploySmokeCheck.mjs` enforces the expected SHA for API, Web
  build-info, and worker heartbeats.
- Build-contract proof:
  `apps/api/Dockerfile` now requires `ARG SOURCE_COMMIT`, exports it into the
  runtime image, and aborts the image build if the value is not a full SHA.
- Files changed:
  `history/tasks/luc-1739-release-identity-candidate-46557f4a-independent-verification-2026-07-23-task.md`,
  `history/evidence/luc-1739-release-identity-candidate-46557f4a-independent-verification-2026-07-23.md`,
  `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Residual risk:
  this lane proves the local candidate contract only. It does not prove GitHub
  parity, pushed-image provenance, deployed candidate freshness, protected
  production readback, or rollout health on the exact candidate.

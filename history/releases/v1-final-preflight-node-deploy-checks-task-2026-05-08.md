# Task

## Header
- ID: V1-FINAL-PREFLIGHT-NODE-DEPLOY-CHECKS-2026-05-08
- Title: Make final V1 preflight deploy checks independent of pnpm PATH
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Ops/Release
- Depends on: DEPLOY-FRESHNESS-90CD07D6-2026-05-08
- Priority: P1
- Iteration: 2026-05-08
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final V1 preflight command is the read-only operator entrypoint for
checking deploy freshness, public smoke, protected prerequisites, and release
evidence blockers. On this Windows workstation the command falsely classified
build-info and public smoke as blocked because it spawned `pnpm`, which is not
available in PATH, even though the underlying Node scripts work.

## Goal
Make the final V1 preflight deploy freshness and public smoke checks call the
bundled Node scripts directly so the status reflects production truth instead
of local package-manager PATH drift.

## Success Signal
- User or operator problem: preflight should not report false deploy blockers
  when `pnpm` is unavailable but the bundled Node scripts can run.
- Expected product or reliability outcome: final V1 release status is more
  portable and accurate on this workstation.
- How success will be observed: focused tests prove direct Node script
  invocation, and a production preflight run reports build-info and public
  smoke PASS for deployed `90cd07d6`.
- Post-launch learning needed: no

## Deliverable For This Stage
Preflight script fix, focused tests, current no-secret preflight evidence for
deployed `90cd07d6`, and synchronized state docs.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- keep protected evidence blocked without auth

## Definition of Done
- [x] `runBuildInfoWait` invokes `waitForWebBuildInfo.mjs` through
  `process.execPath`.
- [x] `runPublicSmoke` invokes `deploySmokeCheck.mjs` through `process.execPath`.
- [x] Remediation hints for public deploy checks use node-based commands.
- [x] Focused preflight tests pass.
- [x] Production preflight for deployed `90cd07d6` reports build-info PASS and
  public smoke PASS, then blocks only on true protected/release evidence gaps.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- bypassing protected production auth requirements

## Scope
- `scripts/runV1FinalPreflight.mjs`
- `scripts/runV1FinalPreflight.test.mjs`
- `history/artifacts/_artifacts-v1-final-preflight-90cd07d6-2026-05-08.json`
- `history/releases/v1-final-preflight-90cd07d6-2026-05-08.md`
- state/planning docs

## Implementation Plan
1. Replace internal `pnpm run ops:deploy:*` spawning with direct Node script
   spawning for build-info and public smoke.
2. Add focused tests proving the command and argument shape.
3. Update remediation hints for those public deploy checks.
4. Run focused tests.
5. Run production preflight for deployed `90cd07d6`.
6. Record and sync evidence.

## Acceptance Criteria
- The preflight command no longer depends on global `pnpm` for public deploy
  checks.
- Production preflight can classify build-info and public smoke as PASS.
- Protected auth and release evidence blockers remain fail-closed.

## Validation Evidence
- Tests:
  - `node --test scripts/runV1FinalPreflight.test.mjs` PASS (`14/14`)
  - `node scripts/runV1FinalPreflight.mjs --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha 90cd07d602f0a31f315719b8a5cd5be3fd112313 --timeout-seconds 120 --interval-seconds 15 --json-output history/artifacts/_artifacts-v1-final-preflight-90cd07d6-2026-05-08.json --markdown-output history/releases/v1-final-preflight-90cd07d6-2026-05-08.md` exited `1` as expected for protected blockers, with build-info PASS and public smoke PASS.
  - `node scripts/repoGuardrails.mjs` PASS
  - `node scripts/checkDocsParity.mjs` PASS
  - `git diff --check` PASS with Windows LF/CRLF warnings only
- Manual checks: reviewed command output and generated no-secret reports.
- Screenshots/logs: command output captured in generated Markdown/JSON reports.
- High-risk checks: no protected or money-impacting production action was run.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `history/plans/v1-final-blocker-execution-pack-2026-05-07.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: low; tooling/reporting only until pushed/deployed.
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: preflight now calls existing Node smoke scripts directly.
- Rollback note: revert this commit to restore previous `pnpm` child process
  behavior.
- Observability or alerting impact: no runtime alert change.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: preflight falsely reported public deploy blockers when `pnpm` was not
  available in PATH.
- Gaps: the command already had bundled Node scripts available but did not call
  them directly.
- Inconsistencies: manual `node scripts/*` checks passed while preflight failed.
- Architecture constraints: preflight is read-only and must not create
  protected evidence.

### 2. Select One Priority Task
- Selected task: V1-FINAL-PREFLIGHT-NODE-DEPLOY-CHECKS-2026-05-08.
- Priority rationale: release status must be accurate before further V1 claims.
- Why other candidates were deferred: authenticated UI audit and protected
  readback remain blocked on access.

### 3. Plan Implementation
- Files or surfaces to modify: preflight script, tests, reports, state docs.
- Logic: spawn bundled scripts through `process.execPath`.
- Edge cases: preserve skipped paths and non-zero blocker exit behavior.

### 4. Execute Implementation
- Implementation notes: changed only public deploy child process invocation and
  related remediation hints.

### 5. Verify and Test
- Validation performed: focused Node tests and production preflight.
- Result: PASS for tooling fix; preflight correctly remains BLOCKED on protected
  evidence.

### 6. Self-Review
- Simpler option considered: running all future preflights manually with child
  scripts would preserve the bug in the canonical operator command.
- Technical debt introduced: no
- Scalability assessment: reuses existing script entrypoints directly.
- Refinements made: tests assert command shape and remediation hints.

### 7. Update Documentation and Knowledge
- Docs updated: task, operations reports, state/planning docs.
- Context updated: yes
- Learning journal updated: yes, with the Node-based public deploy checks
  guardrail.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
The command still exits non-zero when final V1 evidence is blocked. That is the
correct release-gate behavior and was preserved.

## Production-Grade Required Contract

### Goal
Make final V1 preflight public deploy checks portable and accurate without
depending on global `pnpm`.

### Scope
Preflight script, focused tests, no-secret reports, and state docs.

### Implementation Plan
Call existing Node scripts directly; test command construction; rerun
production preflight.

### Acceptance Criteria
Build-info and public smoke are no longer false-blocked by missing `pnpm`;
protected evidence remains blocked without auth.

### Definition of Done
`DEFINITION_OF_DONE.md` is satisfied by focused tests, production preflight
evidence, guardrails, docs parity, and diff check.

### Result Report
- Task summary: final V1 preflight public deploy checks now use direct Node
  script execution.
- Files changed: preflight script, tests, operations reports, state docs.
- How tested: focused tests and production preflight.
- What is incomplete: protected V1 evidence remains blocked on auth/approval.
- Next steps: provide production app/operator auth for `LIVEIMPORT-03` and
  rollback proof, or continue exact Gate.io adapter slices without enabling
  unsupported capabilities.
- Decisions made: none.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: release operator.
- Existing workaround or pain: manual Node commands worked while preflight
  failed on missing `pnpm`.
- Smallest useful slice: preflight child process invocation fix.
- Success metric or signal: preflight reports public deploy checks PASS.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## User Feedback Evidence
- `docs/governance/user-feedback-loop.md` reviewed: not applicable
- Feedback item IDs: user requested continued V1 completion.
- Feedback accepted: yes
- Feedback needs clarification: no
- Feedback conflicts: none
- Feedback deferred or rejected: none
- Active task changed by feedback: yes
- New task created from feedback: yes
- Design memory updated: not applicable
- Learning journal updated: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: production release preflight.
- SLI: preflight public checks reflect real public endpoint state.
- SLO: no false deploy blocker from local package-manager PATH drift.
- Error budget posture: healthy
- Health/readiness check: public API `/health` and `/ready` PASS in preflight.
- Logs, dashboard, or alert route: not applicable.
- Smoke command or manual smoke: preflight public smoke PASS.
- Rollback or disable path: revert commit.

- `INTEGRATION_CHECKLIST.md` reviewed: not applicable
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: protected blockers verified.
- Refresh/restart behavior verified: build-info wait PASS.
- Regression check performed: focused test pack.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: public deploy metadata and no-secret release status.
- Trust boundaries: public endpoints only; protected auth remains missing.
- Permission or ownership checks: not applicable.
- Abuse cases: do not treat public deploy PASS as protected readback evidence.
- Secret handling: reports list variable names only, not values.
- Security tests or scans: no-secret serialization tests remain covered.
- Fail-closed behavior: command exits blocked while protected evidence is
  missing.
- Residual risk: protected flows still need real auth/approval.

## Result Report

- Task summary: final V1 preflight now runs deploy freshness and public smoke
  via bundled Node scripts.
- Files changed: preflight script, tests, no-secret reports, state docs.
- How tested: focused tests and production preflight.
- What is incomplete: final V1 remains blocked on live-import auth/readback,
  rollback auth/proof, and RC Gate 4 approval.
- Next steps: unblock protected production evidence or continue exact Gate.io
  adapter slices.
- Decisions made: none.

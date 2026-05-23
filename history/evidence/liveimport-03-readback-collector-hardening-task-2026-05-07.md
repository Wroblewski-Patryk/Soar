# LIVEIMPORT-03-COLLECTOR-HARDENING-2026-05-07 - Readback Collector Fail-Closed Guard

## Header
- ID: LIVEIMPORT-03-COLLECTOR-HARDENING-2026-05-07
- Title: Harden live-import readback collector against empty runtime sessions
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Ops/Release
- Depends on: `LIVEIMPORT-03-COLLECTOR-2026-05-07`
- Priority: P0
- Iteration: 2026-05-07
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the continuation slice.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`LIVEIMPORT-03` still requires authenticated read-only production runtime
readback. The collector added in the previous slice correctly failed closed
without auth and when symbols were missing from returned position payloads, but
an empty RUNNING-session discovery path could produce an evidence artifact with
`NO_RUNNING_SESSION` entries and no missing symbols. That is not acceptable V1
evidence because no protected runtime position readback was actually collected.

## Goal
Make `ops:liveimport:readback` fail closed when no positions readback was
collected from any RUNNING runtime session, and summarize the no-session state
explicitly in the redacted output.

## Success Signal
- User or operator problem: avoid a false-positive V1 release artifact when
  production has LIVE bots but no RUNNING runtime session readback.
- Expected product or reliability outcome: the release gate accepts only real
  runtime positions evidence.
- How success will be observed: local no-running-session harness exits non-zero
  with the expected fail-closed message.
- Post-launch learning needed: no.

## Deliverable For This Stage
A small collector hardening patch plus updated planning/state evidence.

## Scope
- `scripts/collectLiveImportReadbackEvidence.mjs`
- `.agents/state/*`
- `.codex/context/*`
- `docs/planning/mvp-next-commits.md`
- `history/evidence/liveimport-03-readback-collector-hardening-task-2026-05-07.md`

## Implementation Plan
1. Add summary counts for bots with runtime readback and bots without RUNNING
   sessions.
2. Add a unique visible-symbol summary across collected runtime payloads.
3. Fail closed if no bot produced any runtime positions readback.
4. Fail closed if expected symbols are not visible in any collected runtime
   readback payload.
5. Validate help, dry-run, missing-auth, syntax, and a local no-session harness.

## Acceptance Criteria
- Help and dry-run paths still work without auth.
- Missing auth still fails closed before protected API access.
- A LIVE bot with no RUNNING session exits non-zero.
- The collector summary exposes no-session/readback counts without secrets.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` reviewed and applicable evidence captured.
- [x] No mock, placeholder, fake, or temporary production behavior introduced.
- [x] No API route, DB schema, exchange adapter, deployment, or live-money path
  changed.
- [x] Relevant docs and state files updated.

## Stage Exit Criteria
- [x] The output matches the declared `release` stage.
- [x] Work from later stages was not mixed in.
- [x] Remaining production-auth blocker is stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `node --check scripts\collectLiveImportReadbackEvidence.mjs` PASS.
  - `pnpm run ops:liveimport:readback -- --help` PASS.
  - `pnpm run ops:liveimport:readback -- --dry-run --expected-sha 1f816362c93e117e47cfe52a35e0fec93bd0b37d` PASS.
  - Local HTTP harness with a LIVE bot and no RUNNING session PASS: collector
    exited non-zero with `No runtime positions readback was collected from a
    RUNNING session.`
  - Missing-auth run failed closed as expected with `Missing read-only
    production auth token or login credentials.`
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run docs:parity:check` PASS.
  - `git diff --check` PASS with line-ending warnings only.
  - `pnpm run lint` PASS.
  - `pnpm run build` PASS.
- Manual checks:
  - Diff review confirmed no request method changed from GET in collector
    readback paths.
- Screenshots/logs: not applicable.
- High-risk checks:
  - No production writes.
  - No exchange calls.
  - No secret values logged.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `DEFINITION_OF_DONE.md`
  - `INTEGRATION_CHECKLIST.md`
  - `NO_TEMPORARY_SOLUTIONS.md`
  - `DEPLOYMENT_GATE.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: low; local ops collector behavior only after push.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the collector guard patch.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production readback remains blocked by missing auth.
- Gaps: collector could emit a no-session artifact without failing after auth.
- Inconsistencies: `LIVEIMPORT-03` requires actual runtime readback, not only
  bot discovery.
- Architecture constraints: read-only evidence only; no new production write
  path.

### 2. Select One Priority Task
- Selected task: harden collector empty-readback handling.
- Priority rationale: prevents false V1 evidence once auth is available.
- Why other candidates were deferred: actual production readback still requires
  credentials not present in this shell.

### 3. Plan Implementation
- Files or surfaces to modify: collector script and state docs.
- Logic: summarize readback/no-session counts and fail when no RUNNING session
  produced positions readback.
- Edge cases: no LIVE bots, no RUNNING sessions, missing expected symbols.

### 4. Execute Implementation
- Implementation notes: added `botsWithRuntimeReadback`,
  `botsWithoutRunningSession`, and `symbolsVisible` summary fields; final gate
  now checks actual visible expected symbols.

### 5. Verify and Test
- Validation performed: syntax, help, dry-run, missing-auth fail-closed, local
  no-running-session harness, guardrails, docs parity, diff check, lint, and
  build.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: document the no-session caveat only.
- Technical debt introduced: no.
- Scalability assessment: summary fields can support future evidence review
  without changing protected API contracts.
- Refinements made: final missing-symbol check now uses unique visible symbols
  across collected runtime payloads.

### 7. Update Documentation and Knowledge
- Docs updated: yes.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to continuation scope.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: release operator validating live-import evidence.
- Existing workaround or pain: manual inspection could mistake no-session output
  for a usable artifact.
- Smallest useful slice: one fail-closed collector guard.
- Success metric or signal: no-session harness fails closed.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: not applicable.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: V1 production readback evidence collection.
- SLI: readback collector exits non-zero when no runtime positions payload was
  collected.
- SLO: not applicable for local ops script.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: not applicable.
- Smoke command or manual smoke: local no-running-session harness.
- Rollback or disable path: revert script patch.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: not applicable for no-session harness; protected
  production path remains blocked by auth.
- Endpoint and client contract match: yes; collector still calls existing
  protected GET routes.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: yes, fail-closed no-session and missing-auth cases.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: local no-running-session harness.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: production runtime evidence, redacted.
- Trust boundaries: operator shell to protected production API.
- Permission or ownership checks: existing API auth/ownership routes reused.
- Abuse cases: false-positive release evidence; secret leakage.
- Secret handling: token/password values are not logged.
- Security tests or scans: missing-auth fail-closed path.
- Fail-closed behavior: yes.
- Residual risk: authenticated production evidence is still unavailable.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable.
- Memory consistency scenarios: not applicable.
- Multi-step context scenarios: not applicable.
- Adversarial or role-break scenarios: not applicable.
- Prompt injection checks: not applicable.
- Data leakage and unauthorized access checks: no secret output in tested paths.
- Result: not applicable.

## Result Report
- Task summary: hardened `ops:liveimport:readback` so empty RUNNING-session
  readback cannot satisfy `LIVEIMPORT-03` evidence.
- Files changed: collector script and planning/state docs.
- How tested: syntax, help, dry-run, missing-auth fail-closed, no-session
  fail-closed harness, guardrails, docs parity, diff check, lint, and build.
- What is incomplete: authenticated production ETH/DOGE readback remains
  blocked until read-only auth is available.
- Next steps: run the collector with production auth and expected SHA.
- Decisions made: fail closed when no runtime positions payload is collected.

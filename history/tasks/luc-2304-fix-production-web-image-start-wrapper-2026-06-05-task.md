# Task

## Header
- ID: LUC-2304
- Title: Fix production Web image startup wrapper missing from runtime image
- Task Type: fix
- Current Stage: verification
- Status: VERIFIED_LOCALLY
- Owner: Frontend Builder
- Depends on: LUC-2297 evidence
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / Web production runtime image
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: deployment reliability / restart behavior
- Risk Rows: RISK-LOCAL-PROD-DOCKER-DRIFT-2026-05-24
- Iteration: 2026-06-05 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2304
- Mission Status: VERIFIED

## Mission Block
- Mission objective: repair the code-side Web production image/start contract
  that caused `MODULE_NOT_FOUND` for `scripts/runWebNextProductionCommand.mjs`.
- Release objective advanced: production `soar-web` recovery readiness.
- Included slices: Dockerfile runtime copy, repository guardrail, focused tests,
  local production wrapper start proof, evidence packet.
- Explicit exclusions: deploy, restart, rollback, production env mutation,
  protected smoke, database/account/exchange/live-trading actions.
- Stop conditions: wrapper missing after patch, focused guardrail failure,
  production wrapper cannot serve local Web after build, or Docker/prod mutation
  approval required.
- Handoff expectation: Ops receives code-side proof and can request a separate
  release mutation permit after source-control closure/push.

## Context
LUC-2297 retrieved redacted production crash evidence after the `soar-web`
queue was cleared. The container starts the Web package through
`node ../../scripts/runWebNextProductionCommand.mjs start`, but the runtime
image did not include that repo-root wrapper.

## Goal
Make the Web production runtime image contain the required start wrapper and
add a regression guardrail so the same missing-wrapper image cannot pass local
repository checks unnoticed.

## Scope
- `apps/web/Dockerfile`
- `scripts/repoGuardrails.mjs`
- `scripts/repoGuardrails.test.mjs`
- `history/evidence/luc-2304-web-runtime-start-wrapper-fix-2026-06-05.md`
- `history/tasks/luc-2304-fix-production-web-image-start-wrapper-2026-06-05-task.md`
- additive source-truth entries in `.agents/state/*` and `.codex/context/*`

## Implementation Plan
1. Confirm the crash evidence and current Web Dockerfile/package start contract.
2. Copy the existing wrapper into the Web runtime image.
3. Add a repository guardrail that binds the Web package wrapper dependency to
   the runtime Dockerfile copy.
4. Run focused guardrail tests.
5. Build Web and start it through the production wrapper locally.
6. Record evidence and residual Ops handoff.

## Acceptance Criteria
- The Web runtime Dockerfile copies `/app/scripts/runWebNextProductionCommand.mjs`.
- A focused guardrail fails for a missing runtime wrapper copy.
- The production Web build succeeds locally.
- The production wrapper start serves `/` and `/api/build-info` locally.
- No production mutation occurs.

## Definition of Done
- [x] Code-side root cause repaired.
- [x] Regression guardrail added and tested.
- [x] Local production wrapper proof captured.
- [x] Evidence and state updates recorded.
- [x] Remaining deploy/push/recovery boundary is explicit.

## Validation Evidence
- Tests:
  - `node --test scripts\repoGuardrails.test.mjs` -> PASS (`11/11`).
- Manual checks:
  - `pnpm --filter web run build` -> PASS, exit `0`.
  - `node scripts/runWebNextProductionCommand.mjs start` with `PORT=32104`
    -> `/` `200`, `/api/build-info` `200`.
- Screenshots/logs:
  - `history/artifacts/luc-2304-web-wrapper-start-stdout-2026-06-05.log`
  - `history/artifacts/luc-2304-web-wrapper-start-stderr-2026-06-05.log`
- High-risk checks:
  - Docker image build attempted but blocked by unavailable Docker Desktop
    engine pipe.
  - Validation process tree stopped.
  - No `chrome-headless-shell` process was present after validation.
- Module confidence ledger updated: yes
- Requirements matrix updated: not applicable
- Quality scenarios updated: not applicable
- Risk register updated: yes
- Reality status: verified locally; production recovery pending separate Ops
  release mutation.

## Architecture Evidence
- Architecture source reviewed: issue context, LUC-2297 evidence,
  `docs/engineering/local-development.md`, `docs/operations/v1-ops-runbook.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no architecture mismatch; this was packaging drift.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: medium for next release, none in this heartbeat.
- Env or secret changes: none.
- Health-check impact: expected to allow Web `/` and `/api/build-info` to serve
  after a later controlled deploy.
- Smoke steps updated: evidence names required public `/` and `/api/build-info`
  proof after deploy.
- Rollback note: if the later deploy fails, Ops should use the existing Coolify
  rollback playbook and retain this code-side evidence as root-cause closure.
- Observability impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: production `soar-web` restart loop due missing wrapper module.
- Gap: runtime stage omitted `/app/scripts/runWebNextProductionCommand.mjs`.
- Architecture constraints: code-side only; no production mutation.

### 2. Select One Priority Mission Objective
- Selected task: LUC-2304.
- Priority rationale: critical production Web outage root-cause repair.

### 3. Plan Implementation
- Files: Web Dockerfile and repo guardrails.
- Edge cases: package stops using wrapper; guardrail then no-ops.

### 4. Execute Implementation
- Added wrapper copy to runtime image.
- Added focused static guardrail and tests.

### 5. Verify and Test
- Guardrail tests passed.
- Web build passed.
- Local production wrapper start served root and build-info.

### 6. Self-Review
- Simpler option considered: change package start to call `next start`
  directly. Rejected because the existing wrapper centralizes production port,
  host, and metadata behavior and already works when present.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence packet and state/context append.
- Learning journal updated: not applicable; this was a concrete packaging
  regression now covered by a guardrail.

## Result Report
- Task summary: fixed Web runtime image wrapper packaging and locked it with a
  guardrail.
- Files changed: `apps/web/Dockerfile`, `scripts/repoGuardrails.mjs`,
  `scripts/repoGuardrails.test.mjs`, task/evidence files, state/context append.
- How tested: focused guardrail tests, Web build, local production-wrapper HTTP
  proof.
- What is incomplete: Docker image build could not run locally because Docker
  Desktop is unavailable; production recovery requires separate source-control
  and Ops release mutation.
- Next steps: source-control closure/push, then Ops release permit and public
  production Web smoke.
- Decisions made: keep the existing production wrapper and include it in the
  runtime image.

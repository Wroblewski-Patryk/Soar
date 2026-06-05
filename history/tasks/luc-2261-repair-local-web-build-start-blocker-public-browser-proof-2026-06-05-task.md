# Task

## Header
- ID: LUC-2261
- Title: Repair local Web build/start blocker for public browser proof
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: LUC-2255 local proof blocker
- Priority: P1
- Module Confidence Rows: Web public/auth route confidence
- Requirement Rows: Public/read-only Web route proof
- Quality Scenario Rows: Local production Web build/start proof
- Risk Rows: Local proof blocked by inherited development `NODE_ENV`
- Iteration: 2026-06-05
- Operation Mode: BUILDER
- Mission ID: LUC-2261-REPAIR-LOCAL-WEB-BUILD-START-BLOCKER-PUBLIC-BROWSER-PROOF-2026-06-05
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the issue lane: Frontend Builder.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence by unblocking local rendered Web proof.

## Mission Block
- Mission objective: repair the local Web build/start blocker that prevented final public/read-only browser proof.
- Release objective advanced: local rendered proof for public home, login, register, terms, privacy, offline, and password visibility toggles.
- Included slices:
  - make Web build/start robust when the parent shell has `NODE_ENV=development`;
  - repair local public proof runner handling for Web-only auth/session noise and password-toggle state readback;
  - prove build, typecheck, local production HTTP routes, and fresh browser proof.
- Explicit exclusions:
  - no backend behavior changes;
  - no protected auth/session journey proof;
  - no production deploy or production mutation;
  - no account, secret, exchange, database, or LIVE action.
- Stop conditions: Web build still fails, local production server cannot bind, or browser proof cannot run without a first-class blocker.
- Handoff expectation: mark LUC-2261 done with evidence if local build/start and public proof pass.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Frontend build/start | Frontend Engineer | LUC-2261 wake, LUC-2255 blocker | `apps/web/package.json`, `scripts/runWebNextProductionCommand.mjs` | Production-env Web build/start wrapper | `pnpm --filter web run build`, local start on `3101` | DONE |
| Browser proof | Frontend Engineer | `scripts/runPublicReadOnlyBrowserProof.mjs` | proof runner and evidence artifacts | Local public/read-only proof | fresh headless browser proof PASS | DONE |
| Documentation/Memory | Frontend Engineer | AGENTS state update rules | task/evidence/state files | Durable closure packet | source-of-truth rows updated | DONE |

## Context
LUC-2255 added public `/terms` and `/privacy` routes and a reusable browser proof runner, but final local rendered proof was blocked because `pnpm --filter web run build` failed during Next `/404` prerender with `<Html> should not be imported outside of pages/_document`. The active shell inherited `NODE_ENV=development`, which Next warns is non-standard for `next build`.

## Goal
Make local Web build/start usable for public browser proof and capture fresh local browser evidence for the public/read-only route set.

## Success Signal
- User or operator problem: local Web could not build/start for public browser proof.
- Expected product or reliability outcome: local production Web server starts from a successful build and public/read-only browser proof passes.
- How success will be observed: build exits `0`, local HTTP route checks pass, browser proof artifact reports `PASS`, validation processes are cleaned up.
- Post-launch learning needed: no.

## Deliverable For This Stage
Verified local build/start repair plus evidence artifacts.

## Constraints
- Reuse existing Next/Web scripts and proof runner.
- Do not change backend/API semantics.
- Do not deploy or mutate production.
- Do not introduce temporary bypasses.

## Definition of Done
- [x] `pnpm --filter web run build` no longer fails on Next `/404` prerender.
- [x] `pnpm --filter web run start -- -p 3101` serves public routes from the built app.
- [x] Fresh browser public/read-only proof passes locally.
- [x] Validation server/browser processes started in this task are stopped.
- [x] Source-of-truth task/evidence/state files are updated.

## Forbidden
- Backend behavior changes.
- Secret, account, database, exchange, or LIVE actions.
- Production deploy/restart/rollback.
- Hidden bypasses or fake route responses.

## Validation Evidence
- Tests:
  - `node --check scripts/runWebNextProductionCommand.mjs` -> PASS.
  - `node --check scripts/runPublicReadOnlyBrowserProof.mjs` -> PASS.
  - `pnpm --filter web run typecheck` -> PASS.
- Build:
  - `pnpm --filter web run build` -> PASS; Next route list includes `/terms`, `/privacy`, and `/_not-found`. The previous `/404` prerender `<Html>` failure did not recur.
  - Next emitted an existing non-fatal ESLint plugin warning for missing `eslint-plugin-react-hooks`; build exit code was `0`.
- Manual checks:
  - Local production server `http://127.0.0.1:3101` returned: `/` `200`, `/auth/login` `200`, `/auth/register` `200`, `/terms` `200`, `/privacy` `200`, `/offline` `200`, `/missing-luc-2261-route` `404`.
- Browser proof:
  - `node scripts/runPublicReadOnlyBrowserProof.mjs --issue LUC-2261 --web-base-url http://127.0.0.1:3101 --output-json history/artifacts/luc-2261-local-public-read-only-browser-proof-2026-06-05.json --output-md history/evidence/luc-2261-local-public-read-only-browser-proof-2026-06-05.md --cdp-port 9361` -> PASS.
- Cleanup evidence:
  - stopped local Web server process tree for port `3101`;
  - `Port3101Listeners: 0`;
  - `ProofBrowsers: 0`.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: Web public/auth route confidence.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: AGENTS.md, active mission state, project context, Frontend Engineer role instructions.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
- Design source type: not applicable.
- Existing shared pattern reused: existing public routes and proof runner.
- New shared pattern introduced: no UI pattern.
- Required states: public route success and not-found route behavior.
- Responsive checks: desktop and mobile in browser proof.
- Accessibility checks: password visibility accessible label changed in browser proof.
- Parity evidence: local browser proof rows all PASS.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert `apps/web/package.json`, `scripts/runWebNextProductionCommand.mjs`, and proof-runner local filtering changes if needed.
- Observability or alerting impact: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Web build failed under inherited `NODE_ENV=development`; local start could not serve public proof target.
- Gaps: proof runner counted local Web-only `/auth/me` API connection refusal as a browser route issue and read password toggle state too early.
- Architecture constraints: frontend-only lane; no backend or deploy changes.

### 2. Select One Priority Mission Objective
- Selected task: LUC-2261 local Web build/start blocker.
- Priority rationale: unblocks LUC-2255 local rendered browser proof.
- Why other candidates were deferred: production deployment/protected auth proof are separate lanes.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/web/package.json`;
  - `scripts/runWebNextProductionCommand.mjs`;
  - `scripts/runPublicReadOnlyBrowserProof.mjs`;
  - LUC-2261 task/evidence/state files.
- Logic:
  - force production `NODE_ENV` for Web build/start wrapper;
  - invoke local Next CLI directly;
  - strip package-manager `--` separator before forwarding args;
  - ignore local Web-only `/auth/me` API refusal in public proof;
  - wait briefly after password toggle click before reading input state.
- Edge cases: Windows process spawn behavior, forwarded start port args, validation cleanup.

### 4. Execute Implementation
- Implementation notes:
  - replaced direct Web `next build/start` scripts with a small Node wrapper.
  - kept build metadata generation before `next build`.
  - preserved production safety boundaries.

### 5. Verify and Test
- Validation performed: see Validation Evidence.
- Result: build/start/browser proof verified.

### 6. Self-Review
- Simpler option considered: running build with a one-off environment override. Rejected because the repository script should be robust in Paperclip heartbeats where `NODE_ENV` may be inherited.
- Technical debt introduced: no.
- Scalability assessment: wrapper is small, cross-platform, and limited to Web build/start.
- Refinements made: direct Next CLI invocation replaced a hanging nested `pnpm exec` handoff.

### 7. Update Documentation and Knowledge
- Docs updated: this task artifact, local proof evidence, state/context rows.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the issue lane.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Required responsibility lanes were integrated.

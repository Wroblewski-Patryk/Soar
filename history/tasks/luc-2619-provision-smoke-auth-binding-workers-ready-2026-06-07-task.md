# LUC-2619 Provision Smoke Auth Binding For Workers Ready

## Header
- ID: LUC-2619
- Title: Provision accepted SMOKE auth binding for workers/ready
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Security
- Depends on: LUC-2618 / LUC-2505
- Priority: P1
- Module Confidence Rows: SOAR-WORKERS-001, SOAR-SECURITY-PRIVACY-001, SOAR-OPERATIONS-001
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: production readiness / protected ops auth
- Risk Rows: protected release evidence, secret handling
- Iteration: 2026-06-07
- Operation Mode: TESTER
- Mission ID: LUC-2619-PROVISION-SMOKE-AUTH-BINDING-WORKERS-READY-2026-06-07
- Mission Status: BLOCKED

## Process Self-Audit
- [x] Analyze current state.
- [x] Select exactly one priority task.
- [x] Plan the smallest security-scope verification.
- [x] Execute read-only acceptance proof.
- [x] Verify and record result.
- [x] Self-review security and mutation boundaries.
- [x] Update documentation and knowledge.

## Mission Block
- Mission objective: prove or provision one accepted production-smoke auth binding for protected `GET /workers/ready`.
- Release objective advanced: V1 protected worker readiness unblock path.
- Included slices: no-secret binding shape check, current supported binding acceptance probe, fail-closed disposition.
- Explicit exclusions: no deploy, restart, rollback, env edit, account creation, account mutation, database mutation, exchange mutation, or live-trading action.
- Checkpoint cadence: one heartbeat.
- Stop conditions: supported binding still rejected, or no approved credential/secret-store mutation path is available.
- Handoff expectation: named unblock owner/action for credential/account provisioning.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Security | 10 SPA | `roles/security-privacy-auditor.md`, LUC-2619 | Auth boundary, secret-handling evidence | No-secret blocked/proof packet | Read-only deploy smoke | BLOCKED |
| Ops | Ops Release Lead | LUC-2618, deployment contracts | Production smoke rerun after binding exists | Follow-up wake path | Worker-included smoke | BLOCKED_BY_SECURITY_INPUT |
| Credential/account owner | Board/operator or designated secret-store owner | Credentials contract | Accepted `ADMIN` smoke principal/session | Rotate/provision supported binding | `/workers/ready` accepted | NEEDED |

## Context
[LUC-2619](/LUC/issues/LUC-2619) is the Security follow-up for [LUC-2618](/LUC/issues/LUC-2618). Ops proved the supported `SMOKE_*` variable names were present in the heartbeat environment, but the current binding was not accepted by Soar API auth for protected `GET /workers/ready`.

The wake payload had no pending comments and `fallbackFetchNeeded=false`; checkout was already claimed by the harness and was not repeated.

## Goal
Rotate or provision one production-smoke appropriate `ADMIN` principal/session accepted by Soar API auth and bind it through exactly one supported secret-store path:

- `SMOKE_AUTH_TOKEN`, or
- valid `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`.

## Success Signal
- User or operator problem: protected worker readiness cannot be smoke-tested because the current auth binding fails before authorization.
- Expected product or reliability outcome: Ops can rerun worker-included production smoke without exposing secrets.
- How success will be observed: `GET /workers/ready` returns an authenticated protected response using a supported `SMOKE_*` binding.
- Post-launch learning needed: no.

## Deliverable For This Stage
No-secret evidence proving whether this agent's current binding is accepted, plus a first-class blocker if provisioning cannot be performed safely from this role/run.

## Constraints
- Do not print or store secret values, cookies, tokens, passwords, private account data, API keys, or headers.
- Do not mutate production accounts, env, Coolify resources, database state, exchange state, or live-trading settings without exact approval.
- Use existing smoke runner and supported binding names.
- Keep Security scope limited to auth boundary and secret-handling evidence.

## Definition of Done
- [x] Current supported binding shape is checked without secret disclosure.
- [x] Read-only acceptance probe is run against production `GET /workers/ready`.
- [x] If accepted binding cannot be provisioned safely, issue is marked blocked with unblock owner/action.

## Stage Exit Criteria
- [x] The output matches the declared `verification` stage.
- [x] No deploy/account/env mutation was mixed in.
- [x] Risks and assumptions are stated clearly.

## Forbidden
- new auth bypasses or alternate endpoint paths
- temporary tokens committed to repo or issue comments
- exposing secret values in output
- production account mutation without exact approval
- treating public smoke success as protected workers-ready success

## Validation Evidence
- Binding names/shape check:
  - `SMOKE_AUTH_TOKEN`: present; not JWT-shaped; length recorded only.
  - `SMOKE_AUTH_EMAIL`: present; did not match email shape.
  - `SMOKE_AUTH_PASSWORD`: present; length recorded only.
  - `SMOKE_OPS_BASIC_USER`, `SMOKE_OPS_BASIC_PASSWORD`, `SMOKE_OPS_AUTH_HEADER_NAME`, and `SMOKE_OPS_AUTH_HEADER_VALUE`: absent.
- Command:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch`
- Result:
  - `PASS API /health -> 200`
  - `PASS API /ready -> 200`
  - `PASS WEB / -> 200`
  - `PASS WEB /api/build-info -> 200`
  - `FAIL API /workers/ready -> status 401`
- Manual checks:
  - `scripts/resolveOpsAuthToken.mjs` confirms token path is used when `SMOKE_AUTH_TOKEN` is populated; email/password login is not attempted while token is present.
  - `scripts/buildOpsRequestHeaders.mjs` confirms no extra ops auth layer is present in this run.
  - `apps/api/src/router/index.ts` confirms `/workers/ready` remains protected by `requireAuth`, `requireRole('ADMIN')`, and `requireOpsNetwork`.
- High-risk checks:
  - No secret values were printed or persisted.
  - No deploy, restart, rollback, env edit, account mutation, database mutation, exchange mutation, or live-trading action occurred.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Quality scenarios updated: not applicable.
- Risk register updated: yes.
- Reality status: blocked.

## Architecture Evidence
- Architecture source reviewed: `apps/api/src/router/index.ts`, `scripts/deploySmokeCheck.mjs`, `scripts/resolveOpsAuthToken.mjs`, `docs/operations/post-deploy-smoke-checklist.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none performed.
- Health-check impact: public API/Web healthy; protected workers-ready remains blocked by auth.
- Smoke steps updated: no.
- Rollback note: no runtime mutation occurred; rollback not applicable.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Security / Privacy Evidence
- Secret handling: only variable names, boolean presence, shape, and lengths were recorded. Secret values, cookies, tokens, passwords, private account data, API keys, and headers were not printed or stored.
- Permission boundary: observed `401` means the current binding fails authentication before role/network authorization can be proven.
- Account boundary: this role/run has no approved production account creation/rotation or secret-store write path, so provisioning cannot be completed safely here.
- Fail-closed behavior: verified. Public checks pass while protected worker readiness rejects the invalid binding.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current supported smoke auth material is present but not accepted by Soar API auth.
- Gaps: no approved admin-capable smoke principal/session is available in this runner.
- Inconsistencies: `SMOKE_AUTH_EMAIL` is populated but not email-shaped.
- Architecture constraints: `/workers/ready` requires auth, `ADMIN`, and ops network.

### 2. Select One Priority Mission Objective
- Selected task: `LUC-2619`.
- Priority rationale: it blocks [LUC-2618](/LUC/issues/LUC-2618), [LUC-2505](/LUC/issues/LUC-2505), and the worker-included smoke rerun.
- Why other candidates were deferred: scoped wake contract required this issue.

### 3. Plan Implementation
- Files or surfaces to modify: evidence/state only.
- Logic: no code change; prove acceptance or produce blocker.
- Edge cases: token path suppresses email/password login when `SMOKE_AUTH_TOKEN` is present.

### 4. Execute Implementation
- Implementation notes: ran no-secret shape checks and the existing read-only smoke command.

### 5. Verify and Test
- Validation performed: production deploy smoke with workers included.
- Result: blocked; `/workers/ready` returned `401`.

### 6. Self-Review
- Simpler option considered: issue could have been blocked from LUC-2618 evidence alone, but this heartbeat required concrete action and current proof.
- Technical debt introduced: no.
- Scalability assessment: no runtime/code change.
- Refinements made: classified exact blocker owner/action.

### 7. Update Documentation and Knowledge
- Docs updated: this evidence file, task board, project state, active mission, next steps, system health, module confidence ledger, requirements matrix, risk register, runtime config ledger.
- Context updated: yes.
- Learning journal updated: not applicable; no new recurring pitfall beyond existing no-secret handling rules.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was handled.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing smoke/auth systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validation was run.
- [x] Docs/context were updated.

## Result Report
- Task summary: current injected `SMOKE_*` binding is still not an accepted Soar API auth binding for production `/workers/ready`.
- Files changed: this evidence file and source-of-truth state docs only.
- How tested: current no-secret binding shape check and existing deploy smoke runner.
- What is incomplete: accepted smoke auth binding is still missing.
- Blocker owner/action: credential/account owner or board-approved secret-store operator must provision one production-smoke appropriate `ADMIN` principal/session accepted by Soar API auth and bind it to exactly one supported path, preferably `SMOKE_AUTH_TOKEN` or valid `SMOKE_AUTH_EMAIL` + `SMOKE_AUTH_PASSWORD`.
- Next steps: after binding is corrected, wake [LUC-2618](/LUC/issues/LUC-2618) so Ops can rerun the worker-included smoke and then wake [LUC-1438](/LUC/issues/LUC-1438).

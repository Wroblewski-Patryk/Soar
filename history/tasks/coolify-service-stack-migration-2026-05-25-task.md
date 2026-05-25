# COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25

## Header
- ID: COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25
- Title: Prepare safe Coolify Service Stack migration for Soar app processes
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Ops/Release
- Depends on: `LOCAL-DOCKER-COOLIFY-PARITY-2026-05-24`, `PROD-RUNTIME-AGGREGATE-SLO-BLOCKER-2026-05-25`
- Priority: P0
- Module Confidence Rows: Operations / deployment topology
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: QAS-LOCAL-DOCKER-COOLIFY-PARITY-2026-05-24
- Risk Rows: RISK-LOCAL-PROD-DOCKER-DRIFT-2026-05-24
- Iteration: 2026-05-25
- Operation Mode: BUILDER
- Mission ID: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the active reliability intervention.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was previously reviewed in the active mission startup set.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were not bootstrapped; existing ops/readiness tables already exist.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence and production deploy stability.

## Mission Block
- Mission objective: consolidate Soar app processes into a single Coolify Service Stack deployment path without moving production data or weakening rollback.
- Release objective advanced: reduce Coolify deploy-queue pressure and OOM/restart risk while preserving public/protected proof gates.
- Included slices:
  - add a production-oriented Coolify compose stack for API, Web, and four workers;
  - keep existing production Postgres/Redis as external dependencies during the first cutover;
  - add env template, health gates, dependency ordering, build-info SHA inputs, and memory guardrails;
  - update operations documentation with cutover and rollback gates.
- Explicit exclusions:
  - no production secret capture in repository;
  - no live exchange mutation;
  - no destructive DB/Redis migration;
  - no deletion of old Coolify resources before the new stack passes smoke and rollback is available.
- Checkpoint cadence: update this task after compose validation, docs update, and any Coolify action.
- Stop conditions: stop on missing Coolify control, failed compose validation, failed health/smoke, or any need to expose secrets.
- Handoff expectation: one validated stack manifest, one cutover runbook, and explicit deployment blocker/proof status.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS, active mission, task board | Integration, task closure, source-of-truth updates | Mission packet and final acceptance | Parent validation gate | IN_PROGRESS |
| Ops/Architecture | Explorer lane + coordinator | Coolify docs, repo ops docs, compose files | Read-only findings | Risk report and cutover constraints | Lane report received | COMPLETE |
| Implementation | Coordinator | Existing Dockerfiles and compose topology | `docker-compose.coolify.yml`, `.env.coolify.example`, `package.json` | Validated stack manifest | Docker compose config | COMPLETE |
| QA/Test | Coordinator | Package scripts, compose validator | Validation commands | Compose and guardrail proof | PASS locally; production blocked | BLOCKED |
| Documentation/Memory | Coordinator | Operations docs/state files | Ops docs and state updates | Cutover/rollback guidance | Docs/graph/guardrails updated | COMPLETE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed before broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was not discovered.
- [ ] Process eval will be recorded before closure if deployment remains blocked.

## Context
Soar currently runs in Coolify as six separate Applications for API, Web, and four workers, plus separate database resources. n8n runs as one Service Stack with multiple internal services. The operator asked to migrate Soar toward the n8n model because the deploy queue and repeated VPS instability are hurting reliability.

## Goal
Create and, where control is available, deploy a safe Coolify Service Stack path for Soar app processes that reduces deployment queue churn while keeping rollback and data safety intact.

## Success Signal
- User or operator problem: six separate Soar app deployments overload or destabilize Coolify/VPS.
- Expected product or reliability outcome: one stack deployment controls API/Web/workers with the same SHA and fewer queued deployment jobs.
- How success will be observed: stack compose validates, new stack deploys, public smoke passes, build-info reports expected SHA, workers are running, old app resources remain available until cutover is accepted.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Production Coolify compose manifest, env template, runbook updates, and validation evidence.

## Constraints
- use existing Dockerfiles and worker split topology;
- do not move production Postgres/Redis in this task;
- do not delete old Coolify Applications until the new stack is proven;
- do not expose secrets in repository, command output, or evidence;
- do not run live exchange-side mutations.

## Definition of Done
- [x] Coolify stack manifest validates locally.
- [x] Cutover and rollback path are documented.
- [x] Source-of-truth state is updated with proof and residual risks.
- [ ] If production deployment is performed, public smoke and stack health evidence are captured.

## Forbidden
- committing production secrets;
- destructive data migration;
- deleting rollback resources before proof;
- temporary bypasses around health/readiness;
- claiming V1 readiness from public smoke alone.

## Deployment / Ops Evidence
- Deploy impact: high
- Env or secret changes: new stack requires copying existing production env values into Coolify only.
- Health-check impact: API `/ready` and Web `/` are stack healthchecks; workers start only after API is healthy.
- Smoke steps updated: pending docs update.
- Rollback note: keep old six Applications stopped-but-available or domain-detached until stack passes SLO/RC gate.
- Observability or alerting impact: stack reduces queue fanout but still needs SLO proof.
- Staged rollout or feature flag: parallel stack first, then domain cutover.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: six separate app deployments, recent API OOM/reachability blocker, and Coolify queue churn.
- Gaps: existing `docker-compose.vps.yml` lacks production stack routing/health/build-info strictness.
- Inconsistencies: docs described split worker topology but not the one-stack migration path.
- Architecture constraints: split workers remain canonical; inline worker fallback remains degraded only.

### 2. Select One Priority Mission Objective
- Selected task: Coolify Service Stack migration preparation.
- Priority rationale: directly addresses operator-reported infrastructure instability.
- Why other candidates were deferred: protected app proof and live trading proof depend on stable production reachability.

### 3. Plan Implementation
- Files or surfaces to modify: new Coolify compose/env template, package script, operations docs, task/state files.
- Logic: keep DB/Redis external, require exact `SOURCE_COMMIT`, gate Web on API health, gate workers on API health.
- Edge cases: migration race, stale build-info, proxy/domain conflict, rollback to old Applications.

### 4. Execute Implementation
- Implementation notes: added `docker-compose.coolify.yml`, `.env.coolify.example`, and `docker:coolify:config`.

### 5. Verify and Test
- Validation performed:
  - `docker compose --env-file .env.coolify.example -f docker-compose.coolify.yml config`
  - `corepack pnpm run docker:coolify:config`
  - `corepack pnpm run architecture:graph:generate`
  - `corepack pnpm run architecture:graph:drift:strict`
  - `corepack pnpm run quality:guardrails`
  - `curl.exe -I --max-time 10 https://vps.luckysparrow.ch`
- Result:
  - local compose and guardrails PASS;
  - architecture graph generated `644` nodes / `802` relations / `27` chains;
  - strict graph drift PASS `800/800` covered and `0` missing;
  - production Coolify reachability BLOCKED because the HTTPS request timed out.

### 6. Self-Review
- Simpler option considered: paste existing `docker-compose.vps.yml` into Coolify.
- Technical debt introduced: no, this separates production stack concerns from local/VPS fallback.
- Scalability assessment: one stack should reduce deploy queue fanout; memory caps guard host stability but must be tuned with SLO evidence.
- Refinements made: externalized DB/Redis, required versioned encryption keys and source SHA, added health dependency ordering.

### 7. Update Documentation and Knowledge
- Docs updated: `Soar - docs/operations/coolify-linux-vps-setup-guide.md`, `Soar - docs/operations/deployment-rollback-playbook.md`, `Soar - docs/operations/post-deploy-smoke-checklist.md`, architecture graph records.
- Context updated: active mission/project state/task board/module/risk state updated for the blocked deployment.
- Learning journal updated: not applicable; no new recurring local pitfall beyond existing VPS reachability blocker.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed for split worker topology.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [ ] Definition of Done evidence is complete for production deployment.
- [x] Relevant local validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.

## Result Report
- Reality status: implemented locally, production deployment blocked.
- Files changed: Coolify stack manifest/env template, package script, operations runbooks, architecture graph records, source-of-truth state.
- Deployment impact: no production mutation was performed because Coolify/VPS was unreachable from this environment.
- Residual risk: stack proxy/domain parsing and production env copy still require Coolify UI/API proof; old six Applications must stay as rollback until the stack passes smoke and SLO monitoring.
- Next action: when `https://vps.luckysparrow.ch` is reachable, create a parallel Coolify Service Stack from `docker-compose.coolify.yml`, copy existing production env values, set `SOURCE_COMMIT`, deploy, run smoke, then cut over domains only after proof.

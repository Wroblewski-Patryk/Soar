# Task

## Header
- ID: LOCAL-DOCKER-COOLIFY-PARITY-2026-05-24
- Title: Align local Docker startup with Coolify split-service topology
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: SOAR-FULL-READINESS-COORDINATION-2026-05-23
- Priority: P0
- Module Confidence Rows: deployment/runtime topology, production readiness
- Requirement Rows: protected production proof prerequisites, deploy parity
- Quality Scenario Rows: operations reliability, maintainability
- Risk Rows: local/prod topology drift, excessive deploy queue churn, live exchange mutation risk
- Iteration: 2026-05-24
- Operation Mode: BUILDER
- Mission ID: LOCAL-DOCKER-COOLIFY-PARITY-2026-05-24
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the chosen bounded implementation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed in the active mission context.
- [x] `.agents/core/mission-control.md` was reviewed in the active mission context.
- [x] Missing or template-like state tables were not created for this narrow ops slice.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: provide a local Windows-friendly Docker app stack that mirrors the Coolify production service split without triggering deployment churn.
- Release objective advanced: reduce local/VPS topology drift before protected production proof and future deploys.
- Included slices: package scripts, local Docker env template, local runbook update, Coolify runbook update, compose validation.
- Explicit exclusions: no production secret persistence, no LIVE exchange mutation, no frequent push/deploy loop, no Coolify service mutation before local proof.
- Checkpoint cadence: validate compose rendering, then build/start only after syntax and config pass.
- Stop conditions: Docker engine unavailable, compose contract invalid, secret exposure risk, or any LIVE mutation path needing fresh operator approval.
- Handoff expectation: report exact commands run, deployment impact, residual risks, and whether a later commit/push is safe.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, active mission | Integration, task closure, state updates | bounded mission packet | final validation gate | DONE |
| Architecture/Ops | Coordinator | Coolify guide, local dev runbook | Docker/Coolify topology contract | local parity shape | compose config | DONE |
| Implementation | Coordinator | package scripts, env templates | `package.json`, `.env.docker.example` | Docker commands | syntax/config validation | DONE |
| QA/Test | Coordinator | validation baseline | compose/render/build checks | proof notes | command evidence | DONE |
| Documentation/Memory | Coordinator | task board/project state | task and runbooks | source-of-truth updates | reviewed diffs | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed in the active mission context.
- [x] `.agents/workflows/responsibility-lanes.md` was considered through the coordinator mandate.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership did not require a new responsibility-learning row.

## Context
The VPS/Coolify guide already defines API, Web, and split worker services, but local Docker startup only covered Postgres and Redis. The operator asked for local Windows and VPS behavior to converge and warned that frequent pushes trigger excessive Coolify deploys.

## Goal
Add a safe local Docker app stack entrypoint that reuses the existing Coolify/VPS compose service map and documents how to validate it before any deploy.

## Success Signal
- User or operator problem: local runs can drift from the actual VPS service split.
- Expected product or reliability outcome: local Docker proof can catch Dockerfile/env/topology problems before Coolify.
- How success will be observed: compose renders the full app stack and documentation points operators to the same commands.
- Post-launch learning needed: yes

## Deliverable For This Stage
Implement local Docker parity scripts and docs, then validate compose rendering and relevant repository checks.

## Constraints
- use existing Dockerfiles and `docker-compose.vps.yml`
- do not introduce a parallel deployment topology
- do not store production secrets
- do not trigger Coolify deploys repeatedly
- do not perform LIVE exchange mutations

## Definition of Done
- [x] root scripts expose local Docker app stack commands
- [x] local env template exists without production secrets
- [x] local and Coolify runbooks describe the parity workflow
- [x] compose config validates
- [x] repository guardrails relevant to changed files pass or blockers are documented

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- production secret capture
- live exchange order open/close/cancel without fresh explicit approval
- duplicate compose topology
- workaround-only scripts
- repeated push/deploy churn

## Validation Evidence
- Tests:
  - `node -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"` PASS
  - `corepack pnpm run docker:app:config` PASS
  - `docker compose --env-file .env.docker.example -f docker-compose.vps.yml --profile infra build api web workers-market-data workers-market-stream workers-backtest workers-execution` PASS
  - `corepack pnpm run quality:guardrails` PASS
  - `corepack pnpm run architecture:graph:drift:strict` PASS (`796/796`, `0` missing)
  - `git diff --check` PASS with line-ending warnings only
- Manual checks:
  - Docker Desktop engine reported version `28.3.2`.
  - Short local Docker parity run started API, Web, and four split worker containers from the built images.
  - Initial run intentionally exposed weak-placeholder fail-closed behavior in API secret readiness; `.env.docker.example` was corrected to non-weak local-only sample values.
  - Rerun passed API `GET /health` -> `200`, API `GET /ready` -> `200`, and Web `/` -> `200`.
- Screenshots/logs: command evidence in terminal output; no browser screenshots required for this ops slice
- High-risk checks: no LIVE mutation; no production secrets written; app/worker containers were stopped and removed after proof
- Module confidence ledger updated: yes
- Requirements matrix updated: no, existing release/readiness requirement remains partially verified until protected production proof
- Quality scenarios updated: yes
- Risk register updated: yes
- Reality status: verified

## Architecture Evidence
- Architecture source reviewed: `docs/operations/coolify-linux-vps-setup-guide.md`, `docs/engineering/local-development.md`, `docker-compose.vps.yml`
- Fits approved architecture: yes
- Mismatch discovered: yes, local infra-only compose did not mirror split-service VPS topology
- Decision required from user: no
- Approval reference if architecture changed: operator requested Docker/Coolify convergence on 2026-05-24
- Follow-up architecture doc updates: local and Coolify runbooks updated

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: `.env.docker.example` only; no real secrets
- Health-check impact: none
- Smoke steps updated: local Docker parity verification documented
- Rollback note: remove root Docker scripts and `.env.docker.example`; no runtime code changed
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: local Docker command started infra only; production expects split API/Web/workers.
- Gaps: no root command for local full Docker app stack.
- Inconsistencies: docs covered prod-like pnpm mode but not Docker/Coolify parity mode.
- Architecture constraints: reuse Coolify Dockerfiles and service split.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Sources scanned: Dockerfiles, compose files, package scripts, local and Coolify runbooks.
- Assumptions recorded: local parity can use example env for config validation and `.env.docker` for actual starts.
- Blocking unknowns: none for the script/docs slice.
- Why it was safe to continue: no production mutation or secret persistence required.

### 2. Select One Priority Mission Objective
- Selected task: local Docker/Coolify parity.
- Priority rationale: it directly supports local and VPS correctness before protected production proof.
- Why other candidates were deferred: Coolify mutation and live-app readback should follow after local Docker contract is stable.

### 3. Plan Implementation
- Files or surfaces to modify: `package.json`, `.env.docker.example`, local/Coolify runbooks, task/state docs.
- Logic: expose compose commands using existing `docker-compose.vps.yml`; validate with example env.
- Edge cases: missing `.env.docker`, production secret leakage, Docker Desktop unavailable.

### 4. Execute Implementation
- Implementation notes: added `docker:app:*` root scripts, `.env.docker.example`, a local Docker parity section in the local-development runbook, and a Coolify parity note in the VPS setup guide.

### 5. Verify and Test
- Validation performed: package JSON parse, compose render, Docker image build for API/Web/four workers, short local container run, API/Web HTTP checks, guardrails, graph drift, and diff check.
- Result: PASS. The only discovered issue was weak example material, fixed before closure.

### 6. Self-Review
- Simpler option considered: documenting raw compose commands only.
- Technical debt introduced: no
- Scalability assessment: keeps one compose topology for local parity and VPS fallback.
- Refinements made: config command uses `.env.docker.example` so first validation is no-secret and copy-free.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/engineering/local-development.md`, `docs/operations/coolify-linux-vps-setup-guide.md`.
- Context updated: `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/active-mission.md`, `.agents/state/module-confidence-ledger.md`, `.agents/state/system-health.md`, `.agents/state/next-steps.md`, `.agents/state/quality-attribute-scenarios.md`, `.agents/state/risk-register.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.

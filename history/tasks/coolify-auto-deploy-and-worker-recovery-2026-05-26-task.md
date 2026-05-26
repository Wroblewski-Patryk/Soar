# Coolify Auto Deploy And Worker Recovery - 2026-05-26

## Header
- ID: COOLIFY-AUTO-DEPLOY-WORKER-RECOVERY-2026-05-26
- Title: Restore Coolify push-triggered deployments and recover market-stream worker
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: Coolify team/application access
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS, SOAR-WORKERS
- Requirement Rows: REQ-FUNC-021
- Quality Scenario Rows: production deployment reliability
- Risk Rows: RISK-COOLIFY-STACK-CUTOVER-2026-05-25, RISK-VPS-REACHABILITY-2026-05-25
- Iteration: 2026-05-26 operator-requested recovery
- Operation Mode: BUILDER
- Mission ID: COOLIFY-AUTO-DEPLOY-WORKER-RECOVERY-2026-05-26
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one priority task was selected: restore deploy trigger behavior and recover the stopped worker.
- [x] Operation mode is BUILDER for a bounded ops repair.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence, requirement, quality, and risk rows were identified.
- [x] The task improves release confidence by restoring deploy automation and worker liveness evidence.

## Mission Block
- Mission objective: inspect Coolify for Soar deployment drift, restore push-triggered deploy behavior, and recover any obvious stopped production worker.
- Release objective advanced: production deploy automation and worker fleet liveness.
- Included slices: Coolify team/project discovery, deployment history review, app advanced settings readback, Auto Deploy restoration, market-stream worker deploy, public no-worker smoke.
- Explicit exclusions: commit/push, Service Stack topology cutover, secret rotation, protected worker-token smoke, authenticated app journeys, LIVE exchange mutation.
- Checkpoint cadence: record findings and evidence immediately after Coolify mutation.
- Stop conditions: missing Coolify access, secret exposure risk, failed worker recovery, or public smoke failure.
- Handoff expectation: report exact deploy automation state, recovered worker proof, production SHA, and residual release blockers.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | AGENTS.md, project state | Integration and final report | Mission packet and source-of-truth updates | Evidence packet | DONE |
| Ops/Release | Active chat | Coolify project, deployment docs | Coolify application settings and worker deploy | Auto Deploy restored and worker recovered | Coolify readback plus smoke | DONE |
| QA/Test | Active chat | deploy smoke script | Public no-worker production endpoints | Public smoke result | `scripts/deploySmokeCheck.mjs` | DONE |
| Security | Active chat | secret-handling guardrails | Evidence redaction | No secret values persisted | Manual redaction review | DONE |
| Documentation/Memory | Active chat | state files and history | Task/evidence/state updates | Durable handoff | Updated files | DONE |

## Context
The operator reported that Coolify deployments were not happening correctly after pushes and that a deployment had hung for many hours before being canceled. The active production topology still uses six Coolify Applications for API, Web, and four split workers while the newer Service Stack cutover remains a separate blocked path.

## Goal
Restore the previously expected behavior where Soar Coolify Applications deploy after Git pushes, recover the stopped `workers-market-stream` Application, and capture evidence without exposing secrets.

## Success Signal
- User or operator problem: pushes no longer trigger deploys and one worker deploy was stuck/failed.
- Expected product or reliability outcome: all six Soar Applications have Auto Deploy enabled and all Soar runtime resources are running.
- How success will be observed: Coolify settings readback, successful market-stream worker deployment, running resource list, and public no-worker smoke pass on the deployed SHA.
- Post-launch learning needed: yes.

## Deliverable For This Stage
A verified ops recovery packet covering root cause, mutation, smoke evidence, and residual release risk.

## Constraints
- Use existing Coolify Applications and Git App integration.
- Do not introduce a new deployment topology in this task.
- Do not write secrets, cookies, tokens, passwords, API keys, or environment values into repository files.
- Do not mutate live trading, exchange configuration, subscriptions, or external service state.
- Do not commit, push, or deploy unrelated local changes.

## Definition of Done
- [x] Soar Coolify project and affected Applications identified.
- [x] Auto Deploy state checked and restored for all six Soar Applications.
- [x] Stopped market-stream worker recovered with a successful deployment.
- [x] Public no-worker production smoke passes for the currently deployed Git SHA.
- [x] Source-of-truth and evidence files updated with residual risks.

## Forbidden
- Recording Coolify credentials or secret environment values.
- Replacing the deployment topology with the Service Stack during this repair.
- Treating public smoke as full protected release readiness.
- Performing LIVE exchange-side mutation.
- Reverting unrelated dirty workspace changes.

## Validation Evidence
- Tests:
  - `node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha 3fedb7a9170097b40accb6ccea1915064f383f11 --no-workers`
- Manual checks:
  - Coolify team `LuckySparrow` selected and Soar project opened.
  - Auto Deploy enabled and saved on `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`, `workers-market-data`, and `workers-market-stream`.
  - Latest `workers-market-stream` manual recovery deployment `gqpmafky0oe2jr3rszkov2is` completed `Success`.
  - Coolify resources read back as running for API, Web, all four workers, PostgreSQL, and Redis.
- Screenshots/logs: Coolify deployment metadata reviewed in browser; no secret-bearing logs persisted.
- High-risk checks:
  - No LIVE exchange mutation was performed.
  - No secret values were written to repo files.
  - Protected worker readiness endpoints were not called with a token in this task.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: SOAR-OPERATIONS, SOAR-WORKERS.
- Requirements matrix updated: no; existing release requirement remains partially blocked on protected proof.
- Quality scenarios updated: no.
- Risk register updated: yes.
- Risk rows closed or changed: risk note added for Coolify Auto Deploy drift.
- Reality status: verified for deploy automation restoration and worker recovery; partially verified for full release readiness.

## Architecture Evidence
- Architecture source reviewed: active mission/state docs and Coolify deployment docs through project state.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: none; this restores existing six-Application behavior.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none recorded and none intentionally changed.
- Health-check impact: none.
- Smoke steps updated: no script change; existing public smoke was rerun.
- Rollback note: if Auto Deploy fanout becomes unsafe again, disable Auto Deploy deliberately only with a recorded release-controller decision and preserve a manual deploy path.
- Observability or alerting impact: none changed.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence
- Analyze current state: inspected Coolify project, resources, deployments, and settings.
- Select one objective: restore Auto Deploy and recover stopped worker.
- Plan implementation: enable Auto Deploy on existing Applications and run narrow worker deploy.
- Execute implementation: toggled Auto Deploy on six Applications; deployed only `workers-market-stream`.
- Verify and test: confirmed deployment success, all resources running, and public no-worker smoke pass.
- Self-review: scoped mutation to ops settings and one worker deploy; no code/deploy topology change.
- Update documentation and knowledge: this task packet, evidence packet, state files, risk note, and learning journal entry.

## Result Report
Root cause for the reported push-deploy drift was Coolify configuration: `Auto Deploy` was off on all six Soar Applications even though they used the official Git App integration. The long-running worker deployment was visible in `workers-market-stream` history as failed/canceled around 2026-05-25/2026-05-26, and the worker resource was exited before recovery. Auto Deploy is now restored for all six Applications, the market-stream worker has a successful recovery deploy on production SHA `3fedb7a9170097b40accb6ccea1915064f383f11`, and all Soar resources are running. Full V1 release readiness remains blocked on protected-token/authenticated evidence and separate release gates.

## 2026-05-26 Push-Test Closure

The GitHub-to-Coolify path was tested by pushing `6f9ea8d21b1dc6aadf8e34a13be33931b9859f7e`, which created webhook deployment rows for all six Soar Applications. The deploy fanout exposed a VPS/Coolify incident rather than a Git trigger failure:

- `/` was full (`100%`, `0` available), causing Coolify Redis `MISCONF`, API `/ready` `503`, and unstable deployment queue state.
- Coolify later failed deployments because `/data/coolify/ssh` was not writable after the disk incident.
- API/worker Docker builds were producing or retaining huge `apps/api/core` files in layers and still had redundant recursive ownership work in worker images.

Repairs completed:

- reclaimed host disk without deleting app data volumes;
- restarted Coolify Redis, production Postgres, and Coolify where needed;
- applied the Coolify-reported SSH directory permission repair;
- pushed `71b8d503fd6fdfd7378dc67b2fa678799e2430f8` with Docker image hardening for core dump exclusion/removal and worker chown removal;
- cancelled stale failed/queued deployments from the broken fanout;
- redeployed remaining Applications to `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`.

Final status:

- all six Soar Applications are running image SHA `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`;
- Soar Redis, production Postgres, and Coolify Redis are healthy;
- host disk is `76%` used with `18G` available after cleanup;
- public no-worker deploy smoke passed for API `/health`, API `/ready`, Web `/`, and Web `/api/build-info`.

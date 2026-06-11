# LUC-3382 Coolify Failed Deploy Read-Only Diagnosis

## Header
- ID: LUC-3382
- Title: [Soar][DRE] Read-only diagnose recent Coolify failed deploy signal from LUC-3365
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-3365
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / Coolify production deploy health
- Requirement Rows: production deploy confidence, rollback and smoke gate readiness
- Quality Scenario Rows: reliability / deployment observability
- Risk Rows: production mutation and protected-smoke gate risk
- Iteration: 2026-06-11 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3382-COOLIFY-FAILED-DEPLOY-READONLY-DIAGNOSIS-2026-06-11
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps were represented through read-only analysis, diagnosis, verification, source-of-truth update, and issue closure.
- [x] Exactly one priority task was selected: LUC-3382.
- [x] Operation stayed within the DRE role.
- [x] The task aligned with deployment safety, credential safety, and Coolify hierarchy source truth.
- [x] Affected module confidence and system health rows were identified.
- [x] The task improves release confidence by classifying what the current token can and cannot observe.

## Mission Block
- Mission objective: diagnose recent Coolify failed deploy observations from LUC-3365 using read-only metadata only.
- Release objective advanced: Soar production deploy confidence.
- Included slices: Paperclip issue context, parent LUC-3365 comments, Coolify read-only deployment and application metadata, public build-info/source freshness, public health probes.
- Explicit exclusions: deploy, restart, rollback, environment edit, protected smoke, database action, account action, raw private logs, raw resource ids, secret values, screenshots, live-trading action.
- Stop conditions: any required mutation, raw log access, protected principal requirement, or secret/value exposure.
- Handoff expectation: close with a safe-label diagnosis and named residual gate.

## Context
LUC-3365 completed a production deploy health sweep and created this child issue because board/operator observations said recent Coolify deploys failed. The parent found public API/Web health reachable and Coolify project/environment reads working, but the global deployments endpoint returned zero rows in the current token context.

## Goal
Classify whether the current DRE token can see failed deploy rows or related failure metadata, then correlate that with public build-info and safe resource status.

## Success Signal
- User or operator problem: recent Coolify failed deploy observations need classification without unsafe production mutation.
- Expected reliability outcome: know whether the current token proves failed deploy rows, only restart metadata, or no failure evidence.
- How success was observed: read-only endpoints returned explicit HTTP/count/status results.
- Post-launch learning needed: yes, if deeper Coolify UI/operator log access is required.

## Constraints
- Existing Coolify hierarchy is the source of truth: project -> production environment -> resources.
- Do not persist raw UUIDs, token values, cookies, passwords, raw private logs, or resource IDs.
- Do not run deploy, restart, rollback, env edit, protected smoke, database action, account action, exchange action, or live-trading action.
- Name resources only by safe labels.

## Definition of Done
- [x] Parent issue context and comments reviewed.
- [x] Current token visibility for deploy history classified.
- [x] Public build-info/source freshness and resource status correlated.
- [x] Result persisted without secrets, raw IDs, or raw private logs.
- [x] Paperclip issue disposition updated.

## Forbidden
- Deploy/redeploy/restart/rollback.
- Environment mutation or credential readback.
- Protected smoke without approved principal.
- Raw log persistence or screenshot capture.
- Raw resource id persistence.

## Validation Evidence
- Tests: not applicable; no code was changed.
- Manual checks:
  - Paperclip heartbeat context for LUC-3382 read successfully.
  - LUC-3365 parent comments read successfully.
  - Coolify global `/api/v1/deployments` read returned HTTP 200 and 0 rows.
  - Coolify project production read returned HTTP 200 with 6 applications, 1 PostgreSQL, 1 Redis, and 0 generic services.
  - Coolify application detail reads returned HTTP 200 for safe labels `soar-web`, `soar-api`, `workers-backtest`, `workers-market-stream`, `workers-execution`, and `workers-market-data`.
  - Candidate per-application deploy-history/log metadata endpoints returned HTTP 404 for checked application resources: `applications/{id}/deployments`, `applications/{id}/deployment-history`, `applications/{id}/deployments/history`, `applications/{id}/logs/deployments`, and `applications/{id}/deployment/logs`.
  - Public production probes returned API `/health` 200, API `/ready` 200, Web `/` 200, and Web `/api/build-info` 200.
- Screenshots/logs: none; raw private logs were intentionally not fetched or persisted.
- High-risk checks: no deploy, restart, rollback, env edit, database action, protected smoke, account action, secret readback, raw resource-id persistence, raw log persistence, exchange action, or live-trading action occurred.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: SOAR-OPERATIONS-001 / Coolify production deploy health.
- Requirements matrix updated: no; no requirement status changed.
- Quality scenarios updated: no; no scenario status changed.
- Risk register updated: no; existing protected/mutation gate risk remains.
- Reality status: partially verified.

## Diagnosis
- Current token can prove the production Coolify project/environment/resource hierarchy and application detail metadata, but cannot see recent failed deployment rows through the checked deploy-history endpoints.
- Global deployments visibility is empty: HTTP 200 with 0 rows.
- Per-application deploy-history/log metadata endpoints are unavailable through this token/API shape: HTTP 404 for the safe application resources checked.
- Public production is reachable at the time of diagnosis: API `/health`, API `/ready`, Web `/`, and Web `/api/build-info` all returned HTTP 200.
- Public Web build-info reports `gitSha` prefix `56d8d440`, `gitRef=main`, `metadataSource=github-branch`.
- Coolify application detail metadata reports all six application resources as `running:unknown` with `serverStatus=true`.
- `workers-execution` is the only checked application with retained failure-adjacent metadata: `lastRestartType=crash`, `lastRestartAt=2026-06-06T04:12:15.000000Z`, `restartCount=2`.
- `soar-web` application detail reports git metadata prefix `b894e5dd`, while public build-info reports `56d8d440`. This is a metadata mismatch requiring operator/Coolify release-source interpretation before using Coolify app detail as deployed source truth.
- `soar-api` and worker application detail rows expose `gitShaPrefix=HEAD`, which is not release-grade provenance.

## Result Report
- Files changed: this task evidence file, `.agents/state/system-health.md`, `.agents/state/module-confidence-ledger.md`.
- Verification commands/checks run: Paperclip API context/comments, read-only Coolify GETs, public production HTTP GETs.
- Commit SHA: not committed; read-only diagnosis and state evidence in a dirty shared worktree.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: true failed deploy log/root-cause remains not visible to this token via the checked endpoints. A deeper diagnosis would require an approved Coolify UI/operator log export or a documented read-only deployment log endpoint, with redaction rules and no mutation.

## Architecture Evidence
- Affected entities: Coolify production deploy health, service topology, release/deploy gate.
- Affected files: `history/tasks/luc-3382-coolify-failed-deploy-readonly-diagnosis-2026-06-11-task.md`, `.agents/state/system-health.md`, `.agents/state/module-confidence-ledger.md`.
- Upstream: LUC-3365.
- Downstream: protected worker readiness and any mutation/redeploy/rollback lane remain approval-gated.

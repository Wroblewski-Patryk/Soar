# LUC-3515 Coolify Production Deploy Health Sweep

## Header
- ID: LUC-3515
- Title: [Soar] Coolify production deploy health sweep
- Task Type: release
- Current Stage: verification
- Status: REVIEW
- Owner: 09 DRE (Deployment and Reliability Engineer)
- Depends on: [LUC-3525](/LUC/issues/LUC-3525)
- Priority: P0
- Module Confidence Rows: SOAR-OPERATIONS-001 / Production deploy/runtime health
- Requirement Rows: Soar production deploy confidence
- Quality Scenario Rows: reliability / deployability / rollback readiness
- Risk Rows: production deployment queue, protected smoke, source provenance
- Iteration: 2026-07-02 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-3515-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-07-02
- Mission Status: DONE / PUBLIC_WEB_API_SMOKE_PASS / DEPLOY_LOG_EXPORT_INTEGRATED / COOLIFY_DEPLOY_QUEUE_CLEARED_ON_READ_ONLY_RECHECK / NO_PRODUCTION_MUTATION

## Process Self-Audit
- [x] All seven autonomous loop steps are represented for this bounded heartbeat.
- [x] Exactly one priority task was selected: [LUC-3515](/LUC/issues/LUC-3515).
- [x] Scoped wake was honored; checkout was already held by the harness and not repeated.
- [x] DRE role boundaries were applied.
- [x] The direct child [LUC-3525](/LUC/issues/LUC-3525) was integrated before generic exploration.
- [x] Production mutation, deploy, restart, rollback, env edit, database/Redis action, account mutation, exchange/payment action, and live-trading action were excluded.
- [x] Evidence and project memory were updated.

## Context
[LUC-3515](/LUC/issues/LUC-3515) previously stopped blocked because the current Coolify token/API shape did not expose failed-deploy logs through the candidate endpoints. The wake reason was `issue_children_completed`; child [LUC-3525](/LUC/issues/LUC-3525) is now `done` and supplied a redacted deploy-log export artifact.

## Goal
Integrate the redacted Coolify deploy-log export, rerun the smallest current public production and Coolify read-only checks, classify whether deploy health can close, and stop fail-closed if the next action requires production mutation.

## Success Signal
- User or operator problem: recent failed/queued Coolify deploys need a no-secret deploy-health diagnosis.
- Expected reliability outcome: deploy-log provenance is no longer blocked by missing artifact, and any remaining production mutation is approval-gated.
- How success will be observed: parent issue has updated evidence, source-of-truth files, and an explicit review/approval path.
- Post-launch learning needed: no.

## Deliverable For This Stage
A read-only evidence packet plus Paperclip disposition for whether the sweep is done, blocked, or pending approval.

## Constraints
- Use the Coolify hierarchy as source truth: project -> production environment -> resources.
- Do not store secret values, raw cookies, passwords, private account data, or unredacted environment values.
- Do not deploy, restart, rollback, edit env, mutate DB/Redis, use production accounts, perform exchange/live-trading actions, or run a protected smoke without an approved auth path.
- Treat production queue cleanup/redeploy/restart as a separate approval-gated mutation.

## Definition of Done
- [x] Parent heartbeat context read.
- [x] [LUC-3525](/LUC/issues/LUC-3525) artifact/comment integrated.
- [x] Public production no-worker smoke run.
- [x] Coolify read-only deployments/resources checked.
- [x] Residual deploy queue risk named.
- [x] Project state evidence updated.
- [x] Approval/review path prepared for any production-impacting next step.

## Stage Exit Criteria
- [x] The output matches `verification`.
- [x] Work from later stages was not mixed in; no production mutation occurred.
- [x] Risks and assumptions are explicit.

## Forbidden
- Production deploy/redeploy/restart/rollback.
- Environment, database, Redis, team, or account mutation.
- Protected app smoke without accepted principal/session path.
- Raw private log capture or secret value disclosure.
- Push from dirty/divergent worktree.

## Validation Evidence
- Tests:
  - `corepack pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --no-workers` -> PASS.
- Manual checks:
  - API `/health` -> `200`.
  - API `/ready` -> `200`.
  - Web `/` -> `200`.
  - Web `/api/build-info` -> `200`, `gitSha=c357d957741f56835f27a1fc3a948dad43a91036`, `gitRef=main`, `metadataSource=env-runtime`.
- High-risk checks:
  - Coolify `/api/v1/version` -> `200`.
  - Coolify `/api/v1/teams/current` -> `200`, selector `LuckySparrow`.
  - Coolify `/api/v1/resources` -> `17` visible rows; six Soar apps `running:unknown` with `server_status=true`; PostgreSQL/Redis `running:healthy`.
  - Coolify `/api/v1/deployments` -> `7` rows: API/worker `in_progress` rows with `finished_at`, and queued rows for `workers-market-stream`, `workers-execution`, `soar-api`, `workers-market-data`, and `soar-web`.
- Module confidence ledger updated: yes.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: partially verified / pending approval.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: public Web/API no-worker smoke verified.
- Smoke steps updated: no.
- Rollback note: no rollback executed; any queue/redeploy/restart action must include rollback to current verified public state on `c357d957741f56835f27a1fc3a948dad43a91036` or the previous known-good Coolify deployment selected by Ops.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Result Report
- Files changed:
  - `history/evidence/luc-3515-coolify-production-deploy-health-sweep-2026-07-02.md`
  - `history/tasks/luc-3515-coolify-production-deploy-health-sweep-2026-07-02-task.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Verification commands/checks run:
  - Paperclip issue/child/artifact readback.
  - Direct public endpoint probes.
  - `corepack pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --no-workers`.
  - Coolify read-only `/api/v1/version`, `/api/v1/teams/current`, `/api/v1/resources`, `/api/v1/deployments`, and direct API/Web app reads.
- Commit SHA: not committed; shared worktree was already dirty and divergent (`main`, local `fc0f6d9f`, ahead `23`, behind `3`).
- Push status: not needed.
- Deploy impact: none.
- Residual risk:
  - Follow-up approval wake rechecked Coolify before mutating production; `/api/v1/deployments` returned `0` visible rows, so the approved queue-remediation mutation had no remaining target and was not executed.
  - Protected `/workers/ready`, runtime freshness, rollback guard, and authenticated acceptance remain separate release gates if required.

## Approval Follow-Up Closure

- Timestamp: 2026-07-02T18:41Z.
- Approval: [af477e6c-de65-42c9-b3f3-85e88706f3cc](/LUC/approvals/af477e6c-de65-42c9-b3f3-85e88706f3cc), approved.
- Stage: verification.
- Concrete action after approval:
  - Re-ran `corepack pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha c357d957741f56835f27a1fc3a948dad43a91036 --no-workers` -> PASS.
  - Re-ran redacted Coolify read-only GET snapshot for version, current team, resources, and deployments.
- Current state:
  - Public Web/API no-worker smoke remains green for `c357d957741f56835f27a1fc3a948dad43a91036`.
  - Coolify `/api/v1/deployments` now returns `0` visible rows.
  - Soar app resources remain visible with `server_status=true`; PostgreSQL/Redis remain `running:healthy`.
- Mutation decision:
  - No Coolify queue cleanup, restart, redeploy, rollback, env edit, DB/Redis action, or source push was performed because the approved queue-remediation target disappeared before mutation.
- Final disposition:
  - [LUC-3515](/LUC/issues/LUC-3515) can close `done` for deploy-health queue sweep evidence.
  - Protected worker readiness/authenticated acceptance and release-grade build provenance stay as separate release gates.

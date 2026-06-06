# Task

## Header
- ID: LUC-2223
- Title: [Ops][Soar] Reconcile Coolify resource inventory
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none
- Priority: P0
- Module Confidence Rows: deployment/Coolify resource inventory
- Requirement Rows: release/deploy resource-by-resource verification scope
- Quality Scenario Rows: operations reliability, deployment readiness
- Risk Rows: production mutation gate, secret disclosure, stale Coolify inventory
- Iteration: 2026-06-06 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2223-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented by scoped readback,
      proof capture, validation, review, source-truth sync, and closure.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is bounded DRE/Ops execution.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` requirement was satisfied through
      AGENTS startup scope and relevant ops source-of-truth reads for this
      narrow heartbeat.
- [x] `.agents/core/mission-control.md` requirement was satisfied through the
      active mission and next-step state reads for this narrow heartbeat.
- [x] Missing or template-like state tables were not in scope.
- [x] Affected module confidence row was identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by closing the exact resource
      inventory blocker for downstream deploy verification.

## Mission Block
- Mission objective: reconcile [LUC-2223](/LUC/issues/LUC-2223) with fresh
  read-only Coolify resource inventory evidence.
- Release objective advanced: Soar production deploy confidence.
- Included slices: Paperclip context readback, Coolify names-only binding scan,
  authenticated read-only project/environment/resource projection, focused ops
  env-check test, evidence artifact, ops source-truth sync, Paperclip closure.
- Explicit exclusions: push, deploy, restart, rollback, env edit, database
  action, Redis action, team/account mutation, protected smoke, live trading,
  secret value or raw resource id disclosure.
- Checkpoint cadence: single heartbeat.
- Stop conditions: inventory readback succeeds and is recorded, or exact
  blocker is named.
- Handoff expectation: downstream [LUC-2513](/LUC/issues/LUC-2513) may consume
  this as inventory proof; protected smoke/deploy gates remain separate.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DRE/Ops | 09 DRE | `docs/operations/coolify-vps-deployment-contract.md`; `docs/operations/service-topology.md` | Coolify read-only resource evidence | Redacted inventory proof | Read-only Coolify projection and env-check test | DONE |
| Documentation/Memory | 09 DRE | `.codex/context/TASK_BOARD.md`; `.agents/state/*` | Task/evidence/source-truth updates | Durable project memory | File review and issue closure | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed for this issue.
- [x] Responsibility stayed inside DRE/Ops.
- [x] No two write lanes were used.
- [x] Expected output and proof are recorded.
- [x] Missing ownership was not found.

## Context

[LUC-2223](/LUC/issues/LUC-2223) was stale `in_progress` and critical. The
latest longevity-doctor comment assigned it to DRE for read-only Coolify
resource inventory reconciliation. It blocks [LUC-2513](/LUC/issues/LUC-2513),
so a narrative-only update would leave the board without a valid disposition.

## Goal

Verify the Soar production Coolify resource inventory through the canonical
`project -> production environment -> resources` hierarchy and close the issue
with redacted evidence.

## Success Signal
- User or operator problem: deploy verification must target every Soar
  production resource, not a legacy single app id.
- Expected product or reliability outcome: downstream deploy/status work has a
  current eight-resource target list.
- How success will be observed: [LUC-2223](/LUC/issues/LUC-2223) is `done` with
  evidence and no mutation.
- Post-launch learning needed: no.

## Deliverable For This Stage

Verification evidence and source-of-truth sync for read-only Coolify inventory.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within read-only verification

## Definition of Done
- [x] Fresh read-only Coolify projection resolves Soar production inventory.
- [x] Evidence excludes secrets, raw IDs, URLs, labels, and protected bodies.
- [x] Relevant ops source truth and Paperclip status are updated.

## Stage Exit Criteria
- [x] Output matches `verification`.
- [x] No later-stage production mutation was mixed in.
- [x] Risks and assumptions are stated.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- push, deploy, restart, rollback, environment edits, database/Redis actions,
  protected smoke, secret disclosure, raw resource id storage, or live trading

## Validation Evidence
- Tests: `pnpm run ops:coolify-stack:env-check:test` -> PASS (`8/8`).
- Manual checks: authenticated read-only Coolify projection at
  `2026-06-06T18:25:12Z` resolved project `Soar`, environment `production`,
  selector `LuckySparrow`, six applications, PostgreSQL, Redis, zero generic
  services, eight production-environment resources, and 17 visible global
  resource rows.
- Screenshots/logs: none; screenshots were unnecessary and avoided for secret
  safety.
- High-risk checks: no mutation and no secret/raw resource id disclosure.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: deployment/Coolify inventory.
- Requirements matrix updated: not applicable for this narrow disposition.
- Requirement rows closed or changed: none.
- Quality scenarios updated: not applicable.
- Quality scenario rows closed or changed: none.
- Risk register updated: not applicable; existing release risk remains.
- Risk rows closed or changed: none.
- Reality status: verified.

## Architecture Evidence (required for architecture-impacting tasks)

No architecture change. Affected operational entity:
Coolify Soar project -> production environment -> resources.

## Result Report

Fresh read-only inventory verified the canonical eight-resource Soar production
environment:

- `soar-web`
- `soar-api`
- `workers-backtest`
- `workers-execution`
- `workers-market-data`
- `workers-market-stream`
- `postgresql`
- `redis`

Application inventory status remains `running:unknown`; PostgreSQL and Redis
report `running:healthy`. This is topology/status evidence only, not protected
worker readiness or deploy mutation permission.

Files changed:

- `history/evidence/luc-2223-coolify-resource-inventory-reconciliation-2026-06-06.md`
- `history/tasks/luc-2223-coolify-resource-inventory-reconciliation-2026-06-06-task.md`
- `.agents/state/active-mission.md`
- `.agents/state/next-steps.md`
- `.agents/state/module-confidence-ledger.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/operations/coolify-vps-deployment-contract.md`
- `docs/operations/service-topology.md`

Commit SHA: not committed; pre-existing dirty worktree contains unrelated
source, docs, and evidence changes.

Push status: not pushed.

Deploy impact: none.

Residual risk: protected worker readiness, SLO/rollback proof, authenticated
smoke, and deploy/post-deploy checks remain separate gates.

# V1 Production Activation and Evidence Plan (2026-04-22)

Status: Closed 2026-04-22  
Wave: `V1FACT-A`

## Objective

Turn the hardened V1 codebase into an operator-ready, evidence-backed release
candidate that can be activated without hidden operational gaps.

## Why This Wave Exists

The code/runtime side is now materially hardened through `TRUTH-A`, `XLIFE-A`,
`REVIEW-B`, `REVIEW-C`, `REVIEW-D`, and `SAFEV1-A`, but V1 still needs one
explicit activation wave that proves:

1. release gates are truthful and fresh,
2. stage/prod environment and worker expectations are explicit,
3. backup/restore and rollback evidence are current and reviewable,
4. the final go-live packet is reproducible by future agents and operators.

## Governing Sources

- `docs/architecture/reference/v1-production-activation-contract.md`
- `docs/operations/v1-release-gate-runbook.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/coolify-linux-vps-setup-guide.md`

## Task Packets

### V1FACT-01 docs(contract): freeze V1 production activation scope and evidence rules

Reason:

- the last major gap is operational truth, so activation rules must be explicit
  before any rehearsal or sign-off work starts

Primary files:

- `docs/architecture/reference/v1-production-activation-contract.md`
- this plan
- canonical queue/context files

Acceptance:

- the activation wave is explicitly limited to release/evidence/ops truth
- required evidence families are frozen
- non-goals are explicit

Validation:

- docs sanity review

### V1FACT-02 audit(ops): inventory current release-gate inputs, artifact freshness, and missing operator evidence

Reason:

- the executor needs one canonical freshness map instead of checking many docs
  ad hoc

Primary files:

- `docs/operations/v1-release-gate-runbook.md`
- `docs/operations/post-deploy-smoke-checklist.md`
- `docs/operations/deployment-rollback-playbook.md`
- `docs/operations/coolify-linux-vps-setup-guide.md`
- `docs/operations/` latest gate/evidence artifacts

Acceptance:

- one audit doc lists which evidence is fresh, stale, missing, or
  environment-specific
- stage and prod evidence are not conflated
- required follow-up commands are concrete

Validation:

- docs and artifact sanity review

### V1FACT-03 docs(queue): split V1 activation into stage rehearsal, prod evidence, and sign-off closure groups

Reason:

- future executors should be able to take one tiny activation slice at a time
  without reconstructing the overall release path

Primary files:

- this plan
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

Acceptance:

- grouped execution slices are explicit and ordered
- the first active slice is stage/env truth, not broad “go live”

Validation:

- queue/context parity check

### V1FACT-04 test(ops-red): lock release activation against stale or missing evidence inputs

Reason:

- the release gate should fail from missing or stale evidence, not only from
  direct command failures

Primary files:

- `scripts/runV1ReleaseGate.mjs`
- tests around release gate helpers if needed

Must validate:

- missing critical artifact families keep the gate `not_ready`
- stale evidence cannot be reported as pass
- local dry-run still remains available as non-prod signal where intentional

Validation:

- focused release-gate test pack

### V1FACT-05 refactor(ops-gate): make release gate freshness and evidence classification explicit

Reason:

- the gate is only trustworthy if it encodes freshness and environment truth

Primary files:

- `scripts/runV1ReleaseGate.mjs`
- touched ops helpers in `scripts/`

Acceptance:

- gate output distinguishes fresh, stale, missing, and skipped evidence
- stage and prod scope are explicit in operator-facing output
- no touched path silently upgrades local or stage checks into prod readiness

Validation:

- focused release-gate pack
- `pnpm run quality:guardrails`

### V1FACT-06 chore(ops-stage): script or normalize one canonical stage rehearsal path for V1

Reason:

- stage rehearsal should be reproducible and not depend on operator memory

Primary files:

- `scripts/` release or smoke helpers
- `docs/operations/v1-release-gate-runbook.md`
- `docs/operations/post-deploy-smoke-checklist.md`

Acceptance:

- one explicit stage rehearsal path exists
- required inputs and outputs are documented
- worker/readiness/smoke expectations are part of the same flow

Validation:

- dry-run or focused stage rehearsal command pack

### V1FACT-07 qa(stage): execute and capture stage rehearsal evidence for web, api, workers, and release gate

Reason:

- stage needs a fresh evidence pack, not only a documented command

Stage preflight:

- verify canonical domain mapping before execution:
  - API: `https://stage-api.soar.luckysparrow.ch`
  - Web: `https://stage.soar.luckysparrow.ch`
- confirm the candidate SHA is already deployed on stage
- confirm one working OPS auth path exists (`auth-token`, login, or private-route auth)
- confirm workers are expected to answer `/workers/health` and `/workers/runtime-freshness`

Acceptance:

- fresh stage evidence is published under `docs/operations/`
- results explicitly cover web, api, worker health, release gate, and smoke
- blockers remain explicit if anything is unavailable

Validation:

- stage rehearsal command(s)
- `pnpm run ops:release:v1:gate` with appropriate non-prod flags as needed

### V1FACT-07B fix(api-runtime-freshness): align inline runtime freshness with worker-ready truth before stage closure

Reason:

- the first authenticated stage rehearsal proved that auth and protected
  endpoint access can be established, but it also exposed a false negative in
  `/workers/runtime-freshness`: `inline` mode with no active runtime demand
  still fails on missing worker and market-data timestamps even while
  `/workers/health`, `/workers/ready`, and `/alerts` are green

Primary files:

- `apps/api/src/observability/runtimeFreshness.ts`
- `apps/api/src/router/workers-runtime-freshness.test.ts`
- stage rehearsal evidence docs and queue/context files

Acceptance:

- `inline` mode with no active runtime sessions and no market-data demand no
  longer blocks readiness on missing worker-env timestamps alone
- the false negative is locked by focused regression coverage
- authenticated stage rehearsal can be rerun against the corrected contract

Validation:

- `pnpm --filter api exec vitest run src/router/workers-runtime-freshness.test.ts`
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- `pnpm run quality:guardrails`
- authenticated stage runtime-freshness probe

### V1FACT-08 test(ops-red): lock prod activation against incomplete rollback or backup proof

Reason:

- backup/restore and rollback are part of V1 truth, not optional paperwork

Primary files:

- release gate helpers
- rollback or backup evidence helpers/scripts

Must validate:

- prod activation cannot report ready without current rollback and backup proof
- stale rollback or backup artifacts are visible as blockers

Validation:

- focused ops evidence test pack

### V1FACT-09 refactor(ops-proof): make backup/restore and rollback evidence first-class gate inputs

Reason:

- operators need one canonical place where these proofs are evaluated

Primary files:

- `scripts/runV1ReleaseGate.mjs`
- touched evidence helpers in `scripts/`
- `docs/operations/deployment-rollback-playbook.md`

Acceptance:

- rollback and backup evidence are explicit gate inputs
- operator-facing output points to concrete artifacts
- missing proof remains fail-closed

Validation:

- focused ops evidence pack
- `pnpm run quality:guardrails`

Execution note (2026-04-22):

- `scripts/runRollbackProofEvidence.mjs` is the canonical rollback-proof wrapper
  over `ops:deploy:rollback-guard`
- `pnpm run ops:db:restore-drill:prod` and
  `pnpm run ops:deploy:rollback-proof:prod` are the canonical prod proof
  commands
- `scripts/runV1ReleaseGate.mjs` must classify both proof families as required
  prod evidence and stay fail-closed when they are stale or missing

### V1FACT-10 qa(prod-pack): build final prod activation evidence pack and sign-off summary

Reason:

- V1 needs one final human-reviewable activation packet

Acceptance:

- final prod activation pack is published in `docs/operations/`
- links to release gate, readiness, backup, rollback, and smoke evidence are
  consolidated
- residual blockers, if any, are explicit and categorized

Validation:

- focused V1 activation pack
- `pnpm --filter api run typecheck`
- `pnpm --filter api run build`
- `pnpm run quality:guardrails`

### V1FACT-11 docs(sync): close wave, sync canonical queue/context, and freeze future-agent activation rules

Reason:

- activation truth has to survive future executor turnover

Acceptance:

- closure evidence exists
- queue/context/planning docs are synchronized
- future-agent notes tell executors not to bypass evidence freshness

Validation:

- canonical docs parity review

## Execution Order

1. `V1FACT-01`
2. `V1FACT-02`
3. `V1FACT-03`
4. `V1FACT-04`
5. `V1FACT-05`
6. `V1FACT-06`
7. `V1FACT-07`
8. `V1FACT-07B`
9. `V1FACT-08`
10. `V1FACT-09`
11. `V1FACT-10`
12. `V1FACT-11`

## Grouped Delivery

- `V1FACT-A1` (`V1FACT-01..V1FACT-03`): contract + audit + queue truth
- `V1FACT-A2` (`V1FACT-04..V1FACT-07`): release-gate freshness + stage rehearsal evidence
- `V1FACT-A2B` (`V1FACT-07B`): inline runtime-freshness truth after authenticated stage rehearsal
- `V1FACT-A3` (`V1FACT-08..V1FACT-09`): rollback/backup proof as first-class gate inputs
- `V1FACT-A4` (`V1FACT-10..V1FACT-11`): final activation pack + closure sync

## Non-Goals

- no V2 foundation work,
- no feature expansion,
- no exchange rollout beyond existing V1 scope,
- no unrelated refactors in runtime or UI modules.

## Progress Log

- 2026-04-22: Queued `V1FACT-A` after `REVIEW-D` closure to convert the now
  hardened V1 runtime into an evidence-backed production activation path.
  Scope is intentionally limited to release-gate truth, stage/prod evidence
  freshness, backup/restore and rollback proof, and final sign-off packaging.
- 2026-04-22: Closed `V1FACT-01..V1FACT-03` by freezing the activation
  contract, publishing the evidence-freshness audit in
  `docs/operations/v1-production-activation-evidence-audit-2026-04-22.md`, and
  splitting the remaining wave into explicit stage-rehearsal, rollback-proof,
  and final sign-off groups. Follow-up focus is now `V1FACT-A2`.
- 2026-04-22: Closed `V1FACT-04..V1FACT-07` by hardening
  `scripts/runV1ReleaseGate.mjs` with explicit evidence freshness
  classification and stage/prod scope semantics, fixing deploy-smoke target
  passthrough so API and web URLs stay explicit, adding one canonical stage
  rehearsal entrypoint in `scripts/runV1StageRehearsal.mjs`, and publishing
  fresh `2026-04-22` stage rehearsal artifacts
  (`docs/operations/v1-release-gate-stage-2026-04-22T17-53-09-987Z.md`,
  `docs/operations/v1-stage-rehearsal-2026-04-22T17-53-09-987Z.md`) with
  blockers kept explicit because only local dry-run evidence was available in
  this environment. Follow-up focus is now `V1FACT-A3`.
- 2026-04-22: Real authenticated stage rehearsal later became possible after
  switching Coolify to `Root Team`, creating a dedicated stage OPS admin, and
  allowing the current operator IP for protected endpoints. That first real
  run exposed an inline-mode runtime-freshness false negative while
  `/workers/health`, `/workers/ready`, and `/alerts` stayed green.
- 2026-04-22: Closed `V1FACT-07B` by aligning inline runtime-freshness truth,
  deploying SHA `49ea8e0c`, and rerunning authenticated stage rehearsal to
  PASS with fresh artifacts
  `docs/operations/v1-release-gate-stage-2026-04-22T19-15-59-493Z.md` and
  `docs/operations/v1-stage-rehearsal-2026-04-22T19-15-59-493Z.md`. Follow-up
  focus is now `V1FACT-A3`.
- 2026-04-22: Closed `V1FACT-08..V1FACT-10` by making prod backup/restore and
  rollback proof explicit release-gate evidence families, adding canonical
  rollback-proof commands, refreshing RC status/sign-off/checklist truth for
  the current day, and publishing the consolidated activation packet in
  `docs/operations/v1-production-activation-pack-2026-04-22.md`. Residual
  blockers are now explicit: missing prod restore-drill proof, missing prod
  rollback-proof pack, open RC Gate 2, and missing named human approvers.
- 2026-04-22: Closed `V1FACT-11` by publishing
  `docs/operations/v1-production-activation-closure-2026-04-22.md`, syncing
  queue/context/project state to `CLOSED_WITH_OPERATOR_BLOCKERS`, and freezing
  future-agent rules so stage success, public prod smoke, or fresh docs alone
  can never be treated as final production activation.

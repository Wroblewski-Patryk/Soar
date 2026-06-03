# Task

## Header
- ID: LUC-1765
- Title: Bind LIVEIMPORT_READBACK read-only production principal
- Task Type: release
- Current Stage: verification
- Status: BLOCKED
- Owner: Security
- Depends on: [LUC-1768](/LUC/issues/LUC-1768)
- Priority: P0
- Module Confidence Rows: AUD-19 operations/release protected evidence
- Requirement Rows: ARB-006 LIVEIMPORT_READBACK protected evidence
- Quality Scenario Rows: secret handling, production account safety, release/deploy gate
- Risk Rows: protected input absence, secret exposure, live-trading mutation
- Iteration: 2026-06-03 ARB-006 protected evidence
- Operation Mode: BUILDER
- Mission ID: LUC-1765-LIVEIMPORT-READBACK-PRINCIPAL-BINDING-2026-06-03
- Mission Status: BLOCKED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented for this bounded security gate.
- [x] Exactly one priority task is selected.
- [x] The task is aligned with repository source-of-truth documents.
- [x] Affected module confidence rows were identified.
- [x] The task improves release confidence by preserving a fail-closed protected evidence gate.

## Mission Block
- Mission objective: bind or route binding of an approved read-only production app principal/session for the existing `LIVEIMPORT_READBACK` collector.
- Release objective advanced: ARB-006 protected production evidence for current production SHA `6839cd6b8884e26eca735ce32cea98c1dadccfbe`.
- Included slices: scoped wake handling, Paperclip issue context readback, names-only env readiness check, Paperclip secret permission check, board-capable blocker creation.
- Explicit exclusions: deploy, restart, rollback, DB write, account mutation, exchange mutation, order placement, protected payload capture, secret value readback, live-trading action.
- Stop conditions: no required env names present and Security Review Lead lacks board-capable secret APIs.
- Handoff expectation: [LUC-1768](/LUC/issues/LUC-1768) is blocked on a board-capable secret owner; once encrypted refs are bound, [LUC-1765](/LUC/issues/LUC-1765) can unblock [LUC-1754](/LUC/issues/LUC-1754).

## Context
[LUC-1754](/LUC/issues/LUC-1754) failed closed because the current runner had no `LIVEIMPORT_READBACK_AUTH_TOKEN` and no `LIVEIMPORT_READBACK_AUTH_EMAIL` plus `LIVEIMPORT_READBACK_AUTH_PASSWORD`. [LUC-1765](/LUC/issues/LUC-1765) was created for Security/Ops to bind the approved read-only principal/session without exposing secret values.

## Goal
Provide a safe, least-privilege path for `LIVEIMPORT_READBACK` protected evidence without storing or printing secrets in repo, comments, artifacts, logs, screenshots, or plaintext agent config.

## Deliverable For This Stage
Classify the binding gate, create a board-capable child issue for secret/env binding, and block [LUC-1765](/LUC/issues/LUC-1765) with a first-class blocker.

## Constraints
- Use Paperclip encrypted secrets or another explicitly approved encrypted secret store only.
- Do not expose secret values.
- Do not mutate production application, database, account, exchange, or live-trading state.
- Do not replace the existing collector or create a bypass.

## Definition of Done
- [x] Current runner checked for required names without printing values.
- [x] Paperclip secret API permission boundary identified.
- [x] Board-capable child issue created with explicit acceptance and no-mutation boundary.
- [x] [LUC-1765](/LUC/issues/LUC-1765) moved to `blocked` with [LUC-1768](/LUC/issues/LUC-1768) as first-class blocker.

## Forbidden
- Raw secret values in repo, issue comments, artifacts, screenshots, logs, or plaintext config.
- Cookie/session export or protected response-body capture.
- Deploy, restart, rollback, DB write, account setting mutation, subscription/payment mutation, exchange/API-key mutation, order placement, or live-trading action.

## Validation Evidence
- Tests: not run; no code path changed.
- Manual checks:
  - `GET /api/issues/{LUC-1765}/heartbeat-context` -> issue read as critical, assigned, blocking [LUC-1754](/LUC/issues/LUC-1754).
  - Names-only env scan -> all `LIVEIMPORT_READBACK_*` auth/OPS names missing.
  - `GET /api/companies/{companyId}/agents` -> Security Review Lead and Integration Trading Engineer adapter env keys empty; no reusable env refs exposed.
  - Paperclip source check -> company secret list/create routes require board access.
  - `POST /api/companies/{companyId}/issues` -> created [LUC-1768](/LUC/issues/LUC-1768) for Portfolio Director.
  - `PATCH /api/issues/{LUC-1765}` -> status `blocked`, `blockedByIssueIds=[LUC-1768]`.
- High-risk checks: no secret values printed; no production or account mutation performed.
- Reality status: blocked.

## Architecture Evidence
- Affected entities: `SOAR-TOOL-V1-RELEASE-GATE`, `AUD-19`, existing `scripts/collectLiveImportReadbackEvidence.mjs`.
- Architecture change: none.

## Result Report
- Created [LUC-1768](/LUC/issues/LUC-1768) assigned to Portfolio Director for board-capable encrypted secret/env binding.
- Blocked [LUC-1765](/LUC/issues/LUC-1765) on [LUC-1768](/LUC/issues/LUC-1768).
- No code/runtime/deploy mutation was performed.
- Commit: not committed; repository already contains unrelated active ARB-006 dirty state and this is a blocker handoff.
- Push status: not needed.
- Deploy impact: none.
- Residual risk: [LUC-1754](/LUC/issues/LUC-1754) remains blocked until a board-capable secret owner completes [LUC-1768](/LUC/issues/LUC-1768) and Integration reruns protected evidence.

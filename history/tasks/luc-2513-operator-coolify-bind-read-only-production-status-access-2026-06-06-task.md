# Task

## Header
- ID: LUC-2513
- Title: Operator Coolify Bind Read-Only Production Status Access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: none for access binding; broader inventory reconciliation remains
  on [LUC-2223](/LUC/issues/LUC-2223)
- Priority: P0
- Module Confidence Rows: ops-config-pipeline / Coolify production status access
- Requirement Rows: production deploy confidence / read-only status evidence
- Quality Scenario Rows: deployment observability / release safety
- Risk Rows: protected ops credentials / production mutation safety
- Iteration: 2026-06-06 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2513
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are represented.
- [x] Exactly one scoped wake issue was handled.
- [x] Operation mode matches the DRE execution role.
- [x] Project and Paperclip safety contracts were reviewed.
- [x] The work stayed single-lane DRE/Ops.
- [x] The task improves release confidence by proving current Coolify
      read-only production status access.

## Mission Block
- Mission objective: verify that the current runner has read-only Coolify
  production status access for Soar without mutating production.
- Release objective advanced: Soar production deploy confidence.
- Included slices: latest comment acknowledgement, names-only binding scan,
  authenticated read-only Coolify projection, issue disposition.
- Explicit exclusions: deploy, restart, rollback, env edit, database/Redis
  mutation, team setting change, protected app smoke, live trading, secret
  value readback.
- Checkpoint cadence: single heartbeat closure.
- Stop conditions: missing required binding names, Coolify readback failure, or
  any mutation requirement.
- Handoff expectation: close [LUC-2513](/LUC/issues/LUC-2513) as verified for
  access binding; keep [LUC-2223](/LUC/issues/LUC-2223) as the broader
  inventory reconciliation lane.

## Context

[LUC-2513](/LUC/issues/LUC-2513) requested binding `COOLIFY_BASE_URL`,
`COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and preferably team selector
ids for read-only production status reconciliation. The latest comment routed
the issue to DRE and kept Security/Ops gates fail-closed.

## Goal

Verify whether the current runner can use approved read-only Coolify bindings
to inspect Soar production status, then record redacted evidence and close the
issue with a clear final disposition.

## Constraints
- Use existing Coolify deployment contract and evidence pattern.
- Do not introduce new deployment tooling.
- Do not print or store secret values.
- Do not mutate production.
- Do not claim protected app/worker/SLO readiness from Coolify inventory alone.

## Definition of Done
- [x] Required Coolify binding names are present without value disclosure.
- [x] Authenticated read-only Coolify API readback resolves Soar production
      hierarchy and redacted inventory.
- [x] Evidence packet written without secrets.
- [x] Paperclip issue updated with final disposition.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping
- push, deploy, restart, protected smoke, live-account mutation, or secret
  disclosure

## Validation Evidence
- Tests: not run; no product code changed.
- Manual checks: names-only binding scan PASS; authenticated read-only Coolify
  projection PASS at `2026-06-06T18:25:30Z`.
- Screenshots/logs: none stored; output summarized without secrets.
- High-risk checks: no token, secret value, raw resource id, internal URL, or
  protected response body stored.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  `docs/operations/coolify-vps-deployment-contract.md`.
- Fits approved architecture: yes; Coolify remains
  `project -> production environment -> resources`.
- Mismatch discovered: no.
- Decision required from user: no.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none by this heartbeat; existing approved bindings are
  present by name.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: not applicable; no mutation occurred.
- Observability or alerting impact: confirms read-only production status access
  remains available.

## Autonomous Loop Evidence

### 1. Analyze Current State
- [LUC-2513](/LUC/issues/LUC-2513) was blocked by
  [LUC-2223](/LUC/issues/LUC-2223) after WIP correction, but this heartbeat
  wake specifically required handling the access-binding issue.
- Required Coolify binding names were present in the runner.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2513](/LUC/issues/LUC-2513).
- Priority rationale: critical scoped wake and production deploy confidence
  prerequisite.

### 3. Plan Implementation
- Files or surfaces to modify: narrow task/evidence history and issue state.
- Logic: verify env names, run read-only API projection, record redacted
  status.

### 4. Execute Implementation
- Implementation notes: performed names-only binding scan and authenticated
  read-only Coolify API GETs.

### 5. Verify and Test
- Validation performed: Coolify projection against current selector,
  configured project, production environment, and resources.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave issue blocked behind
  [LUC-2223](/LUC/issues/LUC-2223) only.
- Decision: close the access-binding issue because the binding proof is now
  fresh; keep inventory/readiness work on the existing active lane.
- Technical debt introduced: no.

### 7. Update Documentation and Knowledge
- Docs updated: `history/evidence/luc-2513-coolify-read-only-production-status-access-2026-06-06.md`
  and this task packet.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Required responsibility lanes were integrated.

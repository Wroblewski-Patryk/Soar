# Task

## Header
- ID: V1-PROTECTED-EVIDENCE-COOLIFY-CONTEXT-2026-05-08
- Title: release: resolve protected V1 evidence context through Coolify access
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: pushed and deployed final preflight tooling
- Priority: P0
- Iteration: 48
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The current production deployment exposes the latest `main` SHA and public
API/Web smoke passes. The remaining V1 blockers are protected release evidence:
authenticated `LIVEIMPORT-03` runtime readback, production restore drill,
rollback proof, and Gate 4 RC approval. The user provided Coolify operator
access for deploy operations, so this task uses that approved path to discover
non-secret production context and run only existing safe evidence commands when
their required protected inputs are truly available.

## Goal
Use the approved Coolify/operator path to determine whether the remaining V1
protected evidence can be collected now, execute existing safe commands where
possible, and leave exact blockers where protected app auth, production DB
execution context, or RC approver identities are still missing.

## Scope
- Inspect existing release evidence scripts and final blocker pack.
- Verify deployed build-info and public smoke status.
- Inspect Coolify production resource context without storing secret values.
- Run existing read-only or isolated evidence commands only when their required
  protected inputs are available.
- Update planning/state documentation with the exact current status.

## Implementation Plan
1. Re-read the final blocker execution pack and evidence scripts.
2. Confirm current git state and deployed build-info.
3. Log in to Coolify using operator access and inspect resource metadata without
   writing secret values to repository artifacts.
4. Determine whether production restore drill can run through the existing
   Docker-based restore script against the actual production database context.
5. Determine whether protected app auth exists for live-import readback and
   rollback proof without reusing unrelated credentials against the app API.
6. Run `ops:release:v1:preflight` after any new evidence attempt.
7. Update source-of-truth docs with evidence, blockers, and next step.

## Acceptance Criteria
- Current deployed SHA is verified or a deploy wait blocker is recorded.
- Public API/Web smoke is verified or failure is recorded.
- No secret values are written to repository files.
- Existing evidence scripts are reused; no bypass or substitute evidence is
  introduced.
- The task records whether each remaining V1 blocker is executable now.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this release/evidence slice.
- [x] Current evidence status is reproducible from commands and docs.
- [x] Any remaining blocker is exact and tied to a required protected input.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Do not reuse Coolify credentials as Soar application credentials unless the
  user explicitly confirms they are valid for that target.
- Do not print or persist secret values.
- Do not create substitute release evidence from public health/build-info.
- Do not mark V1 ready while protected evidence remains missing or failed.
- Do not run destructive production actions.

## Validation Evidence
- Tests:
  - `pnpm run ops:deploy:wait-web-build-info -- --web-base-url https://soar.luckysparrow.ch --expected-sha e6e7d4a044ce80279c542412a91bae4a6a012392 --timeout-seconds 60 --interval-seconds 10` -> PASS.
  - `pnpm run ops:deploy:smoke -- --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers` -> PASS.
  - `pnpm run ops:release:v1:preflight -- --timeout-seconds 30 --interval-seconds 5 --json-output docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json --markdown-output docs/operations/v1-final-preflight-2026-05-08-protected-context.md` -> expected BLOCKED.
  - `pnpm run quality:guardrails` -> PASS.
  - `pnpm run docs:parity:check` -> PASS.
  - `git diff --check` -> PASS with line-ending warnings only.
- Manual checks:
  - Coolify login and Root Team switch through Livewire succeeded.
  - Production Soar project/environment pages are reachable in Coolify.
  - Production Postgres resource terminal page lists container
    `x11cfnz1dd9x0yzccftqzcoe`.
  - Local Docker does not expose that production container, so the existing
    Docker-based restore drill cannot be honestly run as production evidence
    from this workstation.
- Screenshots/logs:
  - No screenshots captured; command evidence is recorded in this task and the
    preflight report.
- High-risk checks:
  - No secret values were written to repository artifacts.
  - Coolify credentials were not reused against Soar application auth.
  - No destructive DB command, live-money action, or exchange write was run.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
  - `docs/operations/coolify-linux-vps-setup-guide.md`
  - `DEPLOYMENT_GATE.md`
  - `DEFINITION_OF_DONE.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: existing rollback proof path is reused only when auth is
  available.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Final V1 preflight blocks on protected auth, DB restore context,
  missing final evidence, and RC approval.
- Gaps: Need determine whether Coolify operator access supplies enough context
  to execute production restore evidence safely.
- Inconsistencies: none found at task start.
- Architecture constraints: final evidence must come from existing approved
  scripts and real production/protected paths.

### 2. Select One Priority Task
- Selected task: Resolve protected V1 evidence context through Coolify access.
- Priority rationale: This is the current boundary between deployed V1 code and
  final release readiness.
- Why other candidates were deferred: Local backend/Web implementation is not
  the active blocker after public deploy smoke passed.

### 3. Plan Implementation
- Files or surfaces to modify: planning/state docs only unless a script defect
  is discovered.
- Logic: no runtime logic changes planned.
- Edge cases: protected inputs may remain unavailable; failed-closed evidence is
  acceptable, fake PASS evidence is not.

### 4. Execute Implementation
- Implementation notes:
  - Added this task artifact.
  - Generated a no-secret V1 preflight JSON/Markdown status report after the
    current deploy was verified.
  - Recorded the Coolify-discovered production DB container name as context,
    not as completed restore evidence.

### 5. Verify and Test
- Validation performed:
  - Deployed web build-info for `e6e7d4a044ce80279c542412a91bae4a6a012392`.
  - Public API/Web smoke with worker checks disabled.
  - Final V1 preflight with JSON and Markdown outputs.
  - Repository guardrails.
  - Docs parity check.
  - Diff whitespace check.
- Result:
  - Build-info PASS.
  - Public smoke PASS.
  - Preflight BLOCKED on protected auth, production DB restore context envs,
    missing/failed protected release evidence, and RC approval.
  - Guardrails PASS.
  - Docs parity PASS.
  - Diff check PASS with line-ending warnings only.

### 6. Self-Review
- Simpler option considered: rerun preflight only, rejected because Coolify
  access may resolve production DB context.
- Technical debt introduced: no
- Scalability assessment: Uses existing operator/evidence paths.
- Refinements made:
  - Avoided running `ops:db:restore-drill:prod` locally with the remote
    container name because that would only create another false failed artifact
    from the wrong Docker daemon.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/operations/v1-final-preflight-2026-05-08-protected-context.md`
  - `docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
  - `docs/operations/v1-final-blocker-execution-pack-2026-05-07.md`
  - `docs/planning/mvp-next-commits.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/current-focus.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/system-health.md`
  - `.agents/state/next-steps.md`
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes for public smoke/build-info; blocked for
  protected readback.
- Endpoint and client contract match: yes for public smoke/build-info; blocked
  for protected readback.
- DB schema and migrations verified: blocked for production restore drill.
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: public readiness passed; protected worker
  checks remain gated by auth.
- Regression check performed: final preflight confirms fail-closed blockers.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: production secrets and protected runtime evidence
- Trust boundaries: local operator shell, Coolify dashboard, production API,
  production database container
- Permission or ownership checks: protected release scripts enforce auth where
  required.
- Abuse cases: accidental secret persistence, public-health substitute evidence,
  destructive DB operation
- Secret handling: secret values must stay out of repository artifacts.
- Security tests or scans:
  - Secret values were not persisted in generated reports.
  - Protected evidence commands remain blocked instead of accepting public
    substitutes.
- Fail-closed behavior: required for missing auth, missing DB context, no
  running runtime session, and failed rollback signals.
- Residual risk:
  - Final V1 remains NO-GO until protected app auth, production DB execution
    context, rollback proof auth, and real RC approver identities are supplied.

## Result Report

- Task summary: Resolved the current protected evidence boundary after the
  deployed preflight tooling. Coolify access confirms the production Postgres
  container name, but the existing restore drill cannot run from this local
  Docker daemon. Build-info and public smoke pass; final preflight remains
  correctly blocked.
- Files changed:
  - `docs/planning/v1-protected-evidence-coolify-context-task-2026-05-08.md`
  - `docs/operations/_artifacts-v1-final-preflight-2026-05-08-protected-context.json`
  - `docs/operations/v1-final-preflight-2026-05-08-protected-context.md`
  - source-of-truth state docs listed above
- How tested:
  - Build-info wait PASS.
  - Public deploy smoke PASS.
  - Final V1 preflight generated no-secret JSON/Markdown and exited BLOCKED
    for expected protected evidence blockers.
  - Repository guardrails PASS.
  - Docs parity PASS.
- What is incomplete:
  - `LIVEIMPORT-03`, production restore drill, rollback proof, and RC Gate 4
    approval remain incomplete.
- Next steps:
  - Provide Soar application/operator auth for readback and rollback proof.
  - Run production restore drill from a shell with access to the VPS Docker
    daemon or provide an approved remote execution path for the existing
    restore script contract.
  - Provide real RC approver names and owner contact.
- Decisions made:
  - Do not reuse Coolify credentials as Soar app credentials.
  - Do not run a local restore drill against a production-only container name.

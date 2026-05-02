# V1SEC-01 Prod-Only Dependency Hardening Task - 2026-05-02

## Header
- ID: V1SEC-01
- Title: fix(deps+ops): clear dependency audit and record V1 prod-only release scope
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Security + Ops/Release
- Priority: P0
- Iteration: 1
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The final V1 confidence sweep found a green local validation baseline but also
confirmed dependency-audit findings and release evidence drift. The operator
then clarified that V1 will be production-only for now because there is no
separate VPS capacity for a stage environment. Stage remains a V2 infrastructure
target instead of a V1 blocker.

## Goal
Clear the dependency vulnerability audit without runtime behavior changes and
sync V1 release planning so stage evidence is deferred to V2 while production
evidence and final signoff remain explicit V1 requirements.

## Scope
- `package.json`
- `apps/web/package.json`
- `pnpm-lock.yaml`
- `docs/operations/v1-final-go-no-go-closure-2026-05-02.md`
- `docs/planning/mvp-next-commits.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`

## Implementation Plan
1. Update vulnerable direct web dependencies.
2. Add package-manager overrides for vulnerable transitive toolchain packages.
3. Preserve runtime dependency classification for `next` and `axios`.
4. Re-run dependency audit and full validation gates.
5. Record the prod-only V1 release decision and remaining owner actions.

## Acceptance Criteria
- `pnpm audit` reports no known vulnerabilities.
- Full local validation stays green after dependency updates.
- V1 release docs no longer treat missing stage as a V1 blocker.
- Remaining V1 blockers are limited to production evidence and final signoff.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations were applied to the touched scope.
- [x] Security audit evidence is attached.
- [x] Relevant tests and build passed.
- [x] Source-of-truth docs were updated.
- [x] No workaround path or duplicate runtime logic was introduced.

## Validation Evidence
- `pnpm audit` => PASS, no known vulnerabilities.
- `pnpm run quality:guardrails` => PASS.
- `pnpm run lint` => PASS.
- `pnpm run typecheck` => PASS.
- `pnpm --filter web run test -- --run` => PASS, 139 files / 394 tests.
- `pnpm --filter api run test -- --run` => PASS.
- `pnpm run build` => PASS.
- `pnpm run docs:parity:check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: yes, historical V1 docs still assumed stage availability.
- Decision required from user: yes
- Approval reference if architecture changed: user confirmed stage is deferred
  to V2 until a dedicated VPS is available; current V1 release is prod-only.
- Follow-up architecture doc updates: production-only V1 scope is recorded in
  planning and project state; future stage/prod split remains a V2 target.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: release planning now scopes V1 to production evidence.
- Rollback note: dependency-only change can be reverted by reverting this commit.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: dependency audit reported high and moderate vulnerabilities.
- Gaps: final closure still listed stage as a V1 blocker.
- Inconsistencies: operator confirmed no stage environment exists for V1.
- Architecture constraints: no new systems, no hidden release bypass.

### 2. Select One Priority Task
- Selected task: dependency audit hardening and prod-only V1 release scope sync.
- Priority rationale: security audit blocks clean release confidence.
- Why other candidates were deferred: production signoff requires operator input.

### 3. Plan Implementation
- Files or surfaces to modify: package manifests, lockfile, planning/context docs.
- Logic: dependency-only updates and documentation truth sync.
- Edge cases: keep `next` and `axios` as production dependencies.

### 4. Execute Implementation
- Implementation notes: bumped direct web toolchain packages and added scoped
  `pnpm.overrides` for patched transitive packages.

### 5. Verify and Test
- Validation performed: audit, guardrails, lint, typecheck, full web/API tests,
  build, docs parity.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only fixing high vulnerabilities.
- Technical debt introduced: no.
- Scalability assessment: overrides are centralized and reversible.
- Refinements made: scoped `picomatch` overrides by major range and preserved
  runtime dependency classification.

### 7. Update Documentation and Knowledge
- Docs updated: this task, V1 closeout notes, planning queue, task board,
  project state.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: dependency metadata only
- Trust boundaries: package manager supply chain
- Permission or ownership checks: not applicable
- Abuse cases: vulnerable archive extraction, parser DoS, redirect/header leak,
  SSRF-related client dependency issues
- Secret handling: no secret changes
- Security tests or scans: `pnpm audit`
- Fail-closed behavior: no runtime behavior changed
- Residual risk: future dependency disclosures require repeat audit.

## Result Report
- Task summary: dependency audit is clean and V1 release scope is recorded as
  production-only with stage deferred to V2.
- Files changed: package manifests, lockfile, planning/context docs.
- How tested: audit, guardrails, lint, typecheck, full API/web tests, build,
  docs parity.
- What is incomplete: production restore drill and non-dry-run production
  evidence remain owner/release actions.
- 2026-05-02 update: Gate 4 signoff is now approved with Patryk Wroblewski as
  Engineering, Product, Operations, and RC owner.
- Next steps: run production release gate, post-deploy smoke, production
  restore evidence, then update final GO/NO-GO.
- Decisions made: stage is not a V1 blocker; it is a V2 infrastructure target.

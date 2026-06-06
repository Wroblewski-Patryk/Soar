# Task

## Header
- ID: LUC-2506
- Title: Restore authoritative Web build-info source provenance
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Ops/Release
- Depends on: LUC-2504
- Priority: P1
- Module Confidence Rows: SOAR-OPERATIONS-001
- Requirement Rows: not changed
- Quality Scenario Rows: deployment/release provenance
- Risk Rows: build-info source provenance ambiguity
- Iteration: 2026-06-06 DRE heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2506-WEB-BUILD-INFO-SOURCE-PROVENANCE-2026-06-06
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this DRE implementation heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through the active
      project instructions and relevant current state files.
- [x] `.agents/core/mission-control.md` was represented through active mission
      and next-step state.
- [x] Missing or template-like state tables were not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or
      marked not applicable.
- [x] The task improves release confidence by making deploy provenance fail
      closed.

## Mission Block
- Mission objective: make Web `/api/build-info` stop accepting GitHub branch
  head as deploy/source provenance.
- Release objective advanced: production deploy evidence can no longer pass by
  branch-head freshness alone after the next deployment.
- Included slices: metadata writer fallback, route fallback, deploy wait gate,
  focused tests, ops docs, state/evidence update.
- Explicit exclusions: production deploy, restart, rollback, env mutation,
  protected smoke, live trading.
- Checkpoint cadence: one bounded heartbeat.
- Stop conditions: architecture mismatch, validation failure, or need for
  production mutation approval.
- Handoff expectation: issue can close locally; future deploy lane must prove
  production readback after approved deployment.

## Context

[LUC-2504](/LUC/issues/LUC-2504) found public Web healthy but reported
`metadataSource=github-branch`, meaning the public SHA was useful freshness
evidence but not authoritative container-source provenance. This task hardens
the code and release tooling so branch-head fallback cannot satisfy deploy
provenance.

## Goal

Restore fail-closed Web build-info source provenance by removing GitHub branch
head fallback from generated metadata and runtime route behavior, and by
tightening deploy wait acceptance to authoritative build-time metadata sources.

## Success Signal
- User or operator problem: release gates must not confuse repository branch
  head with built image source.
- Expected product or reliability outcome: missing source metadata is reported
  as unknown instead of a misleading SHA.
- How success will be observed: focused tests pass and deploy wait rejects
  `github-branch*` metadata sources.
- Post-launch learning needed: yes, future deploy readback must confirm
  production reports `metadataSource=env`, `git`, or `git-files`.

## Deliverable For This Stage

Verified local code and documentation changes plus issue closure evidence.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- no production mutation without explicit approval

## Definition of Done
- [x] GitHub branch-head fallback removed from Web build metadata generation.
- [x] Runtime build-info route no longer performs branch-head lookup.
- [x] Deploy wait rejects historical `github-branch*` provenance by default.
- [x] Focused regression tests and Web typecheck pass.
- [x] Ops docs and project state are updated.

## Validation Evidence
- Tests:
  - `node --test scripts/writeWebBuildMetadata.test.mjs` -> PASS (`2/2`).
  - `node --test scripts/waitForWebBuildInfo.test.mjs` -> PASS (`4/4`).
  - `node --test scripts/releaseOpsScriptContracts.test.mjs scripts/writeWebBuildMetadata.test.mjs scripts/waitForWebBuildInfo.test.mjs` -> PASS (`8/8`).
- Manual checks:
  - `node --check` passed for touched scripts/tests.
  - `pnpm --filter web run typecheck` -> PASS.
  - `pnpm run quality:guardrails` -> PASS.
- Screenshots/logs: not applicable.
- High-risk checks: no secrets or production mutation.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: `SOAR-OPERATIONS-001`.
- Requirements matrix updated: not applicable.
- Quality scenarios updated: not applicable.
- Risk register updated: not applicable.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: operations deployment docs and existing graph
  relation for `apps/web/src/app/api/build-info/route.ts`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Follow-up architecture doc updates: ops docs updated; generated architecture
  graph refresh deferred because this task touched an already-mapped route and
  existing guardrails passed.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none. Future deploys must provide `SOURCE_COMMIT` or
  equivalent build metadata.
- Health-check impact: build-info provenance becomes fail-closed.
- Smoke steps updated: post-deploy smoke checklist and readiness gates updated.
- Rollback note: no runtime deploy occurred; if a future deploy fails due to
  missing metadata, restore the expected `SOURCE_COMMIT` build arg/env binding
  rather than reintroducing branch fallback.
- Observability or alerting impact: deploy wait now reports unaccepted
  `metadataSource=github-branch`.
- Staged rollout or feature flag: existing `--allow-runtime-fallback` remains
  diagnostics-only for the wait script.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: build-info could report GitHub branch head as generated metadata.
- Gaps: deploy provenance could pass without image-source metadata.
- Inconsistencies: docs listed GitHub branch readback as part of the metadata
  source chain.
- Architecture constraints: release proof must be fail-closed and source-backed.

### 2. Select One Priority Mission Objective
- Selected task: [LUC-2506](/LUC/issues/LUC-2506).
- Priority rationale: it directly closes the provenance caveat from
  [LUC-2504](/LUC/issues/LUC-2504).
- Why other candidates were deferred: protected release proof remains separate
  and blocked by approved-input lanes.

### 3. Plan Implementation
- Files or surfaces to modify: build metadata writer, route fallback, wait
  script, tests, ops docs, state/evidence.
- Logic: authoritative metadata only; unknown when absent.
- Edge cases: no env/no git build context, runtime-only env, historical
  branch fallback payloads.

### 4. Execute Implementation
- Implementation notes: removed network branch fallback and added regression
  tests for env metadata and absent metadata.

### 5. Verify and Test
- Validation performed: focused script tests, Web typecheck, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only changing the wait script. Rejected because
  public build-info would still publish misleading branch-head SHA.
- Technical debt introduced: no.
- Scalability assessment: low-maintenance; uses existing metadata file path and
  gate script.
- Refinements made: docs now state `github-branch*` is diagnostic only.

### 7. Update Documentation and Knowledge
- Docs updated: operations setup guide, post-deploy smoke checklist, deployment
  readiness gates.
- Context updated: active mission, next steps, project state, task board,
  module confidence, system health.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated.

## Result Report

- Task summary: Web build-info no longer derives deploy provenance from GitHub
  branch head; deploy wait rejects `github-branch*` by default.
- Files changed: see
  `history/evidence/luc-2506-web-build-info-source-provenance-2026-06-06.md`.
- How tested: focused Node tests, Web typecheck, repository guardrails.
- What is incomplete: production has not been redeployed with this code.
- Next steps: future Ops deploy lane waits for `/api/build-info` to report the
  approved SHA with `metadataSource=env`, `git`, or `git-files`.
- Decisions made: branch-head metadata is diagnostic only, not release-gate
  provenance.

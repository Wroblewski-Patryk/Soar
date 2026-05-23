# Task

## Header
- ID: POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14
- Title: Harden common crypto icon fallback model
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: `POSTV1-OPERATOR-FEEDBACK-INTAKE-2026-05-14`
- Priority: P1
- Module Confidence Rows: `SOAR-UX-A11Y-MOBILE-001`
- Requirement Rows: `REQ-FUNC-026`
- Quality Scenario Rows: `QA-023`
- Risk Rows: `RISK-026`
- Iteration: 2026-05-14 post-V1 continuation
- Operation Mode: BUILDER
- Mission ID: `POSTV1-CRYPTO-ICON-CONSISTENCY-2026-05-14`
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the selected continuation slice.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was previously reviewed in this post-V1 continuation session.
- [x] `.agents/core/mission-control.md` was previously reviewed in this post-V1 continuation session.
- [x] Missing or template-like state tables were not found for this slice.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified.
- [x] The task improves release confidence by turning a repeated icon fallback symptom into a covered resolver contract.

## Mission Block
- Mission objective: prevent common trading assets from degrading to generic icon placeholders when CoinGecko is unavailable or ambiguous.
- Release objective advanced: post-V1 operator polish and dashboard symbol trust.
- Included slices: API icon catalog model, fallback e2e coverage, source-of-truth updates.
- Explicit exclusions: no UI redesign, no production deploy, no live trading, no exchange mutation.
- Checkpoint cadence: finish implementation plus focused verification in one bounded slice.
- Stop conditions: architecture mismatch, failing focused e2e after one fix pass, or unknown icon source policy.
- Handoff expectation: record exact coverage and remaining risk.

## Context
The icon resolver already followed the canonical `CoinGecko -> curated -> placeholder` chain, but the curated and CoinGecko hint maps were separate and covered only a small subset of assets. User feedback identified `TRX` as a symptom of a broader repeated model problem, not a one-off coin bug.

## Goal
Make the repeated fallback model deterministic for a basket of common trading assets instead of patching one symbol at a time.

## Scope
- `apps/api/src/modules/icons/icons.service.ts`
- `apps/api/src/modules/icons/icons.e2e.test.ts`
- `docs/modules/api-icons.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/quality-attribute-scenarios.md`
- `.agents/state/risk-register.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/next-steps.md`

## Implementation Plan
1. Replace separate icon URL and CoinGecko hint maps with one curated asset catalog.
2. Add common trading assets with verified local icon slugs where the shared icon pack has a valid file.
3. Add an API e2e regression that forces CoinGecko `503` for the whole basket and asserts curated icons, not placeholders.
4. Run focused API tests and then broader quality gates.
5. Update source-of-truth docs and state ledgers.

## Acceptance Criteria
- Common basket symbols resolve to `source: curated`, `placeholder: false`, and an asset-specific icon URL when CoinGecko is unavailable.
- Unknown symbols still resolve to the deterministic inline placeholder.
- Existing CoinGecko metadata and cache behavior remain covered.
- No production deploy or live exchange mutation is performed.

## Definition of Done
- [x] Code implements the catalog-level fix without adding a parallel resolver.
- [x] Focused icon API e2e test passes.
- [x] Requirement, quality, risk, and project context docs are updated.
- [x] Broader quality gates pass before commit.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/icons/icons.e2e.test.ts --run` PASS (`6/6`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run lint` PASS.
  - `pnpm run build` PASS.
  - `pnpm run quality:guardrails` PASS.
- Manual checks:
  - Verified local icon-pack HEAD responses for the curated added slugs before adding them.
- Screenshots/logs: not applicable; backend resolver contract slice.
- High-risk checks: no secrets, production mutation, live order/cancel/close, or exchange-side mutation.
- Module confidence ledger updated: not changed; existing UX/A11y row remains verified and this slice is covered by requirement/risk rows.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: `REQ-FUNC-026`.
- Quality scenarios updated: yes.
- Quality scenario rows closed or changed: `QA-023`.
- Risk register updated: yes.
- Risk rows closed or changed: `RISK-026`.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/coin-icon-source-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none; implementation remains within the existing contract.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not needed.
- Rollback note: revert the catalog/test commit; resolver falls back to prior smaller curated set.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: common assets outside the small curated map could become generic placeholders when CoinGecko was unavailable.
- Gaps: no basket-level regression for popular symbols.
- Inconsistencies: CoinGecko ID hints and curated URLs were maintained separately.
- Architecture constraints: preserve `CoinGecko -> curated -> placeholder`.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: icon resolver/tests, icon architecture contract, API icon module docs, market seed symbols.
- Rows created or corrected: `REQ-FUNC-026`, `QA-023`, `RISK-026`.
- Assumptions recorded: only assets with a verified local icon slug were added to the curated fallback catalog.
- Blocking unknowns: none.
- Why it was safe to continue: the change stays inside the existing resolver and does not touch trading/data mutation paths.

### 2. Select One Priority Mission Objective
- Selected task: crypto icon consistency.
- Priority rationale: user-visible repeated polish defect with low blast radius and clear e2e proof.
- Why other candidates were deferred: dashboard layout and strategy history tasks are broader and less surgical.

### 3. Plan Implementation
- Files or surfaces to modify: API icon resolver, API e2e test, source-of-truth docs.
- Logic: derive icon URLs and CoinGecko hints from one curated catalog.
- Edge cases: upstream `503`, unknown symbol placeholder, cache behavior.

### 4. Execute Implementation
- Implementation notes: added a shared `CURATED_ASSET_ICON_CATALOG` for common assets and generated both maps from it.

### 5. Verify and Test
- Validation performed: focused icon e2e, API typecheck, lint, build, repository guardrails, diff whitespace check, and touched-file credential scan.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: adding only `TRX`.
- Technical debt introduced: no.
- Scalability assessment: future common assets now need one catalog entry instead of two coordinated map edits.
- Refinements made: increased timeout only for the basket test because resolver rate pacing is part of the real contract.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-icons.md`, this task file.
- Context updated: project state, task board, next steps, requirements, quality, risk.
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
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal update was not required.

## Result Report
- Task summary: hardened common crypto icon fallback by replacing split maps with a single curated asset catalog and proving the basket does not degrade to generic placeholders on CoinGecko outage.
- Files changed: API icon resolver/test plus source-of-truth docs/state.
- How tested: focused API icon e2e pass (`6/6`), API typecheck PASS, lint PASS, build PASS, guardrails PASS, `git diff --check` PASS with line-ending warnings only, touched-file credential scan PASS.
- What is incomplete: no production deploy in this slice.
- Next steps: commit and push.
- Decisions made: only add curated assets whose local icon-pack URL was manually verified before inclusion.

# Task

## Header
- ID: LUC-1796
- Title: [Soar][QA] Execute exact-candidate v1.0 sale-readiness acceptance rerun for `ca712e98`
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LUC-1791, LUC-1792, LUC-1793
- Priority: P1
- Module Confidence Rows: not updated in this lane
- Requirement Rows: SRG-002, SRG-003
- Quality Scenario Rows: reliability, supportability, security fail-closed
- Risk Rows: release overclaim, protected-proof principal drift
- Iteration: 2026-07-23
- Operation Mode: TESTER
- Mission ID: LUC-1796-SRG-002-RERUN
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed.
- [x] `.agents/core/mission-control.md` was reviewed for long-running work.
- [x] Missing or template-like state tables were bootstrapped from repository sources, or confirmed not needed.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement, quality scenario, and risk rows were identified or marked not applicable.
- [x] The task or mission improves release confidence, not only local code appearance.

## Mission Block
- Mission objective: execute the exact-candidate sale-readiness acceptance rerun for deployed production candidate `ca712e98b70e157b643db4f57726a02821a140bc`.
- Release objective advanced: close `SRG-002` or name the first failing exact-candidate gate with evidence.
- Included slices: public smoke, Web build-info readback, protected admin readback, worker identity/freshness, auth baseline, UI baseline, one approved paper-safe write path, security fail-closed baseline, supportability references, state/doc sync.
- Explicit exclusions: owner acceptance, pushes, deploys, restarts, env changes, LIVE trading proof.
- Checkpoint cadence: proof bundle first, then source-of-truth sync and issue closeout.
- Stop conditions: exact-candidate SHA mismatch, degraded public/protected readiness, unsafe production mutation, or missing approved auth path.
- Handoff expectation: PM/parent lane receives a precise `SRG-002` disposition and residual `SRG-003` blocker.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Active chat | `AGENTS.md`, current issue | `history/`, state files, issue closeout | Integrated QA verdict | Parent acceptance gate | DONE |
| Product/Requirements | Coordinator | `docs/planning/soar-v1-sale-readiness-contract.md`, gap register | contract/gap wording | Updated gate truth | Evidence packet readback | DONE |
| Architecture | Coordinator | no architecture delta | none | none | not applicable | OMITTED |
| Implementation | none | verification-only lane | none | none | not applicable | OMITTED |
| QA/Test | QA/Test | `history/evidence/luc-1793-...matrix...md` | artifacts, evidence packet | Exact rerun proof bundle | Smoke/auth/UI/fixture/security commands | DONE |
| Security/Ops/UX | Reused existing approved helpers | `LUC-1792`, ops runbooks | artifact outputs only | Protected/admin, security, browser, rollback references | Read-only/admin-smoke + fail-closed proof | DONE |
| Documentation/Memory | Coordinator | `.agents/state/*`, `.codex/context/*`, contract, gap register | source-of-truth files | Synced current truth | file diff review | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was created or refreshed for broad work.
- [x] `.agents/workflows/responsibility-lanes.md` was reviewed.
- [x] Every important responsibility from source docs has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing or unclear ownership was recorded in `.agents/state/responsibility-learning.md`.
- [x] Process eval will be recorded in `.agents/state/agent-evals.md` if this is broad, repeated, partial, or subagent-heavy work.

## Context
`LUC-1791` established exact-candidate release parity for deployed production SHA `ca712e98...`; `LUC-1792` confirmed protected/admin proof cannot substitute for owner acceptance; `LUC-1793` froze the proof order but still referenced superseded candidate `40cfb8f2...`. This task executes the live rerun for the real deployed candidate on Thursday, July 23, 2026.

## Goal
Produce an evidence-backed QA disposition for `SRG-002` against exact deployed candidate `ca712e98...` without over-claiming owner acceptance.

## Success Signal
- User or operator problem: sale-readiness truth still depended on a planned matrix and stale candidate wording instead of an executed exact-candidate rerun.
- Expected product or reliability outcome: Soar either has current exact-candidate protected/supportability proof or a precise first failing gate.
- How success will be observed: inspectable artifacts plus synced contract/gap/state entries.
- Post-launch learning needed: no

## Deliverable For This Stage
One executed rerun evidence packet plus synced contract/gap/state updates reflecting whether `SRG-002` closed for candidate `ca712e98...`.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Exact-candidate public/protected/auth/UI/write/supportability outcomes are recorded with evidence.
- [x] `SRG-002` is closed or blocked with the first failing gate named precisely.
- [x] State, contract, and gap files reflect the rerun truth without claiming `SRG-003`.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  `pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --expected-sha ca712e98b70e157b643db4f57726a02821a140bc`
  `pnpm run ops:deploy:runtime-freshness -- --base-url https://api.soar.luckysparrow.ch`
  `pnpm run ops:prod-auth:proof -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha ca712e98... --output-json history/artifacts/luc-1796-prod-auth-session-browser-proof-ca712e98-2026-07-23.json --output-md history/artifacts/luc-1796-prod-auth-session-browser-proof-ca712e98-2026-07-23.md --today 2026-07-23 --i-understand-production-auth-proof`
  `pnpm run ops:ui:prod-clickthrough -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha ca712e98... --output-json history/artifacts/luc-1796-prod-ui-module-clickthrough-ca712e98-2026-07-23.json --output-md history/artifacts/luc-1796-prod-ui-module-clickthrough-ca712e98-2026-07-23.md --today 2026-07-23`
  `pnpm run ops:prod-security-exchange:proof -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha ca712e98... --output-json history/artifacts/luc-1796-prod-security-exchange-proof-ca712e98-2026-07-23.json --output-md history/artifacts/luc-1796-prod-security-exchange-proof-ca712e98-2026-07-23.md --today 2026-07-23 --i-understand-production-security-exchange-proof`
  `pnpm run ops:prod-fixture:action-proof -- --web-base-url https://soar.luckysparrow.ch --api-base-url https://api.soar.luckysparrow.ch --expected-sha ca712e98... --output-json history/artifacts/luc-1796-prod-fixture-action-proof-ca712e98-2026-07-23.json --output-md history/artifacts/luc-1796-prod-fixture-action-proof-ca712e98-2026-07-23.md --today 2026-07-23 --i-understand-production-fixture-risk`
- Manual checks:
  direct admin readback of `/ready/details`, `/workers/ready`, and `/workers/runtime-freshness` with redacted JSON summary only.
- Screenshots/logs:
  artifact markdown/json files under `history/artifacts/`.
- High-risk checks:
  exact SHA binding, protected-route principal boundary, unauthorized fail-closed, no LIVE mutation, cleanup after paper-safe write proof.
- Module confidence ledger updated: no
- Module confidence rows closed or changed: not applicable
- Requirements matrix updated: no
- Requirement rows closed or changed: not applicable
- Quality scenarios updated: no
- Quality scenario rows closed or changed: not applicable
- Risk register updated: no
- Risk rows closed or changed: not applicable
- Reality status: verified

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: not architecture-impacting
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence (required for UX tasks)
- Design source type: approved_snapshot
- Design source reference: authenticated production route behavior on current deployed candidate
- Canonical visual target: existing Soar production routes
- Fidelity target: structurally_faithful
- Stitch used: no
- Experience-quality bar reviewed: no
- Visual-direction brief reviewed: no
- Existing shared pattern reused: yes
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: yes
- Background or decorative asset strategy: existing implementation only
- Canonical asset extraction required: no
- Screenshot comparison pass completed: no
- Remaining mismatches: none in this lane
- Required states: success
- Responsive checks: desktop
- Input-mode checks: pointer, keyboard
- Accessibility checks: auth/session/browser proof only
- Parity evidence: `history/artifacts/luc-1796-prod-auth-session-browser-proof-ca712e98-2026-07-23.md`; `history/artifacts/luc-1796-prod-ui-module-clickthrough-ca712e98-2026-07-23.md`

## Deployment / Ops Evidence (required for runtime or infra tasks)
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: read-only verification of production health surfaces
- Smoke steps updated: no
- Rollback note: current rollback references re-read and attached in evidence packet
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `LUC-1793` matrix still referenced superseded SHA `40cfb8f2...`; `SRG-002` had no executed current-candidate rerun.
- Gaps: exact protected acceptance/supportability proof for current deployed candidate.
- Inconsistencies: release parity had advanced to `ca712e98...` while QA matrix and state prose still contained older candidate wording.
- Architecture constraints: no product mutation beyond one approved paper-safe write path.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no
- Missing or template-like files: none for this lane
- Sources scanned: issue description, sale-readiness contract, gap register, release-parity packet, prior QA matrix, state files
- Rows created or corrected: contract and gap/state statuses for `SRG-002`
- Assumptions recorded: admin-smoke remains approved for protected ops readback; owner acceptance stays out of scope unless `LUC-4103` resolves
- Blocking unknowns: none after direct admin readback
- Why it was safe to continue: approved prod test/admin credentials and repo-native proof helpers already existed

### 2. Select One Priority Mission Objective
- Selected task: execute exact-candidate acceptance rerun for `SRG-002`
- Priority rationale: parent sale-readiness program could not progress without exact-candidate proof or blocker
- Why other candidates were deferred: `SRG-003` owner acceptance belongs to `LUC-4103`

### 3. Plan Implementation
- Files or surfaces to modify: evidence/task packet, sale-readiness contract, gap register, state files, issue state
- Logic: run exact-candidate proof helpers, normalize principal-sensitive results, decide `SRG-002`
- Edge cases: `env-runtime` build-info provenance; smoke-user 403 on `/ready/details`; fixture helper broader than single required write path

### 4. Execute Implementation
- Implementation notes: reused repo-native production verification scripts and one direct redacted admin readback; no product code or deploy state changed

### 5. Verify and Test
- Validation performed: public smoke, worker readiness/freshness, build-info readback, auth browser proof, UI clickthrough, security fail-closed proof, fixture action proof, direct admin protected readback
- Result: exact candidate `ca712e98...` verified on public/protected/auth/UI paths; manual paper limit order open/cancel baseline passed; broader fixture helper later stopped on backtest report pending

### 6. Self-Review
- Simpler option considered: stop after first partial helper failure
- Technical debt introduced: no
- Scalability assessment: acceptable; proof bundle remains script-driven and candidate-bound
- Refinements made: separated wrong-principal 403 from real protected readiness by adding direct admin readback

### 7. Update Documentation and Knowledge
- Docs updated: task/evidence packet, contract, gap register, state/context files
- Context updated: yes
- Learning journal updated: not applicable.

## Review Checklist (mandatory)
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.
- [x] Required responsibility lanes were integrated, rejected, or tracked as follow-up.

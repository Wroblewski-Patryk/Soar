# LUC-2773 - SOAR-ASSISTANT-AI-001 V1 Scope Decision

## Header
- ID: LUC-2773
- Title: [Soar][LUC-965 Follow-up] Decide SOAR-ASSISTANT-AI-001 V1 scope and proof path
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Soar Product Manager
- Depends on: [LUC-965](/LUC/issues/LUC-965), [LUC-616](/LUC/issues/LUC-616), `REQ-AI-030`
- Priority: P1
- Module Confidence Rows: `SOAR-ASSISTANT-AI-001`
- Requirement Rows: `REQ-AI-030`
- Quality Scenario Rows: not applicable
- Risk Rows: `RISK-SEC-AI-ASSISTANT-HOTPATH-2026-06-04`, `RISK-030`
- Iteration: 2026-06-07 Paperclip heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-2773-SOAR-ASSISTANT-AI-V1-SCOPE-DECISION-2026-06-07
- Mission Status: VERIFIED

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the bounded product-decision heartbeat.
- [x] The task is aligned with repository source-of-truth documents.
- [x] `.agents/core/project-memory-index.md` was reviewed through active mission/state context.
- [x] `.agents/core/mission-control.md` was reviewed through active mission/state context.
- [x] Missing or template-like state tables were not present for this decision.
- [x] Affected module confidence rows were identified.
- [x] Affected requirement and risk rows were identified.
- [x] The task improves release confidence by removing an unowned partial gap.

## Mission Block
- Mission objective: decide whether `SOAR-ASSISTANT-AI-001` enters V1 execution or remains accepted deferred scope.
- Release objective advanced: V1 scope clarity and prevention of accidental assistant hot-path activation.
- Included slices: current evidence review, disposition, proof path, source-of-truth updates, Paperclip closure.
- Explicit exclusions: code changes, model/runtime wiring, protected auth, deploy, production mutation, exchange action, live trading.
- Checkpoint cadence: single heartbeat decision packet.
- Stop conditions: scope disposition recorded and issue updated.
- Handoff expectation: no implementation handoff unless Product+CTO later activate executable hot-path AI.

## Responsibility Lanes

| Lane | Owner | Source docs/state | Owned files/surfaces | Output | Validation/proof | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Coordinator | Soar Product Manager | LUC-2773, LUC-965, LUC-616 | issue disposition, state docs | decision packet | source inspection and ledger updates | DONE |
| Product/Requirements | Soar Product Manager | `REQ-AI-030`, assistant runtime contract | V1 scope boundary | accepted deferred V1 decision | current proof path recorded | DONE |
| Architecture | Existing architecture source | `docs/architecture/reference/assistant-runtime-contract.md` | no architecture change | confirm existing contract still fits | source inspection | DONE |
| Implementation | AI Runtime | n/a | none | no child issue now | activation deferred | NOT_NEEDED |
| QA/Test | QA/Test | `AI_TESTING_PROTOCOL.md`, LUC-1945/LUC-2018 | no new proof run | current evidence referenced | previous proof accepted for foundation scope | DONE |
| Security/Ops/UX | Security | risk register | red-team gate preserved | no new implementation issue | future trigger recorded | DONE |
| Documentation/Memory | Soar Product Manager | ledgers/context | task packet and state updates | durable source-of-truth sync | file readback | DONE |

### Lane Checks
- [x] `.agents/state/active-mission.md` was refreshed.
- [x] Responsibility lanes were applied from the issue/role boundary.
- [x] Every important responsibility has an owner or explicit omission.
- [x] No two write lanes own the same file or shared registry.
- [x] Each lane has expected output and validation/proof.
- [x] Missing ownership was not found.

## Context
[LUC-965](/LUC/issues/LUC-965) left `SOAR-ASSISTANT-AI-001` as the remaining
P1 non-DCA partial gap requiring a decision: either activate executable
assistant hot-path work or record it as accepted deferred V1 scope.

Existing source truth already states that the current assistant implementation
is foundation/dry-run only. `REQ-AI-030`, [LUC-616](/LUC/issues/LUC-616),
[LUC-1945](/LUC/issues/LUC-1945), and [LUC-2018](/LUC/issues/LUC-2018) all
preserve the boundary: local foundation proof is valid, but executable
BACKTEST/PAPER/LIVE assistant trading is not active and requires a separate
Product+CTO activation plus AI Runtime and Security red-team packet.

## Goal
Remove the unowned `SOAR-ASSISTANT-AI-001` partial ambiguity for V1.

## Success Signal
- User or operator problem: V1 planning no longer treats assistant hot-path as an accidental open implementation gap.
- Expected product or reliability outcome: current V1 scope stays safe and evidence-backed.
- How success will be observed: module and requirement ledgers classify the assistant as verified for foundation scope and accepted deferred for executable hot-path.
- Post-launch learning needed: no.

## Deliverable For This Stage
A durable disposition: `accepted_deferred_for_v1`.

## Constraints
- Use existing systems and approved mechanisms.
- Do not introduce new structures without approval.
- Do not implement workarounds.
- Do not duplicate logic.
- Stay within product decision and source-of-truth updates only.

## Decision
`SOAR-ASSISTANT-AI-001` remains **accepted deferred scope for Soar V1**.

Accepted V1 scope:
- bot-scoped assistant configuration,
- deterministic assistant foundation/orchestrator behavior,
- owner-scoped dry-run diagnostics for `BACKTEST|PAPER`,
- sanitized traces and fail-closed `LIVE` rejection.

Deferred/non-V1 scope:
- wiring `orchestrateAssistantDecision` into runtime decision loops,
- using assistant output as executable trading authority,
- model-backed or memory/tool-enriched hot-path assistant decisions,
- any LIVE assistant activation.

## Proof Path
Current V1 proof path is satisfied by existing foundation evidence:
- `REQ-AI-030` verifies the architecture truth boundary.
- [LUC-1945](/LUC/issues/LUC-1945) passed `pnpm run test:adversarial:api-assistant` (`8` files / `29` tests).
- [LUC-2018](/LUC/issues/LUC-2018) classifies `CHAIN-AI-ASSISTANT-FOUNDATION` as locally verified for foundation/dry-run and default LIVE fail-closed behavior.
- [LUC-616](/LUC/issues/LUC-616) records V1 non-activation for assistant hot-path orchestration.

Future activation proof path, if Product+CTO reopen it:
1. create a dedicated AI Runtime implementation issue,
2. create or link a Security red-team issue,
3. define persisted immutable runtime assistant traces,
4. prove fail-closed fallback and feature-disable behavior,
5. run reproducible multi-turn `AI_TESTING_PROTOCOL.md` scenarios,
6. prove `BACKTEST` and `PAPER` before any separate LIVE discussion,
7. require explicit Product+CTO approval before LIVE-mode activation.

## Definition of Done
- [x] V1 disposition recorded.
- [x] Current foundation proof path recorded.
- [x] Future activation path and owners recorded.
- [x] Source-of-truth ledgers updated.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- protected credentials, deploys, production mutation, exchange mutation, or live-trading actions

## Validation Evidence
- Tests: not run; no code changed.
- Manual checks: inspected LUC-2773 heartbeat context; `docs/architecture/reference/assistant-runtime-contract.md`; `AI_TESTING_PROTOCOL.md`; `REQ-AI-030`; module confidence ledger; risk register; [LUC-616](/LUC/issues/LUC-616); [LUC-2018](/LUC/issues/LUC-2018).
- Screenshots/logs: not applicable.
- High-risk checks: no secret, protected auth, deploy, production, account, database, exchange, or live-trading action.
- Module confidence ledger updated: yes.
- Module confidence rows closed or changed: `SOAR-ASSISTANT-AI-001`.
- Requirements matrix updated: yes.
- Requirement rows closed or changed: `REQ-AI-030`.
- Quality scenarios updated: not applicable.
- Quality scenario rows closed or changed: none.
- Risk register updated: yes.
- Risk rows closed or changed: `RISK-SEC-AI-ASSISTANT-HOTPATH-2026-06-04`, `RISK-030`.
- Reality status: verified for decision and foundation proof path; deferred for executable hot-path.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/assistant-runtime-contract.md`, `docs/architecture/11_assistant-runtime.md`, `docs/architecture/chains/CHAIN-AI-ASSISTANT-FOUNDATION.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no; existing Product decision and current issue scope support accepted deferred V1 disposition.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none required.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: no runtime change to roll back.
- Observability or alerting impact: none.
- Staged rollout or feature flag: future hot-path activation must define feature-disable/fail-closed behavior before implementation.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `SOAR-ASSISTANT-AI-001` was still labeled partial in the non-DCA lane.
- Gaps: executable hot-path AI trading proof is absent by design.
- Inconsistencies: no current architecture-code mismatch; ambiguity was in planning disposition.
- Architecture constraints: assistant foundation is advisory/dry-run only; executable chain is deferred.

### 1a. Bootstrap Missing Project Knowledge
- Bootstrap needed: no.
- Sources scanned: LUC-2773 context, LUC-965, LUC-616, LUC-2018, `REQ-AI-030`, assistant runtime contract, AI testing protocol, ledgers.
- Rows created or corrected: decision/state notes only.
- Assumptions recorded: future hot-path activation requires Product+CTO.
- Blocking unknowns: none for V1 disposition.
- Why it was safe to continue: no code/runtime behavior changed.

### 2. Select One Priority Mission Objective
- Selected task: LUC-2773 scope decision.
- Priority rationale: high-priority assigned Paperclip wake.
- Why other candidates were deferred: wake payload scoped this heartbeat to LUC-2773.

### 3. Plan Implementation
- Files or surfaces to modify: task packet and state ledgers.
- Logic: record accepted deferred V1 disposition and future proof path.
- Edge cases: avoid creating implementation issues that imply activation.

### 4. Execute Implementation
- Implementation notes: created this packet and updated source-of-truth state files.

### 5. Verify and Test
- Validation performed: source inspection and status/readback checks only.
- Result: decision aligns with existing evidence and architecture.

### 6. Self-Review
- Simpler option considered: issue comment only.
- Technical debt introduced: no.
- Scalability assessment: future activation remains explicitly gated and owner-routed.
- Refinements made: separated current proof path from future activation proof path.

### 7. Update Documentation and Knowledge
- Docs updated: this task packet plus ledgers/context.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to the bounded heartbeat.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run or explicitly scoped out.
- [x] Docs or context were updated because repository truth changed.
- [x] Learning journal was not needed.
- [x] Required responsibility lanes were integrated or explicitly deferred.

## Result Report
- Disposition: `accepted_deferred_for_v1`.
- Files changed: this task packet plus Soar source-of-truth ledgers/context.
- Tests run: none; no code changed.
- Deployment impact: none.
- Residual risk: executable assistant hot-path remains unimplemented and must not be claimed as V1 behavior.
- Next owner if reopened: Product+CTO activation gate, then AI Runtime + Security + QA/Test child issues.

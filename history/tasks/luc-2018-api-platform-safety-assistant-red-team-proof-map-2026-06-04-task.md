# LUC-2018 - API Platform Safety And Assistant Red-Team Proof Map

## Header
- ID: LUC-2018
- Title: [Soar][Architecture Audit] API platform safety and assistant red-team proof map
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Security
- Depends on: [LUC-2013](/LUC/issues/LUC-2013)
- Priority: P1
- Module Confidence Rows: `SOAR-SECURITY-PRIVACY-001`, `SOAR-FEATURE-API-PLATFORM-SAFETY`, `SOAR-FEATURE-AI-ASSISTANT-FOUNDATION`
- Requirement Rows: `REQ-DOC-019`, `REQ-DOC-024`, `REQ-AI-030`
- Quality Scenario Rows: `QAS-DOC-019`
- Risk Rows: `RISK-030`, `RISK-DOC-005`
- Iteration: 2026-06-04 Security heartbeat
- Operation Mode: TESTER
- Mission ID: LUC-2018-API-PLATFORM-SAFETY-ASSISTANT-RED-TEAM-PROOF-MAP-2026-06-04
- Mission Status: VERIFIED

## Context
[LUC-2018](/LUC/issues/LUC-2018) is a Security Review Lead audit lane under
[LUC-2013](/LUC/issues/LUC-2013). It asks for architecture-backed safety proof
classification for `CHAIN-API-PLATFORM-SAFETY` and
`CHAIN-AI-ASSISTANT-FOUNDATION`, without production mutation, secret access, or
LIVE trading action.

## Goal
Classify the current API platform safety and assistant foundation proof as
verified locally, blocked, missing, or not applicable, and state whether concrete
follow-up issues are needed.

## Scope
- `docs/architecture/chains/CHAIN-API-PLATFORM-SAFETY.md`
- `docs/architecture/chains/CHAIN-AI-ASSISTANT-FOUNDATION.md`
- `docs/architecture/indices/function-chain-evidence-index.csv`
- `docs/architecture/indices/api-surface-evidence-index.csv`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `AI_TESTING_PROTOCOL.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`
- `history/tasks/luc-1945-adversarial-api-assistant-regression-proof-2026-06-04-task.md`
- Root/API `test:adversarial:api-assistant` scripts

## Implementation Plan
1. Read Paperclip issue context and Security Review Lead role boundary.
2. Inspect architecture chain rows and current proof-gap indexes.
3. Inspect assistant runtime and AI testing contracts.
4. Rerun the smallest current adversarial proof command.
5. Record a security proof map and residual gate decision.

## Acceptance Criteria
- API platform safety chain status is classified with current evidence.
- AI assistant foundation chain status is classified with current evidence.
- Abuse cases are mapped to tests/docs or residual gates.
- Any concrete defect found is routed as a follow-up issue.
- No secret, production account, protected smoke, deploy, or LIVE trading action occurs.

## Definition of Done
- [x] Threat/abuse-case checklist recorded.
- [x] Mapped tests/docs recorded.
- [x] Current status per chain recorded.
- [x] Residual protected or red-team gates recorded.
- [x] Focused local proof rerun successfully.

## Chain Status Map

| Chain | Current Status | Evidence | Residual Gate | Security Decision |
| --- | --- | --- | --- | --- |
| `CHAIN-API-PLATFORM-SAFETY` | verified locally for architecture traceability and adversarial local regression proof | chain doc status `verified_local`; `REQ-DOC-024`; `LUC-1945`; fresh `pnpm run test:adversarial:api-assistant` PASS (`8` files / `29` tests) | protected production auth and DB-backed route e2e remain separate release/proof lanes | No new defect child issue from this audit lane. Keep production/protected proof under existing release gates. |
| `CHAIN-AI-ASSISTANT-FOUNDATION` | verified locally for foundation/dry-run behavior and fail-closed LIVE default; executable hot path is deferred | chain doc status `verified_local`; `REQ-DOC-019`; `REQ-AI-030`; assistant runtime contract; `LUC-1945`; fresh focused proof PASS (`8` files / `29` tests) | hot-path BACKTEST/PAPER/LIVE assistant trading orchestration requires Product/CTO activation, persisted traces, and AI red-team acceptance before any runtime trading claim | No implementation child issue until the activation decision exists. Security blocks any hot-path trading claim without the red-team packet. |

## Threat / Abuse-Case Checklist

| Risk Area | Current Evidence | Status | Required Next Proof If Scope Changes |
| --- | --- | --- | --- |
| Rate-limit Redis unavailable in production | `src/middleware/rateLimit.test.ts`; `LUC-1945`; fresh focused command PASS | verified locally | Rerun after rate-limit middleware/env changes; protected production behavior remains release-gated. |
| Rate-limit Redis logging leaks internals | `LUC-1946` and `LUC-1945` cover redacted logger path and regression pack | verified locally | Rerun redaction tests after logger/middleware changes. |
| Cookie-backed write without trusted origin | `src/middleware/requireTrustedOrigin.unit.test.ts`; fresh focused command PASS | verified locally | Add route-level proof if new cookie-backed writes are added. |
| JWT/session token smuggling or ordering ambiguity | `src/modules/auth/auth.jwt.test.ts`; `src/modules/auth/sessionToken.test.ts`; fresh focused command PASS | verified locally | DB-backed/authenticated route e2e remains separate proof. |
| Assistant dry-run accepts `LIVE` | `AssistantDryRunSchema` boundary from `LUC-1944`; `assistantOrchestrator.parity.test.ts`; fresh focused command PASS | verified locally | Rerun before changing dry-run schema/client payloads. |
| Assistant prompt/role misuse disables safety or risk controls | assistant protocol/service tests and AI testing protocol harness are local deterministic proof only | partially verified | Required red-team packet before executable assistant trading activation. |
| Assistant output becomes executable trading authority | assistant runtime contract explicitly defers executable chain; default LIVE hot-path fail-closed proof passes | blocked by activation gate, not a code defect | Product/CTO must approve activation; AI Runtime must implement persisted traces; Security must review abuse cases and red-team results. |
| Prompt injection, data leakage, unauthorized tool/file/credential access | `AI_TESTING_PROTOCOL.md` defines required scenarios; current foundation has no model/tool hot path | not applicable to current deterministic dry-run beyond local protocol tests | Becomes mandatory if future memory/context/tool/model enrichment is enabled. |
| Protected production auth/account proof | Existing release/protected proof gates own this; no protected inputs used here | blocked outside this lane | Ops/QA/Security protected production proof with approved test account/session. |

## Validation Evidence
- Tests:
  - `pnpm run test:adversarial:api-assistant` -> PASS (`8` files / `29` tests) at 2026-06-04T18:49+02:00.
- Manual checks:
  - Paperclip heartbeat context for [LUC-2018](/LUC/issues/LUC-2018): `in_progress`, no blockers, no comments.
  - Chain docs and function-chain evidence index inspected for both target chains.
  - `AI_TESTING_PROTOCOL.md`, assistant runtime contract, runtime signal merge contract, risk register, and requirements matrix reviewed.
- High-risk checks:
  - No secret readback.
  - No production account access.
  - No protected smoke.
  - No deploy, restart, rollback, env edit, database action, exchange mutation, or LIVE trading action.
- Module confidence ledger updated: yes.
- Requirements matrix updated: yes.
- Risk register updated: yes.
- Reality status: verified locally, with protected/hot-path gates explicitly preserved.

## Security / Privacy Evidence
- Data classification: local docs/state/test output only.
- Trust boundaries: API middleware/session parsing; assistant dry-run orchestration; deferred executable AI trading boundary.
- Permission or ownership checks: existing tests cover auth/session rejection; protected route e2e not executed in this lane.
- Abuse cases: see checklist above.
- Secret handling: no secret values printed, copied, or persisted.
- Fail-closed behavior: verified locally for rate-limit production Redis unavailability and default LIVE assistant hot-path behavior.
- Residual risk:
  - Protected production auth remains outside this no-protected-smoke audit.
  - DB-backed route e2e remains outside this proof map.
  - LIVE assistant hot-path parity remains deferred until Product/CTO activation and AI red-team acceptance.

## Result Report
- Task summary: Completed Security proof-map audit for API platform safety and AI assistant foundation. Fresh local adversarial proof passed, and no concrete new defect was found.
- Files changed:
  - `history/tasks/luc-2018-api-platform-safety-assistant-red-team-proof-map-2026-06-04-task.md`
  - `.agents/state/active-mission.md`
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/system-health.md`
  - `.agents/state/requirements-verification-matrix.md`
  - `.agents/state/risk-register.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- How tested: `pnpm run test:adversarial:api-assistant` passed (`8` files / `29` tests).
- What is incomplete: protected production auth, DB-backed route e2e, and executable assistant hot-path red-team proof remain separate gates and were not attempted.
- Next steps: No new defect issue from this audit lane. If Product/CTO activates executable assistant trading, create a dedicated AI Runtime + Security red-team implementation/review issue before enabling any hot-path behavior.
- Decisions made: Security classifies both target chains as locally verified for their current architecture scope; Security blocks any broader LIVE/hot-path assistant trading claim without activation and red-team evidence.

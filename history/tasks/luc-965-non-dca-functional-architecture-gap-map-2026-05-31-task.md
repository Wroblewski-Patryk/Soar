# LUC-965 [Soar][Non-DCA Functional Research] Architecture-to-runtime gap map - 2026-05-31

## Context
- Wake: `finish_successful_run_handoff` for `LUC-965`.
- Objective focus in this checkpoint: verify whether non-DCA application scope is working against architecture/source-of-truth and isolate real remaining gaps.

## Goal
- Produce an evidence-backed non-DCA status map with explicit blockers, owners, and next actions.

## Scope
- Included: canonical state ledgers and requirement/risk registers.
- Excluded: new implementation/deploy/protected production mutation.

## Method
1. Read `module-confidence-ledger` for P0/P1 rows not in `VERIFIED`.
2. Cross-check `known-issues`, `risk-register`, and `requirements-verification-matrix` for live blocker truth.
3. Classify gaps into actionable lanes.

## Findings (non-DCA)

### 1) Functional product modules (non-DCA)
- Status: **implemented and verified** for core user journeys in current accepted scope.
- Evidence: P0 functional rows remain `VERIFIED` for Auth, Profile, API Keys, Wallets, Markets, Strategies, Manual Orders, Positions, Orders, Backtests, Reports, Logs, Dashboard, Bot Runtime, Bots, Workers, Security, Subscriptions/Admin.
- Interpretation: no new non-DCA product-code defect was confirmed in this checkpoint.

### 2) Remaining high-impact gaps (not DCA-specific)
- `SOAR-OPERATIONS-001` (`P0`, `PARTIAL`):
  - Gap: current target still lacks fresh protected release evidence (auth/context, Gate2 SLO, named Gate4 sign-off fields, rollback/restore/liveimport packet completion).
  - Owner lane: Ops/Release + QA/Test.
- `SOAR-DATA-001` (`P0`, `PARTIALLY VERIFIED`):
  - Gap: production migration status + production backup/restore freshness not refreshed in protected ops context.
  - Owner lane: DB/Migrations + QA/Test (+ Ops context).
- `SOAR-ASSISTANT-AI-001` (`P1`, `PARTIAL`):
  - Gap: no audited hot-path runtime call-site proof and no full model-backed multi-turn red-team runtime packet.
  - Owner lane: QA/Test + Security + Backend.

## Architecture parity conclusion
- For non-DCA functional surfaces, architecture-to-implementation parity is currently evidenced as `VERIFIED` in canonical module rows.
- Current residual non-DCA risk is concentrated in release-proof/ops-security gates and protected-environment evidence, not in a newly found core product-function regression.

## Verification commands (read-only research)
- `rg` queries over:
  - `.agents/state/module-confidence-ledger.md`
  - `.agents/state/known-issues.md`
  - `.agents/state/risk-register.md`
  - `.agents/state/requirements-verification-matrix.md`

## Result
- Checkpoint status: `done`.
- New blocker created: `no` (existing blockers clarified and routed).
- Deploy/runtime mutation: `none`.

## Recommended next lane order
1. Close `SOAR-OPERATIONS-001` protected packet (`AUD-19` chain, Gate2/Gate4 evidence).
2. Refresh `SOAR-DATA-001` production migration/restore evidence in protected ops context.
3. Decide whether `SOAR-ASSISTANT-AI-001` remains accepted deferred scope or enters execution as a dedicated AI/security mission.

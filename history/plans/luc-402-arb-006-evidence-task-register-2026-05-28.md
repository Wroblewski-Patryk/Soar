# LUC-402 ARB-006 Evidence Task Register

Last updated: 2026-05-28  
Issue: `LUC-402 [Soar][ARB-006]`  
Owner lane: `Ops Release Lead (coordination)`  
Status: `blocked_on_inputs_with_dated_tasks`

## Goal
Convert architecture-index high proof gaps into dated public/protected evidence tasks on the critical release chain so QA/Ops/Security can execute them without ambiguity.

## Scope
- Source gap: `ARB-006` from `history/plans/luc-384-architecture-repair-backlog-2026-05-28.md`.
- Source evidence index: `docs/status/function-journey-index.md` (high-gap rows).
- This lane is planning/coordination only; no runtime, deploy, or secret mutation.

## Dated Critical-Chain Tasks

| Task ID | Chain / surface | Evidence class | Owner | Target date | Verification contract | Blocker |
| --- | --- | --- | --- | --- | --- | --- |
| ARB6-EV-001 | `CHAIN-AUTH-SESSION-DEEP`, `SOAR-PAGE-DASHBOARD` | protected | QA + Security | 2026-05-30 | Authenticated browser walkthrough packet (desktop/mobile) with `loading/empty/error/success` states and redacted artifacts. | Missing approved protected principal/session inputs. |
| ARB6-EV-002 | `CHAIN-DASHBOARD-RUNTIME`, `SOAR-API-BOT-RUNTIME-POSITIONS` | protected | QA + Ops | 2026-05-31 | Read-only protected runtime readback packet tied to expected SHA with `/workers/ready`, runtime positions, and rollback note. | Missing approved auth artifact with required worker-read scope. |
| ARB6-EV-003 | `CHAIN-POSITIONS-CORE`, `CHAIN-BOT-RUNTIME-CORE` | protected | QA + Ops | 2026-06-01 | Production-safe authenticated clickthrough + API parity packet linked to expected SHA and command log. | Same as ARB6-EV-002 plus active Ops window. |
| ARB6-EV-004 | `CHAIN-MANUAL-ORDER`, `CHAIN-MANUAL-ORDER-DEEP` | protected | Security + QA | 2026-06-02 | Approval-gated LIVE mutation decision record (`approve` or explicit defer) plus fail-closed negative-path proof. | Product/CTO decision gate for LIVE mutation scope. |
| ARB6-EV-005 | `CHAIN-WALLETS-CORE`, `CHAIN-PROFILE-API-KEYS` | protected | Security + QA | 2026-06-03 | Secret-safe browser/API proof packet with redaction checks and no secret leakage artifacts. | Missing approved test account/session and secret-safe capture protocol. |
| ARB6-EV-006 | `CHAIN-RELEASE-AUDIT-TOOLING`, `CHAIN-OPS-CONFIG-PIPELINE` | public + protected | Ops | 2026-06-03 | Expected-SHA release packet consistency check + protected-input readiness packet refresh for same date/SHA. | Protected input families not present in current runner scope. |
| ARB6-EV-007 | `CHAIN-ENGINE-RUNTIME-CORE`, `CHAIN-MARKET-DATA-STREAM-ADAPTERS` | protected | Ops + Security | 2026-06-04 | End-to-end runtime journey packet with explicit statement whether LIVE exchange mutation proof is executed or deferred by approval. | Approval + controlled exchange scope not yet granted. |
| ARB6-EV-008 | `CHAIN-API-PLATFORM-SAFETY` | public | Security | 2026-06-04 | Adversarial API/auth fail-closed review packet linked to current SHA and route matrix. | Security review window scheduling. |

## Acceptance Criteria
1. Every critical chain task has owner, date, evidence class, and verification contract.
2. Each task names first-class blocker owner/action instead of generic "needs proof".
3. `TASK_BOARD` and `PROJECT_STATE` are updated to route execution to these dated tasks.

## Result Report
- Completed: ARB-006 high-gap conversion into dated execution tasks (`ARB6-EV-001..008`).
- Not completed: protected evidence execution itself.
- Next owner actions:
  1. Delivery/PM creates or assigns child issues from this register in listed order.
  2. Security/Test credential owner provides approved protected principal/session artifact for `ARB6-EV-001..003`.
  3. Ops executes only one bounded protected recheck per ready task and records evidence packet path.


# Responsibility Learning

Last updated: 2026-05-21

Use this ledger when coordinator/subagent work exposes a missing lane, unclear
owner, bad split, missing evidence, or missing context. Gaps here must change
the next similar mission brief, lane registry, docs, or task plan.

| ID | Date | Mission/task | Gap type | Missing or unclear responsibility | Evidence/source | Next briefing change | Stored follow-up | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RLG-000 | YYYY-MM-DD | Example mission | missing_lane | Replace this sample row with a real responsibility gap. | Source path or subagent report. | Add the lane before the next similar mission. | Task, doc, or state file path. | open |
| RLG-001 | 2026-05-21 | `FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21` | missing_evidence | Dashboard Home runtime mutation controls auto-send `riskAck: true`, but changing this safely needs explicit Product/UX/Security ownership and browser proof rather than a backend/frontend quick patch. | Frontend subagent report: `useManualOrderController.ts`, `HomeLiveWidgets.tsx`, `useCloseRuntimePositionAction.ts`. | For any LIVE-sensitive runtime action UX mission, include a dedicated confirmation-flow lane with product acceptance, abuse/misclick cases, and rendered browser proof before implementation. | `.agents/state/known-issues.md`; `.codex/context/TASK_BOARD.md` | open |
| RLG-002 | 2026-05-21 | `REST-IMPLEMENTATION-SWEEP-2026-05-21` | missing_context | Web service wrappers defaulted `riskAck: true`, so future callers could bypass the intended UI confirmation responsibility even when the current screen was patched. | Frontend agent report and fix in `apps/web/src/features/bots/services/bots.service.ts`. | Any future money-impacting or live-risk service wrapper must require caller-supplied acknowledgement and the caller must own the rendered confirmation proof. | `history/tasks/rest-implementation-sweep-2026-05-21-task.md`; `docs/modules/web-dashboard-home.md` | open |
| RLG-003 | 2026-05-21 | `LOCAL-CERTAINTY-CLOSURE-2026-05-21` | unclear_owner | Reports/data worker and coordinator both touched migration ownership, briefly creating duplicate `Trade.executionMode` migrations. | Removed duplicate `20260521120000_add_trade_execution_mode_snapshot`; kept `20260521023000_add_trade_execution_mode` with backfill and validation proof. | Future schema missions must designate exactly one migration owner and require all other lanes to stop at findings unless the coordinator transfers the migration write lock. | `history/tasks/local-certainty-closure-2026-05-21-task.md`; `.agents/state/agent-evals.md` | open |
| RLG-004 | 2026-05-21 | `SECURITY-RED-TEAM-HARDENING-2026-05-21` | missing_evidence | Closing security agents before their reports are captured makes the parent mission unable to distinguish completed evidence from abandoned background work. | User flagged lingering/closed background tasks; coordinator reran Auth, Secrets/Ops, Trading/Money Safety, and Frontend Security lanes and used only completed second-round reports as evidence. | For security/compliance work, do not close a delegated lane until `wait_agent` or final status has produced a report and the coordinator has copied findings into the task record; if this rule is violated, rerun the lane. | `history/tasks/security-red-team-hardening-2026-05-21-task.md`; `.agents/state/agent-evals.md` | open |

## Gap Types

- `missing_lane`: a needed responsibility was not assigned to any agent.
- `unclear_owner`: multiple lanes assumed someone else owned the work.
- `bad_split`: delegated lanes overlapped or could not be integrated cleanly.
- `missing_evidence`: a lane delivered output without proof needed for acceptance.
- `missing_context`: a lane lacked source-of-truth context needed to act.

## Closure Rule

Close a row only after the next mission brief, task template, lane registry,
source-of-truth doc, or state file has been updated so the same gap is less
likely to repeat.

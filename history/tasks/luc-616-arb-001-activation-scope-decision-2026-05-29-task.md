# Task

## Header
- ID: LUC-616
- Title: [Soar][ARB-001 Gate] Decide activation scope for assistant hot-path orchestration
- Task Type: planning
- Current Stage: planning
- Status: IN_REVIEW
- Owner: Product Lead
- Depends on: `history/tasks/luc-385-arb-001-security-gate-2026-05-28-task.md`, `.agents/state/decision-register.md`
- Priority: high

## Context
Wake reason `issue_assigned` with `fallbackFetchNeeded=false` and no pending comments. `ARB-001` remained blocked only because Product/CTO activation scope was not explicitly written, while Security already delivered fail-closed hardening.

## Goal
Publish an explicit activation-scope decision for assistant hot-path orchestration so implementation lanes cannot over-activate runtime AI authority.

## Constraints
- Product role only: no runtime implementation takeover.
- Preserve fail-closed current behavior.
- Keep DEC-AUD-002 continuity unless a new explicit decision supersedes it.

## Definition of Done
- [x] Activation scope is explicitly documented with allowed/not-allowed boundaries.
- [x] Post-V1 activation envelope is defined with required gates.
- [x] Decision register and project state reflect the new decision packet.

## Forbidden
- Activating hot-path behavior in this lane.
- Reframing dry-run foundation as runtime trading authority.
- Marking ARB-001 implementation complete without AI Runtime + Security execution evidence.

## Implementation Plan
1. Confirm current ARB-001 blocker truth and Security lane completion evidence.
2. Publish product decision packet with explicit scope boundaries.
3. Sync canonical state files and hand off to CTO review path.

## Acceptance Criteria
- `history/plans/luc-616-arb-001-activation-scope-decision-2026-05-29.md` exists with explicit scope and gate conditions.
- `.agents/state/decision-register.md` contains a durable `DEC-ARB-001` row.
- `.codex/context/TASK_BOARD.md` and `.codex/context/PROJECT_STATE.md` reflect this heartbeat and next owner.

## Validation Evidence
- `rg -n "DEC-ARB-001|LUC-616|product_scope_decided_cto_review_required" history/plans/luc-616-arb-001-activation-scope-decision-2026-05-29.md history/tasks/luc-616-arb-001-activation-scope-decision-2026-05-29-task.md .agents/state/decision-register.md .codex/context/TASK_BOARD.md .codex/context/PROJECT_STATE.md`

## Result Report
- Task summary: published Product activation-scope decision for ARB-001 and routed for CTO review before any hot-path implementation.
- Files changed:
  - `history/plans/luc-616-arb-001-activation-scope-decision-2026-05-29.md`
  - `history/tasks/luc-616-arb-001-activation-scope-decision-2026-05-29-task.md`
  - `.agents/state/decision-register.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- How tested: documentation/state consistency grep checks.
- What is incomplete: CTO approval and child implementation issues are still required before activation work.
- Next steps:
  1. CTO reviews and confirms/refines `DEC-ARB-001` envelope.
  2. Delivery creates AI Runtime/Security child issues only after that review.

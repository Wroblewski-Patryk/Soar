# Task

## Header
- ID: AUDIT-DECISION-REPAIR-PLAYBOOKS-2026-05-19
- Title: Prepare implementation playbooks for remaining audit decisions
- Task Type: planning
- Current Stage: planning
- Status: DONE
- Owner: Planning Agent
- Depends on: `AUDIT-DECISION-PACKET-2026-05-19`
- Priority: P1
- Module Confidence Rows: Exchange Adapter, Assistant/AI
- Requirement Rows: `REQ-ARCH-028`, `REQ-AI-030`
- Quality Scenario Rows: Architecture/source-of-truth integrity, AI safety
- Risk Rows: `RISK-028`, `RISK-030`
- Iteration: 2026-05-19 audit continuation
- Operation Mode: ARCHITECT
- Mission ID: FULL-REUSABLE-AUDIT-2026-05-19
- Mission Status: BLOCKED

## Context

`DEC-AUD-001` and `DEC-AUD-002` are open and require explicit user choice
before implementation. This task prepares option-specific repair playbooks
without accepting any option.

## Goal

Make the next post-decision repair executable by listing files, steps,
validation gates, and stop conditions for every valid option.

## Scope

- `docs/operations/audit-decision-repair-playbooks-2026-05-19.md`
- `docs/operations/audit-decision-repair-playbooks-2026-05-19.json`
- `.codex/context/TASK_BOARD.md`
- `.agents/state/next-steps.md`

## Definition of Done

- [x] `DEC-AUD-001` options have implementation playbooks.
- [x] `DEC-AUD-002` options have implementation playbooks.
- [x] The playbooks state that no decision is accepted by this task.
- [x] Validation passes for docs/JSON/guardrails.

## Forbidden

- architecture changes without explicit approval
- runtime AI implementation
- production release gate execution
- LIVE order/cancel/close or exchange-side mutation

## Validation Evidence

- Reality status: blocked on explicit user decisions.
- High-risk checks: no production journey, no LIVE/exchange mutation, no architecture decision applied.
- Validation: JSON parse, docs parity, guardrails, and diff check.

## Result Report

Created option-specific repair playbooks for both remaining audit decisions.
The project remains blocked on explicit user choice before architecture or
runtime changes.

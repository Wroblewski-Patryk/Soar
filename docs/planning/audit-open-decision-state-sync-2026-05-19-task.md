# Task

## Header
- ID: AUDIT-OPEN-DECISION-STATE-SYNC-2026-05-19
- Title: Synchronize open audit decision state across risk and known-issue sources
- Task Type: research
- Current Stage: post-release
- Status: DONE
- Owner: Planning Agent
- Depends on: `AUDIT-DECISION-PACKET-2026-05-19`
- Priority: P1
- Module Confidence Rows: Exchange Adapter, Assistant/AI
- Requirement Rows: `REQ-ARCH-028`, `REQ-AI-030`
- Quality Scenario Rows: Architecture/source-of-truth integrity
- Risk Rows: `RISK-028`, `RISK-030`
- Iteration: 2026-05-19 audit continuation
- Operation Mode: ARCHITECT
- Mission ID: FULL-REUSABLE-AUDIT-2026-05-19
- Mission Status: BLOCKED

## Context

`AUDIT-DECISION-PACKET-2026-05-19` made the remaining audit decisions explicit.
This task synchronizes long-lived state so repaired exchange capability debt is
not treated as open work.

## Goal

Synchronize the open decision state for `AUD-01` and `AUD-20` across durable
planning/risk/issue sources.

## Scope

- `.agents/state/known-issues.md`
- `.agents/state/risk-register.md`
- `.agents/state/requirements-verification-matrix.md`
- `docs/analysis/documentation-drift.md`
- `.codex/context/TASK_BOARD.md`

## Definition of Done

- [x] Known issues no longer present `AUD-EXCH-002` as open.
- [x] Risk and requirement rows point at decision packet IDs.
- [x] Documentation drift references the decision packet.
- [x] Validation confirms JSON/docs/guardrails remain valid.

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

Synchronized open audit decision state after the decision packet. Remaining
blockers are explicit decisions, not hidden implementation failures.

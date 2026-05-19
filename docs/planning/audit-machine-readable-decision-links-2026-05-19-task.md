# Task

## Header
- ID: AUDIT-MACHINE-READABLE-DECISION-LINKS-2026-05-19
- Title: Add machine-readable links from audit decisions to repair playbooks
- Task Type: planning
- Current Stage: post-release
- Status: DONE
- Owner: Planning Agent
- Depends on: `AUDIT-DECISION-REPAIR-PLAYBOOKS-2026-05-19`
- Priority: P2
- Module Confidence Rows: not applicable
- Requirement Rows: `REQ-ARCH-028`, `REQ-AI-030`
- Quality Scenario Rows: Architecture/source-of-truth integrity
- Risk Rows: `RISK-028`, `RISK-030`
- Iteration: 2026-05-19 audit continuation
- Operation Mode: ARCHITECT
- Mission ID: FULL-REUSABLE-AUDIT-2026-05-19
- Mission Status: BLOCKED

## Context

The Markdown audit rollup and state indexes referenced the decision repair
playbooks, but the machine-readable JSON rollup and decision packet did not.

## Goal

Make automation and future agents able to discover the post-decision repair
playbooks from JSON artifacts.

## Scope

- `docs/operations/full-reusable-audit-rollup-2026-05-19.json`
- `docs/operations/audit-decision-packet-2026-05-19.json`

## Definition of Done

- [x] Rollup JSON links to the repair playbooks.
- [x] Decision packet JSON links to the repair playbooks.
- [x] JSON parse and guardrails pass.

## Forbidden

- accepting an architecture decision
- changing runtime behavior
- production or LIVE/exchange mutation

## Validation Evidence

- Reality status: blocked on explicit user decisions.
- JSON parse: required after edit.
- No runtime behavior changed.

## Result Report

Added `decisionRepairPlaybooks` / `repairPlaybooks` links so the decision
packet, rollup, and playbook chain is machine-readable.

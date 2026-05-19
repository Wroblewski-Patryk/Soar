# Task

## Header
- ID: REUSABLE-AUDIT-MANIFEST-CHECK-COMMAND-2026-05-19
- Title: Add reusable manifest validation command
- Task Type: planning
- Current Stage: verification
- Status: DONE
- Owner: Planning Agent
- Depends on: `REUSABLE-AUDIT-ARTIFACT-MANIFEST-2026-05-19`
- Priority: P2
- Module Confidence Rows: not applicable
- Requirement Rows: audit/source-of-truth continuity
- Quality Scenario Rows: documentation traceability
- Risk Rows: `RISK-036`
- Iteration: 2026-05-19 audit continuation
- Operation Mode: ARCHITECT
- Mission ID: FULL-REUSABLE-AUDIT-2026-05-19
- Mission Status: BLOCKED

## Context

The manifest path existence check was first run as an inline Node command. A
future rerun should not require copying inline code from chat or task notes.

## Goal

Add a reusable repository command that validates the reusable audit manifest.

## Scope

- `scripts/checkReusableAuditManifest.mjs`
- `package.json`
- `docs/operations/reusable-audit-artifact-manifest-2026-05-19.md`
- `docs/planning/reusable-audit-manifest-path-check-2026-05-19-task.md`

## Definition of Done

- [x] `corepack pnpm run audit:manifest:check` exists.
- [x] Command validates JSON parse, `AUD-00` through `AUD-23` coverage,
  referenced path existence, and decision packet/playbook links.
- [x] Command has focused regression tests for missing IDs, duplicates,
  missing paths, and missing decision links.
- [x] Command passes on the current manifest.
- [x] Guardrails and diff check pass.

## Forbidden

- accepting architecture decisions
- changing runtime behavior
- production or LIVE/exchange mutation

## Validation Evidence

- `corepack pnpm run audit:manifest:check`: PASS.
- `corepack pnpm run audit:manifest:check:test`: PASS.
- `corepack pnpm run docs:parity:check`: PASS.
- `corepack pnpm run quality:guardrails`: PASS.
- `git diff --check`: PASS with line-ending warnings only.

## Result Report

Added a reusable manifest validation command and focused regression tests for
future audit reruns.

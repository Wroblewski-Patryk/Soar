# Task

## Header

- ID: LUC-633
- Title: Missing-doc evidence map from app-completion baseline
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Chief Assets Officer
- Depends on: [LUC-629](/LUC/issues/LUC-629)
- Priority: P1
- Module Confidence Rows: Account access, Exchange connection and configuration, Trading operation, Dashboard overview
- Requirement Rows: App-completion missing-doc source-truth routing
- Quality Scenario Rows: Documentation/source-truth traceability
- Risk Rows: App-completion overclaim / scanner mapping noise
- Iteration: 2026-07-12 heartbeat
- Operation Mode: BUILDER
- Mission ID: LUC-633-MISSING-DOC-EVIDENCE-MAP-2026-07-12
- Mission Status: VERIFIED

## Context

The app-completion baseline reports a large `missing_doc_link` backlog even
though architecture-awareness has no actionable missing architecture links.

## Goal

Create a durable repair map that separates real docs gaps from scanner mapping
noise and points each V1-critical flow to the narrowest source-truth target.

## Scope

- `docs/modules/api-auth.md`
- `docs/architecture/relations/documentation-links.csv`
- `docs/architecture/scanner-overrides.json`
- `docs/status/app-completion-index.*`
- `docs/status/project-truth-index.*`
- `history/evidence/luc-633-missing-doc-evidence-map-2026-07-12.md`

## Implementation Plan

1. Read the current app-completion and project-truth baseline.
2. Map the V1-critical missing-doc flows to source-truth files and owner lanes.
3. Repair the first real Account access doc-link pair for auth session TTL helpers.
4. Refresh known-state outputs and verify row-level routing.
5. Record evidence and residual next rows.

## Acceptance Criteria

- Missing-doc rows are classified as real docs gaps, proof-link rows, or mapping noise.
- Narrow source-truth files are named.
- A durable evidence table records capability, source, status, and next owner.
- No product/runtime/deploy/protected mutation occurs.

## Definition of Done

- Evidence packet written.
- Relevant source-truth links added for the selected real Account access rows.
- Known-state validation passes.
- Issue can close without claiming global app completion.

## Validation Evidence

- Tests: not applicable; docs/source-truth mapping only.
- Commands:
  - `corepack pnpm exec prettier --write docs/modules/api-auth.md docs/architecture/scanner-overrides.json docs/architecture/relations/documentation-links.csv`
  - `corepack pnpm run architecture:graph:generate`
  - `corepack pnpm run ops:project:known-state`
- Manual checks:
  - app-completion readback removed `auth.session.ts#getSessionJwtExpiresIn` and `auth.session.ts#getSessionTtlMs` from the priority review queue.
  - project-truth first gap is now Account access `sessionToken.test.ts#makeRequest`.
- Reality status: verified

## Architecture Evidence

- Architecture source reviewed: `docs/status/architecture-awareness-report.md`, `docs/status/app-completion-index.md`, `docs/status/project-truth-index.md`, `docs/architecture/relations/documentation-links.csv`, `docs/architecture/scanner-overrides.json`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Security / Privacy Evidence

- Data classification: repository documentation and generated status only.
- Secret handling: no secrets, credentials, cookies, account values, payment data, exchange keys, or protected production inputs read or written.
- Fail-closed behavior: no completion claimed for rows that still need QA/browser/protected proof.

## Result Report

- Task summary: created the missing-doc evidence repair map and repaired the first two real Account access auth-session doc-link rows.
- Files changed: source-truth docs/relations/overrides, generated status/graph outputs, and LUC-633 evidence/task artifacts.
- How tested: known-state refresh, guardrails, docs parity, strict graph/journey checks, app-completion/project-truth readback.
- What is incomplete: global missing-doc backlog remains; current next row is `sessionToken.test.ts#makeRequest`, likely a test-helper mapping/noise classification row.
- Next steps: Docs Memory Lead + Project Manager continue Account access classification using the repair rules in the evidence packet.

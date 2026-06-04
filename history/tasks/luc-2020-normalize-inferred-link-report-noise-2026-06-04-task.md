# Task

## Header
- ID: LUC-2020
- Title: Normalize inferred link report noise for aggregate routes and generated/config files
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Docs Memory Lead
- Depends on: LUC-2019
- Priority: P2
- Module Confidence Rows: Architecture Evidence Graph
- Requirement Rows: not applicable
- Quality Scenario Rows: QAS-DOC-020
- Risk Rows: architecture audit false-positive triage noise
- Iteration: 2026-06-04
- Operation Mode: BUILDER
- Mission ID: LUC-2020-NORMALIZE-INFERRED-LINK-REPORT-NOISE-2026-06-04
- Mission Status: VERIFIED

## Context
The architecture-awareness report listed raw inferred missing test/doc links in
the top samples. Curated graph-covered API routes, aggregate router mount rows,
generated docs-vault plugin JavaScript, and config/resource files were
dominating the report, which obscured actionable gaps.

## Goal
Keep raw inferred-link counts inspectable while separating accepted noise from
the actionable top missing-link samples.

## Constraints
- No runtime or product behavior changes.
- No route behavior changes.
- No deploy, push, production access, protected smoke, secret, account, or
  live-trading action.
- Preserve raw counts instead of hiding gaps.

## Definition of Done
- [x] Raw inferred missing test/doc counts remain visible.
- [x] Actionable missing test/doc samples exclude accepted aggregate,
      curated-covered, generated/vendor, and config/resource noise.
- [x] Generated Soar architecture-awareness exports are refreshed.
- [x] Project-native architecture drift verification passes.

## Forbidden
- Greenwashing by deleting raw gap counts.
- Runtime/product code mutation.
- Deploy, push, restart, rollback, env, database, account, secret, protected
  smoke, or live-trading action.

## Validation Evidence
- Tests:
  - `node --check C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs` -> PASS.
  - `node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar` -> PASS; refreshed `docs/graphs/*` and `docs/status/*` architecture-awareness exports.
  - focused architecture-health readback -> PASS:
    - raw missing tests `7681`; actionable missing tests `940`.
    - raw missing docs `976`; actionable missing docs `241`.
    - classified inferred-link noise `7322`.
    - noise reasons: `curated_graph_covered=1481`, `generated_vendor_docs_vault_plugin=5775`, `config_only_file=65`, `top_level_app_mount=1`.
    - top actionable samples contain no auth/upload/root/dashboard/admin API false-positive matches.
  - `pnpm run architecture:graph:drift:strict` -> PASS (`820/820` covered, `0` missing).
- Manual checks:
  - `docs/status/architecture-awareness-report.md` now includes raw/actionable health lines, `Classified Inferred-Link Noise`, and `Top Classified Noise Samples`.
- High-risk checks:
  - No runtime/product/deploy/protected/secret/account/live-trading action performed.
- Module confidence ledger updated: yes.
- Reality status: verified.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/graphs/architecture-awareness.json`
  - `docs/graphs/architecture-health.json`
  - `docs/status/architecture-awareness-report.md`
  - `docs/graphs/architecture-graph.json`
  - `docs/architecture/registry/*`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates:
  - Architecture-awareness report and health exports refreshed.

## Result Report
- Implemented report-level inferred-link noise classification in the
  Softwarehouse architecture-awareness scanner.
- Preserved raw signal keys in `architecture-health.json` and added actionable
  signal keys plus classified noise detail.
- Refreshed Soar generated architecture-awareness artifacts.
- No child issue is required from this lane; remaining actionable top gaps are
  now mostly shared UI/component documentation/test triage candidates.

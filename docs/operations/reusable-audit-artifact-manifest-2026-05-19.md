# Reusable Audit Artifact Manifest - 2026-05-19

## Purpose

This manifest is the navigation layer for the 2026-05-19 reusable audit run.
It maps stable audit IDs to their current status and primary artifacts so a
future rerun can compare improvement or regression without searching the whole
repository.

Machine-readable pair:

- `docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`

Rerun playbook pair:

- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.md`
- `docs/operations/reusable-audit-rerun-playbook-2026-05-19.json`

Tooling index pair:

- `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- `docs/operations/reusable-audit-tooling-index-2026-05-19.json`

## Source Chain

- Registry: `docs/analysis/reusable-audit-registry.md`
- Baseline: `docs/analysis/audit-baseline-2026-05-19.md`
- Rollup: `docs/operations/full-reusable-audit-rollup-2026-05-19.md`
- Handoff: `docs/operations/full-reusable-audit-handoff-2026-05-19.md`
- Current `AUD-19` operator unblock packet:
  `docs/operations/v1-operator-unblock-packet-dd1a1faf-2026-05-19.md`
- Rerun playbook: `docs/operations/reusable-audit-rerun-playbook-2026-05-19.md`
- Tooling index: `docs/operations/reusable-audit-tooling-index-2026-05-19.md`
- Decision packet: `docs/operations/audit-decision-packet-2026-05-19.md`
- Repair playbooks: `docs/operations/audit-decision-repair-playbooks-2026-05-19.md`

## Current Summary

- Current/current-local: `23`
- Partial: `0`
- Failed decision-required: `0`
- Deferred: `1` (`AUD-21`)
- Production/LIVE/exchange mutation run by this manifest: `none`

## Resolved Decisions

- `DEC-AUD-001`: accepted Binance + Gate.io as current implementation scope,
  with production/live claims still evidence-bound by exact exchange, market
  type, and operation.
- `DEC-AUD-002`: accepted assistant foundation/dry-run as current scope, with
  BACKTEST/PAPER/LIVE hot-path assistant orchestration deferred to later gated
  work.

## Safety Boundaries

- No production data mutation.
- No LIVE order submit/cancel/close.
- No exchange-side mutation.
- Architecture decisions `DEC-AUD-001` and `DEC-AUD-002` were applied to source
  truth docs and audit artifacts.
- No runtime behavior changed by this manifest.

## Validation

Validate this manifest with:

- `corepack pnpm run audit:manifest:verify`
- `corepack pnpm run audit:manifest:check`
- `corepack pnpm run audit:manifest:check:test`
- `corepack pnpm run audit:manifest:compare -- --base docs/operations/reusable-audit-artifact-manifest-2026-05-19.json --target docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`
- `corepack pnpm run audit:manifest:compare:test`
- `corepack pnpm run audit:rerun-playbook:check`
- `corepack pnpm run audit:rerun-playbook:check:test`
- JSON parse for `docs/operations/reusable-audit-artifact-manifest-2026-05-19.json`
- manifest path existence check
- `corepack pnpm run docs:parity:check`
- `corepack pnpm run quality:guardrails`
- `git diff --check`

Latest path check:

- `87` manifest paths checked
- `0` missing paths
- `corepack pnpm run audit:manifest:verify` PASS after `DEC-AUD-001` and
  `DEC-AUD-002` acceptance
- Open decisions: `0`
- `corepack pnpm run audit:manifest:check` PASS
- `corepack pnpm run audit:manifest:check:test` PASS
- self-comparison with `corepack pnpm run audit:manifest:compare` PASS
- `corepack pnpm run audit:manifest:compare:test` PASS
- `corepack pnpm run audit:rerun-playbook:check` PASS
- `corepack pnpm run audit:rerun-playbook:check:test` PASS

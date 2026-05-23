# Audit Decision Implementation Task - 2026-05-19

## Context

The reusable audit mission found two source-of-truth discrepancies that needed
explicit direction:

- `AUD-01`: high-level architecture wording still said Binance-only or one
  exchange family, while exchange contracts and code support Binance + Gate.io.
- `AUD-20`: assistant architecture described BACKTEST/PAPER/LIVE hot-path
  orchestration, while audited implementation proves assistant config,
  deterministic orchestrator behavior, and dry-run diagnostics only.

The user accepted:

- Binance + Gate.io for `AUD-01`, not Binance-only.
- Assistant hot-path orchestration later for `AUD-20`; current truth is
  foundation/dry-run.

## Goal

Apply the accepted decisions to architecture, audit state, and reusable audit
artifacts without changing runtime behavior or claiming production readiness.

## Scope

- Record `DEC-AUD-001` and `DEC-AUD-002` in the decision register.
- Update architecture docs so exchange scope and assistant scope match audited
  implementation truth.
- Update reusable audit rollup, manifest, decision packet, and remediation plan
  so reruns start from resolved decision state.
- Keep `AUD-19` production release refresh as a later gate before any new
  production readiness claim.

## Constraints

- Repository artifacts remain in English.
- No production journey.
- No LIVE order submit/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- No runtime behavior changes.

## Implementation Plan

1. Update architecture overview/domain exchange-scope wording to Binance +
   Gate.io with evidence-bound production/live readiness.
2. Narrow assistant runtime docs to current foundation/dry-run scope and keep
   hot-path orchestration as future gated scope.
3. Update decision and audit artifacts to show `AUD-01` and `AUD-20` resolved
   for current architecture truth.
4. Run audit manifest, docs parity, guardrail, and focused exchange/assistant
   validation where feasible.

## Acceptance Criteria

- `DEC-AUD-001` and `DEC-AUD-002` are durable project memory.
- Architecture docs no longer claim Binance-only current scope.
- Architecture docs no longer claim current hot-path assistant trading
  authority.
- Audit rollup and manifest no longer list `AUD-01` or `AUD-20` as open
  decision failures.
- Validation commands pass or record exact blockers.

## Definition of Done

- Source-of-truth docs and reusable audit artifacts are internally consistent.
- `AUD-19` remains explicitly future/later until a fresh production release gate
  is rerun.
- Safety boundaries remain unchanged: no production mutation and no exchange
  mutation.

## Result Report

Status: verified.

Files updated:

- architecture overview/domain and assistant runtime docs
- decision register
- reusable audit rollup, manifest, decision packet, handoff, and audit reports
- requirements, risk, known-issues, system-health, project-state, task-board,
  next-steps, and documentation-drift state

Runtime impact: none. The task changed source-of-truth and audit artifacts only.

Safety result:

- No production journey run.
- No LIVE order submit/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.

Validation:

- `corepack pnpm run audit:manifest:verify` PASS.
- `corepack pnpm run docs:parity:check` PASS.
- Exchange focused API tests PASS: `4` files / `21` tests.
- Assistant focused API tests PASS: `2` files / `6` tests.
- Assistant focused Web route tests PASS: `2` files / `3` tests.
- `corepack pnpm run quality:guardrails` PASS.
- `git diff --check` PASS with line-ending warnings only.
- Cleanup checks: no `chrome-headless-shell`, no listeners on local `5432` or
  `6379`, and `docker compose ps` showed no running services.

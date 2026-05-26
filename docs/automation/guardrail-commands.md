# Guardrail Commands

Last updated: 2026-05-26

## Purpose

List commands that validate project health and should be run before important
handoffs, releases, or broad autonomous work.

## Commands

| Command | Purpose | When to run | Expected evidence |
| --- | --- | --- | --- |
| `pnpm run ops:project:known-state` | Refresh the operational knowledge baseline in the required dependency order: architecture graph, graph drift, journey indexes, docs parity, repository guardrails, project index, static issue scan, V1 master ledger, and V1 scorecard. | Before broad autonomous work, after major audit updates, and before handing Soar back to Paperclip for next-lane routing. | Updated `docs/status/*`, `docs/graphs/*`, `docs/architecture/indices/*`, `history/audits/project-index-<date>.*`, `history/audits/v1-static-issue-scan-<date>.*`, `history/audits/v1-master-state-ledger-<date>.*`, and `history/releases/v1-completion-scorecard-<date>.*`. |
| `pnpm run architecture:graph:drift:strict` | Verify representative architecture graph coverage has no missing paths. | After architecture graph changes or code surface changes. | Passing output with `0 missing`. |
| `pnpm run architecture:journey:index:strict` | Refresh function journey and user action indexes and fail on critical gaps. | After route, API, component, or workflow changes. | Passing output plus high-gap counts for follow-up triage. |
| `pnpm run docs:parity:check` | Verify API/Web/routes documentation parity. | After docs, route, module, or generated-map changes. | Passing output with no missing/stale modules or routes. |
| `pnpm run quality:guardrails` | Run repository guardrails for graph drift, lockfile policy, file budgets, source policies, env policy, and secret argv policy. | Before commits and broad handoffs. | Passing output. |
| `pnpm run qa:smoke-e2e:repeatable -- --checks web,api,backtests` | Run repeatable QA smoke packs and persist evidence. | When QA lane is unblocked and local/prod-safe inputs exist. | `history/artifacts/qa-repeatable-smoke-e2e-<date>.json` and `history/evidence/qa-repeatable-smoke-e2e-<date>.md`. |

## Rule

If a guardrail command is flaky or environment-dependent, document the required
environment and the fallback proof.

Do not run `ops:project:index`, `ops:project:scan`, `ops:project:ledger`, and
`ops:project:scorecard` in parallel. They are ordered dependencies; use
`pnpm run ops:project:known-state` instead.

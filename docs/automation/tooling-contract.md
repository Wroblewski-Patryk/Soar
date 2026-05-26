# Tooling Contract

Last updated: 2026-05-26

## Purpose

Define which commands, scripts, MCP tools, provider actions, and automations
agents may use.

This contract complements `docs/operations/approval-aware-agent-command-flow.md`.

## Principles

- Prefer read-only discovery before writes.
- Risky commands need explicit policy and evidence.
- Missing command classification means risky by default.
- Agents must not bypass project APIs or service boundaries.

## Command Catalog

Use `agent-command-catalog.csv` as the machine-readable index.

## Known-State Refresh Contract

Agents must use `pnpm run ops:project:known-state` for broad Soar status
refreshes. It serializes dependent generators so project index, static scan,
master ledger, and scorecard cannot race each other.

The command is allowed to update generated docs/status, graph/index, audit, and
release evidence files. It does not prove protected production behavior by
itself; production, auth-sensitive, exchange, Coolify, and live-account checks
still require the relevant Ops/Security/QA gate and redacted evidence.

## Maintenance Rule

When a new script, command route, MCP action, or provider operation is exposed
to agents, add it to the catalog with safety classification.

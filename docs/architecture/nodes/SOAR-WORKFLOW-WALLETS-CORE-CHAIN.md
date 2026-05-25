---
id: SOAR-WORKFLOW-WALLETS-CORE-CHAIN
name: "Wallets core execution workflow"
type: workflow
status: verified_local
layer: fullstack
module: wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Wallets core execution workflow

| Field | Value |
| --- | --- |
| Description | Workflow from wallet UI through Web service API routes controller DTO service exchange adapter ledger DB tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-WALLETS-CORE.md |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-WALLETS]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-WALLETS-LIST]], [[SOAR-PAGE-WALLET-CREATE]], [[SOAR-PAGE-WALLET-EDIT]], [[SOAR-PAGE-WALLET-PREVIEW]] |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-RESET-PAPER]], [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-WALLETS-API]], [[SOAR-TEST-WALLETS-WEB]], [[SOAR-TEST-WALLET-LEDGER]] |
| Docs related | [[SOAR-DOC-API-WALLETS]], [[SOAR-DOC-WEB-WALLETS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for P0 Wallets slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.

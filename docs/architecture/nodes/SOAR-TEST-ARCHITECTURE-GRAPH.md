---
id: SOAR-TEST-ARCHITECTURE-GRAPH
name: "Architecture graph generator check"
type: test
status: in_progress
layer: testing
module: architecture
feature: architecture-map
risk_level: 35
completion_percent: 2026-05-24
last_verified_at: implemented_not_verified
verification_status: Run with pnpm run architecture:graph:generate.
tags: [soar-map, test, testing, in_progress]
---

# Architecture graph generator check

| Field | Value |
| --- | --- |
| Description | Generator validation that CSV records link to known nodes and files then emits Obsidian and JSON graph outputs. |
| File path | scripts/generateArchitectureGraph.mjs |
| Related files |  |
| Parent | [[SOAR-FEATURE-ARCHITECTURE-EVIDENCE-GRAPH]] |
| Children |  |
| Depends on | [[SOAR-DOC-ARCHITECTURE-GRAPH-SYSTEM]] |
| Used by | [[SOAR-FEATURE-ARCHITECTURE-EVIDENCE-GRAPH]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related |  |
| Docs related |  |
| Agent related | [[medium]] |
| Notes |  |

## Relations

- verified_by <- [[SOAR-FEATURE-ARCHITECTURE-EVIDENCE-GRAPH]] (in_progress)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.

# LUC-2291 - Investigate soar-api Node Heap OOM Root Cause

## Header
- ID: LUC-2291
- Title: Investigate soar-api Node heap OOM crash root cause
- Task Type: research
- Current Stage: verification
- Status: DONE
- Owner: Backend API Engineer
- Depends on: [LUC-2279](/LUC/issues/LUC-2279)
- Priority: P0
- Module Confidence Rows: SOAR-BOT-RUNTIME-001
- Requirement Rows: REQ-FUNC-003, REQ-FUNC-021
- Risk Rows: RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25
- Operation Mode: BUILDER
- Mission ID: LUC-2291-SOAR-API-HEAP-OOM-ROOT-CAUSE-2026-06-05
- Mission Status: PARTIALLY_VERIFIED

## Context

[LUC-2279](/LUC/issues/LUC-2279) retrieved redacted host-level Docker evidence for the
May 31 `soar-api` crash window. The retained crash signature is V8 Mark-Compact
allocation pressure near a roughly 2044 MB heap, followed by Node fatal
`JavaScript heap out of memory` at `2026-05-31T21:07:45.498997780Z`. The API
then restarted, ran Prisma migration deploy with no pending migrations, and
emitted `server_started` at `2026-05-31T21:08:00.015720071Z`.

## Goal

Tie the OOM to the most likely backend API code/runtime path or mark it unknown
with evidence, then define the smallest safe durable fix lane.

## Scope

- `apps/api/src/index.ts`
- `apps/api/scripts/start-with-migrate.mjs`
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionTradesRead.repository.ts`
- Project state/risk/history evidence related to runtime aggregate OOM

## Implementation Plan

1. Read scoped issue and predecessor evidence.
2. Rule out startup/migration failure from API entrypoint and host-log sequence.
3. Check existing source truth for prior production OOM classifications.
4. Inspect runtime aggregate and nested runtime read paths for fanout and
   unbounded in-memory materialization.
5. Create a bounded implementation follow-up when the safe fix is larger than
   this investigative heartbeat.

## Acceptance Criteria

- Root-cause hypothesis is tied to specific API code/runtime paths or explicitly
  marked unknown with evidence.
- Proposed fix/mitigation has verification and rollback notes.
- If not implemented in this heartbeat, exact implementation child lane exists.

## Definition Of Done

- Investigation packet created.
- Source-of-truth risk and project evidence reviewed.
- Paperclip issue receives final disposition with child follow-up.

## Findings

Root-cause classification: partially verified, likely runtime aggregate memory
pressure.

Evidence chain:

- The crash was not an API boot/migration failure. The restart path after OOM
  ran `prisma migrate deploy` successfully and then emitted `server_started`.
- Existing project source truth already records
  `RISK-PROD-RUNTIME-AGGREGATE-OOM-2026-05-25`: production logs showed heap
  out-of-memory restarts and 500s around
  `/dashboard/bots/:id/runtime-monitoring/aggregate`.
- Commit `287e77a1ef6aa79396cb485dafcf8d17a0fce033` is an ancestor of both
  current `HEAD` and deployed crash SHA `6839cd6b8884e26eca735ce32cea98c1dadccfbe`.
  That means the May 31 crash happened after the first fanout mitigation was
  already present.
- Current aggregate guardrails limit session fanout, add small concurrency, and
  skip failed per-session rows, but the nested session readers still materialize
  large trade sets in memory:
  - `listBotRuntimeSessionPositions` loads all matching lifecycle trades for a
    session window through `listRuntimePositionTradeRows`, then groups and
    repeatedly filters/sorts those arrays while mapping visible position rows.
  - `listBotRuntimeSessionTrades` loads all scoped trades through
    `listRuntimeTradeRows`, enriches and sorts the whole collection, computes
    totals/fees, and only then slices the visible page.
- `Promise.race` timeout in aggregate protects the response path, but it does
  not cancel an already-running Prisma query or prevent Node from allocating the
  returned row set.

## Proposed Durable Fix

Backend child lane:

1. Split runtime trades read model into bounded visible-row queries plus
   separate count/sum aggregate queries.
2. For runtime positions, cap lifecycle/support trade materialization around
   visible positions and session window; preserve existing count/summary
   semantics through DB aggregates where totals are needed.
3. Keep `runtime-monitoring/aggregate` response semantics stable: visible arrays
   stay limited, totals remain truthful, and failed per-session rows still fail
   closed.
4. Add regression coverage that proves large hidden trade history does not
   require loading all trade rows into application memory.

Rollback/safety:

- Revert the bounded-query patch if aggregate totals or runtime history parity
  regress.
- No production mutation is required for code review; production deploy/SLO
  remains Ops-owned.

## Validation Evidence

- `git merge-base --is-ancestor 287e77a1 HEAD` -> pass.
- `git merge-base --is-ancestor 287e77a1 6839cd6b8884e26eca735ce32cea98c1dadccfbe` -> pass.
- Source inspection of API entrypoint, start wrapper, runtime aggregate service,
  runtime positions reader, runtime trades reader, predecessor evidence, risk
  register, requirements matrix, module confidence ledger, project state, and
  task board.

## Result Report

- Task summary: root cause is most likely bot runtime monitoring aggregate
  nested trade materialization under production history size, not boot,
  migration, healthcheck, or deploy startup.
- Files changed: this investigation packet and companion evidence packet.
- How tested: source inspection and git ancestry checks listed above.
- What is incomplete: exact application request/log row at May 31 crash time is
  unavailable; durable code fix needs a child backend implementation lane.
- Next steps: implement bounded runtime aggregate/trade/position materialization
  and rerun focused aggregate tests plus production SLO after Ops deploy.

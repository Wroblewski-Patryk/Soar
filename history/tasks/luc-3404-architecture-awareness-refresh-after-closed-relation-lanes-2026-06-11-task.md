# LUC-3404 Architecture Awareness Refresh After Closed Relation Lanes - 2026-06-11

## Context

Child of [LUC-3397](/LUC/issues/LUC-3397). The pre-refresh
`docs/status/architecture-awareness-report.md` was generated at
`2026-06-11T02:22:02.917Z` and still listed local-safe missing-test rows already
closed by [LUC-3381](/LUC/issues/LUC-3381) and
[LUC-3389](/LUC/issues/LUC-3389). Direct scanner-readable relation rows already
existed in `docs/architecture/relations/priority-test-links.csv`.

## Goal

Refresh the Softwarehouse architecture-awareness exports for Soar, verify stale
closed-lane rows disappeared from the report, and name the next non-duplicate
actionable missing-test family with owner, proof, and protected-gate status.

## Constraints

- Documentation Steward lane only: docs memory, evidence, generated graph
  awareness outputs, and Paperclip routing.
- Do not deploy, push, restart, rollback, run protected smoke, access secrets,
  mutate env/database/accounts/exchange state, place orders, change payments, or
  touch live-trading state.
- Preserve unrelated dirty worktree changes from other active lanes.

## Stage

`verification` / `post-refresh memory sync`.

## Implementation Plan

1. Read Paperclip issue context and Soar architecture-awareness state.
2. Run the canonical Softwarehouse refresh from
   `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse` against the Soar
   root.
3. Read back generated report timestamp, missing-test counts, stale-row
   absence, and direct relation rows.
4. Create a bounded QA follow-up for the next non-duplicate local-safe family.
5. Update Soar source-of-truth memory and close [LUC-3404](/LUC/issues/LUC-3404).

## Acceptance Criteria

- Fresh report timestamp recorded.
- Stale [LUC-3381](/LUC/issues/LUC-3381) and
  [LUC-3389](/LUC/issues/LUC-3389) rows are absent from
  `docs/status/architecture-awareness-report.md`.
- Next non-duplicate top actionable missing-test family is named with owner,
  proof, and protected-gate status.

## Definition Of Done

- Architecture-awareness refresh command passes.
- Report and relation-row readbacks pass.
- Follow-up is delegated when implementation belongs outside Docs Memory.
- Source-of-truth state is updated.

## Forbidden

- No production mutation, secret printing, protected smoke, deploy, push,
  restart, rollback, database mutation, account/payment mutation, exchange
  mutation, order/position mutation, or live-trading action.
- No duplicate child issue for already closed relation lanes.

## Result Report

Status: `DONE / VERIFIED_GENERATED / DELEGATED_NEXT_FAMILY`.

Refresh command passed:

```powershell
node scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar
```

Run location: `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse`.

Fresh report readback:

- Generated: `2026-06-11T03:02:36.574Z`
- Entities: `9404`
- Relations: `29798`
- Files scanned: `9777`
- Actionable missing-test links: `72`
- Actionable missing-doc links: `0`
- Ownerless entities: `0`
- Disconnected entities: `0`

Closed-lane readback:

- `rg` against `docs/status/architecture-awareness-report.md` for
  `runV1StaticIssueScan`, `runV1StageRehearsal`, `LUC-3381`, and `LUC-3389`
  returned no matches.
- Direct relation readback found `24` rows in
  `docs/architecture/relations/priority-test-links.csv`: `22` rows for
  [LUC-3381](/LUC/issues/LUC-3381) and `2` rows for
  [LUC-3389](/LUC/issues/LUC-3389).

Next non-duplicate family:

- Owner: [09 QVE (QA & Verification Engineer)](/LUC/agents/09-qve-qa-verification-engineer).
- Follow-up: [LUC-3410](/LUC/issues/LUC-3410).
- Family: `scripts/runWebNextProductionCommand.mjs#run`.
- Expected proof: focused local wrapper test using injected/spied child-process
  behavior, direct relation row or explicit classification, syntax check,
  focused `node --test`, relation readback, graph generation or precise
  blocker, and guardrails as appropriate.
- Protected-gate status: `local-safe`; no real Next server, protected browser
  proof, deploy, restart, rollback, secrets, env, DB, account, exchange, order,
  position, payment, subscription, or live-trading mutation.

Residual risk:

- The top report still starts with protected/browser proof families. Those were
  not reopened as duplicate local helper lanes because they require protected or
  browser/process evidence paths, not fake unit-test relation rows.

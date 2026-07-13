# LUC-902 Account Access listBotRuntimeSessions Proof

Date: 2026-07-13
Owner: 09 TAE (Test Automation Engineer)
Issue: [LUC-902](/LUC/issues/LUC-902)

## Scope

Prove the Account access missing-test-link rows for:

- `apps/api/src/modules/bots/bots.controller.ts#listBotRuntimeSessions`
- `apps/api/src/modules/bots/runtimeSessionRead.service.ts#listBotRuntimeSessions`

## Changed

- Linked the controller entity to the existing executable route proof in
  `apps/api/src/modules/bots/bots.e2e.test.ts` through
  `docs/architecture/relations/priority-test-links.csv`.
- Added a focused no-DB spec
  `apps/api/src/modules/bots/runtimeSessionRead.list.test.ts` for the read
  service row.
- Added verified scanner overrides and explicit `tests` relation overrides for
  both scoped entities in `docs/architecture/scanner-overrides.json`.
- Refreshed architecture-awareness, app-completion, and project-truth outputs
  in the required serial order.

## Verification

- Focused read-service proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/runtimeSessionRead.list.test.ts --run --reporter=dot`
  - Result: `1` file passed, `2` tests passed.
  - Covered behavior:
    - fail-closed `null` result when the selected user does not own the bot;
    - status and limit forwarding into the runtime session summary query for an
      owned bot.
- Focused controller proof:
  - PASS:
    `corepack pnpm --filter api exec vitest run src/modules/bots/bots.e2e.test.ts --run -t "lists and returns runtime session monitoring summary with ownership isolation" --reporter=dot --test-timeout 30000`
  - Result: `1` test passed, `26` skipped.
  - Covered behavior:
    - owner `GET /dashboard/bots/:id/runtime-sessions` returns the session
      list, summary metrics, and filtered empty result for a mismatched status;
    - non-owner access to the same bot runtime-sessions route fails closed with
      `404`.
- Sequential source-truth refresh:
  - PASS:
    `build-architecture-awareness-index.mjs`
    -> `10835` entities / `35529` relations.
  - PASS:
    `build-app-completion-index.mjs`
    -> `missingTestLink=972`, `missingDocLink=1985`.
  - PASS:
    `build-project-truth-indexes.mjs --apply`.

## Readback

- `docs/graphs/architecture-awareness.json` now marks both scoped entities
  `verified` and includes direct test evidence to:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/api/src/modules/bots/runtimeSessionRead.list.test.ts`
- `docs/status/app-completion-index.json` now reports:
  - controller row -> `status=verified`, `hasTest=true`, `hasDoc=false`,
    `risk=missing_doc_link`
  - read-service row -> `status=verified`, `hasTest=true`, `hasDoc=false`,
    `risk=missing_doc_link`
- `docs/status/project-truth-index.json` no longer routes either scoped entity
  as `missing_test_link`; both now sit in docs-owned `missing_doc_link`.

## Result

The missing-test-link proof lane for `listBotRuntimeSessions` is closed
locally. Both the controller and the read service now have direct executable
proof and generated truth reflects them as docs gaps rather than test gaps.

## Follow-up

- Next owner:
  Docs Memory Lead + Project Manager.
- Remaining work:
  add direct source-truth doc links for both `listBotRuntimeSessions`
  entities if the queue chooses to close the resulting `missing_doc_link`
  rows.

## Source-Control Blocker

- Local source-control closure is not claimed from this heartbeat.
- `git status --porcelain=v1 -uall` shows a mixed dirty bundle:
  `21` modified tracked paths plus `1` untracked scoped test file.
- `git diff --check` reported line-ending warnings only, but the shared dirty
  workspace still requires a dedicated source-control closure owner before any
  commit or push claim.

## Boundary

No runtime code, deploy, push, restart, rollback, env edit, migration,
protected account/session smoke, secret/account readback, DB/Redis mutation,
exchange/payment/subscription mutation, order, position close mutation, bot
activation, or LIVE trading action occurred.

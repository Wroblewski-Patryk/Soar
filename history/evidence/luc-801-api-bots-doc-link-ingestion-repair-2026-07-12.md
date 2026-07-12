## LUC-801 API bots doc-link ingestion repair

- Date: `2026-07-12`
- Issue: [LUC-801](/LUC/issues/LUC-801)
- Scope:
  repo-side verification and closure for the api-bots doc-link ingestion family
  covering
  `apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition`
  and
  `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`.
- Boundary:
  no product runtime code change, deploy, push, restart, rollback, env edit,
  migration, protected smoke, secret/account readback, DB/Redis mutation,
  exchange/payment/subscription mutation, order/position mutation, bot
  activation, or LIVE trading action.

## Inputs integrated

- Prior proof lane:
  `history/evidence/luc-789-account-access-resolvesessionwindowend-doc-link-2026-07-12.md`
- Prior repair lane:
  `history/evidence/luc-799-repair-resolvesessionwindowend-doc-link-ingestion-2026-07-12.md`
- Prior proof lane:
  `history/evidence/luc-790-account-access-closebotruntimesessionposition-doc-link-2026-07-12.md`

## Commands

```powershell
node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-architecture-awareness-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar
node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-app-completion-index.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar
node C:\Personal\Projekty\Aplikacje\Paperclip_Softwarehouse\scripts\build-project-truth-indexes.mjs --project Soar --root C:\Personal\Projekty\Aplikacje\Soar --apply
```

## Readback

- `build-architecture-awareness-index.mjs`: PASS
  - `entities=10803`
  - `relations=35356`
  - `relationOverridesApplied=15`
- `build-app-completion-index.mjs`: PASS
  - `items=3564`
  - `missingDocLink=1982`
  - `implementedNeedsProof=114`
- `build-project-truth-indexes.mjs --apply`: PASS
  - public runtime probes passed for
    `https://soar.luckysparrow.ch`,
    `https://soar.luckysparrow.ch/api/build-info`,
    `https://api.soar.luckysparrow.ch/health`,
    and `https://api.soar.luckysparrow.ch/ready`

## Scoped results

### closeBotRuntimeSessionPosition

- `docs/graphs/architecture-awareness.json` now contains `documents` relations
  into
  `apps/api/src/modules/bots/bots.controller.ts#closeBotRuntimeSessionPosition`,
  including `docs/modules/api-bots.md`.
- `docs/status/app-completion-index.json` does not include the scoped path in
  `priorityReviewItems`.
- `docs/status/project-truth-index.json` does not include the scoped path in
  `gaps`.
- Effective state:
  the doc-link ingestion defect for this controller is resolved in generated
  repo truth.

### resolveSessionWindowEnd

- `docs/graphs/architecture-awareness.json` contains the direct `documents`
  relation from `docs/modules/api-bots.md` to
  `apps/api/src/modules/bots/botOwnership.service.ts#resolveSessionWindowEnd`.
- `docs/status/app-completion-index.json` now records:
  - `risk=implemented_needs_proof`
  - `hasDoc=true`
  - `hasTest=true`
- `docs/status/project-truth-index.json` routes the same helper as
  `implemented_needs_proof`, not `missing_doc_link`.
- Effective state:
  doc-link ingestion is resolved; the remaining work is focused proof ownership
  for QA Regression Lead + Project Manager.

## Conclusion

- `LUC-801` is complete as a repo-side ingestion repair/integration issue.
- No additional tooling bug remains for the two scoped api-bots rows.
- Residual follow-up is outside this issue's tooling scope:
  `resolveSessionWindowEnd` still needs fresh proof evidence as a separate
  `implemented_needs_proof` lane.

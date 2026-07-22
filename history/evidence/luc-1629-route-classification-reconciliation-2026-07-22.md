# LUC-1629 Route Classification Reconciliation

- Status: `partial`
- Scope:
  verify how the generated status layer currently routes
  `route:page-tsx:58248c9afe`, preserve the existing LUC-1628 browser-proof
  evidence, and classify any remaining mismatch.
- Findings:
  `docs/architecture/nodes/SOAR-PAGE-BOT-ASSISTANT.md` and
  `docs/obsidian/route-action-map.md` already classify the exact route
  `apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx` as the canonical
  selected-bot assistant surface under `AI Assistant foundation`. After the
  current generator rerun, `docs/status/project-truth-index.{md,json}` now
  places `route:page-tsx:58248c9afe` under `AI Assistant foundation`, but the
  regenerated `docs/status/app-completion-index.{md,json}` still keeps that
  exact route inside the broader `Dashboard overview` bucket. The truth-index
  rebuild also introduces an `event_chain_gap` for `AI Assistant foundation`.
- Verification:
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-app-completion-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`
  -> PASS;
  `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-project-truth-indexes.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar --apply`
  -> PASS;
  browser-proof evidence preserved in
  `history/evidence/luc-1628-local-protected-route-action-proof-matrix-2026-07-22.md`
  and `history/artifacts/luc-1628-local-protected-route-action-proof-matrix-2026-07-22.json`.
- Outcome:
  the selected assistant route is now represented as `AI Assistant foundation`
  in `project-truth-index`, but not yet in `app-completion-index`. The route
  classification mismatch is smaller and better documented, but a follow-up is
  still required before the generated indexes are fully consistent.
- Evidence:
  `docs/architecture/nodes/SOAR-PAGE-BOT-ASSISTANT.md`;
  `docs/architecture/nodes/SOAR-FEATURE-AI-ASSISTANT-FOUNDATION.md`;
  `docs/obsidian/route-action-map.md`;
  `docs/status/project-truth-index.{md,json}`;
  `docs/status/app-completion-index.{md,json}`;
  `history/evidence/luc-1628-local-protected-route-action-proof-matrix-2026-07-22.md`;
  `history/artifacts/luc-1628-local-protected-route-action-proof-matrix-2026-07-22.json`.

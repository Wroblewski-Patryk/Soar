# LUC-4005 Soar Architecture Implementation Task-Link Reconciliation

## Architecture Links

- Paperclip issue: [LUC-4005](/LUC/issues/LUC-4005).
- Parent task: [LUC-3994](/LUC/issues/LUC-3994).
- Classification: intentional baseline/core utility task-link reconciliation.
- Affected frontend and shared implementation entities:
  - `apps/web/src/features/bots/utils/trailingStopDisplay.ts`
  - `apps/web/src/features/strategies/utils/indicatorPresentation.ts`
  - `apps/web/src/features/strategies/utils/indicatorTaxonomy.ts`
  - `apps/web/src/i18n/namespaceRegistry.ts`
  - `apps/web/src/i18n/useLocaleFormatting.ts`
  - `apps/web/src/i18n/useOptionalI18n.ts`
  - `apps/web/src/lib/getAxiosMessage.ts`
  - `apps/web/src/lib/handleError.ts`
  - `apps/web/src/lib/marketStream.ts`
  - `apps/web/src/lib/navigation.ts`
  - `apps/web/src/lib/numericInput.ts`
  - `apps/web/src/lib/publicApiBaseUrl.ts`
  - `libs/shared/index.d.ts`
  - `scripts/dev-frontend.mjs`
  - `apps/web/src/features/icons/types/icon.type.ts`
  - `apps/web/src/features/profile/types/user.type.ts`
  - `apps/web/src/app/(public)/layout.tsx`
  - `apps/web/src/app/dashboard/layout.tsx`
  - `apps/web/src/app/manifest.ts`
- Affected entity ids:
  - `feature:trailingstopdisplay-ts:14d16d2336`
  - `feature:indicatorpresentation-ts:cb09a4c525`
  - `feature:indicatortaxonomy-ts:f4b970a24f`
  - `feature:namespaceregistry-ts:a155c5bc2b`
  - `feature:uselocaleformatting-ts:35610219de`
  - `feature:useoptionali18n-ts:f37737d93e`
  - `feature:getaxiosmessage-ts:b637be51b3`
  - `feature:handleerror-ts:25b3290b5e`
  - `feature:marketstream-ts:34eedab340`
  - `feature:navigation-ts:ff463cc8d4`
  - `feature:numericinput-ts:552667647f`
  - `feature:publicapibaseurl-ts:f27a89a26e`
  - `feature:index-d-ts:feee8a9219`
  - `feature:dev-frontend-mjs:083f4cc0e0`
  - `model:icon-type-ts:19b7403c39`
  - `model:user-type-ts:d593d0ce2a`
  - `route:layout-tsx:e32386369d`
  - `route:layout-tsx:8f9a684385`
  - `route:manifest-ts:37ae05034d`
- Verification command: `node C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse/scripts/build-architecture-awareness-index.mjs --project Soar --root C:/Personal/Projekty/Aplikacje/Soar`.

## Context

Stage: verification
Operation mode: ARCHITECT
Process class: delivery gap loop

The 2026-06-14 architecture graph sync left 19 actionable implementation
entities without task links. Inspection found these are frontend/shared baseline
utilities, type declarations, app shell routes, and local dev support surfaces
that should be traceable to this architecture reconciliation lane rather than
opened as new worker implementation issues.

## Goal

Close the residual implementation-to-task traceability gap for the 19 listed
entities without changing product behavior, protected runtime state, deploy
state, secrets, or production data.

## Scope

- Add scanner-readable task evidence for the 19 residual entities.
- Regenerate architecture-awareness exports through the existing scanner.
- Do not modify runtime source files.
- Do not push, deploy, restart, or run protected smoke.

## Classification

| Entity path | Classification | Follow-up worker issue |
| --- | --- | --- |
| `apps/web/src/features/bots/utils/trailingStopDisplay.ts` | Intentional baseline/core utility supporting bot trailing-stop display. | No |
| `apps/web/src/features/strategies/utils/indicatorPresentation.ts` | Intentional baseline/core utility supporting strategy indicator presentation. | No |
| `apps/web/src/features/strategies/utils/indicatorTaxonomy.ts` | Intentional baseline/core utility supporting strategy indicator taxonomy. | No |
| `apps/web/src/i18n/namespaceRegistry.ts` | Intentional baseline/core i18n registry. | No |
| `apps/web/src/i18n/useLocaleFormatting.ts` | Intentional baseline/core locale formatting utility. | No |
| `apps/web/src/i18n/useOptionalI18n.ts` | Intentional baseline/core optional i18n hook. | No |
| `apps/web/src/lib/getAxiosMessage.ts` | Intentional baseline/core API error message utility. | No |
| `apps/web/src/lib/handleError.ts` | Intentional baseline/core error handling utility. | No |
| `apps/web/src/lib/marketStream.ts` | Intentional baseline/core market stream client utility. | No |
| `apps/web/src/lib/navigation.ts` | Intentional baseline/core navigation fallback utility. | No |
| `apps/web/src/lib/numericInput.ts` | Intentional baseline/core numeric input normalization utility. | No |
| `apps/web/src/lib/publicApiBaseUrl.ts` | Intentional baseline/core public API base URL resolver. | No |
| `libs/shared/index.d.ts` | Intentional shared declaration surface. | No |
| `scripts/dev-frontend.mjs` | Intentional local dev support script. | No |
| `apps/web/src/features/icons/types/icon.type.ts` | Intentional baseline/core icon type model. | No |
| `apps/web/src/features/profile/types/user.type.ts` | Intentional baseline/core profile user type model. | No |
| `apps/web/src/app/(public)/layout.tsx` | Intentional public app shell route. | No |
| `apps/web/src/app/dashboard/layout.tsx` | Intentional dashboard app shell route. | No |
| `apps/web/src/app/manifest.ts` | Intentional PWA manifest route. | No |

## Definition of Done

- Architecture-awareness generation succeeds.
- `docs/status/task-synchronization-report.md` reports zero actionable
  implementation entities without task links, or residual rows are named.
- Closure records changed files, graph/report deltas, validation result,
  commit/no-commit decision, and deployment impact.

## Result Report

DONE on 2026-06-14 as task-link evidence only.

Evidence:

- Before count from `docs/status/task-synchronization-report.md` generated
  2026-06-14T13:47:09.217Z: `Actionable implementation entities without task
  links: 19`.
- This task file links the residual implementation entities to
  [LUC-4005](/LUC/issues/LUC-4005) through scanner-readable paths and generated
  entity ids.

Residual risk:

- This does not assert fresh behavioral verification for the linked utilities;
  it only reconciles architecture/task traceability.
- The Soar worktree had pre-existing dirty generated architecture and evidence
  files before this task; preserve unrelated dirty state during source-control
  closure.

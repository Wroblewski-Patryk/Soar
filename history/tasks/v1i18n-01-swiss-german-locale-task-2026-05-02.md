# V1I18N-01 Swiss German Locale

## Header
- ID: V1I18N-01
- Title: Add Swiss German locale across the web i18n system
- Task Type: feature
- Current Stage: release
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1UI-FLAG-01
- Priority: P1
- Iteration: 2026-05-02 operator-requested slice
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches this operator-requested builder slice.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator requested a full addition of `CH_BE - Swiss German`, not only a footer language-switcher entry. The existing web i18n architecture uses `Locale`, namespace fragments, `I18N_NAMESPACE_REGISTRY`, route namespace loading, locale persistence, and shared `LanguageSwitcher` rendering. The implementation uses the standard BCP-47 and Intl locale code `de-CH` for German (Switzerland), while preserving the operator-facing meaning of Swiss German/German Switzerland.

## Goal
Add Swiss German/German Switzerland as a first-class web locale across the switcher, locale storage, formatting, route namespace registry, translation namespace files, tests, and guardrails.

## Scope
- Web locale contract: `apps/web/src/i18n/translations.ts`, provider, formatting, route smoke, namespace registry, guardrails.
- Language switcher: footer/dashboard shared `LanguageSwitcher` option and Swiss flag icon.
- Translation namespaces: all existing web namespace lists now include `de-CH` files.
- Strategy and admin surfaces: local locale unions and fallback typing widened where the new `Locale` became reachable.
- Project truth: task board, project state, planning queue, and this task report.

## Implementation Plan
1. Register `de-CH` in supported locales, provider hydration, storage validation, security bootstrap, Intl formatting, and route tests.
2. Add the `de-CH` language option to the shared language switcher with a Swiss flag icon and localized language labels.
3. Add `de-CH` namespace files for every existing i18n namespace and wire them into the namespace registry.
4. Extend tests to prove key parity, route reachability, provider switching/hydration, switcher rendering, and locale formatting.
5. Fix uncovered parity drift in the existing Portuguese dashboard-home namespace.
6. Run focused tests, typecheck, production build, guardrails, and route-reachable i18n audit.

## Acceptance Criteria
- `de-CH` is selectable from the shared language switcher and persists through `I18nProvider`.
- Every registered namespace has a `de-CH` fragment with key parity.
- Locale formatting accepts `de-CH` through Intl.
- Existing fallback and local-copy guardrails include the new locale.
- Relevant validation passes with no route-reachable i18n findings.

## Definition of Done
- [x] `de-CH` is included in `SUPPORTED_LOCALES` and namespace registry.
- [x] All namespace files exist for `de-CH`.
- [x] Shared switcher renders the Swiss flag and Swiss German option.
- [x] Focused i18n/UI tests pass.
- [x] Web typecheck and build pass.
- [x] Repository guardrails pass.
- [x] Route-reachable i18n audit passes with zero findings.
- [x] Project source-of-truth files are updated.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New i18n systems or parallel locale loaders.
- A switcher-only change without namespace translation coverage.
- Placeholder or fake namespace fragments.
- Removing or weakening existing GB/PL/PT flag behavior.

## Validation Evidence
- Tests: `pnpm --filter web run test -- src/i18n/translations.test.ts src/i18n/namespaceRegistry.test.ts src/i18n/routeLocaleSmoke.test.ts src/i18n/I18nProvider.test.tsx src/i18n/I18nProvider.route-loading.test.tsx src/i18n/useLocaleFormatting.test.tsx src/ui/layout/dashboard/LanguageSwitcher.test.tsx src/features/strategies/presets/strategyPresets.test.ts --run` PASS (`8` files, `22` tests).
- Tests: `pnpm --filter web run typecheck` PASS.
- Tests: `pnpm --filter web run build` PASS.
- Tests: `pnpm run quality:guardrails` PASS.
- Tests: `pnpm i18n:audit:route-reachable:web` PASS (`findings=0`, `localCopy=0`, `fallbackPl=0`, `hardcoded=0`).
- Manual checks: Swiss flag option wired into the existing shared switcher option list.
- Screenshots/logs: not captured; behavior is covered by DOM-level switcher/provider tests and build.
- High-risk checks: namespace parity and route reachability checks cover missing translation lists.

## Architecture Evidence
- Architecture source reviewed: existing `apps/web/src/i18n` namespace registry, provider, route namespace map, and guardrail tests.
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none required.

## UX/UI Evidence
- Design source type: approved_snapshot
- Design source reference: existing footer/dashboard language switcher from `V1UI-FLAG-01`.
- Canonical visual target: existing flag-icon switcher behavior.
- Fidelity target: structurally_faithful.
- Stitch used: no.
- Experience-quality bar reviewed: yes, scoped to preserving existing shared pattern.
- Visual-direction brief reviewed: not applicable for this narrow locale slice.
- Existing shared pattern reused: `LanguageSwitcher`.
- New shared pattern introduced: no.
- Design-memory entry reused: existing language switcher flag behavior.
- Design-memory update required: no.
- Visual gap audit completed: yes, by preserving GB/PL/PT flags and adding CH flag branch.
- Background or decorative asset strategy: not applicable.
- Canonical asset extraction required: no.
- Screenshot comparison pass completed: no; DOM and build verification were used for this scoped change.
- Remaining mismatches: none known.
- Required states: success.
- Responsive checks: not applicable to this narrow menu-option addition; stable menu width preserved.
- Input-mode checks: pointer and keyboard-accessible button semantics preserved.
- Accessibility checks: switcher labels remain accessible through the existing button/menu contract.
- Parity evidence: namespace parity tests cover `en`, `pl`, `pt`, and `de-CH`.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not required.
- Rollback note: revert the single locale commit if the locale must be removed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: Swiss German was absent from the locale contract, switcher options, namespace registry, and translation files.
- Gaps: strategy/admin helper surfaces assumed only `en/pl/pt`.
- Inconsistencies: existing Portuguese dashboard-home namespace missed several English keys; new parity checks exposed and fixed them.
- Architecture constraints: reuse the existing namespace registry and provider model.

### 2. Select One Priority Task
- Selected task: add one first-class `de-CH` locale.
- Priority rationale: direct operator request and user-facing language switcher scope.
- Why other candidates were deferred: unrelated V1 release-gate tasks remain separate.

### 3. Plan Implementation
- Files or surfaces to modify: i18n core, namespace registry/files, switcher, tests, strategy/admin locale call sites, docs.
- Logic: register `de-CH`, load namespace fragments, localize names, and preserve fallback behavior where local UI dictionaries are partial.
- Edge cases: stored `de-CH` locale hydration, route namespace loading, Intl formatting, namespace parity.

### 4. Execute Implementation
- Implementation notes: generated `de-CH` namespace fragments from English source keys, then wired them into the existing registry and tests.

### 5. Verify and Test
- Validation performed: focused Vitest pack, web typecheck, web build, repository guardrails, route-reachable i18n audit.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: adding only a switcher entry was rejected because it would violate the operator request and i18n architecture.
- Technical debt introduced: no.
- Scalability assessment: new locale follows the existing namespace model and strengthens parity tests.
- Refinements made: widened local strategy copy typing with EN fallback and fixed Portuguese namespace parity drift.

### 7. Update Documentation and Knowledge
- Docs updated: this task report, task board, project state, planning queue.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Production-Grade Required Contract
- Goal: add a first-class Swiss German/German Switzerland locale to the web UI.
- Scope: web i18n runtime, namespace files, switcher UI, tests, documentation.
- Implementation Plan: see above.
- Acceptance Criteria: see above.
- Definition of Done: see above.
- Result Report: see below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for UI-only i18n slice.
- Real API/service path used: not applicable.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: locale hydration covered by tests.
- Regression check performed: focused i18n/provider/switcher tests and build.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: operators using language switcher and localized UI.
- Existing workaround or pain: no Swiss German/German Switzerland option.
- Smallest useful slice: one complete locale across existing web i18n surfaces.
- Success metric or signal: selectable `de-CH` with namespace parity and zero route audit findings.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: operator visual check after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable.
- Critical user journey: language switcher selection and persisted locale hydration.
- SLI: not applicable.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: production build remains green.
- Logs, dashboard, or alert route: not applicable.
- Smoke command or manual smoke: route-reachable i18n audit.
- Rollback or disable path: revert locale commit.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: public UI copy.
- Trust boundaries: browser localStorage locale value remains allow-listed.
- Permission or ownership checks: not applicable.
- Abuse cases: unsupported locale injection remains blocked by `SUPPORTED_LOCALES`.
- Secret handling: no secrets touched.
- Security tests or scans: theme bootstrap and provider allow-list updated.
- Fail-closed behavior: invalid stored locale still falls back to default.
- Residual risk: machine-assisted translations may need later human copy polish.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable.
- Memory consistency scenarios: not applicable.
- Multi-step context scenarios: not applicable.
- Adversarial or role-break scenarios: not applicable.
- Prompt injection checks: not applicable.
- Data leakage and unauthorized access checks: not applicable.
- Result: not applicable.

## Result Report
- Task summary: added `de-CH` as a first-class locale across the web i18n runtime, namespace registry, translation files, switcher, formatting, tests, and guardrails.
- Files changed: web i18n/runtime files, new `de-CH` namespace files, strategy/admin locale typing, i18n tests, and project context docs.
- How tested: focused Vitest i18n/UI pack, web typecheck, web build, guardrails, and route-reachable i18n audit.
- What is incomplete: no known implementation gap; German copy may benefit from native-speaker polish after operator review.
- Next steps: deploy the locale commit and verify the switcher visually in production.
- Decisions made: implemented the operator's `CH_BE` request as standards-compliant `de-CH`.

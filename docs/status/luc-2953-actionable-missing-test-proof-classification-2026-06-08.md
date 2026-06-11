# LUC-2953 Actionable Missing Test Proof Classification - 2026-06-08

Source:

- `docs/status/architecture-awareness-report.md`
- `docs/graphs/architecture-health.json`
- `docs/graphs/architecture-awareness.json`

Generated graph baseline: `2026-06-07T22:12:46.871Z`

## Summary

- Actionable implementation entities without inferred tests: 181
- Entity type: all 181 are `function`
- Source files involved: 23 script files under `scripts/`
- Protected production smoke was not run. This classification is local/read-only.

## Classification Counts

| Classification | Entities | Files | Disposition |
| --- | ---: | ---: | --- |
| Accept as proof-runner or manual/protected evidence entrypoint | 57 | 13 | No automated child issue required from this slice; keep evidence via the script output artifacts and protected gate rules. |
| Needs generated graph/test-link override after proof relation normalization | 26 | 4 | These helper functions belong to existing proof scripts that already produce evidence artifacts, but the graph cannot infer the proof relation yet. |
| Real automated test gap | 98 | 6 | Converted into child QA issues with exact files and proof commands. |

## Acceptable Proof Scripts Or Manual-Only Evidence

These are orchestration entrypoints or protected proof runners. Missing inferred
unit-test links are acceptable as long as the owning issue records the script
command, artifact path, and gate/approval status. They should not be treated as
product behavior gaps by themselves.

| File | Functions | Reason |
| --- | ---: | --- |
| `scripts/goLiveSmoke.mjs` | `canConnect`, `extractFailedMigrationName`, `finish`, `localInfraIsReachable`, `printLocalMigrationGuidance`, `run` | Local infra/go-live smoke wrapper; proof is the smoke command result and local infra state, not isolated helper coverage. |
| `scripts/runLocalProtectedRouteActionProof.mjs` | `createPage`, `launchBrowser`, `main`, `startWebServer` | Local browser proof harness; already has or should keep evidence through the browser proof artifact. |
| `scripts/runProdAuthSessionBrowserProof.mjs` | `createPage`, `launchBrowser`, `main` | Protected production auth-session proof; do not run without gate. Evidence is the protected proof artifact. |
| `scripts/runQaRepeatableSmokeE2e.mjs` | `hasFlag`, `readArgValue`, `runCheck` | Thin repeatable smoke command wrapper around configured checks. |
| `scripts/runRcRefreshSummaryStrict.mjs` | `main`, `parseArgs`, `run` | RC summary strict wrapper; covered by downstream gate status artifacts. |
| `scripts/runRestoreDrillEvidence.mjs` | `evidenceStamp`, `main`, `nowStamp`, `parseArgs`, `printUsage`, `readLatestByPrefix`, `run` | Restore-drill evidence collector; execution proof is an ops artifact and environment-gated. |
| `scripts/runRollbackProofEvidence.mjs` | `evidenceStamp`, `main`, `nowStamp`, `parseArgs`, `printUsage`, `renderMarkdown`, `run` | Rollback proof collector; execution proof is an ops artifact and environment-gated. |
| `scripts/runV1StageRehearsal.mjs` | `isEntrypoint`, `main` | Stage rehearsal orchestrator; proof is rehearsal output, not unit-level behavior. |
| `scripts/runWebNextProductionCommand.mjs` | `run` | Thin command wrapper. |
| `scripts/start-local-prod-like.mjs` | `gracefulShutdown`, `prefixLog`, `runStep`, `stopAll` | Local prod-like process launcher; evidence is process startup/shutdown behavior. |
| `scripts/start-workers-prod.mjs` | `gracefulShutdown`, `prefixLog`, `stopAll` | Production worker process launcher; protected/runtime-bound. |
| `scripts/waitForWebBuildInfo.mjs` | `fetchJsonWithTimeout`, `isDeployBuildIdAccepted`, `isDeployMetadataSourceAccepted`, `main`, `normalizeBaseUrl`, `normalizeNonEmptyString`, `resolveOptions`, `sleep` | Deploy wait proof utility; acceptable as deploy-gate evidence unless a future flake appears. |
| `scripts/writeWebBuildMetadata.mjs` | `main` | Single-purpose build metadata writer. |

## Graph Override / Proof-Relation Normalization Candidates

These functions are not first-priority unit-test gaps. They are deterministic
helpers inside scripts whose proof is a generated markdown/json evidence
artifact. Prefer graph relation overrides or script-level test-link promotion
after the proof register can represent "script produces proof artifact for
entity" cleanly.

| File | Functions | Suggested relation |
| --- | ---: | --- |
| `scripts/generateFunctionJourneyIndexes.mjs` | `chains` | Link to `scripts/generateFunctionJourneyIndexes.test.mjs` and generated `docs/graphs/function-journey-index.json` proof once the current graph refresh lane lands. |
| `scripts/runProdSecurityExchangeProof.mjs` | `printUsage`, `renderMarkdown`, `toStep` | Link to production security/exchange proof artifacts and future helper tests for the redaction/classifier functions. |
| `scripts/runProdUiModuleClickthroughAudit.mjs` | `main`, `printUsage`, `renderMarkdown`, `summarizeArea` | Link to UI module clickthrough audit artifacts and future helper tests for route/fetch classifiers. |
| `scripts/runProdUxA11yMobileProof.mjs` | `captureScreenshot`, `clickMobileMenu`, `collectPageCheck`, `createPage`, `findBrowserPath`, `launchBrowser`, `main`, `navigate`, `readJson`, `renderMarkdown`, `setAuthCookie`, `setViewport`, `wait` | Link to prod UX/A11y/mobile proof artifacts; browser orchestration remains protected/manual-gated. |

## Real Automated Test Gaps

These are deterministic parsers, classifiers, redaction checks, path scanners,
or markdown transforms. They can be tested locally without production access and
should become focused Node test files or exported helper tests.

| File | Functions needing tests | Proof command |
| --- | --- | --- |
| `scripts/runProdSecurityExchangeProof.mjs` | `assertStatus`, `hasNoStoreHeaders`, `hasSecurityHeaders`, `normalizeBaseUrl`, `payloadContainsKeyMaterial`, `readArgValue`, `readCatalogMarkets`, `readJson`, `requestJson`, `resolveOptions` | `node --test scripts/runProdSecurityExchangeProof.test.mjs` |
| `scripts/runProdUiModuleClickthroughAudit.mjs` | `auditRoute`, `buildModuleRows`, `classifyRoute`, `fetchJson`, `fetchText`, `makeCookieHeaders`, `normalizeBaseUrl`, `normalizePath`, `readArgValue`, `resolveOptions`, `routeToUrl`, `samePathOrRedirect`, `splitCsv`, `statusFromFetchError` | `node --test scripts/runProdUiModuleClickthroughAudit.test.mjs` |
| `scripts/runProdUxA11yMobileProof.mjs` | `controlName`, `evaluate`, `hasBadEvents`, `isVisible`, `normalizeBaseUrl`, `readArgValue`, `resolveOptions`, `summarizeBadEvents` | `node --test scripts/runProdUxA11yMobileProof.test.mjs` |
| `scripts/runPublicReadOnlyBrowserProof.mjs` | `collectIssues`, `collectPageState`, `collectRouteIssues`, `createPage`, `evaluate`, `findBrowserPath`, `isLocalWebBaseUrl`, `killProcessTree`, `launchBrowser`, `main`, `navigate`, `normalizeBaseUrl`, `provePasswordToggle`, `readArgValue`, `renderMarkdown`, `resolveOptions`, `setViewport`, `visitRoute`, `wait` | `node --test scripts/runPublicReadOnlyBrowserProof.test.mjs` |
| `scripts/runV1StaticIssueScan.mjs` | `buildScan`, `classifySourceMatch`, `collectQueueFindings`, `collectSurfaceFindings`, `collectV1Findings`, `directoryExists`, `fileExists`, `isProductionSource`, `listFilesInDirectory`, `main`, `parseArgs`, `printHelp`, `readJsonWithRetry`, `readTextIfExists`, `relativePath`, `renderFindingsTable`, `renderMarkdown`, `scanSourceMarkers`, `sleep`, `summarizeBy`, `toPosixPath`, `walkFiles` | `node --test scripts/runV1StaticIssueScan.test.mjs` |
| `scripts/summarizeRcGates.mjs` and `scripts/syncRcChecklistFromGateStatus.mjs` plus `scripts/triageJourneyEvidence.mjs` and `scripts/verifyLocalBackupRestore.mjs` | `asIsoTimestamp`, `parseArgs`, `parseGateLabel`, `parseStatusGeneratedAt`, `resolveDocsRoot`, `escapeRegExp`, `extractValueAfterLabel`, `getGateLabel`, `parseSignoff`, `refreshExpectedSha`, `refreshLatestVerificationDate`, `refreshOutstandingExternalGates`, `resolveDate`, `setChecklistCheckbox`, `argValue`, `matches`, `normalize`, `parseCsv`, `printList`, `readCsv`, `splitRefs`, `detectPostgresContainer`, `dockerExecSh`, `normalizeIdSuffix`, `nowStamp`, `push`, `run` | `node --test scripts/summarizeRcGates.test.mjs scripts/syncRcChecklistFromGateStatus.test.mjs scripts/triageJourneyEvidence.test.mjs scripts/verifyLocalBackupRestore.test.mjs` |

## Child Issue Split

Recommended one-owner QA child issues:

1. Production proof helper tests: `runProdSecurityExchangeProof`, `runProdUiModuleClickthroughAudit`, and `runProdUxA11yMobileProof`.
2. Public read-only browser proof helper tests: `runPublicReadOnlyBrowserProof`.
3. Static scan and RC/ops parser tests: `runV1StaticIssueScan`, `summarizeRcGates`, `syncRcChecklistFromGateStatus`, `triageJourneyEvidence`, and `verifyLocalBackupRestore`.

## Verification

- Classification source extraction: local Node read of `docs/graphs/architecture-health.json`.
- Required lifecycle check: `pnpm softwarehouse:architecture-lifecycle` from `C:/Personal/Projekty/Aplikacje/Paperclip_Softwarehouse`.
- Production/protected smoke: not run by design.

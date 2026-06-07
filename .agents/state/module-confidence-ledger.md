# Module Confidence Ledger

- 2026-06-07 `LUC-2750-LIVE-IMPORT-READBACK-COLLECTOR-MISSING-TEST-LINKS-2026-06-07`
  applies to live import readback collector tooling and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  `scripts/collectLiveImportReadbackEvidence.mjs` is import-safe for focused
  helper tests, direct helper exports are covered by
  `scripts/collectLiveImportReadbackEvidence.test.mjs`, and direct `LUC-2750`
  rows map the current live import readback helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Syntax checks passed,
  focused Node proof passed (`7/7`), CLI help passed, architecture graph
  generation passed (`653` nodes / `842` relations / `27` chains), and
  repository guardrails passed. No product runtime behavior, deploy, push,
  restart, rollback, production readback, account, secret, exchange, database,
  or live-trading mutation occurred. Follow-up TSA refresh is needed because
  `docs/status/architecture-awareness-report.md` remains the pre-fix snapshot.
  Evidence:
  `history/tasks/luc-2750-live-import-readback-collector-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2749-ARCHITECTURE-AWARENESS-AFTER-RC-EXTERNAL-GATE-EVIDENCE-PROOF-CLOSURE-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2749](/LUC/issues/LUC-2749). External architecture-awareness refresh
  passed with `14880` entities, `23980` relations, and `9659` files.
  Refreshed report generated `2026-06-07T09:34:54.277Z` has `396`
  actionable missing-test links, `0` actionable missing-doc links, `0`
  ownerless entities, `0` disconnected entities, and `7435` classified
  inferred-link noise rows. Completed [LUC-2740](/LUC/issues/LUC-2740) removed
  `scripts/checkRcExternalGateEvidence.mjs` from the top actionable family.
  Created [LUC-2750](/LUC/issues/LUC-2750) for Test Automation Engineer after
  active duplicate searches found no exact open local
  `collectLiveImportReadbackEvidence` relation/test lane. No code/runtime/
  deploy/push/restart/rollback/env/account/secret/protected-smoke/exchange/
  database/live-trading mutation occurred. Evidence:
  `history/tasks/luc-2749-architecture-awareness-after-rc-external-gate-evidence-proof-closure-2026-06-07-task.md`.

- 2026-06-07 `LUC-2740-RC-EXTERNAL-GATE-EVIDENCE-CHECKER-MISSING-TEST-LINKS-2026-06-07`
  applies to RC external gate evidence tooling and Architecture Evidence Graph
  relation confidence. Status: `verified_local / traceability only`.
  `scripts/checkRcExternalGateEvidence.mjs` is import-safe for focused helper
  tests, direct helper exports are covered by
  `scripts/checkRcExternalGateEvidence.test.mjs`, and direct `LUC-2740` rows
  map the current RC evidence checker helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Syntax checks passed,
  focused Node proof passed (`6/6`), CLI help passed, architecture graph
  generation passed (`653` nodes / `842` relations / `27` chains), and
  repository guardrails passed. No product runtime behavior, deploy, push,
  restart, rollback, production smoke, account, secret, exchange, database, or
  live-trading mutation occurred. Evidence:
  `history/tasks/luc-2740-rc-external-gate-evidence-checker-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2738-ARCHITECTURE-AWARENESS-AFTER-PROTECTED-INPUT-READINESS-PROOF-CLOSURE-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2738](/LUC/issues/LUC-2738). External architecture-awareness refresh
  passed with `14870` entities, `23959` relations, and `9654` files.
  Refreshed report generated `2026-06-07T09:05:01.622Z` has `403`
  actionable missing-test links, `0` actionable missing-doc links, `0`
  ownerless entities, `0` disconnected entities, and `7432` classified
  inferred-link noise rows. Completed [LUC-2733](/LUC/issues/LUC-2733)
  removed `scripts/checkProtectedInputReadiness.mjs` from the top actionable
  family. Created [LUC-2740](/LUC/issues/LUC-2740) for Test Automation
  Engineer after active duplicate searches found no exact open local
  `checkRcExternalGateEvidence` relation/test lane. No code/runtime/deploy/
  push/restart/rollback/env/account/secret/protected-smoke/exchange/database/
  live-trading mutation occurred. Evidence:
  `history/tasks/luc-2738-architecture-awareness-after-protected-input-readiness-proof-closure-2026-06-07-task.md`.

- 2026-06-07 `LUC-2735-NO-STALL-QUEUE-EXPEDITOR-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2735](/LUC/issues/LUC-2735). `pnpm softwarehouse:control-tick` failed
  because the command is not exposed in this checkout. Current local
  architecture-awareness report generated `2026-06-07T08:46:05.612Z` is stale
  after completed [LUC-2733](/LUC/issues/LUC-2733), because it still lists
  `scripts/checkProtectedInputReadiness.mjs` as top actionable. Created
  [LUC-2738](/LUC/issues/LUC-2738) for `09 TSA (Technical Solution Architect)`
  after active duplicate searches found no open protected-input readiness
  architecture refresh lane. No code/runtime/deploy/push/restart/rollback/env/
  account/secret/protected-smoke/exchange/database/live-trading mutation
  occurred. Evidence:
  `history/tasks/luc-2735-no-stall-queue-expeditor-2026-06-07-task.md`.

- 2026-06-07 `LUC-2732-GAP-REGISTER-AND-REPAIR-LANE-REFRESH-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2732](/LUC/issues/LUC-2732). External architecture-awareness refresh
  passed with `14862` entities, `23944` relations, and `9649` files.
  Refreshed report generated `2026-06-07T08:46:05.612Z` has `406` actionable
  missing-test links, `0` actionable missing-doc links, `0` ownerless
  entities, `0` disconnected entities, and `7431` classified inferred-link
  noise rows. Completed [LUC-2731](/LUC/issues/LUC-2731) removed
  `scripts/checkPostDeployRuntimeFreshness.mjs` from the top actionable
  family. Created [LUC-2733](/LUC/issues/LUC-2733) for Test Automation
  Engineer after active duplicate searches found no exact open local
  protected-input readiness checker relation/test lane. No code/runtime/deploy/
  push/restart/rollback/env/account/secret/protected-smoke/exchange/database/
  live-trading mutation occurred. Evidence:
  `history/tasks/luc-2732-gap-register-and-repair-lane-refresh-2026-06-07-task.md`.

- 2026-06-07 `LUC-2731-POST-DEPLOY-RUNTIME-FRESHNESS-MISSING-TEST-LINKS-2026-06-07`
  applies to post-deploy runtime freshness tooling and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  `scripts/checkPostDeployRuntimeFreshness.mjs` is import-safe for focused
  helper tests, direct helper exports are covered by
  `scripts/checkPostDeployRuntimeFreshness.test.mjs`, and direct `LUC-2731`
  rows map the current runtime freshness helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Syntax checks passed,
  focused Node proof passed (`4/4`), architecture graph generation passed
  (`653` nodes / `842` relations / `27` chains), and repository guardrails
  passed. No product runtime behavior, deploy, push, restart, rollback,
  production smoke, account, secret, exchange, database, or live-trading
  mutation occurred. Evidence:
  `history/tasks/luc-2731-post-deploy-runtime-freshness-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2725-DOCS-PARITY-CHECKER-MISSING-TEST-LINKS-2026-06-07`
  applies to docs parity tooling and Architecture Evidence Graph relation
  confidence. Status: `verified_local / traceability only`.
  `scripts/checkDocsParity.mjs` is import-safe for focused helper tests,
  direct helper exports are covered by `scripts/checkDocsParity.test.mjs`,
  and direct `LUC-2725` rows map the current docs parity checker helper
  anchors in `docs/architecture/relations/priority-test-links.csv`. Syntax
  checks passed, focused Node proof passed (`8/8`), docs parity passed,
  architecture graph generation passed (`653` nodes / `842` relations / `27`
  chains), and repository guardrails passed. No product runtime behavior,
  deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2725-docs-parity-checker-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2723-ARCHITECTURE-AWARENESS-AFTER-COOLIFY-ENV-PROOF-CLOSURE-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2723](/LUC/issues/LUC-2723). External architecture-awareness refresh
  passed with `14844` entities, `23900` relations, and `9638` files.
  Refreshed report generated `2026-06-07T08:04:36.573Z` has `420` actionable
  missing-test links, `0` actionable missing-doc links, `0` ownerless
  entities, `0` disconnected entities, and `7426` classified inferred-link
  noise rows. Completed [LUC-2702](/LUC/issues/LUC-2702) removed
  `scripts/checkCoolifyStackEnv.mjs` from the top actionable family. Created
  [LUC-2725](/LUC/issues/LUC-2725) for Test Automation Engineer after active
  duplicate searches found no open docs parity proof lane beyond current
  [LUC-2723](/LUC/issues/LUC-2723). No code/runtime/deploy/push/restart/
  rollback/env/account/secret/protected-smoke/exchange/database/live-trading
  mutation occurred. Evidence:
  `history/tasks/luc-2723-architecture-awareness-after-coolify-env-proof-closure-2026-06-07-task.md`.

- 2026-06-07 `LUC-2702-COOLIFY-STACK-ENV-CHECKER-MISSING-TEST-LINKS-2026-06-07`
  applies to Coolify deployment readiness tooling and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  `scripts/checkCoolifyStackEnv.test.mjs` now covers deploy-safety issue
  classification, redacted report output, CLI help, and stack env file JSON
  success. Direct `LUC-2702` rows map the current Coolify checker helper
  anchors in `docs/architecture/relations/priority-test-links.csv`. Syntax
  checks passed, focused Node proof passed (`11/11`), project-native Coolify
  env-check test passed (`11/11`), architecture graph generation passed (`653`
  nodes / `842` relations / `27` chains), and repository guardrails passed.
  No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2702-coolify-stack-env-checker-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2701-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2701](/LUC/issues/LUC-2701). `pnpm softwarehouse:control-tick` failed
  because the command is not exposed in this checkout. External
  architecture-awareness refresh passed with `14832` entities, `23869`
  relations, and `9632` files. Refreshed report generated
  `2026-06-07T06:46:35.755Z` has `433` actionable missing-test links, `0`
  actionable missing-doc links, `0` ownerless entities, `0` disconnected
  entities, and `7426` classified inferred-link noise rows. Completed
  [LUC-2693](/LUC/issues/LUC-2693) removed
  `scripts/buildV1MasterStateLedger.mjs` from the top actionable family.
  Created [LUC-2702](/LUC/issues/LUC-2702) for Test Automation Engineer after
  active duplicate searches for `checkCoolifyStackEnv`, `Coolify stack env`,
  and `checkDocsParity` returned `0`. No code/runtime/deploy/push/restart/
  rollback/env/account/secret/protected-smoke/exchange/database/live-trading
  mutation occurred. Evidence:
  `history/tasks/luc-2701-gap-register-and-repair-lane-refresh-2026-06-07-task.md`.

- 2026-06-07 `LUC-2695-NO-STALL-QUEUE-EXPEDITOR-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2695](/LUC/issues/LUC-2695). `pnpm softwarehouse:control-tick` failed
  because the command is not exposed in this checkout. Current local
  architecture-awareness report generated `2026-06-07T06:16:35.207Z` is stale
  after completed [LUC-2693](/LUC/issues/LUC-2693), because it still lists
  `scripts/buildV1MasterStateLedger.mjs` as top actionable. Created
  [LUC-2698](/LUC/issues/LUC-2698) for `09 TSA (Technical Solution Architect)`
  after active duplicate searches for `buildV1MasterStateLedger`,
  `checkCoolifyStackEnv`, and `architecture-awareness` returned `0`.
  No code/runtime/deploy/push/restart/rollback/env/account/secret/
  protected-smoke/exchange/database/live-trading mutation occurred. Evidence:
  `history/tasks/luc-2695-no-stall-queue-expeditor-2026-06-07-task.md`.

- 2026-06-07 `LUC-2693-V1-MASTER-STATE-LEDGER-MISSING-TEST-LINKS-2026-06-07`
  applies to V1 release/operations evidence tooling and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  `scripts/buildV1MasterStateLedger.mjs` is import-safe for focused helper
  tests, direct helper exports are covered by
  `scripts/buildV1MasterStateLedger.test.mjs`, and direct `LUC-2693` rows map
  the current master-ledger helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Syntax checks passed,
  focused Node proof passed (`8/8`), architecture graph generation passed
  (`653` nodes / `842` relations / `27` chains), and repository guardrails
  passed. No deploy, push, restart, rollback, production smoke, account,
  secret, exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2693-v1-master-state-ledger-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2685-V1-COMPLETION-SCORECARD-MISSING-TEST-LINKS-2026-06-07`
  applies to V1 release/operations evidence tooling and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  `scripts/buildV1CompletionScorecard.mjs` is import-safe for focused helper
  tests, direct helper exports are covered by
  `scripts/buildV1CompletionScorecard.test.mjs`, and direct `LUC-2685` rows map
  the current scorecard helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Syntax checks passed,
  focused Node proof passed (`7/7`), architecture graph generation passed
  (`653` nodes / `842` relations / `27` chains), and repository guardrails
  passed. No deploy, push, restart, rollback, production smoke, account,
  secret, exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2685-v1-completion-scorecard-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2684-ARCHITECTURE-AWARENESS-REFRESH-AFTER-RC-SLO-PROOF-CLOSURE-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. External architecture-awareness refresh passed with `14819`
  entities, `23822` relations, and `9625` files. Refreshed report generated
  `2026-06-07T05:34:19.835Z` has `462` actionable missing-test links, `0`
  actionable missing-doc links, `0` ownerless entities, `0` disconnected
  entities, and `7421` classified inferred-link noise rows. Completed
  [LUC-2674](/LUC/issues/LUC-2674) and [LUC-2678](/LUC/issues/LUC-2678)
  RC/SLO helper families are no longer the top actionable family. Created
  [LUC-2685](/LUC/issues/LUC-2685) for Test Automation Engineer after active
  duplicate searches for `buildV1CompletionScorecard`, `V1 completion
  scorecard`, and `buildV1MasterStateLedger` returned `0`.
  No code/runtime/deploy/push/restart/rollback/env/account/secret/
  protected-smoke/exchange/database/live-trading mutation occurred. Evidence:
  `history/tasks/luc-2684-architecture-awareness-refresh-after-rc-slo-proof-closure-2026-06-07-task.md`.

- 2026-06-07 `LUC-2678-RC-SIGNOFF-SLO-WINDOW-MISSING-TEST-LINKS-2026-06-07`
  applies to release/operations evidence tooling and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  `scripts/buildRcSignoffRecord.mjs` and
  `scripts/buildSloWindowReport.mjs` are import-safe for focused helper tests,
  direct helper exports are covered by
  `scripts/buildRcSignoffRecord.test.mjs` and
  `scripts/buildSloWindowReport.test.mjs`, and direct `LUC-2678` rows map the
  current helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Syntax checks passed,
  focused Node proof passed (`12/12` including
  `scripts/releaseOpsScriptContracts.test.mjs`), architecture graph generation
  passed (`653` nodes / `842` relations / `27` chains), and repository
  guardrails passed. No deploy, push, restart, rollback, production smoke,
  account, secret, exchange, database, or live-trading mutation occurred.
  Evidence:
  `history/tasks/luc-2678-rc-signoff-slo-window-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2673-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2673](/LUC/issues/LUC-2673). Current architecture-awareness report
  generated `2026-06-07T04:42:13.421Z` has `14807` entities, `23756`
  relations, `510` actionable missing-test links, `0` actionable missing-doc
  links, `0` ownerless entities, `0` disconnected entities, and `7418`
  classified inferred-link noise rows. The next top actionable family is
  release/operations evidence tooling:
  `scripts/buildRcExternalGateStatus.mjs`, `scripts/buildRcSignoffRecord.mjs`,
  and `scripts/buildSloWindowReport.mjs`. Created
  [LUC-2674](/LUC/issues/LUC-2674) for Test Automation Engineer after
  duplicate search found only older done aggregate lane
  [LUC-2198](/LUC/issues/LUC-2198), not a current focused function-level
  repair lane. No code/runtime/deploy/push/restart/rollback/env/account/
  secret/protected-smoke/exchange/database/live-trading mutation occurred.
  Evidence:
  `history/tasks/luc-2673-gap-register-and-repair-lane-refresh-2026-06-07-task.md`.

- 2026-06-07 `LUC-2672-EXCLUDE-TEST-FIXTURE-FUNCTIONS-FROM-ACTIONABLE-MISSING-TEST-SAMPLES-2026-06-07`
  applies to Architecture Evidence Graph scanner hygiene. Status:
  `verified_local / traceability only`. The external Softwarehouse
  architecture-awareness scanner now classifies test fixture/support function
  entities as `test_fixture_function` inferred-link noise, preserving raw
  visibility while excluding those rows from actionable missing-test samples.
  Soar architecture-awareness refresh passed (`14807` entities / `23756`
  relations / `9616` files); the refreshed report shows actionable missing-
  test links `510`, classified inferred-link noise `7418`, and
  `test_fixture_function: 62`. Targeted readback confirmed the seven
  [LUC-2671](/LUC/issues/LUC-2671) fixture samples are not actionable.
  `node --check` on the scanner and `pnpm run quality:guardrails` passed.
  No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2672-exclude-test-fixture-functions-from-actionable-missing-test-samples-2026-06-07-task.md`.

- 2026-06-07 `LUC-2671-RECONCILE-RESIDUAL-ARCHITECTURE-AWARENESS-TOP-SAMPLES-2026-06-07`
  applies to Architecture Evidence Graph relation confidence. Status:
  `verified_local / traceability only`. The `2026-06-07T04:12:30.440Z`
  architecture-awareness top samples were classified against completed local
  proof lanes [LUC-2650](/LUC/issues/LUC-2650),
  [LUC-2656](/LUC/issues/LUC-2656), and
  [LUC-2664](/LUC/issues/LUC-2664). Added `15` scanner-readable `LUC-2671`
  relation rows for already covered anchors in
  `docs/architecture/relations/priority-test-links.csv`. Focused proof passed
  (`18/18`), architecture graph generation passed (`653` nodes / `842`
  relations / `27` chains), and repository guardrails passed. Test-file
  fixture functions remain scanner inference noise, not product proof gaps;
  follow-up [LUC-2672](/LUC/issues/LUC-2672) was created for scanner
  classifier refinement.
  No deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2671-reconcile-residual-architecture-awareness-top-samples-2026-06-07-task.md`.

- 2026-06-07 `LUC-2661-OPS-REQUEST-HEADER-HELPER-MISSING-TEST-LINKS-2026-06-07`
  applies to ops request header helper behavior and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  `scripts/buildOpsRequestHeaders.mjs` now exposes its existing `normalize`
  helper for focused proof, `scripts/buildOpsRequestHeaders.test.mjs` covers
  bearer token trimming, cookie encoding, basic auth precedence, custom ops
  header validation, partial auth fail-closed errors, and empty input behavior,
  and direct `LUC-2661` rows map current helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Focused Node proof
  passed (`6/6`), architecture graph generation passed (`653` nodes / `842`
  relations / `27` chains), and repository guardrails passed. No deploy,
  push, restart, rollback, production smoke, account, secret, exchange,
  database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2661-ops-request-header-helper-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2656-OBSIDIAN-VAULT-LAYER-SCRIPT-MISSING-TEST-LINKS-2026-06-07`
  applies to Obsidian docs tooling and Architecture Evidence Graph relation
  confidence. Status: `verified_local / traceability only`.
  `scripts/buildObsidianVaultLayer.mjs` is import-safe for focused helper
  tests, direct helper exports are covered by
  `scripts/buildObsidianVaultLayer.test.mjs`, and direct `LUC-2656` rows map
  current helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Focused Node proof
  passed (`5/5`), architecture graph generation passed (`653` nodes / `842`
  relations / `27` chains), repository guardrails passed, and direct
  generator execution passed. Generated Obsidian/map churn from the direct
  proof run was restored because it was outside this missing-test-link repair
  scope. No deploy, push, restart, rollback, production smoke, account,
  secret, exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2656-obsidian-vault-layer-script-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2650-ROUTE-REACHABLE-I18N-AUDIT-SCRIPT-MISSING-TEST-LINKS-2026-06-07`
  applies to Web i18n / Copy audit tooling and Architecture Evidence Graph
  relation confidence. Status: `verified_local / traceability only`.
  `scripts/auditRouteReachableI18n.mjs` is import-safe for focused helper
  tests, direct helper exports are covered by
  `scripts/auditRouteReachableI18n.test.mjs`, and direct `LUC-2650` rows map
  current helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Focused Node proof
  passed (`5/5`), route-reachable i18n audit passed (`findings=0`,
  `localCopy=0`, `fallbackPl=0`, `hardcoded=0`), architecture graph
  generation passed (`653` nodes / `842` relations / `27` chains), and
  repository guardrails passed. No deploy, push, restart, rollback,
  production smoke, account, secret, exchange, database, or live-trading
  mutation occurred. Evidence:
  `history/tasks/luc-2650-route-reachable-i18n-audit-script-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2646-ARCHITECTURE-GRAPH-DRIFT-SCRIPT-MISSING-TEST-LINKS-2026-06-07`
  applies to Architecture Evidence Graph relation confidence and graph drift
  audit tooling. Status: `verified_local / traceability only`.
  `scripts/auditArchitectureGraphDrift.mjs` is import-safe for focused helper
  tests, direct helper exports are covered by
  `scripts/auditArchitectureGraphDrift.test.mjs`, and direct `LUC-2646` rows
  map the current helper anchors in
  `docs/architecture/relations/priority-test-links.csv`. Focused Node proof
  passed (`5/5`), strict architecture drift passed (`846/846` covered, `0`
  missing), architecture graph generation passed (`653` nodes / `842`
  relations / `27` chains), and repository guardrails passed. No deploy,
  push, restart, rollback, production smoke, account, secret, exchange,
  database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2646-architecture-graph-drift-script-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2645-DASHBOARD-LANGUAGE-SWITCHER-MISSING-TEST-LINK-2026-06-07`
  applies to Web dashboard layout/i18n behavior and Architecture Evidence
  Graph relation confidence. Status: `verified_local / traceability only`.
  Added focused `LanguageSwitcher` coverage proving the details dropdown
  closes after language selection and added a direct `LUC-2645` row to
  `docs/architecture/relations/priority-test-links.csv` for
  `apps/web/src/ui/layout/dashboard/LanguageSwitcher.tsx#handleSelect`.
  Focused Web Vitest proof passed (`1` file / `1` test), architecture graph
  generation passed (`653` nodes / `842` relations / `27` chains), and
  repository guardrails passed. Architecture-awareness refresh is not claimed
  because the local builder scripts are absent in this checkout. No deploy,
  push, restart, rollback, production smoke, account, secret, exchange,
  database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2645-dashboard-language-switcher-missing-test-link-2026-06-07-task.md`.

- 2026-06-07 `LUC-2644-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-07`
  applies to V1 audit-to-completion coordination, architecture-awareness
  report freshness, repair-lane hygiene, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2644](/LUC/issues/LUC-2644). External architecture-awareness refresh
  passed with generated timestamp `2026-06-07T02:47:58.055Z`, `14768`
  entities, `23614` relations, `612` actionable missing-test links, `0`
  actionable missing-doc links, `0` ownerless entities, and `0` disconnected
  entities. The previous top-sample families are stale relative to completed
  [LUC-2624](/LUC/issues/LUC-2624), [LUC-2631](/LUC/issues/LUC-2631), and
  [LUC-2639](/LUC/issues/LUC-2639). New delegated local proof lanes are
  [LUC-2645](/LUC/issues/LUC-2645) for
  `LanguageSwitcher.tsx#handleSelect` and [LUC-2646](/LUC/issues/LUC-2646)
  for `scripts/auditArchitectureGraphDrift.mjs` helper links. No
  code/runtime/deploy/push/restart/rollback/env/account/secret/
  protected-smoke/exchange/database/live-trading mutation occurred. Evidence:
  `history/tasks/luc-2644-gap-register-and-repair-lane-refresh-2026-06-07-task.md`.

- 2026-06-07 `LUC-2639-API-ENDPOINT-DOCS-PARITY-SCRIPT-MISSING-TEST-LINKS-2026-06-07`
  applies to Architecture Evidence Graph relation confidence and API endpoint
  docs parity tooling. Status: `verified_local / traceability only`.
  `scripts/auditApiEndpointDocsParity.mjs` is import-safe for focused helper
  tests, mounted router import resolution now chooses existing files, and
  direct `LUC-2639` rows in
  `docs/architecture/relations/priority-test-links.csv` map the current
  helper anchors to `scripts/auditApiEndpointDocsParity.test.mjs`. Focused
  Node proof passed (`5/5`), endpoint docs parity passed (`109` endpoints /
  `109` documented / `0` gaps), architecture graph generation passed
  (`653` nodes / `842` relations / `27` chains), and repository guardrails
  passed. Architecture-awareness refresh is not claimed because the local
  builder scripts are absent in this checkout. No deploy, push, restart,
  rollback, production smoke, account, secret, exchange, database, or
  live-trading mutation occurred. Evidence:
  `history/tasks/luc-2639-api-endpoint-docs-parity-script-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2631-WEB-PWA-SERVICE-WORKER-MISSING-TEST-LINKS-2026-06-07`
  applies to Web PWA/service-worker registration behavior and Architecture
  Evidence Graph relation confidence. Status: `verified_local / traceability
  only`. Added focused `ServiceWorkerRegistration` coverage for
  install/updatefound activation handoff and added direct `LUC-2631` rows to
  `docs/architecture/relations/priority-test-links.csv` for
  `checkBuildVersion`, `handleControllerChange`, `handleVisibilityChange`,
  `handleWindowFocus`, `purgePwaCaches`, and `requestUpdateCheck`. Focused Web
  PWA Vitest proof passed (`2` files / `8` tests), architecture graph
  generation passed (`653` nodes / `842` relations / `27` chains), and
  repository guardrails passed. Architecture-awareness refresh is not claimed
  because the local builder scripts are absent in this checkout. No deploy,
  push, restart, rollback, production smoke, account, secret, exchange,
  database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2631-web-pwa-service-worker-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2620-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-07`
  applies to V1 audit-to-completion coordination, architecture repair-lane
  hygiene, protected gate duplicate prevention, and source-of-truth freshness.
  Status: coordination `verified`; no product/runtime module confidence was
  upgraded. Paperclip heartbeat-context succeeded for
  [LUC-2620](/LUC/issues/LUC-2620). Direct queue readback showed no runnable
  `todo` issue, only [LUC-2620](/LUC/issues/LUC-2620) in progress, and two
  board review paths: [LUC-2558](/LUC/issues/LUC-2558) and
  [LUC-1397](/LUC/issues/LUC-1397). Protected workers-ready/smoke-auth remains
  blocked by [LUC-2619](/LUC/issues/LUC-2619), which blocks
  [LUC-2618](/LUC/issues/LUC-2618), [LUC-2505](/LUC/issues/LUC-2505), and
  [LUC-1438](/LUC/issues/LUC-1438). Protected release remains blocked through
  [LUC-2372](/LUC/issues/LUC-2372), [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2361](/LUC/issues/LUC-2361), and [LUC-2378](/LUC/issues/LUC-2378).
  Current architecture-awareness samples are stale relative to already
  completed local repairs [LUC-2601](/LUC/issues/LUC-2601),
  [LUC-2607](/LUC/issues/LUC-2607), and [LUC-2611](/LUC/issues/LUC-2611), so
  no duplicate child lane was opened. No code/runtime/deploy/push/restart/
  rollback/env/account/secret/protected-smoke/exchange/database/live-trading
  mutation occurred. Evidence:
  `history/tasks/luc-2620-gap-register-and-repair-lane-refresh-2026-06-07-task.md`.

- 2026-06-07 `LUC-2619-PROVISION-SMOKE-AUTH-BINDING-WORKERS-READY-2026-06-07`
  applies to `SOAR-WORKERS-001`, `SOAR-SECURITY-PRIVACY-001`, and
  `SOAR-OPERATIONS-001`. Status: `blocked_auth / fail_closed`. Current
  supported smoke auth binding is present by name but not accepted:
  `SMOKE_AUTH_TOKEN` is present and not JWT-shaped, `SMOKE_AUTH_EMAIL` is
  present and not email-shaped, and `SMOKE_AUTH_PASSWORD` is present; no
  secret values were printed or stored. Production deploy smoke with workers
  included passed public API/Web checks and failed protected
  `API /workers/ready` with `401`. `/workers/ready` still requires
  `requireAuth`, `requireRole('ADMIN')`, and `requireOpsNetwork`, so this
  verifies fail-closed rejection but does not verify protected worker
  readiness. No deploy, restart, rollback, env edit, account mutation,
  database mutation, secret disclosure, exchange mutation, or live-trading
  mutation occurred. Evidence:
  `history/tasks/luc-2619-provision-smoke-auth-binding-workers-ready-2026-06-07-task.md`.

- 2026-06-07 `LUC-2611-SHARED-UI-FORM-PRIMITIVE-MISSING-TEST-LINKS-2026-06-07`
  applies to Web shared UI primitives, Web form primitives, and Architecture
  Evidence Graph relation confidence. Status: `verified_local / traceability
  only`. Added focused `TableToneBadge` coverage and added direct `LUC-2611`
  rows to `docs/architecture/relations/priority-test-links.csv` for
  `FooterPreferencesSwitchers`, `ProfileButton`, `StatusBadge`,
  `TableToneBadge`, `Tabs#syncFromHash`, `SuccessState`, `FormAlert`,
  `FormField`, `CompoundField`, `RadioGroupField`, and `RangeField`. Focused
  Web Vitest proof passed (`7` files / `34` tests), architecture graph
  generation passed (`653` nodes / `842` relations / `27` chains), and
  repository guardrails passed. Architecture-awareness refresh is not claimed
  because the local builder script is absent in this checkout. No deploy, push,
  restart, rollback, production smoke, account, secret, exchange, database, or
  live-trading mutation occurred. Evidence:
  `history/tasks/luc-2611-shared-ui-form-primitive-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2601-WEB-API-FORM-UTILITY-MISSING-TEST-LINKS-2026-06-07`
  applies to Web API client utilities, Web form utilities, Web market-stream
  utilities, Web numeric input utilities, and Architecture Evidence Graph
  relation confidence. Status: `verified_local / traceability only`. Added
  focused tests for protected-route classification and hard redirect
  idempotence, form normalization and error fallback helpers, market-stream URL
  and credentialed EventSource behavior, and numeric input sanitization/step
  derivation. Added direct `LUC-2601` rows to
  `docs/architecture/relations/priority-test-links.csv`. Web Vitest proof
  passed (`157` files / `575` tests; wrapper collected the full Web suite),
  architecture graph generation passed (`653` nodes / `842` relations / `27`
  chains), and repository guardrails passed. Architecture-awareness refresh is
  not claimed because the local builder script is absent in this checkout. No
  deploy, push, restart, rollback, production smoke, account, secret,
  exchange, database, or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2601-web-api-form-utility-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2597-WEB-ARCHITECTURE-MISSING-TEST-LINK-FAMILIES-2026-06-07`
  applies to Web app shell, build-info route, auth login page, runtime display
  utilities, i18n formatting/provider, strategy threshold client IDs, and
  Architecture Evidence Graph relation confidence. Status: `verified` for
  local focused Web proof and scanner-readable relation repair; protected
  production/browser/release confidence is unchanged. Added focused tests for
  build-info route env/metadata/no-cache behavior, app/public/dashboard shell
  layouts, PWA manifest metadata, and authenticated login redirect. Extended
  runtime monitoring formatter and strategy threshold utility tests. Added
  direct `priority-test-links.csv` rows for assigned Web families. Focused Web
  tests passed (`11` files / `52` tests), architecture-awareness refresh
  passed (`14731` entities / `23469` relations), assigned Web families no
  longer appear in top actionable missing-test samples, and repository
  guardrails passed. No deploy, push, restart, rollback, production smoke,
  account, secret, exchange, database, or live-trading mutation occurred.
  Evidence:
  `history/tasks/luc-2597-web-architecture-missing-test-link-families-2026-06-07-task.md`.

- 2026-06-07 `LUC-2596-API-SIDE-ARCHITECTURE-MISSING-TEST-LINKS-2026-06-07`
  applies to Architecture Evidence Graph traceability and API local proof for
  seed bootstrap, runtime position state normalization, and runtime freshness
  env timestamp parsing. Status: `verified_local / traceability only`.
  Added focused seed and runtime freshness tests, mapped the existing runtime
  position normalization proof, added direct `priority-test-links.csv` rows,
  and refreshed architecture-awareness outputs. Focused API tests passed
  (`3` files / `7` tests), API typecheck passed, architecture-awareness
  refresh passed (`14731` entities / `23431` relations), graph generation
  passed (`653` nodes / `842` relations / `27` chains), strict graph drift
  passed (`845/845`, `0` missing), and repository guardrails passed. The
  assigned API anchors are no longer listed in top actionable missing-test
  links; total actionable missing-test links dropped from `733` to `729`.
  No production/runtime/deploy/push/restart/rollback/env/account/secret/
  protected-smoke/exchange/database/live-trading mutation occurred. Evidence:
  `history/tasks/luc-2596-api-side-architecture-missing-test-links-2026-06-07-task.md`.

- 2026-06-07 `LUC-2595-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-07`
  applies to V1 audit-to-completion coordination, Architecture Evidence Graph
  repair-lane hygiene, and duplicate-lane prevention. Status: coordination
  `verified`; no product/runtime confidence changed. Paperclip
  heartbeat-context and live issue readbacks confirmed protected release and
  workers-ready gates remain first-class and blocked through existing owner
  paths; [LUC-2564](/LUC/issues/LUC-2564) and
  [LUC-2567](/LUC/issues/LUC-2567) remain blocked by
  [LUC-241](/LUC/issues/LUC-241), while
  [LUC-2565](/LUC/issues/LUC-2565),
  [LUC-2566](/LUC/issues/LUC-2566),
  [LUC-2568](/LUC/issues/LUC-2568),
  [LUC-2578](/LUC/issues/LUC-2578),
  [LUC-2579](/LUC/issues/LUC-2579), and
  [LUC-2580](/LUC/issues/LUC-2580) are done. Current
  architecture-awareness report generated `2026-06-06T22:16:06.802Z` has
  `733` actionable missing-test links and `0` actionable missing-doc links.
  New delegated repair lanes: [LUC-2596](/LUC/issues/LUC-2596) for API-side
  seed/runtime helper/freshness missing-test anchors and
  [LUC-2597](/LUC/issues/LUC-2597) for Web build-info/layout/auth/runtime
  utility/i18n missing-test families. No code/runtime/deploy/push/restart/
  rollback/env/account/secret/protected-smoke/exchange/database/live-trading
  mutation occurred. Evidence:
  `history/tasks/luc-2595-gap-register-and-repair-lane-refresh-2026-06-07-task.md`.

- 2026-06-07 `LUC-2594-WORKERS-EXECUTION-COOLIFY-CRASH-METADATA-DIAGNOSIS-2026-06-07`
  applies to `SOAR-OPERATIONS-001` and `SOAR-WORKERS-001`. Status:
  `partially verified / cause unknown`. Read-only Coolify metadata verifies the
  `workers-execution` crash signal persists, but retained app-log evidence
  available to this token only shows current heartbeat/runtime skip processing
  and no fatal, OOM, process-exit, dependency, exchange credential, deploy, or
  startup signature. Local code correlation confirms the visible skip messages
  are non-fatal branches. Protected `/workers/ready`, runtime freshness, and
  alerts remain separate auth-gated proof. Evidence:
  `history/tasks/luc-2594-workers-execution-coolify-crash-metadata-diagnosis-2026-06-07-task.md`.

- 2026-06-07 `LUC-2590-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-07`
  applies to production deploy/operations confidence. Status:
  `partially verified / done`. Verified: Coolify project/environment
  readback succeeds, canonical eight production resources are present,
  PostgreSQL/Redis report `running:healthy`, public API/Web smoke passes, and
  production Web build-info matches `origin/main`
  (`56d8d440bfe0fd9ee692e9f669e35414d85d2493`). Not verified: protected
  worker readiness/runtime freshness/alerts are still `401` without approved
  read-only auth, and `workers-execution` crash metadata at
  `2026-06-06T04:12:15.000000Z` is classified by
  [LUC-2594](/LUC/issues/LUC-2594) as
  `unknown_from_retained_coolify_evidence`.
  No code/runtime/deploy/restart/rollback/env/DB/account/secret/exchange/
  live-trading mutation occurred. Evidence:
  `history/tasks/luc-2590-coolify-production-deploy-health-sweep-2026-06-07-task.md`.

- 2026-06-07 `LUC-2587-AUTONOMOUS-IDLE-MAP-DRIFT-SWEEP-2026-06-07`
  applies to documentation/status confidence, architecture-awareness map
  freshness, and Soar no-stall/idle-state classification. Status: `verified`
  for read-only docs/memory sweep; no product/runtime module confidence was
  upgraded. Read-only Paperclip queue readback returned `96` non-terminal
  Soar issues (`91` blocked, `3` in_progress, `2` in_review, `0` todo), so
  Soar remains active repair/verification under protected gate hold rather
  than monitoring-only. Current architecture-awareness report is fresh at
  `2026-06-06T22:16:06.802Z` with `14712` entities, `23382` relations,
  `0` ownerless entities, `0` disconnected entities, `733` actionable
  missing-test links, and `0` actionable missing-doc links. Updated
  `docs/status/known-state-readiness.md` to remove the stale 2026-05-26 idle
  implication and name active owner/gate paths. No code/runtime/deploy/push/
  restart/rollback/env/account/secret/protected-smoke/exchange/database/
  live-trading mutation occurred. Evidence:
  `history/tasks/luc-2587-autonomous-idle-and-map-drift-sweep-2026-06-07-task.md`.

- 2026-06-07 `LUC-2588-V1-AUDIT-TO-COMPLETION-CONTROLLER-2026-06-07`
  applies to V1 audit-to-completion coordination, protected release-gate
  routing, protected workers-ready/smoke-auth routing, and architecture backlog
  confidence. Status: coordination `verified`; no product/runtime confidence
  changed. Paperclip heartbeat-context and live issue readbacks confirmed the
  protected release chain remains first-class and blocked:
  [LUC-2372](/LUC/issues/LUC-2372) ->
  [LUC-2366](/LUC/issues/LUC-2366) ->
  [LUC-2361](/LUC/issues/LUC-2361) ->
  [LUC-2378](/LUC/issues/LUC-2378). Protected worker smoke-auth remains
  blocked through [LUC-2505](/LUC/issues/LUC-2505),
  [LUC-1438](/LUC/issues/LUC-1438), [LUC-241](/LUC/issues/LUC-241),
  [LUC-47](/LUC/issues/LUC-47), and [LUC-244](/LUC/issues/LUC-244).
  Architecture backlog lanes are already covered:
  [LUC-2564](/LUC/issues/LUC-2564) and [LUC-2567](/LUC/issues/LUC-2567)
  remain blocked by [LUC-241](/LUC/issues/LUC-241);
  [LUC-2565](/LUC/issues/LUC-2565), [LUC-2566](/LUC/issues/LUC-2566), and
  [LUC-2568](/LUC/issues/LUC-2568) are done. [LUC-2578](/LUC/issues/LUC-2578),
  [LUC-2579](/LUC/issues/LUC-2579), and [LUC-2580](/LUC/issues/LUC-2580)
  are done on final readback. No duplicate Backend,
  Runtime, source-control, PM, Ops, Security/Ops, QA, TSA, Docs, or release
  lane was opened. Evidence:
  `history/tasks/luc-2588-v1-audit-to-completion-controller-2026-06-07-task.md`.

- 2026-06-06 `LUC-2580-WORKER-BOOTSTRAP-MARKET-STREAM-MISSING-TEST-LINKS-2026-06-06`
  applies to Runtime worker lifecycle, Worker Bootstrap, Market Stream worker,
  Execution worker runtime signal bootstrap, and Architecture Evidence Graph
  relation confidence. Status: `verified` for local focused unit proof and
  scanner-readable relation repair; production/protected worker readiness is
  unchanged. Added import-safe worker lifecycle seams for Vitest, focused tests
  for runtime signal bootstrap failure telemetry, market-stream subscription
  fingerprint/reload/shutdown/failure logging, and worker bootstrap heartbeat/
  event logging. Added direct `priority-test-links.csv` rows for the assigned
  worker functions. Focused worker tests passed (`6` files / `19` tests), API
  typecheck passed, strict graph drift passed (`842/842`, `0` missing),
  repository guardrails passed, and architecture-awareness refresh removed the
  assigned worker rows from top actionable missing-test links (`733`
  remaining). No production worker start, deploy, restart, env/account, secret,
  protected-smoke, exchange, database, or live-trading mutation occurred.
  Evidence:
  `history/tasks/luc-2580-worker-bootstrap-market-stream-missing-test-links-2026-06-06-task.md`.

- 2026-06-06 `LUC-2579-SECURITY-UTILITY-MISSING-TEST-LINKS-2026-06-06`
  applies to `SOAR-SECURITY-PRIVACY-001`, `SOAR-PROFILE-API-KEYS-001`, and
  Architecture Evidence Graph relation confidence for API crypto/hash/error
  exposure utilities. Status: `verified` for local focused unit proof and
  scanner-readable relation repair; protected/live release confidence is
  unchanged. Added focused security utility tests for production error
  redaction, validation formatting/data-leak prevention, and bcrypt
  hash/compare mismatch behavior. Added direct priority test links for
  `apps/api/src/utils/crypto.ts#decrypt`, `#decryptLegacyCbc`, `#encrypt`,
  `#getActiveKey`, `#getKeyForVersion`, `errorExposure.ts#isProduction`,
  `formatZodError.ts#formatZodError`, `#sendValidationError`,
  `hash.ts#comparePassword`, and `#hashPassword`. Focused API tests passed
  (`2` files / `11` tests), strict graph drift passed (`838/838`, `0`
  missing), repository guardrails passed, and architecture-awareness refresh
  removed those utility rows from top actionable missing-test links. No
  production, credential, deploy, exchange, protected-smoke, account, database,
  or live-trading mutation occurred. Evidence:
  `history/tasks/luc-2579-security-utility-missing-test-links-2026-06-06-task.md`.

- 2026-06-06 `LUC-2565-ARCHITECTURE-HIGH-RISK-SECURITY-PROOF-GAP-REVIEW-2026-06-06`
  applies to `SOAR-SECURITY-PRIVACY-001`, `SOAR-OPERATIONS-001`,
  `SOAR-ASSISTANT-AI-001`, Profile API Keys, Subscriptions/Admin, Manual
  Orders, and Exchange Adapter architecture proof confidence. Status:
  `verified` for security review classification only; protected/live release
  confidence remains blocked. Security reviewed
  `CHAIN-API-PLATFORM-SAFETY`, `CHAIN-PROFILE-API-KEYS`,
  `CHAIN-SUBSCRIPTIONS-ADMIN`, `CHAIN-AI-ASSISTANT-FOUNDATION`,
  `CHAIN-MANUAL-ORDER-DEEP`, and `CHAIN-EXCHANGE-ADAPTER-DEEP` against current
  architecture docs, requirements/risk state, and recent protected-gate
  artifacts. Strict graph drift passed (`837/837`, `0` missing). No new
  concrete exploitable defect or duplicate implementation child issue was
  identified. Residual risk remains explicitly gate-bound: protected input
  readiness [LUC-2372](/LUC/issues/LUC-2372), smoke auth acceptance
  [LUC-2505](/LUC/issues/LUC-2505), protected worker/SLO proof
  [LUC-2366](/LUC/issues/LUC-2366), and production/protected auth lane
  [LUC-241](/LUC/issues/LUC-241). Evidence:
  `history/tasks/luc-2565-architecture-high-risk-security-proof-gap-review-2026-06-06-task.md`.

- 2026-06-06 `LUC-2568-SYNC-ARCHITECTURE-GAP-BACKLOG-LEDGERS-2026-06-06`
  applies to Architecture Evidence Graph, generated journey/action evidence
  indexes, and V1 audit-to-completion backlog hygiene. Status:
  documentation/evidence-ledger sync `verified`; no product/runtime confidence
  changed. Source inputs were [LUC-2557](/LUC/issues/LUC-2557) architecture
  backlog comment `2564a6b3-13e2-465d-9557-a03c76ef4f00`,
  `docs/status/function-journey-index.md`, `docs/status/user-action-index.md`,
  `docs/architecture/traceability-matrix.md`, and
  `docs/architecture/chains/chains.csv`.

  | Issue | Owner lane | Current status | Protected gate | Proof requirement |
  | --- | --- | --- | --- | --- |
  | [LUC-2564](/LUC/issues/LUC-2564) | QA/Test Automation | blocked | yes, first-class blocked by [LUC-241](/LUC/issues/LUC-241) | Fresh authenticated browser proof for protected dashboard/runtime and protected route/action rows before claims move beyond local/partial evidence. |
  | [LUC-2565](/LUC/issues/LUC-2565) | Security | done | no for local review; yes for protected production probes | Security review of high-risk architecture proof gaps, including Profile API keys, subscriptions/admin/payment, AI assistant foundation, and API platform safety boundaries. |
  | [LUC-2566](/LUC/issues/LUC-2566) | Backend/Runtime / Integration | done | no for audit/decomposition; yes for LIVE/protected readback | Runtime, engine, exchange, DCA/PnL, and market-stream local-only chain audit with repair slices and explicit protected proof boundaries. |
  | [LUC-2567](/LUC/issues/LUC-2567) | Ops/Release | blocked | yes, first-class blocked by [LUC-241](/LUC/issues/LUC-241) | Protected production/runtime evidence gate map for release audit tooling, Ops config pipeline, worker/runtime readiness, Coolify/resource facts, and release proof sequencing. |
  | [LUC-2568](/LUC/issues/LUC-2568) | Documentation Steward | done | no | Durable ledger sync of architecture backlog rows and no-regression note that historical unchecked plans are not active unless backed by current architecture rows and owner lanes. |

  No-regression note: historical unchecked checklist rows are background
  signals only. They must not be promoted as active V1 work unless they map to
  current architecture graph/journey rows and a live Paperclip owner lane.
  Evidence:
  `history/tasks/luc-2568-sync-architecture-gap-backlog-ledgers-2026-06-06-task.md`.

- 2026-06-06 `LUC-2566-RUNTIME-EXCHANGE-LOCAL-ONLY-CHAIN-AUDIT-2026-06-06`
  applies to Engine Runtime Core, Runtime Support Services, Runtime DCA PnL,
  Market Data Stream Adapters, Exchange Adapter, Manual Order, and Positions
  architecture confidence. Status: audit/decomposition `verified`; product/
  runtime confidence remains local-only or locally partial exactly as recorded
  in the chain registries. All targeted chains have mapped backend/API/service/
  data/test/doc surfaces; no actual backend implementation gap was found, so
  no child implementation issue was opened. Protected production/browser
  readback and LIVE mutation proof remain separate from local verification and
  are still gated by [LUC-241](/LUC/issues/LUC-241) or explicit operator
  approval. Evidence:
  `history/tasks/luc-2566-runtime-exchange-local-only-chain-audit-2026-06-06-task.md`.

- 2026-06-06 `LUC-2556-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination, protected release-gate
  routing, protected workers-ready gate routing, and duplicate-lane prevention.
  Status: coordination `verified`; no product/runtime confidence changed.
  Paperclip heartbeat-context and live issue readbacks confirmed the protected
  release chain remains first-class and blocked:
  [LUC-2372](/LUC/issues/LUC-2372) ->
  [LUC-2366](/LUC/issues/LUC-2366) ->
  [LUC-2361](/LUC/issues/LUC-2361) ->
  [LUC-2378](/LUC/issues/LUC-2378). Protected worker smoke-auth remains
  blocked through [LUC-2505](/LUC/issues/LUC-2505),
  [LUC-1438](/LUC/issues/LUC-1438), [LUC-241](/LUC/issues/LUC-241),
  [LUC-47](/LUC/issues/LUC-47), and [LUC-244](/LUC/issues/LUC-244).
  [LUC-2553](/LUC/issues/LUC-2553), [LUC-2543](/LUC/issues/LUC-2543),
  [LUC-2542](/LUC/issues/LUC-2542), [LUC-2541](/LUC/issues/LUC-2541), and
  [LUC-2540](/LUC/issues/LUC-2540) read back as `done`. No duplicate Backend,
  source-control, PM, Ops, Security/Ops, QA, TSA, Docs, or release lane was
  opened. Evidence:
  `history/tasks/luc-2556-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2541-BOT-RUNTIME-REPOSITORY-TEST-LINKS-2026-06-06`
  applies to Bot Runtime API test relation confidence. Status: relation repair
  `verified`; no product/runtime behavior changed. Added direct scanner-readable
  test links from `runtimeSessionPositionsRead.repository.ts` to
  `runtimeSessionPositionsRead.service.test.ts` and
  `bots.runtime-scope.e2e.test.ts`, and from
  `runtimeSessionTradesRead.repository.ts` to
  `runtimeSessionPositionsRead.service.test.ts` and
  `bots.runtime-history-parity.e2e.test.ts`. CSV readback verified `4/4`
  [LUC-2541](/LUC/issues/LUC-2541) rows and linked paths; strict architecture
  graph drift passed (`837/837`, `0` missing). Focused non-DB API tests passed
  for `botsRuntimeRead.repository.test.ts` (`1/1`) and
  `runtimeSessionPositionsRead.service.test.ts` (`22/22`). DB-backed runtime
  e2e suites were attempted but blocked before assertions because Prisma could
  not reach local Postgres at `localhost:5432`. Evidence:
  `history/tasks/luc-2541-cover-bot-runtime-repository-missing-test-links-2026-06-06-task.md`.

- 2026-06-06 `LUC-2543-ARCHITECTURE-GRAPH-MISSING-TEST-LINK-BACKLOG-2026-06-06`
  applies to Architecture Evidence Graph, API Bots, API Engine, and API
  Positions test-link confidence. Status: `verified` for docs/graph
  traceability only; no runtime/product confidence changed. Added direct
  scanner-readable `priority-test-links.csv` rows for selected top
  architecture-awareness missing-test samples where existing tests already
  prove the surface: bots e2e helpers, bot projection reads, runtime
  symbol-stats repository helpers, engine indicator period handling, and
  imported position-id helpers. Architecture-awareness refresh passed
  (`14683` entities / `23274` relations, generated
  `2026-06-06T19:47:09.571Z`), actionable missing-test rows moved from `804`
  to `763`, actionable missing-doc rows remained `0`, and disconnected
  entities remained `0`. Validation passed: focused API relation proof (`7`
  files, `39` passed, `33` skipped by filter), architecture graph generation
  (`653` nodes / `842` relations / `27` chains), strict graph drift (`837/837`,
  `0` missing), and `git diff --check` with line-ending warnings only.
  Evidence:
  `history/tasks/luc-2543-promote-architecture-graph-missing-test-link-backlog-2026-06-06-task.md`.

- 2026-06-06 `LUC-2542-COVER-ENGINE-STRATEGY-SIGNAL-HELPER-MISSING-TEST-LINKS-2026-06-06`
  applies to `SOAR-FEATURE-ENGINE-RUNTIME-CORE` architecture evidence
  confidence. Status: `verified` for scanner-readable test relation coverage;
  runtime behavior confidence is unchanged because no product code changed.
  Direct priority test-link rows now map the remaining
  `strategySignalAnalysis.ts` helper family to existing focused engine tests.
  Proof passed: `strategySignalAnalysis.test.ts` plus
  `strategyIndicatorRegistryParity.test.ts` (`2/2`), architecture graph
  generation (`653` nodes, `842` relations, `27` chains), strict graph drift
  (`837/837`, `0` missing), repository guardrails, and architecture-awareness
  report readback with the target helper rows absent from top actionable
  missing-test links. Evidence:
  `history/tasks/luc-2542-cover-engine-strategy-signal-helper-missing-test-links-2026-06-06-task.md`.

- 2026-06-06 `LUC-2527-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination, protected release-gate
  routing, and protected workers-ready gate routing. Status: coordination
  `verified`; no product/runtime confidence changed. Paperclip
  heartbeat-context and live issue readbacks confirmed the current protected
  release chain remains first-class and blocked:
  [LUC-2372](/LUC/issues/LUC-2372) ->
  [LUC-2366](/LUC/issues/LUC-2366) ->
  [LUC-2361](/LUC/issues/LUC-2361) ->
  [LUC-2378](/LUC/issues/LUC-2378). Protected worker smoke-auth remains
  blocked through [LUC-2505](/LUC/issues/LUC-2505),
  [LUC-1438](/LUC/issues/LUC-1438), [LUC-241](/LUC/issues/LUC-241),
  [LUC-47](/LUC/issues/LUC-47), and [LUC-244](/LUC/issues/LUC-244).
  [LUC-2506](/LUC/issues/LUC-2506), [LUC-2507](/LUC/issues/LUC-2507),
  [LUC-2520](/LUC/issues/LUC-2520), [LUC-2522](/LUC/issues/LUC-2522), and
  [LUC-2524](/LUC/issues/LUC-2524) read back as `done`. No duplicate
  Backend, source-control, PM, Ops, Security/Ops, QA, TSA, or release lane was
  opened. Evidence:
  `history/tasks/luc-2527-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2223-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-06`
  applies to `SOAR-OPERATIONS-001` Coolify production resource inventory.
  Status: read-only topology/status `verified`; full release readiness remains
  protected-proof blocked. Paperclip heartbeat-context confirmed
  [LUC-2223](/LUC/issues/LUC-2223) was stale `in_progress`, critical, and
  blocking [LUC-2513](/LUC/issues/LUC-2513). Fresh authenticated read-only
  Coolify projection at `2026-06-06T18:25:12Z` resolved selector
  `LuckySparrow`, project `Soar`, environment `production`, six applications,
  PostgreSQL, Redis, zero generic services, `17` visible global resource rows,
  and the canonical eight-resource production-environment inventory.
  Application rows report `running:unknown`; PostgreSQL and Redis report
  `running:healthy`. `pnpm run ops:coolify-stack:env-check:test` passed
  `8/8`. No production mutation or secret disclosure occurred. Evidence:
  `history/evidence/luc-2223-coolify-resource-inventory-reconciliation-2026-06-06.md`;
  `history/tasks/luc-2223-coolify-resource-inventory-reconciliation-2026-06-06-task.md`.

- 2026-06-06 `LUC-2522-V1-AUDIT-TO-COMPLETION-CONTROLLER-2026-06-06`
  applies to V1 audit-to-completion coordination, protected release-gate
  routing, and protected workers-ready gate routing. Status: coordination
  `verified`; no product/runtime confidence changed. Paperclip
  heartbeat-context and live issue readbacks confirmed the protected release
  chain remains blocked through [LUC-2372](/LUC/issues/LUC-2372),
  [LUC-2366](/LUC/issues/LUC-2366), [LUC-2361](/LUC/issues/LUC-2361), and
  [LUC-2378](/LUC/issues/LUC-2378). Protected worker smoke-auth remains
  blocked through [LUC-2505](/LUC/issues/LUC-2505),
  [LUC-1438](/LUC/issues/LUC-1438), [LUC-241](/LUC/issues/LUC-241),
  [LUC-47](/LUC/issues/LUC-47), and [LUC-244](/LUC/issues/LUC-244).
  [LUC-2506](/LUC/issues/LUC-2506), [LUC-2507](/LUC/issues/LUC-2507), and
  [LUC-2520](/LUC/issues/LUC-2520) read back as `done`. No duplicate
  Backend, source-control, PM, Ops, Security/Ops, QA, TSA, or release lane was
  opened. Evidence:
  `history/tasks/luc-2522-v1-audit-to-completion-controller-2026-06-06-task.md`.

- 2026-06-06 `LUC-2520-CORRECT-LUC-241-BLOCKED-DISPOSITION-2026-06-06`
  applies to V1 release coordination and protected workers-ready gate routing.
  Status: coordination `verified`; no product/runtime confidence changed.
  Paperclip live readback before correction showed [LUC-241](/LUC/issues/LUC-241)
  as `todo` while blocked by [LUC-1438](/LUC/issues/LUC-1438). DRE/Ops
  corrected [LUC-241](/LUC/issues/LUC-241) to `blocked`, preserving
  [LUC-1438](/LUC/issues/LUC-1438) as first-class blocker. Dependent readback
  now shows [LUC-244](/LUC/issues/LUC-244) and [LUC-47](/LUC/issues/LUC-47)
  blocked by `LUC-241:blocked`. Evidence:
  `history/tasks/luc-2520-correct-luc-241-blocked-disposition-2026-06-06-task.md`.

- 2026-06-06 `LUC-2508-NO-STALL-QUEUE-EXPEDITOR-2026-06-06`
  applies to V1 release coordination and protected release-gate routing.
  Status: coordination `verified`; no product/runtime confidence changed.
  Paperclip live issue readback confirmed [LUC-244](/LUC/issues/LUC-244)
  remains the canonical PM no-stall lane and is blocked by
  [LUC-47](/LUC/issues/LUC-47) plus [LUC-241](/LUC/issues/LUC-241). The current
  protected release chain remains first-class and blocked:
  [LUC-2372](/LUC/issues/LUC-2372) ->
  [LUC-2366](/LUC/issues/LUC-2366) ->
  [LUC-2361](/LUC/issues/LUC-2361) ->
  [LUC-2378](/LUC/issues/LUC-2378). [LUC-2505](/LUC/issues/LUC-2505) remains
  blocked for protected smoke-auth endpoint acceptance. [LUC-2506](/LUC/issues/LUC-2506)
  and [LUC-2507](/LUC/issues/LUC-2507) read back as `done`. No duplicate
  Backend, source-control, PM, Ops, Security/Ops, QA, TSA, or release lane was
  opened. Evidence:
  `history/tasks/luc-2508-no-stall-queue-expeditor-2026-06-06-task.md`.

- 2026-06-06 `LUC-2507-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination, protected release-gate
  routing, and deploy source-provenance routing. Status: coordination
  `verified`; no product/runtime confidence changed. Paperclip
  heartbeat-context and live issue readbacks confirmed the current protected
  release chain remains first-class and blocked:
  [LUC-2372](/LUC/issues/LUC-2372) ->
  [LUC-2366](/LUC/issues/LUC-2366) ->
  [LUC-2361](/LUC/issues/LUC-2361) ->
  [LUC-2378](/LUC/issues/LUC-2378). Newer related work is already owned:
  [LUC-2505](/LUC/issues/LUC-2505) is blocked for protected smoke-auth
  endpoint acceptance, and [LUC-2506](/LUC/issues/LUC-2506) needs DRE/Ops
  status sync because local source-of-truth records completed hardening
  evidence while live API still reports `in_progress`. No duplicate Backend,
  source-control, PM, Ops, Security/Ops, QA, TSA, or release lane was opened.
  Evidence:
  `history/tasks/luc-2507-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2506-WEB-BUILD-INFO-SOURCE-PROVENANCE-2026-06-06`
  applies to `SOAR-OPERATIONS-001` deploy provenance confidence. Status:
  `verified local`; production readback remains pending a future approved
  deploy. Web build metadata generation and `/api/build-info` no longer use
  GitHub branch-head fallback as source provenance, and deploy wait rejects
  `github-branch*` metadata by default. Validation passed: writer tests `2/2`,
  wait-gate tests `4/4`, release/Ops aggregate tests `8/8`, Web typecheck, and
  repository guardrails. Evidence:
  `history/evidence/luc-2506-web-build-info-source-provenance-2026-06-06.md`;
  `history/tasks/luc-2506-restore-authoritative-web-build-info-source-provenance-2026-06-06-task.md`.

- 2026-06-06 `LUC-2504-SOAR-WEB-FAILED-DEPLOY-DIAGNOSIS-2026-06-06`
  applies to `SOAR-OPERATIONS-001` production deploy diagnosis. Status:
  read-only diagnosis `verified`; full release readiness remains partial and
  protected-proof blocked. Current public Web is reachable and build-info
  returns `56d8d440bfe0fd9ee692e9f669e35414d85d2493`; Coolify `soar-web`
  metadata still carries configured `git_commit_sha=b894e5dd...`, but no
  active queued/in-progress/failed deployment rows are visible to the current
  token. Web Server Action mismatch logs are static and do not justify a
  production mutation by themselves. Residual risk: build-info uses
  `metadataSource=github-branch`, so release gates should not treat it as
  authoritative container-source proof until build-time source metadata is
  restored. Follow-up [LUC-2506](/LUC/issues/LUC-2506) owns that DRE hardening
  lane with a live execution path and is not a production mutation permit.
  Evidence:
  `history/evidence/luc-2504-soar-web-failed-deploy-diagnosis-2026-06-06.md`;
  `history/tasks/luc-2504-soar-web-failed-deploy-diagnosis-2026-06-06-task.md`.

- 2026-06-06 `LUC-2497-AUTONOMOUS-IDLE-MAP-DRIFT-SWEEP-2026-06-06`
  applies to documentation/map parity and architecture evidence graph
  confidence. Status: `verified`; no product/runtime confidence changed.
  Strict architecture graph drift passed with `837/837` covered and `0`
  missing. Docs parity passed with API `22/22`, Web `16/16`, and Routes
  `39/39`. No duplicate map, Backend, source-control, PM, Ops, Security/Ops,
  QA, TSA, or release lane was opened. Evidence:
  `history/tasks/luc-2497-autonomous-idle-and-map-drift-sweep-2026-06-06-task.md`.

- 2026-06-06 `LUC-2490-NO-STALL-QUEUE-EXPEDITOR-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. Paperclip heartbeat-context and direct issue readbacks confirmed
  canonical PM no-stall lane [LUC-244](/LUC/issues/LUC-244) remains blocked,
  and the current protected release chain remains first-class:
  [LUC-2372](/LUC/issues/LUC-2372) blocks
  [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2366](/LUC/issues/LUC-2366) blocks
  [LUC-2361](/LUC/issues/LUC-2361), and
  [LUC-2361](/LUC/issues/LUC-2361) blocks
  [LUC-2378](/LUC/issues/LUC-2378). [LUC-2481](/LUC/issues/LUC-2481),
  [LUC-2482](/LUC/issues/LUC-2482), and
  [LUC-2487](/LUC/issues/LUC-2487) are already done, so no duplicate
  Backend/source-control/PM/Ops/Security/Ops/QA/TSA/release lane was opened.
  Evidence:
  `history/tasks/luc-2490-no-stall-queue-expeditor-2026-06-06-task.md`.

- 2026-06-06 `LUC-2482-NO-STALL-QUEUE-EXPEDITOR-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. Paperclip heartbeat-context and focused live issue readbacks
  confirmed the canonical PM no-stall lane [LUC-244](/LUC/issues/LUC-244)
  remains blocked, and the current release chain remains first-class:
  [LUC-2372](/LUC/issues/LUC-2372) blocks
  [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2366](/LUC/issues/LUC-2366) blocks
  [LUC-2361](/LUC/issues/LUC-2361), and
  [LUC-2361](/LUC/issues/LUC-2361) blocks
  [LUC-2378](/LUC/issues/LUC-2378). [LUC-2481](/LUC/issues/LUC-2481) is
  already done, so no duplicate Backend/source-control/PM/Ops/Security/Ops/
  QA/TSA/release lane was opened. Evidence:
  `history/tasks/luc-2482-no-stall-queue-expeditor-2026-06-06-task.md`.

- 2026-06-06 `LUC-2481-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. Paperclip heartbeat-context and live issue readbacks confirmed the
  current blocker chain remains first-class: [LUC-2372](/LUC/issues/LUC-2372)
  blocks [LUC-2366](/LUC/issues/LUC-2366), [LUC-2366](/LUC/issues/LUC-2366)
  blocks [LUC-2361](/LUC/issues/LUC-2361), and
  [LUC-2361](/LUC/issues/LUC-2361) blocks
  [LUC-2378](/LUC/issues/LUC-2378). Already-done prerequisite blockers
  [LUC-2365](/LUC/issues/LUC-2365) and
  [LUC-2364](/LUC/issues/LUC-2364) do not require new lanes. No duplicate
  Backend/source-control/PM/Ops/Security/Ops/QA/TSA/release lane was opened.
  Evidence:
  `history/tasks/luc-2481-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2475-DEPLOY-SMOKE-ABORT-HANDLING-2026-06-06` applies to
  Operations deploy smoke and public production health confidence. Status:
  `verified`. `scripts/deploySmokeCheck.mjs` now retries transient
  fetch abort/timeout/fetch-failed errors once by default and records retry
  context in the row detail, while HTTP status failures, readiness degradation,
  missing build-info SHA, and SHA mismatches remain fail-closed without retry.
  Focused regression tests passed (`2/2`), release/Ops script contract tests
  plus the new smoke tests passed (`4/4`), repository guardrails passed, and
  public no-workers production smoke passed for
  `56d8d440bfe0fd9ee692e9f669e35414d85d2493`. Evidence:
  `history/evidence/luc-2475-deploy-smoke-abort-handling-2026-06-06.md`;
  `history/tasks/luc-2475-stabilize-public-deploy-smoke-abort-handling-2026-06-06-task.md`.

- 2026-06-06 `LUC-2464-V1-AUDIT-TO-COMPLETION-CONTROLLER-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `blocked` with first-class blocker linkage
  repaired; no product/runtime confidence changed. [LUC-2464](/LUC/issues/LUC-2464)
  now points to [LUC-2372](/LUC/issues/LUC-2372) as the active Security/Ops
  protected-input blocker. Release confidence remains blocked/fail-closed
  through [LUC-2372](/LUC/issues/LUC-2372) ->
  [LUC-2366](/LUC/issues/LUC-2366) ->
  [LUC-2361](/LUC/issues/LUC-2361) ->
  [LUC-2378](/LUC/issues/LUC-2378). Evidence:
  `history/tasks/luc-2464-v1-audit-to-completion-controller-2026-06-06-task.md`.

Last updated: 2026-06-06

- 2026-06-06 `LUC-2465-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-06`
  applies to production deploy health and Coolify production topology
  confidence. Status: `verified` for read-only public API/Web health and
  production build freshness. Local `HEAD`, `origin/main`, and production Web
  build-info all report `56d8d440bfe0fd9ee692e9f669e35414d85d2493`; public
  smoke passed for API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info`; unauthenticated `/workers/ready` returned `401`
  fail-closed. Coolify read-only projection matches the canonical topology:
  six applications, PostgreSQL, Redis, zero generic services, and `17` visible
  global resource rows. Residual confidence remains limited for protected
  worker/dashboard/account/SLO/rollback/live-runtime proof, which was outside
  this read-only sweep. Evidence:
  `history/evidence/luc-2465-coolify-production-deploy-health-sweep-2026-06-06.md`,
  `history/tasks/luc-2465-coolify-production-deploy-health-sweep-2026-06-06-task.md`.

- 2026-06-06 `LUC-2460-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. Scoped wake had no pending comments and no fallback fetch
  requirement, but Paperclip `heartbeat-context` and focused issue search
  timed out in this heartbeat. Current source-of-truth remains unchanged from
  [LUC-2443](/LUC/issues/LUC-2443): [LUC-2372](/LUC/issues/LUC-2372) remains
  the active protected-input blocker, and downstream release confidence
  remains fail-closed through [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2361](/LUC/issues/LUC-2361), and
  [LUC-2378](/LUC/issues/LUC-2378). No duplicate Backend/source-control/PM/
  Ops/Security/Ops/QA/TSA/release lane was opened. Evidence:
  `history/tasks/luc-2460-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2461-SECURITY-ACCOUNT-ACCESS-GATE-SWEEP-2026-06-06`
  applies to V1 release-gate security/account-access confidence. Status:
  `blocked`, fail-closed. Current production build-info is
  `56d8d440bfe0fd9ee692e9f669e35414d85d2493`, and names-only protected input
  readiness is `PARTIAL`: production UI audit/admin names are present, but
  `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, production DB check, `RC_*`,
  and `GATE*` families remain missing. This does not change product/runtime
  module confidence and does not unblock [LUC-2366](/LUC/issues/LUC-2366).
  Evidence:
  `history/tasks/luc-2461-security-account-access-gate-sweep-2026-06-06-task.md`;
  `history/evidence/luc-2461-security-account-access-gate-readiness-56d8d440-2026-06-06.md`.

- 2026-06-06 `LUC-2457-NO-STALL-QUEUE-EXPEDITOR-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. Paperclip heartbeat-context readback succeeded for
  [LUC-2457](/LUC/issues/LUC-2457), and local source-of-truth confirmed the
  routing remains unchanged: [LUC-2372](/LUC/issues/LUC-2372) remains the
  active protected-input blocker, and downstream release confidence remains
  blocked/fail-closed through [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2361](/LUC/issues/LUC-2361), and [LUC-2378](/LUC/issues/LUC-2378). No
  duplicate Backend/source-control/PM/Ops/Security/Ops/QA/TSA/release lane was
  opened. Evidence:
  `history/tasks/luc-2457-no-stall-queue-expeditor-2026-06-06-task.md`.

- 2026-06-06 `LUC-2463-AUTONOMOUS-IDLE-MAP-DRIFT-SWEEP-2026-06-06`
  applies to architecture route-map confidence, docs parity, and coordination
  memory. Status: `verified` for documentation/index parity; no product,
  runtime, deploy, or trading confidence changed. Proof: strict architecture
  graph drift passed with `831/831` covered and `0` missing; docs parity passed
  with API `22/22`, Web `16/16`, and Routes `39/39`. Known tooling drift
  remains: `pnpm softwarehouse:control-tick` is not exposed as a direct Soar
  command and `scripts/run-live-run-janitor.mjs` is absent in this checkout.
  Evidence:
  `history/tasks/luc-2463-autonomous-idle-and-map-drift-sweep-2026-06-06-task.md`.

- 2026-06-06 `LUC-2449-DAILY-PROJECT-STATUS-REFRESH-2026-06-06`
  applies to Soar V1 project status, production deploy health confidence, and
  protected release-gate routing. Status: PM status `verified`; no product or
  runtime behavior changed. Local `HEAD`, `origin/main`, and production Web
  build-info all report `56d8d440bfe0fd9ee692e9f669e35414d85d2493`; public
  API/Web health remains verified from the [LUC-2417](/LUC/issues/LUC-2417)
  read-only sweep. Release confidence remains blocked/fail-closed because
  [LUC-2372](/LUC/issues/LUC-2372) still lacks approved protected runtime/SLO
  input families, with [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2361](/LUC/issues/LUC-2361), and [LUC-2378](/LUC/issues/LUC-2378)
  downstream. Evidence:
  `history/tasks/luc-2449-daily-project-status-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2443-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. Live Paperclip readback confirmed [LUC-2372](/LUC/issues/LUC-2372),
  [LUC-2366](/LUC/issues/LUC-2366), [LUC-2361](/LUC/issues/LUC-2361),
  [LUC-2378](/LUC/issues/LUC-2378), and [LUC-2438](/LUC/issues/LUC-2438)
  remain blocked, while [LUC-2419](/LUC/issues/LUC-2419),
  [LUC-2422](/LUC/issues/LUC-2422), [LUC-2432](/LUC/issues/LUC-2432), and
  [LUC-2440](/LUC/issues/LUC-2440) are done. No duplicate Backend/
  source-control/PM/Ops/Security/Ops/QA/TSA/release lane was opened. Evidence:
  `history/tasks/luc-2443-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2440-NO-STALL-QUEUE-EXPEDITOR-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. The PM lane used the scoped wake payload and local source-of-truth
  after Paperclip API readback timed out. Current routing remains unchanged:
  [LUC-2372](/LUC/issues/LUC-2372) remains the active protected-input blocker,
  and downstream release confidence remains blocked/fail-closed through
  [LUC-2366](/LUC/issues/LUC-2366), [LUC-2361](/LUC/issues/LUC-2361), and
  [LUC-2378](/LUC/issues/LUC-2378). No duplicate Backend/source-control/PM/
  Ops/Security/Ops/QA/TSA/release lane was opened. Evidence:
  `history/tasks/luc-2440-no-stall-queue-expeditor-2026-06-06-task.md`.

- 2026-06-06 `LUC-2432-NO-STALL-QUEUE-EXPEDITOR-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. The PM lane used the scoped wake payload and local source-of-truth
  after Paperclip API readback timed out. Current routing remains unchanged:
  [LUC-2419](/LUC/issues/LUC-2419) is done, [LUC-2372](/LUC/issues/LUC-2372)
  remains the active protected-input blocker, and downstream release confidence
  remains blocked/fail-closed through [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2361](/LUC/issues/LUC-2361), and [LUC-2378](/LUC/issues/LUC-2378). No
  duplicate Backend/source-control/PM/Ops/Security/Ops/TSA/release lane was
  opened. Evidence:
  `history/tasks/luc-2432-no-stall-queue-expeditor-2026-06-06-task.md`.

- 2026-06-06 `LUC-2422-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination, protected release-gate
  routing, and repair-lane ownership confidence. Status: coordination
  `verified`; no product/runtime confidence changed. Current register truth:
  [LUC-2419](/LUC/issues/LUC-2419) is done as the Security/Ops owner-action
  refresh, while [LUC-2372](/LUC/issues/LUC-2372) remains the active protected
  input blocker. Downstream release confidence remains blocked/fail-closed
  through [LUC-2366](/LUC/issues/LUC-2366),
  [LUC-2361](/LUC/issues/LUC-2361), and [LUC-2378](/LUC/issues/LUC-2378). No
  duplicate Backend/source-control/PM/Ops/Security/Ops/TSA lane was opened.
  Evidence:
  `history/tasks/luc-2422-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2417-COOLIFY-PRODUCTION-DEPLOY-HEALTH-SWEEP-2026-06-06`
  applies to production deploy health and Coolify production topology
  confidence. Status: `verified` for read-only public API/Web health and
  production build freshness. Local `HEAD`, `origin/main`, and production Web
  build-info all report `56d8d440bfe0fd9ee692e9f669e35414d85d2493`; public
  smoke passed for API `/health`, API `/ready`, Web `/`, and Web
  `/api/build-info`; unauthenticated `/workers/ready` returned `401`
  fail-closed. Coolify read-only projection matches the canonical topology:
  six applications, PostgreSQL, Redis, zero generic services, and `17` visible
  global resource rows. Residual confidence remains limited for protected
  worker/dashboard/account/SLO/rollback/live-runtime proof, which was outside
  this read-only sweep. Evidence:
  `history/evidence/luc-2417-coolify-production-deploy-health-sweep-2026-06-06.md`,
  `history/tasks/luc-2417-coolify-production-deploy-health-sweep-2026-06-06-task.md`.

- 2026-06-06 `LUC-2418-NO-STALL-QUEUE-EXPEDITOR-2026-06-06`
  applies to V1 audit-to-completion coordination and protected release-gate
  routing. Status: coordination `verified`; no product/runtime confidence
  changed. Paperclip readback confirmed prior [LUC-2409](/LUC/issues/LUC-2409)
  status drift is closed through [LUC-2416](/LUC/issues/LUC-2416), and the
  active fail-closed chain remains [LUC-2372](/LUC/issues/LUC-2372) ->
  [LUC-2366](/LUC/issues/LUC-2366) ->
  [LUC-2361](/LUC/issues/LUC-2361) ->
  [LUC-2378](/LUC/issues/LUC-2378). Security/Ops follow-up
  [LUC-2419](/LUC/issues/LUC-2419) now owns the stale protected-input gate
  owner-action refresh. Evidence:
  `history/tasks/luc-2418-no-stall-queue-expeditor-2026-06-06-task.md`.

- 2026-06-06 `LUC-2414-AUTONOMOUS-IDLE-MAP-DRIFT-SWEEP-2026-06-06`
  applies to architecture route-map confidence, documentation parity, and V1
  coordination memory. Status: `verified` for docs/index parity. The route-map
  inventory now includes public legal routes `/privacy` and `/terms`, matching
  existing architecture nodes and route-reachable Web pages. Evidence:
  `pnpm run docs:parity:check` PASS (`API 22/22`, `Web 16/16`, `Routes 39/39`),
  `pnpm run architecture:graph:drift:strict` PASS (`831/831`, `0` missing),
  and `git diff --check` PASS with LF/CRLF warnings only. Release confidence
  remains blocked by protected proof gates; this checkpoint does not change
  runtime, product, deploy, or trading readiness. Evidence:
  `history/tasks/luc-2414-autonomous-idle-and-map-drift-sweep-2026-06-06-task.md`.

- 2026-06-06 `LUC-2395-GAP-REGISTER-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination, Bot Runtime release
  confidence, source-control discipline, and protected release-gate routing.
  TSA refreshed the current gap register after [LUC-2394](/LUC/issues/LUC-2394)
  closed the PM coordination dirty state. Status: coordination register
  `verified`; local Backend/source-control repair lanes are not reopened.
  Production release confidence remains gated by [LUC-2378](/LUC/issues/LUC-2378)
  push/promotion recheck and protected proof gates
  [LUC-2365](/LUC/issues/LUC-2365), [LUC-2372](/LUC/issues/LUC-2372), and
  [LUC-2366](/LUC/issues/LUC-2366). Evidence:
  `history/tasks/luc-2395-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2380-POST-2374-DIRTY-API-RUNTIME-DIFF-CLOSURE-2026-06-06`
  applies to Bot Runtime aggregate and release guardrail confidence. CTO
  classified the post-[LUC-2374](/LUC/issues/LUC-2374) dirty API runtime diff
  as coherent with the Bot Runtime read-model decomposition and related
  [LUC-2367](/LUC/issues/LUC-2367), [LUC-2368](/LUC/issues/LUC-2368), and
  [LUC-2381](/LUC/issues/LUC-2381) evidence. Status: `verified` for local
  source-control closure. Evidence: API typecheck, `quality:guardrails`,
  focused aggregate concurrency + positions read-model tests (`23/23`), and
  full aggregate e2e (`19/19`) after a local API test DB reset.
  Residual release proof remains blocked on protected runtime/worker/SLO
  evidence and explicit Ops mutation permit. Evidence:
  `history/tasks/luc-2380-close-post-2374-dirty-api-runtime-diff-before-push-permit-2026-06-06-task.md`.

- 2026-06-06 `LUC-2381-RUNTIME-MONITORING-SOURCE-CLOSURE-2026-06-06`
  applies to Bot Runtime aggregate maintainability and release source hygiene.
  Backend resolved the dirty runtime-monitoring source state blocking
  [LUC-2378](/LUC/issues/LUC-2378) by preserving the intended decomposition
  deltas, removing stray diagnostic fallback logging, and rerunning focused
  validation. Status: `verified local`; API typecheck, guardrails, and focused
  aggregate concurrency + positions read-model tests pass (`23/23`). Full
  DB-backed aggregate e2e release-behavior proof now passes (`19/19`) through
  the related Bot Runtime decomposition proof. Evidence:
  `history/tasks/luc-2381-resolve-dirty-runtime-monitoring-source-state-blocking-4787ee98-promotion-2026-06-06-task.md`.

- 2026-06-06 `LUC-2368-BOT-RUNTIME-READ-MODEL-DECOMPOSITION-2026-06-06`
  applies to Bot Runtime aggregate maintainability and release guardrail
  confidence. The target Backend services are below the production monolith
  threshold (`635` and `932` lines), no longer require staged-decomposition
  allowlist entries, and pass API typecheck, guardrails, focused helper/unit
  proof (`23/23`), and full DB-backed aggregate e2e proof (`19/19`) after a
  local API test DB reset. Status: `verified local`; production release proof
  remains owned by separate protected Ops/QA gates. Evidence:
  `history/tasks/luc-2368-decompose-bot-runtime-aggregate-read-model-monoliths-2026-06-06-task.md`.

- 2026-06-06 `LUC-2367-BOT-RUNTIME-READ-MODEL-DECOMPOSITION-2026-06-06`
  applies to Bot Runtime aggregate maintainability and release guardrail
  confidence. Backend split aggregate projection/runtime/fallback helpers and
  positions open-order/takeover helpers out of the two read-model service files.
  `runtimeMonitoringAggregateRead.service.ts` is now `635` lines and
  `runtimeSessionPositionsRead.service.ts` is now `932` lines, below the
  production monolith threshold. Status: `verified local`; typecheck,
  guardrails, focused helper/unit tests (`23/23`), and full DB-backed
  aggregate e2e proof (`19/19`) pass. Production release confidence remains
  owned by separate protected Ops/QA gates. Evidence:
  `history/tasks/luc-2367-decompose-bot-runtime-aggregate-read-model-monoliths-2026-06-06-task.md`.

- 2026-06-06 `LUC-2373-RESIDUAL-GUARDRAIL-DRIFT-2026-06-06` applies to Bot
  Runtime aggregate, architecture evidence graph, and release guardrail
  confidence. Residual drift after the [LUC-2365](/LUC/issues/LUC-2365) recheck
  is repaired locally: the active aggregate helper files are mapped to the
  existing graph nodes, strict graph
  drift passes `831/831` with `0` missing, and repository guardrails pass.
  Status: release guardrail `verified local`; Bot Runtime production promotion
  remains gated by source-control closure, protected proof, and Ops mutation
  permit. Evidence:
  `history/tasks/luc-2373-repair-residual-guardrail-drift-after-luc-2365-recheck-2026-06-06-task.md`.

- 2026-06-06 `LUC-2372-PROTECTED-RUNTIME-SLO-INPUTS-2026-06-06` applies to Bot
  Runtime workers, release operations, and protected production proof
  confidence. Security/Ops confirmed the current heartbeat environment has
  production UI audit/admin input names but lacks the runtime/SLO-critical
  protected families required for [LUC-2366](/LUC/issues/LUC-2366):
  `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`, `PROD_DB_CHECK_*` /
  `PRODUCTION_DB_CHECK_*`, `RC_*`, and `GATE*`. Status: `blocked`; protected
  runtime worker SLO proof for `de3db789` is not approved to run from this
  environment until the missing families are bound through approved secret
  handling. Evidence:
  `history/tasks/luc-2372-bind-protected-runtime-worker-slo-proof-inputs-de3db789-2026-06-06-task.md`,
  `history/evidence/luc-2372-protected-runtime-slo-input-readiness-de3db789-2026-06-06.md`.

- 2026-06-06 `LUC-2364-RELEASE-GUARDRAILS-2026-06-06` applies to Bot Runtime
  aggregate maintainability confidence, architecture evidence graph
  confidence, and release guardrail confidence. The guardrail blocker from
  [LUC-2361](/LUC/issues/LUC-2361) is repaired locally: public `/privacy` and
  `/terms` pages are mapped in graph registry/generated nodes, strict graph
  drift passes `828/828` with `0` missing, and repository guardrails pass.
  The two Bot Runtime read-model monoliths are not decomposed in this release
  gate; they are explicit single-file staged-decomposition exceptions:
  `runtimeMonitoringAggregateRead.service.ts` and
  `runtimeSessionPositionsRead.service.ts`. Status: release guardrail
  `verified local`; Bot Runtime behavior unchanged; maintainability follow-up
  [LUC-2368](/LUC/issues/LUC-2368) remains required to remove the temporary
  allowlist. Evidence:
  `history/tasks/luc-2364-repair-release-guardrails-blocking-de3db789-2026-06-06-task.md`.

- 2026-06-06 `LUC-2351-RUNTIME-AGGREGATE-SOURCE-CLOSURE-RERUN-2026-06-06`
  applies to Bot Runtime aggregate and source-control closure confidence.
  Backend re-repaired the exact aggregate e2e after [LUC-2341](/LUC/issues/LUC-2341)
  source closure reran the [LUC-2342](/LUC/issues/LUC-2342) proof and still
  saw two near-`30000ms` aggregate request timeouts plus one empty
  `positions.historyItems` result for overlapping running closed positions.
  Repair: aggregate `withTimeout` now clears its timer after race resolution,
  aggregate position subquery timeout/error now uses the existing bounded
  position fallback projection before empty fallback, and temporary e2e debug
  logging was removed. Status: `verified local`. Evidence: PASS exact full
  aggregate e2e command with `19/19` tests under `--testTimeout=30000`; PASS
  API typecheck. Production release confidence remains gated by protected
  runtime smoke and SLO proof. Evidence:
  `history/tasks/luc-2351-re-repair-aggregate-e2e-after-source-closure-rerun-2026-06-06-task.md`.

- 2026-06-06 `LUC-2354-GAP-REGISTER-AND-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination, Bot Runtime aggregate
  confidence, source-control discipline, and release-gate routing. The prior
  [LUC-2329](/LUC/issues/LUC-2329) register state is superseded for the
  Backend aggregate blocker: [LUC-2328](/LUC/issues/LUC-2328),
  [LUC-2333](/LUC/issues/LUC-2333), and [LUC-2342](/LUC/issues/LUC-2342)
  have verified the local aggregate repair sequence with the exact full
  aggregate e2e passing `19/19` under `--testTimeout=30000` and API typecheck
  passing. Remaining lanes are not duplicate Backend repair: source-control
  closure must package or explicitly decline the coherent dirty set, and
  QA/Ops/Security must still run protected runtime/worker/SLO proof under
  approved release gates before production readiness can be claimed. Status:
  coordination register verified; Bot Runtime aggregate is `verified local`,
  production release confidence remains gated. Evidence:
  `history/tasks/luc-2354-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-06 `LUC-2342-RUNTIME-AGGREGATE-POST-PROOF-REGRESSION-2026-06-06`
  applies to Bot Runtime aggregate and source-control closure confidence.
  Backend repaired the post-aggregate-proof full-file regression blocking
  [LUC-2341](/LUC/issues/LUC-2341). Root cause: the aggregate hidden-trade e2e
  restored a Prisma `trade.findMany` spy while timed-out aggregate subqueries
  could still be running, so later aggregate reads saw
  `prisma.trade.findMany is not a function` and fell back to empty payloads;
  several valid aggregate subqueries also exceeded the old `15000ms` default
  under the full DB-backed file. The bounded proof now keeps the forwarding spy
  active after assertion, and the aggregate subquery default timeout is
  `25000ms` with `RUNTIME_MONITORING_AGGREGATE_SUBQUERY_TIMEOUT_MS` override
  preserved. Status: `verified local`. Evidence: PASS exact full aggregate
  e2e command with `19/19` tests and PASS API typecheck. Evidence:
  `history/tasks/luc-2342-repair-post-aggregate-proof-runtime-aggregate-regression-before-source-closure-2026-06-06-task.md`.

- 2026-06-06 `LUC-2333-RUNTIME-AGGREGATE-TRADE-ROW-REPAIR-2026-06-06`
  applies to Bot Runtime aggregate and production API reliability confidence.
  Backend repaired the post-QA rerun failure where the aggregate endpoint
  returned HTTP `200` but omitted persisted trade rows/totals. Root cause:
  aggregate fanout nulled the whole session row when one nested reader timed
  out or errored, erasing valid sibling trade results. The aggregate reader now
  applies per-subquery empty fallback payloads, preserving truthful trade
  totals/items when symbol-stats or positions are slow. Evidence: PASS original
  combined DB-backed aggregate e2e with `--testTimeout=30000`; bounded hidden
  trade proof returned `trades.total === 260` and `trades.items.length === 5`;
  neighboring proof returned one visible row and `trades.total === 2`; API
  typecheck PASS. Confidence: `verified local`, still release-gated for
  production promotion, protected runtime smoke, and SLO proof. Evidence:
  `history/tasks/luc-2333-complete-runtime-aggregate-trade-row-repair-after-qa-rerun-2026-06-06-task.md`,
  `history/evidence/luc-2333-runtime-aggregate-trade-row-repair-after-qa-rerun-2026-06-06.md`.

- 2026-06-06 `LUC-2328-RUNTIME-AGGREGATE-TRADE-TOTALS-DB-PROOF-2026-06-06`
  applies to Bot Runtime aggregate and production API reliability confidence.
  Backend repaired the DB-backed aggregate proof after [LUC-2319](/LUC/issues/LUC-2319)
  restored local Postgres/Redis and [LUC-2329](/LUC/issues/LUC-2329)
  narrowed the blocker to aggregate `trades.total=0`. The focused e2e spy now
  preserves Prisma `trade.findMany` delegate binding while still asserting
  bounded materialization, and the aggregate subquery default timeout is
  `15000ms` with the existing environment override preserved. Status:
  verified locally. Evidence: PASS focused DB-backed aggregate e2e for `260`
  hidden trades with `perSessionLimit=5` and PASS API typecheck. No production
  mutation occurred. Evidence:
  `history/tasks/luc-2328-repair-runtime-aggregate-trade-totals-db-backed-proof-2026-06-06-task.md`,
  `history/evidence/luc-2328-runtime-aggregate-trade-totals-db-backed-proof-2026-06-06.md`.

- 2026-06-06 `LUC-2329-GAP-REGISTER-AND-REPAIR-LANE-REFRESH-2026-06-06`
  applies to V1 audit-to-completion coordination, Bot Runtime release
  confidence, production Ops health evidence, and source-control discipline.
  Engineering Delivery Lead refreshed the gap register after [LUC-2319](/LUC/issues/LUC-2319)
  restored local DB/Redis and [LUC-2321](/LUC/issues/LUC-2321) confirmed
  production public health. Current critical runtime gap is now narrower:
  focused aggregate e2e reaches API/DB and returns HTTP `200`, but fails at
  `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts:534`
  because `trades.total` is `0` instead of expected `260`. Active owner lane
  exists: [LUC-2328](/LUC/issues/LUC-2328) Backend repair is `in_progress`;
  [LUC-2317](/LUC/issues/LUC-2317) QA proof remains blocked/covered by that
  child. Production public API/Web health is recovered on `origin/main`
  `a70d7881b69e605c537af5f81cbeb74dc81e9329`, but protected account/worker
  readiness remains unproven and local `HEAD` is ahead at
  `10f1cfce94533e96a65b487d8cd0b1e9dff8f59e`. Status: coordination
  register verified; runtime aggregate release confidence still blocked by
  [LUC-2328](/LUC/issues/LUC-2328). Evidence:
  `history/tasks/luc-2329-gap-register-and-repair-lane-refresh-2026-06-06-task.md`.

- 2026-06-05 `LUC-2305-SOAR-WEB-CONTAINER-RUNTIME-CRASH-INVESTIGATION-2026-06-05`
  applies to production Web runtime confidence and Ops release confidence.
  Status: failed for production Web availability, verified for crash
  classification. API remains healthy (`/health` and `/ready` `200`) while
  Web remains unavailable (`/` and `/api/build-info` `503`). Coolify reports
  `soar-web` `restarting:unknown` with crash restart signal at
  `2026-06-05T21:18:51Z`. Approved read-only host log proof confirms repeated
  `MODULE_NOT_FOUND` for `[APP_ROOT]/scripts/runWebNextProductionCommand.mjs`,
  followed by pnpm recursive start failure and exit `1`. Root cause class:
  `web image/startup packaging`. Required next proof:
  Frontend/Engineering validates the image/startup repair, then Ops runs a
  separately permitted recovery deploy/restart path and Web build-info smoke.
  Evidence:
  `history/tasks/luc-2305-redacted-soar-web-container-runtime-crash-investigation-2026-06-05-task.md`,
  `history/evidence/luc-2305-soar-web-container-runtime-crash-investigation-2026-06-05.md`.

- 2026-06-05 `LUC-2300-BOUND-RUNTIME-AGGREGATE-MATERIALIZATION-2026-06-05`
  applies to Bot Runtime and production API reliability confidence. Backend API
  bounded the nested runtime aggregate trade/position materialization path:
  runtime trade visible rows now use DB sorting/paging, trade total/fees use DB
  `count`/`aggregate`, carry-over position ids are capped, and lifecycle
  support trade rows in both trade and position readers have explicit caps.
  Validation passed: API typecheck, aggregate concurrency helper test, focused
  DB-backed trade-total proof, and focused bounded hidden-trade proof after the
  local Postgres blocker resolved. Follow-up repairs [LUC-2328](/LUC/issues/LUC-2328)
  and [LUC-2333](/LUC/issues/LUC-2333) closed the proof gaps around Prisma spy
  binding, aggregate subquery timeout, and per-subquery fallback preserving
  valid trade rows. Status: verified local. Production promotion remains
  release/Ops gated.
  Evidence:
  `history/tasks/luc-2300-bound-runtime-aggregate-trade-position-materialization-2026-06-05-task.md`,
  `history/evidence/luc-2300-runtime-aggregate-bounded-materialization-2026-06-05.md`,
  `history/evidence/luc-2300-runtime-aggregate-db-backed-proof-2026-06-06.md`.

- 2026-06-05 `LUC-2297-SOAR-WEB-CRASH-LOG-RETRIEVAL-2026-06-05`
  applies to production Web runtime confidence and Ops release confidence.
  Status: failed for production Web availability, verified for read-only crash
  diagnosis. Coolify still reports `soar-web` `restarting:unknown` with
  `last_restart_type=crash` at `2026-06-05T20:58:25Z`. Approved read-only
  `codex-vps` Docker inspection found the target-SHA Web container in a
  restart loop. Current logs repeatedly fail with `MODULE_NOT_FOUND` for
  `[APP_ROOT]/scripts/runWebNextProductionCommand.mjs`, then pnpm recursive
  start failure and exit `1`. Public smoke remains API `/health` `200`, API
  `/ready` `200`, Web `/` `503`, Web `/api/build-info` `503`. Root cause
  class: `web image/startup packaging`. Required next proof:
  [LUC-2304](/LUC/issues/LUC-2304) repairs the production Web image/startup
  contract, then Ops runs a separately permitted deploy/recovery and public Web
  build-info smoke. No production mutation occurred. Evidence:
  `history/evidence/luc-2297-soar-web-crash-log-retrieval-2026-06-05.md`.

- 2026-06-05 `LUC-2255-FRESH-BROWSER-PROOF-PUBLIC-READ-ONLY-WEB-ACTIONS-2026-06-05`
  applies to Web public/auth route confidence. Frontend QA added a reusable
  fresh-browser proof runner for public/read-only routes and local public
  `/terms` and `/privacy` targets after production register-page proof found
  `404` prefetches. Production proof currently passes public home, login, and
  offline on desktop/mobile, but fails register on the deployed bundle until
  the local route fixes are deployed. Focused Web tests passed (`2` files /
  `7` tests), Web typecheck passed, and after [LUC-2261](/LUC/issues/LUC-2261)
  repaired local Web build/start, final local production-server browser proof
  passed for desktop/mobile public home, login, register, terms, privacy,
  offline, and login/register password visibility toggles with `0` browser
  issues. No protected auth, form submit, account mutation, deploy, DB, secret,
  exchange, or LIVE proof was claimed. Evidence:
  `history/tasks/luc-2255-fresh-browser-proof-public-read-only-web-actions-2026-06-05-task.md`,
  `history/evidence/luc-2255-local-public-read-only-browser-proof-2026-06-05.md`.

- 2026-06-05 `LUC-2264-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, `COOLIFY_SOAR_API_APP_ID`,
  `COOLIFY_SOAR_TEAM_ID`, and `COOLIFY_TEAM_ID`. Fresh readback at
  `2026-06-05T18:53:12Z` resolved selector `LuckySparrow`, project `Soar`,
  environment `production`, six applications, PostgreSQL, Redis, zero generic
  services, eight production-environment resources, and `17` visible global
  resource rows. The teams list endpoint returned `0` rows in this runner, but
  current selector and project-scoped reads succeeded. Application inventory
  status remains `running:unknown`; PostgreSQL and Redis report
  `running:healthy` from the production environment readback. Validation
  passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`). This is
  read-only status access proof only, not deploy, restart, rollback, protected
  smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2264-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2253-API-SCRIPT-TOOLING-MISSING-TEST-RELATION-REPAIR-2026-06-05`
  applies to Architecture Evidence Graph and API script/tooling confidence.
  Backend API added import-safe helper exports and DB-free focused proof for
  the named API scripts, plus `26` direct scanner-readable function-level
  `tests` rows in `docs/architecture/relations/priority-test-links.csv`.
  Validation passed: `pnpm --filter api exec vitest run scripts/apiScriptTooling.test.ts --run`
  (`1` file / `7` tests), targeted relation readback (`26` rows, `0` missing
  paths, `0` duplicate exact pairs), MJS syntax checks, graph generate
  (`651` nodes / `842` relations / `27` chains), architecture-awareness
  refresh (`14388` entities / `22625` relations, generated
  `2026-06-05T18:23:53.329Z`), and report readback (`0` assigned target rows
  remaining in top actionable samples; actionable missing-test rows `816`).
  Strict graph drift is blocked by unrelated public Web pages
  `apps/web/src/app/(public)/privacy/page.tsx` and
  `apps/web/src/app/(public)/terms/page.tsx`; API typecheck is blocked by
  unrelated test typing failures in positions orphan-repair and workers
  readiness tests. No DB/network script execution, deploy, protected smoke,
  secret, account, exchange, or live-trading action occurred. Evidence:
  `history/tasks/luc-2253-repair-api-script-tooling-missing-test-relations-2026-06-05-task.md`.

- 2026-06-05 `LUC-2261-REPAIR-LOCAL-WEB-BUILD-START-BLOCKER-PUBLIC-BROWSER-PROOF-2026-06-05`
  applies to Web public/auth route confidence and local rendered proof
  confidence. Frontend QA repaired the local Web build/start blocker by
  routing Web build/start through a production-env Next wrapper, then verified
  local public/read-only route rendering and password visibility toggles in a
  fresh browser. Validation passed: `node --check
  scripts/runWebNextProductionCommand.mjs`, `node --check
  scripts/runPublicReadOnlyBrowserProof.mjs`, `pnpm --filter web run build`,
  `pnpm --filter web run typecheck`, local production HTTP route checks on
  `127.0.0.1:3101`, and
  `node scripts/runPublicReadOnlyBrowserProof.mjs --issue LUC-2261
  --web-base-url http://127.0.0.1:3101 ...` with status `PASS`. Previous
  local blocker `Next /404 prerender <Html> should not be imported outside of
  pages/_document` did not recur. Validation-owned local Web and browser
  processes were cleaned up (`Port3101Listeners=0`, `ProofBrowsers=0`). This
  is local public/read-only proof only, not protected production auth proof,
  deploy, secret/account/database/exchange mutation, or live-trading proof.
  Evidence:
  `history/tasks/luc-2261-repair-local-web-build-start-blocker-public-browser-proof-2026-06-05-task.md`,
  `history/evidence/luc-2261-local-public-read-only-browser-proof-2026-06-05.md`.

- 2026-06-05 `LUC-2260-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; team selector
  binding names are also present by name without values printed. Fresh
  readback at `2026-06-05T18:25:22Z` resolved selector `LuckySparrow`, project
  `Soar`, environment `production`, six applications, PostgreSQL, Redis, zero
  generic services, eight production-environment resources, and `17` visible
  global resource rows. Application inventory status remains
  `running:unknown`; PostgreSQL and Redis report `running:healthy` from the
  production environment readback. Validation passed:
  `pnpm run ops:coolify-stack:env-check:test` (`8/8`). This is read-only
  status access proof only, not deploy, restart, rollback, protected smoke,
  database health beyond inventory, SLO, restore/rollback, or live-trading
  proof. Evidence:
  `history/evidence/luc-2260-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2255-FRESH-BROWSER-PROOF-PUBLIC-READ-ONLY-WEB-ACTIONS-2026-06-05`
  applies to Web public/auth route confidence. Frontend QA added a reusable
  fresh-browser proof runner for public/read-only routes and local public
  `/terms` and `/privacy` targets after production register-page proof found
  `404` prefetches. Production proof currently passes public home, login, and
  offline on desktop/mobile, but fails register on the deployed bundle until
  the local route fixes are deployed. Focused Web tests passed (`2` files /
  `7` tests) and Web typecheck passed. The prior local rendered browser proof
  blocker is superseded by LUC-2261, which verified local Web build/start and
  local public browser proof. No protected auth,
  form submit, account mutation, deploy, DB, secret, exchange, or LIVE proof
  was claimed. Evidence:
  `history/tasks/luc-2255-fresh-browser-proof-public-read-only-web-actions-2026-06-05-task.md`.

- 2026-06-05 `LUC-2254-AUTH-SESSION-HELPER-MISSING-TEST-LINKS-2026-06-05`
  applies to API Auth, API Bots, and Architecture Evidence Graph test
  traceability. Backend API added focused pure tests for
  `getSessionJwtExpiresIn`, `getSessionTtlMs`, and the bots shared
  `createPayload` helper, plus `3` direct scanner-readable relation rows in
  `docs/architecture/relations/priority-test-links.csv`. Validation passed:
  focused API helper tests (`2` files / `5` tests), targeted relation
  readback (`3` rows, `0` missing test files, `0` duplicate exact pairs, `0`
  target helper strings remaining in the refreshed report),
  architecture-awareness refresh (`14382` entities / `22615` relations,
  generated `2026-06-05T18:06:29.890Z`), graph generate (`651` nodes /
  `842` relations / `27` chains), and strict graph drift (`827/827`, `0`
  missing). Actionable missing-test rows moved from `835` to `816`, and the
  refreshed actionable sample no longer lists the three assigned helper
  names. A DB-backed bots E2E attempt remained blocked by
  local Postgres unavailability at `localhost:5432`, so final proof used the
  DB-free helper layer. No auth semantics, token policy, cookie settings,
  production config, deploy, protected smoke, secret, account, exchange, or
  live-trading action changed. Evidence:
  `history/tasks/luc-2254-close-auth-session-helper-missing-test-links-2026-06-05-task.md`.

- 2026-06-05 `LUC-2252-RELEASE-OPS-SCRIPT-MISSING-TEST-RELATIONS-2026-06-05`
  applies to Architecture Evidence Graph and release/Ops script traceability
  confidence. Test Automation added a focused static contract test for the top
  release/Ops script wrappers and direct scanner-readable `tests` rows for
  `13` target scripts in `docs/architecture/relations/priority-test-links.csv`.
  Validation passed: `node --test scripts/releaseOpsScriptContracts.test.mjs`
  (`2/2`), targeted relation readback (`13` rows, `0` missing entity/test
  paths, `0` duplicate exact pairs), architecture-awareness refresh (`14380`
  entities / `22584` relations, generated `2026-06-05T18:01:10.084Z`), report
  readback (`actionableMissingTests=837`, `0` LUC-2252 targets remaining in
  top actionable sample), graph generate, and strict graph drift (`827/827`,
  `0` missing). This is local relation/static contract proof only, not
  protected production smoke, deploy, restart, env/database/account mutation,
  secret readback, exchange mutation, Docker/browser proof, or live-trading
  proof. Evidence:
  `history/tasks/luc-2252-repair-top-release-ops-script-missing-test-relations-2026-06-05-task.md`.

- 2026-06-05 `LUC-2230-CURRENT-ACTIONABLE-MISSING-TEST-RELATION-BUCKET-CLOSURE-2026-06-05`
  applies to Architecture Evidence Graph, API Bots, and API Engine test
  traceability confidence. Test Automation added `24` direct
  scanner-readable `tests` rows for focused local runtime helper families in
  `docs/architecture/relations/priority-test-links.csv`. Targeted readback
  found `0` missing entity/test paths and `0` duplicate exact pairs; focused
  API helper tests passed (`6` files / `39` tests); architecture-awareness
  refresh passed (`14342` entities / `22490` relations, generated
  `2026-06-05T16:02:05.428Z`) and reduced actionable missing-test rows
  `859` -> `835`; graph generate passed and strict drift passed (`824/824`,
  `0` missing). This is local relation/test proof only, not protected
  production, deploy, secret, exchange, DB-backed, or live-trading proof.
  Evidence:
  `history/tasks/luc-2230-close-current-actionable-missing-test-relation-buckets-2026-06-05-task.md`.

- 2026-06-05 `LUC-2222-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T15:34:58Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  eight production-environment resources, and `17` visible global resource
  rows. Application inventory status remains `running:unknown`; PostgreSQL and
  Redis report `running:healthy` from the production environment readback.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2222-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2198-SCRIPT-TOOLING-MISSING-TEST-RELATION-REPAIR-2026-06-05`
  applies to Architecture Evidence Graph confidence and release/audit tooling
  test traceability. Test Automation validated `40` direct scanner-readable
  test relation rows for current top script/tooling samples and refreshed the
  architecture-awareness exports. Targeted relation readback found `0` missing
  referenced files and `0` duplicate exact pairs; focused script/tooling Node
  tests passed (`49/49`); architecture-awareness refresh passed (`14320`
  entities / `22430` relations, generated `2026-06-05T12:36:20.092Z`); and
  strict graph drift passed (`824/824`, `0` missing). This is verified
  relation proof, not new runtime, protected production, deploy, secret,
  exchange, DB-backed, or live-trading proof. Evidence:
  `history/tasks/luc-2198-repair-script-tooling-missing-test-relation-backlog-2026-06-05-task.md`.

- 2026-06-05 `LUC-2204-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T12:39:24Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  eight production-environment resources, and `17` visible global resource
  rows. Application inventory status remains `running:unknown`; PostgreSQL and
  Redis report `running:healthy` from the production environment readback.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2204-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2199-WEB-SUPPORT-SURFACE-MISSING-TEST-AUDIT-2026-06-05`
  applies to `web-shared` and Architecture Evidence Graph test confidence.
  The Web support/type rows `apps/web/vitest.setup.ts` and
  `libs/shared/index.d.ts` are no longer open support-surface missing-test
  samples after focused proof and direct priority test links. Evidence: Web
  focused tests PASS (`2` files / `4` tests), architecture-awareness refresh
  PASS (`14322` entities / `22433` relations, generated
  `2026-06-05T12:40:45.169Z`), actionable missing-test rows `859`, graph
  generate PASS, strict drift PASS (`824/824`, `0` missing). Task:
  `history/tasks/luc-2199-audit-web-support-surface-missing-test-rows-2026-06-05-task.md`.

- 2026-06-05 `LUC-2200-MONEY-FACING-RUNTIME-MISSING-TEST-FAMILY-AUDIT`
  applies to `SOAR-ENGINE-001`, `SOAR-EXCHANGE-ADAPTER-001`,
  `SOAR-ORDERS-001`, `SOAR-MANUAL-ORDERS-001`, `SOAR-POSITIONS-001`, and
  Architecture Evidence Graph test confidence. Integration Trading audited
  residual missing-test signals for `CHAIN-ENGINE-RUNTIME-CORE`,
  `CHAIN-EXCHANGE-ADAPTER-DEEP`, `CHAIN-MANUAL-ORDER-DEEP`, and
  `CHAIN-POSITIONS-CORE` against the architecture-awareness report generated
  `2026-06-05T12:00:45.591Z`. Static graph readback found `43` API
  implementation file rows with `228` function/entity-level missing direct
  `tests` links, but every filtered file has curated graph test coverage
  relation to an existing focused or aggregate test file. No new missing local
  pure-function test was isolated after the LUC-2187 order-fill/math closure.
  Focused DB-free representative proof passed (`6` files / `45` tests). A
  larger representative pack timed out and is not counted as proof. DB-backed
  positions/order lifecycle proof remains local-Postgres dependent; protected
  production/live readback remains gated by [LUC-241](/LUC/issues/LUC-241).
  Evidence:
  `history/tasks/luc-2200-money-facing-runtime-residual-missing-test-families-2026-06-05-task.md`.

- 2026-06-05 `LUC-2197-CURRENT-ACTIONABLE-MISSING-TEST-ROWS-2026-06-05`
  applies to Architecture Evidence Graph and cross-module test confidence.
  Test Automation reconstructed the current scanner actionable missing-test
  filter from the `2026-06-05T12:33:42.151Z` architecture-awareness export and
  matched graph health exactly: raw missing tests `7654`, actionable
  missing-test rows `859`, actionable missing-doc rows `0`. The current
  actionable rows are classified as aggregate local/release/Ops scripts,
  protected production proof collectors, aggregate script/tooling proof, Web
  residual support, API engine/runtime helpers, API tooling, API positions and
  API-key crypto helper relation granularity, API bots, worker/observability,
  Web build-info proxies, generic API utilities, and auth/session helpers. This
  is verified classification only, not new runtime
  proof, DB-backed proof, protected production proof, deploy, secret, exchange,
  or live-trading proof. Evidence:
  `history/tasks/luc-2197-classify-current-actionable-missing-test-rows-architecture-awareness-2026-06-05-task.md`.

- 2026-06-05 `LUC-2188-DYNAMIC-PROTECTED-ROUTE-FIXTURE-PROOF-2026-06-05`
  applies to protected dynamic route/action proof confidence for Web wallets,
  strategies, markets, bots, and backtests. Test Automation added synthetic
  fixture-ID dynamic route rows to the local protected route/action proof
  runner and verified the static fixture-route mode. Validation passed:
  `node --check scripts/runLocalProtectedRouteActionProof.mjs` and
  `pnpm run qa:local-protected-route-actions:proof -- --today 2026-06-05
  --issue LUC-2188 --clusters wallets,strategies,markets,bots,backtests
  --dynamic-fixtures-only --include-dynamic-fixtures
  --static-dynamic-fixture-proof --cdp-timeout-ms 5000`. Evidence readback:
  status `PASS`, `12` dynamic route rows PASS, `1` fail-closed browser row
  BLOCKED, failures `0`, blockers `0`, static mapping `PASS`. This is local
  static fixture-ID route/source/index proof only, not rendered browser proof,
  DB-backed API fixture proof, protected production proof, deploy, secret,
  exchange, or LIVE proof. Evidence:
  `history/tasks/luc-2188-dynamic-protected-route-fixture-proof-2026-06-05-task.md`;
  `history/evidence/luc-2188-local-protected-route-action-proof-matrix-2026-06-05.md`.

- 2026-06-05 `LUC-2186-RESIDUAL-MISSING-DOC-RELATION-CLOSURE-2026-06-05`
  applies to Architecture Evidence Graph confidence, API positions/profile/
  users/root/observability/queue/prisma/workers documentation confidence, and
  Web shell/auth documentation confidence. Docs Memory added direct
  scanner-readable documentation relations for the residual `32` actionable
  missing-doc rows and refreshed the architecture-awareness exports. Current
  report generated `2026-06-05T12:00:45.591Z` shows actionable missing docs
  `0` (down from `32`). Validation passed: targeted relation readback (`32`
  linked / `0` missing / `0` duplicate exact rows), graph generate, strict
  graph drift (`823/823`, `0` missing), docs parity, Softwarehouse
  architecture-awareness refresh, and targeted diff check with CRLF warnings
  only. Evidence:
  `history/tasks/luc-2186-close-residual-actionable-missing-doc-relation-rows-2026-06-05-task.md`.

- 2026-06-05 `LUC-2187-HIGH-SIGNAL-MISSING-TEST-RELATION-FAMILIES-2026-06-05`
  applies to `SOAR-POSITIONS-001`, `SOAR-PROFILE-API-KEYS-001`,
  `SOAR-ORDERS-001`, `SOAR-MANUAL-ORDERS-001`, and Architecture Evidence
  Graph confidence. Test Automation inspected the remaining high-signal
  missing-test relation families named by `LUC-2175`: API positions helpers,
  API-key crypto helpers, and order fill/math helpers. Existing focused proof
  is sufficient for positions helper id build/parse/scope behavior and crypto
  versioned encryption/decryption behavior; order fill math now has a focused
  unit test for weighted entry price, new-position fill, invalid fill-price
  fail-closed behavior, and negative input normalization. Direct test
  relations were added in `docs/architecture/relations/priority-test-links.csv`.
  Validation passed for crypto + fill math (`8/8`), positions helper subset
  (`1/1`), graph generate, strict graph drift (`823/823`, `0` missing), and
  targeted diff check. Full DB-backed reconciliation default-deps proof is
  blocked by local Postgres unavailability at `localhost:5432`, not by a new
  code regression. Evidence:
  `history/tasks/luc-2187-inspect-high-signal-missing-test-relation-families-2026-06-05-task.md`.

- 2026-06-05 `LUC-2176-LOCAL-ROUTE-ACTION-PROOF-MATRIX-REMAINING-NON-PRODUCTION-FAMILIES`
  applies to `web-reports`, `web-logs`, `web-profile`, `web-admin`, and the
  protected route/action proof harness. Test Automation extended the local
  harness with selected-cluster execution and timeout-safe CDP behavior, then
  verified reports, logs, profile, admin subscriptions, and admin users with
  `6/6` PASS route rows, static mapping `PASS`, and blockers `0`. This is
  local protected route reachability only, not production auth, DB-backed data,
  profile/admin mutation, exchange, deployment, or LIVE proof. Evidence:
  `history/tasks/luc-2176-extend-local-route-action-proof-matrix-remaining-non-production-families-2026-06-05-task.md`;
  `history/evidence/luc-2176-local-protected-route-action-proof-matrix-2026-06-05.md`.

- 2026-06-05 `LUC-2145-LIVE-EXCHANGE-READBACK-MATRIX-2026-06-05`
  applies to `SOAR-MANUAL-ORDERS-001`, `SOAR-ORDERS-001`,
  `SOAR-BOT-RUNTIME-001`, `SOAR-ENGINE-001`, `SOAR-EXCHANGE-ADAPTER-001`,
  and market-data stream adapter confidence. Integration Trading converted the
  five critical live exchange chains into a no-mutation readback matrix:
  `CHAIN-MANUAL-ORDER-DEEP`, `CHAIN-RUNTIME-DCA-PNL`,
  `CHAIN-EXCHANGE-ADAPTER-DEEP`, `CHAIN-ENGINE-RUNTIME-CORE`, and
  `CHAIN-MARKET-DATA-STREAM-ADAPTERS`. Existing status remains
  `verified_local`; the update adds evidence routing only. Protected
  production readback remains gated by [LUC-241](/LUC/issues/LUC-241) and
  Security/Ops/QA session handling. Any LIVE order/cancel/close remains
  fail-closed until a separate approval names exchange, account, symbol, side,
  size, max risk, cleanup/readback, and rollback/kill-switch context. No
  runtime behavior, deploy, restart, rollback, database/account/API-key/
  exchange mutation, protected smoke, secret readback, or LIVE action occurred.
  Evidence:
  `history/tasks/luc-2145-live-exchange-critical-chain-no-mutation-readback-matrix-2026-06-05-task.md`.

- 2026-06-05 `LUC-2174-REMAINING-ACTIONABLE-MISSING-DOC-ROWS-2026-06-05`
  applies to Architecture Evidence Graph documentation traceability and API
  root/auth/wallets/backtests/bots/engine/orders module documentation
  confidence. Docs Memory classified the current top actionable missing-doc
  backend helper families after the June 5 graph refresh and added direct
  scanner-readable documentation links for `40` targets. Targeted CSV readback
  passed (`40` linked / `0` missing / `0` duplicate exact rows).
  Architecture-awareness refresh generated `2026-06-05T10:58:31.707Z` with
  `14282` entities and `22292` relations; actionable missing docs improved
  from `72` to `32`. Strict graph drift passed (`822/822`, `0` missing), and
  docs parity passed (`API 22/22`, `Web 16/16`, `Routes 37/37`). This is
  documentation relation proof only, not runtime, DB-backed, production,
  deploy, secret, exchange, or live-trading proof. Evidence:
  `history/tasks/luc-2174-classify-remaining-actionable-missing-doc-rows-after-graph-refresh-2026-06-05-task.md`.

- 2026-06-05 `LUC-2175-REMAINING-ACTIONABLE-MISSING-TEST-ROWS-2026-06-05`
  applies to Architecture Evidence Graph and cross-module test confidence.
  Test Automation reconstructed and classified the full `896` actionable
  missing-test rows from the `2026-06-05T10:58:31.707Z` architecture-awareness
  graph refresh. The largest families are aggregate script/tooling proof
  (`354`), protected production proof collectors (`147`), local/release/Ops
  aggregate scripts (`147`), Web residual support (`85`), and API engine/runtime
  helpers (`62`). Existing proof remains represented by predecessor lanes
  [LUC-2156](/LUC/issues/LUC-2156), [LUC-2157](/LUC/issues/LUC-2157), and
  [LUC-2164](/LUC/issues/LUC-2164). This is verified classification only, not
  new runtime proof, DB-backed proof rerun, protected production proof, deploy,
  secret, exchange, or live-trading proof. Evidence:
  `history/tasks/luc-2175-classify-remaining-actionable-missing-test-rows-after-graph-refresh-2026-06-05-task.md`.

- 2026-06-05 `LUC-2177-SEMANTIC-API-PARITY-AUDIT-2026-06-05` applies to
  backend API contract confidence for `api-orders`, `api-positions`,
  `api-bots`, `api-profile`, `api-subscriptions`, `api-admin`, and
  `api-reports`. Backend API Engineer audited representative high-risk
  dashboard/admin route/controller/type/service/doc/test chains beyond the
  [LUC-2107](/LUC/issues/LUC-2107) route inventory guardrail. Route/API matrix
  parity passed (`37` Web routes, `109` API endpoints, `0` gaps), and focused
  reports aggregation proof passed (`reports.service.test.ts`, `2/2`). Static
  inspection found explicit DTO/query parsing or justified no-input read
  contracts for the sampled families and no confirmed semantic DTO/response
  mismatch. This is local/static representative audit proof, not exhaustive
  generated response-shape diffing, DB-backed e2e rerun, protected production
  readback, deploy, secret, exchange, or live-trading proof. Evidence:
  `history/tasks/luc-2177-semantic-route-api-dto-response-parity-audit-2026-06-05-task.md`.

- 2026-06-05 `LUC-2173-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T10:52:27Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  eight production-environment resources, and `17` visible global resource
  rows. Application inventory status remains `running:unknown`; PostgreSQL and
  Redis report `running:healthy` from the production environment readback.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2173-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2165-SECOND-WAVE-SCRIPT-TOOLING-RELATION-BACKLOG-2026-06-05`
  applies to documentation, architecture awareness tooling, API script/tooling,
  Prisma/data tooling, and protected proof-runner traceability confidence.
  Docs Memory classified second-wave script/tooling relation rows across
  fragment-level proof-runner helper doc-link gaps, `apps/api/scripts` tooling
  doc-link gaps, Prisma/data tooling doc-link gaps, missing-test relation
  backlog, protected proof collectors, and no-action scanner noise. Direct
  documentation links were added for `15` sample rows. Targeted CSV readback
  passed (`15` linked / `0` missing / `0` duplicate exact rows).
  Architecture-awareness refresh generated `2026-06-05T10:29:09.030Z` with
  `14269` entities and `22200` relations; actionable missing docs improved
  from `108` to `74`, and every added sample row reads back with
  `documents=1`. Strict graph drift passed (`822/822`, `0` missing). This is
  documentation relation proof only, not runtime, production, deployment,
  protected-smoke, secret, exchange, or live-trading proof. Evidence:
  `history/tasks/luc-2165-classify-second-wave-script-tooling-relation-backlog-2026-06-05-task.md`.

- 2026-06-05 `LUC-2164-SHARED-WEB-UI-MISSING-TEST-RELATION-RECONCILIATION-2026-06-05`
  applies to `web-shared` and Architecture Evidence Graph test confidence.
  Test Automation converted the prior evidence-present shared Web UI/form/
  layout/lib/theme/dropdown/header missing-test classification into
  scanner-readable direct `tests` relations through
  `docs/architecture/relations/priority-test-links.csv`. Focused Web proof
  passed (`28` files / `145` tests). Architecture-awareness readback generated
  `2026-06-05T10:28:04.175Z` with `14267` entities and `22197` relations;
  actionable missing tests improved from `920` to `896`, and targeted
  LUC-2164 priority paths remaining in actionable missing-test samples read
  back as `0`. `apps/web/vitest.setup.ts` and `libs/shared/index.d.ts` remain
  classified support/type surfaces, not user-facing UI test gaps. Strict graph
  drift passed (`822/822`, `0` missing). This is local architecture relation
  proof only, not runtime, production, deployment, protected-smoke, secret,
  exchange, or live-trading proof. Evidence:
  `history/tasks/luc-2164-reconcile-shared-web-ui-missing-test-relation-rows-2026-06-05-task.md`.

- 2026-06-05 `LUC-2163-BACKEND-MODEL-DOC-LINK-NORMALIZATION-2026-06-05`
  applies to Architecture Evidence Graph, API engine, API exchange, API
  orders, API positions, API profile, API subscriptions, service reliability,
  deployment readiness, Web bots, Web icons, and Web profile documentation
  confidence. Docs Memory normalized current backend model-family missing-doc
  rows to canonical owner docs and classified the owner-doc proof boundary.
  Direct relation readback passed (`22` rows present and unique).
  Architecture-awareness refresh generated `2026-06-05T10:29:09.030Z` with
  `14272` entities and `22205` relations; actionable missing docs improved
  from `108` to `74`, and the prior backend model sample family no longer
  appears in top actionable missing-doc rows. Validation passed:
  architecture graph generate, strict graph drift (`822/822`, `0` missing),
  docs parity, architecture-awareness exporter refresh, and targeted diff
  check with CRLF warnings only. This is documentation traceability proof, not
  runtime behavior, protected production, deployment, exchange, or live-trading
  proof. Evidence:
  `history/tasks/luc-2163-normalize-backend-model-missing-doc-links-2026-06-05-task.md`.

- 2026-06-05 `LUC-2162-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T10:23:19Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  eight production-environment resources, and `17` visible global resource
  rows. Application inventory status remains `running:unknown`; PostgreSQL and
  Redis report `running:healthy` from the global status projection. Validation
  passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`). This is
  read-only status access proof only, not deploy, restart, rollback, protected
  smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2162-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2157-API-RUNTIME-HELPER-MISSING-TEST-RELATION-BACKLOG-2026-06-05`
  applies to `api-auth`, `api-bots`, `api-engine`, `api-root`, and
  Architecture Evidence Graph test confidence. Test Automation classified the
  current API/runtime helper missing-test relation bucket across auth session
  helpers, API root/workers diagnostics, bot setup, bot runtime read/command/
  repository helpers, engine runtime helpers, and protected exchange/readback
  surfaces. Existing focused or aggregate local proof is present for the major
  families, and no new focused coverage gap or runtime defect was isolated.
  Validation passed for the pure API/runtime helper pack (`6` files / `37`
  tests) and `pnpm run architecture:graph:drift:strict` (`822/822`, `0`
  missing). Representative DB-backed auth and worker runtime tests could not
  complete because Prisma cannot reach local Postgres at `localhost:5432`; this
  is an environment blocker for rerun proof, not a newly classified product
  defect. Protected production proof remains [LUC-241](/LUC/issues/LUC-241) /
  Ops/Security scope. Evidence:
  `history/tasks/luc-2157-classify-api-runtime-helper-missing-test-relation-backlog-2026-06-05-task.md`.

- 2026-06-05 `LUC-2155-DOCUMENTATION-LINKS-INGESTION-ACTIONABLE-MISSING-DOCS-2026-06-05`
  applies to Architecture Evidence Graph, API bots, API engine, and
  release-audit-tooling documentation confidence. Docs Memory verified that
  curated `docs/architecture/relations/documentation-links.csv` rows now ingest
  into `documents` relations for the requested script samples, added exporter
  retry handling for Windows busy/unknown write failures, and classified
  `BotDomainError` plus `orderTypes.types.ts` against existing API module docs.
  Actionable missing docs improved from `148` to `108`; the five requested
  script entities and two backend model entities each have `documents=1` and
  are absent from the top missing-doc report. Validation passed: scanner
  refresh (`14258` entities / `22125` relations), exporter `node --check`,
  architecture graph generate, strict graph drift (`822/822`, `0` missing),
  docs parity, and diff checks with CRLF warnings only. This is documentation
  traceability proof, not runtime behavior or production proof. Evidence:
  `history/tasks/luc-2155-repair-documentation-links-ingestion-actionable-missing-docs-2026-06-05-task.md`.

- 2026-06-05 `LUC-2156-SCRIPT-TOOLING-MISSING-TEST-RELATION-BACKLOG-2026-06-05`
  applies to Architecture Evidence Graph, release-audit-tooling, and
  ops-config-pipeline confidence. Test Automation classified the current
  script/tooling missing-test relation rows from the architecture-awareness
  report generated `2026-06-05T09:10:34.335Z`. Focused tests already exist for
  readiness/release/reusable-audit/route-matrix tooling where appropriate;
  other validator and evidence-builder scripts are covered by aggregate
  package commands, generated artifact readback, or approval-gated protected
  proof. No new focused coverage gap or runtime/tooling defect was isolated.
  Validation passed: focused/aggregate script test pack (`136/136`), `pnpm run
  architecture:graph:drift:strict` (`822/822`, `0` missing), and targeted
  `git diff --check`. Remaining signal is scanner direct-relation
  incompleteness or optional future focused tests for concrete regressions, not
  a current QA blocker. Evidence:
  `history/tasks/luc-2156-classify-script-tooling-missing-test-relation-backlog-2026-06-05-task.md`.

- 2026-06-05 `LUC-2149-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T09:52:00Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  eight production-environment resources, and `17` visible global resource
  rows. Application inventory status remains `running:unknown`; PostgreSQL and
  Redis report `running:healthy`. Validation passed: `pnpm run
  ops:coolify-stack:env-check:test` (`8/8`). This is read-only status access
  proof only, not deploy, restart, rollback, protected smoke, database health
  beyond inventory, SLO, restore/rollback, or live-trading proof. Evidence:
  `history/evidence/luc-2149-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2139-LOCAL-PROTECTED-ACTION-PROOF-MATRIX-MARKETS-BOTS-BACKTESTS-2026-06-05`
  applies to `web-markets`, `web-bots`, `web-backtest`, and protected route
  action proof confidence. Test Automation extended
  `scripts/runLocalProtectedRouteActionProof.mjs` from wallets/strategies to a
  five-cluster matrix covering wallets, strategies, markets, bots, and
  backtests. Fresh validation passed: `node --check
  scripts/runLocalProtectedRouteActionProof.mjs` and `pnpm run
  qa:local-protected-route-actions:proof -- --today 2026-06-05`. JSON readback
  confirms `19/19` PASS rows, static mapping `PASS`, and blockers `0`, with
  local-cookie route reachability and list-page create navigation for the
  requested markets/bots/backtests clusters. Backtest detail proof is synthetic
  local fixture route reachability only. Cleanup found no matching owned
  Node/Chrome/cmd validation processes; only `TIME_WAIT` sockets on ports
  `3217` and `9347` with owning process `0`. Scope stayed local-only and
  non-mutating: no production session, owner account, exchange key, form
  submit, market/bot/backtest mutation, DB mutation, deploy, restart, rollback,
  secret disclosure, or LIVE action occurred. Evidence:
  `history/evidence/luc-2139-local-protected-route-action-proof-matrix-2026-06-05.md`,
  `history/artifacts/luc-2139-local-protected-route-action-proof-matrix-2026-06-05.json`,
  `history/tasks/luc-2139-expand-local-protected-action-proof-matrix-markets-bots-backtests-2026-06-05-task.md`.

- 2026-06-05 `LUC-2138-SHARED-WEB-UI-MISSING-TEST-RELATION-BACKLOG-2026-06-05`
  applies to `web-shared` and Architecture Evidence Graph test confidence.
  Test Automation reclassified the current top shared Web UI/forms/layout/lib
  missing-test samples from the architecture-awareness report generated
  `2026-06-05T09:10:34.335Z`. `DataTable`, shared primitives, form primitives,
  dashboard/public layout, PWA, shared lib utilities, theme bootstrap,
  dropdown/header helpers, test setup, and type declaration surfaces either
  have focused/aggregate local proof or are better classified as test-harness /
  type-surface relation backlog. No new focused coverage gap was found.
  Validation passed: focused shared Web test pack (`28` files / `145` tests)
  and `pnpm run architecture:graph:drift:strict` (`822/822`, `0` missing).
  Remaining signal is scanner/direct-relation incompleteness, not a current
  runtime UI defect or Test Automation blocker. Evidence:
  `history/tasks/luc-2138-classify-shared-web-ui-missing-test-relation-backlog-2026-06-05-task.md`.

- 2026-06-05 `LUC-2132-SCRIPT-TOOLING-DOC-TEST-LINKS-2026-06-05`
  applies to Architecture Evidence Graph, release-audit-tooling, and
  ops-config-pipeline confidence. Docs Memory classified script/tooling
  missing doc/test samples by owner lane and added direct doc relations for
  clear documentation owners in
  `docs/architecture/relations/documentation-links.csv`. The repair table now
  lives in `docs/automation/guardrail-commands.md` and separates direct doc
  closures from aggregate/focused test-link recommendations. Post-change
  architecture-awareness report generated `2026-06-05T09:08:28.191Z` reports
  actionable missing docs `148`, actionable missing tests `919`, classified
  noise `7377`, and disconnected entities `0`; original sampled script/tooling
  doc-link rows no longer appear in top actionable missing doc-link samples.
  Validation passed: `pnpm run architecture:graph:generate`,
  architecture-awareness scanner refresh (`14237` entities / `22052`
  relations), and `pnpm run architecture:graph:drift:strict` (`822/822`, `0`
  missing). This is docs/evidence proof only, not runtime, route, protected,
  production, deploy, account, exchange, or live-trading proof. Evidence:
  `history/tasks/luc-2132-classify-script-tooling-missing-doc-test-links-2026-06-05-task.md`.

- 2026-06-05 `LUC-2131-WEB-LIB-I18N-DOC-TEST-LINK-NORMALIZATION-2026-06-05`
  applies to `web-shared` and Architecture Evidence Graph confidence. Docs
  Memory normalized direct documentation links for shared Web i18n, generic
  `apps/web/src/lib` utilities, theme bootstrap, data-table/form/dropdown
  helpers, and dashboard header style helpers in
  `docs/architecture/relations/documentation-links.csv`. `docs/modules/web-shared.md`
  now separates owner/module/status/expected proof for focused tests,
  aggregate tests, and direct scanner relation incompleteness. Post-change
  architecture-awareness report generated `2026-06-05T09:08:28.191Z` reports
  actionable missing docs `148` (down from `188`), actionable missing tests
  `919`, classified noise `7377`, and disconnected entities `0`; the Web
  i18n/lib/helper rows no longer appear in top actionable missing doc-link
  samples. Validation passed: `pnpm run architecture:graph:generate` and
  `pnpm run architecture:graph:drift:strict` (`822/822`, `0` missing).
  Architecture-awareness scanner wrote exports and readback succeeded
  (`14237` entities / `22052` relations), but the process timed out after
  printing its export summary. This is docs/evidence proof only, not runtime,
  route, protected, production, deploy, account, exchange, or live-trading
  proof. Evidence:
  `history/tasks/luc-2131-normalize-web-lib-i18n-missing-doc-test-link-samples-2026-06-05-task.md`.

- 2026-06-05 `LUC-2132-SCRIPT-TOOLING-DOC-TEST-LINKS-2026-06-05`
  applies to Architecture Evidence Graph, release-audit-tooling, and
  ops-config-pipeline confidence. Docs Memory classified script/tooling
  missing doc/test samples from [LUC-2123](/LUC/issues/LUC-2123) across
  documentation/graph validators, known-state builders,
  release/observability builders, Coolify/protected-input readiness,
  production readback collectors, and test/runtime support shims. Direct
  documentation links were added in
  `docs/architecture/relations/documentation-links.csv` where ownership was
  clear, and `docs/automation/guardrail-commands.md` now records the repair
  table. Post-change architecture-awareness report generated
  `2026-06-05T09:10:34.335Z` reports actionable missing docs `148` (down from
  `188`), actionable missing tests `919`, classified noise `7377`, and
  disconnected entities `0`; the original sampled script/tooling doc-link rows
  no longer appear in top actionable missing doc-link samples. Validation
  passed: `pnpm run architecture:graph:generate`, scanner refresh from
  `Paperclip_Softwarehouse` (`14237` entities / `22052` relations / `7097`
  files), and `pnpm run architecture:graph:drift:strict` (`822/822`, `0`
  missing). This is docs/evidence proof only, not runtime, route, protected,
  production, deploy, account, exchange, or live-trading proof. Evidence:
  `history/tasks/luc-2132-classify-script-tooling-missing-doc-test-links-2026-06-05-task.md`.

- 2026-06-05 `LUC-2130-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T09:05:51Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  eight production-environment resources, and `17` visible global resource
  rows. Application inventory status remains `running:unknown`; PostgreSQL and
  Redis report `running:healthy`. Validation passed: `pnpm run
  ops:coolify-stack:env-check:test` (`8/8`). This is read-only status access
  proof only, not deploy, restart, rollback, protected smoke, database health
  beyond inventory, SLO, restore/rollback, or live-trading proof. Evidence:
  `history/evidence/luc-2130-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2123-ACTIONABLE-GRAPH-MISSING-DOC-TEST-LINKS-2026-06-05`
  applies to `web-bots`, `web-shared`, `web-strategies`, and Architecture
  Evidence Graph confidence. Docs Memory classified top actionable missing
  doc/test samples from the current architecture-awareness report and
  normalized direct documentation links for nine stable Web utility files:
  bot runtime derivations/labels/surface/trailing-stop helpers, shared DCA and
  runtime monitoring helpers, and strategy indicator/threshold helpers.
  Post-change architecture-awareness readback reports actionable missing docs
  `188` (down from `197`), actionable missing tests `919`, classified noise
  `7377`, and disconnected entities `0`; normalized utility rows no longer
  appear in top actionable missing doc-link samples. Validation passed:
  architecture graph generation, architecture-awareness scanner refresh, and
  strict graph drift (`822/822`, `0` missing). Remaining Web lib/i18n and
  script/tooling samples are follow-up classification candidates, not known
  runtime defects; they were split into [LUC-2131](/LUC/issues/LUC-2131) and
  [LUC-2132](/LUC/issues/LUC-2132). Evidence:
  `history/tasks/luc-2123-classify-actionable-graph-missing-doc-test-links-2026-06-05-task.md`.

- 2026-06-05 `LUC-2124-LOCAL-PROTECTED-ROUTE-ACTION-PROOF-MATRIX-2026-06-05`
  applies to `web-wallets`, `web-strategies`, and protected route action proof
  confidence. The local CDP/browser harness in
  `scripts/runLocalProtectedRouteActionProof.mjs` now uses cluster metadata
  instead of a wallet-only action list and covers wallets plus strategies.
  Fresh proof passed eight rows: wallet unauthenticated fail-closed redirect,
  wallet root/list/create route reachability, wallet list-page create
  navigation, strategies list/create route reachability, and strategies
  list-page create navigation. Validation passed: `node --check
  scripts/runLocalProtectedRouteActionProof.mjs` and `pnpm run
  qa:local-protected-route-actions:proof -- --today 2026-06-05`. Cleanup proof
  found no owned listener/browser process left on ports `3217`/`9347`.
  Boundary remains local-only: no form submission, production auth/session,
  wallet/strategy mutation, exchange call, DB mutation, deploy, restart,
  rollback, secret disclosure, account action, or live-trading proof occurred.
  Evidence:
  `history/evidence/luc-2124-local-protected-route-action-proof-matrix-2026-06-05.md`,
  `history/artifacts/luc-2124-local-protected-route-action-proof-matrix-2026-06-05.json`.

- 2026-06-05 `LUC-2122-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T08:51:47Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  eight production-environment resources, and `17` visible global resource
  rows. Application inventory status remains `running:unknown`; PostgreSQL and
  Redis report `running:healthy`. Validation passed: `pnpm run
  ops:coolify-stack:env-check:test` (`8/8`). This is read-only status access
  proof only, not deploy, restart, rollback, protected smoke, database health
  beyond inventory, SLO, restore/rollback, or live-trading proof. Evidence:
  `history/evidence/luc-2122-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2112-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T07:23:02Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  and `17` visible global resource rows. Application inventory status remains
  `running:unknown`; PostgreSQL reports `running:healthy`; Redis resource
  presence is verified but status is `running:unknown` in this redacted
  readback. Validation passed: `pnpm run ops:coolify-stack:env-check:test`
  (`8/8`). This is read-only status access proof only, not deploy, restart,
  rollback, protected smoke, Redis health beyond inventory presence, database
  health beyond inventory, SLO, restore/rollback, or live-trading proof.
  Evidence:
  `history/evidence/luc-2112-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2106-SHARED-WEB-UI-MISSING-TEST-LINKS-2026-06-05`
  applies to `web-shared` and Architecture Evidence Graph test confidence:
  Test Automation classified top actionable shared Web UI missing-test samples
  from the current architecture-awareness report. Existing focused tests cover
  table, form, layout, PWA, modal, loading, navigation, and shared utility
  clusters; `FooterPreferencesSwitchers` and `ProfileButton` direct primitive
  coverage was added to `SharedUiPrimitives.test.tsx`. Validation passed:
  focused primitive test (`11/11`), shared UI validation command (`17` files /
  `98` tests), and strict architecture graph drift (`822/822`, `0` missing).
  Remaining signal is scanner/direct-relation incompleteness, not a known
  runtime UI defect. Evidence:
  `history/tasks/luc-2106-classify-shared-web-ui-missing-test-links-2026-06-05-task.md`.

- 2026-06-05 `LUC-2107-ROUTE-API-MATRIX-GUARDRAIL-2026-06-05` applies to
  architecture/docs/test automation confidence: generated Web route and API
  endpoint inventory now has a repeatable parity check against
  `docs/architecture/traceability-matrix.md` and
  `docs/architecture/reference/dashboard-route-map.md`. Current state:
  verified locally. Validation passed:
  `pnpm run docs:parity:route-api-matrix:test` (`5/5`),
  `pnpm run docs:parity:route-api-matrix` (`37` Web routes / `109` API
  endpoints / `0` gaps), endpoint docs parity (`109/109`, `0` gaps),
  `pnpm run docs:parity:check`, `pnpm run architecture:graph:generate`
  (`651` nodes / `842` relations / `27` chains),
  `pnpm run architecture:graph:drift:strict` (`822/822`, `0` missing), and
  `pnpm run quality:guardrails`. This is traceability guardrail proof only,
  not semantic DTO/response contract generation, runtime journey proof,
  protected production proof, or release readiness. Evidence:
  `history/tasks/luc-2107-route-api-matrix-parity-guardrail-2026-06-05-task.md`.

- 2026-06-05 `LUC-2099-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T06:52:51Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  and `17` visible global resource rows. Application inventory status remains
  `running:unknown`; PostgreSQL and Redis report `running:healthy`.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2099-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2094-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T06:18:48Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  and `17` visible global resource rows. Application inventory status remains
  `running:unknown`; PostgreSQL and Redis report `running:healthy`.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2094-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2072-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T03:33:51Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  and `17` visible global resource rows. Application inventory status remains
  `running:unknown`; PostgreSQL and Redis report `running:healthy`.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2072-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2069-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-05T03:20:28Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  and `17` visible global resource rows. Application inventory status remains
  `running:unknown`; PostgreSQL and Redis report `running:healthy`.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, SLO, restore/rollback, or
  live-trading proof. Evidence:
  `history/evidence/luc-2069-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-05 `LUC-2057-LOCAL-PROTECTED-WALLET-ROUTE-ACTION-PROOF`
  improves `web-wallets` local protected-route confidence. Test Automation
  added a repeatable CDP/browser harness at
  `scripts/runLocalProtectedRouteActionProof.mjs` and script alias
  `pnpm run qa:local-protected-route-actions:proof`. Fresh proof passed for
  `SOAR-ACTION-VISIT-PAGE-WALLETS-ROOT`,
  `SOAR-ACTION-VISIT-PAGE-WALLETS-LIST`, and
  `SOAR-ACTION-VISIT-PAGE-WALLET-CREATE`: unauthenticated wallet list access
  fails closed to `/auth/login`; local-cookie gated wallet root/list/create
  routes reach expected paths; and the list-page add action navigates to
  `/dashboard/wallets/create`. Validation passed: script syntax check and full
  local harness run. This is local-only browser route/action proof, not API
  database mutation proof, production auth proof, exchange proof, deploy proof,
  or live-trading proof. Evidence:
  `history/evidence/luc-2057-local-protected-wallet-route-action-proof-2026-06-05.md`.

- 2026-06-05 `LUC-2054-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-05`
  applies to production Ops release confidence: read-only Coolify API status
  access remains verified for Soar project/environment/resource reconciliation.
  Runtime binding names are present without value disclosure for
  `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_TOKEN`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
  `COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID`; optional team
  binding names remain absent but project-scoped reads succeed. Fresh readback
  at `2026-06-04T23:40:30Z` resolved project `Soar`, environment
  `production`, six applications, PostgreSQL, Redis, zero generic services,
  and `17` visible global resource rows. Application inventory status remains
  `running:unknown`; PostgreSQL and Redis report `running:healthy`.
  Validation passed: `pnpm run ops:coolify-stack:env-check:test` (`8/8`).
  This is read-only status access proof only, not deploy, restart, rollback,
  protected smoke, database health beyond inventory, or live-trading proof.
  Evidence:
  `history/evidence/luc-2054-coolify-read-only-production-status-access-2026-06-05.md`.

- 2026-06-04 `LUC-2020-NORMALIZE-INFERRED-LINK-REPORT-NOISE-2026-06-04`
  improves Architecture Evidence Graph confidence for report triage quality.
  The architecture-awareness health/report layer now keeps raw inferred missing
  test/doc counts inspectable while adding actionable missing-link signals and
  classified noise detail for curated graph-covered rows, generated/vendor
  docs-vault plugin files, config/resource files, and top-level app mounts.
  Refreshed Soar exports report raw missing tests `7681` / actionable `940`,
  raw missing docs `976` / actionable `241`, and classified inferred-link
  noise `7322`. Focused readback confirmed auth/upload/root/dashboard/admin API
  false positives no longer appear in top actionable samples. Validation
  passed: scanner syntax check, scanner refresh, and `pnpm run
  architecture:graph:drift:strict` (`820/820` covered / `0` missing). This is
  docs/report/graph triage proof only, not runtime, browser, production,
  deploy, protected, database, or route behavior proof. Evidence:
  `history/tasks/luc-2020-normalize-inferred-link-report-noise-2026-06-04-task.md`.

- 2026-06-04 `LUC-2022-WEB-COMPONENT-DOC-RELATION-NORMALIZATION-2026-06-04`
  improves Architecture Evidence Graph confidence for Web feature component
  documentation traceability. Existing component registry `docs_related`
  evidence is now represented as explicit graph relations for all scoped Web
  components (`32` relations, `0` missing). Validation passed:
  `pnpm run architecture:graph:generate` (`647` nodes / `842` relations /
  `27` chains) and `pnpm run architecture:graph:drift:strict` (`820/820`
  covered / `0` missing). This is docs/graph traceability proof only, not
  fresh browser, production, deploy, protected, database, or runtime behavior
  proof. Evidence:
  `history/tasks/luc-2022-normalize-web-feature-component-graph-doc-relations-2026-06-04-task.md`.

- 2026-06-04 `LUC-2021-SHARED-UI-INFERRED-LINK-GAP-TRIAGE-2026-06-04`
  applies to `web-shared` and `SOAR-FEATURE-WEB-RESIDUAL-SURFACES`:
  Frontend classified shared UI architecture-awareness inferred test/doc link
  gaps without runtime mutation. Existing focused Web proof covers shared
  feature helpers, table/state/status/tabs/theme primitives, form primitives,
  layout primitives, and PWA registration. Focused validation passed:
  `pnpm --filter web test -- ...` (`16` files / `87` tests). Remaining shared
  UI follow-up candidates are targeted primitive tests for `ConfirmModal`,
  `FormModal`, `useAsyncConfirm`, brand/navigation helpers, and skeleton
  loaders if those surfaces change or Docs Memory promotes stable
  per-component graph nodes. Evidence:
  `history/tasks/luc-2021-shared-ui-inferred-test-doc-link-gap-triage-2026-06-04-task.md`.

- 2026-06-05 `LUC-2105-NORMALIZE-SHARED-WEB-UI-DOC-LINKS-2026-06-05`
  applies to `web-shared`, `SOAR-DOC-WEB-SHARED`, `SOAR-DOC-WEB-ICONS`, and
  the Architecture Evidence Graph: shared generated `apps/web/src/ui/**`,
  `apps/web/src/i18n/I18nProvider.tsx`, layout/PWA, and `AssetSymbol` doc
  gaps are now mapped through
  `docs/architecture/relations/documentation-links.csv`. Architecture
  awareness readback improved actionable missing docs from `241` to `205`, and
  shared UI component rows no longer appear in top actionable missing doc
  links. After [LUC-2107](/LUC/issues/LUC-2107) resolved its out-of-scope test
  graph coverage, `pnpm run architecture:graph:drift:strict` passed
  (`822/822` covered / `0` missing). Evidence:
  `history/tasks/luc-2105-normalize-shared-web-ui-doc-link-gaps-2026-06-05-task.md`.

- 2026-06-04 `LUC-2018-API-PLATFORM-SAFETY-ASSISTANT-RED-TEAM-PROOF-MAP-2026-06-04`
  applies to `SOAR-SECURITY-PRIVACY-001`, `SOAR-FEATURE-API-PLATFORM-SAFETY`,
  and `SOAR-FEATURE-AI-ASSISTANT-FOUNDATION`: Security Review classified
  `CHAIN-API-PLATFORM-SAFETY` and `CHAIN-AI-ASSISTANT-FOUNDATION` against
  current graph/docs/tests and reran fresh local proof. `pnpm run
  test:adversarial:api-assistant` passed (`8` files / `29` tests). API platform
  safety remains locally verified for current architecture/adversarial
  regression scope. AI assistant foundation remains locally verified for
  dry-run/foundation and default LIVE fail-closed scope. Protected production
  auth, DB-backed route e2e, and executable assistant hot-path red-team proof
  remain separate gates; no new defect child issue was required from this lane.
  Evidence:
  `history/tasks/luc-2018-api-platform-safety-assistant-red-team-proof-map-2026-06-04-task.md`.

- 2026-06-05 `LUC-2231-API-PLATFORM-SAFETY-ADVERSARIAL-REVIEW-2026-06-05`
  applies to `SOAR-SECURITY-PRIVACY-001` and
  `SOAR-FEATURE-API-PLATFORM-SAFETY`: Security Review performed the fresh
  adversarial local review for `CHAIN-API-PLATFORM-SAFETY` across auth/session
  token parsing, trusted-origin, ops-network, rate-limit degradation, proxy
  trust, critical-secret readiness, security headers, and error/log redaction.
  Focused non-DB security packs passed. DB-backed route-level auth/trusted
  origin proof remains environment-blocked by unavailable local Postgres and
  Docker in this heartbeat, and protected production/browser proof remains
  outside this lane. No confirmed product defect or implementation child issue
  was found. Evidence:
  `history/evidence/luc-2231-api-platform-safety-adversarial-review-2026-06-05.md`.

## Purpose

This ledger is the quick reality map for Soar. It tracks whether each important
trading, bot, backtest, exchange, dashboard, subscription, and operations
journey is implemented, verified, broken, blocked, or unknown. Keep it honest.
Do not turn uncertainty into optimism.

## Status Vocabulary

- `NOT_STARTED`: no meaningful implementation exists.
- `IN_PROGRESS`: implementation is actively changing.
- `IMPLEMENTED_NOT_VERIFIED`: code exists, but current proof is missing.
- `PARTIAL`: some scenarios pass, but important scenarios are missing or stale.
- `VERIFIED`: current evidence proves the journey for the target scope.
- `BROKEN`: a reproducible defect exists.
- `BLOCKED`: verification or implementation is blocked by access, decision,
  environment, dependency, or missing input.
- `DEFERRED`: explicitly out of the current release scope.

## Confidence Rules

- `High`: fresh reproducible evidence exists for the real journey.
- `Medium`: good local proof exists, but target, edge-case, or freshness is
  incomplete.
- `Low`: evidence is missing, stale, inferred, or chat-only.

## Current Operational Override

- 2026-06-04 `LUC-1953-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-04`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify read-only
  production status access binding truth. Fresh read-only Coolify API readback
  at `2026-06-04T09:48:12Z` verified required binding names are present
  without value disclosure, configured project `Soar`, production environment
  `production`, six application resources, PostgreSQL, Redis, zero generic
  services, `17` visible global resource rows, and eight production-environment
  resources. `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this
  runner, but this is not an active blocker while project-scoped reads succeed.
  `pnpm run ops:coolify-stack:env-check:test` passed (`8/8`). No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, protected smoke, secret readback, or live-trading action was
  performed. This does not claim full application readiness, database health,
  protected smoke, SLO, restore/rollback, or deploy mutation readiness.
  Evidence:
  `history/evidence/luc-1953-coolify-read-only-production-status-access-2026-06-04.md`.

- 2026-06-04 `LUC-1948-MAP-BOTS-TYPES-TEST-GRAPH-REGISTRY-2026-06-04`:
  confidence for the Architecture Evidence Graph and assistant dry-run safety
  test registry is verified locally. `apps/api/src/modules/bots/bots.types.test.ts`
  is now mapped under `SOAR-TEST-AI-ASSISTANT-API`, preserving the existing AI
  Assistant foundation ownership for `AssistantDryRunSchema` advisory-mode
  safety. Final strict drift also mapped adjacent same-gate API test omissions
  to their existing middleware/auth owner nodes. Validation passed: `pnpm run
  architecture:graph:generate` (`647` nodes / `810` relations / `27` chains),
  `pnpm run architecture:graph:drift:strict` (`820/820` covered / `0`
  missing), and focused API tests for the four newly mapped files (`4` files /
  `10` tests). This is graph/test traceability proof only, not fresh browser,
  production, deploy, database, or runtime behavior proof. Evidence:
  `history/tasks/luc-1948-map-bots-types-test-into-architecture-graph-registry-2026-06-04-task.md`.

- 2026-06-04 `LUC-1944-ASSISTANT-DRY-RUN-BOUNDARY-SCHEMA-DRIFT-2026-06-04`:
  confidence for the AI Assistant foundation/dry-run boundary is improved to
  `PARTIAL` with current local proof. The implemented dry-run API/client
  contract is now `BACKTEST | PAPER` only, internal service handoff reparses
  the dry-run mode schema before calling the broader orchestrator,
  disabled-main dry-run suppresses enabled subagent rows, assistant
  role/model-profile schemas are allowlisted, and default `LIVE` orchestrator
  input remains fail-closed as `strategy_only` / `NO_TRADE`. Evidence passed:
  focused no-DB AI Runtime/API tests (`4` files / `8` tests) and Web
  typecheck. Missing proof: DB-backed dry-run route e2e is
  blocked by unavailable local PostgreSQL, and full API typecheck is blocked by
  unrelated existing test typing errors. Evidence:
  `history/tasks/luc-1944-assistant-dry-run-boundary-schema-drift-2026-06-04-task.md`.

- 2026-06-04 `LUC-1939-RESIDUAL-PAGE-CHAIN-SEMANTICS-MEDIUM-GRAPH-GAPS-2026-06-04`:
  confidence for the Architecture Evidence Graph journey index is improved
  for residual Web page semantics. `SOAR-PAGE-BOT-NEW-ALIAS` and
  `SOAR-PAGE-BOT-DETAIL-ALIAS` are explicit members of `CHAIN-BOT-SETUP`;
  `SOAR-PAGE-OFFLINE` is an accepted offline app-shell fallback with no
  function-chain requirement. Regenerated journey rows show all three scoped
  pages with empty gaps and `gap_severity=none`. Validation passed:
  `pnpm run architecture:graph:generate`, `pnpm run architecture:journey:index`,
  and `pnpm run architecture:graph:drift:strict`. This is graph/documentation
  traceability proof only, not fresh browser, production, deploy, or runtime
  behavior proof. Evidence:
  `history/tasks/luc-1939-residual-page-chain-semantics-medium-graph-gaps-2026-06-04-task.md`.

- 2026-06-03 `LUC-1764-PROD-DB-CHECK-RUNNER-INPUT-BINDING-2026-06-03`:
  confidence for production DB restore-readiness remains `BLOCKED` for the
  protected ARB-006 data lane. The Ops runner-input binding lane confirmed the
  Security contract requires one complete accepted `PROD_DB_CHECK_*` or
  `PRODUCTION_DB_CHECK_*` family through an approved encrypted runtime path.
  Names-only runner readback found all accepted DB profile names and
  `DOCKER_HOST` missing. Paperclip company secret-store metadata returned
  HTTP `403 Board access required`, so this runner cannot bind company
  secrets. `pnpm run ops:db:backup-verify:prod` failed closed before DB access
  with `Missing container for profile "prod"`. No secret values, repo `.env`
  write, database connection, restore, schema change, migration, data write,
  deploy, restart, rollback, Coolify mutation, account mutation, protected
  smoke, or live-trading action occurred. Evidence:
  `history/tasks/luc-1764-inject-protected-prod-db-check-runner-inputs-2026-06-03-task.md`.

- 2026-06-03 `LUC-1767-ROLLBACK-GUARD-RUNNER-INPUT-BINDING-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains `BLOCKED` for the current
  protected rollback guard proof chain. Names-only runner scan found no
  `ROLLBACK_GUARD_*` variables, and `GET /api/companies/{companyId}/secrets`
  returned `403 Forbidden`, so this run could not bind company secrets. The
  protected-input readiness checker returned `PARTIAL` only because unrelated
  `PROD_UI_AUDIT_*` names are present; `ROLLBACK_GUARD_*` remained missing
  (`0`). No secret values, deploy, restart, rollback execution, env edit,
  database action, production config mutation, account mutation, protected
  response-body capture, or live-trading action occurred. Evidence:
  `history/evidence/luc-1767-rollback-guard-runner-input-readiness-6839cd6b-2026-06-03.md`.

- 2026-06-03 `LUC-1763-ROLLBACK-GUARD-INPUT-BINDING-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains `BLOCKED` for protected
  rollback proof input readiness. Fresh names-only runner readback found no
  `ROLLBACK_GUARD*` names, and protected-input readiness returned `PARTIAL`
  only because unrelated `PROD_UI_AUDIT_*` names exist; `ROLLBACK_GUARD_*`
  remains `missing (0)`. Paperclip company secrets metadata readback returned
  `Board access required`, so Security Review Lead cannot bind or confirm
  company-level secrets directly. First-class blocker `LUC-1767` is assigned
  to Portfolio Director for board-capable secret/env binding. Approved
  account/session class is read-only production operator proof context for
  rollback guard endpoints only. No deploy, restart, rollback execution, env
  edit, database action, production config mutation, account mutation,
  subscription/payment mutation, exchange/API-key mutation, external service
  mutation, secret readback, cookie/session export, protected response-body
  capture, or live-trading action occurred. Evidence:
  `history/evidence/luc-1763-rollback-guard-input-readiness-6839cd6b-2026-06-03.md`.

- 2026-06-03 `LUC-1754-LIVEIMPORT-READBACK-PROTECTED-EVIDENCE-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains partial and blocked for current
  protected `LIVEIMPORT_READBACK` evidence. Fresh production build-info
  readback at `2026-06-03T13:12:53.834Z` returned
  `6839cd6b8884e26eca735ce32cea98c1dadccfbe` on `main`; protected-input
  readiness for that SHA/date returned `BLOCKED` with `0` matching protected
  input names and missing `LIVEIMPORT_READBACK_*`. The existing collector
  failed closed before protected runtime/imported-position readback because no
  approved read-only production auth/session was available in this runner. No
  protected payload, exchange mutation, order placement, account setting
  change, deploy, restart, rollback, DB write, secret disclosure, or
  live-trading action was performed. Evidence:
  `history/evidence/luc-1754-liveimport-readback-failclosed-6839cd6b-2026-06-03.md`.

- 2026-06-03 `LUC-1761-BIND-APP-SMOKE-SESSION-2026-06-03`:
  confidence for the Security protected app smoke-session gate is `VERIFIED`,
  while production protected app/browser journey evidence remains owned by
  QA/Test under `LUC-1756`. After `LUC-1766` completed, names-only readback
  found `PROD_UI_AUDIT_AUTH_TOKEN` plus existing admin/API/Web URL names
  present. Portfolio bound Security-approved `SMOKE_AUTH_TOKEN` as
  `PROD_UI_AUDIT_AUTH_TOKEN` and did not bind email/password aliases.
  `pnpm run -s ops:protected-inputs:check` returned `PARTIAL` with
  `matchingProtectedInputNamesPresent=6` because unrelated protected families
  remain missing; the app smoke proof family is now available for QA/Test.
  Security approval allows `PROD_UI_AUDIT_AUTH_TOKEN` for read-only
  authenticated app/dashboard proof and keeps `PROD_UI_AUDIT_ADMIN_*` limited
  to non-mutating admin-route proof. No secret values, browser protected
  journey, deploy, restart, rollback, env edit, account mutation, subscription
  mutation, API-key mutation, exchange setting change, external service
  mutation, live-trading action, secret readback, cookie export, or protected
  response-body capture occurred. Evidence:
  `history/evidence/luc-1761-protected-app-session-approved-readiness-6839cd6b-2026-06-03.md`.

- 2026-06-03 `LUC-1757-PROD-DB-CHECK-PROTECTED-EVIDENCE-2026-06-03`:
  confidence for production DB restore-readiness remains `BLOCKED` for the
  protected ARB-006 data lane. Names-only readback found both accepted
  production profile families absent: `PROD_DB_CHECK_*` and
  `PRODUCTION_DB_CHECK_*`. `pnpm run ops:db:backup-verify:prod` failed closed
  before DB access because the production container/profile input is missing.
  No secret values, database connection, restore, schema change, migration,
  data write, deploy, restart, rollback, Coolify mutation, account mutation,
  protected smoke, or live-trading action occurred. First-class blocker
  `LUC-1762` is assigned to Security Review Lead for protected runner/input
  availability. Evidence:
  `history/evidence/luc-1757-prod-db-check-protected-evidence-2026-06-03.md`.

- 2026-06-03 `LUC-1709-RESTORE-SOAR-GUARDRAILS-SOURCE-CONTROL-CLOSURE-2026-06-03`:
  confidence for `SOAR-ARCHITECTURE-EVIDENCE-GRAPH` and
  `SOAR-QUALITY-GUARDRAILS` is verified locally for the source-control closure
  lane. `pnpm run architecture:graph:generate` passed with `647` nodes,
  `807` relations, and `27` chains; strict graph drift passed with `816/816`
  covered and `0` missing; `pnpm run quality:guardrails:test` passed `9/9`;
  `pnpm run quality:guardrails` passed. The repair updated graph registry
  coverage and documented two explicit temporary API test-size allowlist
  entries for existing oversized test contract hubs. This does not improve or
  claim runtime production readiness, protected smoke, deploy readiness, or
  live-trading safety. Evidence:
  `history/tasks/luc-1709-restore-soar-guardrails-source-control-closure-2026-06-03-task.md`.

- 2026-06-03 `LUC-1707-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify read-only
  production status access binding truth. Fresh binding proof at
  `2026-06-03T07:08:32Z` verified required binding names are present without
  value disclosure, current selector id `0` name `LuckySparrow`, configured
  project `Soar`, production environment `production` id `6`, and eight
  canonical production-environment resources by environment-id/global
  reconciliation: six applications plus PostgreSQL and Redis. Applications
  remain `running:unknown` at the Coolify inventory projection layer;
  PostgreSQL and Redis report `running:healthy` from global resource readback.
  `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` remain absent in this runner, but
  this is not an active blocker while current-team and project-scoped reads
  succeed. No deploy, restart, rollback, env edit, database action, team
  setting change, account action, protected smoke, secret readback, or
  live-trading action was performed. This does not claim full application
  readiness, protected smoke, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1707-coolify-read-only-production-status-access-2026-06-03.md`.

- 2026-06-03 `LUC-1673-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T05:36:00Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`, `postgresql`, and `redis`.
  The global resources endpoint returned `17` visible rows, the same eight
  rows by production environment id, and nine Soar-relevant rows by safe
  name/type projection because Coolify exposes one redacted PostgreSQL
  companion row. Treat that companion row as a global-list alias, not a ninth
  production-environment deploy/smoke target. This proof does not claim full
  application readiness, protected smoke, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1673-coolify-resource-inventory-reconciliation-2026-06-03.md`.
- 2026-06-03 `LUC-1668-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify
  team/workspace selector truth. Fresh read-only Coolify API readback at
  `2026-06-03T05:08:45Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, and production environment
  `production` id `6` with six application rows. Explicit
  `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID` bindings remain absent, but this
  is not an active blocker while current-team and project-scoped reads succeed.
  No deploy, restart, rollback, env edit, database action, team setting change,
  account action, secret readback, or live trading action was performed. This
  proof does not claim full application readiness, protected smoke, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1668-coolify-team-workspace-confirmation-2026-06-03.md`.

- 2026-06-03 `LUC-1666-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T05:05:10Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  `soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`, `postgresql`, and `redis`.
  The global resources endpoint returned `17` visible rows, the same eight
  rows by production environment id, and nine Soar-relevant rows by safe
  name/type projection because Coolify exposes one redacted PostgreSQL
  companion row. Treat that companion row as a global-list alias, not a ninth
  production-environment deploy/smoke target. This proof does not claim full
  application readiness, protected smoke, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1666-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1662-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T04:36:40Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  six applications plus PostgreSQL and Redis. The global resources endpoint
  showed `17` visible rows, the same eight rows by production environment id,
  and nine Soar-relevant rows by safe name/type projection because Coolify
  exposes one additional redacted PostgreSQL companion row; it remains a
  global-list alias/companion row, not a ninth production-environment deploy or
  smoke target. Applications remain `running:unknown` at the Coolify inventory
  projection layer; PostgreSQL and Redis report `running:healthy`. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, secret readback, or live trading action was performed. This does not
  claim full application readiness, protected smoke, SLO, restore/rollback, or
  deploy mutation readiness. Evidence:
  `history/evidence/luc-1662-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1656-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T04:08:03Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight canonical production-environment resources: six
  applications plus PostgreSQL and Redis. The global resources endpoint showed
  the same eight rows by production environment id and nine Soar-relevant rows
  by safe name/type projection because Coolify exposes one additional redacted
  PostgreSQL companion row; it remains a global-list alias/companion row, not a
  ninth production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, secret readback, or
  live trading action was performed. This does not claim full application
  readiness, protected smoke, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1656-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1656-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T04:04:30Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  six applications plus PostgreSQL and Redis. The global resources endpoint
  showed the same eight rows by production environment id and nine
  Soar-relevant rows by safe name/type projection because Coolify exposes one
  additional redacted PostgreSQL companion row; it remains a global-list
  alias/companion row, not a ninth production-environment deploy or smoke
  target. Applications remain `running:unknown` at the Coolify inventory
  projection layer; PostgreSQL and Redis report `running:healthy`. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, secret readback, or live trading action was performed. This does not
  claim full application readiness, protected smoke, SLO, restore/rollback, or
  deploy mutation readiness. Evidence:
  `history/evidence/luc-1656-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1651-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T03:33:27Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  six applications plus PostgreSQL and Redis. The global resources endpoint
  showed the same eight rows by production environment id and nine
  Soar-relevant rows by safe name/type projection because Coolify exposes one
  additional redacted PostgreSQL companion row; it remains a global-list
  alias/companion row, not a ninth production-environment deploy or smoke
  target. Applications remain `running:unknown` at the Coolify inventory
  projection layer; PostgreSQL and Redis report `running:healthy`. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, secret readback, or live trading action was performed. This does not
  claim full application readiness, protected smoke, SLO, restore/rollback, or
  deploy mutation readiness. Evidence:
  `history/evidence/luc-1651-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1650-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify
  team/workspace selector truth. Fresh read-only Coolify API readback at
  `2026-06-03T03:33:50Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and the canonical eight-resource production environment
  shape: six applications, PostgreSQL, and Redis. `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID` remain absent in this runner, but this is not an active
  blocker while current-team and project-scoped reads succeed. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, secret readback, or live-trading action was performed. This does not
  claim full application readiness, protected smoke, SLO, restore/rollback, or
  deploy mutation readiness. Evidence:
  `history/evidence/luc-1650-coolify-team-workspace-confirmation-2026-06-03.md`.

- 2026-06-03 `LUC-1647-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify
  team/workspace selector truth. Fresh read-only Coolify API readback at
  `2026-06-03T03:08:26Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and the canonical eight-resource production environment
  shape: six applications, PostgreSQL, and Redis. `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID` remain absent in this runner, but this is not an active
  blocker while current-team and project-scoped reads succeed. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, secret readback, or live-trading action was performed. This does not
  by itself verify production smoke, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1647-coolify-team-workspace-confirmation-2026-06-03.md`.

- 2026-06-03 `LUC-1645-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T03:07:02Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight canonical production-environment resources: six
  applications plus PostgreSQL and Redis. The global resources endpoint showed
  the same eight rows by production environment id and nine Soar-relevant rows
  by safe name/type projection because Coolify exposes one additional redacted
  PostgreSQL companion row; it remains a global-list alias/companion row, not
  a ninth production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, secret readback, or
  live trading action was performed. This does not claim full application
  readiness, protected smoke, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1645-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1644-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify
  team/workspace selector truth. Fresh read-only Coolify API readback at
  `2026-06-03T03:03:27Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and the canonical eight-resource production environment
  shape: six applications, PostgreSQL, and Redis. `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID` remain absent in this runner, but this is not an active
  blocker while current-team and project-scoped reads succeed. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, secret readback, or live-trading action was performed. This does not
  by itself verify production smoke, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1644-coolify-team-workspace-confirmation-2026-06-03.md`.

- 2026-06-03 `LUC-1639-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify read-only
  production status access binding truth. Fresh binding proof at
  `2026-06-03T02:34:15Z` verified required binding names are present without
  value disclosure, current selector id `0` name `LuckySparrow`, configured
  project `Soar`, production environment `production`, and eight production
  resources: six applications plus PostgreSQL and Redis. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. `COOLIFY_SOAR_TEAM_ID` / `COOLIFY_TEAM_ID`
  remain absent in this runner, but this is not an active blocker while
  current-team and project-scoped reads succeed. No deploy, restart, rollback,
  env edit, database action, team setting change, account action, secret
  readback, or live-trading action was performed. This does not claim full
  application readiness, protected smoke, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1639-coolify-read-only-production-status-access-2026-06-03.md`.

- 2026-06-03 `LUC-1641-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T02:34:56Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight canonical production-environment resources: six
  applications plus PostgreSQL and Redis. The global resources endpoint still
  exposes `postgresql-database-*`; it remains a
  global-list PostgreSQL alias/companion row, not a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, secret readback, or
  live trading action was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1641-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1634-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T02:03:30Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight canonical production-environment resources: six
  applications plus PostgreSQL and Redis. The global resources endpoint still
  exposes `postgresql-database-*`; it remains a
  global-list PostgreSQL alias/companion row, not a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1634-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1633-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify
  team/workspace selector truth. Fresh read-only Coolify API readback at
  `2026-06-03T02:03:22Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and the canonical eight-resource production environment
  shape: six applications, PostgreSQL, and Redis. `COOLIFY_SOAR_TEAM_ID` /
  `COOLIFY_TEAM_ID` remain absent in this runner, but this is not an active
  blocker while current-team and project-scoped reads succeed. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, secret readback, or live-trading action was performed. This does not
  by itself verify production smoke, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1633-coolify-team-workspace-confirmation-2026-06-03.md`.

- 2026-06-03 `LUC-1630-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T01:37:14Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight canonical production-environment resources: six
  applications plus PostgreSQL and Redis. The global resources endpoint still
  exposes `postgresql-database-*`; it remains a
  global-list PostgreSQL alias/companion row, not a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1630-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1624-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T01:05:03Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  six applications plus PostgreSQL and Redis. The global resources endpoint
  still exposes `postgresql-database-*`; it remains
  a global-list PostgreSQL alias/companion row, not a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1624-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-03 `LUC-1620-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-03`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-03T00:38:06Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  six applications plus PostgreSQL and Redis. The global resources endpoint
  still exposes `postgresql-database-*`; it remains
  a global-list PostgreSQL alias/companion row, not a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1620-coolify-resource-inventory-reconciliation-2026-06-03.md`.

- 2026-06-02 `LUC-1610-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T22:11:28Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight canonical production-environment resources: six
  applications plus PostgreSQL and Redis. The global resources endpoint still
  exposes `postgresql-database-*`; this is recorded as
  a global-list PostgreSQL alias/companion row, not as a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1610-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1605-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T21:52:06Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight canonical production-environment resources: six
  applications plus PostgreSQL and Redis. The global resources endpoint still
  exposes `postgresql-database-*`; this is recorded as
  a global-list PostgreSQL alias/companion row, not as a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1605-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1599-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T21:03:57Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight canonical production-environment resources:
  six applications plus PostgreSQL and Redis. The global resources endpoint
  also exposes `postgresql-database-*`; this is
  recorded as a global-list PostgreSQL alias/companion row, not as a ninth
  production-environment deploy or smoke target. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1599-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1594-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify
  team/workspace selector truth. Fresh read-only Coolify API readback at
  `2026-06-02T20:55:41Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, and production environment
  `production` id `6`. The global resources readback showed nine
  Soar-relevant rows because Coolify exposes both `postgresql` and
  `postgresql-database-*`; this does not change the
  selector conclusion. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain
  absent in this runner, but current-team and project-scoped reads succeeded,
  so this is not an active blocker for status reconciliation. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, or live trading action was performed. This does not claim full
  application readiness, protected smoke, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1594-coolify-team-workspace-confirmation-2026-06-02.md`.

- 2026-06-02 `LUC-1593-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T20:54:06Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight redacted production resources: six
  applications plus PostgreSQL and Redis. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1593-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1591-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for Coolify production
  status access. Fresh read-only Coolify API readback at
  `2026-06-02T20:51:41Z` verified required binding names are present without
  value disclosure, current selector id `0` name `LuckySparrow`, configured
  project `Soar`, production environment `production`, and eight redacted
  production resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain
  absent in this runner, but current-team and project-scoped reads succeeded,
  so this is not an active blocker for status reconciliation. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, or live trading action was performed. This does not claim full
  application readiness, protected smoke, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1591-coolify-read-only-production-status-access-2026-06-02.md`.

- 2026-06-02 `LUC-1586-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for Coolify production
  status access. Fresh read-only Coolify API readback at
  `2026-06-02T19:12:52Z` verified required binding names are present without
  value disclosure, current selector id `0` name `LuckySparrow`, configured
  project `Soar`, production environment `production`, and eight redacted
  production resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain
  absent in this runner, but current-team and project-scoped reads succeeded,
  so this is not an active blocker for status reconciliation. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, or live trading action was performed. This does not claim full
  application readiness, protected smoke, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1586-coolify-read-only-production-status-access-2026-06-02.md`.

- 2026-06-02 `LUC-1584-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T19:08:59Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight redacted production resources: six
  applications plus PostgreSQL and Redis. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1584-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1579-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for Coolify production
  status access. Fresh read-only Coolify API readback at
  `2026-06-02T19:03:37Z` verified required binding names are present without
  value disclosure, current selector id `0` name `LuckySparrow`, configured
  project `Soar`, production environment `production`, and eight redacted
  production resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain
  absent in this runner, but current-team and project-scoped reads succeeded,
  so this is not an active blocker for status reconciliation. No deploy,
  restart, rollback, env edit, database action, team setting change, account
  action, or live trading action was performed. This does not claim full
  application readiness, protected smoke, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1579-coolify-read-only-production-status-access-2026-06-02.md`.

- 2026-06-02 `LUC-1581-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T19:03:20Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production` id `6`, and eight redacted production resources: six
  applications plus PostgreSQL and Redis. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1581-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1575-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T18:33:56Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight redacted production resources: six applications plus
  PostgreSQL and Redis. Applications remain `running:unknown` at the Coolify
  inventory projection layer; PostgreSQL and Redis report `running:healthy`.
  No deploy, restart, rollback, env edit, database action, team setting
  change, account action, or live trading action was performed. This does not
  claim full application readiness, protected smoke, SLO, restore/rollback, or
  deploy mutation readiness. Evidence:
  `history/evidence/luc-1575-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1574-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` improves for Coolify team/workspace
  selector truth. Fresh read-only Coolify API readback at
  `2026-06-02T18:34:30Z` verified the expected selector is team id `0`, name
  `LuckySparrow`. Under that selector, the configured Soar project resolves to
  project `Soar`, environment `production`, and eight redacted production
  resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
  runner, but the selector is explicitly recorded as non-secret config truth
  for this issue. No deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action was performed. This
  does not claim full application readiness, protected smoke, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1574-coolify-team-workspace-confirmation-2026-06-02.md`.

- 2026-06-02 `LUC-1569-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T18:04:49Z` verified current selector id `0` name
  `LuckySparrow`, configured project `Soar`, production environment
  `production`, and eight redacted production resources: six applications plus
  PostgreSQL and Redis. Applications remain `running:unknown` at the Coolify
  inventory projection layer; PostgreSQL and Redis report `running:healthy`.
  No deploy, restart, rollback, env edit, database action, team setting
  change, account action, or live trading action was performed. This does not
  claim full application readiness, protected smoke, SLO, restore/rollback, or
  deploy mutation readiness. Evidence:
  `history/evidence/luc-1569-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1554-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T17:04:40Z` verified configured project `Soar`, production
  environment `production`, and eight redacted production resources: six
  applications plus PostgreSQL and Redis. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1554-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1549-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains high for Coolify production
  resource inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T16:35:16Z` verified configured project `Soar`, production
  environment `production`, and eight redacted production resources: six
  applications plus PostgreSQL and Redis. Applications remain
  `running:unknown` at the Coolify inventory projection layer; PostgreSQL and
  Redis report `running:healthy`. No deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action
  was performed. This does not claim full application readiness, protected
  smoke, SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1549-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1539-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` improves for Coolify team/workspace
  selector truth. Fresh read-only Coolify API readback at
  `2026-06-02T16:08:15Z` verified the expected selector is team id `0`, name
  `LuckySparrow`. Under that selector, the configured Soar project resolves to
  project `Soar`, environment `production`, and eight redacted production
  resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
  runner, but the selector is explicitly recorded as non-secret config truth
  for this issue. No deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action was performed. This
  does not claim full application readiness, protected smoke, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1539-coolify-team-workspace-confirmation-2026-06-02.md`.

- 2026-06-02 `LUC-1529-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` improves for Coolify team/workspace
  selector truth. Fresh read-only Coolify API readback at
  `2026-06-02T15:33:12Z` verified the expected selector is team id `0`, name
  `LuckySparrow`. Under that selector, the configured Soar project resolves to
  project `Soar`, environment `production`, and eight redacted production
  resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
  runner, but the selector is explicitly recorded as non-secret config truth
  for this issue. No deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action was performed. This
  does not claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1529-coolify-team-workspace-confirmation-2026-06-02.md`.

- 2026-06-02 `LUC-1518-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` improves for Coolify team/workspace
  selector truth. Fresh read-only Coolify API readback at
  `2026-06-02T14:34:15Z` verified the expected selector is team id `0`, name
  `LuckySparrow`. Under that selector, the configured Soar project resolves to
  project `Soar`, environment `production`, and eight redacted production
  resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
  runner, but the selector is now explicitly recorded as non-secret config
  truth for this issue. No deploy, restart, rollback, env edit, database
  action, team setting change, account action, or live trading action was
  performed. Evidence:
  `history/evidence/luc-1518-coolify-team-workspace-confirmation-2026-06-02.md`.

- 2026-06-02 `LUC-1507-COOLIFY-TEAM-WORKSPACE-CONFIRMATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` improves for Coolify team/workspace
  selector truth. Fresh read-only Coolify API readback at
  `2026-06-02T14:03:35Z` verified the expected selector is team id `0`, name
  `LuckySparrow`; prior UI memory called id `0` `Root Team`, while current API
  naming is `LuckySparrow`. Under that selector, the configured Soar project
  resolves to `Soar`, environment `production`, and the expected eight
  production resources. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain
  absent, but the exact selector is now recorded as non-secret config truth.
  This does not claim full application readiness, protected `/workers/ready`,
  SLO, restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1507-coolify-team-workspace-confirmation-2026-06-02.md`.

- 2026-06-02 `LUC-1496-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for Coolify production
  deploy-status access binding. Fresh read-only probes at
  `2026-06-02T13:03:28Z` verified required binding names are present,
  authenticated Coolify read endpoints succeed, the configured project binding
  resolves to `Soar`, and the production environment exposes six application
  resources plus PostgreSQL and Redis. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` are absent, but project-scoped reads succeed, so this is
  not an active blocker. The issue's latest blocked state was duplicate-run
  janitor context only, with no first-class `blockedBy` issue. This does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1496-coolify-read-only-production-status-access-2026-06-02.md`.

- 2026-06-02 `LUC-1479-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T09:33:58Z` verified the configured Soar project binding and
  eight redacted resources: six applications (`soar-api`, `soar-web`,
  `workers-backtest`, `workers-execution`, `workers-market-data`,
  `workers-market-stream`) plus PostgreSQL and Redis. Application inventory
  status remains `running:unknown`; PostgreSQL and Redis report
  `running:healthy`. This is a no-drift inventory refresh only; it does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1479-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1476-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T09:08:32Z` verified the configured Soar project binding and
  eight redacted resources: six applications (`soar-api`, `soar-web`,
  `workers-backtest`, `workers-execution`, `workers-market-data`,
  `workers-market-stream`) plus PostgreSQL and Redis. Application inventory
  status remains `running:unknown`; PostgreSQL and Redis report
  `running:healthy`. This is a no-drift inventory refresh only; it does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1476-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1473-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T09:03:08Z` verified the configured Soar project binding and
  eight redacted resources: six applications (`soar-api`, `soar-web`,
  `workers-backtest`, `workers-execution`, `workers-market-data`,
  `workers-market-stream`) plus PostgreSQL and Redis. Application inventory
  status remains `running:unknown`; PostgreSQL and Redis report
  `running:healthy`. This is a no-drift inventory refresh only; it does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1473-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1467-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS`:
  confidence for `SOAR-OPERATIONS-001` remains improved for Coolify production
  deploy-status access binding. Fresh read-only probes verified required
  binding names are present, authenticated Coolify read endpoints succeed, the
  configured project binding resolves to `Soar`, and the production environment
  exposes six application resources plus PostgreSQL and Redis. `COOLIFY_SOAR_TEAM_ID`
  and `COOLIFY_TEAM_ID` are absent, but project-scoped reads succeed, so this is
  not an active blocker. This does not claim full application readiness,
  protected `/workers/ready`, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1467-coolify-read-only-production-status-access-2026-06-02.md`.

- 2026-06-02 `LUC-1466-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T08:34:07Z` verified the configured Soar project binding,
  production environment id `6`, and eight redacted resources: six applications
  (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
  Application inventory status remains `running:unknown`; PostgreSQL and Redis
  report `running:healthy`. This is a no-drift inventory refresh only; it does
  not claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1466-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1460-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T08:07:50Z` verified the configured Soar project binding,
  production environment id `6`, and eight redacted resources: six applications
  (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
  Application inventory status remains `running:unknown`; PostgreSQL and Redis
  report `running:healthy`. This is a no-drift inventory refresh only; it does
  not claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1460-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1455-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T07:33:30Z` verified the configured Soar project binding,
  production environment id `6`, and eight redacted resources: six applications
  (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
  Application inventory status remains `running:unknown`; PostgreSQL and Redis
  report `running:healthy`. This is a no-drift inventory refresh only; it does
  not claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1455-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1448-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T07:04:34Z` verified the configured Soar project binding,
  production environment id `6`, and eight redacted resources: six applications
  (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
  Application inventory status remains `running:unknown`; PostgreSQL and Redis
  report `running:healthy`. This is a no-drift inventory refresh only; it does
  not claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1448-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1444-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T06:34:19Z` verified the configured Soar project binding,
  production environment id `6`, and eight redacted resources: six applications
  (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
  This is a no-drift inventory refresh only; it does not claim full application
  readiness, protected `/workers/ready`, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1444-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1443-COOLIFY-READ-ONLY-PRODUCTION-STATUS-ACCESS`:
  confidence for `SOAR-OPERATIONS-001` is improved for Coolify production
  deploy-status access binding. Fresh read-only probes verified required
  binding names are present, authenticated Coolify read endpoints succeed, the
  configured project binding resolves to `Soar`, and project/list inventory can
  observe six application resources plus PostgreSQL and Redis. Direct
  `COOLIFY_SOAR_API_APP_ID` and `COOLIFY_SOAR_WEB_APP_ID` aliases still return
  `404`, so direct resource-alias automation remains a Security/Ops refresh
  follow-up if needed. This does not claim full application readiness,
  protected `/workers/ready`, SLO, restore/rollback, or deploy mutation
  readiness. Evidence:
  `history/evidence/luc-1443-coolify-read-only-production-status-access-2026-06-02.md`.

- 2026-06-02 `LUC-1434-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T06:03:39Z` verified the configured Soar project binding,
  production environment id `6`, and eight redacted resources: six applications
  (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
  This is a no-drift inventory refresh only; it does not claim full application
  readiness, protected `/workers/ready`, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1434-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1422-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback at
  `2026-06-02T05:33:33Z` verified the configured Soar project binding,
  production environment id `6`, and eight redacted resources: six applications
  (`soar-api`, `soar-web`, `workers-backtest`, `workers-execution`,
  `workers-market-data`, `workers-market-stream`) plus PostgreSQL and Redis.
  This is a no-drift inventory refresh only; it does not claim full application
  readiness, protected `/workers/ready`, SLO, restore/rollback, or deploy
  mutation readiness. Evidence:
  `history/evidence/luc-1422-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1419`: local DB-backed API e2e runtime is restored for the
  close-authority route pack. `127.0.0.1:5432` is reachable, Docker server
  reports `28.3.2`, and compose shows local Postgres/Redis running on loopback
  ports. The focused route pack now reaches endpoint assertions (`2/3` pass);
  remaining red result is backend behavior/test-contract drift in the
  pending-DCA case (`closed` response where `submitted` is expected), not an
  Ops runtime blocker. Evidence:
  `history/evidence/luc-1419-local-db-backed-api-e2e-runtime-restore-2026-06-02.md`.

- 2026-06-02 `LUC-1418-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback verified the configured
  Soar project binding, production environment id `6`, and eight redacted
  resources: six applications (`soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`) plus
  PostgreSQL and Redis. This is a no-drift inventory refresh only; it does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1418-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1196` source-scoped recovery: confidence for runtime close
  route-level DCA-first authority remains `BLOCKED` for endpoint proof, while
  the command seam remains locally healthy. Focused route pack
  `bots.runtime-close-authority.route-pack.e2e.test.ts` failed `3/3` before
  endpoint assertions because Prisma cannot reach `localhost:5432`; Docker
  server is unavailable. DB-independent
  `runtimeSessionPositionCommand.service.test.ts` passed `11/11`. First-class
  blocker: `LUC-1419` restores local DB-backed API e2e runtime, then Backend/QA
  reruns the focused route pack before any `VERIFIED` claim.

- 2026-06-02 `LUC-1196` issue_blockers_resolved closure: confidence for runtime
  close route-level DCA-first authority is upgraded to verified for the focused
  endpoint scope. Local PostgreSQL was reachable, close-command code now checks
  active submitted DCA dedupe before close orchestration, and focused proof
  passed: route pack `3/3`, DCA route pack `2/2`, focused broad bots e2e
  pending-DCA close scenario `1/1`, and dedupe/command service tests `26/26`.
  Full API typecheck still fails in unrelated active lanes
  (`positions.orphan-repair.contract.e2e.test.ts`,
  `workers-health-readiness.test.ts`).

- 2026-06-02 `LUC-1306` issue_blockers_resolved closure: coordinator-level
  operator lane is closed against the same runtime DCA-first target after fresh
  rerun evidence in this wake. Proof passed:
  `bots.runtime-close-dca-authority.e2e.test.ts` (`2/2`) and
  `runtimePositionAutomation.dcaTpParity.test.ts` (`2/2`). No code, deploy,
  restart, env, database administration, account, or LIVE trading mutation was
  performed in the coordinator heartbeat.

- 2026-06-02 `LUC-1416-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback verified the configured
  Soar project binding, production environment id `6`, and eight redacted
  resources: six applications (`soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`) plus
  PostgreSQL and Redis. This is a no-drift inventory refresh only; it does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1416-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1412-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback verified the configured
  Soar project binding, production environment id `6`, and eight redacted
  resources: six applications (`soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`) plus
  PostgreSQL and Redis. This is a no-drift inventory refresh only; it does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1412-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1408-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback verified the configured
  Soar project binding, production environment id `6`, and eight redacted
  resources: six applications (`soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`) plus
  PostgreSQL and Redis. This is a no-drift inventory refresh only; it does not
  claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1408-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1405-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` remains improved for production target
  inventory truth. Fresh read-only Coolify API readback verified the configured
  Soar project binding, production environment id `6`, and eight redacted
  resources: six applications (`soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`) plus
  PostgreSQL and Redis. This upgrades resource-inventory truth only; it does
  not claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1405-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-06-02 `LUC-1402-COOLIFY-RESOURCE-INVENTORY-RECONCILIATION-2026-06-02`:
  confidence for `SOAR-OPERATIONS-001` is improved for production target
  inventory truth. Fresh read-only Coolify API readback verified the Soar
  project production environment id `6` and eight redacted resources: six
  applications (`soar-api`, `soar-web`, `workers-backtest`,
  `workers-execution`, `workers-market-data`, `workers-market-stream`) plus
  PostgreSQL and Redis. This upgrades resource-inventory truth only; it does
  not claim full application readiness, protected `/workers/ready`, SLO,
  restore/rollback, or deploy mutation readiness. Evidence:
  `history/evidence/luc-1402-coolify-resource-inventory-reconciliation-2026-06-02.md`.

- 2026-05-26 `COOLIFY-AUTO-DEPLOY-WORKER-RECOVERY-2026-05-26`: confidence for
  `SOAR-OPERATIONS` and `SOAR-WORKERS` is improved for bounded deploy
  automation and worker liveness. Coolify `Auto Deploy` is enabled and
  persisted on the six existing Soar Applications, `workers-market-stream`
  recovered with successful deployment `gqpmafky0oe2jr3rszkov2is` on SHA
  `3fedb7a9170097b40accb6ccea1915064f383f11`, all Soar resources read back as
  running, and public no-worker smoke passed for API `/health`, API `/ready`,
  Web `/`, and Web `/api/build-info`. Confidence remains `PARTIAL/BLOCKED`
  for full V1 production readiness because protected worker-token readiness,
  authenticated app journeys, release signoff, SLO/RC, restore/rollback, and
  LIVE mutation approval are outside this repair. Local `HEAD` is still `38`
  commits ahead of `origin/main`, so those local commits are not deployed until
  a coherent push occurs.

- 2026-05-26 `COOLIFY-PUSH-DEPLOY-FANOUT-71B8D503-2026-05-26`: confidence for
  `SOAR-OPERATIONS` and `SOAR-WORKERS` is improved again from trigger-only
  repair to production convergence proof. Push-triggered deployment rows were
  created, host blockers were repaired, Docker image bloat from `apps/api/core`
  dumps was mitigated, and all six Soar Applications now run
  `71b8d503fd6fdfd7378dc67b2fa678799e2430f8`. Public no-worker smoke passed,
  Redis/Postgres read back healthy, and disk has `18G` available. Confidence
  remains `PARTIAL/BLOCKED` for full release readiness because protected worker
  token checks, authenticated journeys, SLO/RC, restore/rollback, and LIVE
  mutation approval are outside this repair.

- 2026-05-25 `DASH-RUNTIME-SIGNAL-CONDITION-ACTIVE-2026-05-25`: confidence is
  improved locally for `SOAR-DASHBOARD-001` and Web runtime signal surfaces.
  Dashboard Home now counts and visually emphasizes explicit matched
  `LONG`/`SHORT` strategy condition lines separately from accepted execution
  signal truth. Blocked execution still renders the backend runtime state and
  message/reason text. Focused proof passed RuntimeSignalsSection/helper tests
  (`2` files / `9` tests), Web typecheck, Web lint, and diff check. Protected
  production/browser readback remains outside this local repair lane.

- 2026-05-25 `LUC-40-DATA-PERSISTENCE-KNOWN-STATE-2026-05-25`: data-persistence confidence is refreshed to evidence-backed `PARTIAL` for schema/migration integrity and ownership model coverage. `corepack pnpm --filter api exec prisma validate` passed, and `corepack pnpm --filter api exec prisma migrate status --schema prisma/schema.prisma` passed with `55` migrations and up-to-date schema. Known-state artifact: `history/tasks/luc-40-data-persistence-known-state-2026-05-25-task.md`. Residual gap: focused module API persistence pack timed out (`124054ms`), so entity-level runtime behavior remains partially verified until narrowed DB-backed packs complete.

- 2026-05-25 `LUC-42-AI-RUNTIME-BOUNDARY-DRYRUN-LIVE`: assistant runtime boundaries are confirmed as advisory-only for implemented dry-run. `AssistantDryRunSchema` now accepts only `BACKTEST|PAPER`; focused e2e verifies `POST /dashboard/bots/:id/assistant-config/dry-run` rejects `mode: LIVE` with `400`. Architecture boundary docs now classify chain classes (advisory/operator-assisted/executable) and explicit tool/context/bypass constraints under `SOAR-ASSISTANT-AI-001`. No hot-path trading/automation execution bypass was introduced.

- 2026-05-25 `FUNCTION-JOURNEY-EVIDENCE-INDEX-2026-05-25`: confidence for the
  Architecture Evidence Graph and future debugging workflow is improved. The
  new generated journey index maps current graph records into function-chain,
  web-journey, and API-surface evidence CSVs plus JSON/Markdown summaries.
  It now also generates a user-action index so UI routes and controls can be
  traced through APIs, function chains, backend functions, data models, tests,
  docs, evidence, and proof boundaries before repairs are claimed as done.
  Proof passed: `node --check scripts/generateFunctionJourneyIndexes.mjs`,
  `node --check scripts/generateUserActionIndex.mjs`,
  `node --check scripts/triageJourneyEvidence.mjs`,
  `pnpm run architecture:journey:index`,
  `pnpm run architecture:journey:index:strict`, triage proof for
  `SOAR-UI-MANUAL-ORDER-SUBMIT`, and JSON parse checks. Current result: `27`
  function chains, `36` web journeys/pages, `96` API surfaces, `39` user
  actions, `0` critical structural/action gaps, `28` high function/API proof
  gaps, and `37` high user-action proof gaps. This is traceability and
  repair-routing proof only; it does not upgrade local-only modules to
  production verified.

- 2026-05-25 `PROD-RUNTIME-AGGREGATE-SLO-BLOCKER-2026-05-25`: confidence for
  `SOAR-BOT-RUNTIME-001` and release operations is reduced from protected
  proof refresh to `PARTIAL/BLOCKED` for production activation. Fresh
  read-only production evidence exists for restore, rollback, UI clickthrough,
  auth session, security/exchange, and LIVEIMPORT-03 on `24e9d3b8`, but the
  30-minute RC/SLO observation failed and production logs showed heap
  out-of-memory restarts tied to the runtime monitoring aggregate endpoint.
  Local mitigation limits aggregate fanout and skips failed per-session rows;
  proof passed focused aggregate concurrency `1/1`, aggregate e2e `18/18`,
  API typecheck, repository lint, architecture graph generation, and
  `quality:guardrails`. Commit `287e77a1` is deployed and public no-worker
  smoke passed. The post-deploy SLO window recorded `0` API 5xx delta and low
  average latency, but failed availability after the host became unreachable
  from local checks on SSH `22` and HTTPS `443`. Production confidence cannot
  increase until VPS reachability is restored and a fresh SLO/RC gate passes.

- 2026-05-24 `GATEIO-LIVE-RECONCILIATION-SCOPE-2026-05-24`: confidence is
  improved for `SOAR-POSITIONS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`. Commit `24e9d3b8d51b4b4c4f1b25cad920096f2223b0ec`
  includes Gate.io in the default external-position reconciliation synced-key
  scope and adds DB-backed regression coverage proving a Gate.io LIVE FUTURES
  key is selected. Local proof passed focused reconciliation tests (`32/32`),
  API typecheck, repository lint, `quality:guardrails`, and strict graph drift
  (`796/796`, `0` missing). Production proof: Coolify API deploy converged to
  `24e9d3b8`, public API `/health`, API `/ready`, and Web build-info passed,
  app-internal orphan repair saw one Gate.io open position and created
  `BNBUSDT` as `BOT_MANAGED`, `IN_SYNC`, and `CONFIRMED`, and `LIVEIMPORT-03`
  read-only proof shows Gate.io `BNBUSDT` as `EXCHANGE_SYNC`,
  `OWNED_AND_MANAGED`, and `actionable: true` in
  `history/artifacts/liveimport-03-prod-readback-24e9d3b8-2026-05-24.json`.
  Binance runtime readback currently has no open runtime payload in that
  artifact. No LIVE exchange-side order, cancel, close, or position mutation
  was performed.

- 2026-05-24 `API-LOCAL-REGRESSION-SWEEP-2026-05-24`: local backend
  confidence is refreshed for Bot Runtime, Orders, Reports, Wallets, Runtime
  Flow, and AI Assistant Foundation. The sweep closed dynamic-stop display
  fallback drift, lifecycle close parity `TSL` mapping, reports unsettled-trade
  counting, orders contract LIVE entitlement setup, runtime-flow polling, and
  DB cleanup gaps in wallet/manual-order tests. Focused regression proof passed
  (`14` files / `107` tests), the full API Vitest suite passed after clean DB
  reset in one-worker mode, API typecheck passed, repository lint passed, full
  workspace build passed, quality guardrails passed, strict graph drift passed
  with `796/796` covered and `0` missing, and diff check found no whitespace
  errors beyond LF/CRLF warnings. This is local backend proof only; protected
  production readbacks and LIVE mutation remain blocked by missing operator
  inputs and explicit approval.

- 2026-05-24 `LOCAL-INTEGRITY-BUILD-SWEEP-2026-05-24`: local repository
  confidence is refreshed after the current graph/release-tooling/state and
  Dashboard updates. Full API/Web typecheck passed, docs parity passed with
  API `22/22`, Web `16/16`, and Routes `37/37`, reusable audit/operator
  aggregate validation passed, and full workspace build passed for mobile
  scaffold placeholder, API `tsc`, and Web production `next build`. This does
  not upgrade protected production readiness; V1 remains `NO-GO` until
  protected evidence gates pass.

- 2026-05-24 `WEB-DASHBOARD-SELECTED-BOT-LOAD-DEPS-2026-05-24`: local
  confidence is refreshed for `SOAR-DASHBOARD-001`. Dashboard Home's runtime
  load callback now reads current selected-bot state through a synchronized ref,
  closing the React hook lint drift without making bot selection a full reload
  trigger. The initial full Web test rerun exposed three Dashboard selection
  regressions, and the ref-based fix closed them. Focused hook tests passed
  (`4/4`), focused Dashboard regression tests passed (`26/26`), full Web tests
  passed (`150` files / `534` tests), Web lint passed with no warnings/errors,
  Web typecheck passed, repository lint passed with no warnings/errors,
  guardrails passed, and strict architecture graph drift passed with `796/796`
  covered and `0` missing. Production Dashboard clickthrough and broader V1 GO
  remain blocked on protected auth/context and release evidence gates.

- 2026-05-24 `PROD-FRESH-DEPLOY-380308D1-2026-05-24`: operations/release
  confidence improves from `publicly reachable but deploy freshness blocked`
  to `publicly fresh and still protected-proof blocked`. Web/API/workers are
  deployed to `380308d10cf0fabb2ea629eb55e6f0ba7d980ed1`; public build-info
  returns that SHA with `metadataSource=github-branch`; API `/health`, API
  `/ready`, and Web `/` return `200`; public no-worker deploy smoke passes;
  Docker container tags show API and all Soar workers running the same SHA.
  No-secret V1 preflight rerun passes build-info and public smoke, then blocks
  only on protected auth/context and release evidence gates. Protected app
  journeys, production UI clickthrough, LIVEIMPORT-03, rollback proof, restore
  drill, RC evidence, and LIVE mutation remain unverified/blocked without
  approved auth/context.

- 2026-05-24 `PROD-PUBLIC-REACHABILITY-REFRESH-2026-05-24`: operations/release
  confidence improves from `blocked by public reachability` to `publicly
  reachable but deploy freshness blocked`. API `/health`, API `/ready`, and
  Web `/` return `200`, TCP succeeds for Web/API/VPS public ports checked, and
  public no-worker deploy smoke passes. Current production Web build-info is
  stale at `51fa41efb1664d5cb2e8dbb81cbec33f11365ccd` while `origin/main` is
  `52be8b614d2da9ec05d368ac4fbd05f3ec8f8332`. Protected app journeys,
  production UI clickthrough, LIVEIMPORT-03, rollback proof, restore drill,
  RC evidence, and LIVE mutation remain unverified/blocked without approved
  auth or deploy control context.

- 2026-05-24 `ARCH-GRAPH-STRICT-GUARDRAIL-2026-05-24`: graph confidence is
  improved for the Architecture Evidence Graph system. Strict representative
  drift is now enforced by `pnpm run quality:guardrails`, which runs the
  architecture graph drift audit in fail-on-drift mode. Current proof:
  `pnpm run architecture:graph:drift:strict` reports `796/796` covered and
  `0` missing; `node --test scripts/repoGuardrails.test.mjs` passes `9/9`;
  `pnpm run quality:guardrails` passes and reports `Architecture graph drift:
  OK`. This is graph traceability enforcement, not runtime journey proof.

- 2026-05-24 `RELEASE-AUDIT-TOOLING-GRAPH-BACKFILL-2026-05-24`: architecture
  graph confidence is improved for release/audit tooling. The shared
  repository path resolver, operator unblock packet validator, reusable audit
  validators, aggregate tests, workflow node, and
  `CHAIN-RELEASE-AUDIT-TOOLING` are now first-class graph records. Current
  proof: `pnpm run architecture:graph:generate` reports `641` nodes, `791`
  relations, and `27` chains; `pnpm run architecture:graph:drift:strict`
  reports `796/796` covered and `0` missing. This does not change the V1
  production `NO-GO` blocker for missing protected proof inputs.

- 2026-05-24 `ARCH-EVIDENCE-GRAPH-SYSTEM-2026-05-24`: documentation/process
  confidence is improved but not complete. The first Obsidian-first
  architecture evidence graph foundation exists with CSV node registries,
  relation rows, function-chain rows, generated Markdown node notes, generated
  JSON graph export, and generated status. `pnpm run
  architecture:graph:generate` passed with `45` nodes, `24` relations, and
  `4` chains. This is a seed, not full repository coverage; unmapped modules,
  routes, tests, docs, workers, config, migrations, prompts, and events remain
  backfill work and must not be treated as graph-verified.

- 2026-05-24 `ARCH-GRAPH-MANUAL-ORDER-BACKFILL-2026-05-24`: graph confidence
  is improved for `SOAR-MANUAL-ORDERS-001` and `SOAR-ORDERS-001`. Manual
  order execution now has detailed graph records for Dashboard UI, Web service
  boundary, order API routes, controller, DTO schemas, orders service, manual
  context service, quantity rules, pre-trade, execution orchestration,
  lifecycle, exchange events, `OrderFill`, focused tests, Web tests, and docs.
  `pnpm run architecture:graph:generate` now passes with `67` nodes,
  `51` relations, and `5` chains. This is graph traceability proof, not fresh
  runtime behavior proof or LIVE mutation approval.

- 2026-05-24 `ARCH-GRAPH-POSITIONS-BACKFILL-2026-05-24`: graph confidence is
  improved for `SOAR-POSITIONS-001`, `SOAR-DASHBOARD-001`, and adjacent
  runtime money paths. Positions core now has detailed graph records for legacy
  route behavior, Dashboard/runtime UI, Web positions service, Positions API
  routes, controller, DTO schemas, positions service, exchange snapshot
  normalization, LIVE reconciliation, `Position`/`Order`/`Trade`, focused
  API/Web tests, and docs. `pnpm run architecture:graph:generate` now passes
  with `93` nodes, `80` relations, and `6` chains. This is graph traceability
  proof, not fresh production clickthrough proof or LIVE mutation approval.

- 2026-05-24 `ARCH-GRAPH-BOT-RUNTIME-BACKFILL-2026-05-24`: graph confidence
  is improved for `SOAR-BOT-RUNTIME-001`, `SOAR-DASHBOARD-001`, and adjacent
  runtime money paths. Bot Runtime monitoring now has detailed graph records
  for bot runtime routes, monitoring UI, Web bots service, runtime aggregate,
  session, symbol-stat, position, trade, and close-position API routes,
  controller, DTO schemas, aggregate/read/command services, runtime session and
  trading models, API/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `115` nodes, `103` relations,
  and `7` chains. This is graph traceability proof, not fresh authenticated
  production runtime readback or LIVE mutation approval.

- 2026-05-24 `ARCH-GRAPH-EXCHANGE-ADAPTER-BACKFILL-2026-05-24`: graph
  confidence is improved for `SOAR-EXCHANGE-ADAPTER-001`,
  `SOAR-MANUAL-ORDERS-001`, `SOAR-POSITIONS-001`, and `SOAR-BOT-RUNTIME-001`.
  Exchange Adapter now has detailed graph records for broad and exact
  capability contracts, authenticated/public read boundaries, adapter
  boundary, live order adapter, fee reconciliation, symbol rules, market
  catalog, connector factory, CCXT futures connector, API-key probe client,
  consumers, focused tests, and docs. `pnpm run architecture:graph:generate`
  now passes with `142` nodes, `129` relations, and `8` chains. This is graph
  traceability proof, not fresh production exchange mutation proof.

- 2026-05-24 `ARCH-GRAPH-WALLETS-BACKFILL-2026-05-24`: graph confidence is
  improved for `SOAR-WALLETS-001`, `SOAR-BOT-RUNTIME-001`,
  `SOAR-MANUAL-ORDERS-001`, and `SOAR-EXCHANGE-ADAPTER-001`. Wallets now has
  detailed graph records for wallet routes, list/create/edit/preview
  components, Web wallet service, API routes, controller, DTO schemas, wallet
  service, exchange capability/authenticated-read/adapter-boundary links,
  ledger and cashflow services, Wallet/Bot/Position/Order data dependencies,
  focused API/Web/ledger tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `176` nodes, `177` relations,
  and `9` chains. This is graph traceability proof, not fresh authenticated
  browser proof or approved LIVE mutation/readback proof.

- 2026-05-24 `ARCH-GRAPH-PROFILE-API-KEYS-BACKFILL-2026-05-24`: graph
  confidence is improved for Profile API Keys, `SOAR-WALLETS-001`,
  `SOAR-BOT-RUNTIME-001`, and `SOAR-EXCHANGE-ADAPTER-001`. Profile API Keys
  now has detailed graph records for profile API-key UI, Web service, API
  routes, controller, DTOs, encrypted storage, connection probes, exchange
  probe client boundary, API-key and log DB models, Wallets/Bot Runtime
  consumers, focused API/Web/probe tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `202` nodes, `212` relations,
  and `10` chains. This is graph traceability proof, not fresh authenticated
  browser proof or secret-bearing production probe proof.

- 2026-05-24 `ARCH-GRAPH-BOT-SETUP-BACKFILL-2026-05-24`: graph confidence is
  improved for Bot Setup, `SOAR-BOT-RUNTIME-001`, `SOAR-WALLETS-001`, Profile
  API Keys, Strategies, and Markets. Bot Setup now has detailed graph records
  for bot list/create/edit routes, list/form components, Web bots service, bot
  lifecycle API routes, controller, DTOs, context validation, activation
  policy, canonical update scope, market-group/strategy-link topology services,
  Bot/Wallet/API-key/Strategy/MarketUniverse/BotMarketGroup/
  MarketGroupStrategyLink DB dependencies, focused API/Web tests, and docs.
  `pnpm run architecture:graph:generate` now passes with `229` nodes, `251`
  relations, and `11` chains. This is graph traceability proof, not fresh
  authenticated browser proof or LIVE activation proof.

- 2026-05-24 `ARCH-GRAPH-STRATEGIES-BACKFILL-2026-05-24`: graph confidence is
  improved for `SOAR-STRATEGIES-001`, `SOAR-BOTS-001`, and
  `SOAR-BOT-RUNTIME-001`. Strategies now has detailed graph records for
  strategy list/create/edit routes, list/form/preset components, Web
  strategies service, form mapping, presets, indicator catalog, strategy API
  routes, controller, DTO/config validation, strategy service, Strategy/Bot/
  MarketGroupStrategyLink DB guards, Bot Setup and Bot Runtime consumers,
  focused API/Web/indicator/utility tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `261` nodes, `293` relations,
  and `12` chains. This is graph traceability proof, not fresh authenticated
  browser proof or production strategy mutation proof.

- 2026-05-24 `ARCH-GRAPH-MARKETS-BACKFILL-2026-05-24`: graph confidence is
  improved for `SOAR-MARKETS-001`, `SOAR-BOTS-001`, and
  `SOAR-BOT-RUNTIME-001`. Markets now has detailed graph records for market
  universe list/create/edit routes, table/form/multiselect components, Web
  markets service, frontend helper utilities, catalog endpoint, API routes,
  controller, DTOs, markets service, exchange-catalog/symbol resolver,
  MarketUniverse/SymbolGroup/Bot/BotMarketGroup DB guards, Bot Setup and Bot
  Runtime consumers, focused API/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `286` nodes, `329` relations,
  and `13` chains. This is graph traceability proof, not fresh authenticated
  browser proof or production market mutation proof.

- 2026-05-24 `ARCH-GRAPH-BACKTESTS-BACKFILL-2026-05-24`: graph confidence is
  improved for `SOAR-BACKTESTS-001`, `SOAR-STRATEGIES-001`,
  `SOAR-MARKETS-001`, and the Reports consumer path. Backtests now has
  detailed graph records for backtest list/create/detail routes, list/create/
  details components, Web backtests service, details view-model/presenter
  utilities, backtest API routes, controller, DTOs, backtests service, range
  resolver, run queue/job, data gateway, replay core, fill model, report
  lifecycle, immutable strategy/market snapshot resolver, BacktestRun/
  BacktestTrade/BacktestReport DB models, focused API/replay/Web tests, and
  docs. `pnpm run architecture:graph:generate` now passes with `324` nodes,
  `371` relations, and `14` chains. This is graph traceability proof, not
  fresh authenticated browser proof or heavy replay performance proof.

- 2026-05-24 `ARCH-GRAPH-REPORTS-BACKFILL-2026-05-24`: graph confidence is
  improved for `SOAR-REPORTS-001`, `SOAR-BACKTESTS-001`, and report-read-model
  impact analysis. Reports now has detailed graph records for the reports
  dashboard route, `PerformanceReportsView`, Web reports service, Web
  backtests service, cross-mode API route, controller, backend reports service,
  mode aggregation utility, BacktestReport/BacktestTrade/Trade/Bot read
  models, focused API/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `336` nodes, `396` relations,
  and `15` chains. This is graph traceability proof, not fresh authenticated
  browser proof or production report readback.

- 2026-05-24 `ARCH-GRAPH-LOGS-AUDIT-BACKFILL-2026-05-24`: graph confidence is
  improved for `SOAR-LOGS-001`, Profile API Keys audit-event consumers, and
  Bot Setup audit-event impact analysis. Logs/Audit Trail now has detailed
  graph records for the logs route, `AuditTrailView`, Web logs service, logs
  API route, controller, query schema, backend logs service, Log model,
  API-key/Bot Setup producer links, focused API/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `349` nodes, `413` relations,
  and `16` chains. This is graph traceability proof, not fresh authenticated
  browser proof or production action-produced readback.

- 2026-05-24 `ARCH-GRAPH-SUBSCRIPTIONS-ADMIN-BACKFILL-2026-05-24`: graph
  confidence is improved for `SOAR-SUBSCRIPTIONS-ADMIN-001`,
  `SOAR-BOTS-001`, and adjacent entitlement-sensitive trading paths.
  Subscriptions/Admin now has detailed graph records for admin subscriptions
  and users routes, admin layout, profile subscription UI, frontend services,
  admin users and plan APIs, profile subscription and checkout APIs,
  controllers, DTO schemas, subscription services, entitlement guard, checkout
  intent persistence, SubscriptionPlan/UserSubscription/PaymentIntent/User DB
  models, focused API/entitlement/Web tests, and docs. `pnpm run
  architecture:graph:generate` now passes with `387` nodes, `463` relations,
  and `17` chains. This is graph traceability proof, not fresh authenticated
  browser proof or production admin mutation proof.

- 2026-05-24 `ARCH-GRAPH-AI-ASSISTANT-FOUNDATION-BACKFILL-2026-05-24`: graph
  confidence is improved for `SOAR-ASSISTANT-AI-001`, `SOAR-BOTS-001`, and
  AI governance impact analysis. AI Assistant foundation now has detailed graph
  records for bot assistant routes, `BotsAssistantTab`, assistant controller
  hook, Web bot service, assistant config/subagent/dry-run APIs, bots
  controller schemas, `BotAssistantService`, `AssistantOrchestrator`,
  BotAssistantConfig/BotSubagentConfig/Bot DB dependencies, focused
  API/orchestrator/Web/protocol tests, assistant runtime docs, AI integration
  docs, red-team agent, and prompt protocol. `pnpm run
  architecture:graph:generate` now passes with `411` nodes, `499` relations,
  and `18` chains. This is graph traceability proof, not fresh authenticated
  browser proof, production assistant readback, model-backed red-team proof,
  or hot-path AI trading approval.

- 2026-05-24 `ARCH-GRAPH-DRIFT-DETECTION-2026-05-24`: documentation/process
  confidence is improved for future graph completeness checks. `pnpm run
  architecture:graph:drift` now inventories representative source, test, docs,
  config, and pipeline files against graph CSV path references. Latest audit
  after config/pipeline backfill: `404/796` covered and `392` missing, with
  `configAndPipelines` at `9/9` covered. This is an informational backfill
  guide, not a failing gate yet.

- 2026-05-24 `ARCH-GRAPH-OPS-CONFIG-PIPELINE-BACKFILL-2026-05-24`:
  documentation/process confidence is improved for operations and release
  topology traceability. Operations config and pipeline now has graph records
  for package manifests, pnpm workspace, local/VPS compose topology, GitHub CI,
  repository guardrails, and local/testing/deployment docs. `pnpm run
  architecture:graph:generate` passes with `426` nodes, `519` relations, and
  `19` chains. This is graph traceability proof, not remote CI or protected
  production deployment proof.

- 2026-05-24 `SOAR-FULL-READINESS-COORDINATION-2026-05-23`: current
  no-secret readiness confidence is partially verified, not absolute. Local
  `HEAD` and `origin/main` both point at
  `52be8b614d2da9ec05d368ac4fbd05f3ec8f8332`, with `HEAD...origin/main` at
  `0 0`. Public Web/API is currently unreachable from this workstation (`curl`
  to build-info, API `/health`, and API `/ready` timed out with `Failed to
  connect`). Local guardrails, docs parity, typecheck, and focused runtime
  automation exchange-PnL/service/DCA parity tests pass (`3` files / `41`
  tests). Confidence remains blocked for public reachability, authenticated app
  journeys that match the operator-reported broken flows, protected production
  manual/bot readbacks, native mobile parity, deferred AI hot-path trading, and
  any real LIVE exchange mutation without explicit operator approval.
  Affected rows remain evidence-scoped rather than promoted: `SOAR-ORDERS-001`,
  `SOAR-BOT-RUNTIME-001`, `SOAR-EXCHANGE-ADAPTER-001`, and
  `SOAR-OPERATIONS-001`.

- 2026-05-23 `DOC-LOCAL-INDEX-COHESION-2026-05-23`: documentation/process
  confidence is refreshed for graph cohesion. Current docs now connect
  through semantic area hubs; orphan-link scan shows `0` no-incoming docs
  files excluding root indexes and `0` fully isolated docs files. Markdown link
  check, repository guardrails, docs parity, and diff check passed. This is not
  a runtime module verification claim.

- 2026-05-23 `DOC-CONTENT-GRAPH-HYGIENE-2026-05-23`: documentation/process
  confidence is refreshed for Obsidian graph usability. `docs/soar-documentation-map.md` and
  `docs/maps/*` now reserve markdown links for primary navigation and use
  plain code paths for secondary references. Link-density scan shows the top
  docs hub at `10` links, `docs/soar-documentation-map.md` at `6`, and docs maps at `4-6`.
  Markdown link check, repository guardrails, and docs parity passed. This is
  not a runtime module verification claim.

- 2026-05-23 `DOC-KNOWLEDGE-TAXONOMY-REFINEMENT-2026-05-23`: documentation
  confidence is being refined beyond the initial `docs`/`history` split.
  Historical records are now organized by semantic type under `history/tasks`,
  `history/plans`, `history/audits`, `history/evidence`, `history/releases`,
  and `history/artifacts`. This is a documentation/process confidence update,
  not a runtime module verification claim.

- 2026-05-23 `DOC-KNOWLEDGE-SYSTEM-RESTRUCTURE-2026-05-23`: documentation
  confidence is being refreshed for agent navigation and Obsidian usability.
  Dated planning/operations history has been moved from `docs/` to `history/`,
  `docs/maps/*` now provides curated entry maps, and generated evidence tooling
  is being redirected away from current documentation folders. This is a
  documentation/process confidence update, not a runtime module verification
  claim.

- 2026-05-23 `LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23`: local confidence for
  `SOAR-ORDERS-001`, `SOAR-BOT-RUNTIME-001`, and exchange adapter behavior is
  partially refreshed and public-deploy verified for Binance/Gate.io LIVE execution parity. A real
  Gate.io issue was found and fixed locally: same-normalized spot/swap symbols
  and derivative `contractSize` could make manual context, pretrade, and
  runtime sizing misrepresent Gate.io order value. Focused exchange/orders/
  runtime tests passed (`9` files / `129` tests), API typecheck, guardrails,
  and diff check passed, and commit `9d1a8387` is publicly deployed with Web
  build-info plus public no-worker smoke passing. Follow-up docs/state HEAD
  `a0e4f117` is also publicly deployed with Web build-info plus public
  no-worker smoke passing. The manual-order path now also has DB-backed
  service and route proof for Gate.io futures contract semantics: `ADAUSDT`
  with `contractSize=10`, `minAmount=1`, `minNotional=5`, `markPrice=0.25`,
  and `quantity=4` yields `minExecutableQty=2`, estimated notional `10 USDT`,
  and estimated margin `2 USDT` at leverage `5`, proving the UI/API context
  treats quantity as contracts rather than base ADA units. The same route pack
  found and fixed a LIVE close dedupe truth bug: reused submitted close orders
  now remain `submitted` until completed and no longer report `closed` merely
  because a linked position id exists. Protected manual/bot
  production readback remains blocked until transient Soar app auth is
  available, and any further live mutation still requires operator approval
  for a minimum-contract-size order; Gate.io ADAUSDT cannot honor a `<=1 USDT`
  cap because one contract is about `2.421 USDT`.

- 2026-05-23 `WEB-DASHBOARD-DCA-PROTECTION-TRUTH-PARITY-2026-05-23`: local
  confidence for `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001` is refreshed
  for dashboard protection truth. Dashboard Home no longer computes local
  fallback TTP from `trailingTakeProfitLevels` when backend dynamic TTP is
  gated by DCA state; API-provided backend/prospective TTP remains supported.
  Focused Web runtime table/view-model tests passed (`45/45`), Web typecheck,
  guardrails, and diff check passed. Production dashboard readback remains
  protected-auth scope.

- 2026-05-23 `RUNTIME-DCA-EXCHANGE-PNL-THRESHOLD-2026-05-23`: local
  confidence for `SOAR-BOT-RUNTIME-001`, `SOAR-ENGINE-001`, and
  `SOAR-POSITIONS-001` is refreshed for an operator-reported DCA threshold
  miss. LIVE `EXCHANGE_SYNC` position automation now uses exchange
  `unrealizedPnl / marginUsed` as PnL threshold truth when available, while
  retaining lifecycle mark price as the execution price. Regression coverage
  proves a short `SOLUSDT` row showing about `-62.5%` exchange PnL with
  `currentAdds=1` triggers the second `-50%` DCA level even when a newer
  ticker price would model a smaller local drawdown. Validation passed:
  runtime automation exchange-PnL/service tests `38/38`,
  position-management/DCA parity tests `27/27`, API typecheck, repository
  guardrails, docs parity, and diff check. Production readback and any LIVE
  mutation remain protected-auth/operator-approval scope.

- 2026-05-23 post-release docs/state deploy freshness: follow-up docs/state
  sync commits must prove the pushed `HEAD` through public Web build-info and
  public deploy smoke after deployment convergence. The latest verified public
  checkpoint before this record is
  `dd3191d73944f534800659b2dfd0bf5e0bd8b52f`; production Web build-info
  reports that SHA on `main` with `metadataSource=github-branch` and build id
  `PrpSx-bTjsSwKw5bQemwh`, and public smoke passes API `/health`, API
  `/ready`, and Web `/`. Earlier deploys required cancelling stale
  queued/in-progress Coolify deployments and triggering a fresh `soar-web`
  deploy, so queue recovery remains an operations pitfall. Authenticated
  deploy smoke is not claimed for the latest docs/state sync because the
  available Coolify credential is not a valid Soar application password for
  `ai@luckysparrow.ch` (`401 Invalid email or password`).
- 2026-05-23 `SOAR-OPERATIONS-001` and `SOAR-WORKERS-001`: deployed
  `b1ba69edccc639e97943f37fb2b1e6249a62e87c` has current production proof for
  build-info, deploy smoke, split-worker `/workers/ready`, restore drill,
  rollback proof, production UI clickthrough, RC Gates 1-4, SLO
  health/readiness/5xx/queue-lag objectives, read-only `LIVEIMPORT-03`
  runtime readback for the real open symbols `SOLUSDT` and `BNBUSDT`, final
  preflight with no blockers, and a full non-dry-run production release gate
  returning `ready`. `SOAR-WORKERS-001` is current for split-worker readiness.
  `SOAR-OPERATIONS-001` is verified for the current production release gate.
  No production LIVE order, position, exchange mutation, or bot activation
  change was performed by this proof.

## Ledger

| ID | Module | Journey / function | Priority | Status | Confidence | Evidence | Missing proof or defect | Next smallest action | Owner | Last verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SOAR-DATA-001 | Data Model / Migrations | Prisma schema, migration chain, indexes, uniqueness, ownership, and DB-backed data contracts | P0 | PARTIALLY VERIFIED | High | 2026-05-19 `history/audits/data-model-migrations-audit-2026-05-19.md`: Prisma schema validation passed; local migration status reported `54` migrations and schema up to date; full local migration replay applied all `54` migrations; schema diff generation passed; isolated wallet data-contract e2e passed (`1` file / `24` tests), isolated backtests data-contract e2e passed (`1` file / `15` tests), and runtime repository contract passed (`1` file / `2` tests). 2026-05-23 `DATA-MODEL-ISOLATED-DB-PROOF-2026-05-23`: Docker Desktop was started after local Postgres/Redis were unavailable, `pnpm run go-live:infra:up` brought up `soar-postgres-1` and `soar-redis-1`, `pnpm run audit:data:db-isolated` passed with Prisma schema validation, migration status, full reset/replay of `55` migrations, wallets `24/24`, backtests `15/15`, and runtime repository `2/2`; `pnpm run ops:db:backup-restore:check-local` passed with `history/evidence/v1-db-restore-check-2026-05-23T13-05-22-623Z.md`. Critical manual partial-index invariants remain identified for open position scoping and one active market group. | Production migration status and production backup/restore freshness were not rerun in this local audit. Shared-DB parallel e2e remains a documented run-policy pitfall; the isolated audit path is current and passing. | Keep DB-backed audit packs sequential or isolated; refresh production migration/backup/restore proof under protected ops context before future production release claims. | DB/Migrations + QA/Test | 2026-05-23 |
| SOAR-MOBILE-001 | Mobile / Cross-platform | Native/mobile app scope, scaffold status, and future parity gates | P2 | DEFERRED | High | 2026-05-19 `history/audits/mobile-cross-platform-scope-audit-2026-05-19.md`: `apps/mobile` contains only `package.json`, `README.md`, and `src/.gitkeep`; mobile build/test scripts print scaffold-only deferred messages; mobile README and `docs/planning/mobile-parity-contract.md` state no production mobile runtime and no independent mobile backend contracts. 2026-05-28 `LUC-386`: mobile docs registry/index baseline is now explicit via `docs/modules/mobile-module-index.md`, `docs/modules/mobile-bootstrap.md`, `docs/modules/module-doc-status-index.md` (Mobile Surface), and `docs/modules/module-registry.md` (Mobile Module Registry). | No native mobile app, Expo Router, mobile screens, app config, or real mobile tests exist by design. Responsive Web mobile evidence is tracked under `SOAR-UX-A11Y-MOBILE-001`, not this native scope row. | Keep mobile module docs/index rows in sync as long as scope stays scaffold-only; when activation is approved, replace scaffold echoes with real Expo/native build/test validation and expand `mobile-*.md` coverage in the same lane. | Product + Frontend/Mobile + Docs Memory | 2026-05-28 |
| SOAR-I18N-001 | Web i18n / Copy | Route-reachable locale copy, namespace registry, hardcoded literal guardrails, and language policy | P1 | VERIFIED | High | 2026-05-19 `history/audits/i18n-copy-reachability-audit-2026-05-19.md`: route-reachable i18n audit passed with findings `0`, localCopy `0`, fallbackPl `0`, and hardcoded `0`; focused Web i18n pack passed (`8` files / `26` tests), covering translations, guardrails, namespace registry, route locale smoke, provider loading, locale formatting, and optional i18n behavior. | None for current route-reachable local scope. Future route/copy changes must rerun the route-reachable i18n audit. | Keep `corepack pnpm i18n:audit:route-reachable:web` in route/copy change gates. | Frontend Builder + QA/Test | 2026-05-19 |
| SOAR-AUTH-001 | Auth | Login, logout, session validation, expired-session redirect, and protected-route cookie gate | P0 | VERIFIED | High | 2026-05-11 `V1-AUTH-SESSION-LIFECYCLE-PROOF-2026-05-11`: API Auth e2e passed (`11/11`) and proves registration/login cookie TTLs, logout cookie clearing, deleted-user session expiry, expired JWT clearing, and duplicate-token precedence. Focused Web Auth tests passed (`5` files, `17` tests) and cover AuthProvider bootstrap, logout redirect, session-expired warning cleanup, API interceptor redirect to `/auth/login?session=expired`, middleware cookie gate, login form rendering/error alert, and login hook fail-closed missing-session-refresh behavior. 2026-05-14 `history/evidence/prod-auth-session-browser-proof-2fc90a08-2026-05-14.md` found a production replay gap on deployed `2fc90a08`: browser route fail-closed checks passed, but direct reuse of the pre-logout JWT still returned `/auth/me` `200`. `V1-POST-V1-AUTH-LOGOUT-TOKEN-REUSE-HARDENING-2026-05-14` fixed logout by incrementing the matching user's `sessionVersion`; focused Auth/middleware tests passed (`21/21`), root typecheck/lint/build passed, and `history/evidence/prod-auth-session-browser-proof-84711599-2026-05-14.md` passed on deployed `84711599`, including stale-token `/auth/me` `401` after logout. | Current Auth proof is covered for the V1/post-V1 target scope. | Keep auth proof fresh after future deploys; reopen only on a new failing auth/session signal. | Backend Builder + QA/Test | 2026-05-14 |
| SOAR-PROFILE-001 | Profile | Basic profile update, timezone preference, password change, and account deletion guards | P0 | VERIFIED | High | 2026-05-11 `V1-PROFILE-LOCAL-PROOF-2026-05-11`: API Profile basic/security e2e passed (`2` files, `7` tests), proving self-delete route behavior, legacy delete rejection, valid timezone persistence, invalid timezone rejection, unauthenticated security access rejection, valid-current-password change, weak/invalid password rejection, old-login failure/new-login success, and password-confirmed account deletion. Focused Web Profile tests passed (`2` files, `5` tests), proving basic profile save success/error toasts, timezone preference payload, password mismatch short-circuit without API call, and successful password change payload/feedback. 2026-05-14 `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md` verifies production-safe profile read, reversible update, and restore with disposable fixture boundaries and no raw secret artifacts. | Current V1 Profile proof is covered for local security/form behavior plus production-safe reversible update. Avatar upload transport is outside this V1 row. | Keep proof fresh after future deploys; reopen only on a new failing Profile signal or changed profile scope. | QA/Test + Frontend Builder | 2026-05-14 |
| SOAR-PROFILE-API-KEYS-001 | Profile API Keys | Create, test, store, rotate, revoke, delete, and audit exchange API keys | P0 | VERIFIED | High | 2026-05-11 `V1-PROFILE-API-KEYS-LOCAL-PROOF-2026-05-11`: API key e2e and probe service tests passed (`2` files, `25` tests). Evidence covers authenticated access, encrypted-only storage, masked responses, create/list/update/delete, rotate/revoke, owner-only mutation/test behavior, Binance and Gate.io provided/stored probes, no persistence of provided test secrets, audit log metadata without raw secrets, placeholder exchange probe fail-closed behavior, bad-key rejection, futures-missing rejection, and unauthorized ownership protections. Focused Web API key form/list tests passed (`2` files, `13` tests), covering connection-test-before-save, placeholder exchange save behavior, probe support status, stored-key test action, and delete risk confirmation. 2026-05-14 production fixture proof verifies masked API-key create, stored probe fail-closed behavior, audit log visibility for the probe event, and API-key cleanup without writing raw credentials to artifacts. | Current V1 Profile API Keys proof is covered for local secret/ownership contracts and production-safe masked create/probe/audit/delete. | Keep proof fresh after future deploys; do not store or print raw operator secrets in proof artifacts. | QA/Test + Frontend Builder | 2026-05-14 |
| SOAR-WALLETS-001 | Wallets | Create, edit, delete, PAPER/LIVE modes, balance preview, reset guards, and ledger readback | P0 | VERIFIED | High | 2026-05-11 `V1-WALLETS-LOCAL-PROOF-2026-05-11`: API Wallets tests passed (`4` files, `43` tests), covering CRUD normalization, ownership isolation, active-bot edit/delete guards, LIVE api-key/allocation validation, exchange mismatch rejection, Gate.io PAPER/LIVE support, preview allocation modes, unsupported placeholder preview fail-closed behavior, Gate.io stored-key preview, paper reset mode/open-position/open-order guards, reset checkpoint preservation, cashflow classification, and wallet open-PnL scoping. Web Wallets tests passed (`9` files, `22` tests), covering list/empty/create routes, inline API-key state, clone payload, create/edit form validation, mode-specific fields, LIVE preview, metadata options, Gate.io PAPER submit, paper reset success/error states, preview summary/timeline/cashflow, partial ledger, and unavailable ledger fail-closed state. 2026-05-14 `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` adds focused API proof that PAPER wallet reset fails closed while an active bot uses the wallet and succeeds after deactivation when no open wallet-scoped positions/orders remain. 2026-05-14 production fixture proof verifies disposable wallet create, update, readback, and cleanup. 2026-05-19 `history/audits/wallets-capital-ledger-audit-2026-05-19.md` refreshed local proof: Web wallet/capital pack passed (`10` files / `23` tests) and API wallets/capital pack passed (`7` files / `84` tests). | Current V1 Wallets proof is covered for local safety/ledger/reset contracts and production-safe disposable wallet CRUD. LIVE exchange mutation remains outside this proof. | Keep proof fresh after future deploys; reopen only on a new failing Wallets signal. Track explicit wallet command audit-log events under `AUD-17`. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-MARKETS-001 | Markets | Universe create, edit, delete, catalog import, symbol composition, capability guards, and active-bot mutation guard | P0 | VERIFIED | High | 2026-05-11 `V1-MARKETS-LOCAL-PROOF-2026-05-11`: API Markets e2e passed (`1` file, `17` tests), covering authenticated CRUD, normalization, canonical symbol composition, linked symbol-group sync, empty symbol set handling, Binance/Gate.io catalog reads, placeholder exchange persistence, explicit not-implemented catalog response, active bot update/delete blocking, inactive PAPER/LIVE bot edits, deactivation-through-bot-API edits, stale legacy link ignore, active primary bot drift blocking, and cross-user isolation. Web Markets tests passed (`5` files, `12` tests), covering form preview parity, saved volume filter, whitelist/blacklist composition, catalog-hidden whitelist selection, empty preview submit, edit-mode saved selections, placeholder exchange submit, validation helper, table clone payload, and route shells. 2026-05-14 production fixture proof verifies disposable market universe create, update, catalog read, and cleanup. 2026-05-19 `history/audits/markets-strategies-configuration-audit-2026-05-19.md` refreshed local proof as part of `AUD-15`: Web market/strategy pack passed (`19` files / `60` tests) and API markets/strategies pack passed (`4` files / `35` tests). | Current V1 Markets proof is covered for local active-bot/ownership/capability contracts and production-safe disposable universe CRUD/catalog read. | Keep proof fresh after future deploys; reopen only on a new failing Markets signal. Track catalog source freshness telemetry as an observability follow-up. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-STRATEGIES-001 | Strategies | Strategy create, edit, delete, clone, import/export, indicator catalog, config validation, and active-bot mutation guard | P0 | VERIFIED | High | 2026-05-11 `V1-STRATEGIES-LOCAL-PROOF-2026-05-11`: API Strategies tests passed (`3` files, `17` tests), covering authenticated CRUD, export/import package contracts, advanced TSL valid/invalid validation, invalid import rejection, cross-user get/update/delete isolation, active-bot update/delete blocking, inactive bot update allowance, DCA reachability validation, and indicator catalog service behavior. Web Strategies tests passed (`14` files, `46` tests), covering list clone naming/create payload, create/edit/detail route shells, form validation and tab flow, zero lifetime, advanced TSL and reordered DCA validation, unreachable DCA blocking, preset utilities, indicator section behavior, form mapping, numeric normalization, close validation, indicator presentation, and taxonomy. 2026-05-14 production fixture proof verifies disposable strategy create, export, update, bot link/readback, backtest run compatibility, and strategy cleanup. 2026-05-14 `POSTV1-INACTIVE-PAPER-STRATEGY-EDIT-PROOF-2026-05-14`: Web edit-page submit proof passes (`3/3`), Web strategies suite passes (`14` files, `48` tests), and API strategies e2e passes (`11/11`), covering inactive linked bot update allowance plus active-bot lock rendering/action. 2026-05-19 `history/audits/markets-strategies-configuration-audit-2026-05-19.md` refreshed local proof as part of `AUD-15`: Web market/strategy pack passed (`19` files / `60` tests) and API markets/strategies pack passed (`4` files / `35` tests). | Current V1 Strategies proof is covered for local validation/guard contracts, user-facing Web edit submit parity, active-bot lock handling, and production-safe disposable strategy CRUD/export plus representative bot/backtest compatibility. | Keep proof fresh after future deploys; reopen only on a new failing Strategies signal. Track typed domain errors and Web i18n/dirty-state follow-ups separately. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-MANUAL-ORDERS-001 | Manual Orders | Manual context, PAPER order placement, validation, lifecycle readback, cancel/close, selected-bot scope, and Dashboard Home action states | P0 | VERIFIED | High | 2026-05-11 `V1-MANUAL-ORDERS-LOCAL-PROOF-2026-05-11`: API Manual Orders tests passed (`7` files, `75` tests), covering manual context, PAPER market truth, open/cancel/close endpoints, order/position ownership, selected-bot write/read scope, quantity rules, position scope, LIVE risk guards, exchange-backed fail-closed cancel behavior, live fill resolution, and live cancel boundary. Web Manual Orders tests passed (`6` files, `20` tests), covering Dashboard Home submit, validation, context/venue/scope semantics, open-order source labels, open-order cancel actions, and submitted/waiting/ready/imported/position-opened/blocked action states. 2026-05-14 `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md`: production fixture proof verified manual-order context, disposable PAPER limit order open/read/cancel, cancel fail-closed without `riskAck`, and canceled-order readback. 2026-05-19 `history/audits/orders-manual-trading-audit-2026-05-19.md` refreshed local proof: Web manual/open-order pack passed (`8` files / `46` tests) and API orders/manual trading pack passed (`10` files / `121` tests). 2026-05-23 `LIVE-EXCHANGE-EXECUTION-PARITY-2026-05-23` added DB-backed service and route tests for Gate.io futures manual-order context contract-size truth: `quantity=4`, `contractSize=10`, `markPrice=0.25` => `10 USDT` notional and `2 USDT` margin at leverage `5`. | Current V1 Manual Orders proof is covered for PAPER production-safe lifecycle and local Gate.io futures contract-size context semantics. LIVE exchange mutation remains blocked-risk without separate explicit approval. | Keep proof fresh after future deploys; do not run LIVE manual orders without separate explicit approval. | QA/Test + Frontend Builder | 2026-05-23 |
| SOAR-POSITIONS-001 | Positions | Position list/read, close/update, takeover, exchange snapshot, import status, reconciliation, and runtime close UI states | P0 | VERIFIED | High | 2026-05-11 `V1-POSITIONS-LOCAL-PROOF-2026-05-11`: API Positions tests passed (`12` files, `90` tests), covering list/read ownership, symbol filter normalization, stale local exclusion, live status scoping, exchange snapshot selection/fail-closed behavior, Gate.io/Binance authenticated snapshots, takeover classification/rebind, bot-only management truth, orphan repair, imported lifecycle history hydration, live reconciliation ownership/ambiguity/stale-close/open-order handling, manual TP/SL safety, management-mode guards, EXCHANGE_SYNC runtime visibility, selected LIVE close, profitable PAPER manual close, carryover open orders, and pending external DCA separation. Web Positions tests passed (`3` files, `10` tests), covering runtime position PnL derivation/fallbacks, ignored/closed close-action states, pending close state, and runtime table action semantics. 2026-05-12 `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligns Web Positions docs to canonical Dashboard Home/Bot Runtime ownership and legacy redirect behavior. 2026-05-14 `history/evidence/prod-positions-proof-2fc90a08-2026-05-14.md` passed on production: deployed build-info matched `2fc90a08`, unauthenticated Positions access failed closed, an active PAPER runtime candidate was selected, a proof PAPER position was opened, read, switched to manual management and restored, manually updated, checked through live-status/takeover-status/exchange-snapshot reads, rejected close without `riskAck`, closed with `riskAck`, read back as terminal `CLOSED`, and confirmed absent from the OPEN list. 2026-05-19 `history/audits/positions-reconciliation-audit-2026-05-19.md` refreshed local proof: Web runtime positions pack passed (`6` files / `46` tests) and API positions/reconciliation pack passed (`11` files / `68` tests). | Current V1 Positions proof is covered for production-safe PAPER lifecycle and read/fail-closed boundaries. LIVE exchange mutation remains blocked-risk without explicit safe plan. | Keep proof fresh after future deploys; do not run LIVE position mutation without separate explicit approval. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-ORDERS-001 | Orders | Order list/read/open/cancel/close, active-only filtering, exchange events, fills, fees, and open-order UI actions | P0 | VERIFIED | High | 2026-05-11 `V1-ORDERS-LOCAL-PROOF-2026-05-11`: API Orders tests passed (`10` files, `121` tests), covering active order filtering, PAPER/LIVE open contracts, missing price truth rejection, same-symbol add/reverse conflict handling, canonical bot context, LIVE pretrade/risk guards, exchange ids/status/fills/fees, propagated execution errors, manual context rules, close attribution, stale/open exchange-backed cancel and close fail-closed behavior, API list/get ownership, exchange event open/close/DCA/account-update lifecycle, partial/underfilled/capped fill progress, fee pending/backfill, live fill resolution, quantity rules, position scope, and live cancel boundary. Web Orders tests passed (`2` files, `3` tests), covering source labels, active open-order cancel action, and terminal order read-only behavior. 2026-05-12 `V1-WEB-ORDERS-POSITIONS-DOC-TRUTH-2026-05-12` aligns Web Orders docs to canonical Dashboard Home/Bot Runtime ownership and legacy redirect behavior. 2026-05-14 production fixture proof verified disposable PAPER limit order open/read/cancel, fail-closed cancel-without-ack behavior, and terminal canceled-order readback. 2026-05-19 `history/audits/orders-manual-trading-audit-2026-05-19.md` refreshed local proof: Web manual/open-order pack passed (`8` files / `46` tests) and API orders/manual trading pack passed (`10` files / `121` tests), covering lifecycle, ownership, active filtering, fills, fees, exchange events, exchange-backed fail-closed cancel boundary, quantity rules, and position scope. 2026-05-23 Gate.io contract-size follow-up locked order context/rules parity with DB-backed service and route tests plus quantity-rules/runtime contract-size tests; the same route pack fixed LIVE close dedupe truth so submitted reused close orders do not claim closed before completion. | Current V1 Orders proof is covered for production-safe PAPER open/cancel, local fill/fee/exchange-event contracts, local Gate.io futures contract-size order context, and local LIVE close submitted-truth dedupe. LIVE exchange mutation remains blocked-risk without separate explicit approval. | Keep proof fresh after future deploys; do not run LIVE order mutation without separate explicit approval. | QA/Test + Frontend Builder | 2026-05-23 |
| SOAR-BACKTESTS-001 | Backtests | Backtest run create/list/get/delete, replay worker, report, timeline, parity, and UI details flow | P0 | VERIFIED | High | 2026-05-11 `V1-BACKTESTS-LOCAL-PROOF-2026-05-11`: API Backtests tests passed (`12` files, `110` tests), covering auth/ownership, create/list/get/delete, explicit `startAt/endAt` range validation, enriched list fields, pending report contract, strategy-to-backtest-to-paper/live critical flow, paper/live parity with reconciliation, venue consistency, market-universe symbol formula, empty-symbol fail-closed behavior, 3-symbol paper alignment, failed parity diagnostics, run queue/job persistence, replay core, runtime kernel parity, contract remediation, data gateway, fill model, range service, and indicator timeline series. Web Backtests tests passed (`13` files, `32` tests), covering list/create/detail route shells, create form behavior, run details presentation, legacy list view, runs table actions, core-data hook, view-models, non-overlapping trade segments, pair metrics, and timeline indicator overlays. 2026-05-13 `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` routes backtest candle loading through the Exchange public market-data boundary with resolved exchange context, scopes candle cache uniqueness by `source`, carries exchange through run/timeline replay, updates Web timeline types, and passes focused bot/backtest tests (`56/56`) plus API/Web typechecks. 2026-05-13 `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` renders resolved `exchange / marketType / baseCurrency` in Backtest details and passes focused Web proof (`4/4`). 2026-05-14 `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md`: production fixture proof verified disposable backtest run create/readback, report readback, trades readback, timeline readback with candles, and delete cleanup. 2026-05-19 `history/audits/backtests-reports-audit-2026-05-19.md` refreshed local proof: Web backtests/reports pack passed (`15` files / `37` tests) and API backtests/reports pack passed (`13` files / `114` tests). 2026-05-23 `BACKTEST-NON-BINANCE-ORDER-BOOK-FAIL-CLOSED-2026-05-23`: non-Binance FUTURES backtests that require `ORDER_BOOK_*` history now fail closed with explicit parity diagnostics instead of simulating against a silent empty order-book series; focused backtest pack passed (`47/47`) and API typecheck passed. | Current V1 Backtests proof is covered for production-safe disposable run lifecycle and local adapter/replay contracts. Non-Binance historical order-book support remains a future adapter scope; current behavior is fail-closed when an order-book strategy would otherwise require missing history. | Keep proof fresh after future deploys; implement real historical non-Binance order-book support before claiming full order-book parity. | QA/Test + Frontend Builder + Backend Builder | 2026-05-23 |
| SOAR-REPORTS-001 | Reports | Cross-mode performance summaries, per-run report table, and dashboard reports route states | P1 | VERIFIED | High | 2026-05-11 `V1-REPORTS-LOCAL-PROOF-2026-05-11`: API Reports service tests passed (`1` file, `2` tests), covering weighted BACKTEST report aggregation and PAPER trade aggregation. Web Reports tests passed (`3` files, `5` tests), covering `/dashboard/reports` route shell, empty state, aggregated report cards/tables, and route-reachable locale copy. 2026-05-14 `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md`: production fixture proof verified per-run report readback for a disposable production backtest run. 2026-05-19 `history/audits/backtests-reports-audit-2026-05-19.md` refreshed local proof: Web backtests/reports pack passed (`15` files / `37` tests) and API backtests/reports pack passed (`13` files / `114` tests). 2026-05-21 gap-hunt follow-up added DB-backed `reports.e2e.test.ts`; focused Reports API proof passed (`2` files / `4` tests), covering unauthenticated rejection and authenticated user-scoped BACKTEST/PAPER/LIVE cross-mode aggregation. | Current V1 Reports proof is covered for implemented report surfaces. Export/download is not part of the current implemented Reports surface. | Keep proof fresh after future deploys; track export/download, richer filters, snapshot persistence, and i18n hardening separately if they become product scope. | QA/Test + Frontend Builder | 2026-05-21 |
| SOAR-LOGS-001 | Logs/Audit Trail | Authenticated audit log filters, pagination, action-produced events, and metadata trace UI | P1 | VERIFIED | High | 2026-05-11 `V1-LOGS-AUDIT-LOCAL-PROOF-2026-05-11`: API Logs tests passed (`2` files, `5` tests), covering unauthenticated rejection, owner-only reads, source/actor/severity filters, bot action-produced audit event visibility, and pagination defaults/bounds. Web Logs tests passed (`3` files, `4` tests), covering `/dashboard/logs` route shell, empty and loaded states, severity filter request payload, metadata trace rendering, and route-reachable locale copy. 2026-05-14 production fixture proof verifies audit logs readback with the API-key probe event visible, and production UI module audit verifies `/dashboard/logs` route render. 2026-05-19 `history/audits/logs-audit-trail-audit-2026-05-19.md` refreshed local proof: Web logs/audit pack passed (`2` files / `3` tests) and API logs/pagination pack passed (`2` files / `5` tests). | Current V1 Logs/Audit proof is covered for local filter/pagination/rendering contracts and production-safe action-produced audit readback. | Keep proof fresh after future deploys; reopen only on a new failing Logs/Audit signal. Track total-count envelope, pagination controls, saved filters, index tuning, and command-event write coverage separately. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-EXCHANGE-ADAPTER-001 | Exchange Adapter | Binance/Gate.io capability boundaries, public/authenticated reads, API-key probes, live adapter fail-closed behavior, and UI capability wiring | P0 | VERIFIED | High | 2026-05-11 `V1-EXCHANGE-ADAPTER-LOCAL-PROOF-2026-05-11`: fixed Gate.io public catalog symbol normalization at the exchange boundary, then API Exchange tests passed (`19` files, `93` tests), covering API-key probes, runtime exchange order guard, Binance public REST/user data stream, CCXT futures connector behavior, adapter boundary fail-closed support, adapter registry, authenticated read service/contracts, connector factory, execution capability contract, market catalog, metadata contract, public read/market data, symbol rules, live order adapter, live fee reconciliation, and position exchange snapshot normalization. Web Exchanges/Profile API-key tests passed (`5` files, `17` tests), covering capability gating, `/dashboard/exchanges` redirect, profile API-key integration, connection tests, stored-key tests, and delete risk confirmation. 2026-05-12 `V1-CAPABILITY-GATE-SCAN-CLASSIFICATION-2026-05-12` aligns V1 static scan classification with the approved exchange capability matrix so unsupported exchange fail-closed gates are not counted as unresolved findings. 2026-05-13 `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` removed an Engine-side Binance REST warmup shortcut; runtime candle recovery now uses the Exchange public market-data boundary and Gate.io warmup regression proves Binance REST is not called. 2026-05-13 `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` extends that boundary to backtest candle loading and bot runtime fallback candles, and scopes candle cache uniqueness by source. 2026-05-14 `history/evidence/prod-security-exchange-proof-2fc90a08-2026-05-14.md` passed on production: unsupported exchange probe fails closed, Binance futures catalog returns read-only data, Gate.io futures catalog returns canonical symbols, and protected readiness details are authenticated. 2026-05-19 `EXCHANGE-CAPABILITY-TRUTH-AUDIT-2026-05-19`: API exchange capability/registry/boundary tests passed (`4` files / `21` tests), focused exact contract tests passed (`2` files / `4` tests), orders/wallet neutral type consumer tests passed (`2` files / `41` tests), API typecheck passed, and Web exchange capability tests passed (`2` files / `3` tests), confirming exact `(exchange, marketType, operation)` capability truth and neutral exchange-owned type naming are locally green. | Current V1 local and production-safe exchange-boundary proof is covered for read-only/fail-closed scope. Real live mutation remains outside this proof and requires a separate explicit safe plan. The former architecture-level exact matrix debt is repaired; operation support now includes `marketType`. | Keep proof fresh after future deploys; do not claim live-money mutation coverage from this read-only/fail-closed proof. Keep future exchange additions on exact capability contracts and neutral exchange-owned type aliases. | QA/Test + Backend Builder + Frontend Builder | 2026-05-19 |
| SOAR-ENGINE-001 | Engine | Runtime signal merge, final-candle decision, pre-trade, execution orchestration, dedupe, PAPER/LIVE parity, and position automation | P0 | VERIFIED | High | 2026-05-19 `history/audits/engine-trading-decision-flow-audit-2026-05-19.md`: focused engine service/unit pack passed (`15` files / `173` tests), covering deterministic signal merge, decision engine, final-candle decisions, execution orchestration, runtime dedupe, exchange order guard, pre-trade/risk, PAPER/LIVE decision equivalence, market-data gateway, runtime loop/supervisor/scan loop, and position automation. DB-backed engine e2e/smoke pack passed (`4` files / `13` tests), covering PAPER runtime order/position lifecycle, runtime orchestration smoke, pre-trade e2e, and owned imported-position execution. | Current local engine decision-flow proof is covered. Production LIVE/exchange-side mutation and assistant hot-path runtime integration remain outside this row. | Keep engine proof fresh after runtime/engine/exchange lifecycle changes; do not claim LIVE mutation coverage without an explicit safe plan. | QA/Test + Backend Builder | 2026-05-19 |
| SOAR-WORKERS-001 | Workers | Runtime loops, market stream, backtest worker, queue/process topology, readiness, and runtime freshness | P0 | VERIFIED | High | 2026-05-11 `V1-WORKERS-LOCAL-PROOF-2026-05-11`: API Workers/stream/runtime proof passed (`18` files, `88` tests), covering worker ownership/topology, market-stream source config, subscriptions, fanout retry, market-stream route contracts/e2e, Exchange polling source/fanout, Binance stream parsing, protected worker health/readiness, runtime freshness pass/fail/skip behavior, protected `/ready` diagnostics, PAPER runtime-flow worker telemetry, execution orchestrator behavior/import cleanup, execution adapter parity, backtest run job persistence, and queue tuning. 2026-05-14 `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14`: protected production runtime freshness passed for deployed `457bce05` with `runningCount=4`, worker heartbeat PASS, market data PASS, runtime signal lag PASS, and runtime sessions PASS. 2026-05-14 controlled no-order-guard LIVE proof produced `LIVEIMPORT-03` PASS for `TRXUSDT`, simultaneous PAPER+LIVE readback passed with the Binance LIVE bot and both Binance PAPER bots RUNNING, and post-cleanup readback confirmed the LIVE bot was inactive again. Full release gate for `457bce05` is `ready`. 2026-05-19 `history/audits/workers-runtime-operations-audit-2026-05-19.md` refreshed local proof: API worker/runtime operations pack passed (`17` files / `85` tests). | Current V1 worker/runtime freshness and production non-Gate.io simultaneous runtime evidence are covered. Gate.io/second-LIVE production shape remains deferred/outside this release slice. | Keep scheduled runtime freshness and release regression evidence fresh before future deploys. | QA/Test + Backend Builder + Ops/Release | 2026-05-19 |
| SOAR-SECURITY-PRIVACY-001 | Security/Privacy | Auth, session, trusted origin, ops network, rate limits, headers, secret readiness, crypto, ownership isolation, API-key privacy, and abuse throttling | P0 | VERIFIED | High | 2026-05-11 `V1-SECURITY-PRIVACY-LOCAL-PROOF-2026-05-11`: API Security/Privacy proof passed (`23` files, `111` tests), covering security/no-store headers, alerts/metrics admin access, `/ready` secret/runtime diagnostics, API error redaction, crypto keyring and legacy decrypt behavior, rate-limit degradation, ops-network/trusted-origin/auth middleware, critical secret readiness, Auth lifecycle/JWT/cookie/error contracts, cross-module data isolation, Profile API-key ownership/secret handling/probes, Profile password/account deletion, stage abuse throttling, and authenticated position snapshots. Web Auth/Profile proof passed (`13` files, `48` tests), covering middleware, AuthContext, login/register forms/hooks/types, public auth cache contract, profile page, API-key form/list, security form, and basic profile form. This slice also tightened test env restoration for JWT rotation and API-key encryption keyring variables. 2026-05-14 `history/evidence/prod-security-exchange-proof-2fc90a08-2026-05-14.md` passed on production: security headers are present, authenticated profile reads are `no-store`, unauthenticated protected/ops/metrics routes fail closed, API-key list responses are redacted, untrusted Origin receives controlled `403`, unsupported exchange probe fails closed without stored secrets in artifacts, and authenticated readiness details require auth. 2026-05-19 `history/audits/security-privacy-audit-2026-05-19.md` refreshed local proof: auth/middleware/header API pack passed (`9` files / `32` tests), DB-backed auth/profile/API-key/isolation/abuse pack passed (`7` files / `47` tests), focused Web auth/profile/API-key pack passed (`7` files / `28` tests), and public auth cache contract passed (`1` file / `2` tests). | Current V1 local and production-safe protected security proof is covered. External independent security review remains a separate governance follow-up and should not be represented as automated proof. | Keep proof fresh after future deploys; schedule external independent review as a governance follow-up before broader public launch. | QA/Test + Security + Backend Builder + Frontend Builder | 2026-05-19 |
| SOAR-UX-A11Y-MOBILE-001 | UX/A11y/Mobile | Public/dashboard routes, loading/empty/error/success states, keyboard/focus, responsive shell, mobile navigation, screenshot evidence, and console health | P1 | VERIFIED | High | 2026-05-12 `V1-UX-A11Y-MOBILE-LOCAL-PROOF-2026-05-11`: local authenticated route audit passed for implemented public/dashboard/legacy routes; focused Web UX/a11y/state tests passed (`25` files, `126` tests), covering shared state components, tables/tabs, form primitives, invalid-field focus, dashboard/page title a11y, responsive header/footer, Dashboard Home states, Bots, Wallets, Markets, Strategies, Backtests, Reports, Logs, Auth, Profile, and route locale smoke. Edge/CDP browser proof captured desktop Dashboard empty/onboarding, desktop Wallets empty state, mobile Dashboard, and mobile menu screenshots; mobile menu focus/click interaction was exercised; CDP console/exception check returned `0` events and no framework overlay was detected. 2026-05-14 `history/plans/prod-ui-module-clickthrough-2fc90a08-2026-05-14.md` passed for production route/module reachability. 2026-05-14 `history/evidence/prod-ux-a11y-mobile-proof-2fc90a08-2026-05-14.md` passed on production with authenticated desktop Dashboard/Wallets/Bots/Profile screenshots, mobile Dashboard screenshot, mobile menu click, keyboard focus, no framework overlay, and no horizontal overflow. 2026-05-21 gap-hunt follow-up hardened `scripts/runProdUxA11yMobileProof.mjs` so runtime exceptions and console error/warning events become page failures rather than warnings; syntax check passed. | Current V1 UX/A11y/Mobile proof is covered for route reachability and production desktop/mobile browser rendering, but current-target authenticated production proof still requires protected inputs under `AUD-19`. Non-blocking accessibility heuristic warnings remain as polish follow-up. | Keep proof fresh after future deploys; rerun production UX proof with protected inputs and address unnamed internal-control warnings as post-V1 polish. | QA/Test + Frontend Builder | 2026-05-21 |
| SOAR-SUBSCRIPTIONS-ADMIN-001 | Subscriptions/Admin | Admin-only subscription plans, entitlement validation, user role/plan assignment, and rendered admin routes | P0 | VERIFIED | High | 2026-05-12 `V1-SUBSCRIPTIONS-ADMIN-LOCAL-PROOF-2026-05-12`: API admin/subscription tests passed (`3` files, `18` tests), covering unauthenticated rejection, non-admin rejection, plan catalog read, plan price/entitlement update validation, invalid entitlement rejection, user listing with active subscription metadata, role/plan updates, self-demotion blocking, and profile subscription readback. Web admin/profile subscription tests passed (`3` files, `7` tests), covering loaded, error, role-toggle, and plan-assignment UI states. Local admin route audit passed with a throwaway admin, and Edge/CDP screenshots rendered `/admin/subscriptions` and `/admin/users` with no framework overlay. `V1-SUBSCRIPTIONS-FOCUSED-TESTS-2026-05-12` adds focused module coverage for invalid entitlement fallback and FREE-plan LIVE trading fail-closed behavior (`2/2`). `V1-API-SUBSCRIPTIONS-DOC-TRUTH-2026-05-12` aligns the API Subscriptions doc to the current checkout/admin/profile V1 boundary. `V1-MANUAL-PAYMENT-METADATA-CLEANUP-2026-05-12` removes placeholder wording from manual checkout metadata and passes focused profile subscription checkout proof (`8/8`). 2026-05-14 production UI module audits verify authenticated admin route render for `/admin/users` and `/admin/subscriptions` with valid admin auth and no raw secret artifacts. 2026-05-19 `history/audits/admin-subscriptions-entitlements-audit-2026-05-19.md` refreshed local proof: Web admin/subscription pack passed (`4` files / `9` tests) and API admin/subscriptions pack passed (`5` files / `25` tests). | Current V1 Subscriptions/Admin proof is covered for local entitlement/role safety and production protected admin route rendering. Non-destructive production entitlement mutation remains a future admin-ops exercise, not a V1 blocker. | Keep proof fresh after future deploys; reopen only on a new failing admin/subscription signal or changed entitlement scope. | QA/Test + Backend Builder + Frontend Builder | 2026-05-19 |
| SOAR-OPERATIONS-001 | Operations | Deployment smoke, rollback guard/proof, SLO evidence, release gates, alerts, backup/restore, and liveimport readback | P0 | PARTIAL | Medium | 2026-05-13 `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13`: final `LIVEIMPORT-03` passed for `TRXUSDT`; final preflight has no blockers; production target-only V1 release gate is `ready`; build-info freshness, post-deploy smoke, runtime freshness, and rollback guard passed against deployed `00169d7f`. 2026-05-14 `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14`: deployed `457bce05` passed protected runtime freshness, rollback proof, authenticated production UI clickthrough, controlled no-order-guard `LIVEIMPORT-03`, RC gates/sign-off/checklist, production backup/restore drill, final preflight, and full non-dry-run release gate. 2026-05-19 `history/audits/operations-release-deployment-audit-2026-05-19.md` refreshed local proof: typecheck PASS, lint PASS, build PASS, go-live smoke PASS (`45` API tests and `18` Web tests), and local backup/restore PASS after required local Postgres startup. 2026-05-20 `history/tasks/v1-function-architecture-verification-2026-05-20-task.md` refreshed local validation: guardrails PASS, guardrails regression tests PASS, docs parity PASS, endpoint parity PASS, reusable audit manifest verify PASS, lint PASS, typecheck PASS, build PASS, Web tests PASS (`149` files / `514` tests), full API Vitest PASS in a controlled one-worker local-infra window, i18n route audit PASS, `audit:data:db-isolated` PASS after sequential rerun, and go-live smoke PASS (`45` API / `18` Web). Production public deploy freshness is verified for `dd1a1faf`, but final protected `AUD-19` evidence remains blocked on missing protected inputs. | Current local release-safety proof is fresh, and production public deploy freshness is verified for `dd1a1faf`. Full protected production release gate remains historical for deployed `457bce05`; the current target still needs protected auth/context, Gate2 SLO evidence, named Gate4 sign-off/owner fields, runtime, rollback, backup/restore, liveimport, and production UI evidence before a full production readiness claim. | Provide approved protected inputs and execute the current operator unblock packet for the current target; do not claim full production readiness from public smoke alone. | Ops/Release + QA/Test | 2026-05-20 |
| SOAR-DASHBOARD-001 | Dashboard Home | Selected-bot runtime truth, wallet KPIs, runtime positions/orders/trades tables | P0 | VERIFIED | High | Local proof covers loading, retryable error, selected-bot switching, wallet KPI recalculation, open-orders rows, trade-history rows, stale-row suppression, desktop/mobile empty/onboarding state, active PAPER runtime rows, wallet baseline/free funds, and Orders tab interaction. 2026-05-14 production evidence for deployed `457bce05` adds authenticated `/dashboard` route reachability plus simultaneous runtime readback where both Binance PAPER bots expose fresh `RUNNING` sessions, symbol stats, positions, trades, and aggregate data, while the controlled Binance LIVE observation window also proved runtime readback without order placement. Evidence: `history/evidence/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`, `history/plans/prod-ui-module-clickthrough-457bce05-2026-05-14.md`, `history/evidence/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`, and `history/evidence/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`. | Current Dashboard Home proof is covered for the approved non-Gate.io V1/post-V1 target scope. Gate.io/second-LIVE production shape remains separate. | Keep proof fresh after future deploys; reopen only on a new Dashboard runtime failing signal or broader Gate.io/2x LIVE scope decision. | QA/Test + Frontend Builder | 2026-05-14 |
| SOAR-BOT-RUNTIME-001 | Bot Runtime | Canonical bot monitoring route, runtime sessions, symbol stats, open positions, open orders, trades, and legacy runtime redirects | P0 | VERIFIED | High | Local proof covers running/completed PAPER session list/detail, aggregate, positions, symbol stats, trades, completed-session filter, desktop/tablet/mobile rendering, safe session view switch, legacy redirects, and real `RuntimeSignalLoop` telemetry readback through authenticated APIs. 2026-05-14 production evidence for deployed `457bce05` adds authenticated Bot Runtime route/redirect reachability plus simultaneous runtime readback: both active Binance PAPER bots expose fresh `RUNNING` sessions, symbol stats, positions, trades, and aggregate data; controlled no-order-guard Binance LIVE proof exposes a `RUNNING` LIVE session and `LIVEIMPORT-03` readback for `TRXUSDT`; post-cleanup readback confirms the LIVE bot is inactive again. Evidence: `history/evidence/v1-production-dashboard-runtime-action-proof-457bce05-2026-05-14-task.md`, `history/evidence/prod-live-paper-simultaneous-runtime-readback-457bce05-2026-05-14.md`, `history/artifacts/liveimport-03-prod-readback-live-paper-457bce05-2026-05-14.json`, and `history/evidence/prod-live-paper-post-cleanup-readback-457bce05-2026-05-14.md`. 2026-05-19 `history/audits/bots-runtime-truth-audit-2026-05-19.md` refreshed local runtime proof: Web bot/dashboard runtime pack passed (`8` files / `61` tests) and API bot/runtime pack passed (`10` files / `88` tests), covering runtime scope, monitoring aggregate, history parity, takeover visibility, LIVE/PAPER isolation, and delete cleanup. | Current Bot Runtime proof is covered for the approved non-Gate.io V1/post-V1 target scope. Gate.io/second-LIVE production shape remains separate. | Keep proof fresh after future deploys; reopen only on a new runtime failing signal or broader Gate.io/2x LIVE scope decision. | QA/Test + Frontend Builder | 2026-05-19 |
| SOAR-BOTS-001 | Bots | Create, edit, delete, start/stop, and monitor bot through real UI/API path | P0 | VERIFIED | High | 2026-05-11 `BOT-DELETE-ACTIVE-PAPER-2026-05-11`: active PAPER bot delete no longer routes through LIVE confirmation; Web Vitest passed (`147` files, `501` tests), API Bots e2e passed (`27/27`), Web typecheck passed, guardrails passed, diff check passed with line-ending warnings only. 2026-05-14 `history/evidence/prod-fixture-action-proof-457bce05-2026-05-14.md`: deployed `457bce05` production fixture proof verified disposable inactive PAPER bot create/read/update, runtime graph read, market-group and strategy-link readbacks, assistant config update, and bot delete cleanup `PASS`; no LIVE bot activation, order, position, or exchange-side mutation was performed. 2026-05-14 `V1-POST-V1-WALLET-BOT-CLEANUP-HARDENING-2026-05-14` adds local API proof that inactive bot deletion removes bot-owned positions, orders, trades, fills, signals, logs, runtime dedupe rows, runtime sessions, runtime events, runtime stats, market-group links, strategy links, assistant config, and subagent config while preserving the linked strategy. 2026-05-19 `history/audits/bots-runtime-truth-audit-2026-05-19.md` refreshed local bot proof: Web bot/dashboard runtime pack passed (`8` files / `61` tests) and API bot/runtime pack passed (`10` files / `88` tests), covering CRUD, ownership, wallet-first writes, duplicate guards, entitlements, runtime graph/scope, LIVE/PAPER isolation, and delete cleanup. | Current V1 Bots CRUD/config proof is covered for the disposable production fixture boundary. LIVE activation and live exchange mutation remain outside this row and require separate approval. | Keep Bots proof fresh after future deploys; do not run LIVE bot actions without separate explicit approval. | QA/Test + Builder | 2026-05-19 |
| SOAR-ASSISTANT-AI-001 | Assistant/AI | Assistant config, dry-run orchestration, runtime integration truth, and AI red-team readiness | P1 | PARTIAL | Medium | 2026-05-19 `AI-ASSISTANT-RUNTIME-TRUTH-AUDIT-2026-05-19`: deterministic assistant foundation is locally proven. Backend orchestrator tests passed (`2` files / `6` tests), focused Web assistant route tests passed (`2` files / `3` tests), and bot assistant config/dry-run e2e passed after local Postgres/Redis startup (`1` file / `3` tests). Evidence covers config/dry-run, subagent slots, deterministic merge, fail-closed planner failure, timeout/error trace status, sanitization, policy gate, and circuit breaker. 2026-05-23 foundation protocol harness maps all `AI_TESTING_PROTOCOL.md` risk areas for the accepted foundation/dry-run scope and executes deterministic foundation-applicable scenarios. | No audited BACKTEST/PAPER/LIVE hot-path runtime call site to `orchestrateAssistantDecision`; no full model-backed multi-turn runtime AI red-team proof. This is accepted future/gated scope under `DEC-AUD-002`, not a current architecture-code mismatch. | Keep foundation/dry-run scope verified. Plan hot-path assistant orchestration only as a separate future AI/security slice with persisted traces, fail-closed integration, model/runtime assumptions, and full AI red-team evidence. | QA/Test + Security + Backend Builder | 2026-05-23 |
| SOAR-REL-001 | Release confidence | Release-critical module inventory and proof map | P0 | VERIFIED | High | 2026-05-14 final evidence pack: `history/audits/v1-master-state-ledger-2026-05-14-final.md`, `history/plans/v1-project-index-2026-05-14-final.md`, `history/releases/v1-completion-scorecard-2026-05-14-final.md`, `history/audits/v1-final-evidence-inventory-2026-05-14.md`, and `history/audits/v1-100-percent-truth-audit-2026-05-14.md` define the current module-by-module proof map, score, evidence inventory, and scoped 100 percent verdict. 2026-05-14 ledger reconciliation promotes the stale Profile, Profile API Keys, Wallets, Markets, Strategies, Logs/Audit Trail, and Subscriptions/Admin rows to `VERIFIED` using already-accepted production-safe proof artifacts instead of collapsing unproven LIVE mutation scope. | None for the release-confidence inventory row. LIVE order/cancel/close, unsafe LIVE position mutation, existing-data mutation, and broader Gate.io/second-LIVE production shape remain outside the verified V1 scope unless separately approved. | Keep proof-map artifacts fresh after future scope changes or deploys; use new failing signals rather than stale proof gaps to reopen rows. | Planning | 2026-05-14 |

## Current Release Evidence Notes

- 2026-05-23
  `RUNTIME-DCA-PROTECTION-DISPLAY-PARITY-2026-05-23` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, `SOAR-POSITIONS-001`, and
  `SOAR-DASHBOARD-001`: repaired the operator-reported Positions table drift
  where dynamic TSL appeared while loss-side DCA levels were still pending.
  The API read-model now applies side-aware DCA protection before serializing
  dynamic protection fields: TTP waits for profit-side DCA satisfaction, and
  TSL waits for loss-side DCA satisfaction. Exchange-confirmed DCA fill sync
  now persists `executedDcaLevelIndices` from runtime dedupe fingerprints.
  Evidence:
  `history/audits/runtime-dca-protection-display-parity-2026-05-23-task.md`;
  serialization/read-model tests passed (`32/32`), exchange-event DB-backed
  tests passed (`19/19`) after local repo Postgres/Redis startup, runtime
  position-management/automation tests passed (`62/62`), and API typecheck
  passed. Production dashboard readback remains a post-deploy verification
  step.

- 2026-05-23
  `GATEIO-LIVE-MANUAL-ORDER-ADA-SHORT-2026-05-23` applies to
  `SOAR-BOTS-001`, `SOAR-MANUAL-ORDERS-001`, `SOAR-ORDERS-001`, and
  `SOAR-OPERATIONS-001`: an operator-approved LIVE manual order attempt used
  the canonical manual order endpoint with `riskAck=true` and an estimated
  notional below the explicit `1 USDT` cap. Bot activation and consent
  succeeded, but pretrade rejected `SELL MARKET ADAUSDT quantity=4` with
  `LIVE_PRETRADE_NOTIONAL_BELOW_MIN`. The bot was deactivated immediately
  after the fail-closed result; no larger retry was made and no Gate.io ADA
  position was created. Evidence:
  `history/tasks/gateio-live-manual-order-ada-short-2026-05-23-task.md`.

- 2026-05-23
  `GATEIO-LIVE-BOT-CONTEXT-REPAIR-2026-05-23` applies to
  `SOAR-PROFILE-API-KEYS-001`, `SOAR-WALLETS-001`, `SOAR-MARKETS-001`,
  `SOAR-STRATEGIES-001`, and `SOAR-BOTS-001`: production readback confirmed
  wallet `Gate.io` was correctly `LIVE / GATEIO / FUTURES / USDT`, while
  market universe `Main gateio` had been saved as `BINANCE / FUTURES / USDT`,
  causing the wallet-market context mismatch. Gate.io stored API-key read-only
  probe passed for futures, Gate.io futures catalog returned data, `Main
  gateio` was updated to `GATEIO / FUTURES / USDT`, and inactive bot
  `Gate.io RSI 20/80` was created with the Gate.io wallet and `RSI 20 / 80`
  strategy. This verifies inactive configuration only; LIVE activation and any
  exchange-side mutation remain separately approval-gated. Evidence:
  `history/tasks/gateio-live-bot-context-repair-2026-05-23-task.md`.

- 2026-05-23
  `RUNTIME-EXECUTION-DEDUPE-OBSERVABILITY-2026-05-23` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ENGINE-001`, and `SOAR-OPERATIONS-001`:
  runtime execution dedupe acquire paths now emit architecture-required
  miss/hit/inflight/retry observability through the existing metrics store and
  `/metrics` payload, including per-command buckets and retry error-class
  buckets. Evidence:
  `history/tasks/runtime-execution-dedupe-observability-2026-05-23-task.md`;
  runtime dedupe service tests passed (`13/13`), metrics route tests passed
  (`5/5`) after repo Postgres/Redis startup, and API typecheck passed.

- 2026-05-22
  `ARCH-RUNTIME-P1-002-004-MONEY-PATH-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, and `SOAR-POSITIONS-001`:
  repaired remaining local money-path architecture drift from the runtime
  audit. `ACCOUNT_UPDATE` position scope now requires source API-key identity
  and matches only wallet/bot positions owned by that key; missing source
  identity fails closed. Runtime open, runtime close, and runtime DCA live
  order submission now propagate deterministic `soar_...` client order ids
  derived from runtime dedupe keys through the order service and exchange
  boundary. Zero-quantity account updates no longer synthesize a close without
  fill/trade/PnL truth; they mark the position `DRIFT`/`RECOVERING` until
  authoritative close fill evidence arrives. Evidence: exchange-event tests
  passed (`21/21`), exchange boundary/orders tests passed (`51/51`), runtime
  orchestrator/automation tests passed (`55/55`), and API typecheck passed.

- 2026-05-22
  `ARCH-RUNTIME-P1-010-011-WORKERS-QUEUE-HEARTBEAT-2026-05-22` applies to
  `SOAR-BACKTESTS-001`, `SOAR-WORKERS-001`, and `SOAR-OPERATIONS-001`:
  repaired the local OPS/WORKERS follow-up for durable backtest queue
  ownership and cross-container worker heartbeat truth. Split backtest
  ownership now enqueues run ids to Redis and the `workers-backtest` entrypoint
  consumes the existing backtest job from that queue; local inline mode remains
  the explicit fallback. The backtest job now skips terminal runs and clears
  stale run-owned trades before retrying active runs. Worker bootstrap writes per-family Redis
  heartbeats, and `/workers/ready` requires fresh heartbeats for required
  split-worker families. Evidence:
  `history/tasks/arch-runtime-p1-010-011-workers-queue-heartbeat-2026-05-22-task.md`;
  focused queue/job/heartbeat/ownership tests passed (`17/17`), workers
  health/readiness route tests passed (`7/7`), API typecheck
  passed, and `git diff --check` passed with line-ending warnings only.
  Production protected `/workers/ready` readback is still required after
  deploy.

- 2026-05-22
  `ARCH-CODE-RUNTIME-AUDIT-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, `SOAR-BACKTESTS-001`,
  `SOAR-REPORTS-001`, and `SOAR-OPERATIONS-001`: architecture/code audit
  found and repaired local drift in runtime execution dedupe, LIVE fill
  authority, imported LIVE dynamic-stop display, backtest closed-candle
  windowing, settled-only report aggregation, deploy smoke worker readiness,
  VPS split-worker compose defaults, API DB readiness, rollback
  worker-readiness proof, account-update source scoping, deterministic runtime
  live-order client ids, zero-quantity account-update recovery behavior,
  backtest `TSL` event naming, durable Redis backtest queue ownership, and
  Redis-backed worker readiness heartbeats. Validation passed: focused API pack
  `88/88`, readiness/backtest/report pack `20/20`, backtest/worker follow-up
  packs, money-path follow-up packs, API/Web typecheck, script syntax checks,
  and VPS compose config with required env. Remaining open finding is tracked
  in `history/audits/architecture-code-runtime-audit-2026-05-22-task.md`: full
  backtest multi-strategy merge parity, currently fail-fast mitigated.

- 2026-05-22
  `LIVE-DCA-SUBMITTED-FILL-GATE-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-ORDERS-001`, and `SOAR-POSITIONS-001`:
  emergency runtime safety fix after operator feedback that LIVE DCA could be
  treated as progressed before exchange fill confirmation, allowing stop/TSL
  logic to continue from false DCA state. Runtime automation now returns
  fail-closed when DCA order placement is only submitted (`executed: false`);
  DCA progress, `DCA_EXECUTED` telemetry, symbol-stat DCA count, and same-tick
  close protection wait for confirmed fill handling. Evidence:
  `history/tasks/live-dca-submitted-fill-gate-2026-05-22-task.md`; focused
  runtime automation tests passed (`37/37`) and API typecheck passed.

- 2026-05-21
  `V1-PROTECTED-APP-PROOF-ATTEMPT-DD1A1FAF-2026-05-21` applies to
  `SOAR-OPERATIONS-001`: operator packet validation and build-info readback
  passed for deployed `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac`; protected
  production UI clickthrough passed; rollback proof passed with
  `shouldRollback=false`, runtime freshness `PASS`, and no alerts; Gate 4
  sign-off is approved. Current operations confidence remains `PARTIAL`
  because `LIVEIMPORT-03` authenticates but fails closed with no open runtime
  payload: the RUNNING Binance FUTURES LIVE session has closed historical
  `BNBUSDT` / `XRPUSDT` rows, `openCount=0`, and `openOrdersCount=0`. The
  controlled proof runner refuses to take over the already-active LIVE bot.
  Fresh production SLO is `FAIL`: `/workers/ready` availability is `0%`, API
  5xx ratio is `16.6667%`, and the artifact reports deployed `inline` worker
  topology (`DEPLOYED_INLINE_MODE`). Production restore still needs
  VPS/Coolify Docker access. Evidence:
  `history/evidence/v1-protected-app-proof-attempt-dd1a1faf-2026-05-21-task.md`,
  `history/plans/prod-ui-module-clickthrough-dd1a1faf-2026-05-21.md`,
  `history/evidence/v1-rollback-proof-prod-2026-05-21T00-00-00-000Z.md`,
  `history/artifacts/liveimport-03-prod-readback-dd1a1faf-2026-05-21.json`,
  `history/evidence/v1-slo-observation-2026-05-21T15-28-20-108Z.md`, and
  `docs/operations/v1-rc-signoff-record.md`.

- 2026-05-21
  `SUPPLY-CHAIN-SAST-OPS-AUDIT-2026-05-21` applies to
  `SOAR-OPERATIONS-001` and `SOAR-SECURITY-PRIVACY-001`: completed the
  requested local defensive audit for dependency/supply-chain hygiene,
  Docker/compose, env templates, secrets handling, logging artifacts,
  CI/scripts, SSRF/egress surfaces, file upload/static assets, and production
  readiness gates. Confirmed and fixed secret-bearing CLI argv handling in
  protected ops scripts, added root env-file ignore policy, and added
  repository guardrails for tracked runtime env files plus secret-bearing
  ops-script parsers. Evidence:
  `history/audits/supply-chain-sast-ops-audit-2026-05-21-task.md`; guardrail
  tests `9/9`, repository guardrails, production dependency audit, compose
  config checks, API/Web typecheck, script syntax, manual fail-closed checks,
  and diff check passed. Residual external/protected gates remain separate:
  VPS/cloud egress review, protected `AUD-19`, and operator handling of local
  untracked env files.
- 2026-05-21
  `FRONTEND-SECURITY-UX-OWASP-SWEEP-2026-05-21` applies to
  `SOAR-SECURITY-PRIVACY-001`, `SOAR-PROFILE-API-KEYS-001`,
  `SOAR-AUTH-001`, and `SOAR-MANUAL-ORDERS-001`: completed a focused Web
  OWASP Top 10 / cheat-sheet sweep for auth bootstrap, protected data flashes,
  admin gating, CSP/security headers, secret/error exposure, browser storage,
  CSRF-sensitive UI call shape, clickjacking/HSTS assumptions, and money-action
  confirmations. Confirmed and fixed frontend defects in profile API-key
  response handling and profile/security production error display. Evidence:
  `history/tasks/frontend-security-ux-owasp-sweep-2026-05-21-task.md`;
  focused Web profile/error tests passed (`4` files / `28` tests), broader Web
  auth/admin/header/money pack passed (`7` files / `23` tests), Web typecheck
  passed, and `git diff --check` passed with line-ending warnings only.
  Residual external/protected gates remain separate: production header
  readback, protected `AUD-19`, external pentest/VPS review, and backend-owned
  CSRF/trusted-origin verification.
- 2026-05-21
  `SECURITY-RED-TEAM-HARDENING-2026-05-21` applies to
  `SOAR-AUTH-001`, `SOAR-PROFILE-API-KEYS-001`, `SOAR-MANUAL-ORDERS-001`,
  `SOAR-ORDERS-001`, `SOAR-POSITIONS-001`, `SOAR-EXCHANGE-ADAPTER-001`,
  `SOAR-SECURITY-PRIVACY-001`, and `SOAR-OPERATIONS-001`: completed
  second-round security agents found and the coordinator repaired local P1/P2
  issues in stale admin-token authorization, auth IP limiting, production
  ops-network defaults, weak secret readiness/deploy defaults, API-key audit
  events, sensitive logging redaction, runtime close `riskAck`, execution-time
  LIVE entitlements, Gate.io swap derivative handling, unknown LIVE status
  mapping, min-notional price truth, production CSP, production error
  redaction, and dependency audit hygiene. Evidence:
  `history/tasks/security-red-team-hardening-2026-05-21-task.md`. This note is
  local hardening evidence only; protected `AUD-19`, external penetration/VPS
  configuration review, and explicit LIVE exchange-side mutation proof remain
  separate gates.
  Continuation adds verified residual hardening: frontend auth-confirm/admin
  role/API-key response fixes, DB-backed LIVE entitlement downgrade proof,
  stage rehearsal secret argv/artifact protection, hardened VPS env template,
  non-root runtime Dockerfiles with guardrail coverage, production HSTS, and
  localhost-only local datastore port binding.
- 2026-05-21
  `BACKEND-PERMISSION-ISOLATION-REVIEW-2026-05-21` applies to
  `SOAR-AUTH-001`, `SOAR-PROFILE-API-KEYS-001`,
  `SOAR-SECURITY-PRIVACY-001`, `SOAR-SUBSCRIPTIONS-ADMIN-001`, and
  `SOAR-WALLETS-001`: defensive backend review confirmed server-side auth,
  admin guard, API-key ownership, representative user-scope, and denied-access
  proof remained locally green, and repaired a confirmed API-key create DTO
  allowlist defect by passing parsed request payloads and explicit Prisma
  create fields. Evidence:
  `history/tasks/backend-permission-isolation-review-2026-05-21-task.md`.
  Validation passed: API-key e2e `18/18`, auth/admin/API-key pack `34/34`,
  isolation/reports/wallets pack `28/28`, and API typecheck. Protected
  production `AUD-19`, external penetration/VPS configuration review, and
  explicit LIVE exchange-side mutation proof remain separate gates.
- 2026-05-19
  `AUDIT-HANDOFF-SELF-SOURCE-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:handoff:check` now requires the handoff
  Markdown and JSON self-source paths in the handoff source chain. Evidence:
  `history/audits/audit-handoff-self-source-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SOURCE-CHAIN-KEY-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now requires the full reusable
  audit manifest source-chain key set before manifest validation can pass.
  Evidence:
  `history/audits/audit-manifest-source-chain-key-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SOURCE-CHAIN-PATH-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now requires required
  source-chain values to be repository paths. Evidence:
  `history/audits/audit-manifest-source-chain-path-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SOURCE-CHAIN-EXACT-KEY-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now fails when unexpected
  source-chain keys are present. Evidence:
  `history/audits/audit-manifest-source-chain-exact-key-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-MANIFEST-SAFETY-BOUNDARY-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:manifest:check` now fails when manifest
  safety-boundary booleans are missing or unsafe. Evidence:
  `history/audits/audit-manifest-safety-boundary-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-RERUN-PLAYBOOK-BASELINE-PATH-VALUE-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:rerun-playbook:check` now fails when required
  baseline values are empty or not repository paths. Evidence:
  `history/audits/audit-rerun-playbook-baseline-path-value-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-HANDOFF-TOOLING-INDEX-SOURCE-CHECK-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:handoff:check` now requires reusable
  tooling-index Markdown and JSON paths in the handoff source chain. Evidence:
  `history/audits/audit-handoff-tooling-index-source-check-2026-05-19-task.md`.
- 2026-05-19
  `AUDIT-HANDOFF-CLEANUP-VALIDATION-COMMAND-2026-05-19` applies to
  `SOAR-OPERATIONS-001`: `audit:handoff:check` now fails if handoff
  `latestValidation` omits cleanup evidence for headless browser processes,
  local DB/Redis listeners, or Docker compose services. Evidence:
  `history/audits/audit-handoff-cleanup-validation-command-2026-05-19-task.md`.
- 2026-05-14
  `V1-PRODUCTION-FIXTURE-ACTION-PROOF-PLAN-2026-05-14` records the current
  literal-100% blocker for remaining `PASS_LOCAL` rows: production-safe
  action proofs need explicit owner approval before creating, editing, or
  deleting disposable production fixtures. The safe boundary is published at
  `history/evidence/v1-production-fixture-action-proof-plan-2026-05-14.md`.
  No module should be promoted from `PARTIAL`/`PASS_LOCAL` to `VERIFIED`/`PASS`
  from this plan alone; it only defines the approved path needed before the
  next proof run.
- 2026-05-14
  `V1-BACK-WEB-FULL-LOCAL-BASELINE-457BCE05-2026-05-14` applies broadly to the
  API/Web release surface: repository guardrails passed, API/Web typecheck
  passed, full Web Vitest passed (`149` files / `512` tests), full API Vitest
  passed, lint passed, production build passed, and `git diff --check` passed
  with line-ending warnings only. This strengthens local confidence for the
  implemented backend and web layers, but rows remain `PARTIAL` where their
  missing proof is explicitly production-safe clickthrough, external review, or
  protected operator evidence rather than local code coverage.
- 2026-05-14
  `V1-PROTECTED-OPS-GATE-457BCE05-2026-05-14` applies to
  `SOAR-OPERATIONS-001` and `SOAR-WORKERS-001`: production build-info is fresh
  for `457bce05338310c198c03a973395a9176f298dc1`, public API/Web smoke passes,
  protected runtime freshness passes, rollback proof passes with
  `shouldRollback=false`, authenticated production UI clickthrough passes, and
  controlled no-order-guard `LIVEIMPORT-03` readback passes for `TRXUSDT` with
  post-check deactivation. Activation audit/plan, RC external gates, RC
  sign-off, RC checklist, rollback proof, UI clickthrough, public smoke,
  protected smoke, runtime freshness, and rollback guard are fresh/pass for
  2026-05-14. Rows remain `PARTIAL`/production-blocked until the current-day
  production restore drill passes through an approved operator-safe path and
  the final target gate returns `ready`.
- 2026-05-14
  `V1-CURRENT-MAIN-PROMOTION-DEPLOY-LAG-457BCE05-2026-05-14` applies to
  `SOAR-OPERATIONS-001`: current candidate
  `457bce05338310c198c03a973395a9176f298dc1` is pushed to
  `origin/codex/v1-proof-and-ops-evidence` and `origin/main`. Production
  build-info now reports `457bce05`, and public production smoke passed for
  that deployed surface. The row remains `PARTIAL` for current `main` until
  protected runtime freshness, alerts/rollback guard, and the target release
  gate are rerun with approved admin/ops access.
- 2026-05-13
  `V1-RUNTIME-NON-BINANCE-DERIVATIVES-ADAPTER-2026-05-13` applies to
  `SOAR-BOT-RUNTIME-001` and `SOAR-EXCHANGE-ADAPTER-001`: runtime symbol-stats
  fallback derivatives and the live signal market-data gateway now use Exchange
  public adapter methods for non-Binance funding-rate history, open-interest
  history, and current order-book snapshots where supported. Binance REST
  remains scoped to Binance, unsupported adapter capabilities fail closed, and
  derivative fallback caches are exchange-scoped. Evidence: focused runtime
  tests passed (`26/26`), API typecheck passed, and repository guardrails
  passed. Rows remain `PARTIAL` because production-safe multi-bot/runtime
  clickthrough and real target-environment operation proof remain separate
  lanes.
- 2026-05-13
  `V1-NON-BINANCE-BACKTEST-DERIVATIVES-ADAPTER-2026-05-13` applies to
  `SOAR-BACKTESTS-001` and `SOAR-EXCHANGE-ADAPTER-001`: non-Binance futures
  backtest supplemental funding-rate and open-interest history now flows
  through the Exchange public market-data adapter where CCXT exposes those
  public methods. The slice also adds an order-book snapshot boundary but keeps
  non-Binance backtest order-book history empty because a current snapshot is
  not valid historical input. CCXT public market-data normalization and client
  shape types were extracted out of the production connector to satisfy
  monolith guardrails. Evidence: focused backtest/exchange tests passed
  (`26/26`), API typecheck passed, and repository guardrails passed. Rows
  remain `PARTIAL` because runtime non-Binance derivative fallbacks and
  production-safe multi-bot/backtest clickthrough remain separate lanes.
- 2026-05-13
  `V1-RUNTIME-TICKER-AND-BACKTEST-VENUE-UI-2026-05-13` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-BACKTESTS-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: generic runtime fallback ticker prices now use
  the Exchange public market-data boundary for Binance and non-Binance
  exchanges, runtime position readback requests fallback prices in the actual
  bot exchange context, and Backtest details renders resolved
  `exchange / marketType / baseCurrency`. Evidence: focused runtime tests
  passed (`36/36`), focused Backtest details Web test passed (`4/4`), and
  API/Web typechecks passed. Rows remain `PARTIAL` pending production-safe
  multi-bot/runtime/backtest clickthrough and generic non-Binance derivatives
  supplemental support.
- 2026-05-13
  `V1-BOT-BACKTEST-EXCHANGE-ADAPTER-AUDIT-2026-05-13` applies to
  `SOAR-BACKTESTS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: backtest candle loading and bot runtime
  fallback candles now route through the Exchange public market-data boundary
  with exact exchange context instead of direct Binance candle REST. Backtest
  run/timeline replay carries resolved exchange context, `MarketCandleCache`
  uniqueness includes `source`, and Web backtest timeline typing includes
  backend exchange/order-book/parity fields. Evidence: focused bot/backtest
  tests passed (`56/56`), API typecheck passed, and Web typecheck passed.
  Rows remain `PARTIAL` because production-safe multi-bot/runtime/backtest
  clickthrough and generic non-Binance derivatives supplemental support remain
  separate lanes.
- 2026-05-13
  `V1-RUNTIME-EXCHANGE-ADAPTER-BOUNDARY-2026-05-13` applies to
  `SOAR-EXCHANGE-ADAPTER-001` and `SOAR-BOT-RUNTIME-001`: runtime candle
  warmup and indicator recovery now use the exchange-owned public market-data
  boundary instead of direct Binance REST from Engine. Runtime candle and
  derivative stores are exchange-scoped, strategy evaluation receives exchange
  context, and Binance-only derivative fallbacks fail closed for Gate.io.
  Evidence: focused runtime/decision-loop tests (`55/55`), exchange/stream/
  fallback/read-model tests (`12/12`), API typecheck, and guardrails passed.
  Rows remain `PARTIAL` because production-safe multi-bot/live runtime proof
  remains a separate lane.
- 2026-05-13
  `V1-NON-GATEIO-RUNTIME-AND-APP-PROOF-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-BOT-RUNTIME-001`, `SOAR-DASHBOARD-001`,
  `SOAR-EXCHANGE-ADAPTER-001`, and `SOAR-OPERATIONS-001`: Gate.io is
  deferred by user decision for this slice. Authenticated read-only production
  readback verifies both active Binance PAPER bots have fresh RUNNING runtime
  monitoring data through session detail, symbol stats, positions, trades, and
  aggregate monitoring endpoints. The Binance LIVE bot exists and has
  live opt-in enabled, but is currently inactive and has no RUNNING session.
  Local gates passed: focused Web runtime tests (`41/41`), focused API
  runtime/monitoring tests (`47/47` and `29/29`), typecheck, build,
  guardrails, and `test:go-live:smoke`. Rows remain `PARTIAL` where they
  require production action-level UI proof or current LIVE runtime activation
  evidence.
- 2026-05-13
  `V1-PRODUCTION-RUNTIME-INVENTORY-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001` and `SOAR-BOT-RUNTIME-001`: authenticated read-only
  production inventory found 2 active PAPER bots and 1 inactive LIVE Binance
  futures bot. Latest PAPER sessions are RUNNING with fresh heartbeats; latest
  LIVE sessions are CANCELED. Production lacks the requested second active LIVE
  bot and has no visible LIVE Gate.io bot, so the local 2x PAPER + Binance LIVE
  + Gate.io LIVE proof shape cannot yet be claimed in production. Rows remain
  `PARTIAL`.
- 2026-05-13
  `V1-PRODUCTION-UI-CLICKTHROUGH-REFRESH-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-UX-A11Y-MOBILE-001`, and
  `SOAR-SUBSCRIPTIONS-ADMIN-001`: authenticated production route/module
  reachability passed for deployed `00169d7f...` with public `PASS:4`,
  dashboard `PASS:18`, admin `PASS:3`, legacy `PASS:3`, and no blockers.
  Artifact scan found no raw credential/token/cookie/private-header values.
  Rows remain `PARTIAL` because this is GET-only protected route evidence; it
  does not prove every create/edit/delete/action journey or responsive browser
  rendering.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-MONITORING-PROPS-2026-05-13` applies to
  `SOAR-BOT-RUNTIME-001`: Bots Monitoring props now reuse shared runtime enum
  aliases for fee source and capital source, plus `BotRuntimeTrade["origin"]`
  for operational trade origin, removing a local prop-contract drift point.
  Evidence: focused `BotsManagement` test passed (`14/14`), Web typecheck
  passed, local duplicate-union scan returned no matches, and repository
  guardrails passed. The row remains `PARTIAL` pending production-safe
  clickthrough and broader V1 runtime proof.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-RUNTIME-ENUMS-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime enum typing now
  reflects backend `FeeSource`, `TradingRecordOrigin`,
  `PositionManagementMode`, and runtime capital-source domains for runtime
  trade/order/position payloads. Stale Web fixtures using values the backend
  cannot emit were normalized. Evidence: focused Web runtime tests passed (`5`
  files, `47` tests), Web typecheck passed, stale-value scan returned no
  matches, and repository guardrails passed. Rows remain `PARTIAL` because
  production-safe clickthrough and the broader V1 route matrix are still
  separate lanes.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-RUNTIME-ORIGIN-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime position origin
  typing now includes backend `USER`, and Dashboard Home maps backend
  `origin=USER` to the Manual source label in the edit-position context while
  keeping legacy `MANUAL` payload compatibility. Evidence: focused Web test
  passed (`3/3`) and Web typecheck passed. Rows remain `PARTIAL` because the
  broader V1 route matrix and production-safe clickthrough are not complete.
- 2026-05-13
  `V1-WEB-BACKEND-PARITY-DASHBOARD-2026-05-13` applies to
  `SOAR-DASHBOARD-001` and `SOAR-BOT-RUNTIME-001`: Web runtime trade contract
  now matches backend nullable `orderId`, `positionId`, and `strategyId`;
  Bots Monitoring renders missing runtime relationship IDs as `-`; Web
  positions summary typing and empty API/Web aggregate payloads now carry
  `openPositionQty`. Evidence: Web focused tests passed (`2` files,
  `17` tests), API runtime monitoring aggregate e2e passed (`18/18`), API
  typecheck passed, and Web typecheck passed. Rows remain `PARTIAL` because the
  broader V1 route matrix and production-safe clickthrough are not complete.
- 2026-05-13
  `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-00169D7F-2026-05-13` applies to
  `SOAR-BOTS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: local DB-backed API/runtime evidence now proves
  two active PAPER bots plus active Binance LIVE and Gate.io LIVE bots can
  coexist while selected runtime position reads stay isolated by mode, wallet,
  API key, exchange, and market type. The slice also verifies venue-scoped LIVE
  overlap, Gate.io-safe runtime fallback market data through the exchange
  boundary, Binance-only derivative fallback degradation for Gate.io, duplicate
  guard regression, runtime PnL parity, API typecheck, and focused Dashboard
  Web rendering. A rendered Dashboard Home regression also proves all four
  bots appear in the selector and selected wallet/runtime rows re-scope when
  switching between PAPER, Binance LIVE, and Gate.io LIVE. At that checkpoint,
  production-safe authenticated UI/runtime clickthrough and real live
  multi-bot operation evidence were still separate V1 lanes.
- 2026-05-14
  `V1-LIVE-PAPER-SIMULTANEOUS-RUNTIME-PROOF-REFRESH-457BCE05-2026-05-14`
  refreshes the same `SOAR-BOTS-001`, `SOAR-BOT-RUNTIME-001`, and
  `SOAR-EXCHANGE-ADAPTER-001` evidence after the production deploy of
  `457bce05`: production build-info passed for `457bce05`, focused API
  LIVE/PAPER isolation tests passed (`25/25`), focused Web Dashboard
  selected-bot/runtime tests passed (`24/24`), controlled no-order-guard
  production proof activated the existing Binance LIVE bot only for the
  observation window, `LIVEIMPORT-03` passed for `TRXUSDT`, simultaneous
  read-only runtime readback showed the Binance LIVE bot and both Binance
  PAPER bots RUNNING, and post-cleanup readback confirmed the LIVE bot was
  inactive again. This closes the current production non-Gate.io simultaneous
  LIVE/PAPER runtime scope. Rows that still require deeper per-module
  production UI/action clickthrough remain `PARTIAL`; Gate.io/second-LIVE
  production shape remains unavailable/deferred rather than hidden.
- 2026-05-13
  `V1-TARGET-RELEASE-GATE-PASS-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: final `LIVEIMPORT-03` passed for `TRXUSDT`, final
  preflight has no blockers, and the production target-only release gate is
  `ready` for deployed `00169d7f`. Production build-info freshness,
  post-deploy smoke, runtime freshness, and rollback guard passed. The
  remaining limitation is local-environment-only: full gate artifact
  `2026-05-13Tfinal-v1-gate` is `not_ready` because Docker Desktop was
  unavailable for local `test:go-live:smoke` after guardrails, typecheck, and
  build passed.
- 2026-05-13
  `V1-CONTROLLED-LIVE-PROOF-ATTEMPT-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: an approved controlled LIVE proof started a RUNNING
  session and cleaned up by deactivating the bot. Initial ETH/DOGE proof
  targeting was corrected after confirming the target bot's real managed
  symbol set; the accepted proof passed for `TRXUSDT`. A runner partial-update
  defect was fixed and production bot configuration was restored to inactive
  LIVE/import-capable state after proof.
- 2026-05-13
  `V1-CONTROLLED-LIVE-PROOF-PREACTIVATION-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: controlled LIVE proof preactivation confirms the
  no-order guard is fully active and the target LIVE bot is inactive and
  import-capable. The runner refused activation without explicit live-risk
  approval. Operations remains `BLOCKED`.
- 2026-05-13
  `V1-PROD-RESTORE-AND-LIVEIMPORT-TRUTH-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: production restore drill is fresh `PASS`, while
  LIVEIMPORT is fresh `failed` because the existing LIVE Binance futures bot
  has no running session. Operations remains `BLOCKED`; final preflight now
  has only `evidence:liveImportReadback:failed` as the V1 blocker.
- 2026-05-13 `V1-PROTECTED-PROOF-REDUCTION-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`,
  `SOAR-UX-A11Y-MOBILE-001`, and `SOAR-SUBSCRIPTIONS-ADMIN-001`:
  authenticated production UI clickthrough is now fresh `PASS`, and production
  rollback proof is fresh `PASS`. LIVEIMPORT production readback auth succeeds
  and finds one LIVE Binance futures bot, but no running session exists, so
  Operations remains `BLOCKED` and V1 remains `NO-GO`. Final preflight blockers
  are reduced to production DB restore context, LIVEIMPORT runtime readback,
  and stale backup/restore drill evidence.
- 2026-05-13 `V1-GATE4-PATRYK-SIGNOFF-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: Gate 4 is now approved with the user-authorized
  `Patryk` approver/owner fields, and final preflight reports RC evidence as
  fresh. Operations remains `BLOCKED` on protected technical proof and stale
  DB/rollback evidence.
- 2026-05-13 `V1-RC-CURRENT-BLOCKED-REFRESH-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: RC external gates, sign-off, and checklist are fresh
  for 2026-05-13 but remain failed/blocked because Gate 4 approver fields are
  missing. Operations remains `BLOCKED`.
- 2026-05-13 `V1-PRODUCTION-ACTIVATION-REFRESH-2026-05-13` applies to
  `SOAR-OPERATIONS-001`: production activation audit and activation evidence
  plan are fresh `NO-GO` artifacts for 2026-05-13. This removes the activation
  stale classification from final preflight, but Operations remains `BLOCKED`
  until protected auth, DB restore context, RC approval, rollback proof,
  `LIVEIMPORT-03`, authenticated production UI clickthrough, and the final
  release gate are complete.
- 2026-05-13 `V1-OPERATOR-PACKET-CURRENT-DAY-REFRESH-00169D7F-2026-05-13`
  applies to `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`, and
  `SOAR-UX-A11Y-MOBILE-001`: the current operator unblock packet now points to
  2026-05-13 final preflight, protected input readiness, and production UI
  audit artifacts. It is a handoff only, not production proof; statuses remain
  unchanged until protected inputs produce PASS artifacts and the final release
  gate returns `ready`.
- 2026-05-13 `V1-CURRENT-DAY-BLOCKER-REFRESH-00169D7F-2026-05-13` applies to
  `SOAR-OPERATIONS-001`, `SOAR-BOTS-001`, and
  `SOAR-UX-A11Y-MOBILE-001`: deployed build-info still matches
  `00169d7fdc3aff8317759137b05594b20e773c8e`, final preflight public smoke
  passes, and no protected input names were present in the current Codex
  shell. The fresh production UI audit is `BLOCKED_AUTH` with protected
  dashboard/admin/legacy routes failing closed to `/auth/login`; this is
  current blocker evidence, not accepted production UI proof. Operations stays
  `BLOCKED`, Bots stays `PARTIAL`, and production UX clickthrough remains
  missing until approved production app/admin auth and protected release inputs
  are available.
- 2026-05-12 `V1-PROTECTED-INPUT-READINESS-CURRENT-SWEEP-00169D7F-2026-05-12`
  applies to `SOAR-OPERATIONS-001` and `SOAR-BOTS-001`: the current no-secret
  env-name sweep found no matching `LIVEIMPORT_READBACK_*`,
  `ROLLBACK_GUARD_*`, `PROD_UI_AUDIT_*`, `PROD_UI_*`, `SOAR_PROD_*`,
  production DB check, RC, or Gate input families. No secret values were
  printed or stored. This keeps Operations `BLOCKED` and Bots `PARTIAL` until
  the operator packet is executed with approved protected inputs.
- 2026-05-12 `BOTMULTI-09-CONTAINMENT-SUPERSEDE-00169D7F-2026-05-12` applies
  to `SOAR-BOT-RUNTIME-001` and `SOAR-OPERATIONS-001`: the historical
  production promotion marker is closed as contained in the deployed V1 line,
  but production runtime verification is still not closed. Protected runtime
  readback remains in `LIVEIMPORT-03` and the final release gate.
- 2026-05-12 `PROD-UI-AUDIT-PLAN-SUPERSEDE-00169D7F-2026-05-12` applies to
  `SOAR-BOTS-001` and `SOAR-UX-A11Y-MOBILE-001`: the historical broad
  production UI audit plan is closed as superseded by the current
  `ops:ui:prod-clickthrough` release-gate lane. Production UI verification is
  still not closed; the final gate requires a fresh PASS
  `prod-ui-module-clickthrough-*` artifact with approved `PROD_UI_AUDIT_*`
  auth.

## Recent Updates

- 2026-05-23 `ARCH-RUNTIME-P1-006-BACKTEST-MULTI-STRATEGY-MERGE` applies to
  `SOAR-BACKTESTS-001`, `SOAR-BOT-RUNTIME-001`, and `SOAR-ENGINE-001`:
  complete immutable multi-strategy backtest seed snapshots now replay through
  the shared runtime weighted/exit-priority merge policy instead of silently
  degrading to a single-strategy path. The winning primary strategy is
  persisted on backtest trades, report/timeline parity diagnostics include
  merge samples, final-candle runtime votes carry strategy-link provenance,
  and ambiguous link-only snapshots still fail closed. Evidence: runtime merge
  plus backtest contract/job pack passed (`24/24`), replay/kernel parity pack
  passed (`34/34`), and API typecheck passed.

- 2026-05-22 `ARCH-CODE-RUNTIME-AUDIT-2026-05-22` applies to
  `SOAR-ENGINE-001`, `SOAR-ORDERS-001`, `SOAR-BOT-RUNTIME-001`,
  `SOAR-BACKTESTS-001`, `SOAR-REPORTS-001`, and `SOAR-OPERATIONS-001`: four
  read-only architecture/code audit lanes found remaining runtime drift. Two
  P0 orders/exchange defects and safe local P1 defects were fixed: stale
  unproven runtime execution dedupe no longer resets to `execute`, LIVE
  `FILLED` without exchange fill quantity no longer synthesizes local full
  fill/lifecycle truth or uses request price as fill price, imported LIVE
  rows no longer show dynamic strategy fallback without runtime state,
  backtests use closed-candle upper bounds, reports aggregate settled
  realized-PnL trades only, deploy smoke checks worker readiness, VPS compose
  encodes split-worker defaults, API readiness checks DB reachability, and
  rollback proof checks worker readiness. Evidence: focused API pack `88/88`,
  readiness/backtest/report pack `20/20`, script syntax checks, and VPS
  compose config with required env.

- 2026-05-22 `RUNTIME-ARCHITECTURE-DCA-TP-PARITY-2026-05-22` applies to
  `SOAR-BOT-RUNTIME-001`, `SOAR-BACKTESTS-001`, and `SOAR-ORDERS-001`:
  architecture-vs-code review found and fixed a confirmed DCA-first lifecycle
  drift where basic `TP` could close while profit-side DCA levels remained
  pending, and `SL`/`TSL` used an all-DCA gate instead of matching pending
  loss-side DCA. Runtime position management now gates `TP`/`TTP` on
  remaining profit-side DCA and `SL`/`TSL` on remaining loss-side DCA;
  replay/portfolio backtest helpers use the same side-specific close blocking.
  Evidence: focused combined runtime/backtest pack passed `104/104`, SL/TSL
  correction pack passed `71/71`, API typecheck passed, repository guardrails
  passed, and diff check passed with line-ending warnings only. Missing proof:
  production deploy/readback; production
  endpoints timed out during this local checkpoint.

- 2026-05-21 `MONEY-FLOW-SECURITY-CANCEL-ENTITLEMENT-2026-05-21` applies to
  `SOAR-ORDERS-001`, `SOAR-MANUAL-ORDERS-001`, and
  `SOAR-EXCHANGE-ADAPTER-001`: fixed a confirmed local LIVE cancel
  entitlement gap. Exchange-backed LIVE cancel now checks current
  `liveTrading` entitlement before exchange adapter boundary invocation and
  before local cancel mutation, covering both manual cancel and runtime
  stale-order lifetime cancel paths. Focused DB-backed tests were added for
  allowed entitlement and downgraded FREE fail-closed behavior. Evidence:
  API typecheck PASS and repository guardrails PASS. Missing proof:
  focused DB-backed test execution was attempted but blocked by unavailable
  local Postgres/Docker in this session.

- 2026-05-21 `LOCAL-CERTAINTY-CLOSURE-2026-05-21` applies to
  `SOAR-DATA-001`, `SOAR-I18N-001`, `SOAR-PROFILE-001`,
  `SOAR-WALLETS-001`, `SOAR-DASHBOARD-001`, `SOAR-SUBSCRIPTIONS-ADMIN-001`,
  `SOAR-UX-A11Y-MOBILE-001`, `SOAR-OPERATIONS-001`, and Reports module truth:
  closed the remaining locally executable follow-up queue. `Trade.executionMode`
  now snapshots PAPER/LIVE execution mode for new runtime/exchange/imported
  trades, with migration backfill for legacy rows and Reports snapshot-first
  aggregation. Bot preview/assistant route copy now uses i18n provider keys,
  Profile Basic has safer mobile layout, Admin Subscriptions uses shared view
  states, Wallet PAPER reset uses the shared confirmation modal, and Dashboard
  Home tests cover the explicit runtime confirmation gate. Evidence: Prisma
  generate/reset/validate/status PASS, full Web Vitest PASS (`149` files /
  `522` tests), full API Vitest PASS in one-worker fork mode, build PASS, lint
  PASS, go-live smoke PASS (`45` API tests / `18` Web tests), guardrails PASS,
  docs parity PASS, i18n audit PASS (`0` findings), and diff check PASS.
  Protected production `AUD-19` remains blocked outside local module
  confidence.

- 2026-05-21 `REST-IMPLEMENTATION-SWEEP-2026-05-21` applies to
  `SOAR-DASHBOARD-001`, `SOAR-BOT-RUNTIME-001`,
  `SOAR-SUBSCRIPTIONS-ADMIN-001`, and `SOAR-OPERATIONS-001`: fixed confirmed
  local safety defects found by agent lanes. Dashboard Home LIVE manual
  order/cancel/close now require explicit confirmation before `riskAck: true`;
  Web runtime close/cancel service wrappers no longer default to risk ack; API
  LIVE manual runtime close fails closed without a trusted close reference
  price instead of using entry price; Admin Users role/plan mutations now
  require confirmation. Evidence: focused Web pack passed (`4` files / `14`
  tests), focused API pack passed (`4` files / `99` tests), API typecheck, and
  Web typecheck. Reports historical execution-mode snapshots remain a P2 data
  model follow-up rather than current verified report truth.

- 2026-05-21 `FRONTEND-ENGINE-UX-DCA-SWEEP-2026-05-21` applies to
  `SOAR-BACKTESTS-001`, `SOAR-DASHBOARD-001`, and `SOAR-BOT-RUNTIME-001`:
  fixed confirmed backtest replay parity drift where isolated replay and
  interleaved portfolio simulation could close by `TTP` while affordable
  profit-side DCA levels were still pending. Runtime/PAPER core already had the
  guard. Also reduced frontend runtime friction by preventing bot-monitoring
  aggregate first-open double-fetch, adding Dashboard Home auth-bootstrap
  render regression coverage, and making Reports tolerate one failed per-run
  report request. Evidence: focused API pack passed (`4` files / `99` tests),
  focused Web pack passed (`3` files / `22` tests), API typecheck, Web
  typecheck, and repository guardrails.

- 2026-05-20 `V1-PROTECTED-PREFLIGHT-DD1A1FAF-2026-05-20` applies to
  `SOAR-OPERATIONS-001`: production build-info matches deployed
  `dd1a1faf79f8ac3581ca0a8c983481a3e30327ac` and public API/Web smoke passes,
  but the current protected V1 release gate remains `BLOCKED`. The no-secret
  preflight reports missing `LIVEIMPORT_READBACK_*`, `ROLLBACK_GUARD_*`,
  `PROD_UI_AUDIT_*`, production DB restore context, and stale required
  protected release evidence for 2026-05-20. The paired protected-input sweep
  found `0` matching protected input names and printed no secret values. This
  is blocker classification only, not final release evidence. Current
  no-secret operator handoff:
  `history/releases/v1-operator-unblock-packet-dd1a1faf-2026-05-20.md`.
  Follow-up `V1-OPERATOR-UNBLOCK-PACKET-CHECK-COMMAND-2026-05-20` adds
  `ops:operator-unblock:check` and focused tests so this handoff remains
  machine-checkable while protected inputs are absent.
  Follow-up `V1-OPERATOR-UNBLOCK-TOOLING-INDEX-SYNC-2026-05-20` adds that
  validator to the reusable audit tooling index and `audit:manifest:verify`;
  this strengthens release handoff tooling but does not change the protected
  evidence blocker.
  Follow-up `V1-AGENT-BLOCKER-SWEEP-DD1A1FAF-2026-05-20` used two read-only
  subagent lanes plus a protected-input rerun to confirm there is no remaining
  meaningful non-secret deployment task; Operations remains blocked until
  approved protected inputs are provided.

- 2026-05-14 `POSTV1-STRATEGY-SNAPSHOT-HISTORY-2026-05-14` applies to
  `SOAR-BACKTESTS-001`, `SOAR-STRATEGIES-001`, and `SOAR-MARKETS-001`: new
  backtest runs now persist immutable creation-time strategy and
  market-universe snapshots in `seedConfig.contextSnapshot`; backtest list,
  timeline, and replay evaluation prefer snapshot strategy truth before
  mutable strategy records; strategy deletion and market-universe deletion now
  fail closed with `409` while owned backtest history references those records.
  Focused API e2e passed for backtests, strategies, and markets (`44/44`).
  Bot history/versioned bot context and per-symbol best-parameter comparison
  remain separate follow-up slices.
- 2026-05-24 `ARCH-GRAPH-API-SUPPORT-ROUTES-BACKFILL-2026-05-24` applies to
  architecture evidence graph confidence: root/dashboard/admin API router
  composition plus icons, market-stream, profile basic/security, and upload
  support routes now have graph nodes, typed route rows, tests, docs, relations,
  and `CHAIN-API-SUPPORT-ROUTES`. Proof: graph generation passed with `461`
  nodes, `559` relations, and `20` chains; drift audit passed with `apiRoutes`
  at `22/22`, total coverage `425/796`, and `371` remaining gaps. This is
  graph/documentation proof only, not a fresh runtime journey proof.
- 2026-05-24 `ARCH-GRAPH-RUNTIME-SUPPORT-SERVICES-BACKFILL-2026-05-24`
  applies to architecture evidence graph confidence for bot/runtime/engine
  internals: ownership, projections, portfolio history, DCA visibility, market
  truth, signal display, paper runtime, pre-trade risk, rule evaluation,
  focused tests, and docs now have graph records and
  `CHAIN-RUNTIME-SUPPORT-SERVICES`. Proof: graph generation passed with `500`
  nodes, `577` relations, and `21` chains; drift audit passed with `466/796`
  covered and `330` remaining gaps. This is graph/documentation proof only,
  not a fresh runtime journey or protected LIVE proof.
- 2026-05-24 `ARCH-GRAPH-API-PLATFORM-SAFETY-BACKFILL-2026-05-24` applies to
  architecture evidence graph confidence for API platform safety: runtime
  config, critical secrets readiness, proxy trust, auth/rate-limit/origin/
  ops-network/request-logger middleware, shared errors/logger/symbol utilities,
  focused tests, docs, and `CHAIN-API-PLATFORM-SAFETY` now have graph records.
  Proof: graph generation passed with `520` nodes, `597` relations, and `22`
  chains; drift audit passed with `478/796` covered and `318` remaining gaps.
  This is graph/documentation proof only, not a fresh adversarial security
  review.
- 2026-05-24 `ARCH-GRAPH-WEB-RUNTIME-SURFACES-BACKFILL-2026-05-24` applies
  to architecture evidence graph confidence for Dashboard Home runtime and
  Bots monitoring surfaces: runtime sidebar/onboarding/signals/helpers,
  monitoring tabs/sections/future signals/protection/attribution/portfolio
  surfaces, tests, docs, and runtime API service links now have graph records
  and `CHAIN-WEB-RUNTIME-SURFACES`. Proof: graph generation passed with `543`
  nodes, `624` relations, and `23` chains; drift audit passed with `510/796`
  covered and `286` remaining gaps. This is graph/documentation proof only,
  not a fresh browser journey proof.
- 2026-05-24 `ARCH-GRAPH-AUTH-SESSION-DEEP-BACKFILL-2026-05-24` applies to
  architecture evidence graph confidence for Auth Session: public auth pages,
  login/register forms, password visibility, hooks, Web auth service,
  AuthContext, API auth routes, controller, service, cookie/JWT/errors/types,
  User model, tests, docs, and `CHAIN-AUTH-SESSION-DEEP` now have graph
  records. Proof: graph generation passed with `573` nodes, `659` relations,
  and `24` chains; drift audit passed with `534/796` covered and `262`
  remaining gaps. This is graph/documentation proof only, not fresh production
  auth browser proof.
- 2026-05-24 `ARCH-GRAPH-FULL-DRIFT-CLOSURE-2026-05-24` applies to
  architecture evidence graph confidence repository-wide for the current
  representative inventory: engine runtime core, market data/stream adapters,
  residual Web/API evidence, API infrastructure residual tests, module docs,
  and architecture governance/contract docs now have graph records. Proof:
  graph generation passed with `635` nodes, `781` relations, and `26` chains;
  drift audit passed with `796/796` covered and `0` remaining gaps. This is
  graph/documentation proof only, not fresh runtime journey, protected
  production, external security, or live exchange-side mutation proof.
- 2026-05-24 `LOCAL-DOCKER-COOLIFY-PARITY-2026-05-24` applies to
  `SOAR-OPERATIONS-001`: local Docker app startup now mirrors the Coolify
  split-service topology through root `docker:app:*` scripts that reuse
  `docker-compose.vps.yml`, with `.env.docker.example` as the local-only env
  template. Proof: compose config rendered API, Web, four workers, Postgres,
  and Redis; Docker build passed for API/Web/four worker images; a short local
  container run returned API `/health` `200`, API `/ready` `200`, and Web `/`
  `200`; guardrails and strict graph drift passed. This improves local/VPS
  parity but does not replace protected production evidence or LIVE mutation
  approval.
- 2026-05-25 `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25` applies to
  `SOAR-OPERATIONS-001` and `SOAR-WORKERS-001`: one-stack Coolify deployment
  topology is implemented locally for API, Web, and four split workers while
  keeping existing production Postgres/Redis external. Proof:
  `docker:coolify:config`, `docker:coolify:shared-api:config`,
  `ops:coolify-stack:env-check:test`, `ops:coolify-stack:env-check:example`,
  expected strict placeholder failure, architecture graph generation, strict
  graph drift `806/806`, and `quality:guardrails` passed. The shared-API-image
  variant is second-stage only after first-stack production proof. Confidence
  remains `PARTIAL/BLOCKED` for
  production because Coolify/VPS HTTPS reachability timed out and the parallel
  stack has not yet been deployed or smoke-tested.
- 2026-05-24 `PROD-UI-LEGACY-DASHBOARD-REDIRECTS-2026-05-24` applies to
  `SOAR-UX-A11Y-MOBILE-001`, `SOAR-DASHBOARD-001`, and `SOAR-OPERATIONS-001`:
  production UI clickthrough exposed three removed legacy dashboard routes
  returning `404`; Web middleware now redirects them to canonical protected
  surfaces. Local proof passed focused middleware tests, Web typecheck, Web
  lint, full Web tests, guardrails, strict graph drift, and diff check. Commit
  `0b7eb4c6` is deployed; public smoke and production UI clickthrough pass on
  that SHA. Security/exchange proof remains partial only for protected ops
  readiness auth, while app-auth exchange/security checks pass.
- 2026-06-04 `LUC-1946-RATE-LIMIT-REDIS-LOGGER-2026-06-04` applies to
  `SOAR-SECURITY-PRIVACY-001` / `SOAR-MIDDLEWARE-RATE-LIMIT`: rate-limit Redis
  client `error` events now use the existing redacted module logger instead of
  raw `console.error`, preserving production fail-closed behavior. Focused
  proof passed `pnpm --filter api exec vitest run src/middleware/rateLimit.test.ts`
  (`1` file / `7` tests), and a targeted grep found no remaining raw
  `Redis rate-limit client error` console path in the touched middleware files.
  Full API typecheck is still blocked by unrelated existing test typing errors
  in positions orphan-repair and workers readiness tests.
- 2026-06-04 `LUC-1945-ADVERSARIAL-API-ASSISTANT-REGRESSION-PROOF-2026-06-04`
  applies to `SOAR-SECURITY-PRIVACY-001`, `SOAR-FEATURE-API-PLATFORM-SAFETY`,
  `SOAR-FEATURE-AUTH-SESSION`, and `SOAR-FEATURE-AI-ASSISTANT-FOUNDATION`:
  added repeatable local adversarial regression command
  `pnpm run test:adversarial:api-assistant`. Proof passed (`8` files / `29`
  tests) across rate-limit fail-closed/redacted logging, trusted-origin
  cookie write guard, JWT/session candidate rejection, assistant protocol
  scenarios, assistant fail-closed/circuit/metadata sanitization, dry-run
  `LIVE` schema rejection, and default LIVE assistant hot-path fail-closed
  behavior. This improves local regression confidence only; protected smoke,
  DB-backed auth route e2e, production account proof, and LIVE hot-path
  assistant parity remain outside this checkpoint unless separately approved.
- 2026-06-05 `LUC-2107-ROUTE-API-MATRIX-GUARDRAIL-2026-06-05` applies to
  architecture/docs drift confidence for Web route and API endpoint coverage:
  added repeatable generated guardrail command
  `pnpm run docs:parity:route-api-matrix` plus focused tests. Proof passed:
  checker tests (`5/5`), live parity (`37` Web routes / `109` API endpoints /
  `0` gaps), docs parity, graph generate (`649` nodes / `842` relations /
  `27` chains), strict graph drift (`822/822`), and `quality:guardrails`.
  This is route/API inventory documentation coverage proof only; semantic DTO
  and response-body parity remain outside this checkpoint.

## Maintenance Rules

- Update this file when a feature ships, a bug is fixed, a regression appears,
  architecture changes, validation proves a journey, or a module is deferred.
- Prefer verification tasks before fix tasks when the only problem is missing
  evidence.
- Mark a journey `VERIFIED` only when evidence is current and reproducible.
- Mark a journey `BROKEN` when a real user journey fails, even if related tests
  pass.
- Link evidence to test names, commands, screenshots, smoke notes, commits, or
  task IDs. Chat-only evidence is not enough.

## 2026-06-05 LUC-2304 Web Runtime Image Start Wrapper

- `LUC-2304-WEB-RUNTIME-WRAPPER-2026-06-05` applies to
  `SOAR-OPERATIONS-001` / Web production runtime image confidence. The
  production crash root cause from [LUC-2297](/LUC/issues/LUC-2297) was a
  runtime-image packaging drift: `apps/web/package.json` starts through
  `scripts/runWebNextProductionCommand.mjs`, but `apps/web/Dockerfile` did not
  copy that repo-root wrapper into the runtime stage. Local repair now copies
  `/app/scripts/runWebNextProductionCommand.mjs` into the Web runtime image and
  adds a repository guardrail for the package/Dockerfile contract. Proof:
  `node --test scripts\repoGuardrails.test.mjs` PASS (`11/11`);
  `pnpm --filter web run build` PASS; local wrapper start served `/` `200` and
  `/api/build-info` `200` on port `32104`. Docker image build remains
  environment-blocked in this runner because Docker Desktop is unavailable.
  Production Web recovery remains pending separate source-control closure/push
  and Ops release mutation proof. Evidence:
  `history/evidence/luc-2304-web-runtime-start-wrapper-fix-2026-06-05.md`.

## 2026-06-06 LUC-2366 Protected Runtime Worker SLO Proof

- `LUC-2366-PROTECTED-RUNTIME-WORKER-SLO-2026-06-06` applies to
  `SOAR-OPERATIONS-001`, `SOAR-WORKERS-001`, and Bot Runtime protected
  production confidence.
- Confidence remains `BLOCKED / NO-GO`: public API/Web smoke is green, but
  production build-info still serves `a70d7881b69e605c537af5f81cbeb74dc81e9329`
  instead of candidate `de3db789177cd497447343395d335fca6a84444c`, protected
  runtime freshness fails closed with HTTP `401`, and strict RC Gate 2 evidence
  is `OPEN`.
- Protected input readiness is only `PARTIAL` because `PROD_UI_AUDIT_*` names
  are present while the runtime/rollback/DB/RC/Gate families required for this
  proof path are missing.
- Evidence:
  `history/tasks/luc-2366-refresh-protected-runtime-worker-slo-proof-de3db789-2026-06-06-task.md`,
  `history/evidence/luc-2366-v1-preflight-de3db789-2026-06-06.md`,
  `history/evidence/luc-2366-protected-input-readiness-de3db789-2026-06-06.md`,
  `history/artifacts/luc-2366-rc-gate-evidence-check-de3db789-2026-06-06.json`.

## 2026-06-06 LUC-2456 Regression Evidence Sweep

- `LUC-2456-REGRESSION-EVIDENCE-SWEEP-2026-06-06` applies to
  `SOAR-OPERATIONS-001`, architecture/docs parity confidence, and Web
  go-live regression confidence.
- Confidence is `PARTIALLY_VERIFIED`: local guardrails, docs parity, strict
  architecture drift, focused Web go-live tests, and Coolify env checker tests
  passed. Direct public API/Web probes also passed for current SHA
  `56d8d440bfe0fd9ee692e9f669e35414d85d2493`, and unauthenticated worker
  readiness returned `401` fail-closed.
- Residual regression: canonical `ops:deploy:smoke --no-workers` failed twice
  with `This operation was aborted` on different public endpoints while direct
  probes passed. Treat this as evidence-tooling instability until the Test
  Automation follow-up [LUC-2475](/LUC/issues/LUC-2475) proves or fixes the
  root cause.
- Evidence:
  `history/evidence/luc-2456-regression-evidence-sweep-2026-06-06.md`,
  `history/tasks/luc-2456-regression-evidence-sweep-2026-06-06-task.md`.
## 2026-06-06 LUC-2499 Operations Deploy Health Delta

- Module row: `SOAR-OPERATIONS-001`.
- Status delta: `PARTIAL` remains appropriate. Public production API/Web health
  is verified for pushed SHA `56d8d440bfe0fd9ee692e9f669e35414d85d2493`, and
  Coolify topology readback is verified, but Web deploy metadata/log
  correlation is incomplete and protected worker/dashboard/account/SLO/
  rollback/live runtime proof remains outside this sweep.
- Evidence:
  `history/evidence/luc-2499-coolify-production-deploy-health-sweep-2026-06-06.md`;
  `history/tasks/luc-2499-coolify-production-deploy-health-sweep-2026-06-06-task.md`.
- Next proof/fix: read-only child diagnosis for `soar-web` deploy history and
  Server Action mismatch logs; request explicit production mutation approval
  only if that diagnosis identifies a required redeploy/restart/rollback.

## 2026-06-06 LUC-2540 Route Traceability Parity Audit

- Module row: architecture/docs parity confidence.
- Status delta: `VERIFIED` for route traceability guardrail coverage. The
  route/API matrix checker now verifies architecture-doc parity from
  `dashboard-route-map.md` to `traceability-matrix.md` in addition to generated
  Web/API inventory coverage.
- Evidence:
  `history/tasks/luc-2540-route-traceability-parity-audit-2026-06-06-task.md`.
- Validation:
  `node --test scripts/checkRouteApiMatrixParity.test.mjs` PASS (`6/6`);
  `pnpm run docs:parity:route-api-matrix` PASS (`39` Web routes, `109` API
  endpoints, `0` gaps); `pnpm run docs:parity:check` PASS (`22/22` API,
  `16/16` Web, `39/39` routes).
  No runtime, deploy, protected-smoke, account, secret, exchange, or
  live-trading mutation occurred.
## 2026-06-06 LUC-2578 Position Reconciliation Helper Test Links

- Module row: positions reconciliation local proof and architecture/docs parity
  confidence.
- Status delta: `VERIFIED_LOCAL` for the assigned helper-link repair. Added
  focused non-DB backend tests for live position reconciliation helper
  behavior and scanner-readable priority test links for
  `livePositionReconciliation.helpers.ts`, `livePositionReconciliation.history.ts`,
  and `positionCloseAttribution.ts`.
- Evidence:
  `history/tasks/luc-2578-position-reconciliation-helper-missing-test-links-2026-06-06-task.md`.
- Validation:
  focused helper tests PASS (`9/9`); API typecheck PASS; architecture
  awareness refresh PASS (`14710` entities, `23376` relations, actionable
  missing-test rows `736`); `pnpm run architecture:graph:generate` PASS
  (`653` nodes, `842` relations, `27` chains).
- Residual risk:
  production/LIVE readback remains outside this local proof. Strict graph drift
  still fails on unrelated pre-existing worker test coverage
  (`apps/api/src/workers/execution.worker.test.ts`,
  `apps/api/src/workers/workerBootstrap.test.ts`).

## 2026-06-07 LUC-2607 Web Theme And DataTable Test Links

- Module row: Web shared UI/theme local proof and architecture/docs parity
  confidence.
- Status delta: `VERIFIED_LOCAL` for the assigned Web theme/bootstrap and
  DataTable helper-link repair. Added focused local Web tests for ThemeSwitcher
  persistence/system/bootstrap behavior and DataTable sort/filter/search/page
  input behavior, plus scanner-readable priority test links for the assigned
  anchors.
- Evidence:
  `history/tasks/luc-2607-web-theme-datatable-missing-test-links-2026-06-07-task.md`.
- Validation:
  focused Web tests PASS (`2` files / `17` tests); architecture graph
  generation PASS (`653` nodes / `842` relations / `27` chains); repository
  guardrails PASS.
- Residual risk:
  architecture-awareness refresh was not run because
  `scripts/build-architecture-awareness-index.mjs` is absent in this checkout;
  production/browser/deploy proof remains outside this local traceability
  repair.

## 2026-06-07 LUC-2624 Web UI/Form/Layout Test Links

- Module row: Web shared UI/form/layout local proof and architecture/docs parity
  confidence.
- Status delta: `VERIFIED_LOCAL` for the assigned refreshed Web UI/form/layout
  helper-link repair. Added focused local Web coverage for `DataTable`
  page-size reset behavior and scanner-readable priority test links for
  `handlePageSizeChange`, `TextareaField`, `ToggleField`, form shell/layout
  primitives, `useDetailsDropdown`, dashboard layout helpers, and public layout
  helpers.
- Evidence:
  `history/tasks/luc-2624-web-ui-form-layout-missing-test-links-2026-06-07-task.md`.
- Validation:
  focused Web tests PASS (`9` files / `49` tests); architecture graph
  generation PASS (`653` nodes / `842` relations / `27` chains); repository
  guardrails PASS.
- Residual risk:
  architecture-awareness refresh was not run because
  `scripts/build-architecture-awareness-index.mjs` and
  `scripts/generateArchitectureAwarenessIndex.mjs` are absent in this checkout;
  production/browser/deploy proof remains outside this local traceability
  repair.
## 2026-06-07 LUC-2733 Protected Input Readiness Checker Test Links

- Module row: release audit tooling / protected input readiness local proof and
  architecture traceability confidence.
- Status delta: `VERIFIED_LOCAL` for the assigned checker-link repair. Existing
  checker helpers are exportable for focused proof, local tests cover
  `main`, `printUsage`, and `writeOutput`, and
  `docs/architecture/relations/priority-test-links.csv` has direct LUC-2733
  rows for the targeted anchors.
- Evidence:
  `history/tasks/luc-2733-protected-input-readiness-checker-missing-test-links-2026-06-07-task.md`.
- Validation:
  `node --check scripts/checkProtectedInputReadiness.mjs` PASS;
  `node --test scripts/checkProtectedInputReadiness.test.mjs` PASS (`6/6`);
  LUC-2733 relation readback PASS; `pnpm run architecture:graph:generate`
  PASS (`653` nodes / `842` relations / `27` chains);
  `pnpm run quality:guardrails` PASS.
- Residual risk:
  production protected input readiness and release-gate proof remain outside
  this local relation/test repair.

## 2026-06-07 LUC-2734 Security And Account-Access Gate Sweep

- Module row: release security/account-access gate, protected input readiness,
  API-key secrecy, entitlements, and exchange/live boundary confidence.
- Status delta: `BLOCKED / PARTIALLY_VERIFIED`. Public build-info readback
  still targets deployed `56d8d440bfe0fd9ee692e9f669e35414d85d2493` on
  `main`; no-secret protected input readiness remains `PARTIAL/NO-GO` with
  only UI audit input families present by name. Focused local security tests
  for redaction, encryption readiness, entitlement live-trading fail-closed
  behavior, and exchange capability boundaries passed.
- Evidence:
  `history/tasks/luc-2734-security-account-access-gate-sweep-2026-06-07-task.md`;
  `history/evidence/luc-2734-security-account-access-gate-readiness-56d8d440-2026-06-07.md`.
- Validation:
  protected input readiness PASS with status `PARTIAL/NO-GO`;
  API security/crypto/critical-secret tests PASS (`18/18`);
  subscription/exchange-boundary tests PASS (`17/17`).
- Residual risk:
  protected release proof remains blocked until `LIVEIMPORT_READBACK_*`,
  `ROLLBACK_GUARD_*`, `SOAR_PROD_*`, DB-check, `RC_*`, and `GATE*` families
  are bound by an approved Security/Ops secret owner. No production account,
  API-key, subscription/payment, exchange, DB, rollback, deploy, or
  live-trading mutation occurred.

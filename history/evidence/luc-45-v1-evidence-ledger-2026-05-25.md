# LUC-45 V1 Evidence Ledger

Last updated: 2026-05-25

| Evidence family | Current state | Freshness | Owner lane | Unblock condition |
| --- | --- | --- | --- | --- |
| Public deploy smoke (`/health`, `/ready`, Web `/`, build-info) | partially_verified | 2026-05-25 | LUC-47 (implements `LUC-45-B`) | Refresh on new candidate SHA after parallel-stack deploy |
| Runtime aggregate stability under load/degraded sessions | blocked | 2026-05-25 | LUC-46 (implements `LUC-45-A`) | Pass focused aggregate pack and confirm API smoke without regressions |
| Backtests API smoke critical path | blocked | 2026-05-25 | LUC-46 (implements `LUC-45-A`) | Reproduce and close `backtests.e2e` failures from baseline |
| Parallel one-stack Coolify temp-domain proof | blocked | 2026-05-25 | LUC-47 (implements `LUC-45-B`) | Successful temp-domain deploy with API/Web/build-info/worker stability evidence |
| Repeatable QA smoke-e2e (`web,api,backtests`) | partially_verified | 2026-05-25 | LUC-45-C | Run full repeatable suite and publish PASS/FAIL artifacts |
| Protected auth/session/browser and exchange boundary read-only checks | partially_verified | 2026-05-25 | LUC-45-D | Re-run candidate-bound proof with explicit fail-closed outcomes |
| Source-of-truth parity (board/state/ledgers) | partially_verified | 2026-05-25 | LUC-45-E | Sync requirements/risk/module-confidence with lane outcomes |
| Final V1 controller disposition | blocked | 2026-05-25 | Coordinator | All required lanes integrated with residual risks explicit |

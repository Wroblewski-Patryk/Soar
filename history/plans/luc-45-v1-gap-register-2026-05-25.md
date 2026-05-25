# LUC-45 V1 Gap Register

Last updated: 2026-05-25

| Gap ID | Owner lane | Layer | Severity | Affected workflow | Expected fix | Verification contract | Release impact | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-L45-001 | LUC-46 (implements LUC-45-A) | Backend/runtime | critical | Runtime monitoring aggregate and API stability | Close runtime aggregate instability path and backtests API smoke blocker | Focused runtime aggregate tests + `test:go-live:api` critical subset | Blocks V1 release confidence and RC/SLO gate | open | `LUC-41`, `LUC-18`, `PROD-RUNTIME-AGGREGATE-SLO-BLOCKER-2026-05-25` |
| GAP-L45-002 | LUC-47 (implements LUC-45-B) | Ops/release | critical | Coolify one-stack rollout and temp-domain proof | Redeploy parallel stack with corrected liveness and prove candidate stability | Temp-domain API/Web/build-info/worker smoke + rollback note | Blocks deploy topology closure and safe cutover | open | `COOLIFY-SERVICE-STACK-MIGRATION-2026-05-25` |
| GAP-L45-003 | LUC-45-C | QA/automation | high | Deterministic smoke-e2e matrix | Run repeatable web/api/backtests checks and produce dated artifacts | `qa:smoke-e2e:repeatable -- --checks web,api,backtests` | Blocks repeatable proof baseline for V1 closure | open | `LUC-43`, `LUC-18` |
| GAP-L45-004 | LUC-45-D | Security | high | Protected auth/session/exchange fail-closed evidence | Produce read-only boundary proof on candidate SHA | Protected proof packet with no secret leakage and no LIVE mutation | Blocks security gate for readiness claim | open | Current security proof docs and protected runbooks |
| GAP-L45-005 | LUC-45-E | Docs/state | high | Source-of-truth parity across ledgers and board | Sync module/requirement/risk/project-state from lane outputs | Parity check across state files and linked evidence | Blocks truthful `done`/`blocked` controller decision | open | `.agents/state/*`, `.codex/context/*` |

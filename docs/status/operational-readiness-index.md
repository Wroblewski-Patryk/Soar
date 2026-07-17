# Operational Readiness Index

Generated: 2026-07-17T23:13:23.538Z
Project: Soar
Status: truth_incomplete

| Gate | Status | Required for |
| --- | --- | --- |
| architecture_exports | present | cross-layer ownership and dependency tracing |
| app_completion_index | present | user-flow works/fails/unknown classification |
| event_chain_index | covered | backend/frontend/worker impact analysis |
| runtime_error_index | critical_findings | agent-owned bug discovery and repair routing |
| app_completion_risk_index | gaps_indexed | user-facing flow verification across frontend, backend, tests, docs, auth/config, and browser proof |
| public_runtime_probe | failed | production parity with local behavior |

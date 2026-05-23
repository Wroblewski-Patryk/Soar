# V1 Rollback Proof (prod)

- Generated at (UTC): 2026-05-12T15:49:54.694Z
- Status: **FAIL**
- Command: `node scripts/evaluateRollbackGuard.mjs --base-url https://api.soar.luckysparrow.ch`
- Base URL: `https://api.soar.luckysparrow.ch`
- Rollback playbook: `docs/operations/deployment-rollback-playbook.md`
- Raw JSON: `history\artifacts\_artifacts-v1-rollback-proof-prod-2026-05-12T00-00-00-000Z.json`

## Contract Checks
- commandExitCodeZero: FAIL
- shouldRollbackFalse: FAIL
- noCriticalReasons: FAIL
- freshnessStatusPass: FAIL
- alertsClear: PASS

## Decision Summary
- shouldRollback: true
- reasons: runtime_freshness_endpoint_http_401, alerts_endpoint_http_401
- freshness status: n/a
- alerts count: 0

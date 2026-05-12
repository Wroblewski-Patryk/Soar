# V1 Rollback Proof (local)

- Generated at (UTC): 2026-05-12T06:54:12.475Z
- Status: **PASS**
- Command: `node scripts/evaluateRollbackGuard.mjs --base-url http://localhost:3001`
- Base URL: `http://localhost:3001`
- Rollback playbook: `docs/operations/deployment-rollback-playbook.md`
- Raw JSON: `docs\operations\_artifacts-v1-rollback-proof-local-2026-05-12T00-00-00-000Z.json`

## Contract Checks
- commandExitCodeZero: PASS
- shouldRollbackFalse: PASS
- noCriticalReasons: PASS
- freshnessStatusPass: PASS
- alertsClear: PASS

## Decision Summary
- shouldRollback: false
- reasons: none
- freshness status: PASS
- alerts count: 0

# V1 Rollback Proof (stage)

- Generated at (UTC): 2026-04-22T20:13:00.825Z
- Status: **PASS**
- Command: `node scripts/evaluateRollbackGuard.mjs --base-url https://stage-api.soar.luckysparrow.ch --auth-email stage-ops-admin@luckysparrow.ch --auth-password <redacted> --ops-auth-header-name X-Forwarded-For --ops-auth-header-value 31.10.146.162`
- Base URL: `https://stage-api.soar.luckysparrow.ch`
- Rollback playbook: `docs/operations/deployment-rollback-playbook.md`
- Raw JSON: `history\artifacts\_artifacts-v1-rollback-proof-stage-2026-04-22T20-13-00-826Z.json`

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

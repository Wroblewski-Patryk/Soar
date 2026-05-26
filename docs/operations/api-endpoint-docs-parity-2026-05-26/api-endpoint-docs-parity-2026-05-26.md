# API Endpoint Docs Parity - 2026-05-26

Status: PASS

Scope: endpoint-level API docs parity derived from Express router method calls and `docs/modules/api-*.md` route mentions.

- Endpoints: 109
- Documented: 109
- Gaps: 0
- Modules: 16

## Module Summary

| Module | Total | Documented | Gaps |
| --- | ---: | ---: | ---: |
| admin | 4 | 4 | 0 |
| auth | 4 | 4 | 0 |
| backtests | 7 | 7 | 0 |
| bots | 31 | 31 | 0 |
| icons | 1 | 1 | 0 |
| logs | 1 | 1 | 0 |
| market-stream | 1 | 1 | 0 |
| markets | 6 | 6 | 0 |
| orders | 6 | 6 | 0 |
| positions | 9 | 9 | 0 |
| profile | 8 | 8 | 0 |
| reports | 1 | 1 | 0 |
| root | 11 | 11 | 0 |
| strategies | 7 | 7 | 0 |
| upload | 1 | 1 | 0 |
| wallets | 11 | 11 | 0 |

## Gaps

No endpoint documentation gaps detected.

## Explicit Limitations

- This audit checks route mention parity, not full semantic accuracy of every DTO or response body.
- Dynamic route variants are matched conservatively against literal route strings and `*`/`:id` style mentions.
- Root health/ops endpoints are included as `root` and map to `docs/modules/api-root.md`.

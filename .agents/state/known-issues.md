# Known Issues

Last updated: 2026-05-07

## Active Issues

No new product/runtime defect was introduced by the agent operating system
slice.

## Known Environment Pitfalls

- `rg` can fail on this Windows workstation with `Odmowa dostepu`; use
  PowerShell `Get-ChildItem` and `Select-String` as fallback.
- Browser plugin validation can fail if it resolves system Node `v22.13.0`
  instead of the bundled Codex runtime. See
  `.codex/context/LEARNING_JOURNAL.md`.
- DB-backed API packs that share cleanup tables should run sequentially when
  used as closure evidence.
- Local Prisma may have migration-history drift; inspect before treating it as
  a current repository regression.

## Product Risk Watchlist

- LIVE/PAPER runtime parity and dashboard truth remain the highest-risk areas.
- Backend/frontend runtime label and lifecycle mappings must stay centralized
  where shared semantics exist.
- Operator-visible UI should stay production-grade and avoid debug-looking
  badges or invented fallback truth.

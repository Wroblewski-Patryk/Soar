# LUC-86 Containment Dependency Handoff (2026-05-26)

## Board Containment Update
Per board comment `d4bdde39-a387-40bd-a59f-16c73a9afa56`, this issue is now
explicitly contained as `blocked` due to repeated non-live auto-reversion
(`todo -> in_progress` while live runs = 0).

## Dependency
- Unblock dependency: `LUC-85`
- Unblock owner: AI Agent Runtime Engineer
- Unblock action: deliver and verify invariant fix that prevents non-live
  auto-reversion.

## LUC-86 Scope While Blocked
Keep Soar production deploy health sweep in fail-closed hold.
No production mutation is allowed from this lane until dependency unblock is
confirmed.

## Last Known Runtime/Deploy Snapshot
- API `/health`: `200`
- API `/ready`: `200`
- Web `/api/build-info`: `200`
- SHA: `4c16305c97566b7680f4feb041601af2af0a0d31`

## Disposition
`blocked` (dependency-blocked by `LUC-85`)

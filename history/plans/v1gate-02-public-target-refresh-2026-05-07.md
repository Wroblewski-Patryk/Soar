# V1GATE-02 Public Target Refresh

Date: 2026-05-07
Operator: Codex
Branch: `codex/v1-app-function-check`
Local HEAD: `664e2748446610d7899350c8a37214c7a6d1f016`
Production SHA: `6a7c9889d24a55c870b32aa10cb284ede6db1c59`

## Purpose

Refresh public production and stage target truth after the PMPLC hardening merge
reached `main`, so V1 status is based on current deploy evidence rather than
stale blocker notes.

## Public Smoke Results

| Target | URL | Result | Evidence |
| --- | --- | --- | --- |
| Production API health | `https://api.soar.luckysparrow.ch/health` | PASS `200`, 225 ms | `{"status":"ok","service":"api"}` |
| Production API ready | `https://api.soar.luckysparrow.ch/ready` | PASS `200`, 32 ms | `{"status":"ready","service":"api"}` |
| Production web root | `https://soar.luckysparrow.ch/` | PASS `200`, 175 ms | Next.js HTML returned |
| Production auth page | `https://soar.luckysparrow.ch/auth/login` | PASS `200`, 356 ms | Login HTML returned |
| Production protected redirect | `https://soar.luckysparrow.ch/dashboard` | PASS `307 -> /auth/login -> 200` | Unauthenticated dashboard redirects fail closed |
| Production build info | `https://soar.luckysparrow.ch/api/build-info` | PASS `200`, 32 ms | `gitSha=6a7c9889d24a55c870b32aa10cb284ede6db1c59`, `gitRef=main` |
| Legacy login path | `https://soar.luckysparrow.ch/login` | EXPECTED FAIL `404`, 26 ms | Canonical route is `/auth/login` |
| Stage API health | `https://stage-api.soar.luckysparrow.ch/health` | FAIL `503`, 132 ms | Stage API unavailable |
| Stage API ready | `https://stage-api.soar.luckysparrow.ch/ready` | FAIL `503`, 20 ms | Stage API unavailable |
| Stage web root | `https://stage.soar.luckysparrow.ch/` | FAIL `503`, 309 ms | Stage web unavailable |
| Stage build info | `https://stage.soar.luckysparrow.ch/api/build-info` | FAIL `503`, 18 ms | Stage web unavailable |
| Alternate stage web root | `https://stage-soar.luckysparrow.ch/` | FAIL DNS, 51 ms | Host not resolvable |

## Git Freshness

- `origin/main`: `6a7c9889d24a55c870b32aa10cb284ede6db1c59`.
- Production build-info matches `origin/main`.
- Production SHA is an ancestor of local `HEAD`.
- Local branch has the docs-only APPCHECK commit after `origin/main`; that
  commit is not required for runtime production freshness.

## Interpretation

Production public baseline is healthy and current with `main` for public API,
web, build-info, and unauthenticated protected-route redirect behavior. This
does not close protected, authenticated, worker, restore-drill, manual matrix,
or live-money proof rows.

Stage remains unavailable. `OPS-STAGE-001` is still a V1 blocker unless the
stage environment is restored/redeployed or a release-owner waiver is recorded.

The legacy `/login` path is not a product route. The canonical smoke target is
`/auth/login`, and the post-deploy smoke checklist was corrected in this task.

## Remaining V1 Gate Status

- `OPS-RESTORE-001`: still BLOCKED outside this public smoke; requires the real
  VPS/Coolify DB restore drill context or explicit production DB container
  settings.
- `OPS-STAGE-001`: still BLOCKED; public stage targets return `503` or DNS
  failure.
- `OPS-GO-NOGO-001`: still BLOCKED; final gate needs restore, stage/waiver,
  sign-off, and protected/manual matrix evidence.

## Commands

Public target smoke was run with `Invoke-WebRequest` against production and
stage URLs listed above. Protected dashboard redirect was confirmed with:

```powershell
curl.exe -I -L --max-time 25 https://soar.luckysparrow.ch/dashboard
```

Git freshness was confirmed with:

```powershell
git rev-parse HEAD
git rev-parse origin/main
git merge-base --is-ancestor 6a7c9889d24a55c870b32aa10cb284ede6db1c59 HEAD
git merge-base --is-ancestor 6a7c9889d24a55c870b32aa10cb284ede6db1c59 origin/main
```

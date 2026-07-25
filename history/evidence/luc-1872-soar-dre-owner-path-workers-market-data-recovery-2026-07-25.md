# LUC-1872 Evidence

Date: 2026-07-25
Issue: `LUC-1872`
Scope: `workers-market-data` only
Mode: least-privilege owner-path write attempt plus bounded readback

## Current state before owner-path write

- Current issue scope:
  `[Soar][DRE Owner Path] Execute least-privilege Coolify write for workers-market-data recovery`.
- Direct Coolify readback before mutation showed:
  - `workers-market-data -> exited:unhealthy`
  - `last_online_at=2026-07-25 18:17:37`
  - `restart_count=0`
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
- Public Soar remained healthy before the write attempt:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`

## Targeted owner-path action

- Target resource:
  project `Soar`, production environment, application `workers-market-data`.
- Mutating action:
  `POST /api/v1/applications/{workers-market-data}/start`
- Result:
  - HTTP `403 Forbidden`
  - response body:
    `{"message":"Missing required permissions: deploy"}`

## Outcome interpretation

- This lane did execute the routed least-privilege owner path.
- The owner path is still not deploy-capable for the targeted application.
- Because the issue explicitly forbids retrying the same denied operation with
  the same non-write-capable path, no second mutation was attempted.

## Fresh readback after denial

- Refreshed public health still showed:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`
- Refreshed `pnpm run softwarehouse:coolify-reconciler` still showed:
  - `workers-market-data -> exited:unhealthy`
  - all other canonical Soar resources healthy or `running:unknown`
- Refreshed `pnpm run softwarehouse:soar-acceptance-ledger` still showed:
  - `coolify_resources_reconciled -> blocker`
  - reason:
    `Coolify resource inventory found unhealthy resources: workers-market-data:exited:unhealthy.`

## Blocker

- First-class blocker:
  the routed least-privilege owner path still lacks the Coolify `deploy`
  permission required for the exact targeted `start` action on
  `workers-market-data`.
- Named unblock owner:
  Coolify credential owner / Ops Release Lead.
- Exact unblock action:
  either grant `deploy` to this exact mutation path or have an approved owner
  perform the targeted `workers-market-data` start/restart or bounded env
  repair outside this lane, then rerun:
  - `pnpm run softwarehouse:coolify-reconciler`
  - `pnpm run softwarehouse:soar-acceptance-ledger`

## Conclusion

`LUC-1872` resolved the ambiguity left by `LUC-1868`: the problem is no longer
"some owner path may be needed" but specifically that the current routed owner
path still cannot perform deploy-capable writes for `workers-market-data`.
Production public health stayed green, no unrelated Soar resource was mutated,
and the remaining blocker is external to DRE execution.

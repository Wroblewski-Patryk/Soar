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

## Resume delta retry after owner-path wake

- Resume reason:
  `issue_blockers_resolved` for `LUC-1872`.
- Fresh owner-path context before retry:
  - `COOLIFY_SOAR_TEAM_ID` is now present in the runner env by name.
  - direct app readback still showed:
    - `workers-market-data -> exited:unhealthy`
    - `last_online_at=2026-07-25 18:17:37`
    - `restart_count=0`
    - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
  - related owner lane `LUC-1879` remained `BLOCKED`, not completed.
- One fresh targeted retry was executed against the current bound path:
  - `POST /api/v1/applications/{workers-market-data}/start`
  - result: `403 Forbidden`
  - response body:
    `{"message":"Missing required permissions: deploy"}`
- Post-retry polling for about one minute showed no runtime movement:
  - `workers-market-data` stayed `exited:unhealthy`
  - `last_online_at` stayed `2026-07-25 18:17:37`
  - `restart_count` stayed `0`
  - `git_commit_sha` stayed `ca712e98b70e157b643db4f57726a02821a140bc`
- Public Soar still remained healthy after the resumed retry:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`

## Blocker

- First-class blocker:
  the routed least-privilege owner path still lacks the Coolify `deploy`
  permission required for the exact targeted `start` action on
  `workers-market-data`.
- Current active blocker lane above DRE:
  [LUC-1879](/LUC/issues/LUC-1879) remains
  `BLOCKED / BOARD_OWNER_DECISION_REQUIRED / NO_DEPLOY_CAPABLE_OWNER_EVIDENCED`.
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
and the remaining blocker is external to DRE execution. The resume wake did
not materially change the mutation boundary: even after the fresh owner-path
retry, the exact same `deploy` permission denial remains in force.

## Final resolved state after upstream owner-path repair

- Upstream owner-path follow-up is now complete:
  [LUC-1879](/LUC/issues/LUC-1879) closed by integrating the exact child
  recovery proof from `LUC-1882`.
- Fresh direct app readback at the end of this lane showed:
  - `workers-market-data -> running:unknown`
  - `last_online_at=2026-07-25 21:35:36`
  - `restart_count=0`
  - `git_commit_sha=ca712e98b70e157b643db4f57726a02821a140bc`
- Fresh `pnpm run softwarehouse:coolify-reconciler` showed:
  - `8/8` Soar production resources reconciled
  - `workers-market-data -> running:unknown`
  - no unhealthy Coolify resource remained in the canonical Soar set
- Fresh public Soar reachability remained healthy:
  - `GET https://soar.luckysparrow.ch -> 200`
  - `GET https://api.soar.luckysparrow.ch/health -> 200`
  - `GET https://api.soar.luckysparrow.ch/ready -> 200`
- Fresh `pnpm run softwarehouse:soar-acceptance-ledger` no longer blocks on
  `coolify_resources_reconciled`; that check is now `pass`.
- The same acceptance-ledger run remains `overall=blocked` only because the
  Soar worktree is locally dirty from separate docs/state packets outside this
  DRE runtime lane.

## Final interpretation

`LUC-1872` is now complete. The exact `workers-market-data` owner-path problem
that DRE was asked to isolate is resolved, the worker is recovered in Coolify,
and the remaining acceptance-ledger blocker is a separate source-control
closure concern rather than a runtime recovery failure.

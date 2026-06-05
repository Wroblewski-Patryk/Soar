# LUC-2280 Controlled soar-web Restart Evidence

- Issue: LUC-2280
- Time window: 2026-06-05T20:40:35Z to 2026-06-05T20:43:50Z
- Operator: Ops Release Lead
- Target: Soar / production / `soar-web`
- Secret handling: no token, cookie, raw resource id, generated database
  suffix, or unredacted log value was printed or stored.

## Pre-State

Public smoke at `2026-06-05T20:40:35Z`:

- `https://api.soar.luckysparrow.ch/health` -> `200`
- `https://api.soar.luckysparrow.ch/ready` -> `200`
- `https://soar.luckysparrow.ch/` -> `503`
- `https://soar.luckysparrow.ch/api/build-info` -> `503`

Coolify read-only status at `2026-06-05T20:41:00Z`:

- resource name: `soar-web`
- status: `restarting:unknown`
- branch: `main`
- git commit projection: `HEAD`
- restart count: `54`
- last restart type: `crash`
- last restart at: `2026-06-05T20:36:37.000000Z`

## Action

One Coolify application restart endpoint call was made at
`2026-06-05T20:41:11Z`.

Result:

- `Deployment already queued for this commit.`

No second restart, deploy, rollback, force-start, env edit, database action,
team setting change, protected smoke, account action, or live-trading action
was performed.

## Post-State

Public smoke at `2026-06-05T20:42:10Z`:

- `https://api.soar.luckysparrow.ch/health` -> `200`
- `https://api.soar.luckysparrow.ch/ready` -> `200`
- `https://soar.luckysparrow.ch/` -> `503`
- `https://soar.luckysparrow.ch/api/build-info` -> `503`

Required smoke command:

```text
pnpm run ops:deploy:smoke -- --base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers
```

Result:

- PASS API `/health` -> `200`
- PASS API `/ready` -> `200`
- FAIL Web `/` -> `503`
- FAIL Web `/api/build-info` -> `503`

Coolify read-only status at `2026-06-05T20:42:39Z`:

- resource name: `soar-web`
- status: `restarting:unknown`
- branch: `main`
- git commit projection: `HEAD`
- restart count: `54`
- last restart type: `crash`
- last restart at: `2026-06-05T20:36:37.000000Z`

Deployment queue readback at `2026-06-05T20:43:50Z`:

- latest row: `queued`, commit `HEAD`, created `2026-06-05T20:33:16Z`
- next row: `queued`, commit `6e31d814046b640ad529d1cd57f968ba6f67b05e`,
  created `2026-06-05T20:08:51Z`
- prior finished row: commit `b894e5dd30614dfd2035e91e3d848c842d3ff380`

Application log endpoint readback failed with HTTP `400`; no unredacted logs
were printed.

## Disposition

LUC-2280 reached its stop condition. Production Web remains unavailable.
Follow-up issue LUC-2286 was created for the next release mutation permit.

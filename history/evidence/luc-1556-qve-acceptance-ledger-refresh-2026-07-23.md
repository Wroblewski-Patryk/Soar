# LUC-1556 QVE acceptance ledger refresh

Date: 2026-07-23

## Scope

Independent verification for the Redis recovery chain after the approved
`workers-execution` repair completed in `LUC-1706`.

## Fresh public probes

- `GET https://api.soar.luckysparrow.ch/health -> 200`
  - body timestamp: `2026-07-23T01:59:43.590Z`
- `GET https://api.soar.luckysparrow.ch/ready -> 200`
  - body: `{"status":"ready","service":"api"}`

Probe time:
- `2026-07-23T03:59:43.698+02:00`
- `2026-07-23T03:59:43.844+02:00`

## Accepted protected evidence consumed

Source issue:
- `LUC-1706` `done`

Accepted protected outcome from `LUC-1706` completion evidence:
- public API readiness returned `200`
- protected workers readiness returned `200`
- protected runtime freshness returned `200 PASS`
- Coolify queued the approved single start at `2026-07-23T01:49:56Z`
- workers-execution later projected `running:unknown` with `last_online_at 2026-07-23 01:51:51`
- monitoring showed a live `worker.execution` heartbeat event at `2026-07-23T01:52:04.358Z`

## Ledger conclusion

The acceptance ledger can be refreshed on the basis of:
- fresh public API readiness still healthy after the repair
- accepted protected proof that the execution worker recovered cleanly
- no production mutation performed in this QVE lane

The live worker is now healthy enough for the QVE verification lane to close.

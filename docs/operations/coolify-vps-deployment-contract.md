# Coolify VPS Deployment Contract

Last updated: 2026-06-04

This contract describes the current Soar production deployment target. Coolify
must be treated as a hierarchy:

`project -> production environment -> resources`

Do not treat a single legacy app id as the whole deployment.

## Deployment Target

- VPS provider: managed outside repository source truth.
- Coolify project or environment: Soar / production.
- Public domains: `https://soar.luckysparrow.ch`,
  `https://api.soar.luckysparrow.ch`.
- Private services: production PostgreSQL and Redis resources.

## Runtime Inventory

Source: read-only redacted Coolify API inventory captured in
`history/evidence/luc-1371-coolify-resource-inventory-2026-06-02.md` and
refreshed/reconciled for `LUC-1399`, `LUC-1402`, `LUC-1405`, `LUC-1408`,
`LUC-1412`, `LUC-1416`, and `LUC-1418`, then refreshed for `LUC-1422` and
`LUC-1434`, and reconciled again for `LUC-1444`, `LUC-1448`, `LUC-1455`,
`LUC-1460`, `LUC-1466`, `LUC-1467`, `LUC-1473`, `LUC-1476`, `LUC-1479`,
`LUC-1482`, `LUC-1485`, `LUC-1488`, `LUC-1497`, `LUC-1508`, `LUC-1515`,
`LUC-1519`, `LUC-1523`, `LUC-1526`, `LUC-1530`, `LUC-1534`, `LUC-1548`,
`LUC-1549`, `LUC-1552`, `LUC-1554`, `LUC-1565`, `LUC-1569`, `LUC-1575`,
`LUC-1579`, `LUC-1581`, `LUC-1584`, `LUC-1593`, `LUC-1599`, `LUC-1605`,
`LUC-1610` on 2026-06-02, and `LUC-1620` / `LUC-1624` / `LUC-1630` /
`LUC-1634` / `LUC-1641` / `LUC-1645` / `LUC-1651` / `LUC-1656` /
`LUC-1662` / `LUC-1666` / `LUC-1673` / `LUC-1696` / `LUC-1707` /
`LUC-1786` / `LUC-1790` / `LUC-1800` / `LUC-1822` / `LUC-1828` /
`LUC-1831` / `LUC-1843` on 2026-06-03, and `LUC-1850` / `LUC-1857` /
`LUC-1872` / `LUC-1875` / `LUC-1878` / `LUC-1885` / `LUC-1890` /
`LUC-1898` / `LUC-1901` / `LUC-1910` / `LUC-1916` / `LUC-1919` /
`LUC-1926` / `LUC-1933` / `LUC-1969` / `LUC-1973` / `LUC-1977` /
`LUC-1982` / `LUC-1987` / `LUC-1990` / `LUC-1993` / `LUC-1997` /
`LUC-2004`
on 2026-06-04.

Latest read-only access binding checkpoint: `LUC-2004` at
`2026-06-04T15:48:55Z`, refreshing the prior `LUC-1997` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `17` visible rows and was not used as
release authority. The project/environment
hierarchy remains the authoritative production status scope for this binding
proof.
Application rows report `running:unknown`; PostgreSQL reports
`running:healthy`; Redis reports `running:healthy` from production environment
readback. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
runner, but the selector readback is not an active blocker while current-team
and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-2004-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1997` at
`2026-06-04T14:46:54Z`, refreshing the prior `LUC-1993` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `17` visible rows and was not used as
release authority. The project/environment
hierarchy remains the authoritative production status scope for this binding
proof.
Application rows report `running:unknown`; PostgreSQL reports
`running:healthy`; Redis reports `running:healthy` from production environment
readback. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
runner, but the selector readback is not an active blocker while current-team
and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1997-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1993` at
`2026-06-04T14:16:42Z`, refreshing the prior `LUC-1990` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `1` visible row in this least-privilege
runner session and was not used as release authority. The project/environment
hierarchy remains the authoritative production status scope for this binding
proof.
Application rows report `running:unknown`; PostgreSQL reports
`running:healthy`; Redis reports `running:healthy` from production environment
readback. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
runner, but the selector readback is not an active blocker while current-team
and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1993-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1990` at
`2026-06-04T14:05:13Z`, refreshing the prior `LUC-1987` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `17` visible rows and was not used as
release authority. The project/environment hierarchy remains the authoritative
production status scope for this binding proof.
Application rows report `running:unknown`; PostgreSQL reports
`running:healthy`; Redis reports `running:healthy` from production environment
readback. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this
runner, but the selector readback is not an active blocker while current-team
and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1990-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1982` at
`2026-06-04T13:05:16Z`, refreshing the prior `LUC-1977` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `1` visible row in this least-privilege
runner session and was not used as release authority. The project/environment
hierarchy remains the authoritative production status scope for this binding
proof.
Application rows report `running:unknown`; PostgreSQL and Redis report
`running:healthy` from production environment readback. `COOLIFY_SOAR_TEAM_ID`
and `COOLIFY_TEAM_ID` remain absent in this runner, but the selector readback
is not an active blocker while current-team and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1982-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1977` at
`2026-06-04T12:19:30Z`, refreshing the prior `LUC-1973` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `17` visible rows. The
project/environment hierarchy remains the authoritative production status scope
for this binding proof.
Application rows report `running:unknown`; PostgreSQL and Redis report
`running:healthy` from production environment readback. `COOLIFY_SOAR_TEAM_ID`
and `COOLIFY_TEAM_ID` remain absent in this runner, but the selector readback
is not an active blocker while current-team and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1977-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1973` at
`2026-06-04T12:06:24Z`, refreshing the prior `LUC-1969` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `17` visible rows. The
project/environment hierarchy remains the authoritative production status scope
for this binding proof.
Application rows report `running:unknown`; PostgreSQL and Redis report
`running:healthy` from production environment readback. `COOLIFY_SOAR_TEAM_ID`
and `COOLIFY_TEAM_ID` remain absent in this runner, but the selector readback
is not an active blocker while current-team and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1973-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1969` at
`2026-06-04T11:47:06Z`, refreshing the prior `LUC-1933` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved project `Soar`, production environment `production`,
and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `17` visible rows. The
project/environment hierarchy remains the authoritative production status scope
for this binding proof.
Application rows report `running:unknown`; PostgreSQL and Redis report
`running:healthy` from production environment readback. `COOLIFY_SOAR_TEAM_ID`
and `COOLIFY_TEAM_ID` remain absent in this runner, but the selector readback
is not an active blocker while current-team and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1969-coolify-read-only-production-status-access-2026-06-04.md`.

Previous read-only access binding checkpoint: `LUC-1919` at
`2026-06-04T06:35:51Z`, refreshing the prior `LUC-1916` proof. Runtime
bindings are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`,
`COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
`COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
`COOLIFY_SOAR_API_APP_ID` without values printed. Authenticated read-only
Coolify reads resolved current selector id `0` name `LuckySparrow`, project
`Soar`, production environment `production`, and the canonical eight-resource
production-environment inventory: six applications plus PostgreSQL and Redis.
The global resources endpoint returned `17` visible rows. The
project/environment hierarchy remains the authoritative production status scope
for this binding proof.
Application rows report `running:unknown`; PostgreSQL and Redis report
`running:healthy` from production environment readback. `COOLIFY_SOAR_TEAM_ID`
and `COOLIFY_TEAM_ID` remain absent in this runner, but the selector readback
is not an active blocker while current-team and project-scoped reads succeed.
This heartbeat performed no deploy, restart, rollback, env edit, database
action, team setting change, account action, protected smoke, secret readback,
or live-trading action.
Evidence:
`history/evidence/luc-1919-coolify-read-only-production-status-access-2026-06-04.md`.

Latest team/workspace selector checkpoint: `LUC-1678` at
`2026-06-03T05:38:12Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1678-coolify-team-workspace-confirmation-2026-06-03.md`.

Latest `LUC-1696` production-environment inventory readback:
`2026-06-03T14:27:04Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
single active environment `production` id `6`, and the canonical
eight-resource production environment inventory. The production environment
endpoint returned six applications plus PostgreSQL and Redis, with zero
generic services. The global resources endpoint returned `17` visible rows,
eight rows matching the production environment id, and nine Soar-relevant rows
in the safe name/type projection because Coolify exposes both `postgresql` and
one redacted PostgreSQL companion row. Treat the extra global PostgreSQL row as
a global-list alias/companion row, not as a ninth production-environment deploy
or smoke target. Application rows report `running:unknown`; PostgreSQL and
Redis report `running:healthy`. PostgreSQL restart count is `52`, Redis
restart count is `682`, API restart count is `5`, and the other app/worker
restart counts are `0`, so restart history remains a later smoke/SLO watch
item, not an inventory blocker. Legacy app id aliases were not used as source
truth. This heartbeat performed no deploy, restart, rollback, env edit,
database action, team setting change, account action, protected smoke, secret
readback, or live-trading action. Evidence:
`history/evidence/luc-1696-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1679` at
`2026-06-03T05:37:45Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1679-coolify-team-workspace-confirmation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1672` at
`2026-06-03T05:34:32Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1672-coolify-team-workspace-confirmation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1665` at
`2026-06-03T05:03:35Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1665-coolify-team-workspace-confirmation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1650` at
`2026-06-03T03:33:50Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1650-coolify-team-workspace-confirmation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1647` at
`2026-06-03T03:08:26Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
Evidence:
`history/evidence/luc-1647-coolify-team-workspace-confirmation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1644` at
`2026-06-03T03:03:27Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1644-coolify-team-workspace-confirmation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1640` at
`2026-06-03T02:34:02Z`. Authenticated read-only Coolify API calls confirmed
the expected current selector id `0`, name `LuckySparrow`. Under this selector,
the configured Soar project resolves to project `Soar`, production environment
`production` id `6`, and the canonical eight-resource production environment
inventory: six applications, one PostgreSQL resource, and one Redis resource.
`GET /api/v1/teams` returned two visible teams. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1640-coolify-team-workspace-confirmation-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1629` at
`2026-06-03T01:34:10Z`. Authenticated read-only Coolify API calls confirmed
the same expected current selector id `0`, name `LuckySparrow`, configured
project `Soar`, production environment `production` id `6`, and the canonical
eight-resource production environment inventory. Evidence:
`history/evidence/luc-1629-coolify-team-workspace-confirmation-2026-06-03.md`.

Latest `LUC-1673` production-environment inventory readback:
`2026-06-03T05:36:00Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
single active environment `production` id `6`, and the canonical
eight-resource production environment inventory. The production environment
endpoint returned six applications plus PostgreSQL and Redis, with zero
generic services; global resources list returned `17` visible rows, eight rows
matching the production environment id, and nine Soar-relevant rows in the safe
name/type projection because Coolify exposes both `postgresql` and one
redacted PostgreSQL companion row. Treat the extra global PostgreSQL row as a
global-list alias/companion row, not as a ninth production-environment deploy
or smoke target. Application rows report `running:unknown`; PostgreSQL and
Redis report `running:healthy`. PostgreSQL restart count is `52`, Redis
restart count is `682`, API restart count is `5`, and the other app/worker
restart counts are `0`, so restart history remains a later smoke/SLO watch
item, not an inventory blocker. Legacy app id aliases were not used as source
truth. This heartbeat performed no deploy, restart, rollback, env edit,
database action, team setting change, account action, secret readback, or
live-trading action. Evidence:
`history/evidence/luc-1673-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous `LUC-1666` production-environment inventory readback:
`2026-06-03T05:05:10Z`. Authenticated read-only Coolify API calls reconfirmed
the same canonical eight-resource production environment inventory. Evidence:
`history/evidence/luc-1666-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous `LUC-1662` production-environment inventory readback:
`2026-06-03T04:36:40Z`. Authenticated read-only Coolify API calls reconfirmed
the same canonical eight-resource production environment inventory. Evidence:
`history/evidence/luc-1662-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous `LUC-1656` production-environment inventory readback:
`2026-06-03T04:08:03Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
single active environment `production` id `6`, and the canonical
eight-resource production environment inventory. The production environment
endpoint returned six applications, one PostgreSQL resource, one Redis
resource, and zero generic services; global resources list returned `17`
visible rows, eight rows matching the production environment id, and nine
Soar-relevant rows in the safe name/type projection because Coolify exposes
both `postgresql` and one redacted PostgreSQL companion row. Treat the extra
global PostgreSQL row as a global-list alias/companion row, not as a ninth
production-environment deploy or smoke target. Application rows report
`running:unknown`; PostgreSQL and Redis report `running:healthy`. PostgreSQL
restart count is `52`, Redis restart count is `682`, API restart count is
`5`, and the other app/worker restart counts are `0`, so restart history
remains a later smoke/SLO watch item, not an inventory blocker. Legacy app id
aliases were not used as source truth. This heartbeat performed no deploy,
restart, rollback, env edit, database action, team setting change, account
action, secret readback, or live-trading action. Evidence:
`history/evidence/luc-1656-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous `LUC-1651` production-environment inventory readback:
`2026-06-03T03:33:27Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
single active environment `production` id `6`, and the canonical
eight-resource production environment inventory. The production environment
endpoint returned six applications, one PostgreSQL resource, one Redis
resource, and zero generic services; global resources list returned `17`
visible rows, eight rows matching the production environment id, and nine
Soar-relevant rows in the safe name/type projection because Coolify exposes
both `postgresql` and one redacted PostgreSQL companion row. Treat the extra
global PostgreSQL row as a global-list alias/companion row, not as a ninth
production-environment deploy or smoke target. Application rows report
`running:unknown`; PostgreSQL and Redis report `running:healthy`. PostgreSQL
restart count is `52`, Redis restart count is `682`, and API restart count is
`5`, so restart history remains a later smoke/SLO watch item, not an inventory
blocker. Legacy app id aliases were not used as source truth. This heartbeat
performed no deploy, restart, rollback, env edit, database action, team setting
change, account action, secret readback, or live-trading action. Evidence:
`history/evidence/luc-1651-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous `LUC-1645` production-environment inventory readback:
`2026-06-03T03:07:02Z`. Authenticated read-only Coolify API calls reconfirmed
the same eight-resource production environment inventory and the same global
PostgreSQL alias/companion row interpretation. Evidence:
`history/evidence/luc-1645-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous `LUC-1641` production-environment inventory readback:
`2026-06-03T02:34:56Z`. Authenticated read-only Coolify API calls reconfirmed
the same eight-resource production environment inventory and the same global
PostgreSQL alias/companion row interpretation. Evidence:
`history/evidence/luc-1641-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Previous `LUC-1634` production-environment inventory readback:
`2026-06-03T02:03:30Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
single active environment `production`, and the canonical
eight-resource production environment inventory. The production environment
endpoint returned six applications, one PostgreSQL resource, one Redis
resource, and zero generic services; global resources list returned `17`
visible rows and nine Soar-relevant rows because Coolify exposes both
`postgresql` and one redacted `postgresql-database-*` companion row. Treat the
extra global PostgreSQL row as a global-list alias/companion row, not as a
ninth production-environment deploy or smoke target. Application rows report
`running:unknown`; PostgreSQL and Redis report `running:healthy`. PostgreSQL
restart count is `52`, Redis restart count is `682`, and API restart count is
`5`, so restart history remains a later smoke/SLO watch item, not an inventory
blocker. Legacy app id aliases were not used as source truth. This heartbeat
performed no deploy, restart, rollback, env edit, database action, team setting
change, account action, or live-trading action. Evidence:
`history/evidence/luc-1634-coolify-resource-inventory-reconciliation-2026-06-03.md`.

Latest read-only access binding checkpoint: `LUC-1639` at
`2026-06-03T02:34:15Z`, refreshing prior `LUC-1597`, `LUC-1591`,
`LUC-1586`, `LUC-1579`, `LUC-1552`, and `LUC-1532` proofs. Runtime bindings
are present for `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`,
`COOLIFY_SOAR_PROJECT_ID`, `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`,
`COOLIFY_SOAR_WEB_APP_ID`, and `COOLIFY_SOAR_API_APP_ID` without values
printed. Authenticated project-scoped Coolify reads resolved current selector
id `0`, name `LuckySparrow`, project `Soar`, production environment
`production`, six application resources, PostgreSQL, and Redis. Application
rows report `running:unknown`; PostgreSQL and Redis report `running:healthy`.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector readback is not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action. Evidence:
`history/evidence/luc-1639-coolify-read-only-production-status-access-2026-06-03.md`.

Previous team/workspace selector checkpoint: `LUC-1623` at
`2026-06-03T01:04:29Z`, refreshing the prior `LUC-1619`, `LUC-1614`, `LUC-1611`, `LUC-1609`, `LUC-1604`, `LUC-1601`, `LUC-1598`, `LUC-1594`, `LUC-1592`, `LUC-1587`, `LUC-1585`, `LUC-1583`, `LUC-1580`, `LUC-1574`, `LUC-1571`, `LUC-1568`, `LUC-1564`, `LUC-1560`, `LUC-1556`, `LUC-1553`,
`LUC-1548`, `LUC-1543`, `LUC-1539`, `LUC-1538`, `LUC-1537`,
`LUC-1533`, `LUC-1531`, `LUC-1529`, `LUC-1525`, `LUC-1522`, `LUC-1518`,
`LUC-1514`, and `LUC-1507` proofs.
Read-only Coolify API calls confirmed the expected
team/workspace selector is id `0`, name `LuckySparrow`. Earlier project memory
described this id `0` selector as `Root Team`; the current API name is
`LuckySparrow`. Under this selector, the configured Soar project resolves to
project `Soar` and environment `production`. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain
absent in this runner, but the exact selector is now recorded as non-secret
config truth for future binding.

Latest `LUC-1623` selector readback: `2026-06-03T01:04:29Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six applications
plus PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth and not an active blocker
while current-team and project-scoped reads succeed. This heartbeat performed
no deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest `LUC-1619` selector readback: `2026-06-03T00:36:17Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six applications
plus PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth and not an active blocker
while current-team and project-scoped reads succeed. This heartbeat performed
no deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest `LUC-1614` selector readback: `2026-06-02T22:33:52Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six applications
plus PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth and not an active blocker
while current-team and project-scoped reads succeed. This heartbeat performed
no deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest `LUC-1611` selector readback: `2026-06-02T22:14:29Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six applications
plus PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth and not an active blocker
while current-team and project-scoped reads succeed. Paperclip heartbeat
context showed `blocked` with zero first-class blockers, so this heartbeat
resolved the stale disposition with fresh proof. This heartbeat performed no
deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest `LUC-1609` selector readback: `2026-06-02T22:08:15Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six applications
plus PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth and not an active blocker
while current-team and project-scoped reads succeed. This heartbeat performed
no deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest `LUC-1604` selector readback: `2026-06-02T21:50:29Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six applications
plus PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth and not an active blocker
while current-team and project-scoped reads succeed. This heartbeat performed
no deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest `LUC-1601` selector readback: `2026-06-02T21:09:36Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six applications
plus PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth and not an active blocker
while current-team and project-scoped reads succeed. This heartbeat performed
no deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest `LUC-1598` selector readback: `2026-06-02T21:04:18Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment
`production`, and the same eight-resource production topology: six
applications plus PostgreSQL and Redis. `GET /api/v1/teams` returned two
visible teams. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in
this runner, but the selector is recorded as non-secret config truth and not an
active blocker while current-team and project-scoped reads succeed. This
heartbeat performed no deploy, restart, rollback, env edit, database action,
team setting change, account action, or live-trading action.

Latest `LUC-1594` selector readback: `2026-06-02T20:55:41Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, and production environment
`production` id `6`. `GET /api/v1/resources` returned nine Soar-relevant rows
in this readback: six applications, Redis, `postgresql`, and one redacted
`postgresql-database-*` companion row. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action, or
live-trading action.

Latest `LUC-1605` production-environment inventory readback:
`2026-06-02T21:52:06Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
production environment `production`, and the canonical eight-resource
production environment inventory. The production environment endpoint returned
six applications, one PostgreSQL resource, and one Redis resource; global
resources list returned `17` visible rows and nine Soar-relevant rows because
Coolify exposes both `postgresql` and one redacted
`postgresql-database-*` companion row. Treat the extra global
PostgreSQL row as a global-list alias/companion row, not as a ninth
production-environment deploy or smoke target. Application rows report
`running:unknown`; PostgreSQL and Redis report `running:healthy`. This
heartbeat performed no deploy, restart, rollback, env edit, database action,
team setting change, account action, or live-trading action.

Latest `LUC-1610` production-environment inventory readback:
`2026-06-02T22:11:28Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
production environment `production`, and the canonical eight-resource
production environment inventory. The production environment endpoint returned
six applications, one PostgreSQL resource, and one Redis resource; global
resources list returned `17` visible rows and nine Soar-relevant rows because
Coolify exposes both `postgresql` and one redacted
`postgresql-database-*` companion row. Treat the extra global
PostgreSQL row as a global-list alias/companion row, not as a ninth
production-environment deploy or smoke target. Application rows report
`running:unknown`; PostgreSQL and Redis report `running:healthy`. This
heartbeat performed no deploy, restart, rollback, env edit, database action,
team setting change, account action, or live-trading action.

Previous `LUC-1599` production-environment inventory readback:
`2026-06-02T21:03:57Z`. Authenticated read-only Coolify API calls reconfirmed
the same eight-resource production environment inventory and the same global
PostgreSQL alias/companion-row interpretation.

Latest `LUC-1593` production-environment inventory readback:
`2026-06-02T20:54:06Z`. Authenticated read-only Coolify API calls reconfirmed
current selector id `0` name `LuckySparrow`, configured project `Soar`,
production environment `production` id `6`, and the same eight-resource
production environment inventory. The production environment endpoint returned
six applications, one PostgreSQL resource, and one Redis resource; global
resources list returned `17` visible rows. Application rows report
`running:unknown`; PostgreSQL and Redis report `running:healthy`. This
heartbeat performed no deploy, restart, rollback, env edit, database action,
team setting change, account action, or live-trading action.

Latest `LUC-1592` selector readback: `2026-06-02T20:51:42Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment `production`
id `6`, and the same eight-resource production topology: six applications plus
PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams and the
global resource list returned `17` visible rows. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action,
secret readback, or live-trading action.

Latest `LUC-1587` selector readback: `2026-06-02T19:12:30Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment `production`
id `6`, and the same eight-resource production inventory: six applications plus
PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams and the
global resource list returned `17` visible rows. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action, or
live-trading action.

Latest `LUC-1585` selector readback: `2026-06-02T19:12:54Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment `production`
id `6`, and the same eight-resource production inventory: six applications plus
PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams and the
global resource list returned `17` visible rows. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but the selector is recorded as
non-secret config truth and not an active blocker while current-team and
project-scoped reads succeed. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action, or
live-trading action.

Latest `LUC-1583` selector readback: `2026-06-02T19:09:11Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment `production`
id `6`, and the same eight-resource production inventory: six applications plus
PostgreSQL and Redis. `GET /api/v1/teams` returned two visible teams, the
global resource list returned `17` visible rows, application rows report
`running:unknown`, and PostgreSQL and Redis report `running:healthy`.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is now reconfirmed as non-secret config truth and not an active
blocker while current-team and project-scoped reads succeed. This heartbeat
performed no deploy, restart, rollback, env edit, database action, team setting
change, account action, or live-trading action.

Latest `LUC-1580` selector readback: `2026-06-02T19:03:41Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0`, name
`LuckySparrow`, configured project `Soar`, production environment, and the same
eight-resource production inventory: six applications plus PostgreSQL and Redis.
`COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner, but
the selector is recorded as non-secret config truth. This check performed no
deploy, restart, rollback, env edit, database action, team setting change,
account action, or live-trading action.

Latest read-only access binding checkpoint: `LUC-1591` at
`2026-06-02T20:51:41Z`, refreshing the prior `LUC-1586`, `LUC-1579`, `LUC-1552`, and
`LUC-1532` proofs. The Ops runtime has `COOLIFY_BASE_URL`,
`COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and
project-scoped production access present by name without values printed.
Authenticated project-scoped Coolify reads resolved project `Soar` and the
same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
`COOLIFY_TEAM_ID` remain absent in this runner, but that is not an active
blocker for project/environment/resource status reconciliation while the
current-team and project-scoped reads succeed. `LUC-1586` had no comments and no
first-class `blockedBy` issue.

Latest `LUC-1554` readback: `2026-06-02T17:04:40Z`. Authenticated
read-only Coolify API calls to the configured Soar project, environment list,
production environment, and resource list succeeded. Redacted inventory count
is eight resources: six applications plus
PostgreSQL and Redis. Application status is `running:unknown` at the Coolify
inventory layer; data services report `running:healthy`. Application-level
readiness remains a separate release smoke requirement.

Latest `LUC-1565` readback: `2026-06-02T17:34:56Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0` name
`LuckySparrow`, configured project `Soar`, production environment, and the same
eight-resource production inventory. The production endpoint returned six
applications, one PostgreSQL resource, and one Redis resource; global resources
list returned `17` visible rows. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action, or
live trading action.

Latest `LUC-1569` readback: `2026-06-02T18:04:49Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0` name
`LuckySparrow`, configured project `Soar`, production environment, and the same
eight-resource production inventory. The production endpoint returned six
applications, one PostgreSQL resource, and one Redis resource; global resources
list returned `17` visible rows. This heartbeat performed no deploy, restart,
rollback, env edit, database action, team setting change, account action, or
live trading action.

Latest `LUC-1581` readback: `2026-06-02T19:03:20Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0` name
`LuckySparrow`, configured project `Soar`, production environment `production`
id `6`, and the same eight-resource production inventory. The production
endpoint returned six applications, one PostgreSQL resource, and one Redis
resource; global resources list returned `17` visible rows. Application rows
report `running:unknown`; PostgreSQL and Redis report `running:healthy`. This
heartbeat performed no deploy, restart, rollback, env edit, database action,
team setting change, account action, or live trading action.

Latest `LUC-1584` readback: `2026-06-02T19:08:59Z`. Authenticated
read-only Coolify API calls reconfirmed current selector id `0` name
`LuckySparrow`, configured project `Soar`, production environment `production`
id `6`, and the same eight-resource production inventory. The production
endpoint returned six applications, one PostgreSQL resource, and one Redis
resource; global resources list returned `17` visible rows. Application rows
report `running:unknown`; PostgreSQL and Redis report `running:healthy`. This
heartbeat performed no deploy, restart, rollback, env edit, database action,
team setting change, account action, or live trading action.

| Resource | Coolify type | Dockerfile | Public FQDN | Verification role |
| --- | --- | --- | --- | --- |
| `soar-api` | application | `/apps/api/Dockerfile` | yes | API health/readiness and protected worker-readiness surface |
| `soar-web` | application | `/apps/web/Dockerfile` | yes | Web route and build-info readback |
| `workers-backtest` | application | `/apps/api/Dockerfile.worker.backtest` | no | Backtest worker liveness/freshness |
| `workers-execution` | application | `/apps/api/Dockerfile.worker.execution` | no | Execution worker liveness/freshness |
| `workers-market-data` | application | `/apps/api/Dockerfile.worker.market-data` | no | Market-data worker liveness/freshness |
| `workers-market-stream` | application | `/apps/api/Dockerfile.worker.market-stream` | no | Market-stream worker liveness/freshness |
| `postgresql` | postgresql | n/a | no | Production database dependency |
| `redis` | redis | n/a | no | Cache/queue/rate-limit dependency |

Current inventory count: six applications plus PostgreSQL and Redis.

## Required Artifacts

- Dockerfile paths: listed in runtime inventory above.
- Compose or service-definition paths: `docker-compose.coolify.yml`,
  `docker-compose.coolify.shared-api-image.yml`, `docker-compose.vps.yml`.
- Env example files: `.env.coolify.example`, `.env.vps.example`,
  `.env.docker.example`, `apps/api/.env.example`, `apps/web/.env.example`.
- Health or readiness endpoints: API `/health`, API `/ready`, protected API
  `/workers/ready`, Web `/`, Web `/api/build-info`.
- Migration entrypoint: API deployment path must run the project-approved
  Prisma migration contract before production mutation; do not infer it from
  inventory alone.

## Env And Secrets Contract

- Env files exist as examples only; production values live in Coolify/Paperclip
  secret storage.
- Secret values, tokens, cookies, database URLs, and exchange credentials must
  never be printed or committed.
- Safe examples may contain variable names and non-secret placeholders only.
- Secret rotation ownership: Paperclip Security Review Lead with Ops Release
  Lead for Coolify/VPS execution coordination.
- Residual caveat: an earlier 2026-06-02 runner recorded
  `COOLIFY_SOAR_PROJECT_ID` binding drift, but the LUC-1399 refresh did not
  reproduce it: configured project lookup and production environment lookup
  succeeded. Treat future runner drift as a secret-binding watch item, not as
  an active blocker for the current resource inventory.
- LUC-1398 read-only binding status: `COOLIFY_SOAR_PROJECT_ID` resolves to
  Coolify project `Soar` through authenticated read-only API access. Direct
  `COOLIFY_SOAR_API_APP_ID` and `COOLIFY_SOAR_WEB_APP_ID` aliases returned
  `404` in the same runner, so project/list inventory remains the approved
  read-only status path until Security/Ops refreshes resource-specific aliases.
- LUC-1434 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged.
- LUC-1443 read-only binding refresh confirmed the required Coolify access
  names are present and authenticated read-only list/project/resource probes
  still succeed for Soar. Direct `COOLIFY_SOAR_API_APP_ID` and
  `COOLIFY_SOAR_WEB_APP_ID` aliases still return `404`; use project/list
  inventory for status reconciliation until Security/Ops refreshes direct
  resource aliases.
- LUC-1444 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. The production environment endpoint uses the
  `postgresqls` collection name for PostgreSQL resources.
- LUC-1448 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. The production environment endpoint did not
  expose Dockerfile fields in this projection, so Dockerfile paths remain the
  previously documented resource contract rather than new API output.
- LUC-1455 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. The production environment endpoint did not
  expose Dockerfile fields in this projection, so Dockerfile paths remain the
  previously documented resource contract rather than new API output.
- LUC-1459 read-only access binding refresh confirmed `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, and `COOLIFY_SOAR_PROJECT_ID` are
  present in the Ops runtime without values printed. Authenticated Coolify reads
  against the configured project, environments, production environment, and
  resource list succeeded, resolving to project `Soar`, production environment
  id `6`, and the same eight-resource projection. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` are absent in this runner but not an active blocker while
  project-scoped reads succeed. Paperclip secret metadata is board-only for this
  agent and was not inspected.
- LUC-1460 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. The production environment endpoint did not
  expose Dockerfile fields in this projection, so Dockerfile paths remain the
  previously documented resource contract rather than new API output.
- LUC-1466 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. The production environment endpoint did not
  expose Dockerfile fields in this projection, so Dockerfile paths remain the
  previously documented resource contract rather than new API output.
- LUC-1467 read-only access binding refresh confirmed `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, and `COOLIFY_SOAR_PROJECT_ID` are
  present in the Ops runtime without values printed. Authenticated Coolify reads
  against the configured project, environments, production environment, and
  resource list succeeded, resolving to project `Soar`, production environment
  id `6`, and the same eight-resource projection. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` are absent in this runner but not an active blocker while
  project-scoped reads succeed.
- LUC-1532 read-only access binding refresh confirmed `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` are present in the Ops runtime without
  values printed. Authenticated Coolify reads against the configured project,
  environment endpoint, production environment, resources list, and current
  team selector succeeded, resolving to project `Soar`, selector id `0` name
  `LuckySparrow`, and the same eight-resource production projection.
  `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner but
  are not an active blocker while current-team and project-scoped reads
  succeed. This heartbeat performed no deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action.
- LUC-1552 read-only access binding refresh confirmed `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, and `COOLIFY_SOAR_PROJECT_ID` are
  present in the Ops runtime without values printed. Authenticated Coolify reads
  against the configured project, environment endpoint, production environment,
  resources list, and current team selector succeeded, resolving to project
  `Soar`, selector id `0` name `LuckySparrow`, and the same eight-resource
  production projection. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain
  absent in this runner but are not an active blocker while current-team and
  project-scoped reads succeed. This heartbeat performed no deploy, restart,
  rollback, env edit, database action, team setting change, account action, or
  live trading action.
- LUC-1473 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. This heartbeat performed no deploy, restart,
  rollback, env edit, database action, account action, or live trading action.
- LUC-1476 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. This heartbeat performed no deploy, restart,
  rollback, env edit, database action, team setting change, account action, or
  live trading action.
- LUC-1479 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment and eight-resource
  projection remain unchanged. This heartbeat performed no deploy, restart,
  rollback, env edit, database action, team setting change, account action, or
  live trading action.
- LUC-1482 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1485 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1497 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1502 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1508 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1515 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1519 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1523 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1526 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment id remains `6` and the
  eight-resource projection remains unchanged. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1530 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment remains `production`
  and the eight-resource projection remains unchanged. This heartbeat performed
  no deploy, restart, rollback, env edit, database action, team setting change,
  account action, or live trading action.
- LUC-1534 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment remains `production`
  and the eight-resource projection remains unchanged. The prior heartbeat
  failure was adapter auth-symlink setup drift before Soar domain work, not a
  production inventory blocker. This heartbeat performed no deploy, restart,
  rollback, env edit, database action, team setting change, account action, or
  live trading action.
- LUC-1548 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T16:34:09Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1549 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment remains `production`
  and the eight-resource projection remains unchanged. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1554 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; the production environment remains `production`
  and the eight-resource projection remains unchanged. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1565 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production`, and the eight-resource production
  projection remain unchanged. Application rows report `running:unknown` in
  Coolify inventory; PostgreSQL and Redis report `running:healthy`. This
  heartbeat performed no deploy, restart, rollback, env edit, database action,
  team setting change, account action, or live trading action.
- LUC-1507 team/workspace selector refresh confirmed the expected Coolify
  selector is team id `0`, name `LuckySparrow`, through `GET /api/v1/teams` and
  `GET /api/v1/teams/current`. Under that selector, authenticated read-only
  project/environment reads still resolve configured project `Soar`, production
  environment `production`, and eight resources. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner, but future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1514 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector, and project/environment reads under that selector resolved
  configured project `Soar`, environment `production`, and the same
  eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1522 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T15:04:09Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1525 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T15:09:21Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1533 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T16:03:08Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1553 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T17:08:25Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1560 team/workspace binding refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T17:13:03Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1564 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T17:33:59Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1568 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T18:03:58Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1569 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production`, and the eight-resource production
  projection remain unchanged. Application rows report `running:unknown` in
  Coolify inventory; PostgreSQL and Redis report `running:healthy`. This
  heartbeat performed no deploy, restart, rollback, env edit, database action,
  team setting change, account action, or live trading action.
- LUC-1571 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T18:11:24Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1575 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production`, and the eight-resource production
  projection remain unchanged. Application rows report `running:unknown` in
  Coolify inventory; PostgreSQL and Redis report `running:healthy`. This
  heartbeat performed no deploy, restart, rollback, env edit, database action,
  team setting change, account action, or live trading action.
- LUC-1579 read-only access binding refresh confirmed `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`, and
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT` are present in the Ops runtime without
  values printed. Authenticated Coolify reads against current team, configured
  project, environment endpoint, production environment, and resources list
  succeeded, resolving to project `Soar`, selector id `0` name
  `LuckySparrow`, and the same eight-resource production projection.
  `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent in this runner but
  are not an active blocker while current-team and project-scoped reads
  succeed. This heartbeat performed no deploy, restart, rollback, env edit,
  database action, team setting change, account action, or live trading action.
- LUC-1581 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production` id `6`, and the eight-resource
  production projection remain unchanged. Application rows report
  `running:unknown` in Coolify inventory; PostgreSQL and Redis report
  `running:healthy`. This heartbeat performed no deploy, restart, rollback,
  env edit, database action, team setting change, account action, or live
  trading action.
- LUC-1584 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production` id `6`, and the eight-resource
  production projection remain unchanged. Application rows report
  `running:unknown` in Coolify inventory; PostgreSQL and Redis report
  `running:healthy`. This heartbeat performed no deploy, restart, rollback,
  env edit, database action, team setting change, account action, or live
  trading action.
- LUC-1593 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production` id `6`, and the eight-resource
  production environment projection remain unchanged. Application rows report
  `running:unknown` in Coolify inventory; PostgreSQL and Redis report
  `running:healthy`. This heartbeat performed no deploy, restart, rollback,
  env edit, database action, team setting change, account action, or live
  trading action.
- LUC-1599 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production` id `6`, and the eight-resource
  production environment projection remain unchanged. The global resources
  endpoint additionally exposes one redacted `postgresql-database-*`
  companion row; treat it as a global-list
  PostgreSQL alias/companion row, not as an additional production-environment
  deploy target. Application rows report `running:unknown` in Coolify
  inventory; PostgreSQL and Redis report `running:healthy`. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1583 team/workspace selector refresh reconfirmed the same expected
  Coolify selector: team id `0`, name `LuckySparrow`. `GET /api/v1/teams`
  returned two visible teams, `GET /api/v1/teams/current` returned the current
  selector at `2026-06-02T19:09:06Z`, and project/environment reads under that
  selector resolved configured project `Soar`, environment `production`, and
  the same eight-resource production inventory. `COOLIFY_SOAR_TEAM_ID` and
  `COOLIFY_TEAM_ID` remain absent in this runner; future explicit binding
  should use id `0` if Security/Ops wants selector pinning. This heartbeat
  performed no deploy, restart, rollback, env edit, database action, team
  setting change, account action, or live trading action.
- LUC-1615 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production`, and the eight-resource production
  environment projection remain unchanged. The global resources endpoint
  returned `17` visible rows and `9` Soar-relevant rows because Coolify exposes
  one redacted `postgresql-database-*` companion row alongside the canonical
  `postgresql` production-environment resource. Application rows report
  `running:unknown` in Coolify inventory; PostgreSQL and Redis report
  `running:healthy`. This heartbeat performed no deploy, restart, rollback,
  env edit, database action, team setting change, account action, or live
  trading action.
- LUC-1620 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production` id `6`, and the eight-resource production
  environment projection remain unchanged. The global resources endpoint
  returned `17` visible rows and `9` Soar-relevant rows because Coolify exposes
  one redacted `postgresql-database-*` companion row alongside the canonical
  `postgresql` production-environment resource. Application rows report
  `running:unknown` in Coolify inventory; PostgreSQL and Redis report
  `running:healthy`. This heartbeat performed no deploy, restart, rollback,
  env edit, database action, team setting change, account action, or live
  trading action.
- LUC-1624 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production` id `6`, and the eight-resource production
  environment projection remain unchanged. The global resources endpoint
  returned `17` visible rows and `9` Soar-relevant rows because Coolify exposes
  one redacted `postgresql-database-*` companion row alongside the canonical
  `postgresql` production-environment resource. Application rows report
  `running:unknown` in Coolify inventory; PostgreSQL and Redis report
  `running:healthy`. This heartbeat performed no deploy, restart, rollback,
  env edit, database action, team setting change, account action, or live
  trading action.
- LUC-1673 read-only inventory refresh confirmed the configured project binding
  still resolves to `Soar`; current selector id `0` name `LuckySparrow`,
  production environment `production` id `6`, and the eight-resource production
  environment projection remain unchanged. The global resources endpoint
  returned `17` visible rows and `9` Soar-relevant rows because Coolify exposes
  one redacted `postgresql-database-*` companion row alongside the canonical
  `postgresql` production-environment resource. Application rows report
  `running:unknown` in Coolify inventory; PostgreSQL and Redis report
  `running:healthy`. This heartbeat performed no deploy, restart, rollback,
  env edit, database action, team setting change, account action, live trading
  action, or secret readback.
- LUC-1790 read-only access binding refresh confirmed `COOLIFY_BASE_URL`,
  `COOLIFY_API_TOKEN`, `COOLIFY_TOKEN`, `COOLIFY_SOAR_PROJECT_ID`,
  `COOLIFY_SOAR_PRODUCTION_ENVIRONMENT`, `COOLIFY_SOAR_WEB_APP_ID`, and
  `COOLIFY_SOAR_API_APP_ID` are present by name in the Ops runner without value
  disclosure. `COOLIFY_SOAR_TEAM_ID` and `COOLIFY_TEAM_ID` remain absent, but
  project-scoped readbacks succeeded under selector name `LuckySparrow`.
  Read-only probes at `2026-06-03T15:03:21Z` resolved project `Soar`,
  environment `production`, six applications, zero generic services, `17`
  visible global resource rows, and the same eight-resource production
  inventory. Application rows report `running:unknown` in Coolify inventory;
  PostgreSQL and Redis report `running:healthy`. This heartbeat performed no
  deploy, restart, rollback, env edit, database action, team setting change,
  account action, live trading action, or secret readback.

## Release Requirements

- Required checks before deploy: clean release source, pushed source ref,
  migration risk review, required secrets present by name, rollback path,
  resource-by-resource smoke plan.
- Required smoke checks after deploy: API `/health`, API `/ready`, Web `/`,
  Web `/api/build-info`, protected `/workers/ready` with approved read-only
  principal, and resource-level worker liveness/freshness for all four workers.
- Rollback trigger: failed health/readiness, wrong deployed SHA, worker
  non-readiness, migration failure, or security/auth regression.
- Rollback method: Coolify rollback/redeploy to the approved previous source
  ref plus post-rollback public and protected smoke evidence.

## Data Safety

- Backup strategy: production PostgreSQL backup path must be verified before
  release mutation.
- Restore verification expectation: restore drill evidence is required for
  production readiness claims.
- Risky migration policy: stop and request release approval before destructive,
  irreversible, or ambiguous migrations.

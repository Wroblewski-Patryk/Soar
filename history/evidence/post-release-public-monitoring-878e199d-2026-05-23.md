# Post-Release Public Monitoring - 878e199d - 2026-05-23

## Scope

Public-only monitoring after deployment of
`878e199dd13cabc9a8a25b1ece83d0c483ec0c22` on `main`.

This proof did not use authenticated Soar app credentials, did not call
protected worker endpoints, and did not mutate production data, LIVE orders,
positions, exchange state, or bot activation.

## Result

Status: PASS

All 5 samples returned the expected Web build-info SHA and public endpoint
success responses.

| Sample | Checked At UTC | Git SHA | Git Ref | Metadata Source | API `/health` | API `/ready` | Web `/` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 2026-05-23T09:12:23.3889682Z | `878e199dd13cabc9a8a25b1ece83d0c483ec0c22` | `main` | `github-branch` | 200 | 200 | 200 |
| 2 | 2026-05-23T09:12:38.8860122Z | `878e199dd13cabc9a8a25b1ece83d0c483ec0c22` | `main` | `github-branch` | 200 | 200 | 200 |
| 3 | 2026-05-23T09:12:54.0797493Z | `878e199dd13cabc9a8a25b1ece83d0c483ec0c22` | `main` | `github-branch` | 200 | 200 | 200 |
| 4 | 2026-05-23T09:13:09.3174722Z | `878e199dd13cabc9a8a25b1ece83d0c483ec0c22` | `main` | `github-branch` | 200 | 200 | 200 |
| 5 | 2026-05-23T09:13:24.5237418Z | `878e199dd13cabc9a8a25b1ece83d0c483ec0c22` | `main` | `github-branch` | 200 | 200 | 200 |

## Command

```powershell
$results = @()
for ($i = 1; $i -le 5; $i++) {
  $checkedAt = (Get-Date).ToUniversalTime().ToString('o')
  $build = Invoke-RestMethod 'https://soar.luckysparrow.ch/api/build-info'
  $apiHealth = Invoke-WebRequest 'https://api.soar.luckysparrow.ch/health' -UseBasicParsing
  $apiReady = Invoke-WebRequest 'https://api.soar.luckysparrow.ch/ready' -UseBasicParsing
  $webRoot = Invoke-WebRequest 'https://soar.luckysparrow.ch/' -UseBasicParsing
  $results += [pscustomobject]@{
    sample = $i
    checkedAtUtc = $checkedAt
    gitSha = $build.gitSha
    gitRef = $build.gitRef
    metadataSource = $build.metadataSource
    apiHealth = [int]$apiHealth.StatusCode
    apiReady = [int]$apiReady.StatusCode
    webRoot = [int]$webRoot.StatusCode
  }
  if ($i -lt 5) { Start-Sleep -Seconds 15 }
}
$results | ConvertTo-Json -Depth 5
```

## Residual Limits

- Authenticated app smoke is not claimed because the available Coolify
  credential is not a valid Soar application password.
- Protected `/workers/ready`, rollback, restore drill, SLO, and LIVEIMPORT
  readbacks remain covered by the earlier protected `b1ba69ed` release proof,
  not by this public-only monitoring sample.

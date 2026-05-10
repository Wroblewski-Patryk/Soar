$ErrorActionPreference = 'Stop'

if ($env:SKIP_LOCAL_GATES -eq '1') {
  Write-Host '[pre-commit] SKIP_LOCAL_GATES=1 -> skipping local quality gates'
  exit 0
}

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)][string]$File,
    [Parameter(ValueFromRemainingArguments = $true)][string[]]$Args
  )

  $command = Get-Command $File -ErrorAction SilentlyContinue
  if (-not $command) {
    Write-Error "[pre-commit] missing required command: $File"
    exit 127
  }

  & $File @Args
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

Write-Host '[pre-commit] running Soar quality gates'

if (Test-Path 'package.json') {
  Invoke-Checked pnpm run quality:guardrails
  Invoke-Checked pnpm run lint
  Invoke-Checked pnpm run typecheck
}

Write-Host '[pre-commit] quality gates passed'


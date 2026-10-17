param(
  [string]$At = '02:30'
)

$ErrorActionPreference = 'Stop'
$taskName = 'Soar Local CI Nightly'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$runner = Join-Path $PSScriptRoot 'localCiGate.mjs'
$node = (Get-Command node.exe -ErrorAction Stop).Source

if (-not (Test-Path -LiteralPath $runner -PathType Leaf)) {
  throw "Missing local CI runner: $runner"
}
if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
  throw "Task '$taskName' already exists; inspect it before replacing it."
}

$clock = [datetime]::ParseExact($At, 'HH:mm', [Globalization.CultureInfo]::InvariantCulture)
$action = New-ScheduledTaskAction -Execute $node -Argument ('"{0}" --mode nightly' -f $runner) -WorkingDirectory $repoRoot
$trigger = New-ScheduledTaskTrigger -Daily -At $clock
$settings = New-ScheduledTaskSettingsSet `
  -WakeToRun:$false `
  -StartWhenAvailable:$false `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Hours 3)
$principal = New-ScheduledTaskPrincipal `
  -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) `
  -LogonType Interactive `
  -RunLevel Limited

Register-ScheduledTask `
  -TaskName $taskName `
  -Description 'Read-only source checks for trusted Soar main, in isolated disposable Docker services.' `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Principal $principal | Out-Null

$saved = Get-ScheduledTask -TaskName $taskName
if ($saved.Settings.WakeToRun -or $saved.Settings.StartWhenAvailable) {
  throw "Task '$taskName' has unsafe wake or catch-up settings."
}
Write-Output "Registered '$taskName' at $At local time; no wake or missed-run catch-up."
Write-Output 'The user must remain signed in for Docker Desktop to be available.'

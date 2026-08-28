[CmdletBinding()]
param(
  [switch]$SkipPackageCheck
)

$ErrorActionPreference = 'Stop'
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repositoryRoot = Split-Path -Parent $scriptRoot
Set-Location -LiteralPath $repositoryRoot

$failures = [System.Collections.Generic.List[string]]::new()

function Write-Check {
  param(
    [Parameter(Mandatory)] [string]$Label,
    [Parameter(Mandatory)] [bool]$Passed,
    [Parameter(Mandatory)] [string]$Detail
  )

  $mark = if ($Passed) { '[OK]' } else { '[NG]' }
  $color = if ($Passed) { 'Green' } else { 'Red' }
  Write-Host "$mark $Label - $Detail" -ForegroundColor $color
  if (-not $Passed) {
    $failures.Add("$Label`: $Detail")
  }
}

Write-Host ''
Write-Host 'Claude Code hands-on preflight' -ForegroundColor Cyan
Write-Host '--------------------------------'

foreach ($commandName in @('node', 'npm', 'claude')) {
  $command = Get-Command $commandName -ErrorAction SilentlyContinue
  Write-Check -Label $commandName -Passed ($null -ne $command) -Detail $(
    if ($command) { $command.Source } else { 'not found' }
  )
}

if ($failures.Count -eq 0) {
  Write-Check -Label 'Node.js version' -Passed $true -Detail (node --version)
  Write-Check -Label 'npm version' -Passed $true -Detail (npm --version)
  Write-Check -Label 'Claude Code version' -Passed $true -Detail (claude --version)
}

$requiredFiles = @(
  'CLAUDE.md',
  'docs/basic-design.md',
  'docs/test-spec.md',
  'docs/claude-hands-on.md',
  'docs/claude-hands-on.html',
  'app/loan-repayment-simulator.html'
)

foreach ($relativePath in $requiredFiles) {
  Write-Check -Label $relativePath -Passed (Test-Path -LiteralPath $relativePath -PathType Leaf) -Detail 'required file'
}

if (-not $SkipPackageCheck -and $failures.Count -eq 0) {
  Write-Host ''
  Write-Host 'Installing dependencies...' -ForegroundColor Cyan
  npm ci
  Write-Check -Label 'Dependencies' -Passed ($LASTEXITCODE -eq 0) -Detail 'npm ci'

  if ($LASTEXITCODE -eq 0) {
    Write-Host ''
    Write-Host 'Running package check...' -ForegroundColor Cyan
    npm run check
    Write-Check -Label 'Package validation' -Passed ($LASTEXITCODE -eq 0) -Detail 'npm run check'
  }
}

Write-Host ''
if ($failures.Count -gt 0) {
  Write-Host "Preflight failed with $($failures.Count) issue(s)." -ForegroundColor Red
  $failures | ForEach-Object { Write-Host "- $_" }
  exit 1
}

Write-Host 'Preflight passed.' -ForegroundColor Green
Write-Host 'Command: claude --dangerously-skip-permissions'

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

foreach ($commandName in @('git', 'node', 'npm', 'claude')) {
  $command = Get-Command $commandName -ErrorAction SilentlyContinue
  Write-Check -Label $commandName -Passed ($null -ne $command) -Detail $(
    if ($command) { $command.Source } else { 'not found' }
  )
}

if ($failures.Count -eq 0) {
  $nodeVersion = node --version
  $npmVersion = npm --version
  $claudeVersion = claude --version
  Write-Check -Label 'Node.js version' -Passed $true -Detail $nodeVersion
  Write-Check -Label 'npm version' -Passed $true -Detail $npmVersion
  Write-Check -Label 'Claude Code version' -Passed $true -Detail $claudeVersion
}

$insideRepository = (git rev-parse --is-inside-work-tree 2>$null) -eq 'true'
Write-Check -Label 'Git repository' -Passed $insideRepository -Detail $repositoryRoot

if ($insideRepository) {
  $branch = git branch --show-current
  $head = git rev-parse --short=12 HEAD
  $status = @(git status --porcelain=v1)
  Write-Check -Label 'Current branch' -Passed (-not [string]::IsNullOrWhiteSpace($branch)) -Detail $branch
  Write-Check -Label 'Current commit' -Passed $true -Detail $head
  Write-Check -Label 'Working tree' -Passed ($status.Count -eq 0) -Detail $(
    if ($status.Count -eq 0) { 'clean' } else { "$($status.Count) changed path(s); review before starting" }
  )
}

$requiredFiles = @(
  'CLAUDE.md',
  '.claude/settings.json',
  'README.md',
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
  Write-Host 'Running npm run check...' -ForegroundColor Cyan
  npm run check
  Write-Check -Label 'Package validation' -Passed ($LASTEXITCODE -eq 0) -Detail 'npm run check'
}

Write-Host ''
if ($failures.Count -gt 0) {
  Write-Host "Preflight failed with $($failures.Count) issue(s)." -ForegroundColor Red
  $failures | ForEach-Object { Write-Host "- $_" }
  exit 1
}

Write-Host 'Preflight passed. Open docs/claude-hands-on.html, then start Claude Code from this repository.' -ForegroundColor Green
Write-Host 'Command: claude --permission-mode plan'

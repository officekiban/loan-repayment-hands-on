[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repositoryRoot = [System.IO.Path]::GetFullPath((Split-Path -Parent $scriptRoot))
$baselineRoot = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot '.hands-on-baseline'))
$workspaceRoot = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot 'claude-demo'))
$expectedWorkspace = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot 'claude-demo'))

if ($workspaceRoot -ne $expectedWorkspace -or -not $workspaceRoot.StartsWith($repositoryRoot + [System.IO.Path]::DirectorySeparatorChar)) {
  throw 'Reset target is outside the repository.'
}
if (-not (Test-Path -LiteralPath $baselineRoot -PathType Container)) {
  throw "Baseline folder not found: $baselineRoot"
}

if (Test-Path -LiteralPath $workspaceRoot) {
  Remove-Item -LiteralPath $workspaceRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $workspaceRoot | Out-Null
Get-ChildItem -LiteralPath $baselineRoot -Force | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $workspaceRoot -Recurse -Force
}

Push-Location $workspaceRoot
try {
  npm run check
  if ($LASTEXITCODE -ne 0) {
    throw 'The restored workspace did not pass npm run check.'
  }
} finally {
  Pop-Location
}

Write-Host ''
Write-Host 'Claude demo workspace restored.' -ForegroundColor Green
Write-Host "Open this folder in Claude Code: $workspaceRoot"

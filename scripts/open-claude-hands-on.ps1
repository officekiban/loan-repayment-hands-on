[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repositoryRoot = Split-Path -Parent $scriptRoot
$guidePath = Join-Path $repositoryRoot 'docs\claude-hands-on.html'
$appPath = Join-Path $repositoryRoot 'app\index.html'

& (Join-Path $scriptRoot 'preflight-claude-hands-on.ps1') -SkipPackageCheck
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Start-Process -FilePath $guidePath
Start-Process -FilePath $appPath

Write-Host ''
Write-Host 'Guide and simulator opened in the default browser.' -ForegroundColor Green
Write-Host 'Start the hands-on in this terminal:' -ForegroundColor Cyan
Write-Host '  claude --permission-mode plan'

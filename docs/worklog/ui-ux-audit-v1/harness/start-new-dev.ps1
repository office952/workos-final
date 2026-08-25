$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
$DataDir = Join-Path $Root ".tmp\ui-ux-audit-v1\new-data"
$LogDir = Join-Path $Root ".tmp\ui-ux-audit-v1\logs"
New-Item -ItemType Directory -Force -Path $DataDir, $LogDir | Out-Null

$env:WORKOS_DATA_DIR = $DataDir
$env:PORT = "8787"
Remove-Item Env:WORKOS_CLOUD_ROOT -ErrorAction SilentlyContinue
Remove-Item Env:WORKOS_SQLITE_PATH -ErrorAction SilentlyContinue

$api = Start-Process -FilePath "pnpm" -ArgumentList @("--filter", "@workos-final/api", "start") `
  -WorkingDirectory $Root -WindowStyle Hidden -PassThru `
  -RedirectStandardOutput (Join-Path $LogDir "new-api.out.log") `
  -RedirectStandardError (Join-Path $LogDir "new-api.err.log")

$web = Start-Process -FilePath "pnpm" -ArgumentList @("--filter", "@workos-final/web", "dev", "--", "--host", "127.0.0.1", "--port", "5173") `
  -WorkingDirectory $Root -WindowStyle Hidden -PassThru `
  -RedirectStandardOutput (Join-Path $LogDir "new-web.out.log") `
  -RedirectStandardError (Join-Path $LogDir "new-web.err.log")

@{
  apiPid = $api.Id
  webPid = $web.Id
  dataDir = $DataDir
} | ConvertTo-Json | Set-Content (Join-Path $Root ".tmp\ui-ux-audit-v1\new-runtime.json") -Encoding UTF8

Write-Output "NEW_API_PID=$($api.Id)"
Write-Output "NEW_WEB_PID=$($web.Id)"
Write-Output "WORKOS_DATA_DIR=$DataDir"

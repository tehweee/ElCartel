# dev.ps1 — Clean start for Next.js dev server
# Usage: .\dev.ps1

Write-Host "Stopping any running Node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$lock = "$PSScriptRoot\.next\dev\lock"
if (Test-Path $lock) {
  Remove-Item $lock -Force
  Write-Host "Removed stale lock file." -ForegroundColor Yellow
}

Write-Host "Starting Next.js dev server..." -ForegroundColor Cyan
npm run dev

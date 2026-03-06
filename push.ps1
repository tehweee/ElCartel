# push.ps1 — Stage, commit with a custom message, and push to GitHub
# Usage: .\push.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "         Git Push to GitHub             " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for commit title (required)
do {
  $title = Read-Host "Commit title (required)"
} while ([string]::IsNullOrWhiteSpace($title))

# Prompt for commit description (optional)
$description = Read-Host "Commit description (optional, press Enter to skip)"

Write-Host ""
Write-Host "Staging all changes..." -ForegroundColor Yellow
git add .

if ([string]::IsNullOrWhiteSpace($description)) {
  git commit -m "$title"
} else {
  git commit -m "$title" -m "$description"
}

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Nothing to commit or commit failed. Aborting push." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "Push failed. Check your remote/branch settings." -ForegroundColor Red
}

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

function Find-Python {
  $candidates = @(
    "C:\Users\ASUS\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe",
    "python"
  )
  foreach ($candidate in $candidates) {
    try {
      $cmd = Get-Command $candidate -ErrorAction Stop
      return $cmd.Source
    } catch {
      continue
    }
  }
  throw "Python not found."
}

function Find-Chrome {
  $candidates = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
  )
  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }
  return $null
}

function Run-Step($name, $block) {
  Write-Host ""
  Write-Host "==> $name" -ForegroundColor Cyan
  & $block
}

$Python = Find-Python
$Chrome = Find-Chrome

Run-Step "Check URLs" {
  & $Python "check_guideline_urls.py"
}

Run-Step "Download or print Taiwan guideline PDFs" {
  & $Python "download_taiwan_guidelines.py"
}

Write-Host ""
Write-Host "==> Skip frontend rebuild" -ForegroundColor Cyan
Write-Host "The original ai-teaching-guidelines template is preserved. Run build_guidelines_app.py manually only if you explicitly want to regenerate the app."

if ($Chrome) {
  Run-Step "Render index.html screenshot" {
    $uri = (Resolve-Path ".\index.html").Path.Replace("\", "/")
    & $Chrome `
      "--headless=new" `
      "--disable-gpu" `
      "--allow-file-access-from-files" `
      "--screenshot=$ProjectRoot\app-check.png" `
      "--window-size=1440,1000" `
      "file:///$uri" | Out-Null
  }
} else {
  Write-Host "Chrome or Edge not found; screenshot check skipped." -ForegroundColor Yellow
}

Run-Step "Ensure Git repository" {
  if (!(Test-Path ".git")) {
    git init
    git branch -M main
  }
}

Run-Step "Create local commit" {
  git status --short
  git add .

  $changes = git status --short
  if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
  } else {
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "Refresh AI teaching guidelines backup ($stamp)"
  }
}

Run-Step "Push to GitHub if origin exists" {
  $remote = git remote
  if ($remote -contains "origin") {
    git push
  } else {
    Write-Host "No GitHub remote named origin is configured yet." -ForegroundColor Yellow
    Write-Host "After creating an empty GitHub repo, run:"
    Write-Host "git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPO.git"
    Write-Host "git branch -M main"
    Write-Host "git push -u origin main"
  }
}

Write-Host ""
Write-Host "Done. Local copy and Git commit are ready. GitHub/website need origin + Pages setup." -ForegroundColor Green

# 在 PowerShell 執行： powershell -ExecutionPolicy Bypass -File .\啟動.ps1
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
if (!(Test-Path ".env")) { Copy-Item ".env.example" ".env"; Write-Host "已建立 .env，請先填入 API_KEY 與 PASSCODE 再重新執行" -ForegroundColor Yellow; notepad .env; exit }
if (!(Test-Path "private\prompt.md")) { Write-Host "缺 private\prompt.md（中心專屬 PROMPT）" -ForegroundColor Red }
if (!(Test-Path "private\digest.md")) { Write-Host "缺 private\digest.md（教學指引整理檔）" -ForegroundColor Red }
Start-Process "http://localhost:8787"
python server.py

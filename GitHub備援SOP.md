# AI 教學指引三地備援 SOP

本專案採用三地備援：

1. 本地工作區：`D:\Users\ASUS\Desktop\AI助教\AI教學指引彙整`（唯一的編輯來源）
2. GitHub repository：<https://github.com/nthuhssai2026/ai-teaching-guidelines>（版本歷史、救援點、備用網站）
3. 正式網站：清大人社AI中心 RPAGE 平台 <https://nthuhssai.site.nthu.edu.tw/platform/>（人工上傳）

三地的關係是「本地 → GitHub → RPAGE」單向流動：**永遠只在本地改檔案**，改完先 push 到 GitHub，再把同一份 `index.html`（與有更動的 PDF）上傳到 RPAGE。不要直接在 GitHub 網頁或 RPAGE 後台改內容，否則三地會分歧。

GitHub Pages 版本（<https://nthuhssai2026.github.io/ai-teaching-guidelines/>）會在每次 push 後自動更新，可當作 RPAGE 掛掉時的備用網址，也方便先預覽再上傳 RPAGE。

## 每次更新流程

先在本地完成資料更新：

```powershell
python check_guideline_urls.py
python download_taiwan_guidelines.py
python build_guidelines_app.py
```

再檢查網站：

```powershell
start .\index.html
```

確認正常後提交 Git（push 之後 GitHub Pages 約 1 分鐘內更新）：

```powershell
git status
git add .
git commit -m "Refresh AI teaching guidelines"
git push
```

也可以直接執行：

```powershell
powershell -ExecutionPolicy Bypass -File .\一鍵備援更新.ps1
```

## 更新 RPAGE 正式網站

GitHub push 完成後，登入 RPAGE 後台，把本地的 `index.html` 上傳覆蓋原檔；若這次有新增或更換 `台灣各大學AI教學指引/` 裡的 PDF，也一併上傳到 RPAGE 上相同的資料夾路徑（網頁內的 PDF 連結是相對路徑 `台灣各大學AI教學指引/xx.pdf`）。上傳後開正式網址確認「台灣資料」分頁的 📄 PDF 連結可開。

## GitHub 連線（已設定完成，2026-09-06）

remote `origin` 已指向 <https://github.com/nthuhssai2026/ai-teaching-guidelines>，之後每次只要：

```powershell
git push
```

第一次 push 時 Windows 會跳出 GitHub 登入視窗，用瀏覽器登入一次即可，之後會記住。

## GitHub Pages 發布網站

在 GitHub repository 頁面：

1. 進入 `Settings`
2. 進入 `Pages`
3. Source 選 `Deploy from a branch`
4. Branch 選 `main`
5. Folder 選 `/root`
6. 儲存

之後每次 `git push` 後，GitHub Pages 會重新發布 `index.html`。

## 救援方式

如果本地資料夾壞掉：

```powershell
git clone https://github.com/你的帳號/你的repo名稱.git
```

如果只是某幾個檔案改壞：

```powershell
git log --oneline
git checkout 舊版本ID -- index.html ai-teaching-guidelines.jsx
git commit -m "Restore working website files"
git push
```

如果 RPAGE 正式網站壞掉但 GitHub 正常：

- 先把備用網址 <https://nthuhssai2026.github.io/ai-teaching-guidelines/> 給使用者。
- 從 GitHub 下載 `index.html` 與 PDF 資料夾（或本地 `git pull`），重新上傳 RPAGE。

如果 GitHub Pages 壞掉：到 repo `Settings → Pages` 確認 Source 仍是 `Deploy from a branch`、`main` + `/ (root)`。

## 本專案目前應納入 Git 的重要檔案

- `index.html`
- `ai-teaching-guidelines.jsx`
- `AI教學指引彙整20260424.docx`
- `AI教學指引彙整20260424.pdf`
- `check_guideline_urls.py`
- `download_taiwan_guidelines.py`
- `build_guidelines_app.py`
- `url_check_report.csv`
- `url_check_report.json`
- `台灣各大學AI教學指引/`
- `GitHub備援SOP.md`
- `一鍵備援更新.ps1`
- `.gitattributes`（統一換行符號，避免 Windows/Linux 之間整檔誤判為修改）
- `課程應用/`（八步驟執行文件、分析 PROMPT、指引彙編與 STS 課程建議；網頁「課程應用」分頁的下載連結指向這裡，上傳 RPAGE 時要一併上傳此資料夾）
- `apply_tab.jsx`、`build_apply.py`（「課程應用」分頁的元件與建置腳本；改分頁內容時改 apply_tab.jsx 再重跑 build_apply.py）

## 注意事項

- 不要把 API key、密碼、私人 token 寫進前端或 commit 到 GitHub。
- 若單一檔案超過 100 MB，改用 Git LFS 或外部雲端，不要直接放進 Git。
- 每次重要修改後都應 commit。commit 是救援點，不是最後才做的歸檔。

# AI 教學指引三地備援 SOP

本專案採用三地備援：

1. 本地工作區：`D:\Users\ASUS\Desktop\AI助教\AI教學指引彙整`
2. GitHub repository：保存版本歷史與救援點
3. 網站部署端：建議使用 GitHub Pages 發布 `index.html`

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

確認正常後提交 Git：

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

## 第一次連到 GitHub

先在 GitHub 建立一個空 repository。不要勾選 README、.gitignore 或 license，避免第一次 push 衝突。

然後執行：

```powershell
git remote add origin https://github.com/你的帳號/你的repo名稱.git
git branch -M main
git push -u origin main
```

之後每次只要：

```powershell
git push
```

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

如果網站壞掉但 GitHub 正常：

```powershell
git push
```

或重新到 GitHub Pages 設定頁確認 branch/folder 是否仍是 `main` + `/root`。

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

## 注意事項

- 不要把 API key、密碼、私人 token 寫進前端或 commit 到 GitHub。
- 若單一檔案超過 100 MB，改用 Git LFS 或外部雲端，不要直接放進 Git。
- 每次重要修改後都應 commit。commit 是救援點，不是最後才做的歸檔。

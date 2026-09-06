# AI 課程建議後台（本機版）

老師貼上課程大綱 → 後台注入中心專屬分析 PROMPT 與《教學指引整理檔》→ 回傳課程專屬建議。
PROMPT 與 API 金鑰只存在本機的 `private/` 與 `.env`，不進 Git、不進網頁。

## 第一次啟動
1. 需要 Python 3.9+（`python --version`）。不需安裝任何套件。
2. 把 PROMPT 純文字存成 `private/prompt.md`；把整理檔存成 `private/digest.md`。
3. 複製 `.env.example` 為 `.env`，填 `API_KEY`、`PASSCODE`。
4. 執行 `powershell -ExecutionPolicy Bypass -File .\啟動.ps1`，瀏覽器會開 http://localhost:8787 。

## 省 token 的原理
PROMPT + 整理檔固定放在 system 層並標記 prompt cache（Anthropic）。第一次呼叫寫入快取，
之後 5 分鐘內每次呼叫只為「課綱 + 回答」付全價，快取部分約 1/10 價格。工作坊時多位老師
連續使用最划算。`usage.log` 逐次記錄 token 數，可對帳。

## 搬上雲端時
`server.py` 沒有本機依賴，可直接放到中心主機（`PORT` 改掉、前面加 nginx/https）或改寫成
Cloudflare Worker。公開網站的「課程應用 → AI 課程建議」區塊只需把 `API_BASE` 指向新網址。

## 安全
- `private/`、`.env`、`usage.log` 都在 `.gitignore`。
- 通行碼＋每日上限；被濫用時改 `PASSCODE` 即可。
- 課綱內容會送到模型 API；請老師不要放學生個資。

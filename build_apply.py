import re, json
from pathlib import Path

SITE = Path("/home/claude/site")
SCRATCH = Path("/tmp/claude-0/-home-claude/334ee9ac-7f59-533b-9137-843235357344/scratchpad")
html = (SITE/"index.html").read_text(encoding="utf-8")
assert "function ApplyTab" not in html, "already patched"

# ── 1. GUIDE_DIGEST from 彙編.md ─────────────────────────────
md = (SCRATCH/"彙編.md").read_text(encoding="utf-8")
themes = []
for block in re.split(r"\n# ", md)[1:]:
    head, _, body = block.partition("\n")
    m = re.match(r"[一二三四五六七八九十]+、主題[一二三四五六七八九十]+：(.+)", head.strip())
    if not m:
        continue
    title = m.group(1).strip()
    quotes = []
    for q in re.findall(r"^> (.+)$", body, flags=re.M):
        q = q.strip()
        mm = re.match(r"(.+?)——\[(\d\d) ([^\]]+)\](.*)$", q)
        if mm:
            text, n, org, tail = mm.groups()
            src = f"{n} {org}"
            if tail.strip():
                text = text.strip() + " " + tail.strip()
        else:
            mm2 = re.match(r"(.+?)——（(.+)）$", q)
            text, src = (mm2.group(1), "本課課綱") if mm2 else (q, "")
        quotes.append({"text": text.strip(), "src": src})
    note = re.search(r"\*\*彙整說明\*\*：(.+)", body)
    themes.append({"title": title, "quotes": quotes, "note": note.group(1).strip() if note else ""})
assert len(themes) == 11, len(themes)

empty_sources = [
    ["02","國科會 行政院及所屬機關（構）使用生成式AI參考指引","只有網站側欄與目錄，未含指引本文","改抓 detail 頁或行政院公告 PDF"],
    ["03","國科會 生成式AI指引FAQ","僅四則行政面 Q&A（非強制性、封閉式地端等）","保留，但不屬教學指引"],
    ["04","教育部 中小學數位教學指引3.0","入口網首頁（班班有網路）","改抓 download.php 內的指引 PDF"],
    ["05","教育部 中小學使用生成式人工智慧注意事項","下載清單頁，無內文","下載「注意事項 2.1 教師版／學生版」PDF"],
    ["13","中山大學 生成式AI工具使用參照指引","僅 6 個 PDF 的連結清單","下載學生版、教師版 PDF"],
    ["14","高雄大學 AI生成工具使用指引","403 錯誤頁（下載記錄已標 FAILED）","改由學校官網取得"],
    ["19","陽明交通大學 因應生成式AI之指引及教學建議","僅三份文件的連結清單","下載「教師應用生成式AI之教學建議」PDF"],
    ["21","臺中教育大學 生成式AI工具之教學與學習因應措施","網站維護中","擇日重抓"],
    ["26","逢甲大學 針對生成式AI工具之教學因應措施","內容為圖片，未抽出文字","OCR 或向教發中心索取文字版"],
    ["27","慈濟大學 AI賦能大學教育指引","403 拒絕存取","改由學校官網取得"],
]


def js(v):  # safe JS literal
    return json.dumps(v, ensure_ascii=False)

data_block = (
    "\n// ─── 課程應用資料（由 build_apply.py 產生） ─────────────────\n"
    f"const GUIDE_DIGEST = {json.dumps(themes, ensure_ascii=False, indent=1)};\n"
    f"const GUIDE_EMPTY_SOURCES = {json.dumps([dict(n=a,name=b,got=c,fix=d) for a,b,c,d in empty_sources], ensure_ascii=False, indent=1)};\n"
)
component_block = (SITE/"apply_tab.jsx").read_text(encoding="utf-8")

# ── 2. patches ───────────────────────────────────────────────
def sub(old, new, count=1):
    global html
    assert html.count(old) >= 1, f"not found: {old[:60]}"
    html = html.replace(old, new, count)

# tab
sub('  { id: "howto",     icon: "🧭", label: "使用說明" },',
    '  { id: "howto",     icon: "🧭", label: "使用說明" },\n  { id: "apply",     icon: "🎯", label: "課程應用" },')

# Taiwan data: add 6 entries with content that were downloaded but never listed
new_rows = [
  (19,"大學校級","亞洲大學","針對生成式AI工具之教學因應措施","教師教學支援","https://ac.asia.edu.tw/xhr/announcements/file/664ac4588199fb6b7a9ceac3/%E4%BA%9E%E5%A4%A7%E9%87%9D%E5%B0%8D%E7%94%9F%E6%88%90%E5%BC%8FAI%E5%B7%A5%E5%85%B7%E4%B9%8B%E6%95%99%E5%AD%B8%E5%9B%A0%E6%87%89%E6%8E%AA%E6%96%BD_2024%E7%89%88.pdf","2024-05-13"),
  (20,"大學校級","高雄科大","針對生成式AI工具之教學因應措施","教師教學支援","https://acad.nkust.edu.tw/p/412-1004-9405.php?Lang=zh-tw",""),
  (21,"大學校級","雲科大","生成式AI工具教學須知","治理框架","https://aax.yuntech.edu.tw/images/content/%E6%95%99%E5%8B%99%E7%AB%A0%E5%89%87/%E5%85%B6%E4%BB%96%E9%A1%9E/T13%E7%94%9F%E6%88%90%E5%BC%8FAI%E5%B7%A5%E5%85%B7%E6%95%99%E5%AD%B8%E9%A0%88%E7%9F%A5(112.9.12).pdf","2023-09-12"),
  (22,"大學校級","暨南","針對生成式AI工具之教學因應措施","教師教學支援","https://ctld.ncnu.edu.tw/var/file/62/1062/img/578134211.pdf",""),
  (23,"大學校級","中央","學生使用ChatGPT基本原則","學生使用指引","https://pdc.adm.ncu.edu.tw/static/file/19/1019/img/615451190.pdf",""),
  (24,"大學校級","長庚","生成式AI的教研衝擊與因應","教師教學支援","https://www.cgu.edu.tw/cfir/Subject/Detail/59531?nodeId=16468","2024-11-13"),
]
rows_js = "".join(
    f',\n  {{\n    "id": {i},\n    "level": "{lv}",\n    "inst": "{inst}",\n    "name": "{nm}",\n    "type": "{ty}",\n    "url": "{u}",\n    "date": "{d}",\n    "status": "已核實 2026-06-17；PDF已存檔；2026-09-06 補列"\n  }}'
    for i,lv,inst,nm,ty,u,d in new_rows)
sub('    "status": "已核實 2026-06-17；PDF已存檔"\n  }\n];\n\nconst INTL_ORGS',
    '    "status": "已核實 2026-06-17；PDF已存檔"\n  }' + rows_js + '\n];\n\nconst INTL_ORGS')

# mark pending ones (PDF is a web shell)
for i in (2,3,4,11,12,17,18):
    pat = re.compile(r'("id": %d,\n(?:.*\n){6}\s*"status": )"已核實 2026-06-17；PDF已存檔"' % i)
    html, n = pat.subn(r'\1"URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"', html, count=1)
    assert n == 1, i

sub('  18: "台灣各大學AI教學指引/27_慈濟大學_AI賦能大學教育指引.pdf",\n};',
    '  18: "台灣各大學AI教學指引/27_慈濟大學_AI賦能大學教育指引.pdf",\n'
    '  19: "台灣各大學AI教學指引/10_亞洲大學_針對生成式AI工具之教學因應措施.pdf",\n'
    '  20: "台灣各大學AI教學指引/15_高雄科大_針對生成式AI工具之教學因應措施.pdf",\n'
    '  21: "台灣各大學AI教學指引/17_雲科大_生成式AI工具教學須知.pdf",\n'
    '  22: "台灣各大學AI教學指引/20_暨南大學_針對生成式AI工具之教學因應措施.pdf",\n'
    '  23: "台灣各大學AI教學指引/22_中央大學_學生使用ChatGPT基本原則.pdf",\n'
    '  24: "台灣各大學AI教學指引/24_長庚大學_生成式AI的教研衝擊與因應.pdf",\n'
    '};\n// 2026-09-06 人工抽查：這些 id 的本地 PDF 只是網頁殼／清單頁／錯誤頁，尚無指引本文\n'
    'const TAIWAN_PDF_PENDING = new Set([2,3,4,11,12,17,18]);')

# StatusDot: 待補 → warn
sub('const warn = status.includes("缺日期") || status.includes("需人工") || status.includes("複核");',
    'const warn = status.includes("缺日期") || status.includes("需人工") || status.includes("複核") || status.includes("待補");')

# TaiwanTab header + PDF link
sub('sub="18 筆台灣各層級機構 AI 教學指引；核實狀態已比對 2026-06-17 PDF 下載與 URL 檢查紀錄。"',
    'sub="24 筆台灣各層級機構 AI 教學指引；URL 核實 2026-06-17；2026-09-06 人工抽查本地 PDF 內容，7 筆存檔為網頁殼者標為「備份待補」。"')
sub('''                <span style={{ fontSize:11, color:C.orange, background:C.orangeBg, padding:"2px 8px", borderRadius:4 }}>{r.status}</span>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.sky, textDecoration:"none" }}>🔗 前往</a>}
                {TAIWAN_PDF_FILES[r.id] && <a href={TAIWAN_PDF_FILES[r.id]} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.teal, textDecoration:"none" }}>📄 PDF</a>}''',
'''                <span style={{ fontSize:11, color:TAIWAN_PDF_PENDING.has(r.id)?C.amber:C.orange, background:TAIWAN_PDF_PENDING.has(r.id)?C.amberBg:C.orangeBg, padding:"2px 8px", borderRadius:4 }}>{r.status}</span>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.sky, textDecoration:"none" }}>🔗 前往</a>}
                {TAIWAN_PDF_FILES[r.id] && !TAIWAN_PDF_PENDING.has(r.id) && <a href={TAIWAN_PDF_FILES[r.id]} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.teal, textDecoration:"none" }}>📄 PDF</a>}
                {TAIWAN_PDF_PENDING.has(r.id) && <span title="本地存檔僅為網頁截圖，尚無指引本文；見「課程應用 → 資料缺口」" style={{ fontSize:11, color:C.amber, fontWeight:700 }}>⚠ 備份待補</span>}''')

# Summary stats / actions / dates
sub('["18","台灣機構資料筆數",C.teal],', '["24","台灣機構資料筆數",C.teal],')
sub('    ["howto","查看使用流程","依六步流程整理教材並上傳分析 PROMPT"],',
    '    ["apply","課程應用實作","八步驟流程、指引彙編、提示詞範本與 STS 課程範例"],')
sub('資料更新<br/><strong style={{ color:C.navy, fontSize:13 }}>2026-06-30</strong>',
    '資料更新<br/><strong style={{ color:C.navy, fontSize:13 }}>2026-09-06</strong>')
sub('<span style={{ background:"rgba(16,185,129,0.15)", color:"#34d399", fontSize:10, padding:"2px 6px", borderRadius:4 }}>更新 06-30</span>',
    '<span style={{ background:"rgba(16,185,129,0.15)", color:"#34d399", fontSize:10, padding:"2px 6px", borderRadius:4 }}>更新 09-06</span>')
sub('最後文件更新：2026-06-30', '最後文件更新：2026-09-06')
sub('            ["待補正式 URL","3 筆","優先確認官方來源"],',
    '            ["待補正式 URL","3 筆","優先確認官方來源"],\n            ["台灣 PDF 備份待補","7 筆","存檔為網頁殼，見課程應用→資料缺口"],')
sub('人工蒐集與來源查核、中文化摘要與初步分類、網頁篩選查詢及台灣指引本地備份。',
    '人工蒐集與來源查核、中文化摘要與初步分類、網頁篩選查詢及台灣指引本地備份；以 STS 課程完成「指引 → 課程專屬建議」八步驟實作（見課程應用）。')

# Howto: point to apply tab
sub('    ["教師要整理課程素材", "先完成下方工作流程，並在同一個 AI 工作區上傳課程大綱、教學指引整理檔與分析 PROMPT。"],',
    '    ["教師要整理課程素材", "先完成下方工作流程，並在同一個 AI 工作區上傳課程大綱、教學指引整理檔與分析 PROMPT。完整實作範例與可複製的提示詞見「課程應用」分頁。"],')

# Updates tab SOP: add pending list item
sub('          "每學期更新一次；若台灣法規或校級政策更新，立即重新查核相關段落",',
    '          "每學期更新一次；若台灣法規或校級政策更新，立即重新查核相關段落",\n          "本地 PDF 備份除檢查 HTTP 狀態外，須人工開檔確認有指引本文（2026-09-06 抽查：7 筆僅為網頁殼，待補）",')
sub('borderBottom:i<5?`1px solid ${C.border}`:"none"', 'borderBottom:i<6?`1px solid ${C.border}`:"none"')

# App content map
sub('    howto:     <HowtoTab />,', '    howto:     <HowtoTab />,\n    apply:     <ApplyTab onNavigate={navigateTo} />,')

# insert data + component before Badge
sub('function Badge({ code }) {', data_block + component_block + '\nfunction Badge({ code }) {')

(SITE/"index.html").write_text(html, encoding="utf-8")

# ── 3. regenerate jsx from html ──────────────────────────────
body = html.split('<script type="text/babel">\n',1)[1].split('\nReactDOM.createRoot',1)[0]
body = body.replace('const {useState,useEffect,useMemo}=React;', 'import { useState, useEffect, useMemo } from "react";', 1)
body = body.replace('\nfunction App() {', '\nexport default function App() {', 1)
(SITE/"ai-teaching-guidelines.jsx").write_text(body.rstrip()+"\n", encoding="utf-8")
print("ok", len(html), "themes", len(themes), "quotes", sum(len(t["quotes"]) for t in themes))

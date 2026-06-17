import csv
import json
import re
from pathlib import Path

from docx import Document


BASE = Path(__file__).resolve().parent
DOCX = BASE / "AI教學指引彙整20260424.docx"
URL_REPORT = BASE / "url_check_report.csv"
DOWNLOAD_LOG = BASE / "台灣各大學AI教學指引" / "taiwan_guidelines_download_log.csv"
JSX_OUT = BASE / "ai-teaching-guidelines.jsx"
HTML_OUT = BASE / "index.html"


URL_RE = re.compile(r"https?://[^\s\]）＞>\"']+", re.I)


def clean_cell(cell):
    return " ".join(cell.text.split()).strip()


def clean_url(raw):
    raw = raw.replace("https://sites.google. com/", "https://sites.google.com/")
    url = raw.strip()
    while url and url[-1] in "。；;）)":
        url = url[:-1]
    return url


def first_url(text):
    fixed = text.replace("https://sites.google. com/", "https://sites.google.com/")
    m = URL_RE.search(fixed)
    return clean_url(m.group(0)) if m else ""


def extract_text_before_url(text):
    fixed = text.replace("https://sites.google. com/", "https://sites.google.com/")
    m = URL_RE.search(fixed)
    return fixed[: m.start()].strip() if m else fixed.strip()


def classify(title, desc=""):
    s = f"{title} {desc}".lower()
    if any(k in s for k in ["syllabus", "course polic", "sample", "課綱"]):
        return "課綱政策範本"
    if any(k in s for k in ["assessment", "評量", "academic integrity", "學術誠信"]):
        return "評量與學術誠信"
    if any(k in s for k in ["competency", "literacy", "素養"]):
        return "AI素養框架"
    if any(k in s for k in ["governance", "基本法", "policy", "政策"]):
        return "治理與政策框架"
    if any(k in s for k in ["student", "學生"]):
        return "學生使用指引"
    if any(k in s for k in ["teacher", "instructor", "teaching", "教師", "教學"]):
        return "教師教學支援"
    if any(k in s for k in ["research", "研究"]):
        return "研究倫理與研究使用"
    return "待編碼"


def read_csv(path):
    if not path.exists():
        return []
    with path.open(encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def status_map():
    rows = read_csv(URL_REPORT)
    out = {}
    for r in rows:
        out[r["url"]] = {
            "urlStatus": r["status"],
            "statusCode": r["status_code"],
            "finalUrl": r["final_url"] or r["url"],
            "error": r["error"],
        }
    return out


def normalize_status(url, status_lookup):
    if not url:
        return {"urlStatus": "MISSING", "statusCode": "", "finalUrl": "", "error": "缺 URL"}
    if not url.startswith("http"):
        return {"urlStatus": "MISSING", "statusCode": "", "finalUrl": "", "error": "非正式 URL"}
    if url in status_lookup:
        return status_lookup[url]
    return {"urlStatus": "未批次檢查", "statusCode": "", "finalUrl": url, "error": ""}


def load_data():
    doc = Document(DOCX)
    tables = doc.tables
    lookup = status_map()

    syllabus = []
    for i, row in enumerate(tables[0].rows[1:], 1):
        cells = [clean_cell(c) for c in row.cells]
        resource = cells[2] if len(cells) > 2 else ""
        desc = cells[3] if len(cells) > 3 else ""
        url = first_url(resource)
        syllabus.append({
            "id": i,
            "institution": cells[1] if len(cells) > 1 else "",
            "name": extract_text_before_url(resource),
            "url": url,
            "type": classify(resource, desc),
            "summary": desc,
            **normalize_status(url, lookup),
        })

    intl = []
    for i, row in enumerate(tables[2].rows[1:], 1):
        cells = [clean_cell(c) for c in row.cells]
        resource = cells[2] if len(cells) > 2 else ""
        desc = cells[3] if len(cells) > 3 else ""
        url = first_url(resource)
        intl.append({
            "id": i,
            "org": cells[1] if len(cells) > 1 else "",
            "name": extract_text_before_url(resource),
            "url": url,
            "type": classify(resource, desc),
            "summary": desc,
            **normalize_status(url, lookup),
        })

    keyuni = []
    for i, row in enumerate(tables[3].rows[1:], 1):
        cells = [clean_cell(c) for c in row.cells]
        resource = cells[2] if len(cells) > 2 else ""
        desc = cells[3] if len(cells) > 3 else ""
        url = first_url(resource)
        keyuni.append({
            "id": i,
            "institution": cells[1] if len(cells) > 1 else "",
            "name": extract_text_before_url(resource),
            "url": url,
            "type": classify(resource, desc),
            "summary": desc,
            **normalize_status(url, lookup),
        })

    globaldb = []
    for i, row in enumerate(tables[4].rows[1:], 1):
        cells = [clean_cell(c) for c in row.cells]
        url = cells[5] if len(cells) > 5 else ""
        if not url.startswith("http"):
            url = first_url(url)
        title = cells[3] if len(cells) > 3 else ""
        globaldb.append({
            "id": i,
            "region": cells[0] if len(cells) > 0 else "",
            "country": cells[1] if len(cells) > 1 else "",
            "institution": cells[2] if len(cells) > 2 else "",
            "name": title,
            "date": cells[4] if len(cells) > 4 else "",
            "url": url,
            "type": classify(title),
            **normalize_status(url, lookup),
        })

    downloads = read_csv(DOWNLOAD_LOG)
    taiwan = []
    for r in downloads:
        file_path = Path(r["file"])
        rel_file = file_path.relative_to(BASE).as_posix() if file_path.exists() else ""
        taiwan.append({
            "id": int(r["id"]),
            "org": r["org"],
            "name": r["name"],
            "url": r["url"],
            "kind": r["kind"],
            "downloadStatus": r["status"],
            "pdfFile": rel_file,
            "message": r["message"],
            **normalize_status(r["url"], lookup),
        })

    url_rows = read_csv(URL_REPORT)
    url_summary = {
        "total": len(url_rows),
        "ok": sum(1 for r in url_rows if r["status"] == "OK"),
        "error": sum(1 for r in url_rows if r["status"] != "OK"),
    }

    return {
        "generatedAt": "2026-06-17",
        "urlSummary": url_summary,
        "taiwan": taiwan,
        "syllabus": syllabus,
        "intl": intl,
        "keyuni": keyuni,
        "globaldb": globaldb,
        "urlChecks": url_rows,
    }


APP_TEMPLATE = r'''
import { useMemo, useState } from "react";

const DATA = __DATA__;

const C = {
  ink: "#172033",
  muted: "#667085",
  bg: "#f6f8fb",
  surface: "#ffffff",
  line: "#d9e0ea",
  blue: "#2563eb",
  green: "#15803d",
  red: "#b42318",
  amber: "#b45309",
  slate: "#334155",
};

function statusColor(status) {
  if (status === "OK") return C.green;
  if (status === "MISSING" || status === "ERROR" || status === "FAILED") return C.red;
  return C.amber;
}

function StatusBadge({ status, label }) {
  const color = statusColor(status);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      color, background: `${color}12`, border: `1px solid ${color}35`,
      borderRadius: 999, padding: "3px 8px", fontSize: 12, whiteSpace: "nowrap"
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      {label || status}
    </span>
  );
}

function LinkButton({ href, children }) {
  if (!href) return <span style={{ color: C.muted }}>無</span>;
  return <a href={href} target="_blank" rel="noreferrer"
    style={{ color: C.blue, fontWeight: 600, textDecoration: "none" }}>{children}</a>;
}

function Card({ children, style }) {
  return <section style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8, padding: 16, ...style }}>{children}</section>;
}

function Header({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0, color: C.ink, fontSize: 22 }}>{title}</h2>
      {subtitle && <p style={{ margin: "6px 0 0", color: C.muted, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

function Summary() {
  const twOk = DATA.taiwan.filter(x => x.downloadStatus === "OK").length;
  const broken = DATA.urlChecks.filter(x => x.status !== "OK");
  return (
    <div>
      <Header title="AI 教學指引資料檢核總覽" subtitle={`更新日：${DATA.generatedAt}。資料以 Word 原表格、URL 批次檢查、台灣 PDF 下載紀錄整併。`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
        <Metric label="URL 總數" value={DATA.urlSummary.total} />
        <Metric label="URL 正常" value={DATA.urlSummary.ok} tone="green" />
        <Metric label="URL 需處理" value={DATA.urlSummary.error} tone="red" />
        <Metric label="台灣 PDF 存檔" value={`${twOk}/${DATA.taiwan.length}`} tone="green" />
      </div>
      <Card>
        <h3 style={{ marginTop: 0 }}>主要結論</h3>
        <ul style={{ margin: 0, paddingLeft: 20, color: C.ink, lineHeight: 1.8 }}>
          <li>原 JSX/HTML 有嚴重亂碼與 JSX 字串錯誤，已重建為乾淨、可維護的資料介面。</li>
          <li>台灣來源已成功下載或轉存 {twOk} / {DATA.taiwan.length} 筆 PDF，檔案存於 <code>台灣各大學AI教學指引</code>；失敗項目已保留在下載紀錄中。</li>
          <li>URL 批次檢查目前仍有 {broken.length} 筆需人工確認；部分是網站阻擋、SSL 或原始資料搬移。</li>
          <li>前端已移除直接呼叫 Claude API 的功能。API 金鑰不應放在瀏覽器端，後續若要自動更新應改用後端或排程腳本。</li>
        </ul>
      </Card>
    </div>
  );
}

function Metric({ label, value, tone }) {
  const color = tone === "green" ? C.green : tone === "red" ? C.red : C.blue;
  return (
    <Card>
      <div style={{ color: C.muted, fontSize: 13 }}>{label}</div>
      <div style={{ color, fontWeight: 800, fontSize: 28, marginTop: 6 }}>{value}</div>
    </Card>
  );
}

function Taiwan() {
  return (
    <DataTable
      title="台灣教學指引與 PDF 存檔"
      subtitle="PDF 欄位可直接開啟本機已下載/轉存的檔案。狀態為瀏覽器端檢核與下載紀錄，不等同內容已逐字審定。"
      rows={DATA.taiwan}
      columns={[
        ["org", "機構"],
        ["name", "文件名稱"],
        ["kind", "來源型態"],
        ["downloadStatus", "PDF存檔", r => <StatusBadge status={r.downloadStatus} />],
        ["urlStatus", "URL", r => <StatusBadge status={r.urlStatus} label={r.statusCode ? `${r.urlStatus} ${r.statusCode}` : r.urlStatus} />],
        ["url", "來源", r => <LinkButton href={r.url}>開啟</LinkButton>],
        ["pdfFile", "PDF", r => <LinkButton href={r.pdfFile}>PDF</LinkButton>],
      ]}
    />
  );
}

function Resources({ kind }) {
  const config = {
    syllabus: ["課綱政策與教師可用資源", DATA.syllabus, "institution"],
    intl: ["國際機構 AI 教育框架", DATA.intl, "org"],
    keyuni: ["國際重點大學 AI 教學指引", DATA.keyuni, "institution"],
  }[kind];
  return (
    <DataTable
      title={config[0]}
      rows={config[1]}
      columns={[
        [config[2], "機構"],
        ["name", "文件名稱"],
        ["type", "初步類型"],
        ["urlStatus", "URL狀態", r => <StatusBadge status={r.urlStatus} label={r.statusCode ? `${r.urlStatus} ${r.statusCode}` : r.urlStatus} />],
        ["url", "來源", r => <LinkButton href={r.url}>開啟</LinkButton>],
        ["summary", "摘要"],
      ]}
    />
  );
}

function GlobalDB() {
  return (
    <DataTable
      title="全球大學 AI 教學指引資料庫"
      subtitle="保留原始 90 筆資料並加上 URL 狀態。日期空白或 URL 失效者應列為下一輪查核優先項。"
      rows={DATA.globaldb}
      searchable
      columns={[
        ["region", "區域"],
        ["country", "國家"],
        ["institution", "機構"],
        ["name", "文件名稱"],
        ["date", "日期", r => r.date || <span style={{ color: C.amber }}>待補</span>],
        ["type", "類型"],
        ["urlStatus", "URL", r => <StatusBadge status={r.urlStatus} label={r.statusCode ? `${r.urlStatus} ${r.statusCode}` : r.urlStatus} />],
        ["url", "來源", r => <LinkButton href={r.url}>開啟</LinkButton>],
      ]}
    />
  );
}

function Templates() {
  const templates = [
    ["A 原則禁止型", "本課程的主要學習目標包含個人閱讀、論證、寫作與判斷能力的培養。除教師於特定作業另行說明外，學生不得使用生成式 AI 產生提綱、論點、段落、引用資料或最終提交內容。若使用 AI 作為字詞查詢或一般背景理解工具，仍須自行查證並於作業中揭露。"],
    ["B 有限允許型", "學生可以使用生成式 AI 進行發想、資料搜尋輔助、語句潤飾、程式除錯或概念複習，但不得直接提交未經判斷、查證與改寫的 AI 生成內容。學生須在作業末尾註明使用的工具、使用目的、主要提示詞摘要，以及哪些部分受到 AI 協助。"],
    ["C 指定任務允許型", "本課程僅允許在教師指定的任務中使用生成式 AI。每項作業會明列可使用與不可使用的範圍。未列為可使用的作業，視同不得使用。違反規定且未揭露者，將依本校學術誠信規範處理。"],
    ["D AI 素養導向型", "本課程鼓勵學生以批判方式使用生成式 AI，並將 AI 產出視為需要驗證、比較與修正的材料，而非權威答案。學生須對最終提交內容負完全責任，包含事實正確性、引用完整性、偏誤辨識與倫理考量。"],
  ];
  return (
    <div>
      <Header title="授課大綱 AI 使用政策模板" subtitle="可直接作為 syllabus 初稿，再依課程目標與作業型態修訂。" />
      <div style={{ display: "grid", gap: 12 }}>
        {templates.map(([title, body]) => (
          <Card key={title}>
            <h3 style={{ margin: "0 0 8px", color: C.ink }}>{title}</h3>
            <p style={{ margin: 0, lineHeight: 1.8, color: C.ink }}>{body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UrlChecks() {
  return (
    <DataTable
      title="URL 批次檢查報告"
      subtitle="狀態來自本機批次檢查。403/SSL/timeout 需人工開啟複核；404 通常代表原始資料已搬移或截斷。"
      rows={DATA.urlChecks}
      searchable
      columns={[
        ["table", "表"],
        ["row", "列"],
        ["status", "狀態", r => <StatusBadge status={r.status} label={r.status_code ? `${r.status} ${r.status_code}` : r.status} />],
        ["url", "URL", r => <LinkButton href={r.url}>{r.url}</LinkButton>],
        ["error", "錯誤/備註"],
      ]}
    />
  );
}

function DataTable({ title, subtitle, rows, columns, searchable }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(r => JSON.stringify(r).toLowerCase().includes(needle));
  }, [q, rows]);
  return (
    <div>
      <Header title={title} subtitle={subtitle} />
      {searchable && (
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋機構、國家、文件名稱或 URL"
          style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 8, marginBottom: 12 }} />
      )}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#eef3f8" }}>
                {columns.map(([key, label]) => <th key={key} style={{ textAlign: "left", padding: 10, color: C.slate, borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map(([key, label, render]) => (
                    <td key={key} style={{ padding: 10, borderBottom: `1px solid ${C.line}`, verticalAlign: "top", color: C.ink, maxWidth: key === "summary" || key === "error" ? 360 : 260 }}>
                      {render ? render(row) : row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>顯示 {filtered.length} / {rows.length} 筆</div>
    </div>
  );
}

export default function App() {
  const tabs = [
    ["summary", "總覽"],
    ["taiwan", "台灣指引"],
    ["syllabus", "課綱資源"],
    ["intl", "國際框架"],
    ["keyuni", "重點大學"],
    ["global", "全球資料庫"],
    ["templates", "課綱模板"],
    ["urls", "URL檢查"],
  ];
  const [tab, setTab] = useState("summary");
  const view = {
    summary: <Summary />,
    taiwan: <Taiwan />,
    syllabus: <Resources kind="syllabus" />,
    intl: <Resources kind="intl" />,
    keyuni: <Resources kind="keyuni" />,
    global: <GlobalDB />,
    templates: <Templates />,
    urls: <UrlChecks />,
  }[tab];
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: C.bg, fontFamily: "'Noto Sans TC', system-ui, sans-serif" }}>
      <aside style={{ width: 210, background: C.ink, color: "white", padding: 14, position: "sticky", top: 0, height: "100vh", boxSizing: "border-box" }}>
        <h1 style={{ fontSize: 18, lineHeight: 1.3, margin: "4px 0 16px" }}>AI 教學指引資料檢核</h1>
        <nav style={{ display: "grid", gap: 6 }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ textAlign: "left", border: 0, borderRadius: 6, padding: "9px 10px", cursor: "pointer", color: "white", background: tab === id ? C.blue : "transparent", fontWeight: tab === id ? 700 : 500 }}>
              {label}
            </button>
          ))}
        </nav>
        <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 18, lineHeight: 1.5 }}>
          URL 檢查：{DATA.urlSummary.ok}/{DATA.urlSummary.total}<br />
          台灣 PDF：{DATA.taiwan.filter(x => x.downloadStatus === "OK").length}/{DATA.taiwan.length}
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24, minWidth: 0 }}>
        {view}
      </main>
    </div>
  );
}
'''


HTML_TEMPLATE = r'''<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AI 教學指引資料檢核</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; }
    code { background: #eef3f8; padding: 1px 5px; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
__INLINE_APP__
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
'''


def main():
    data = load_data()
    data_json = json.dumps(data, ensure_ascii=False, indent=2)
    jsx = APP_TEMPLATE.replace("__DATA__", data_json)
    JSX_OUT.write_text(jsx, encoding="utf-8")

    inline = jsx.replace('import { useMemo, useState } from "react";', "const { useMemo, useState } = React;")
    inline = inline.replace("export default function App()", "function App()")
    html = HTML_TEMPLATE.replace("__INLINE_APP__", inline)
    HTML_OUT.write_text(html, encoding="utf-8")
    print(json.dumps({
        "jsx": str(JSX_OUT),
        "html": str(HTML_OUT),
        "taiwan": len(data["taiwan"]),
        "global": len(data["globaldb"]),
        "urlChecks": len(data["urlChecks"]),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()

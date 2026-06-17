import csv
import json
import re
import ssl
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from docx import Document


BASE = Path(__file__).resolve().parent
DOCX = BASE / "AI教學指引彙整20260424.docx"
OUT_CSV = BASE / "url_check_report.csv"
OUT_JSON = BASE / "url_check_report.json"

URL_RE = re.compile(r"https?://[^\s\]\)）＞>\"'，,。；;]+", re.I)


def clean_url(url: str) -> str:
    url = url.strip()
    while url and url[-1] in ".。,)）;；":
        url = url[:-1]
    return url


def table_context(table_index, row_index, row):
    cells = [" ".join(c.text.split()) for c in row.cells]
    return {
        "table": table_index,
        "row": row_index,
        "context": " | ".join(cells)[:600],
    }


def extract_urls():
    doc = Document(DOCX)
    found = {}
    for ti, table in enumerate(doc.tables, start=1):
        for ri, row in enumerate(table.rows, start=1):
            ctx = table_context(ti, ri, row)
            for cell in row.cells:
                for raw in URL_RE.findall(cell.text):
                    url = clean_url(raw)
                    if url not in found:
                        found[url] = ctx
    return [{"url": url, **ctx} for url, ctx in found.items()]


def request_url(url, method="HEAD"):
    headers = {
        "User-Agent": "Mozilla/5.0 URLCheck/1.0",
        "Accept": "text/html,application/pdf,application/xhtml+xml,*/*;q=0.8",
    }
    req = Request(url, headers=headers, method=method)
    ctx = ssl.create_default_context()
    with urlopen(req, timeout=18, context=ctx) as resp:
        return {
            "status_code": getattr(resp, "status", None) or resp.getcode(),
            "final_url": resp.geturl(),
            "content_type": resp.headers.get("Content-Type", ""),
        }


def check_one(item):
    url = item["url"]
    started = time.time()
    try:
        result = request_url(url, "HEAD")
        status = "OK" if 200 <= int(result["status_code"]) < 400 else "CHECK"
    except HTTPError as e:
        if e.code in (403, 405, 406, 429):
            try:
                result = request_url(url, "GET")
                status = "OK" if 200 <= int(result["status_code"]) < 400 else "CHECK"
            except Exception as e2:
                return {**item, "status": "ERROR", "status_code": "", "final_url": "", "content_type": "", "error": str(e2), "elapsed_sec": round(time.time() - started, 2)}
        else:
            return {**item, "status": "ERROR", "status_code": e.code, "final_url": getattr(e, "url", ""), "content_type": "", "error": str(e), "elapsed_sec": round(time.time() - started, 2)}
    except (URLError, TimeoutError, ssl.SSLError, ValueError) as e:
        return {**item, "status": "ERROR", "status_code": "", "final_url": "", "content_type": "", "error": str(e), "elapsed_sec": round(time.time() - started, 2)}
    except Exception as e:
        return {**item, "status": "ERROR", "status_code": "", "final_url": "", "content_type": "", "error": repr(e), "elapsed_sec": round(time.time() - started, 2)}

    return {**item, **result, "status": status, "error": "", "elapsed_sec": round(time.time() - started, 2)}


def main():
    urls = extract_urls()
    results = []
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = [pool.submit(check_one, item) for item in urls]
        for fut in as_completed(futures):
            results.append(fut.result())

    results.sort(key=lambda r: (r["table"], r["row"], r["url"]))

    fields = ["table", "row", "status", "status_code", "url", "final_url", "content_type", "error", "elapsed_sec", "context"]
    with OUT_CSV.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in results:
            writer.writerow({k: r.get(k, "") for k in fields})

    OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    ok = sum(1 for r in results if r["status"] == "OK")
    err = sum(1 for r in results if r["status"] == "ERROR")
    check = len(results) - ok - err
    print(json.dumps({"total": len(results), "ok": ok, "check": check, "error": err, "csv": str(OUT_CSV), "json": str(OUT_JSON)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

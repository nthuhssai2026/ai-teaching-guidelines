import csv
import os
import re
import shutil
import subprocess
import tempfile
import time
from pathlib import Path
from urllib.request import Request, urlopen

from pypdf import PdfReader


BASE = Path(__file__).resolve().parent
OUT_DIR = BASE / "台灣各大學AI教學指引"
LOG_PATH = OUT_DIR / "taiwan_guidelines_download_log.csv"

CHROME_CANDIDATES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
]
CHROME = next((p for p in CHROME_CANDIDATES if p.exists()), None)


ITEMS = [
    {"id": 1, "org": "數位發展部", "name": "人工智慧基本法", "url": "https://moda.gov.tw/major-policies/ai/governance/19248.html", "kind": "html"},
    {"id": 2, "org": "國科會", "name": "行政院及所屬機關構使用生成式AI參考指引", "url": "https://www.nstc.gov.tw/folksonomy/list/c79bf57b-dc94-4aff-8d14-3262b5559cfc?l=ch", "kind": "html"},
    {"id": 3, "org": "國科會", "name": "生成式AI指引FAQ", "url": "https://www.nstc.gov.tw/folksonomy/detail/d21566a0-3465-4b63-84b7-5d7cb2e1e5ff?l=ch", "kind": "html"},
    {"id": 4, "org": "教育部", "name": "中小學數位教學指引3.0", "url": "https://pads.moe.edu.tw", "kind": "html"},
    {"id": 5, "org": "教育部", "name": "中小學使用生成式人工智慧注意事項", "url": "https://pads.moe.edu.tw/download.php", "kind": "html"},
    {"id": 6, "org": "臺灣學術倫理教育學會", "name": "人工智慧技術對學術倫理的影響及因應建議", "url": "https://www.taaee.org.tw/docs/20230223_conclusion_final.pdf", "kind": "pdf"},
    {"id": 7, "org": "臺師大", "name": "生成式AI之學習應用及參考指引", "url": "https://ctld.ntnu.edu.tw/generative_ai", "kind": "html"},
    {"id": 8, "org": "政大", "name": "生成式人工智慧運用簡要原則", "url": "https://sites.google.com/g.nccu.edu.tw/nccubasicprincipleforai", "kind": "html"},
    {"id": 9, "org": "臺大", "name": "針對生成式AI工具之教學因應措施", "url": "https://www.dlc.ntu.edu.tw/ai-tools/", "kind": "html"},
    {"id": 10, "org": "亞洲大學", "name": "針對生成式AI工具之教學因應措施", "url": "https://ac.asia.edu.tw/xhr/announcements/file/664ac4588199fb6b7a9ceac3/%E4%BA%9E%E5%A4%A7%E9%87%9D%E5%B0%8D%E7%94%9F%E6%88%90%E5%BC%8FAI%E5%B7%A5%E5%85%B7%E4%B9%8B%E6%95%99%E5%AD%B8%E5%9B%A0%E6%87%89%E6%8E%AA%E6%96%BD_2024%E7%89%88.pdf", "kind": "pdf"},
    {"id": 11, "org": "清華大學", "name": "大學教育場域AI協作共學與素養培養指引", "url": "https://ctld.site.nthu.edu.tw/p/450-1217-253458%2Cc0.php?Lang=zh-tw", "kind": "pdf"},
    {"id": 12, "org": "成功大學", "name": "AI及相關學習工具參考指南", "url": "https://sites.google.com/gs.ncku.edu.tw/nckuaiguidance/%E9%A6%96%E9%A0%81", "kind": "html"},
    {"id": 13, "org": "中山大學", "name": "生成式AI工具使用參照指引", "url": "https://oaa.nsysu.edu.tw/p/406-1003-313202,r1365.php?Lang=zh-tw", "kind": "html"},
    {"id": 14, "org": "高雄大學", "name": "AI生成工具使用指引", "url": "https://tech2021.mystrikingly.com/aitools?utm_source=email_deliver&utm_medium=email&utm_campaign=aitools", "kind": "html"},
    {"id": 15, "org": "高雄科大", "name": "針對生成式AI工具之教學因應措施", "url": "https://acad.nkust.edu.tw/p/412-1004-9405.php?Lang=zh-tw", "kind": "html"},
    {"id": 16, "org": "臺科大", "name": "生成式AI簡介與教學策略調整建議方針", "url": "https://ctld.ntust.edu.tw/p/406-1051-111193,r1430.php?Lang=zh-tw", "kind": "html"},
    {"id": 17, "org": "雲科大", "name": "生成式AI工具教學須知", "url": "https://aax.yuntech.edu.tw/images/content/%E6%95%99%E5%8B%99%E7%AB%A0%E5%89%87/%E5%85%B6%E4%BB%96%E9%A1%9E/T13%E7%94%9F%E6%88%90%E5%BC%8FAI%E5%B7%A5%E5%85%B7%E6%95%99%E5%AD%B8%E9%A0%88%E7%9F%A5(112.9.12).pdf", "kind": "pdf"},
    {"id": 18, "org": "中國醫藥大學", "name": "針對生成式AI工具之教學指引", "url": "https://academic.cmu.edu.tw/?q=zh-hant/node/69", "kind": "html"},
    {"id": 19, "org": "陽明交通大學", "name": "因應生成式AI之指引及教學建議", "url": "https://oaeri.nycu.edu.tw/oaeri/ch/app/data/view?module=nycu0014&id=2074&serno=9fd4480f-1c5e-4b0d-b9de-fe3719d46b25", "kind": "html"},
    {"id": 20, "org": "暨南大學", "name": "針對生成式AI工具之教學因應措施", "url": "https://ctld.ncnu.edu.tw/var/file/62/1062/img/578134211.pdf", "kind": "pdf"},
    {"id": 21, "org": "臺中教育大學", "name": "生成式AI工具之教學與學習因應措施", "url": "https://oaacs.ntcu.edu.tw/app/pages.php?PageID=chat%20GPT", "kind": "html"},
    {"id": 22, "org": "中央大學", "name": "學生使用ChatGPT基本原則", "url": "https://pdc.adm.ncu.edu.tw/static/file/19/1019/img/615451190.pdf", "kind": "pdf"},
    {"id": 23, "org": "北科大", "name": "因應生成式AI工具之教學參考指引", "url": "https://oaa.ntut.edu.tw/p/406-1008-129455,r11.php?Lang=zh-tw", "kind": "html"},
    {"id": 24, "org": "長庚大學", "name": "生成式AI的教研衝擊與因應", "url": "https://www.cgu.edu.tw/cfir/Subject/Detail/59531?nodeId=16468", "kind": "html"},
    {"id": 25, "org": "臺北醫學大學", "name": "生成式AI工具之課程教學參考指引", "url": "https://aca.tmu.edu.tw/front/CurriculumDivision/CurriculumDivision_1/news.php?ID=dG11X2FjYSZDdXJyaWN1bHVtRGl2aXNpb25fMQ==&Sn=2643", "kind": "html"},
    {"id": 26, "org": "逢甲大學", "name": "針對生成式AI工具之教學因應措施", "url": "https://reurl.cc/N2xOm9", "kind": "html"},
    {"id": 27, "org": "慈濟大學", "name": "AI賦能大學教育指引", "url": "https://info.tcu.edu.tw/?p=6835", "kind": "html"},
]


def safe_name(item):
    name = f"{item['id']:02d}_{item['org']}_{item['name']}.pdf"
    return re.sub(r'[\\/:*?"<>|]', "_", name)


def download_pdf(url, dest):
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=60) as resp:
        data = resp.read()
    dest.write_bytes(data)
    if dest.stat().st_size < 1000:
        raise RuntimeError("downloaded file too small")


def print_html_to_pdf(url, dest):
    if CHROME is None:
        raise RuntimeError("Chrome/Edge not found")
    profile = Path(tempfile.mkdtemp(prefix="ai-guideline-chrome-"))
    try:
        cmd = [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--disable-dev-shm-usage",
            f"--user-data-dir={profile}",
            "--virtual-time-budget=9000",
            "--run-all-compositor-stages-before-draw",
            f"--print-to-pdf={dest}",
            url,
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=80)
        if not dest.exists() or dest.stat().st_size < 1000:
            raise RuntimeError("PDF was not created or too small")
    finally:
        shutil.rmtree(profile, ignore_errors=True)


def validate_pdf(dest):
    try:
        reader = PdfReader(str(dest))
        text = " ".join((page.extract_text() or "") for page in reader.pages[:2])
    except Exception as exc:
        raise RuntimeError(f"PDF validation failed: {exc}")
    bad_markers = [
        "403 ERROR",
        "request could not be satisfied",
        "找不到網頁",
        "訪問的頁面不存在",
        "404 Not Found",
    ]
    lowered = text.lower()
    for marker in bad_markers:
        if marker.lower() in lowered:
            raise RuntimeError(f"PDF appears to be an error page: {marker}")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    for item in ITEMS:
        dest = OUT_DIR / safe_name(item)
        temp_dest = dest.with_name(dest.stem + ".download.tmp.pdf")
        status = "OK"
        message = ""
        try:
            temp_dest.unlink(missing_ok=True)
            if item["kind"] == "pdf":
                download_pdf(item["url"], temp_dest)
            else:
                print_html_to_pdf(item["url"], temp_dest)
            validate_pdf(temp_dest)
            temp_dest.replace(dest)
            time.sleep(0.2)
        except Exception as exc:
            status = "FAILED"
            message = str(exc)
            temp_dest.unlink(missing_ok=True)
            if dest.exists():
                try:
                    validate_pdf(dest)
                    status = "OK_CACHED"
                    message = f"Using previous valid PDF; refresh failed: {message}"
                except Exception:
                    dest.unlink(missing_ok=True)
        rows.append({**item, "status": status, "file": str(dest), "message": message})
        print(f"{item['id']:02d} {item['org']} {status} {message}")

    with LOG_PATH.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "org", "name", "url", "kind", "status", "file", "message"])
        writer.writeheader()
        writer.writerows(rows)
    print(f"Log: {LOG_PATH}")


if __name__ == "__main__":
    main()

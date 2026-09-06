import { useState, useEffect, useMemo } from "react";

// ─── COLOUR TOKENS ───────────────────────────────────────────
const C = {
  navy: "#0f172a", navyMid: "#1e293b", navyLight: "#334155",
  sky: "#0ea5e9", skyLight: "#38bdf8", skyBg: "#f0f9ff",
  teal: "#0d9488", tealBg: "#f0fdfa",
  text: "#1e293b", muted: "#64748b", subtle: "#94a3b8",
  surface: "#ffffff", border: "#e2e8f0",
  red: "#dc2626", redBg: "#fef2f2",
  orange: "#ea580c", orangeBg: "#fff7ed",
  amber: "#ca8a04", amberBg: "#fefce8",
  green: "#16a34a", greenBg: "#f0fdf4",
  gray: "#6b7280", grayBg: "#f9fafb",
};

const POLICY_CODE_MAP = {
  A: { label: "禁止", color: C.red, bg: C.redBg },
  B: { label: "限制", color: C.orange, bg: C.orangeBg },
  C: { label: "指定允許", color: C.amber, bg: C.amberBg },
  D: { label: "開放鼓勵", color: C.green, bg: C.greenBg },
  E: { label: "待編碼", color: C.gray, bg: C.grayBg },
};

const URL_VERIFIED_DATE = "2026-06-17";
const URL_CHECK_RESULTS = {
  "https://poorvucenter.yale.edu/teaching/teaching-resource-library/ai-guidance-for-teachers/ai-course-assignment-design/sample-ai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://docs.google.com/document/d/1RMVwzjc1o0Mi8Blw_-JUTcXv02b2WRH86vw7mi16W3U/edit?tab=t.0#heading=h.ir0lbtsflw64": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://tltc.umd.edu/sample-syllabus-language-ai-course-policies": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.umkc.edu/provost/academics/ai-tools-sample-syllabus-policy-statements.html": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://bokcenter.harvard.edu/ai-literacy-and-ethics": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://bokcenter.harvard.edu/artificial-intelligence": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://bokcenter.harvard.edu/courses-and-assignments-in-age-of-ai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://bokcenter.harvard.edu/examples-and-ideas-for-using-AI-for-your-teaching": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://bokcenter.harvard.edu/getting-started-huit-supported-ai-tools": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://citl.news.niu.edu/2023/07/24/class-policies-for-the-use-of-ai-tools/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://academicintegrity.ubc.ca/generative-ai-syllabus/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.sydney.edu.au/news-opinion/news/2024/11/27/university-of-sydney-ai-assessment-policy.html": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://teaching.resources.osu.edu/teaching-topics/ai-teaching-strategies-crafting": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://cte.ku.edu/building-ai-policies-your-syllabus": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.kent.edu/ctl/ai-syllabus-statements-course-policy-examples": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://moda.gov.tw/major-policies/ai/governance/19248": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://join.gov.tw/policies/detail/4c714d85-ab9f-4b17-8335-f13b31148dc4": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.nstc.gov.tw/folksonomy/detail/d21566a0-3465-4b63-84b7-5d7cb2e1e5ff?l=ch": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.nstc.gov.tw/folksonomy/list/c79bf57b-dc94-4aff-8d14-3262b5559cfc?l=ch": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://pads.moe.edu.tw": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://pads.moe.edu.tw/download.php": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.taaee.org.tw/docs/20230223_conclusion_final.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ctld.ntnu.edu.tw/generative_ai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ethics.moe.edu.tw/resource/epaper/html/21/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://jila.lib.nccu.edu.tw/wp-content/uploads/2025/03/105-05柯俊如.pdf": {
    "status": "ERROR",
    "code": "",
    "error": "'ascii' codec can't encode characters in position 39-41: ordinal not in range(128)"
  },
  "https://sites.google.com/g.nccu.edu.tw/nccubasicprincipleforai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.dlc.ntu.edu.tw/ai-tools/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://reurl.cc/3kMybL": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ctld.site.nthu.edu.tw/p/450-1217-253458": {
    "status": "ERROR",
    "code": "",
    "error": "[WinError 10054] 遠端主機已強制關閉一個現存的連線。"
  },
  "https://sites.google": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [Errno 11001] getaddrinfo failed>"
  },
  "https://oaa.nsysu.edu.tw/p/406-1003-313202": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 404: Not Found"
  },
  "https://tech2021.mystrikingly.com/aitools?utm_source=email_deliver&utm_medium=email&utm_campaign=aitools": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://acad.nkust.edu.tw/p/412-1004-9405.php?Lang=zh-tw": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ctld.ntust.edu.tw/p/406-1051-111193": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://aax.yuntech.edu.tw/images/content/%E6%95%99%E5%8B%99%E7%AB%A0%E5%89%87/%E5%85%B6%E4%BB%96%E9%A1%9E/T13%E7%94%9F%E6%88%90%E5%BC%8FAI%E5%B7%A5%E5%85%B7%E6%95%99%E5%AD%B8%E9%A0%88%E7%9F%A5(112.9.12": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://academic.cmu.edu.tw/?q=zh-hant/node/69": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://oaeri.nycu.edu.tw/oaeri/ch/app/data/view?module=nycu0014&id=2074&serno=9fd4480f-1c5e-4b0d-b9de-fe3719d46b25": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://aca.ncnu.edu.tw/p/405-1008-10789": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://oaacs.ntcu.edu.tw/app/pages.php?PageID=chat%20GPT": {
    "status": "ERROR",
    "code": "500",
    "error": "HTTP Error 500: Internal Server Error"
  },
  "https://pdc.adm.ncu.edu.tw/ai-tools.asp#": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 404: Not Found"
  },
  "https://oaa.ntut.edu.tw/p/406-1008-129455": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 404: Not Found"
  },
  "https://www.cgu.edu.tw/cfir/Subject/Detail/59531?nodeId=16468": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://aca.tmu.edu.tw/front/CurriculumDivision/CurriculumDivision_1/news.php?ID=dG11X2FjYSZDdXJyaWN1bHVtRGl2aXNpb25fMQ==&Sn=2643": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://reurl.cc/N2xOm9": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://info.tcu.edu.tw/hot_news/attch/1120602001/AI.pdf": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.unesco.org/en/digital-education/ai-future-learning/teachers-framework": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.unesco.org/en/digital-education/ai-future-learning/students-framework": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.unesco.org/en/articles/ai-and-education-guidance-policy-makers": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/emerging-governance-of-generative-ai-in-education_3cbd6269.html": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://www.teachai.org/toolkit": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.teachai.org/policy-tracker": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.teachai.org/guidance-landscape-analysis": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.educause.edu/research/2024/2024-educause-action-plan-ai-policies-and-guidelines": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://integrity.mit.edu/handbook/academic-writing/using-ai-tools": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://teachingcommons.stanford.edu/teaching-guides/artificial-intelligence": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://bokcenter.harvard.edu/ai": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://www.ox.ac.uk/students/academic/good-practice/ai": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://www.imperial.ac.uk/staff/tools-and-reference/education-technology/artificial-intelligence/": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://nationalcentreforai.jiscinvolve.org/wp/2024/07/31/navigating-the-future-higher-education-policies-and-guidance-on-generative-ai/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://melbourne-cshe.unimelb.edu.au/ai-aai": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://cilt.uct.ac.za/teaching-resources/artificial-intelligence-teaching-learning": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://fcai.cu.edu.eg/PG/wp-content/uploads/2023/09/FCAI-GAI-Use-Guidelines-v1.1-fnl.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.wits.ac.za/media/wits-university/learning-and-teaching/cltd/documents/AI-in-teaching-and-learning-at-Wits.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.up.ac.za/media/shared/391/pdfs/up-student-guide_-leveraging-generative-artificial-intelligence-for-learning.zp242396.pdf": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://www.uj.ac.za/wp-content/uploads/2023/08/uj-ai-practice-guide-2023.pdf": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://www.sun.ac.za/english/learning-teaching/ctl/t-l-resources/ai-in-tla-at-su": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.sun.ac.za/english/learning-teaching/ctl/Documents/Cool%20Things%20AI%20Case%20Studies%20Booklet%20(25.03.2025": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.sun.ac.za/english/learning-teaching/ctl/Documents/Interim%20SU%20guidelines%20on%20allowable%20AI%20use%20and%20academic%20integrity.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ufs.libguides.com/AI/SteppingupwithChatGPT": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.aucegypt.edu/about/leadership/provost/use-of-artificial-intelligence-tools": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://news.nwu.ac.za/sites/news.nwu.ac.za/files/files/Robert.Balfour/Utilization-AI-TL.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://provost.harvard.edu/guidelines-using-chatgpt-and-other-generative-ai-tools-harvard": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://communitystandards.stanford.edu/generative-ai-policy-guidance": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://mitsloanedtech.mit.edu/ai/teach/getting-started/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://mcgraw.princeton.edu/generative-ai": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://teaching.uchicago.edu/sites/default/files/2023-09/CCTL_AI%20Syllabus%20Statements.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ctl.columbia.edu/resources-and-technology/resources/ai-tools/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.imss.caltech.edu/services/ai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://oercs.berkeley.edu/appropriate-use-generative-ai-tools": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://provost.yale.edu/news/guidelines-use-generative-ai-tools": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://isc.upenn.edu/security/AI-guidance#:~:text=In%20the%20absence%20of%20other": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://docs.google.com/document/d/1V9OpwizUiHgLVMeEx-7g3AV1QrTAkBo0D-dsFv0DlwM/edit?tab=t.0#heading=h.c6al1vj9d3gd": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://it.cornell.edu/ai/ai-guidelines": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.viceprovostundergrad.utoronto.ca/16072-2/teaching-initiatives/generative-artificial-intelligence/": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://security.utoronto.ca/governance/guidelines/use-ai-intelligently/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.mcgill.ca/provost/files/provost/principles_on_generative_ai_in_teaching_and_learning_at_mcgill.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.ualberta.ca/en/centre-for-teaching-and-learning/resources/generative-ai/academic-integrity-ai-use/index.html#:~:text=Let%20students%20know%20that%20although": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://uwaterloo.ca/academic-integrity/artificial-intelligence-and-chatgpt": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl."
  },
  "https://montrealdeclaration-responsibleai.com/about/#:~:text=The%20Montreal%20Declaration%20for%20a": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.humanities.mcmaster.ca/wp-content/uploads/2024/11/Provisional-Guidelines-on-the-Use-of-Generative-AI-in-Research_For-Feedback.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://forogpp.com/wp-content/uploads/2023/02/guidelines-for-the-use-of-artificial-intelligence-in-university-courses-v4.3.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ialab.com.ar/webia/wp-content/uploads/2024/02/Guia-uso-IAG-.pdf": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://juangutierrez.co/wp-content/uploads/2023/08/guidelines-for-the-use-of-artificial-intelligence-in-university-contexts-v5.0.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://revistas.javeriana.edu.co/files-articulos/CRC-EPUJ/manuales/ETHICS/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.researchgate.net/publication/360849668_Readiness_of_the_judicial_sector_for_artificial_intelligence_in_Latin_America": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://www.uc.cl/noticias/chatgpt-como-usarlo-en-clases/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://aiig.tsinghua.edu.cn/en/International_Forum/2022/About_the_Forum.htm": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://law.nus.edu.sg/trail/responsible-use-of-ai/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://en.nagoya-u.ac.jp/academics/ai/index.html#:~:text=Even%20if%20the%20provided%20information": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.tufs.ac.jp/documents/education/guideline/ai_guideline_en.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.aqs.cuhk.edu.hk/documents/A-guide-for-students_use-of-AI-tools.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://sapi.co.kr/wp-content/uploads/2021/04/SAPI-%ED%99%9C%EB%8F%99%EB%B3%B4%EA%B3%A0%EC%84%9C_ENG.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://catalog.lib.kyushu-u.ac.jp/opac_download_md/7343643/60_p019.pdf": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://www.waseda.jp/top/en/news/77786": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://heyzine.com/flip-book/3a9d4cb37e.html#page/1": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://cte.smu.edu.sg/resources/smu-framework-generative-ai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.ntu.edu.sg/research/resources/use-of-gai-in-research": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://ctld.site.nthu.edu.tw/var/file/217/1217/img/555612445.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.dlc.ntu.edu.tw/en/ai-tools-en/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.chula.ac.th/en/news/125190/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://umresearch.um.edu.my/wp-content/uploads/2023/07/Guideline-English-Version.docx": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://cadelead.upm.edu.my/upload/dokumen/20230202105701Guide_for_ChatGPT_Usage_in_Teaching_and_Learning.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.unimelb.edu.au/ai/home/governance-and-ai-principles": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://www.sydney.edu.au/news-opinion/news/2024/11/15/how-to-use-ai-to-learn-without-cheating-students-develop-new-guide.html": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.teaching.unsw.edu.au/ai/guidelines": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.anu.edu.au/students/academic-skills/academic-integrity/best-practice-principles/guide-for-students-best": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.uts.edu.au/about/leadership-governance/policies/a-z/use-of-ai-in-research-guidelines": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.adelaide.edu.au/student/academic-skills/academic-integrity-for-students/working-with-artificial-intelligence": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.uwa.edu.au/students/-/media/project/uwa/uwa/students/docs/studysmarter/using-ai-tools-at-uwa.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://web.library.uq.edu.au/study-and-learning-support/ai-student-hub/uqs-rules-using-ai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.monash.edu/ai/tools-training-and-resources/ai-policies-and-guidelines": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.auckland.ac.nz/en/students/forms-policies-and-guidelines/student-policies-and-guidelines/academic-integrity-copyright/advice-for-student-on-using-generative-ai.html": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.otago.ac.nz/administration/policies/policy-collection/use-of-generative-artificial-intelligences-and-autonomous-content-generation-in-learning-and-teaching-policy": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.canterbury.ac.nz/study/study-support-info/gen-ai-at-uc/responsible-use-gen-ai-tools": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.wgtn.ac.nz/students/study/exams/academic-integrity/student-use-of-artificial-intelligence": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.massey.ac.nz/study/study-and-assignment-support-and-guides/academic-integrity-student-guide/artificial-intelligence-ai-usage-and-detection/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.waikato.ac.nz/assets/Uploads/Student-life/Student-assessment-Handbook/Guidelines-for-student-use-of-generative-AI-tools-FINAL.pdf": {
    "status": "ERROR",
    "code": "404",
    "error": "HTTP Error 404: Not Found"
  },
  "https://www.aut.ac.nz/about/teaching-learning-and-assessment/generative-ai-and-assessment-at-aut": {
    "status": "ERROR",
    "code": "",
    "error": "HTTP Error 403: Forbidden"
  },
  "https://learning.lincoln.ac.uk/academic-skills/ai-guidelines/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.imperial.ac.uk/admin-services/library/learning-support/generative-ai-guidance/": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://information-services.ed.ac.uk/computing/comms-and-collab/elm/guidance-for-working-with-generative-ai": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://www.eur.nl/en/about-university/policy-and-regulations/regulations-and-guidelines/ai-usage-guidelines": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl."
  },
  "https://www.kuleuven.be/english/genai": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl."
  },
  "https://ethz.ch/content/dam/ethz/main/eth-zurich/education/ai_in_education/Generative%20AI%20in%20Teaching%20and%20Learning%20-%20Guidelines%20ETH.pdf": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://student.uva.nl/en/topics/ai-tools-and-your-studies": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl."
  },
  "https://www.uio.no/english/services/ai/": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl."
  },
  "https://studies.helsinki.fi/instructions/article/using-ai-support-learning": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://biologia-molecolare.biologia.unipd.it/en/masters-degrees/artificial-intelligence-and-thesis-writing/": {
    "status": "ERROR",
    "code": "502",
    "error": "HTTP Error 502: Bad Gateway"
  },
  "https://medarbetare.su.se/en/our-su/communicate-su/communication-support/guidelines-on-using-ai-powered-chatbots-in-education-and-research": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate in certificate chain "
  },
  "https://www.su.se/department-of-computer-and-systems-sciences/education/during-your-studies/dsv-s-ai-policy-1.705912": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self-signed certificate in certificate chain "
  },
  "https://www.tudelft.nl/teaching-support/educational-advice/assess/guidelines/ai-chatbots-in-unsupervised-assessment": {
    "status": "OK",
    "code": "200",
    "error": ""
  },
  "https://tecnico.ulisboa.pt/en/news/campus-community/artificial-intelligence-in-education-tecnico-presents-resolution-on-the-use-of-tools-such-as-chatgpt/": {
    "status": "ERROR",
    "code": "",
    "error": "<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl."
  }
};

// ─── DATA ────────────────────────────────────────────────────

const TABS = [
  { id: "summary",    icon: "📋", label: "執行摘要" },
  { id: "howto",     icon: "🧭", label: "使用說明" },
  { id: "apply",     icon: "🎯", label: "課程應用" },
  { id: "decision",  icon: "⚖️", label: "課程決策表" },
  { id: "templates", icon: "📝", label: "課綱模板" },
  { id: "codes",     icon: "🏷️", label: "政策分級" },
  { id: "taiwan",    icon: "🇹🇼", label: "台灣資料" },
  { id: "intl",      icon: "🌐", label: "國際機構" },
  { id: "keyuni",    icon: "🎓", label: "重點大學" },
  { id: "globaldb",  icon: "🗃️", label: "全球資料庫" },
  { id: "tools",     icon: "🛠️", label: "實用工具" },
  { id: "updates",   icon: "🔄", label: "資料更新" },
];

const DECISION_TABLE = [
  { context: "人文寫作、文學詮釋、哲學論證", policy: "限制使用", code: "B", allowed: "查找背景、語句潤飾、反向檢查論點漏洞", prohibited: "代寫提綱、論點、段落、最終稿", disclosure: "列出工具、提示詞摘要、使用位置與自行修正內容" },
  { context: "社會科學大型講課", policy: "指定情境允許", code: "C", allowed: "複習概念、製作練習題、整理閱讀重點", prohibited: "取代指定閱讀、產生可直接提交的答案", disclosure: "作業後附 AI 使用聲明與錯誤檢核" },
  { context: "量化研究、資料分析、統計作業", policy: "有限允許", code: "C", allowed: "程式除錯、公式解釋、資料視覺化建議", prohibited: "偽造資料、未驗證統計結論、不可重現分析", disclosure: "提供工具、版本、提示詞、程式碼與人工驗證步驟" },
  { context: "創意寫作、設計、媒體製作", policy: "依學習目標分級", code: "C", allowed: "發想、風格比較、素材草案、修稿建議", prohibited: "未揭露完整生成作品、冒充個人創作歷程", disclosure: "附創作歷程、AI 參與比例、人工選擇與修改說明" },
  { context: "考試、核心能力認證、個人表現評量", policy: "原則禁止", code: "A", allowed: "除非教師明確設計為 AI 協作測驗", prohibited: "即時答題、替代個人推理、外部工具協助", disclosure: "若允許使用，須在題目或考試規則中明確列示" },
];

const SYLLABUS_TEMPLATES = [
  { id: "A", code: "A", title: "原則禁止型", content: `本課程的主要學習目標包含個人閱讀、論證、寫作與判斷能力的培養。除教師於特定作業另行說明外，學生不得使用生成式 AI 產生提綱、論點、段落、引用資料或最終提交內容。若使用 AI 作為字詞查詢或一般背景理解工具，仍須自行查證並於作業中揭露。` },
  { id: "B", code: "B", title: "有限允許型", content: `學生可以使用生成式 AI 進行發想、資料搜尋輔助、語句潤飾、程式除錯或概念複習，但不得直接提交未經判斷、查證與改寫的 AI 生成內容。學生須在作業末尾註明使用的工具、使用目的、主要提示詞摘要，以及哪些部分受到 AI 協助。` },
  { id: "C", code: "C", title: "指定任務允許型", content: `本課程僅允許在教師指定的任務中使用生成式 AI。每項作業會明列可使用與不可使用的範圍。未列為可使用的作業，視同不得使用。違反規定且未揭露者，將依本校學術誠信規範處理。` },
  { id: "D", code: "D", title: "AI 素養導向型", content: `本課程鼓勵學生以批判方式使用生成式 AI，並將 AI 產出視為需要驗證、比較與修正的材料，而非權威答案。學生須對最終提交內容負完全責任，包含事實正確性、引用完整性、偏誤辨識與倫理考量。` },
];

const POLICY_CODES = [
  { code: "A", label: "禁止", def: "不得使用 AI 完成核心任務", contexts: "考試、個人寫作能力評量、學術誠信高風險作業" },
  { code: "B", label: "限制", def: "可用於輔助，但不得產生可直接提交內容", contexts: "人文寫作、閱讀心得、論證訓練" },
  { code: "C", label: "指定允許", def: "教師列明哪些作業或步驟可使用", contexts: "資料分析、程式除錯、指定 AI literacy 活動" },
  { code: "D", label: "開放鼓勵", def: "鼓勵使用，但要求揭露、查證與反思", contexts: "AI 素養課、創作比較、工具批判分析" },
  { code: "E", label: "待編碼", def: "資料不足，需讀原文後分類", contexts: "只有網址或摘要過短的資料" },
];

const TAIWAN_DATA = [
  {
    "id": 1,
    "level": "國家法規",
    "inst": "數位發展部",
    "name": "人工智慧基本法",
    "type": "治理框架",
    "url": "https://moda.gov.tw/major-policies/ai/governance/19248.html",
    "date": "2026-03-23",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 2,
    "level": "國家法規",
    "inst": "國科會",
    "name": "行政院及所屬機關（構）使用生成式AI參考指引",
    "type": "治理框架",
    "url": "https://www.nstc.gov.tw/folksonomy/list/c79bf57b-dc94-4aff-8d14-3262b5559cfc?l=ch",
    "date": "",
    "status": "URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"
  },
  {
    "id": 3,
    "level": "教育部",
    "inst": "教育部",
    "name": "中小學數位教學指引3.0版",
    "type": "教師教學支援",
    "url": "https://pads.moe.edu.tw",
    "date": "2024",
    "status": "URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"
  },
  {
    "id": 4,
    "level": "教育部",
    "inst": "教育部",
    "name": "中小學使用生成式人工智慧注意事項",
    "type": "教師教學支援",
    "url": "https://pads.moe.edu.tw/download.php",
    "date": "2024",
    "status": "URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"
  },
  {
    "id": 5,
    "level": "學術倫理",
    "inst": "臺灣學術倫理教育學會",
    "name": "人工智慧技術對學術倫理的影響及因應建議",
    "type": "學術倫理",
    "url": "https://www.taaee.org.tw/docs/20230223_conclusion_final.pdf",
    "date": "2023-02-23",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 6,
    "level": "大學校級",
    "inst": "師大",
    "name": "生成式AI之學習應用及參考指引",
    "type": "學生使用指引",
    "url": "https://ctld.ntnu.edu.tw/generative_ai",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 7,
    "level": "大學校級",
    "inst": "政大",
    "name": "生成式人工智慧運用簡要原則",
    "type": "治理框架",
    "url": "https://sites.google.com/g.nccu.edu.tw/nccubasicprincipleforai",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 8,
    "level": "大學校級",
    "inst": "臺大",
    "name": "針對生成式 AI 工具之教學因應措施",
    "type": "教師教學支援",
    "url": "https://www.dlc.ntu.edu.tw/ai-tools/",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 9,
    "level": "大學校級",
    "inst": "清大",
    "name": "大學教育場域AI協作、共學與素養培養指引",
    "type": "AI素養框架",
    "url": "https://ctld.site.nthu.edu.tw/p/450-1217-253458%2Cc0.php?Lang=zh-tw",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 10,
    "level": "大學校級",
    "inst": "成大",
    "name": "AI 及相關學習工具參考指南",
    "type": "學生使用指引",
    "url": "https://sites.google.com/gs.ncku.edu.tw/nckuaiguidance/%E9%A6%96%E9%A0%81",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 11,
    "level": "大學校級",
    "inst": "中山",
    "name": "生成式AI工具使用參照指引",
    "type": "學生使用指引",
    "url": "https://oaa.nsysu.edu.tw/p/406-1003-313202,r1365.php?Lang=zh-tw",
    "date": "",
    "status": "URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"
  },
  {
    "id": 12,
    "level": "大學校級",
    "inst": "陽明交大",
    "name": "因應生成式AI之指引及教學建議",
    "type": "教師教學支援",
    "url": "https://oaeri.nycu.edu.tw/oaeri/ch/app/data/view?module=nycu0014&id=2074&serno=9fd4480f-1c5e-4b0d-b9de-fe3719d46b25",
    "date": "",
    "status": "URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"
  },
  {
    "id": 13,
    "level": "大學校級",
    "inst": "北科大",
    "name": "因應生成式AI工具之教學參考指引",
    "type": "教師教學支援",
    "url": "https://oaa.ntut.edu.tw/p/406-1008-129455,r11.php?Lang=zh-tw",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 14,
    "level": "大學校級",
    "inst": "臺科大",
    "name": "生成式AI簡介與教學策略調整建議方針",
    "type": "教師教學支援",
    "url": "https://ctld.ntust.edu.tw/p/406-1051-111193,r1430.php?Lang=zh-tw",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 15,
    "level": "大學校級",
    "inst": "中國醫",
    "name": "針對生成式 AI 工具之教學指引",
    "type": "教師教學支援",
    "url": "https://academic.cmu.edu.tw/?q=zh-hant/node/69",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 16,
    "level": "大學校級",
    "inst": "北醫",
    "name": "生成式AI工具之課程教學參考指引",
    "type": "教師教學支援",
    "url": "https://aca.tmu.edu.tw/front/CurriculumDivision/CurriculumDivision_1/news.php?ID=dG11X2FjYSZDdXJyaWN1bHVtRGl2aXNpb25fMQ==&Sn=2643",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔"
  },
  {
    "id": 17,
    "level": "大學校級",
    "inst": "逢甲",
    "name": "針對生成式AI工具之教學因應措施",
    "type": "教師教學支援",
    "url": "https://reurl.cc/N2xOm9",
    "date": "",
    "status": "URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"
  },
  {
    "id": 18,
    "level": "大學校級",
    "inst": "慈濟",
    "name": "AI賦能大學教育指引",
    "type": "治理框架",
    "url": "https://info.tcu.edu.tw/?p=6835",
    "date": "",
    "status": "URL 已核實 2026-06-17；備份待補（存檔為網頁殼）"
  },
  {
    "id": 19,
    "level": "大學校級",
    "inst": "亞洲大學",
    "name": "針對生成式AI工具之教學因應措施",
    "type": "教師教學支援",
    "url": "https://ac.asia.edu.tw/xhr/announcements/file/664ac4588199fb6b7a9ceac3/%E4%BA%9E%E5%A4%A7%E9%87%9D%E5%B0%8D%E7%94%9F%E6%88%90%E5%BC%8FAI%E5%B7%A5%E5%85%B7%E4%B9%8B%E6%95%99%E5%AD%B8%E5%9B%A0%E6%87%89%E6%8E%AA%E6%96%BD_2024%E7%89%88.pdf",
    "date": "2024-05-13",
    "status": "已核實 2026-06-17；PDF已存檔；2026-09-06 補列"
  },
  {
    "id": 20,
    "level": "大學校級",
    "inst": "高雄科大",
    "name": "針對生成式AI工具之教學因應措施",
    "type": "教師教學支援",
    "url": "https://acad.nkust.edu.tw/p/412-1004-9405.php?Lang=zh-tw",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔；2026-09-06 補列"
  },
  {
    "id": 21,
    "level": "大學校級",
    "inst": "雲科大",
    "name": "生成式AI工具教學須知",
    "type": "治理框架",
    "url": "https://aax.yuntech.edu.tw/images/content/%E6%95%99%E5%8B%99%E7%AB%A0%E5%89%87/%E5%85%B6%E4%BB%96%E9%A1%9E/T13%E7%94%9F%E6%88%90%E5%BC%8FAI%E5%B7%A5%E5%85%B7%E6%95%99%E5%AD%B8%E9%A0%88%E7%9F%A5(112.9.12).pdf",
    "date": "2023-09-12",
    "status": "已核實 2026-06-17；PDF已存檔；2026-09-06 補列"
  },
  {
    "id": 22,
    "level": "大學校級",
    "inst": "暨南",
    "name": "針對生成式AI工具之教學因應措施",
    "type": "教師教學支援",
    "url": "https://ctld.ncnu.edu.tw/var/file/62/1062/img/578134211.pdf",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔；2026-09-06 補列"
  },
  {
    "id": 23,
    "level": "大學校級",
    "inst": "中央",
    "name": "學生使用ChatGPT基本原則",
    "type": "學生使用指引",
    "url": "https://pdc.adm.ncu.edu.tw/static/file/19/1019/img/615451190.pdf",
    "date": "",
    "status": "已核實 2026-06-17；PDF已存檔；2026-09-06 補列"
  },
  {
    "id": 24,
    "level": "大學校級",
    "inst": "長庚",
    "name": "生成式AI的教研衝擊與因應",
    "type": "教師教學支援",
    "url": "https://www.cgu.edu.tw/cfir/Subject/Detail/59531?nodeId=16468",
    "date": "2024-11-13",
    "status": "已核實 2026-06-17；PDF已存檔；2026-09-06 補列"
  }
];

const INTL_ORGS = [
  { id:1, org:"UNESCO", name:"Guidance for Generative AI in Education and Research (2023)", type:"研究倫理", url:"https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research", summary:"全球首份生成式AI教育指引，涵蓋立即行動、長期政策規劃及人本願景", date:"2023" },
  { id:2, org:"UNESCO", name:"AI Competency Framework for Teachers (2024)", type:"AI素養框架", url:"https://www.unesco.org/en/digital-education/ai-future-learning/teachers-framework", summary:"協助各國教師系統建立AI能力框架，納入課程設計與教學實踐", date:"2024" },
  { id:3, org:"UNESCO", name:"AI Competency Framework for Students (2024)", type:"課綱政策範本", url:"https://www.unesco.org/en/digital-education/ai-future-learning/students-framework", summary:"建立學生AI素養路徑，已支持58個國家課綱設計與師資培訓", date:"2024" },
  { id:4, org:"UNESCO", name:"AI and Education: Guidance for Policy-Makers (2021)", type:"治理框架", url:"https://www.unesco.org/en/articles/ai-and-education-guidance-policy-makers", summary:"針對政策制定者的AI教育指引，提供機會分析、風險管理及政策建議", date:"2021" },
  { id:5, org:"OECD", name:"Digital Education Outlook 2023", type:"治理框架", url:"https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en.html", summary:"18國比較分析，檢視各國對生成式AI的教育監管與指引現況", date:"2023" },
  { id:6, org:"OECD", name:"Digital Education Outlook 2026（最新版）", type:"研究倫理", url:"https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html", summary:"探討生成式AI在教與學各情境的應用研究、機會、挑戰與政策建議", date:"2026" },
  { id:7, org:"TeachAI", name:"AI Guidance for Schools Toolkit", type:"待編碼", url:"https://www.teachai.org/toolkit", summary:"協助各國政府及教育機構制定AI指引的實用工具包，含政策原則與三階段轉型架構", date:"" },
  { id:8, org:"TeachAI", name:"Global AI Education Policy Tracker", type:"治理框架", url:"https://www.teachai.org/policy-tracker", summary:"即時追蹤全球各國及美國各州AI教育政策現況的互動地圖", date:"" },
  { id:9, org:"TeachAI", name:"Guidance for AI in Education: A Landscape Analysis", type:"待編碼", url:"https://www.teachai.org/guidance-landscape-analysis", summary:"整合美國各州及9個國際脈絡AI教育指引的主題分析，供指引制定者參考", date:"" },
  { id:10, org:"EDUCAUSE", name:"2024 AI Policies and Guidelines Action Plan", type:"研究倫理", url:"https://www.educause.edu/research/2024/2024-educause-action-plan-ai-policies-and-guidelines", summary:"基於900+高教技術人員調查，提供高等教育AI政策差距分析與行動方案", date:"2024" },
];

const KEY_UNIVERSITIES = [
  {
    "rank": "★★★",
    "inst": "Yale University",
    "name": "AI Course & Assignment Design — Sample AI Policies",
    "type": "課綱政策範本",
    "url": "https://poorvucenter.yale.edu/teaching/teaching-resource-library/ai-guidance-for-teachers/ai-course-assignment-design",
    "summary": "Poorvu Center 的 AI 課程與作業設計入口，含 Sample AI Syllabus Statements、Academic Integrity、Authentic Assessment 等模組。",
    "verifiedDate": "2026-06-18",
    "verification": "官方頁可開啟"
  },
  {
    "rank": "★★★",
    "inst": "MIT",
    "name": "Teaching & Learning with ChatGPT / syllabus AI policy examples",
    "type": "課綱政策範本",
    "url": "https://tll.mit.edu/teaching-learning-with-chatgpt-opportunity-or-quagmire-part-iii/",
    "summary": "MIT Teaching + Learning Lab 建議教師在 syllabus 的 academic integrity statement 中清楚列明生成式 AI 使用政策，並提供可改寫範例。",
    "verifiedDate": "2026-06-18",
    "verification": "官方頁可開啟；原 Academic Integrity Handbook 連結已失效"
  },
  {
    "rank": "★★★",
    "inst": "Stanford University",
    "name": "Artificial Intelligence Teaching Guide",
    "type": "教師教學支援",
    "url": "https://teachingcommons.stanford.edu/teaching-guides/artificial-intelligence-teaching-guide",
    "summary": "Stanford Teaching Commons 的 AI 教學指南，面向教師與教學團隊，涵蓋 AI literacy、課程設計與教學實務。",
    "verifiedDate": "2026-06-18",
    "verification": "官方頁可開啟；已替換舊連結"
  },
  {
    "rank": "★★★",
    "inst": "Harvard University",
    "name": "Teaching and AI — Bok Center",
    "type": "教師教學支援",
    "url": "https://bokcenter.harvard.edu/teaching-ai",
    "summary": "Bok Center 協助教師設定清楚期待、處理倫理問題，並透明溝通 AI 在學習中的角色。",
    "verifiedDate": "2026-06-18",
    "verification": "官方頁可開啟；已替換舊連結"
  },
  {
    "rank": "★★★",
    "inst": "University of Oxford",
    "name": "Generative AI at Oxford",
    "type": "治理與素養框架",
    "url": "https://www.ox.ac.uk/gen-ai",
    "summary": "Oxford 生成式 AI 入口，整合學生與教職員訓練、入門指南與校內 AI 使用資源；研究政策另列於 Research Services。",
    "verifiedDate": "2026-06-18",
    "verification": "官方頁可開啟；舊 good-practice/ai 連結已失效"
  },
  {
    "rank": "★★",
    "inst": "Imperial College London",
    "name": "Generative AI & Education Guidance Hub",
    "type": "教師教學支援",
    "url": "https://www.imperial.ac.uk/about/leadership-and-strategy/provost/vice-provost-education/education/resources/ai-education-hub/",
    "summary": "Imperial 面向教育社群的生成式 AI 教育資源中心，提供教學、評量與政策相關指引。",
    "verifiedDate": "2026-06-18",
    "verification": "官方頁可開啟；已替換舊連結"
  },
  {
    "rank": "★★",
    "inst": "JISC（英國高教資訊中心）",
    "name": "Higher Education policies and guidance on generative AI",
    "type": "治理框架",
    "url": "https://nationalcentreforai.jiscinvolve.org/wp/2024/07/31/navigating-the-future-higher-education-policies-and-guidance-on-generative-ai/",
    "summary": "彙整英國高教生成式 AI 政策與指引，適合做跨校政策比較與評量分類參考。",
    "verifiedDate": "2026-06-18",
    "verification": "官方/機構頁可開啟"
  },
  {
    "rank": "★★",
    "inst": "University of Melbourne",
    "name": "Assessment, AI and Academic Integrity",
    "type": "評量與學術誠信",
    "url": "https://melbourne-cshe.unimelb.edu.au/ai-aai",
    "summary": "Melbourne CSHE 為教職員整理的評量、生成式 AI 與學術誠信實務資源。",
    "verifiedDate": "2026-06-18",
    "verification": "官方頁可開啟"
  }
];

const GLOBAL_DB = [
  { id:1, region:"Africa 非洲", country:"South Africa", uni:"University of Cape Town", name:"Artificial Intelligence for Teaching & Learning", date:"", type:"教師教學支援", status:"缺日期", url:"https://cilt.uct.ac.za/teaching-resources/artificial-intelligence-teaching-learning" },
  { id:2, region:"Africa 非洲", country:"Egypt", uni:"Cairo University", name:"FCAI Policy and Guidelines for use of Generative AI", date:"2023-09-04", type:"治理框架", status:"需複核", url:"https://fcai.cu.edu.eg/PG/wp-content/uploads/2023/09/FCAI-GAI-Use-Guidelines-v1.1-fnl.pdf" },
  { id:3, region:"Africa 非洲", country:"South Africa", uni:"University of Witwatersrand", name:"Approach to the use of AI in teaching and learning at Wits", date:"2023-01", type:"教師教學支援", status:"需複核", url:"https://www.wits.ac.za/media/wits-university/learning-and-teaching/cltd/documents/AI-in-teaching-and-learning-at-Wits.pdf" },
  { id:4, region:"Africa 非洲", country:"South Africa", uni:"University of Pretoria", name:"Student's Guide: Leveraging Generative AI for Teaching and Learning", date:"2023", type:"學生使用指引", status:"需複核", url:"https://www.up.ac.za/media/shared/391/pdfs/up-student-guide_-leveraging-generative-artificial-intelligence-for-learning.zp242396.pdf" },
  { id:5, region:"Africa 非洲", country:"South Africa", uni:"University of Johannesburg", name:"UJ PRACTICE Notes: Generative AI in Teaching, Learning and Research", date:"", type:"教師教學支援", status:"缺日期", url:"https://www.uj.ac.za/wp-content/uploads/2023/08/uj-ai-practice-guide-2023.pdf" },
  { id:6, region:"Africa 非洲", country:"South Africa", uni:"Stellenbosch University", name:"Generative AI in TLA at SU", date:"", type:"待編碼", status:"缺日期", url:"https://www.sun.ac.za/english/learning-teaching/ctl/t-l-resources/ai-in-tla-at-su" },
  { id:7, region:"Africa 非洲", country:"South Africa", uni:"Stellenbosch University", name:"Cool Things Academics Do: AI Literacy in Higher Education", date:"", type:"AI素養框架", status:"缺日期", url:"https://www.sun.ac.za/english/learning-teaching/ctl/Documents/Cool%20Things%20AI%20Case%20Studies%20Booklet%20(25.03.2025).pdf" },
  { id:8, region:"Africa 非洲", country:"South Africa", uni:"Stellenbosch University", name:"Draft interim SU guidelines on allowable AI use and academic integrity", date:"", type:"評量與學術誠信", status:"缺日期", url:"https://www.sun.ac.za/english/learning-teaching/ctl/Documents/Interim%20SU%20guidelines%20on%20allowable%20AI%20use%20and%20academic%20integrity.pdf" },
  { id:9, region:"Africa 非洲", country:"South Africa", uni:"University of the Free State", name:"Stepping up with ChatGPT - AI-assisted Technology in Education", date:"", type:"待編碼", status:"缺日期", url:"https://ufs.libguides.com/AI/SteppingupwithChatGPT" },
  { id:10, region:"Africa 非洲", country:"Egypt", uni:"The American University in Cairo", name:"AUC's Statement on the Use of Artificial Intelligence Tools", date:"", type:"待編碼", status:"缺日期", url:"https://www.aucegypt.edu/about/leadership/provost/use-of-artificial-intelligence-tools" },
  { id:11, region:"Africa 非洲", country:"South Africa", uni:"North-West University", name:"Guidelines for the Utilization of AI in Teaching and Learning at NWU", date:"", type:"教師教學支援", status:"缺日期", url:"https://news.nwu.ac.za/sites/news.nwu.ac.za/files/files/Robert.Balfour/Utilization-AI-TL.pdf" },
  { id:12, region:"North America 北美", country:"USA", uni:"Harvard University", name:"Guidelines for Using ChatGPT and other Generative AI tools at Harvard", date:"", type:"待編碼", status:"缺日期", url:"https://provost.harvard.edu/guidelines-using-chatgpt-and-other-generative-ai-tools-harvard" },
  { id:13, region:"North America 北美", country:"USA", uni:"Stanford University", name:"Generative AI Policy Guidance", date:"2023-02-16", type:"治理框架", status:"需複核", url:"https://communitystandards.stanford.edu/generative-ai-policy-guidance" },
  { id:14, region:"North America 北美", country:"USA", uni:"MIT", name:"Getting Started with AI-Enhanced Teaching: A Practical Guide for Instructors", date:"", type:"教師教學支援", status:"缺日期", url:"https://mitsloanedtech.mit.edu/ai/teach/getting-started/" },
  { id:15, region:"North America 北美", country:"USA", uni:"Princeton University", name:"Generative AI Guidance", date:"", type:"待編碼", status:"缺日期", url:"https://mcgraw.princeton.edu/generative-ai" },
  { id:16, region:"North America 北美", country:"USA", uni:"University of Chicago", name:"Guidance for Syllabus Statements on the Use of AI Tools", date:"", type:"課綱政策範本", status:"缺日期", url:"https://teaching.uchicago.edu/sites/default/files/2023-09/CCTL_AI%20Syllabus%20Statements.pdf" },
  { id:17, region:"North America 北美", country:"USA", uni:"Columbia University", name:"Considerations for AI Tools in the Classroom", date:"", type:"待編碼", status:"缺日期", url:"https://ctl.columbia.edu/resources-and-technology/resources/ai-tools/" },
  { id:18, region:"North America 北美", country:"USA", uni:"California Institute of Technology", name:"Guidance on the Use of Generative AI and LLM Tools", date:"", type:"待編碼", status:"缺日期", url:"https://www.imss.caltech.edu/services/ai" },
  { id:19, region:"North America 北美", country:"USA", uni:"UC Berkeley", name:"Appropriate Use of Generative AI Tools", date:"", type:"待編碼", status:"缺日期", url:"https://oercs.berkeley.edu/appropriate-use-generative-ai-tools" },
  { id:20, region:"North America 北美", country:"USA", uni:"Yale University", name:"Guidelines for the Use of Generative AI Tools", date:"", type:"待編碼", status:"缺日期", url:"https://provost.yale.edu/news/guidelines-use-generative-ai-tools" },
  { id:21, region:"North America 北美", country:"USA", uni:"University of Pennsylvania", name:"Statement on Guidance for UPenn Community on Use of Generative AI", date:"", type:"待編碼", status:"缺日期", url:"https://isc.upenn.edu/security/AI-guidance" },
  { id:22, region:"North America 北美", country:"USA", uni:"UCLA", name:"Generative AI for Teaching and Learning at UCLA", date:"", type:"教師教學支援", status:"缺日期", url:"https://docs.google.com/document/d/1V9OpwizUiHgLVMeEx-7g3AV1QrTAkBo0D-dsFv0DlwM/edit" },
  { id:23, region:"North America 北美", country:"USA", uni:"Cornell University", name:"Guidelines for Artificial Intelligence", date:"", type:"待編碼", status:"缺日期", url:"https://it.cornell.edu/ai/ai-guidelines" },
  { id:24, region:"North America 北美", country:"Canada", uni:"University of Toronto", name:"Generative Artificial Intelligence in the Classroom: FAQs", date:"", type:"待編碼", status:"缺日期", url:"https://www.viceprovostundergrad.utoronto.ca/16072-2/teaching-initiatives/generative-artificial-intelligence/" },
  { id:25, region:"North America 北美", country:"Canada", uni:"University of British Columbia", name:"UBC Guidance on GenAI Syllabus", date:"", type:"課綱政策範本", status:"缺日期", url:"https://academicintegrity.ubc.ca/generative-ai-syllabus/" },
  { id:26, region:"North America 北美", country:"Canada", uni:"McGill University", name:"Principles on Generative AI in Teaching and Learning at McGill", date:"", type:"教師教學支援", status:"缺日期", url:"https://www.mcgill.ca/provost/files/provost/principles_on_generative_ai_in_teaching_and_learning_at_mcgill.pdf" },
  { id:27, region:"North America 北美", country:"Canada", uni:"University of Alberta", name:"Academic Integrity and AI Use", date:"", type:"評量與學術誠信", status:"缺日期", url:"https://www.ualberta.ca/en/centre-for-teaching-and-learning/resources/generative-ai/academic-integrity-ai-use/index.html" },
  { id:28, region:"North America 北美", country:"Canada", uni:"University of Waterloo", name:"Artificial intelligence and ChatGPT", date:"", type:"待編碼", status:"缺日期", url:"https://uwaterloo.ca/academic-integrity/artificial-intelligence-and-chatgpt" },
  { id:29, region:"North America 北美", country:"Canada", uni:"University of Montreal", name:"About the Montréal Declaration on Responsible AI", date:"", type:"待編碼", status:"缺日期", url:"https://montrealdeclaration-responsibleai.com/about/" },
  { id:30, region:"North America 北美", country:"Canada", uni:"McMaster University", name:"Provisional Guidelines: Use of Generative AI in Teaching and Learning", date:"2024-09", type:"教師教學支援", status:"需複核", url:"https://www.humanities.mcmaster.ca/wp-content/uploads/2024/11/Provisional-Guidelines-on-the-Use-of-Generative-AI-in-Research_For-Feedback.pdf" },
  { id:31, region:"South America 南美洲", country:"Colombia", uni:"Universidad del Rosario", name:"Guidelines for the Use of AI in University Courses", date:"2023-02-21", type:"待編碼", status:"需複核", url:"https://forogpp.com/wp-content/uploads/2023/02/guidelines-for-the-use-of-artificial-intelligence-in-university-courses-v4.3.pdf" },
  { id:32, region:"South America 南美洲", country:"Argentina", uni:"University of Buenos Aires", name:"Guidelines for the use of ChatGPT and text generative AI", date:"", type:"待編碼", status:"缺日期", url:"https://ialab.com.ar/webia/wp-content/uploads/2024/02/Guia-uso-IAG-.pdf" },
  { id:33, region:"South America 南美洲", country:"Colombia", uni:"Universidad de Los Andes", name:"Guidelines for the use of AI in university contexts", date:"2023-08-15", type:"待編碼", status:"需複核", url:"https://juangutierrez.co/wp-content/uploads/2023/08/guidelines-for-the-use-of-artificial-intelligence-in-university-contexts-v5.0.pdf" },
  { id:34, region:"South America 南美洲", country:"Colombia", uni:"Pontifical Javeriana University", name:"Editorial Policy, Publication Ethics and Malpractice Statement", date:"", type:"治理框架", status:"缺日期", url:"" },
  { id:35, region:"South America 南美洲", country:"Argentina", uni:"Universidad de San Andres", name:"Readiness of the judicial sector for AI in Latin America", date:"", type:"待編碼", status:"缺日期", url:"https://www.researchgate.net/publication/360849668" },
  { id:36, region:"South America 南美洲", country:"Chile", uni:"Pontificia Universidad Católica de Chile", name:"ChatGPT: ¿Cómo usarlo en clases?", date:"", type:"待編碼", status:"缺日期", url:"https://www.uc.cl/noticias/chatgpt-como-usarlo-en-clases/" },
  { id:37, region:"Asia 亞洲", country:"China", uni:"Tsinghua University", name:"International AI Cooperation and Governance Forum 2022", date:"", type:"治理框架", status:"缺日期", url:"https://aiig.tsinghua.edu.cn/en/International_Forum/2022/About_the_Forum.htm" },
  { id:38, region:"Asia 亞洲", country:"Singapore", uni:"National University of Singapore", name:"Responsible Use of AI – Guidance from a Singapore Regulatory Perspective", date:"", type:"待編碼", status:"缺日期", url:"https://law.nus.edu.sg/trail/responsible-use-of-ai/" },
  { id:39, region:"Asia 亞洲", country:"Japan", uni:"Nagoya University", name:"Regarding the Use of Generative AI", date:"", type:"待編碼", status:"缺日期", url:"https://en.nagoya-u.ac.jp/academics/ai/index.html" },
  { id:40, region:"Asia 亞洲", country:"Japan", uni:"Tokyo University of Foreign Studies", name:"Guidelines for Instructors Regarding AI in University Education", date:"2023-03-22", type:"教師教學支援", status:"需複核", url:"https://www.tufs.ac.jp/documents/education/guideline/ai_guideline_en.pdf" },
  { id:41, region:"Asia 亞洲", country:"Hong Kong", uni:"University of Hong Kong", name:"Use of AI Tools in Teaching, Learning and Assessments", date:"", type:"評量與學術誠信", status:"缺日期", url:"" },
  { id:42, region:"Asia 亞洲", country:"South Korea", uni:"Seoul National University", name:"Seoul National University AI Policy Initiative", date:"", type:"治理框架", status:"缺日期", url:"" },
  { id:43, region:"Asia 亞洲", country:"Japan", uni:"Kyushu University", name:"Note on the Use of Generative AI in Education at Kyushu University", date:"", type:"教師教學支援", status:"缺日期", url:"https://catalog.lib.kyushu-u.ac.jp/opac_download_md/7343643/60_p019.pdf" },
  { id:44, region:"Asia 亞洲", country:"Japan", uni:"Waseda University", name:"About the Use of Generative Artificial Intelligence (ChatGPT, etc.)", date:"2023-04-21", type:"待編碼", status:"需複核", url:"https://www.waseda.jp/top/en/news/77786" },
  { id:45, region:"Asia 亞洲", country:"South Korea", uni:"UNIST 蔚山科學技術院", name:"A Guide to the Use of Generative AI", date:"2023", type:"待編碼", status:"需複核", url:"https://heyzine.com/flip-book/3a9d4cb37e.html#page/1" },
  { id:46, region:"Asia 亞洲", country:"Singapore", uni:"Singapore Management University", name:"SMU Framework for The Use of Generative AI Tools", date:"", type:"學生使用指引", status:"缺日期", url:"https://cte.smu.edu.sg/resources/smu-framework-generative-ai" },
  { id:47, region:"Asia 亞洲", country:"Singapore", uni:"Nanyang Technological University", name:"NTU Position on the Use of Generative AI in Research", date:"", type:"研究倫理", status:"缺日期", url:"https://www.ntu.edu.sg/research/resources/use-of-gai-in-research" },
  { id:48, region:"Asia 亞洲", country:"Taiwan", uni:"National Tsing Hua University 清大", name:"Guidelines for Collaboration, Co-learning, and Cultivation of AI Competencies", date:"", type:"待編碼", status:"缺日期", url:"https://ctld.site.nthu.edu.tw/var/file/217/1217/img/555612445.pdf" },
  { id:49, region:"Asia 亞洲", country:"Taiwan", uni:"National Taiwan University 臺大", name:"Guidance for Use of Generative AI Tools for Teaching and Learning", date:"", type:"教師教學支援", status:"缺日期", url:"https://www.dlc.ntu.edu.tw/en/ai-tools-en/" },
  { id:50, region:"Asia 亞洲", country:"Hong Kong", uni:"The Chinese University of Hong Kong", name:"Use of AI Tools in Teaching, Learning and Assessments", date:"", type:"評量與學術誠信", status:"缺日期", url:"https://www.aqs.cuhk.edu.hk/documents/A-guide-for-students_use-of-AI-tools.pdf" },
  { id:51, region:"Asia 亞洲", country:"Thailand", uni:"Chulalongkorn University", name:"Principles and Guidelines for using AI Tools", date:"", type:"待編碼", status:"缺日期", url:"https://www.chula.ac.th/en/news/125190/" },
  { id:52, region:"Asia 亞洲", country:"Malaysia", uni:"Universiti Malaya", name:"Guideline (English Version)", date:"", type:"待編碼", status:"缺日期", url:"https://umresearch.um.edu.my/wp-content/uploads/2023/07/Guideline-English-Version.docx" },
  { id:53, region:"Asia 亞洲", country:"Malaysia", uni:"Universiti Putra Malaysia", name:"Guide for ChatGPT usage in Teaching and Learning", date:"", type:"教師教學支援", status:"缺日期", url:"https://cadelead.upm.edu.my/upload/dokumen/20230202105701Guide_for_ChatGPT_Usage_in_Teaching_and_Learning.pdf" },
  { id:54, region:"Oceania 大洋洲", country:"Australia", uni:"University of Melbourne", name:"AI governance", date:"", type:"治理框架", status:"缺日期", url:"https://www.unimelb.edu.au/ai/home/governance-and-ai-principles" },
  { id:55, region:"Oceania 大洋洲", country:"Australia", uni:"University of Sydney", name:"AI in Education, University of Sydney guidelines", date:"", type:"待編碼", status:"缺日期", url:"https://www.sydney.edu.au/news-opinion/news/2024/11/15/how-to-use-ai-to-learn-without-cheating-students-develop-new-guide.html" },
  { id:56, region:"Oceania 大洋洲", country:"Australia", uni:"University of New South Wales", name:"UNSW's AI Guidelines and Framework", date:"", type:"待編碼", status:"缺日期", url:"https://www.teaching.unsw.edu.au/ai/guidelines" },
  { id:57, region:"Oceania 大洋洲", country:"Australia", uni:"Australian National University", name:"Guide for students: best practice when using Generative AI", date:"", type:"學生使用指引", status:"缺日期", url:"https://www.anu.edu.au/students/academic-skills/academic-integrity/best-practice-principles/guide-for-students-best" },
  { id:58, region:"Oceania 大洋洲", country:"Australia", uni:"University of Technology Sydney", name:"The Use of AI in Research Guidelines", date:"", type:"研究倫理", status:"缺日期", url:"https://www.uts.edu.au/about/leadership-governance/policies/a-z/use-of-ai-in-research-guidelines" },
  { id:59, region:"Oceania 大洋洲", country:"Australia", uni:"University of Adelaide", name:"Working with Artificial Intelligence", date:"", type:"待編碼", status:"缺日期", url:"https://www.adelaide.edu.au/student/academic-skills/academic-integrity-for-students/working-with-artificial-intelligence" },
  { id:60, region:"Oceania 大洋洲", country:"Australia", uni:"University of Western Australia", name:"Using AI Tools at UWA: A Guide for Students", date:"", type:"學生使用指引", status:"缺日期", url:"https://www.uwa.edu.au/students/-/media/project/uwa/uwa/students/docs/studysmarter/using-ai-tools-at-uwa.pdf" },
  { id:61, region:"Oceania 大洋洲", country:"Australia", uni:"University of Queensland", name:"UQ's rules for using AI", date:"", type:"待編碼", status:"缺日期", url:"https://web.library.uq.edu.au/study-and-learning-support/ai-student-hub/uqs-rules-using-ai" },
  { id:62, region:"Oceania 大洋洲", country:"Australia", uni:"Monash University", name:"AI policies and guidelines", date:"", type:"待編碼", status:"缺日期", url:"https://www.monash.edu/ai/tools-training-and-resources/ai-policies-and-guidelines" },
  { id:63, region:"Oceania 大洋洲", country:"New Zealand", uni:"University of Auckland", name:"Advice for students on using generative AI in coursework", date:"", type:"學生使用指引", status:"缺日期", url:"https://www.auckland.ac.nz/en/students/forms-policies-and-guidelines/student-policies-and-guidelines/academic-integrity-copyright/advice-for-student-on-using-generative-ai.html" },
  { id:64, region:"Oceania 大洋洲", country:"New Zealand", uni:"University of Otago", name:"Use of Generative AI and Autonomous Content Generation in Learning and Teaching Policy", date:"", type:"治理框架", status:"缺日期", url:"https://www.otago.ac.nz/administration/policies/policy-collection/use-of-generative-artificial-intelligences-and-autonomous-content-generation-in-learning-and-teaching-policy" },
  { id:65, region:"Oceania 大洋洲", country:"New Zealand", uni:"University of Canterbury", name:"Responsible use of Gen-AI tools", date:"", type:"待編碼", status:"缺日期", url:"https://www.canterbury.ac.nz/study/study-support-info/gen-ai-at-uc/responsible-use-gen-ai-tools" },
  { id:66, region:"Oceania 大洋洲", country:"New Zealand", uni:"Victoria University of Wellington", name:"Student use of artificial intelligence", date:"", type:"學生使用指引", status:"缺日期", url:"https://www.wgtn.ac.nz/students/study/exams/academic-integrity/student-use-of-artificial-intelligence" },
  { id:67, region:"Oceania 大洋洲", country:"New Zealand", uni:"Massey University", name:"Artificial Intelligence (AI) usage and detection", date:"", type:"待編碼", status:"缺日期", url:"https://www.massey.ac.nz/study/study-and-assignment-support-and-guides/academic-integrity-student-guide/artificial-intelligence-ai-usage-and-detection/" },
  { id:68, region:"Oceania 大洋洲", country:"New Zealand", uni:"University of Waikato", name:"Guidelines for Student Use of Generative AI Tools", date:"", type:"學生使用指引", status:"缺日期", url:"https://www.waikato.ac.nz/assets/Uploads/Student-life/Student-assessment-Handbook/Guidelines-for-student-use-of-generative-AI-tools-FINAL.pdf" },
  { id:69, region:"Oceania 大洋洲", country:"New Zealand", uni:"Auckland University of Technology", name:"Generative AI and assessment at AUT", date:"", type:"評量與學術誠信", status:"缺日期", url:"https://www.aut.ac.nz/about/teaching-learning-and-assessment/generative-ai-and-assessment-at-aut" },
  { id:70, region:"Oceania 大洋洲", country:"New Zealand", uni:"Lincoln University", name:"AI guidelines", date:"", type:"待編碼", status:"缺日期", url:"https://learning.lincoln.ac.uk/academic-skills/ai-guidelines/" },
  { id:71, region:"Europe 歐洲", country:"UK", uni:"University of Oxford", name:"Use of generative AI tools to support learning", date:"", type:"待編碼", status:"缺日期", url:"https://www.ox.ac.uk/students/academic/good-practice/ai" },
  { id:72, region:"Europe 歐洲", country:"UK", uni:"University of Cambridge", name:"Artificial intelligence and teaching, learning, and assessment", date:"", type:"評量與學術誠信", status:"缺日期", url:"https://www.cambridgeinternational.org/support-and-training-for-schools/teaching-cambridge-at-your-school/artificial-intelligence/" },
  { id:73, region:"Europe 歐洲", country:"UK", uni:"Imperial College London", name:"Generative AI Guidance", date:"", type:"待編碼", status:"缺日期", url:"https://www.imperial.ac.uk/admin-services/library/learning-support/generative-ai-guidance/" },
  { id:74, region:"Europe 歐洲", country:"UK", uni:"London School of Economics", name:"Statement on Generative AI and Education", date:"", type:"待編碼", status:"缺日期 / 待補URL", url:"" },
  { id:75, region:"Europe 歐洲", country:"UK", uni:"University College London", name:"Three categories of GenAI use in assessment", date:"", type:"評量與學術誠信", status:"缺日期", url:"https://www.ucl.ac.uk/teaching-learning/generative-ai-hub/three-categories-genai-use-assessment" },
  { id:76, region:"Europe 歐洲", country:"UK", uni:"University of Edinburgh", name:"Guidance for working with Generative AI in your studies", date:"", type:"待編碼", status:"缺日期", url:"https://information-services.ed.ac.uk/computing/comms-and-collab/elm/guidance-for-working-with-generative-ai" },
  { id:77, region:"Europe 歐洲", country:"Netherlands", uni:"Erasmus University Rotterdam", name:"Generative AI Usage Guidelines", date:"", type:"待編碼", status:"缺日期", url:"https://www.eur.nl/en/about-university/policy-and-regulations/regulations-and-guidelines/ai-usage-guidelines" },
  { id:78, region:"Europe 歐洲", country:"Belgium", uni:"KU Leuven", name:"Responsible use of Generative AI", date:"", type:"待編碼", status:"缺日期", url:"https://www.kuleuven.be/english/genai" },
  { id:79, region:"Europe 歐洲", country:"Switzerland", uni:"ETH Zurich", name:"Generative AI in Teaching & Learning", date:"", type:"教師教學支援", status:"缺日期", url:"https://ethz.ch/content/dam/ethz/main/eth-zurich/education/ai_in_education/Generative%20AI%20in%20Teaching%20and%20Learning%20-%20Guidelines%20ETH.pdf" },
  { id:80, region:"Europe 歐洲", country:"Netherlands", uni:"University of Amsterdam", name:"AI tools and your studies", date:"", type:"待編碼", status:"缺日期", url:"https://student.uva.nl/en/topics/ai-tools-and-your-studies" },
  { id:81, region:"Europe 歐洲", country:"Norway", uni:"University of Oslo", name:"Guidelines for use of AI at UiO", date:"", type:"待編碼", status:"缺日期", url:"https://www.uio.no/english/services/ai/" },
  { id:82, region:"Europe 歐洲", country:"Finland", uni:"University of Helsinki", name:"Using AI to support learning", date:"", type:"待編碼", status:"缺日期", url:"https://studies.helsinki.fi/instructions/article/using-ai-support-learning" },
  { id:83, region:"Europe 歐洲", country:"Italy", uni:"University of Padua", name:"Artificial Intelligence and Thesis Writing", date:"", type:"待編碼", status:"缺日期", url:"https://biologia-molecolare.biologia.unipd.it/en/masters-degrees/artificial-intelligence-and-thesis-writing/" },
  { id:84, region:"Europe 歐洲", country:"Sweden", uni:"Stockholm University", name:"Guidelines on using AI-powered chatbots in education and research", date:"", type:"研究倫理", status:"缺日期", url:"https://medarbetare.su.se/en/our-su/communicate-su/communication-support/guidelines-on-using-ai-powered-chatbots-in-education-and-research" },
  { id:85, region:"Europe 歐洲", country:"Sweden", uni:"Stockholm University", name:"DSV's AI policy", date:"", type:"治理框架", status:"缺日期", url:"https://www.su.se/department-of-computer-and-systems-sciences/education/during-your-studies/dsv-s-ai-policy-1.705912" },
  { id:86, region:"Europe 歐洲", country:"Denmark", uni:"Technical University of Denmark", name:"DTU opens up for the use of AI in teaching", date:"", type:"教師教學支援", status:"缺日期", url:"https://www.dtu.dk/english/newsarchive/2024/01/dtu-opens-up-for-the-use-of-artificial-intelligence-in-teaching" },
  { id:87, region:"Europe 歐洲", country:"Netherlands", uni:"Delft University of Technology", name:"AI chatbots in unsupervised assessment", date:"", type:"評量與學術誠信", status:"缺日期", url:"https://www.tudelft.nl/teaching-support/educational-advice/assess/guidelines/ai-chatbots-in-unsupervised-assessment" },
  { id:88, region:"Europe 歐洲", country:"Portugal", uni:"Universidade de Lisboa", name:"Artificial Intelligence in education – Técnico presents resolution", date:"", type:"待編碼", status:"缺日期", url:"https://tecnico.ulisboa.pt/en/news/campus-community/artificial-intelligence-in-education-tecnico-presents-resolution-on-the-use-of-tools-such-as-chatgpt/" },
  { id:89, region:"Europe 歐洲", country:"Netherlands", uni:"University of Utrecht", name:"Guidelines for the use of generative AI", date:"", type:"待編碼", status:"待補URL", url:"" },
  { id:90, region:"Europe 歐洲", country:"Switzerland", uni:"University of Zurich", name:"Guidelines for the Use of AI Tools", date:"", type:"待編碼", status:"待補URL", url:"" },
];

// ─── HELPER COMPONENTS ───────────────────────────────────────


// ─── 課程應用資料（由 build_apply.py 產生） ─────────────────
const GUIDE_DIGEST = [
 {
  "title": "課綱中的 AI 使用聲明與規範層級",
  "quotes": [
   {
    "text": "教師應於課程大綱中敘明學生使用 AI 的規則，尤其是正確引註 AI 並揭露使用的歷程。",
    "src": "11 清華"
   },
   {
    "text": "為避免師生對於「可否使用生成式 AI 工具」的態度不一致，導致產生評分爭議，請教師在教學大綱中敘明生成式 AI 工具使用規定。……1. 完全開放使用 2. 有條件開放使用(敘明規定) 3. 禁止使用(敘明管理機制) 4. 本課程無涉及 AI 使用。",
    "src": "08 政大"
   },
   {
    "text": "【有條件開放使用】學生須於課堂作業或報告中的「標題頁註腳」或「引用文獻後」簡要說明如何使用生成式AI進行議題發想、文句潤飾或結構參考等使用方式。若經查核使用卻無在作業或報告中標明，教師、學校或相關單位有權重新針對作業或報告重新評分或不予計分。本門課授課教材或學習資料若有引用自生成式AI，教師也將在投影片或口頭標注。如需更嚴格條件，可再加上：然而，在本課程的「個人反思報告」、「小組採訪作業」中，學生不得使用生成式AI工具撰寫作業。 （同文亦見 [23 北科大] 參考範例 1）",
    "src": "08 政大"
   },
   {
    "text": "教師應先釐清在課程中使用 AI 生成工具的原則和規範，除了透過口頭的說明和提醒讓學生清楚瞭解相關規定，也應在課程開始前將相關規定明白標示於課程大綱內，藉以和學生達成共識避免爭議。",
    "src": "17 雲科大"
   },
   {
    "text": "課程「教學大綱及進度表」宜明列生成式AI工具的使用規範或限制，教師於課堂應向修課學生說明並約定該課程使用AI工具的規範或限制要求。",
    "src": "23 北科大"
   },
   {
    "text": "教師於撰寫課程大綱，以及第一節上課時，建議說明生成式AI的使用規範，讓學生知悉該課程是否可以利用生成式AI作為輔助學習工具，或者協助作業內容之完成，以及使用生成式AI對於評量作業或考試成績之影響。例如：本課程作業及考試得使用生成式AI，但必須先取得本課程教師的同意，並註明使用之過程。",
    "src": "15 高雄科大"
   },
   {
    "text": "建議教師在課程與測驗設計，分為：基礎專業能力測驗階段，禁止 AI 工具使用；進階問題解決與實務運用階段，可採取 AI 工具使用。細分不同階段採取對於 AI 使用的差異，將 AI 對學習的正面效應最大化。",
    "src": "22 中央"
   },
   {
    "text": "在課前介紹以及教學大綱明訂可允許學生使用哪些工具及哪些為限制的工具並述明限制的原因。",
    "src": "16 臺科大"
   },
   {
    "text": "制定明確的課程AI工具使用規範：……什麼情況下允許或禁止使用ChatGPT、哪些類型的作業或報告可使用ChatGPT，若使用應如何標示引用來源等等。",
    "src": "25 北醫"
   },
   {
    "text": "鼓勵各教學單位（院、系所）依學門特性與課程需求，訂定專屬之 AI 使用指引。",
    "src": "07 臺師大"
   }
  ],
  "note": "十校一致要求「寫進課綱＋開學口頭說明」。政大／北科大提供的「有條件開放」範本文字，與林文源老師 STS 課綱第二節的聲明幾乎逐字相同（來源即清大聲明）。差異點：中央大學提出「基礎能力階段禁止、進階應用階段開放」的分段制；高雄科大加上「先取得教師同意」；北醫強調要指明「哪些類型作業」可用。"
 },
 {
  "title": "揭露、標註與引用 AI 生成內容",
  "quotes": [
   {
    "text": "學生與教師使用 AI 時應誠實揭露。……教師與學生應理解 AI 僅能作為素材提供的來源之一。使用時應具備檢核其正確性的判讀能力，並對自己產生的內容負責。",
    "src": "11 清華"
   },
   {
    "text": "凡於報告撰寫、學術著作、音樂、畫作或圖片創作等過程中使用 GAI 者，應進行適當之自我揭露，清楚說明人工智慧工具之使用情形，包括使用之工具名稱、使用方式及其在作品中所扮演之角色。",
    "src": "07 臺師大"
   },
   {
    "text": "若作業或文章中有部分是由AI生成初稿，應於適當處明確標註、引用協作、生成頁數範圍等資訊。",
    "src": "07 臺師大"
   },
   {
    "text": "目前在學術寫作上尚未明訂 AI 生成內容的引用規則，但由於 ChatGPT的資料來源是無法回溯、取得或提供直接連結的，因此建議將之視為 personal communication 或 correspondence，使用相對應的引用格式。細節和引用方法請查詢 APA、MLA、Chicago Manual Style。 （同文見 [10 亞大]、[15 高雄科大]）",
    "src": "20 暨南"
   },
   {
    "text": "以 APA 格式為例：OpenAI. (2022). ChatGPT generated content [Generated by ChatGPT]. Retrieved from [URL]。",
    "src": "10 亞大"
   },
   {
    "text": "如使用AI生成結果建議宜標註，並經思考後提出個人觀點，不宜將生成結果直接作為自身的報告或作業，學生對個人的作業報告內容應負起責任。",
    "src": "23 北科大"
   },
   {
    "text": "教師可使用 ChatGPT 輔助生成教學內容，如果內容的主要來源為 ChatGPT，基於學術誠信也應該清楚標示引用來源。",
    "src": "24 長庚"
   },
   {
    "text": "學術研究的透明性：……如果有應用到人工智慧輔助科技，是否需要揭露、如何揭露，需要進一步考量，也需要凝聚學界共識才能擬定相關指引。",
    "src": "06 學倫學會"
   }
  ],
  "note": "揭露要素共識為「工具名稱、使用方式／目的、在作品中扮演的角色、（臺師大）生成頁數範圍」。引用格式三校同抄 Scribbr 的「視為 personal communication」建議。清華與長庚同時要求**教師端**教材也要標註。"
 },
 {
  "title": "查證、幻覺與批判閱讀",
  "quotes": [
   {
    "text": "引導學生進行知識溯源，不宜盡信 AI 產生之內容，並教導使用 AI 工具可能涉及的學術及研究倫理議題。 （同文見 [17 雲科大]）",
    "src": "11 清華"
   },
   {
    "text": "培養學生知識溯源的能力（判讀來源、正確性、學派觀點）。",
    "src": "11 清華"
   },
   {
    "text": "使用 GAI 時，除了學習如何精準提問外，使用者亦須積極主動判斷內容正確性，不能將生成結果直接作為報告、評量等成果。",
    "src": "07 臺師大"
   },
   {
    "text": "應以批判閱讀（Critical Reading）的角度檢視生成文本，為最終內容負責。",
    "src": "07 臺師大"
   },
   {
    "text": "在生成式AI工具產出的內容使用上，需特別小心求證，並注意其中夾帶的意識形態訊息。 （「認知攻擊問題」）",
    "src": "08 政大"
   },
   {
    "text": "學生分辨訊息正確性的建議：(一)查閱其他可靠資源……(二)多面向比對：可以透過比較不同來源的訊息，尤其是對於有爭議的話題，從多角度去了解及分析……(三)尋求專家意見……(四)運用邏輯思維……檢查數據的一致性和邏輯性。",
    "src": "16 臺科大"
   },
   {
    "text": "臺灣大學圖書館曾提醒讀者，有不少案例是 AI 生成了不存在的參考文獻，需要使用者更加細心求證書目、參考資料的真偽，才能夠正確引用。",
    "src": "15 高雄科大"
   },
   {
    "text": "ChatGPT 的設計類似接話程式，不會檢查資料的真假優劣、不提供資料的來源及引用，也缺乏科學邏輯的論述。",
    "src": "06 學倫學會"
   },
   {
    "text": "請學生製作利用ChatGPT生成資料的修改前後對照表，訓練其批判思考能力。",
    "src": "25 北醫"
   },
   {
    "text": "可以檢驗學生的AI使用歷程，並從中加以輔導。比如讓學生用AI生成一個版本的答案，然後要求他們自己重寫一個版本，接著說明其中的過程。",
    "src": "08 政大，整理自臺師大張欣怡教授"
   }
  ],
  "note": "所有來源都要求查證，但**可操作的教學做法**只在四處：清華「知識溯源＋學派觀點」、臺科大四步驗證法、北醫「修改前後對照表」、政大「AI 版 vs 自寫版＋說明過程」。政大「意識形態訊息」一則最貼近本課的批判取向。"
 },
 {
  "title": "教學活動設計——把 AI 產出當成討論素材",
  "quotes": [
   {
    "text": "討論文本生成：教師可運用生成文本，由學生透過比對文中表達方式、文章架構、邏輯組織等找出差異，將可促進學生的分析洞察力。統整結論：教師可在學生分組討論後，用以彙整結論。人機討論：課堂內師生的問答討論，亦可透過 GAI 作為提示，再將其生成內容作為討論的一部分，可激發多元觀點。",
    "src": "07 臺師大"
   },
   {
    "text": "宜以 AI 作答結果作為範例，引導學生提出批評或修改方向，並標註編修的文句、段落及其理由。",
    "src": "11 清華"
   },
   {
    "text": "審視 AI 可能對藝術/人文社會學科帶來衝擊，小組討論會是新的常態。教師可引導學生透過「口頭報告」說明如何運用 AI 創作，或透過「課堂討論」提出不同於 AI 的觀點。 （同文見 [17 雲科大]）",
    "src": "11 清華"
   },
   {
    "text": "可將生成內容之操作或產出，結合創意多元之教學方式，提升同學批判分析與反思能力。",
    "src": "08 政大"
   },
   {
    "text": "激發討論和思考：通過生成式 AI 生成的問題或觀點引發學生的討論和思考，促進學生之間的互動和交流。擴展課堂內容：在課堂上使用生成式 AI 生成的文本擴展課堂內容，介紹新穎的觀點、案例或實例。",
    "src": "10 亞大"
   },
   {
    "text": "互動學習：可以設計一些問答遊戲，讓學生與ChatGPT進行對話的方式來學習。……增加交流與實作任務：教師可以建立交流與實作的課堂活動，例如討論小組、實作。",
    "src": "20 暨南"
   },
   {
    "text": "老師可以利用ChatGPT進行對話練習，有助於引導學生學習精準的提出問題。例如：詢問ChatGPT「請規劃花蓮旅遊行程」，因條件不夠明確，可能無法得到很好的回答；使用者可以提供更具體的條件。",
    "src": "15 高雄科大"
   },
   {
    "text": "與 AI 協作（Working with AI）：運用 AI 工具進行共同協作……和 AI 共學（Learning with AI）：將 AI 視為智性探索的工具，進一步透過反思學習與思考的方式。",
    "src": "11 清華"
   },
   {
    "text": "探索「prompt engineering」，有效利用其整合和檢索的能力，有機會啟發更多創新的想法。",
    "src": "11 清華"
   }
  ],
  "note": "可直接用於課堂的活動型式有三類：(1) **比對型**（AI 文本 vs 人寫文本／學生自寫版，找差異）；(2) **反駁型**（以 AI 答案為靶，學生提出不同觀點並標註理由）；(3) **提問訓練型**（從模糊到精準的指令練習）。清華的「協作／共學」二分是本課課綱明文採用的架構。"
 },
 {
  "title": "評量設計",
  "quotes": [
   {
    "text": "依據課程屬性，可同意使用 AI 協助答題，但建議以多元形式繳交作業（如：口頭報告、手寫報告、製作影片、情境解題等），期盼學生於過程中內化知識。 （同文見 [17 雲科大]）",
    "src": "11 清華"
   },
   {
    "text": "出題方向建議以更多需要深層推理、創造力、分析（情境判斷、正反論述、爭議的癥結）、批判的問題……可考慮 AI 人機協作的測驗，讓同學運用 AI 參與考試，但更著重考測學生的批判思考和創造力。可帶回家作答的考卷，考題可先經 AI 測試，AI 答得好的題目，可能就不適合當成試題。",
    "src": "11 清華"
   },
   {
    "text": "如果受評者得使用或有機會使用生成式 AI，則應盡量評量其高層次思考能力，並盡量採用實作評量或行動導向等多元評量。",
    "src": "08 政大"
   },
   {
    "text": "老師在設計教學和評量時，應該著重在學生是否具備評估、建構、重組和批判知識的能力。",
    "src": "08 政大，整理自張欣怡教授"
   },
   {
    "text": "調整作業結構：作業或考試可設計需要學生個人思維創作力的方式或題目，如：結合時事或個人經驗……可分階段繳交作業：大綱、初稿及最終定稿……作業繳交建議附上參考的資料來源。",
    "src": "16 臺科大"
   },
   {
    "text": "教師應將學習評量範圍加廣，不著重在單一評量或最終結果，而是依照學生在學習過程中所展現的進步或累積成果。教師應加深學習評量內容，……加入課程獨特性內容，或是做更能反映出學生個人特色的評量設計。",
    "src": "17 雲科大"
   },
   {
    "text": "教師可嘗試以多元化評量方式來評估學生的學習過程，例如：較具認知挑戰性、需人為評估、課堂中即時完成作業或小組討論等。",
    "src": "12 成大"
   },
   {
    "text": "善用形成性評量……課程設計強化探究實作，融入動手操作、實驗及議題探究，強調從做中學的歷程。……「學生們之所以抄襲，是因為作業可以抄襲。」",
    "src": "15 高雄科大"
   },
   {
    "text": "評分方式應減少書面作業或報告的比例，提高課程活動與參與課程討論的重要性，著重在學生的學習過程而非單一的測驗或最終結果。",
    "src": "25 北醫"
   },
   {
    "text": "設計創新題型，如開放問答、個人經驗題。",
    "src": "07 臺師大"
   },
   {
    "text": "鼓勵採取更多口頭表達的說明方式來進行評分。",
    "src": "22 中央"
   }
  ],
  "note": "高度重複——多元形式、過程導向、口頭化、結合個人經驗與時事、分階段繳交。獨有觀點：清華「考題先經 AI 測試」、臺科大「分階段繳交（大綱→初稿→定稿）」。"
 },
 {
  "title": "學生端的建議用途",
  "quotes": [
   {
    "text": "可使用 AI 工具進行議題發想、潤飾文稿與外語編修。可更有效率的彙整文獻重點……AI 可以提供一個架構，學生可再以自身既有的知識或觀點進行補充。可將 AI 視為針對個人學習進度差異的客製化家教。",
    "src": "11 清華"
   },
   {
    "text": "文章架構擬定：……學生可利用 GAI 進行初步的文章架構規劃……學生仍需憑藉自身專業知識與觀點，進行文章初稿之撰寫。文章改寫：……藉由比對原文與生成改寫文字，篩選適當內容。",
    "src": "07 臺師大"
   },
   {
    "text": "提供多元觀點：善用 AI 龐大資料庫，提供多元角度與觀點，觸發學生創意思考。",
    "src": "07 臺師大"
   },
   {
    "text": "學習提問提升思考力：使用 ChatGPT 提問時，必須盡可能明確、具體，才能獲得高品質的回應。因此與 ChatGPT 的問答對話過程，有助於釐清想法內涵，釐清問題的核心。",
    "src": "15 高雄科大"
   },
   {
    "text": "可以作為專題或研究主題的發想工具，透過明確的提示，產出相關的研究方向，或釐清疑慮，確認問題點，找出思考方向。",
    "src": "15 高雄科大"
   },
   {
    "text": "資源檢索：提供關鍵字或主題，讓生成式 AI 提供相關的資源、學術論文、網站連結或其他學習資料。……參與討論和對話：創建虛擬對話，與生成式 AI 進行交流並探討各種主題。",
    "src": "10 亞大"
   },
   {
    "text": "避免過度依賴：……應定位為輔助工具，所生成的文本僅供參考。 （類似見 [10 亞大]、[23 北科大]、[15 高雄科大]）",
    "src": "07 臺師大"
   }
  ],
  "note": "與本課最相關者為「議題發想」「多元觀點」「提問訓練」「研究方向發想」四項；「資源檢索」一項與主題三的「幻覺文獻」警告互相牴觸，使用時須併讀。"
 },
 {
  "title": "隱私、資安與智慧財產",
  "quotes": [
   {
    "text": "由於輸入至 GAI 的內容可能會被紀錄並加以學習應用，故使用時須謹慎確認，非必要時請勿將未公開文件、個人訊息等資料輸入至對話框內。 （類似見 [17 雲科大]、[23 北科大]、[15 高雄科大]、[18 中國醫大]）",
    "src": "07 臺師大"
   },
   {
    "text": "非必要時請勿提供個人或他人之敏感資訊與隱私，如確屬必要，宜先去識別化。",
    "src": "17 雲科大"
   },
   {
    "text": "因為作業內容屬於學生的智慧財產，若直接將學生的作業或報告提交給AI進行批改，倫理上要注意的是學生的知情同意權。",
    "src": "08 政大"
   },
   {
    "text": "教師如未經學生允許，請避免將學生作品上傳至外部網站。",
    "src": "12 成大"
   },
   {
    "text": "如果是由教師指定學生使用生成式 AI 做為輔助學習時，學生若不同意共享其智慧財產權或學習紀錄者，應使其有機會選擇退出不使用生成式 AI。",
    "src": "10 亞大"
   },
   {
    "text": "單純下指令且並未投入精神創作之情形下，由生成式 AI 獨立自主運算而生成全新內容，該 AI 生成內容不受著作權法保護。",
    "src": "10 亞大"
   },
   {
    "text": "避免運用生成工具時涉及使用個人隱私資料，或採用具有偏見或歧視之字眼及內容。",
    "src": "08 政大"
   }
  ],
  "note": "對本課（含田野訪談 10 人、社群媒體資料）特別重要的三則：雲科大「去識別化」、政大／成大「學生作品上傳 AI 需知情同意」、亞大「退出權」。"
 },
 {
  "title": "AI 素養與倫理面向",
  "quotes": [
   {
    "text": "AI 素養……基礎：（1）理解 AI 的基本概念、技術、方法及其工具性。（2）認識 AI 應用情境和潛在影響，進而了解 AI 工具的能力及其限制。（3）認識 AI 在倫理、隱私和安全可能造成的問題。進階：（4）確實揭露使用 AI 的過程。（5）運用不同型態的 AI 在工作與生活中的適用性。（6）持續反思 AI 與人類的關係，用以提高人類福祉。",
    "src": "11 清華"
   },
   {
    "text": "挑戰 1：專業技術門檻高……挑戰 2：可信度……挑戰 3：偏見與公平性……挑戰 4：教學方法……挑戰 5：學術倫理。",
    "src": "11 清華"
   },
   {
    "text": "人工智慧倫理的核心考量：公平性／隱私與資料保護／透明與可解釋性／責任歸屬／人機界線與原創性。",
    "src": "07 臺師大"
   },
   {
    "text": "政府推動 AI 研發應用之七大原則：（一）永續發展與福祉（二）人類自主（三）隱私保護與資料治理（四）資安與安全（五）透明與可解釋（六）公平與不歧視（七）問責。……資訊透明標記：對 AI 產出內容進行適當的資訊揭露或標記。",
    "src": "01 數位部"
   },
   {
    "text": "由於生成式AI之技術特質與繁體中文訓練資料不足等基礎……在多數AI中繁體中文作為訓練資料相對少數，其中許多用語及脈絡極可能以簡體中文資料為主，並可能有政治審查的問題。",
    "src": "本課課綱"
   }
  ],
  "note": "清華六項素養與臺師大五面向可直接轉成本課「AI 協作心得」的反思題綱；數位部七原則提供國家層級的對照座標。"
 },
 {
  "title": "偵測工具與查核",
  "quotes": [
   {
    "text": "目前檢測網站（以 GPTZero 為例）之有效性尚未知，建議僅做參考使用。",
    "src": "08 政大"
   },
   {
    "text": "現行檢測AI的網站（例如：GPTZero）尚無法證實其有效性或可行性……建議勿過度依賴檢測軟體。",
    "src": "12 成大"
   },
   {
    "text": "準確度低……舉證不充分：AI生成文字之內容為隨機之文字組合，因此即使偵測工具判定作業中有使用AI生成之文字，亦無法提供確切的證據。……建議：教師應當謹慎使用任何偵測 AI 生成內容的工具。",
    "src": "15 高雄科大"
   },
   {
    "text": "若教師對學生作業或作答內容有疑慮，可與學生進行進階提問，以確保學生非使用AI生成器來作答。",
    "src": "16 臺科大"
   },
   {
    "text": "目前並沒有專門檢測學生是否使用 ChatGPT 的工具。 （同 [10 亞大]）",
    "src": "20 暨南"
   }
  ],
  "note": "一致：不依賴偵測工具，改用「進階提問」「口頭說明過程」「保留使用歷程」。"
 },
 {
  "title": "指引中提到的影片與教學資源",
  "quotes": [
   {
    "text": "ChatGPT NTU Focus 的發展與原理／的功能與應用／的使用限制／教師注意事項／學生注意事項（焦點．臺灣大學 EDU 頻道）；FACULTY+ 單元三十九：生成式 AI 年代的教學－給大學課程（臺灣大學 EDU 頻道）。",
    "src": "09 臺大"
   },
   {
    "text": "也可以參考台大李宏毅教授說明 ChatGPT (可能)是怎麼煉成的－GPT 社會化的過程 – YouTube。",
    "src": "24 長庚"
   },
   {
    "text": "ChatGPT for Beginners – Every Icon and Feature Explained!（YouTube）……UNESCO《AI competency framework for teachers》……教育部學術倫理電子報第 13 期〈大學校園因應生成式 AI 之指引及教學建議〉。",
    "src": "07 臺師大"
   },
   {
    "text": "教育部臺灣學術倫理教育資源中心「生成式AI對研究與學術倫理的影響」2023.03.30 孫以瀚；「運用ChatGPT撰寫作業的風險」2023.03.17 楊舒凱。",
    "src": "15 高雄科大"
   },
   {
    "text": "張欣怡－AI時代的教學評量設計（影片）。",
    "src": "08 政大"
   }
  ],
  "note": "指引本身推薦的影片偏「工具操作」與「學術倫理」兩類，**沒有任何一份推薦與 STS／科技社會分析直接相關的影片**；本課的影片建議須另外從課綱主題與公共化 AI 系列補足（見 Step 7 產出）。"
 },
 {
  "title": "教師端的備課用途（供參）",
  "quotes": [
   {
    "text": "AI 可協助總結課程之影片字幕/投影片內容……AI 可提供教案（課程大綱）建議以及更多樣化合適的範例。",
    "src": "11 清華"
   },
   {
    "text": "運用 ChatGPT 設計學習單、討論議題、Rubrics 評量標準等，亦能生成教學投影片的初稿大綱、作業說明、課程公告、引導學生自學的指導語。",
    "src": "15 高雄科大"
   },
   {
    "text": "可利用生成式 AI 協助產生並修正課綱內容，並於授課大綱中清楚說明生成式人工智慧工具在教學中扮演的角色。",
    "src": "08 政大"
   },
   {
    "text": "協助出題：教師在設計考題時，可先用生成式AI軟體進行試做，如果獲得大部分正確答案，題目或許就需要進行調整。",
    "src": "16 臺科大"
   }
  ],
  "note": "與 Step 5–7 產出直接相關者為「討論議題／Rubrics」與「引導自學指導語」兩項。"
 }
];
const GUIDE_EMPTY_SOURCES = [
 {
  "n": "02",
  "name": "國科會 行政院及所屬機關（構）使用生成式AI參考指引",
  "got": "只有網站側欄與目錄，未含指引本文",
  "fix": "改抓 detail 頁或行政院公告 PDF"
 },
 {
  "n": "03",
  "name": "國科會 生成式AI指引FAQ",
  "got": "僅四則行政面 Q&A（非強制性、封閉式地端等）",
  "fix": "保留，但不屬教學指引"
 },
 {
  "n": "04",
  "name": "教育部 中小學數位教學指引3.0",
  "got": "入口網首頁（班班有網路）",
  "fix": "改抓 download.php 內的指引 PDF"
 },
 {
  "n": "05",
  "name": "教育部 中小學使用生成式人工智慧注意事項",
  "got": "下載清單頁，無內文",
  "fix": "下載「注意事項 2.1 教師版／學生版」PDF"
 },
 {
  "n": "13",
  "name": "中山大學 生成式AI工具使用參照指引",
  "got": "僅 6 個 PDF 的連結清單",
  "fix": "下載學生版、教師版 PDF"
 },
 {
  "n": "14",
  "name": "高雄大學 AI生成工具使用指引",
  "got": "403 錯誤頁（下載記錄已標 FAILED）",
  "fix": "改由學校官網取得"
 },
 {
  "n": "19",
  "name": "陽明交通大學 因應生成式AI之指引及教學建議",
  "got": "僅三份文件的連結清單",
  "fix": "下載「教師應用生成式AI之教學建議」PDF"
 },
 {
  "n": "21",
  "name": "臺中教育大學 生成式AI工具之教學與學習因應措施",
  "got": "網站維護中",
  "fix": "擇日重抓"
 },
 {
  "n": "26",
  "name": "逢甲大學 針對生成式AI工具之教學因應措施",
  "got": "內容為圖片，未抽出文字",
  "fix": "OCR 或向教發中心索取文字版"
 },
 {
  "n": "27",
  "name": "慈濟大學 AI賦能大學教育指引",
  "got": "403 拒絕存取",
  "fix": "改由學校官網取得"
 }
];

// ─── 課程應用（Step 1–8 實作） ───────────────────────────────

// 「AI 課程建議」後台網址：本機測試為 localhost；搬上雲端後改成正式網址
const AI_SUGGEST_URL = "http://localhost:8787";

const APPLY_META = {
  generated: "2026-09-06",
  course: "〈科技與社會〉（清大通識，林文源，2026 春，16 週）",
  sourceFolder: "台灣各大學AI教學指引/",
  sourceCount: 27,
  usableCount: 17,
  emptyCount: 9,
  files: {
    steps: "課程應用/AI協助課程素材整理與教學建議_執行步驟.docx",
    digest: "課程應用/教學指引整理檔_台灣AI教學指引彙編_STS課程用.docx",
    suggestions: "課程應用/STS課程專屬教學素材與AI協作建議.docx",
  },
};

const APPLY_PHASES = [
  {
    phase: "階段一：萃取彙整",
    color: C.sky,
    steps: [
      { n:"1", t:"文件放同一資料夾", d:"把所有原始指引集中在一個資料夾，開一個 AI 工作區一次讀取與比對。", tag:"" },
      { n:"2", t:"AI 掃描並萃取教學相關指引", d:"只抓與教學設計、課程安排、學生學習、素材、教學活動有關的內容；原文保留、標註來源、先分類不合併。", tag:"提示詞 ①" },
      { n:"3", t:"人工抽查", d:"挑 2–3 份原文核對有無漏抓。這是流程瓶頸，也是唯一能保證可追溯性的節點。", tag:"✋ 人工把關" },
      { n:"4", t:"產出《教學指引整理檔》", d:"去重、合併相近、保留差異觀點、按主題分類，輸出獨立文件。", tag:"產出" },
    ],
  },
  {
    phase: "階段二：客製化生成",
    color: C.teal,
    steps: [
      { n:"5", t:"上傳三份輸入", d:"課程大綱、教學指引整理檔、分析 PROMPT。只給這三份，不要把原始文件混進來。", tag:"提示詞 ②" },
      { n:"6", t:"AI 依 PROMPT 對照課綱與指引", d:"先遵循 PROMPT 的角色與框架，再逐週對照；每項建議附週次、時機、理由、查證方式；衝突列出由教師裁決。", tag:"提示詞 ③" },
      { n:"7", t:"產出課程專屬版本", d:"影片／閱讀／活動、對應主題、為何適合、課前中後、搭配討論題。", tag:"產出" },
      { n:"8", t:"教師最後把關", d:"逐項判斷保留、修改、刪除。AI 產出只是參考版本。", tag:"✋ 人工把關" },
    ],
  },
];

const APPLY_PROMPTS = [
  {
    id: "extract",
    title: "① 萃取指令（階段一 Step 2）",
    desc: "讓 AI 先熟悉全部資料，只抓教學相關內容，原文保留並標來源。",
    text: `請你閱讀這個資料夾中的所有文件，找出所有與教學設計、課程安排、學生學習、影片素材、教學活動有關的指引內容。要求：
1. 原文保留，不要改寫或摘要；
2. 每一則都標註來源檔名（或編號）；
3. 先依主題分類，同一主題下即使多份文件說法相近也分別列出，不要合併；
4. 若某份文件實際上沒有內容（只有網頁殼、目錄、維護頁或錯誤頁），另列一份「無實質內容檔案」清單；
5. 最後整理成一份獨立文件。`,
  },
  {
    id: "analysis",
    title: "② 分析 PROMPT（中心專屬，不公開）",
    desc: "分析 PROMPT 是人社 AI 中心的專屬資產，不在本站公開。它負責規定 AI 的角色、理論框架、分析步驟、輸出格式與證據要求；使用時由後台自動注入，教師只需提供課程大綱（見「AI 課程建議」）。本站僅列出其結構供對照。",
    text: `【結構摘要】
▌角色：社會學文本批評助手
▌框架：四層分析（修辭格／情節模式／論證模式／意識形態傾向）＋社會學專屬補充維度
▌步驟：文本定位 → 四層分析（辨識、文本依據、社會學意涵）→ 親和性診斷 → 批判性評估 → 社會想像總結
▌規範：客觀性語言是分析對象、量化與質性文本分析重點不同、允許多重歸屬、目的是揭示知識生產條件而非否定研究
（全文由後台保管；請勿把 PROMPT 貼進任何公開頁面或公開的 Git 倉庫）`,
    noCopy: true,
  },
  {
    id: "launch",
    title: "③ 啟動指令（階段二 Step 6）",
    desc: "三份文件上傳後的第一句話。",
    text: `請先遵循我上傳的分析 PROMPT，再根據我的課程大綱與教學指引整理檔，建議這門課適合提供學生哪些影片、閱讀素材或教學活動。要求：
1. 每項建議說明對應週次、使用時機（課前／課中／課後）、理由與查證方式；
2. 引用教學指引整理檔時標註來源編號；
3. 課綱與指引有衝突的地方列出來，由我裁決，不要自行選邊；
4. 你沒有實際驗證過的影片或連結，一律標記為「需教師確認」。`,
  },
];

const STS_CHECKS = [
  { t:"田野資料去識別化", w:"第 4、6、10 週", d:"訪談逐字稿與社群資料輸入任何 AI 前先去識別化；如確屬必要，宜先去識別化。", src:"17 雲科大" },
  { t:"揭露格式具體化", w:"全學期", d:"工具名稱與版本、使用方式／目的、AI 扮演的角色、受協助段落或頁數範圍。", src:"07 臺師大" },
  { t:"公共資產條款加退出權", w:"第 16 週", d:"學生若不同意共享其智慧財產權或學習紀錄，應使其有機會選擇退出；與著作授權同意書合併簽署。", src:"10 亞大" },
  { t:"互評不上傳外部 AI", w:"第 7 週", d:"將他組作品交給 AI 讀取須知情同意；未經允許勿上傳外部網站。", src:"08 政大、12 成大" },
  { t:"AI 文獻逐筆查證", w:"第 4、9 週", d:"AI 提供的文獻須以 DOI、圖書館目錄或原始網址確認存在。", src:"15 高雄科大" },
  { t:"意識形態訊息辨識", w:"第 2 週", d:"AI 產出可能夾帶意識形態訊息；與課綱的簡中資料、政治審查警示合併成正式練習。", src:"08 政大" },
];

const STS_WEEKS = [
  { w:"第 1 週", title:"介紹：如何瞭解科技與社會？", items:[
    ["影片 A","「公共化 AI，你我可以做什麼」提前到第一週課前（第 9 週回看）。"],
    ["活動","自我介紹的 AI 對照版：口頭版 vs AI 生成版，比較 AI 把你放進哪種敘事（情節模式初體驗）。"],
  ], when:"影片課前；帶讀與活動課中", why:"第一週即建立「AI 產出是分析對象」的基調；對應課綱目標（四）與清華「和 AI 共學」[11]。", check:"確認 YouTube 連結仍可播放；清華指引 PDF 見台灣資料分頁。" },
  { w:"第 2 週", title:"如何提問與分析：體制分析", items:[
    ["素材 B","同一科技事件請 AI 分別以繁中、簡中、英文各生成「客觀摘要」，並列出三個最重要的行動者。"],
    ["活動","四種修辭格檢查：哪些是隱喻、換喻、提喻？三個版本的行動者名單差在哪？"],
  ], when:"生成課前（含截圖）；分析課中 40 分鐘", why:"操作化課綱「內部視野、多元觀點、後設視野」；回應政大「意識形態訊息」[08] 與課綱的政治審查警示。", check:"學生保留完整對話連結；教師抽查 2 組。" },
  { w:"第 3 週", title:"物的政治性（ANT）", items:[
    ["閱讀 B","Langdon Winner, “Do Artifacts Have Politics?” (Daedalus, 1980) 與邱大昕並讀。"],
    ["活動","看不見的行動者：田野前請 AI 列出校園無障礙空間的人、物、制度、知識；田野後比對 AI 漏掉了誰（提喻追問）。"],
  ], when:"AI 清單課前；田野課中；比對課後 200 字", why:"對應關鍵字「非人行動者、必要通過點」；清華「提出不同於 AI 的觀點」[11]。", check:"Winner 一文由校內 JSTOR 取得，先確認可存取。" },
  { w:"第 4 週", title:"田野調查方法", items:[
    ["講義 A","《彙編》主題七一頁：去識別化 [17]、知情同意 [12][08]、退出權 [10]。"],
    ["活動","訪談大綱的精準提問練習：讓 AI 扮演受訪者試答，找出引導式題目（高雄科大「花蓮行程」例 [15]）。"],
    ["規則","用 AI 找的 5 份材料，每筆附 DOI 或圖書館目錄截圖。"],
  ], when:"講義課中 10 分鐘；練習 30 分鐘；查核課後", why:"全學期資料進入 AI 的起點，隱私與幻覺文獻兩個風險在此處理最省事。", check:"講義引文對照《彙編》主題七原文。" },
  { w:"第 5 週", title:"發明家／工程師的多元科技實作", items:[
    ["活動","先問 AI「誰發明了電燈？講一個故事」，再讀 Hughes；用四種情節模式替兩版歸類：AI 的敘事預設了什麼樣的「創新」？"],
    ["影片 B","臺大 NTU Focus「ChatGPT 的發展與原理」[09]：把 ChatGPT 當成 Hughes 式的科技社會系統來看。"],
  ], when:"AI 故事課前；歸類課中；影片課後選看", why:"對應「三種歷史階段的體制分析」；情節模式是學生最容易上手的一層。", check:"以「NTU Focus ChatGPT」搜尋確認集數與時長。" },
  { w:"第 6–7 週", title:"田野調查與討論", items:[
    ["活動","AI 統整結論、人負責判斷：各組報告後由 AI 彙整他組提問為三個待解問題，該組決定接受或反駁 [07]。"],
    ["制度","修改前後對照表（AI 初稿 → 我們的修改版）[25]，即期末附錄指令集雛形。"],
    ["規則","互評不得將他組 PPT 上傳外部 AI，除非該組同意 [08][12]。"],
  ], when:"皆在課中", why:"對應「彙整遭遇的問題」與平時成績「助教討論與小組互評 15%」。", check:"無外部素材。" },
  { w:"第 8 週", title:"典範、科學社群與不可共量", items:[
    ["活動","「水」的兩份清單：真人五科系 vs AI 五種口吻。AI 是否把各學科翻譯成可共量的同一套語言？（論證模式：多半是機械主義式通則化）"],
    ["影片 B","李宏毅「ChatGPT (可能)是怎麼煉成的－GPT 社會化的過程」[24]：模型如何被人類回饋訓練成「合適」的回答者，與典範對社群成員的訓練對照。"],
  ], when:"清單課前；比較課中；影片課後（前 15 分鐘）", why:"用 AI 的「過度可共量」反襯不可共量最直觀；對應「我的專業生活體制」實作。", check:"以片名搜尋 YouTube 確認。" },
  { w:"第 9 週", title:"彙整 AI 協作練習（核心週）", items:[
    ["影片 B","紀錄片 Coded Bias（2020, Shalini Kantayya），與「AI can be sexist and racist」同主題；可用浪漫劇（個人揭露結構偏誤）與「誰的問題被視為值得研究」分析。"],
    ["題綱 A","清華 AI 素養六項 [11] 與臺師大倫理五面向 [07]，每組就六項各寫一句本學期實例。"],
    ["活動","問卷的意識形態檢查：每題追問——把公共議題個人化了嗎（Mills）？預設誰是「正常」受訪者（Foucault）？只問單一軸線嗎（交織性）？"],
    ["清單","適合／不適合清單以《彙編》主題六四種用途分類：發想、多元觀點、提問訓練、研究方向。"],
  ], when:"影片課前擇一；題綱與檢查課中；清單課後", why:"對應課綱重點 1–4 與目標（四）；把 PROMPT 的社會學專屬維度 B、C、D 用在學生自己的研究工具上。", check:"Coded Bias 串流可得性需確認；不可得則用課綱既有影片。" },
  { w:"第 10–11 週", title:"田野調查與討論", items:[
    ["活動","新聞版面比較：AI 先做版面元素清單（標題、圖片、引述來源），學生逐報核對。AI 做清單，判斷由人做。"],
    ["提醒","第二輪訪談資料進 AI 前再次去識別化。"],
  ], when:"課後作業", why:"對應第 11 週作業；維持「AI 整理、人判斷」分工。", check:"無外部素材。" },
  { w:"第 12 週", title:"通識座談：人文社會協作的 AI 創新", items:[
    ["閱讀 A","數位部《人工智慧基本法》七原則與「資訊透明標記」[01]；座談時可問講者：本課揭露規定如何與國家層級的透明標記接軌？"],
  ], when:"課前 10 分鐘", why:"把課程規範放回 2026 年國家治理脈絡（PROMPT「生產脈絡」）。", check:"數位部專頁與本地 PDF 01。" },
  { w:"第 13 週", title:"科技治理", items:[
    ["報導 B","《報導者》RCA 工傷案系列，與林宜平一文比較學術書寫與調查報導的修辭。"],
    ["活動","常民認識論 vs AI 專家口吻：請 AI 回答某溶劑的安全暴露標準如何訂定，對照女工經驗。AI 是機械主義（標準＝客觀規律）還是脈絡主義（標準＝協商產物）？被化約掉的是什麼？這個標準對誰有利？"],
    ["作業 A","「氣」的詞彙練習保留，提醒注意 AI 對中醫詞彙的翻譯是否帶有現代醫學的隱性標準（全球—本土張力）。"],
  ], when:"報導課前；AI 對照課中；作業課後", why:"PROMPT 與課綱重疊最多的一週：再現、女性主義、常民認識論 ≈ 位置性、代表性政治、正常化機制。", check:"以「報導者 RCA」搜尋確認標題與日期；勿依賴 AI 提供的連結。" },
  { w:"第 14 週", title:"建構標準化的科技物體制（SCOT）", items:[
    ["活動","食物體制圖 AI 對照：請 AI 畫一顆蛋從農場到餐桌的供應鏈，比對第 3 週學生自己的圖。AI 版用了哪些「標準」與「邊界物」？哪些行動者被自然化成背景？（換喻：以價格代替體制）"],
  ], when:"AI 圖課前；比對課中", why:"對應關鍵字「標準化、邊界物、自然化」與「魚肉蛋奶菜水」實作。", check:"端傳媒為付費牆內容，確認校內授權。" },
  { w:"第 15–16 週", title:"期末報告", items:[
    ["格式 A","附錄「本組指令集」統一揭露欄位（工具與版本、用途、AI 角色、受協助段落）[07]，並附修改前後對照表 [25]。"],
    ["制度","授權同意書簽署時一併說明公共資產條款與退出選項 [10]。"],
    ["評分","可加一項「AI 協作揭露是否完整、是否有查證紀錄」[11]。"],
  ], when:"第 14 週公布格式；第 15 週起適用", why:"清華：評分宜著重課程期望學生培養的能力。", check:"無外部素材。" },
  { w:"參考週", title:"另類知識與世界（後殖民 STS）", items:[
    ["活動","請 AI 分別以西醫、中醫、阿育吠陀立場解釋同一症狀，再問「哪一種比較科學」；分析 AI 是否以現代化為隱性標準（後殖民追問）。"],
  ], when:"選用", why:"PROMPT 維度 E 全球—本土張力。", check:"無外部素材。" },
];

const STS_DISCLOSURE = `本作業／報告使用生成式 AI 情形如下：
1. 工具名稱與版本：（例：ChatGPT-5、Gemini 2.5、Claude）
2. 使用目的與方式：（議題發想／文句潤飾／結構參考／資料整理／其他）
3. AI 在本成果中扮演的角色：（初稿、對照版本、提問對象、翻譯……）
4. 受 AI 協助的段落或頁數範圍：
5. 查證方式：（所引文獻已逐筆以 DOI／圖書館目錄確認；AI 提供之數據已對照原始來源）
6. 對話紀錄連結或截圖：（附於附錄）
引用格式：視為 personal communication，依 APA／MLA／Chicago 對應格式標注。`;

function CopyButton({ id, text, copiedId, onCopy, label="複製" }) {
  const done = copiedId === id;
  return (
    <button type="button" onClick={()=>onCopy(id, text)}
      style={{ padding:"5px 12px", borderRadius:6, border:`1px solid ${done?C.green:C.sky}`, background:done?C.greenBg:C.surface, color:done?C.green:C.sky, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit", flexShrink:0 }}>
      {done ? "✓ 已複製" : label}
    </button>
  );
}

function SourceChip({ src }) {
  return <span style={{ display:"inline-block", padding:"1px 7px", borderRadius:4, background:C.tealBg, color:C.teal, fontSize:10, fontWeight:700, whiteSpace:"nowrap", border:`1px solid ${C.teal}30` }}>[{src}]</span>;
}

function ApplyTab({ onNavigate }) {
  const [section, setSection] = useState("flow");
  const [copiedId, setCopiedId] = useState(null);
  const [openTheme, setOpenTheme] = useState(0);
  const [openWeek, setOpenWeek] = useState(null);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [decisions, setDecisions] = useState({});
  const copy = (id, text) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(()=>setCopiedId(null), 2000); };
  const sections = [
    ["flow","工作流程"],["suggest","AI 課程建議"],["prompts","提示詞範本"],["digest","指引彙編"],["gaps","資料缺口"],["sts","STS 課程範例"],["files","下載"],
  ];
  const subNav = (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:18, position:"sticky", top:-24, background:C.skyBg, padding:"6px 0", zIndex:5 }}>
      {sections.map(([id,l])=>(
        <button key={id} type="button" onClick={()=>setSection(id)}
          style={{ padding:"6px 13px", borderRadius:20, border:`1px solid ${section===id?C.teal:C.border}`, background:section===id?C.teal:C.surface, color:section===id?"white":C.muted, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit" }}>{l}</button>
      ))}
    </div>
  );

  return (
    <div>
      <SectionHeader icon="🎯" title="課程應用：從指引到課程專屬建議" sub={`《AI 協助課程素材整理與教學建議》Step 1–8 的完整實作紀錄。示範案例：${APPLY_META.course}；原始資料：本站台灣資料分頁的 ${APPLY_META.sourceCount} 份 PDF；產出日期 ${APPLY_META.generated}。`} />
      {subNav}

      {section==="flow" && (
        <div>
          <Card style={{ marginBottom:16, background:C.tealBg, border:`1px solid ${C.teal}40` }}>
            <div style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>
              邏輯是<strong>收斂 → 應用 → 把關</strong>：先把十幾份雜亂、重複的指引濃縮成一份《整理檔》，第二階段才不會被雜訊干擾。指引之間重複、寫法不一是預期中的，交給 AI 在對照課綱時判斷；人是最後把關者。文件更新時只需重跑階段一。
            </div>
          </Card>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>
            {APPLY_PHASES.map(p=>(
              <Card key={p.phase} style={{ borderTop:`4px solid ${p.color}` }}>
                <h3 style={{ margin:"0 0 12px", fontSize:15, color:C.navy }}>{p.phase}</h3>
                <div style={{ display:"grid", gap:10 }}>
                  {p.steps.map(s=>(
                    <div key={s.n} style={{ display:"grid", gridTemplateColumns:"30px 1fr", gap:10, padding:11, background:C.grayBg, border:`1px solid ${C.border}`, borderRadius:8 }}>
                      <span style={{ width:28, height:28, borderRadius:"50%", background:p.color, color:"white", display:"grid", placeItems:"center", fontSize:12, fontWeight:800 }}>{s.n}</span>
                      <div style={{ minWidth:0 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                          <strong style={{ color:C.navy, fontSize:13 }}>{s.t}</strong>
                          {s.tag && <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4, background:s.tag.startsWith("✋")?C.amberBg:s.tag==="產出"?C.greenBg:C.skyBg, color:s.tag.startsWith("✋")?C.amber:s.tag==="產出"?C.green:C.sky }}>{s.tag}</span>}
                        </div>
                        <div style={{ color:C.muted, fontSize:12, lineHeight:1.55, marginTop:4 }}>{s.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <Card style={{ marginTop:16 }}>
            <h3 style={{ margin:"0 0 8px", fontSize:14, color:C.navy }}>本次實作的三份輸入與兩份產出</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:8, fontSize:12 }}>
              {[
                ["輸入 1","課程大綱","STS課程課程大綱20260128.docx（16 週，含 AI 倫理聲明）"],
                ["輸入 2","教學指引整理檔","由 27 份 PDF 萃取，11 個主題、17 個有效來源"],
                ["輸入 3","分析 PROMPT","中心專屬，不公開；由後台注入（White 四元框架社會學版）"],
                ["產出 A","《教學指引整理檔》","本頁「指引彙編」即其網頁版"],
                ["產出 B","《STS 課程專屬建議》","本頁「STS 課程範例」即其網頁版"],
              ].map(([k,t,d])=>(
                <div key={k} style={{ padding:10, borderRadius:7, background:k.startsWith("產出")?C.greenBg:C.skyBg, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:k.startsWith("產出")?C.green:C.sky }}>{k}</div>
                  <div style={{ fontWeight:700, color:C.navy, marginTop:2 }}>{t}</div>
                  <div style={{ color:C.muted, marginTop:3, lineHeight:1.5 }}>{d}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {section==="suggest" && (
        <div>
          <Card style={{ marginBottom:14, borderTop:`4px solid ${C.teal}` }}>
            <h3 style={{ margin:"0 0 8px", fontSize:15, color:C.navy }}>老師只要上傳課程大綱</h3>
            <div style={{ fontSize:13, color:C.text, lineHeight:1.75 }}>
              階段二（Step 5–7）已做成一個對話框：老師貼上或上傳 .docx 課程大綱，<strong>後台自動注入中心專屬的分析 PROMPT 與《教學指引整理檔》</strong>，回傳逐週的素材與活動建議（含使用時機、理由、查證方式、衝突清單與教師把關表）。PROMPT 不會出現在網頁或任何公開檔案裡。
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:8, marginTop:12, fontSize:12 }}>
              {[
                ["省 token","PROMPT＋整理檔固定在 system 層並標記快取；每次只為課綱與回答付全價，快取部分約 1/10 價格。"],
                ["存取控制","中心發給老師共用通行碼，後台另設每日次數上限。"],
                ["資料","課綱內容會送到模型 API；請勿放入學生個資或未去識別化資料。"],
              ].map(([t,d])=>(
                <div key={t} style={{ padding:10, borderRadius:7, background:C.grayBg, border:`1px solid ${C.border}` }}>
                  <div style={{ fontWeight:700, color:C.navy, marginBottom:3 }}>{t}</div>
                  <div style={{ color:C.muted, lineHeight:1.55 }}>{d}</div>
                </div>
              ))}
            </div>
            <a href={AI_SUGGEST_URL} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-block", marginTop:14, padding:"10px 18px", borderRadius:8, background:C.teal, color:"white", fontWeight:700, fontSize:13 }}>
              開啟 AI 課程建議 →
            </a>
            <div style={{ color:C.muted, fontSize:11, marginTop:8, lineHeight:1.6 }}>
              目前為本機測試版（{AI_SUGGEST_URL}，需先在中心電腦執行 `後台/啟動.ps1`）；部署到中心主機後，此連結會改為正式網址。
            </div>
          </Card>
        </div>
      )}

      {section==="prompts" && (
        <div style={{ display:"grid", gap:14 }}>
          {APPLY_PROMPTS.map(p=>(
            <Card key={p.id}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <h3 style={{ margin:0, fontSize:14, color:C.navy }}>{p.title}</h3>
                  <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12, lineHeight:1.6 }}>{p.desc}</p>
                </div>
                {!p.noCopy && <CopyButton id={p.id} text={p.text} copiedId={copiedId} onCopy={copy} label="複製全文" />}
              </div>
              <pre style={{ margin:0, whiteSpace:"pre-wrap", fontFamily:"inherit", fontSize:12, lineHeight:1.7, color:C.text, background:C.grayBg, border:`1px solid ${C.border}`, borderRadius:8, padding:12, maxHeight: p.long && !showFullPrompt ? 220 : "none", overflow:"hidden", position:"relative" }}>
                {p.text}
              </pre>
              {p.long && (
                <button type="button" onClick={()=>setShowFullPrompt(!showFullPrompt)} style={{ marginTop:8, padding:"5px 12px", border:`1px solid ${C.border}`, borderRadius:6, background:C.surface, color:C.sky, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                  {showFullPrompt ? "收起" : "展開完整 PROMPT（約 3,500 字）"}
                </button>
              )}
            </Card>
          ))}
        </div>
      )}

      {section==="digest" && (
        <div>
          <Card style={{ marginBottom:14 }}>
            <div style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>
              以下每則引文為<strong>原文</strong>（僅去除斷行與頁眉），來源編號對應本站「台灣資料」分頁的 PDF 檔名前綴。同一主題下多校說法相近者仍分別列出，末尾「彙整說明」指出重複與差異——這是給 Step 5–7 判斷用的，不是結論。
            </div>
          </Card>
          <div style={{ display:"grid", gap:8 }}>
            {GUIDE_DIGEST.map((t,i)=>(
              <Card key={i} style={{ padding:0, overflow:"hidden" }}>
                <button type="button" onClick={()=>setOpenTheme(openTheme===i?-1:i)}
                  style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", gap:10, padding:"13px 16px", border:"none", background:openTheme===i?C.skyBg:C.surface, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
                  <span style={{ fontWeight:700, color:C.navy, fontSize:14 }}>{t.title}</span>
                  <span style={{ color:C.muted, fontSize:11, whiteSpace:"nowrap" }}>{t.quotes.length} 則 · {openTheme===i?"▲":"▼"}</span>
                </button>
                {openTheme===i && (
                  <div style={{ padding:"4px 16px 16px" }}>
                    {t.quotes.map((q,j)=>(
                      <div key={j} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}`, display:"grid", gridTemplateColumns:"1fr auto", gap:10, alignItems:"start" }}>
                        <div style={{ fontSize:12.5, color:C.text, lineHeight:1.7 }}>{q.text}</div>
                        <SourceChip src={q.src} />
                      </div>
                    ))}
                    <div style={{ marginTop:12, padding:12, borderRadius:8, background:C.amberBg, border:`1px solid ${C.amber}35`, fontSize:12, color:C.text, lineHeight:1.65 }}>
                      <strong style={{ color:C.amber }}>彙整說明：</strong>{t.note}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {section==="gaps" && (
        <div>
          <Card style={{ marginBottom:14, background:C.orangeBg, border:`1px solid ${C.orange}40` }}>
            <div style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>
              Step 3 人工抽查發現：{APPLY_META.sourceCount} 份本地 PDF 中有 <strong>{APPLY_META.emptyCount} 份沒有實質內容</strong>（存檔時抓到的是網頁殼、下載清單、維護頁或 403 錯誤頁）。這些在「台灣資料」分頁已標為<span style={{ color:C.amber, fontWeight:700 }}>「備份待補」</span>；在補齊原始 PDF 前，Step 5–7 若要引用這些學校，須另取原文。
            </div>
          </Card>
          <Card>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
              <thead><tr style={{ background:C.navyMid }}>{["編號","來源","實際存到的內容","補救方式"].map(h=><th key={h} style={{ padding:"9px 10px", color:"#e2e8f0", textAlign:"left", fontWeight:600 }}>{h}</th>)}</tr></thead>
              <tbody>
                {GUIDE_EMPTY_SOURCES.map((r,i)=>(
                  <tr key={r.n} style={{ background:i%2?C.grayBg:C.surface }}>
                    {[r.n,r.name,r.got,r.fix].map((c,j)=><td key={j} style={{ padding:"8px 10px", color:C.text, borderBottom:`1px solid ${C.border}`, verticalAlign:"top", lineHeight:1.5 }}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {section==="sts" && (
        <div>
          <Card style={{ marginBottom:14 }}>
            <h3 style={{ margin:"0 0 6px", fontSize:14, color:C.navy }}>分析路徑（依 PROMPT 分析步驟）</h3>
            <div style={{ fontSize:12.5, color:C.text, lineHeight:1.7 }}>
              先把<strong>課程大綱本身當作文本</strong>做文本定位與四層分析（主導隱喻「體制／看不見的行動者」；浪漫式個人養成 × 悲劇式結構分析；脈絡主義為主、有機主義為輔；自由—激進之間、知識公共化立場），再以此為透鏡對照《彙編》檢核課程 AI 規範，最後逐週給素材與活動。核心設計：<strong>讓 AI 的每一次產出，都成為修辭格、情節、論證、意識形態四層分析的練習材料</strong>。完整分析見下載區的 docx。
            </div>
          </Card>

          <h3 style={{ margin:"18px 0 10px", fontSize:15, color:C.navy }}>課綱 AI 規範對照《彙編》：建議補強六點</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:10 }}>
            {STS_CHECKS.map((c,i)=>(
              <Card key={i} style={{ padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:6 }}>
                  <strong style={{ color:C.navy, fontSize:13 }}>{i+1}. {c.t}</strong>
                  <span style={{ fontSize:10, color:C.muted, whiteSpace:"nowrap" }}>{c.w}</span>
                </div>
                <div style={{ fontSize:12, color:C.text, lineHeight:1.6 }}>{c.d}</div>
                <div style={{ marginTop:6 }}><SourceChip src={c.src} /></div>
              </Card>
            ))}
          </div>

          <h3 style={{ margin:"22px 0 10px", fontSize:15, color:C.navy }}>逐週素材與活動建議</h3>
          <div style={{ fontSize:11.5, color:C.muted, marginBottom:10, lineHeight:1.6 }}>
            A 類＝課綱或指引已提及、只需確認連結；B 類＝本次新增、<strong style={{ color:C.orange }}>可得性未經 AI 實際驗證</strong>，開學前須由教師點開確認。點選週次展開；右側可記錄教師判斷（僅存於此瀏覽器）。
          </div>
          <div style={{ display:"grid", gap:8 }}>
            {STS_WEEKS.map((wk,i)=>{
              const open = openWeek===i;
              const dec = decisions[i] || "";
              return (
                <Card key={i} style={{ padding:0, overflow:"hidden", borderLeft:`4px solid ${dec==="keep"?C.green:dec==="edit"?C.amber:dec==="drop"?C.red:C.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:open?C.skyBg:C.surface }}>
                    <button type="button" onClick={()=>setOpenWeek(open?null:i)} style={{ flex:1, display:"flex", gap:10, alignItems:"center", border:"none", background:"transparent", cursor:"pointer", textAlign:"left", fontFamily:"inherit", padding:0 }}>
                      <span style={{ minWidth:70, fontWeight:800, color:C.teal, fontSize:12 }}>{wk.w}</span>
                      <span style={{ fontWeight:700, color:C.navy, fontSize:13, flex:1 }}>{wk.title}</span>
                      <span style={{ color:C.muted, fontSize:11 }}>{wk.items.length} 項 {open?"▲":"▼"}</span>
                    </button>
                    <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                      {[["keep","保留",C.green],["edit","修改",C.amber],["drop","刪除",C.red]].map(([v,l,col])=>(
                        <button key={v} type="button" onClick={()=>setDecisions({...decisions,[i]:dec===v?"":v})}
                          style={{ padding:"3px 8px", borderRadius:4, border:`1px solid ${dec===v?col:C.border}`, background:dec===v?col:C.surface, color:dec===v?"white":C.muted, fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{l}</button>
                      ))}
                    </div>
                  </div>
                  {open && (
                    <div style={{ padding:"6px 14px 14px" }}>
                      {wk.items.map(([k,d],j)=>(
                        <div key={j} style={{ display:"grid", gridTemplateColumns:"64px 1fr", gap:10, padding:"7px 0", borderBottom:`1px solid ${C.border}`, fontSize:12.5, lineHeight:1.65 }}>
                          <span style={{ fontWeight:700, color:k.includes("B")?C.orange:C.sky, fontSize:11 }}>{k}</span>
                          <span style={{ color:C.text }}>{d}</span>
                        </div>
                      ))}
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:8, marginTop:10, fontSize:12 }}>
                        {[["使用時機",wk.when,C.skyBg],["理由",wk.why,C.tealBg],["查證方式",wk.check,C.amberBg]].map(([t,v,bg])=>(
                          <div key={t} style={{ padding:9, borderRadius:7, background:bg, border:`1px solid ${C.border}` }}>
                            <div style={{ fontSize:10, fontWeight:700, color:C.muted, marginBottom:3 }}>{t}</div>
                            <div style={{ color:C.text, lineHeight:1.55 }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <Card style={{ marginTop:18 }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:12, alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <h3 style={{ margin:0, fontSize:14, color:C.navy }}>AI 使用揭露模板（供課綱或作業說明採用）</h3>
                <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12 }}>整合臺師大四要素 [07] 與亞大／暨南引用格式建議 [10][20]。</p>
              </div>
              <CopyButton id="disclosure" text={STS_DISCLOSURE} copiedId={copiedId} onCopy={copy} />
            </div>
            <pre style={{ margin:0, whiteSpace:"pre-wrap", fontFamily:"inherit", fontSize:12, lineHeight:1.7, color:C.text, background:C.grayBg, border:`1px solid ${C.border}`, borderRadius:8, padding:12 }}>{STS_DISCLOSURE}</pre>
          </Card>

          <Card style={{ marginTop:14, background:C.navy, color:"white" }}>
            <h3 style={{ margin:"0 0 8px", fontSize:14, color:"white" }}>社會想像總結與可能的誤用</h3>
            <p style={{ margin:0, fontSize:12.5, lineHeight:1.7, color:"#cbd5e1" }}>
              這門課預設的「社會」是由人、知識、物、制度異質配置而成的體制場域，權力分布不均但可被分析、可被「另類體制」局部改寫；AI 在其中不是答案來源，而是一個新的、需要被體制分析的行動者。若學生只把上述活動當成「AI 說錯了」的挑錯遊戲，會落入諷刺式的相對主義——目標是辨識 AI 產出的條件與限制，而非否定其用處（清華素養第 6 項「持續反思 AI 與人類的關係」）。
            </p>
          </Card>
        </div>
      )}

      {section==="files" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12 }}>
          {[
            ["執行步驟（Word）", APPLY_META.files.steps, "八步驟操作說明，含簡化流程圖"],
            ["教學指引整理檔（Word）", APPLY_META.files.digest, "Step 4 產出：11 主題、原文＋來源編號"],
            ["STS 課程專屬建議（Word）", APPLY_META.files.suggestions, "Step 7 產出：四層分析、六點補強、逐週建議、把關表"],
          ].map(([t,href,d])=>(
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ display:"block", padding:16, borderRadius:10, background:C.surface, border:`1px solid ${C.border}`, color:C.text }}>
              <div style={{ fontWeight:700, color:C.navy, fontSize:13 }}>📄 {t}</div>
              <div style={{ color:C.muted, fontSize:12, marginTop:4, lineHeight:1.5 }}>{d}</div>
              <div style={{ color:C.sky, fontSize:11, marginTop:8, wordBreak:"break-all" }}>{href}</div>
            </a>
          ))}
          <Card style={{ gridColumn:"1 / -1", background:C.tealBg }}>
            <div style={{ fontSize:12.5, color:C.text, lineHeight:1.7 }}>
              可追溯性：所有引文皆標註來源編號，對應「台灣資料」分頁的本地 PDF；本頁內容由 AI（Claude）依三份輸入產出，未使用其他外部資料；B 類素材可得性須由教師確認。若要對另一門課重跑，只需替換課程大綱（輸入 1），階段一的整理檔可直接沿用。
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Badge({ code }) {
  const m = POLICY_CODE_MAP[code] || POLICY_CODE_MAP.E;
  return (
    <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:600, color:m.color, background:m.bg, border:`1px solid ${m.color}30` }}>
      {code} · {m.label}
    </span>
  );
}


function getUrlVerification(url) {
  if (!url) return { status:"MISSING", label:"待補 URL", date:"待補", color:C.red, bg:C.redBg };
  const row = URL_CHECK_RESULTS[url];
  if (!row) return { status:"UNCHECKED", label:"未列入批次檢查", date:URL_VERIFIED_DATE, color:C.amber, bg:C.amberBg };
  if (row.status === "OK") return { status:"OK", label:"URL 已核實", date:URL_VERIFIED_DATE, color:C.green, bg:C.greenBg };
  return { status:"ERROR", label:`需人工複核${row.code ? " " + row.code : ""}`, date:URL_VERIFIED_DATE, color:C.orange, bg:C.orangeBg };
}

function getVerificationKey(url) {
  return getUrlVerification(url).status;
}

function VerificationCell({ url }) {
  const v = getUrlVerification(url);
  return (
    <div title={v.label} style={{ display:"inline-flex", flexDirection:"column", gap:3 }}>
      <span style={{ color:v.color, background:v.bg, border:`1px solid ${v.color}30`, borderRadius:4, padding:"2px 6px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>{v.date}</span>
      <span style={{ color:C.muted, fontSize:10, whiteSpace:"nowrap" }}>{v.label}</span>
    </div>
  );
}

const TAIWAN_PDF_FILES = {
  1: "台灣各大學AI教學指引/01_數位發展部_人工智慧基本法.pdf",
  2: "台灣各大學AI教學指引/02_國科會_行政院及所屬機關構使用生成式AI參考指引.pdf",
  3: "台灣各大學AI教學指引/04_教育部_中小學數位教學指引3.0.pdf",
  4: "台灣各大學AI教學指引/05_教育部_中小學使用生成式人工智慧注意事項.pdf",
  5: "台灣各大學AI教學指引/06_臺灣學術倫理教育學會_人工智慧技術對學術倫理的影響及因應建議.pdf",
  6: "台灣各大學AI教學指引/07_臺師大_生成式AI之學習應用及參考指引.pdf",
  7: "台灣各大學AI教學指引/08_政大_生成式人工智慧運用簡要原則.pdf",
  8: "台灣各大學AI教學指引/09_臺大_針對生成式AI工具之教學因應措施.pdf",
  9: "台灣各大學AI教學指引/11_清華大學_大學教育場域AI協作共學與素養培養指引.pdf",
  10: "台灣各大學AI教學指引/12_成功大學_AI及相關學習工具參考指南.pdf",
  11: "台灣各大學AI教學指引/13_中山大學_生成式AI工具使用參照指引.pdf",
  12: "台灣各大學AI教學指引/19_陽明交通大學_因應生成式AI之指引及教學建議.pdf",
  13: "台灣各大學AI教學指引/23_北科大_因應生成式AI工具之教學參考指引.pdf",
  14: "台灣各大學AI教學指引/16_臺科大_生成式AI簡介與教學策略調整建議方針.pdf",
  15: "台灣各大學AI教學指引/18_中國醫藥大學_針對生成式AI工具之教學指引.pdf",
  16: "台灣各大學AI教學指引/25_臺北醫學大學_生成式AI工具之課程教學參考指引.pdf",
  17: "台灣各大學AI教學指引/26_逢甲大學_針對生成式AI工具之教學因應措施.pdf",
  18: "台灣各大學AI教學指引/27_慈濟大學_AI賦能大學教育指引.pdf",
  19: "台灣各大學AI教學指引/10_亞洲大學_針對生成式AI工具之教學因應措施.pdf",
  20: "台灣各大學AI教學指引/15_高雄科大_針對生成式AI工具之教學因應措施.pdf",
  21: "台灣各大學AI教學指引/17_雲科大_生成式AI工具教學須知.pdf",
  22: "台灣各大學AI教學指引/20_暨南大學_針對生成式AI工具之教學因應措施.pdf",
  23: "台灣各大學AI教學指引/22_中央大學_學生使用ChatGPT基本原則.pdf",
  24: "台灣各大學AI教學指引/24_長庚大學_生成式AI的教研衝擊與因應.pdf",
};
// 2026-09-06 人工抽查：這些 id 的本地 PDF 只是網頁殼／清單頁／錯誤頁，尚無指引本文
const TAIWAN_PDF_PENDING = new Set([2,3,4,11,12,17,18]);

function StatusDot({ status }) {
  const ok = status.includes("已核實") || status.includes("PDF已存檔");
  const warn = status.includes("缺日期") || status.includes("需人工") || status.includes("複核") || status.includes("待補");
  const err = status.includes("URL") || status.includes("失敗") || status.includes("FAILED");
  const color = ok ? C.green : warn ? C.orange : err ? C.red : C.gray;
  return <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:color, marginRight:5 }} title={status} />;
}

function SectionHeader({ icon, title, sub }) {
  return (
    <div style={{ marginBottom:24 }}>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.navy, margin:0, display:"flex", alignItems:"center", gap:8 }}>
        <span>{icon}</span>{title}
      </h2>
      {sub && <p style={{ color:C.muted, fontSize:13, margin:"6px 0 0", lineHeight:1.6 }}>{sub}</p>}
      <div style={{ height:3, width:48, background:`linear-gradient(90deg,${C.sky},${C.teal})`, borderRadius:2, marginTop:10 }} />
    </div>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:C.surface, borderRadius:10, border:`1px solid ${C.border}`, padding:20, ...style }}>{children}</div>;
}

function StatCard({ value, label, color=C.sky }) {
  return (
    <Card style={{ textAlign:"center", flex:"1 1 120px" }}>
      <div style={{ fontSize:32, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{label}</div>
    </Card>
  );
}

function AppStyles() {
  return <style>{`
    .skip-link {
      position: fixed; left: 12px; top: -48px; z-index: 100;
      padding: 9px 12px; border-radius: 6px; background: #ffffff;
      color: #0f172a; box-shadow: 0 4px 14px rgba(15,23,42,.18);
    }
    .skip-link:focus { top: 12px; }
    .nav-tab:focus-visible, .home-action:focus-visible {
      outline: 3px solid #7dd3fc; outline-offset: -3px;
    }
    .nav-tab:hover { background: rgba(56,189,248,.08) !important; color: #e0f2fe !important; }
    .home-action:hover { border-color: #0ea5e9 !important; background: #f0f9ff !important; }
    .home-stat-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 12px; margin-bottom: 18px; }
    .home-action-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; margin-bottom: 20px; }
    .home-primary-grid { display: grid; grid-template-columns: minmax(0,1.65fr) minmax(280px,1fr); gap: 16px; margin-bottom: 16px; }
    .home-lower-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .home-workflow-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 12px; }
    .home-roadmap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    @media (max-width: 1040px) {
      .home-stat-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
      .home-action-grid { grid-template-columns: 1fr; }
      .home-primary-grid, .home-lower-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 760px) {
      body { height: auto !important; overflow: auto !important; }
      .app-shell { min-height: 100vh; height: auto !important; flex-direction: column; overflow: visible !important; }
      .app-nav { width: 100% !important; max-height: none; overflow: visible !important; position: sticky; top: 0; z-index: 20; }
      .app-nav-head { display: none; }
      .app-nav-tabs { display: flex; overflow-x: auto; padding: 4px !important; }
      .nav-tab { width: auto !important; flex: 0 0 auto; border-left: 0 !important; padding: 9px 11px !important; }
      .app-nav-footer { display: none; }
      .app-main { overflow: visible !important; padding: 18px 14px 32px !important; }
      .home-stat-grid, .home-workflow-grid, .home-roadmap-grid { grid-template-columns: 1fr; }
      .home-hero { padding: 20px !important; }
      .home-hero h1 { font-size: 25px !important; }
    }
  `}</style>;
}

// ─── TAB CONTENTS ────────────────────────────────────────────

function SummaryTab({ onNavigate }) {
  const regionDist = { "Africa 非洲":11, "North America 北美":19, "South America 南美洲":6, "Asia 亞洲":17, "Oceania 大洋洲":17, "Europe 歐洲":20 };
  const workflow = [
    ["1","整理原始資料","集中政策、研究、影片清單與既有教材。"],
    ["2","掃描並萃取","找出教學設計、課程安排與學習活動內容。"],
    ["3","建立指引整理檔","移除重複、合併相近內容並保留不同觀點。"],
    ["4","準備三份必要輸入","課程大綱、教學指引整理檔及分析 PROMPT。"],
    ["5","在同一工作區上傳","將三份文件一起上傳至 AI 對話或專案。"],
    ["6","產出並由教師確認","對應週次、使用時機與理由，最後由教師修正。"],
  ];
  const actions = [
    ["globaldb","瀏覽全球資料庫","搜尋學校、文件、政策類型與核實狀態"],
    ["apply","課程應用實作","八步驟流程、指引彙編、提示詞範本與 STS 課程範例"],
    ["decision","建立課程政策","依課程任務選擇 AI 使用強度與揭露要求"],
  ];
  return (
    <div className="home-dashboard">
      <section className="home-hero" style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`5px solid ${C.teal}`, borderRadius:8, padding:"24px 26px", marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:18, alignItems:"flex-start", flexWrap:"wrap" }}>
          <div style={{ maxWidth:820 }}>
            <div style={{ color:C.teal, fontWeight:700, fontSize:12, marginBottom:7 }}>全球政策資料庫平台</div>
            <h1 style={{ margin:0, color:C.navy, fontSize:30, lineHeight:1.25, letterSpacing:0, textWrap:"balance" }}>AI 教學指引資料庫</h1>
            <p style={{ margin:"10px 0 0", color:C.muted, fontSize:13, lineHeight:1.7, textWrap:"pretty" }}>
              現階段完成資料蒐集、來源查核、中文化摘要、初步分類與網頁查詢；後續規劃導入多層次標籤、資料品質檢核及 RAG 問答。
            </p>
          </div>
          <div style={{ color:C.muted, fontSize:11, lineHeight:1.6, borderLeft:`3px solid ${C.teal}`, paddingLeft:12 }}>
            資料更新<br/><strong style={{ color:C.navy, fontSize:13 }}>2026-09-06</strong>
          </div>
        </div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginTop:15 }}>
          <span style={{ padding:"4px 8px", borderRadius:4, background:C.tealBg, color:C.teal, fontSize:11, fontWeight:700 }}>目前：中文化資料庫與查詢</span>
          <span style={{ padding:"4px 8px", borderRadius:4, background:C.orangeBg, color:C.orange, fontSize:11, fontWeight:700 }}>後續：多層標籤與 RAG</span>
        </div>
      </section>

      <section className="home-stat-grid" aria-label="資料庫統計">
        {[
          ["90","全球大學資料筆數",C.sky],
          ["24","台灣機構資料筆數",C.teal],
          ["10","國際機構指引筆數",C.orange],
          ["8","國際重點大學",C.navyLight],
        ].map(([value,label,color])=>(
          <div key={label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`4px solid ${color}`, borderRadius:8, padding:"17px 18px" }}>
            <div style={{ color, fontSize:30, fontWeight:800, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{value}</div>
            <div style={{ color:C.text, fontSize:12, fontWeight:700, marginTop:9 }}>{label}</div>
          </div>
        ))}
      </section>

      <section className="home-action-grid" aria-label="主要功能入口">
        {actions.map(([id,title,desc])=>(
          <button key={id} type="button" className="home-action" onClick={()=>onNavigate(id)}
            style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, padding:"15px 16px", borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, textAlign:"left", cursor:"pointer", fontFamily:"inherit", transition:"background-color .15s ease, border-color .15s ease" }}>
            <span style={{ minWidth:0 }}>
              <span style={{ display:"block", color:C.navy, fontWeight:700, fontSize:14 }}>{title}</span>
              <span style={{ display:"block", color:C.muted, fontSize:11, lineHeight:1.5, marginTop:4 }}>{desc}</span>
            </span>
            <span aria-hidden="true" style={{ color:C.sky, fontSize:20, flexShrink:0 }}>→</span>
          </button>
        ))}
      </section>

      <div className="home-primary-grid">
        <section style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:20 }}>
          <h2 style={{ margin:"0 0 5px", color:C.navy, fontSize:18 }}>AI 協助課程素材整理流程</h2>
          <p style={{ margin:"0 0 15px", color:C.muted, fontSize:12, lineHeight:1.6 }}>先整理資料，再用三份必要輸入進行課程專屬分析。</p>
          <div className="home-workflow-grid">
            {workflow.map(([n,t,d])=>(
              <div key={n} style={{ display:"grid", gridTemplateColumns:"30px minmax(0,1fr)", gap:9, padding:11, background:C.grayBg, border:`1px solid ${C.border}`, borderRadius:7 }}>
                <span style={{ width:28, height:28, borderRadius:"50%", display:"grid", placeItems:"center", background:C.teal, color:"white", fontSize:12, fontWeight:800 }}>{n}</span>
                <span style={{ minWidth:0 }}>
                  <strong style={{ display:"block", color:C.navy, fontSize:12, marginBottom:3 }}>{t}</strong>
                  <span style={{ display:"block", color:C.muted, fontSize:11, lineHeight:1.5 }}>{d}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:20 }}>
          <h2 style={{ margin:"0 0 5px", color:C.navy, fontSize:18 }}>分析階段使用說明</h2>
          <p style={{ margin:"0 0 14px", color:C.muted, fontSize:12, lineHeight:1.6 }}>三份文件用途不同，應在同一個 AI 工作區同時提供。</p>
          {["課程大綱","教學指引整理檔","分析 PROMPT"].map((item,i)=>(
            <div key={item} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 11px", marginBottom:8, background:C.tealBg, borderLeft:`4px solid ${C.teal}`, borderRadius:5, color:C.text, fontSize:12, fontWeight:700 }}>
              <span style={{ width:22, height:22, display:"grid", placeItems:"center", borderRadius:4, background:"#ccfbf1", color:C.teal, fontSize:11 }}>{i+1}</span>
              {item}
            </div>
          ))}
          <div style={{ marginTop:13, padding:13, borderRadius:7, background:C.amberBg, border:`1px solid ${C.amber}35` }}>
            <strong style={{ display:"block", color:C.amber, fontSize:12, marginBottom:7 }}>PROMPT 上傳前檢核</strong>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, color:C.text, fontSize:10, lineHeight:1.5 }}>
              {["角色與任務範圍","理論或分析框架","明確分析步驟","輸出格式與篇幅","引用與查證要求","隱私及著作權界線"].map(x=><span key={x}>✓ {x}</span>)}
            </div>
          </div>
        </aside>
      </div>

      <div className="home-lower-grid">
        <section style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:20 }}>
          <h2 style={{ margin:"0 0 12px", fontSize:15, color:C.navy }}>全球資料分布</h2>
          {Object.entries(regionDist).map(([r,n])=>(
            <div key={r} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
              <span style={{ color:C.text }}>{r}</span>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width: n*5, height:8, background:`linear-gradient(90deg,${C.sky},${C.teal})`, borderRadius:4 }} />
                <span style={{ color:C.muted, fontWeight:600, minWidth:20, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{n}</span>
              </div>
            </div>
          ))}
        </section>
        <section style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:20 }}>
          <h2 style={{ margin:"0 0 12px", fontSize:15, color:C.navy }}>資料品質狀態</h2>
          {[
            ["待補發布日期","80 筆","持續人工補查"],
            ["待補正式 URL","3 筆","優先確認官方來源"],
            ["台灣 PDF 備份待補","7 筆","存檔為網頁殼，見課程應用→資料缺口"],
            ["最近網址核實","2026-06-17","保留查核紀錄"],
            ["中文摘要","人工校對","不直接採用機器翻譯"],
          ].map(([t,v,d])=>(
            <div key={t} style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:8, padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
              <span><strong style={{ display:"block", color:C.text, fontSize:12 }}>{t}</strong><span style={{ color:C.muted, fontSize:10 }}>{d}</span></span>
              <span style={{ color:C.orange, fontSize:12, fontWeight:700, fontVariantNumeric:"tabular-nums" }}>{v}</span>
            </div>
          ))}
        </section>
      </div>

      <section style={{ background:C.navy, borderRadius:8, padding:"19px 21px", color:"white" }}>
        <h2 style={{ margin:"0 0 13px", fontSize:16, color:"white" }}>建置進度與後續規劃</h2>
        <div className="home-roadmap-grid">
          <div>
            <strong style={{ color:"#5eead4", fontSize:12 }}>目前已完成</strong>
            <p style={{ margin:"6px 0 0", color:"#cbd5e1", fontSize:11, lineHeight:1.65 }}>人工蒐集與來源查核、中文化摘要與初步分類、網頁篩選查詢及台灣指引本地備份；以 STS 課程完成「指引 → 課程專屬建議」八步驟實作（見課程應用）。</p>
          </div>
          <div>
            <strong style={{ color:"#fcd34d", fontSize:12 }}>下一階段規劃</strong>
            <p style={{ margin:"6px 0 0", color:"#cbd5e1", fontSize:11, lineHeight:1.65 }}>導入半自動多層次標籤與資料品質檢核；完成引用追溯後，再建置向量檢索與 RAG 問答。</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function HowtoTab() {
  const rows = [
    ["教師要整理課程素材", "先完成下方工作流程，並在同一個 AI 工作區上傳課程大綱、教學指引整理檔與分析 PROMPT。完整實作範例與可複製的提示詞見「課程應用」分頁。"],
    ["系所要訂共通規範", "先看「政策分級」，再參照「台灣資料」與「國際機構」框架。"],
    ["研究助理要繼續蒐集", "依本 SOP 補齊日期、URL、版本狀態與查核日期。"],
    ["要做人文社會課程指引", "比較寫作、詮釋、創作、資料分析與田野研究的 AI 使用邊界。"],
  ];
  const workflow = [
    ["1", "整理原始資料", "把政策、研究、影片清單與既有教材集中在同一資料夾。"],
    ["2", "掃描並萃取", "請 AI 先閱讀全部資料，只萃取與教學設計、課程安排及學習活動有關的內容。"],
    ["3", "建立指引整理檔", "移除重複、合併相近內容、保留不同觀點，輸出成獨立文件。"],
    ["4", "準備三份必要輸入", "課程大綱、教學指引整理檔、分析 PROMPT，三者用途不可混在一起。"],
    ["5", "在同一工作區上傳", "將三份文件一起上傳至實際使用的 AI 對話或專案，再開始分析。"],
    ["6", "產出並由教師確認", "要求建議對應週次、使用時機、理由與查證方式，最後由教師取捨修正。"],
  ];
  const promptChecks = [
    "角色與任務範圍",
    "採用的理論或分析框架",
    "明確的分析步驟",
    "輸出格式與篇幅",
    "引用原文與查證要求",
    "隱私、著作權與不得臆測的界線",
  ];
  const disciplines = [
    ["寫作/論證", "AI 容易取代核心學習歷程", "限制或禁止，要求草稿、引用與反思紀錄", "B / A"],
    ["閱讀/摘要", "AI 摘要可能造成未讀原文與錯誤理解", "允許作為核對工具，不可取代指定閱讀", "C"],
    ["量化分析", "AI 可提升效率但可能產生不可重現或錯誤程式", "要求程式碼、資料來源與人工驗證", "C"],
    ["田野/訪談", "涉及隱私、同意與資料保護", "禁止上傳未匿名化資料，要求倫理審查意識", "A"],
    ["創作/媒體", "AI 參與程度影響作者性與評分公平", "要求揭露 AI 參與比例與創作歷程", "C / D"],
  ];
  return (
    <div>
      <SectionHeader icon="🧭" title="如何使用本平台" />
      <Card style={{ marginBottom:20 }}>
        <h3 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:C.navy }}>依使用者身分找入口</h3>
        <div style={{ display:"grid", gap:10 }}>
          {rows.map(([r,d])=>(
            <div key={r} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:12, borderRadius:8, background:C.skyBg, border:`1px solid ${C.sky}20` }}>
              <span style={{ fontWeight:700, color:C.sky, minWidth:140, fontSize:13 }}>{r}</span>
              <span style={{ color:C.text, fontSize:13, lineHeight:1.6 }}>{d}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ marginBottom:20 }}>
        <h3 style={{ margin:"0 0 6px", fontSize:15, fontWeight:700, color:C.navy }}>AI 協助課程素材整理流程</h3>
        <p style={{ margin:"0 0 14px", color:C.muted, fontSize:12, lineHeight:1.6 }}>
          分析階段必須另外上傳一份 PROMPT。它負責規定 AI 如何分析，不是待分析的課程素材。
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:10 }}>
          {workflow.map(([n,t,d])=>(
            <div key={n} style={{ display:"flex", gap:10, padding:12, borderRadius:8, background:C.grayBg, border:`1px solid ${C.border}` }}>
              <span style={{ width:26, height:26, borderRadius:"50%", background:C.sky, color:"white", display:"grid", placeItems:"center", flexShrink:0, fontSize:12, fontWeight:700 }}>{n}</span>
              <div>
                <div style={{ color:C.navy, fontWeight:700, fontSize:13, marginBottom:4 }}>{t}</div>
                <div style={{ color:C.muted, fontSize:12, lineHeight:1.55 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14, padding:14, borderRadius:8, background:C.skyBg, border:`1px solid ${C.sky}30` }}>
          <div style={{ color:C.sky, fontWeight:700, fontSize:13, marginBottom:8 }}>PROMPT 上傳前檢核</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:10 }}>
            {promptChecks.map(item=>(
              <span key={item} style={{ padding:"4px 8px", borderRadius:4, background:C.surface, border:`1px solid ${C.border}`, color:C.text, fontSize:11 }}>✓ {item}</span>
            ))}
          </div>
          <div style={{ color:C.text, fontSize:12, lineHeight:1.65 }}>
            啟動指令：請先遵循我上傳的分析 PROMPT，再根據課程大綱與教學指引整理檔提出課程專屬建議；每項建議需標示對應週次、使用時機、理由與查證方式。
          </div>
          <div style={{ color:C.muted, fontSize:11, marginTop:7 }}>
            參考範例：Prompt_社會批評(By DW).docx，包含角色、四層分析框架、分析步驟、補充維度與使用規範。
          </div>
        </div>
      </Card>
      <Card>
        <h3 style={{ margin:"0 0 14px", fontSize:14, fontWeight:700, color:C.navy }}>人文社會領域 AI 使用邊界參考</h3>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:C.navyMid }}>
                {["任務類型","主要風險","建議做法","建議代碼"].map(h=>(
                  <th key={h} style={{ padding:"10px 12px", color:"#e2e8f0", textAlign:"left", fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {disciplines.map((r,i)=>(
                <tr key={i} style={{ background:i%2===0?C.surface:C.grayBg }}>
                  {r.map((c,j)=>(
                    <td key={j} style={{ padding:"9px 12px", color:C.text, borderBottom:`1px solid ${C.border}`, verticalAlign:"top" }}>
                      {j===3 ? c.split("/").map(x=><Badge key={x} code={x.trim()} />) : c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function DecisionTab() {
  return (
    <div>
      <SectionHeader icon="⚖️" title="教師課綱 AI 使用政策決策表" sub="依課程類型快速選擇適合的政策強度與揭露要求。" />
      {DECISION_TABLE.map((row,i)=>(
        <Card key={i} style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:C.navy }}>{row.context}</h3>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
              <span style={{ fontSize:13, color:C.muted }}>{row.policy}</span>
              <Badge code={row.code} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
            {[["✅ 可允許使用",row.allowed,C.greenBg,C.green],["🚫 應禁止或限制",row.prohibited,C.redBg,C.red],["📋 學生揭露要求",row.disclosure,C.skyBg,C.sky]].map(([label,val,bg,col])=>(
              <div key={label} style={{ background:bg, borderRadius:8, padding:12, border:`1px solid ${col}20` }}>
                <div style={{ fontWeight:700, color:col, fontSize:12, marginBottom:6 }}>{label}</div>
                <div style={{ color:C.text, fontSize:12, lineHeight:1.65 }}>{val}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function TemplatesTab({ copyTemplate, copiedId }) {
  const DISCLOSURE_FIELDS = [
    ["使用工具","例如 ChatGPT、Claude、Gemini、Copilot、Perplexity 等"],
    ["使用目的","發想、摘要、翻譯、潤飾、除錯、資料分析、圖像生成等"],
    ["使用範圍","說明哪些段落、程式碼、圖表或研究步驟受到 AI 協助"],
    ["主要提示詞摘要","不必逐字貼上全部對話，但需說明提問方向與關鍵要求"],
    ["人工查證與修改","列出學生如何查證、修正錯誤、改寫或拒絕 AI 建議"],
    ["責任聲明","學生確認最終提交內容由本人負責，並符合課程與學術誠信規範"],
  ];
  const CHECKLIST = [
    ["學習目標是否清楚","學生是否知道本作業要練習的是知識、方法、判斷、寫作或工具使用？"],
    ["AI 使用邊界是否明確","是否列出允許、限制、禁止的具體行為？"],
    ["評量方式是否能看見過程","是否要求草稿、資料處理紀錄、口頭說明、反思或版本紀錄？"],
    ["揭露要求是否可執行","學生是否知道如何填寫 AI 使用聲明？"],
    ["風險是否被處理","是否考慮隱私、偏誤、著作權、錯誤資訊與不公平取得工具？"],
    ["違規後果是否清楚","是否連結校內學術誠信規範或教師課程規則？"],
  ];
  const [checked, setChecked] = useState({});
  const toggle = k => setChecked(p=>({...p,[k]:!p[k]}));

  return (
    <div>
      <SectionHeader icon="📝" title="課綱模板與實用工具" sub="點擊複製按鈕即可直接貼入您的課程大綱。" />
      <div style={{ display:"grid", gap:16, marginBottom:24 }}>
        {SYLLABUS_TEMPLATES.map(t=>(
          <Card key={t.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Badge code={t.code} />
                <span style={{ fontWeight:700, color:C.navy, fontSize:15 }}>{t.title}</span>
              </div>
              <button
                onClick={()=>copyTemplate(t.id, t.content)}
                style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${C.sky}`, background:copiedId===t.id?C.sky:C.surface, color:copiedId===t.id?"white":C.sky, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all .2s" }}>
                {copiedId===t.id ? "✓ 已複製！" : "📋 複製條文"}
              </button>
            </div>
            <div style={{ background:C.grayBg, borderRadius:8, padding:14, fontSize:13, lineHeight:1.75, color:C.text, borderLeft:`4px solid ${POLICY_CODE_MAP[t.code]?.color}` }}>
              {t.content}
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom:20 }}>
        <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700, color:C.navy }}>📋 學生 AI 使用揭露表欄位</h3>
        <div style={{ display:"grid", gap:8 }}>
          {DISCLOSURE_FIELDS.map(([f,d])=>(
            <div key={f} style={{ display:"flex", gap:12, padding:10, borderRadius:8, background:C.skyBg, fontSize:13 }}>
              <span style={{ fontWeight:700, color:C.sky, minWidth:120 }}>{f}</span>
              <span style={{ color:C.text }}>{d}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700, color:C.navy }}>✅ 作業設計檢核表</h3>
        <div style={{ display:"grid", gap:8 }}>
          {CHECKLIST.map(([item,q],i)=>(
            <div key={i} onClick={()=>toggle(i)} style={{ display:"flex", gap:12, padding:10, borderRadius:8, background:checked[i]?C.greenBg:C.surface, border:`1px solid ${checked[i]?C.green:C.border}`, cursor:"pointer", transition:"all .2s" }}>
              <span style={{ width:20, height:20, borderRadius:4, border:`2px solid ${checked[i]?C.green:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:checked[i]?C.green:"transparent", color:"white", fontSize:12 }}>
                {checked[i]?"✓":""}
              </span>
              <div>
                <div style={{ fontWeight:600, color:C.navy, fontSize:13 }}>{item}</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{q}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, textAlign:"right", fontSize:12, color:C.muted }}>
          已完成 {Object.values(checked).filter(Boolean).length}/{CHECKLIST.length} 項
        </div>
      </Card>
    </div>
  );
}

function CodesTab() {
  return (
    <div>
      <SectionHeader icon="🏷️" title="政策強度與使用情境編碼" sub="用 A-E 五個代碼快速標記每份指引的政策強度。" />
      <div style={{ display:"grid", gap:12 }}>
        {POLICY_CODES.map(pc=>{
          const m = POLICY_CODE_MAP[pc.code];
          return (
            <Card key={pc.code}>
              <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ width:48, height:48, borderRadius:10, background:m.bg, border:`2px solid ${m.color}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontWeight:800, fontSize:20, color:m.color }}>{pc.code}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:16, color:m.color, marginBottom:4 }}>{pc.label}</div>
                  <div style={{ color:C.text, fontSize:13, marginBottom:8 }}>{pc.def}</div>
                  <div style={{ background:m.bg, borderRadius:6, padding:"6px 10px", fontSize:12, color:m.color }}>
                    📌 適用情境：{pc.contexts}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TaiwanTab() {
  const levels = [...new Set(TAIWAN_DATA.map(r=>r.level))];
  const [filter, setFilter] = useState("全部");
  const filtered = filter==="全部" ? TAIWAN_DATA : TAIWAN_DATA.filter(r=>r.level===filter);
  return (
    <div>
      <SectionHeader icon="🇹🇼" title="台灣 AI 教學與治理資料地圖" sub="24 筆台灣各層級機構 AI 教學指引；URL 核實 2026-06-17；2026-09-06 人工抽查本地 PDF 內容，7 筆存檔為網頁殼者標為「備份待補」。" />
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {["全部",...levels].map(l=>(
          <button key={l} onClick={()=>setFilter(l)}
            style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${filter===l?C.sky:C.border}`, background:filter===l?C.sky:C.surface, color:filter===l?"white":C.muted, cursor:"pointer", fontSize:12, fontWeight:600 }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gap:10 }}>
        {filtered.map(r=>(
          <Card key={r.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                  <span style={{ background:C.skyBg, color:C.sky, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:4 }}>{r.level}</span>
                  <span style={{ background:C.grayBg, color:C.muted, fontSize:11, padding:"2px 8px", borderRadius:4 }}>{r.type}</span>
                  {r.date && <span style={{ color:C.muted, fontSize:11 }}>📅 {r.date}</span>}
                </div>
                <div style={{ fontWeight:700, color:C.navy, fontSize:14, marginBottom:3 }}>{r.inst}</div>
                <div style={{ color:C.text, fontSize:13 }}>{r.name}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end", flexShrink:0 }}>
                <span style={{ fontSize:11, color:TAIWAN_PDF_PENDING.has(r.id)?C.amber:C.orange, background:TAIWAN_PDF_PENDING.has(r.id)?C.amberBg:C.orangeBg, padding:"2px 8px", borderRadius:4 }}>{r.status}</span>
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.sky, textDecoration:"none" }}>🔗 前往</a>}
                {TAIWAN_PDF_FILES[r.id] && !TAIWAN_PDF_PENDING.has(r.id) && <a href={TAIWAN_PDF_FILES[r.id]} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.teal, textDecoration:"none" }}>📄 PDF</a>}
                {TAIWAN_PDF_PENDING.has(r.id) && <span title="本地存檔僅為網頁截圖，尚無指引本文；見「課程應用 → 資料缺口」" style={{ fontSize:11, color:C.amber, fontWeight:700 }}>⚠ 備份待補</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IntlTab() {
  const orgs = [...new Set(INTL_ORGS.map(r=>r.org))];
  const [filter, setFilter] = useState("全部");
  const filtered = filter==="全部" ? INTL_ORGS : INTL_ORGS.filter(r=>r.org===filter);
  return (
    <div>
      <SectionHeader icon="🌐" title="國際機構 AI 教育框架" sub="UNESCO、OECD、TeachAI、EDUCAUSE 等 10 筆國際指引。" />
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["全部",...orgs].map(o=>(
          <button key={o} onClick={()=>setFilter(o)}
            style={{ padding:"5px 12px", borderRadius:20, border:`1px solid ${filter===o?C.teal:C.border}`, background:filter===o?C.teal:C.surface, color:filter===o?"white":C.muted, cursor:"pointer", fontSize:12, fontWeight:600 }}>
            {o}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gap:12 }}>
        {filtered.map(r=>(
          <Card key={r.id}>
            <div style={{ display:"flex", gap:12 }}>
              <div style={{ width:52, flexShrink:0 }}>
                <div style={{ background:C.teal, color:"white", fontWeight:800, fontSize:11, borderRadius:6, padding:"4px 6px", textAlign:"center" }}>{r.org}</div>
                {r.date && <div style={{ fontSize:10, color:C.muted, textAlign:"center", marginTop:4 }}>{r.date}</div>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:C.navy, fontSize:14, marginBottom:6 }}>{r.name}</div>
                <div style={{ color:C.muted, fontSize:12, lineHeight:1.6, marginBottom:8 }}>{r.summary}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ background:C.tealBg, color:C.teal, fontSize:11, padding:"2px 8px", borderRadius:4 }}>{r.type}</span>
                  {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.sky }}>🔗 原文連結</a>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function KeyUnisTab() {
  return (
    <div>
      <SectionHeader icon="🎓" title="國際重點大學 AI 教學指引" sub="8 所優先參考的重點大學；已改用 2026-06-18 補查後可開啟的官方頁面與摘要。" />
      <div style={{ display:"grid", gap:14 }}>
        {KEY_UNIVERSITIES.map((u,i)=>(
          <Card key={i}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <div style={{ textAlign:"center", flexShrink:0, minWidth:48 }}>
                <div style={{ fontSize:18 }}>{u.rank}</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>優先度</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                  <span style={{ fontWeight:700, color:C.navy, fontSize:15 }}>{u.inst}</span>
                  <span style={{ background:C.skyBg, color:C.sky, fontSize:11, padding:"2px 8px", borderRadius:4 }}>{u.type}</span>
                  <span style={{ background:C.greenBg, color:C.green, fontSize:11, padding:"2px 8px", borderRadius:4 }}>核實 {u.verifiedDate}</span>
                </div>
                <div style={{ color:C.text, fontSize:13, marginBottom:8, fontWeight:600 }}>{u.name}</div>
                <div style={{ color:C.muted, fontSize:12, lineHeight:1.65, marginBottom:6 }}>{u.summary}</div>
                <div style={{ color:C.teal, fontSize:11, marginBottom:10 }}>{u.verification}</div>
                <a href={u.url} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"6px 14px", background:C.sky, color:"white", borderRadius:6, fontSize:12, fontWeight:600, textDecoration:"none" }}>
                  🔗 前往指引
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GlobalDBTab() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const regions = useMemo(()=>[...new Set(GLOBAL_DB.map(r=>r.region))], []);
  const types = useMemo(()=>[...new Set(GLOBAL_DB.map(r=>r.type))], []);
  const verificationSummary = useMemo(()=>GLOBAL_DB.reduce((acc,r)=>{
    const key = getVerificationKey(r.url);
    acc[key] = (acc[key]||0)+1;
    return acc;
  }, {}), []);

  const filtered = useMemo(()=>{
    const q = search.toLowerCase();
    return GLOBAL_DB.filter(r=>{
      const v = getUrlVerification(r.url);
      const haystack = [r.uni,r.name,r.country,r.region,r.type,r.url,v.label,v.date].join(" ").toLowerCase();
      const ms = !q||haystack.includes(q);
      const mr = region==="all"||r.region===region;
      const mt = type==="all"||r.type===type;
      const mv = status==="all"||v.status===status;
      return ms&&mr&&mt&&mv;
    });
  }, [search,region,type,status]);

  const pages = Math.max(1, Math.ceil(filtered.length/PER_PAGE));
  const pageData = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const exportCSV = () => {
    const cols = ["id","region","country","uni","name","date","type","verificationDate","verificationStatus","url"];
    const rows = [cols.join(","), ...filtered.map(r=>{
      const v = getUrlVerification(r.url);
      const row = { ...r, verificationDate:v.date, verificationStatus:v.label };
      return cols.map(c=>`"${(row[c]||"").replace(/"/g,'""')}"`).join(",");
    })];
    const blob = new Blob(["\uFEFF"+rows.join("\n")], {type:"text/csv"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="AI_Teaching_Guidelines_DB.csv"; a.click();
  };

  return (
    <div>
      <SectionHeader icon="🗃️" title="全球大學 AI 教學指引資料庫" sub={`共 90 筆 · 篩選後顯示 ${filtered.length} 筆 · 第 ${page}/${pages} 頁`} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))", gap:10, marginBottom:16 }}>
        <StatCard value={verificationSummary.OK||0} label="URL 已核實" color={C.green} />
        <StatCard value={verificationSummary.ERROR||0} label="需人工複核" color={C.orange} />
        <StatCard value={verificationSummary.MISSING||0} label="待補 URL" color={C.red} />
        <StatCard value={GLOBAL_DB.filter(r=>!r.date).length} label="待補發布日期" color={C.amber} />
      </div>

      {/* Filters */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr auto", gap:10, alignItems:"end" }}>
          <div>
            <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:4 }}>搜尋機構/文件/URL/核實狀態</label>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
              placeholder="輸入關鍵字…" style={{ width:"100%", padding:"8px 10px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:13, boxSizing:"border-box" }} />
          </div>
          <div>
            <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:4 }}>地區</label>
            <select value={region} onChange={e=>{setRegion(e.target.value);setPage(1);}}
              style={{ width:"100%", padding:"8px 10px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:13 }}>
              <option value="all">全部地區</option>
              {regions.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:4 }}>指引類型</label>
            <select value={type} onChange={e=>{setType(e.target.value);setPage(1);}}
              style={{ width:"100%", padding:"8px 10px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:13 }}>
              <option value="all">全部類型</option>
              {types.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12, color:C.muted, display:"block", marginBottom:4 }}>核實狀態</label>
            <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}}
              style={{ width:"100%", padding:"8px 10px", border:`1px solid ${C.border}`, borderRadius:6, fontSize:13 }}>
              <option value="all">全部狀態</option>
              <option value="OK">URL 已核實</option>
              <option value="ERROR">需人工複核</option>
              <option value="MISSING">待補 URL</option>
              <option value="UNCHECKED">未列入批次檢查</option>
            </select>
          </div>
          <button onClick={exportCSV}
            style={{ padding:"8px 16px", background:C.teal, color:"white", border:"none", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
            ⬇ 匯出 CSV
          </button>
        </div>
      </Card>

      {/* Table */}
      <div style={{ overflowX:"auto", background:C.surface, borderRadius:10, border:`1px solid ${C.border}` }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:C.navyMid }}>
              {["#","地區","機構名稱","文件名稱","發布日期","類型","核實日期","連結"].map(h=>(
                <th key={h} style={{ padding:"10px 12px", color:"#e2e8f0", textAlign:"left", fontWeight:600, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((r,i)=>(
              <tr key={r.id} style={{ background:i%2===0?C.surface:C.grayBg, transition:"background .15s" }}>
                <td style={{ padding:"9px 12px", color:C.subtle, borderBottom:`1px solid ${C.border}` }}>{r.id}</td>
                <td style={{ padding:"9px 12px", color:C.muted, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{r.region.split(" ")[0]}</td>
                <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}`, maxWidth:180 }}>
                  <div style={{ fontWeight:600, color:C.navy }}>{r.uni}</div>
                  <div style={{ color:C.muted, fontSize:11 }}>{r.country}</div>
                </td>
                <td style={{ padding:"9px 12px", color:C.text, borderBottom:`1px solid ${C.border}`, maxWidth:260 }}>{r.name}</td>
                <td style={{ padding:"9px 12px", color:C.muted, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{r.date||<span style={{color:C.orange}}>待補</span>}</td>
                <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>
                  <span style={{ background:C.skyBg, color:C.sky, fontSize:10, padding:"2px 6px", borderRadius:4 }}>{r.type}</span>
                </td>
                <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}` }}>
                  <VerificationCell url={r.url} />
                </td>
                <td style={{ padding:"9px 12px", borderBottom:`1px solid ${C.border}` }}>
                  {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color:C.sky, fontSize:12 }}>🔗</a> : <span style={{color:C.border}}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages>1&&(
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:14 }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            style={{ padding:"6px 12px", border:`1px solid ${C.border}`, borderRadius:6, background:C.surface, cursor:page===1?"not-allowed":"pointer", color:C.muted, fontSize:12 }}>←</button>
          {Array.from({length:pages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)}
              style={{ padding:"6px 12px", border:`1px solid ${p===page?C.sky:C.border}`, borderRadius:6, background:p===page?C.sky:C.surface, color:p===page?"white":C.muted, cursor:"pointer", fontSize:12 }}>
              {p}
            </button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}
            style={{ padding:"6px 12px", border:`1px solid ${C.border}`, borderRadius:6, background:C.surface, cursor:page===pages?"not-allowed":"pointer", color:C.muted, fontSize:12 }}>→</button>
        </div>
      )}
    </div>
  );
}

function ToolsTab() {
  const syllabus_resources = [
    { inst:"Yale University (Poorvu Center)", name:"Sample AI Syllabus Statements", feature:"依課程類型分類（大型講課、STEM、人文寫作、創意寫作），最常被引用", url:"https://poorvucenter.yale.edu/teaching/teaching-resource-library/ai-guidance-for-teachers/ai-course-assignment-design/sample-ai" },
    { inst:"Stanford University", name:"Creating Your Course Policy on AI", feature:"從學術誠信、學生成功、課業負擔三面向思考，有具體範例句子可直接套用", url:"https://teachingcommons.stanford.edu/teaching-guides/artificial-intelligence" },
    { inst:"University of Texas at Austin", name:"Generative AI Syllabus Statements", feature:"針對不同情境提供極具體文字（如「可用於發想但不可生成可交作業文本」）", url:"https://provost.utexas.edu/policies-resources/faculty-resources/ai-guidance/generative-ai-syllabus-statements" },
    { inst:"Tufts University", name:"Developing Syllabus Statements for AI", feature:"範本中融入「學習目標」論述，解釋為何訂定此政策", url:"https://provost.tufts.edu/celt/developing-syllabus-statements-for-ai/" },
    { inst:"Lance Eaton（研究者）", name:"Syllabi Policies for AI Generative Tools", feature:"最大型的眾包政策資料庫，含數百位教師的實際 syllabus 條文", url:"https://docs.google.com/document/d/1RMVwzjc1o0Mi8Blw_-JUTcXv02b2WRH86vw7mi16W3U/edit" },
    { inst:"MLA-CCCC Joint Task Force", name:"Building a Culture for Gen AI Literacy", feature:"專針對語言、文學、寫作課程，對人文學科最具參考價值", url:"https://mla.org/About-Us/Governance/Committees/MLA-CCCC-Task-Force-on-Writing-and-AI" },
  ];
  return (
    <div>
      <SectionHeader icon="🛠️" title="教師最實用資源精選" sub="附錄：原始重點資源彙整，可直接採用或改寫。" />
      <div style={{ display:"grid", gap:12 }}>
        {syllabus_resources.map((r,i)=>(
          <Card key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
              <div>
                <div style={{ fontWeight:700, color:C.navy, fontSize:14, marginBottom:4 }}>{r.name}</div>
                <div style={{ color:C.sky, fontSize:12, marginBottom:6 }}>{r.inst}</div>
                <div style={{ color:C.text, fontSize:12, lineHeight:1.6 }}>{r.feature}</div>
              </div>
              <a href={r.url} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink:0, padding:"6px 14px", background:C.sky, color:"white", borderRadius:6, fontSize:12, fontWeight:600, textDecoration:"none", height:"fit-content" }}>
                前往
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UpdatesTab() {
  const [scheduleInfo, setScheduleInfo] = useState(false);

  const scheduleOptions = [
    { icon:"⚙️", title:"GitHub Actions（免費推薦）", desc:"每日定時觸發 workflow，爬取各大學指引頁面的最新內容，比對差異後自動發通知。", code:`# .github/workflows/ai-guidelines-check.yml
name: Daily AI Guidelines Check
on:
  schedule:
    - cron: '0 2 * * *'  # 每天 UTC 02:00（台灣 10:00）
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install requests beautifulsoup4
      - run: python scripts/check_updates.py
      - name: Send notification if changes found
        if: steps.check.outputs.changed == 'true'
        uses: dawidd6/action-send-mail@v3` },
    { icon:"🔄", title:"n8n / Make 自動化（低代碼）", desc:"建立定時工作流程：每日爬取目標 URL → 比對快取 → 有更新則寄 Email 或發 Slack 通知。", code:`工作流程設計：
1. 定時觸發（每日一次）
2. HTTP Request 節點 → 依序抓取各大學 URL
3. 比對上次快取內容
4. 若發現差異 → Email/Slack 通知
5. 更新快取資料` },
    { icon:"🐍", title:"Python + 排程腳本", desc:"本地或雲端 VPS 執行，使用 cron + requests 定期抓取，並透過 Anthropic API 智慧分析變動。", code:`import schedule, time, requests
from anthropic import Anthropic

def check_url(url, cache):
    r = requests.get(url, timeout=10)
    if cache.get(url) != r.text[:500]:
        cache[url] = r.text[:500]
        return True  # 有變動
    return False

def daily_check():
    URLS = [
        "https://poorvucenter.yale.edu/...",
        "https://www.nstc.gov.tw/...",
        # 加入更多追蹤 URL
    ]
    changes = [u for u in URLS if check_url(u, cache)]
    if changes:
        # 用 Claude API 分析變動摘要
        client = Anthropic()
        client.messages.create(...)

schedule.every().day.at("10:00").do(daily_check)
while True:
    schedule.run_pending()
    time.sleep(60)` },
  ];

  return (
    <div>
      <SectionHeader icon="🔄" title="資料更新與排程設定" sub="AI 教學指引持續演進，建議定期查核。以下提供自動排程設定方案。" />

      {/* Schedule Options */}
      <div style={{ marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:C.navy }}>⏰ 自動排程設定方案</h3>
        <button onClick={()=>setScheduleInfo(!scheduleInfo)}
          style={{ padding:"5px 12px", border:`1px solid ${C.border}`, borderRadius:6, background:C.surface, color:C.sky, cursor:"pointer", fontSize:12 }}>
          {scheduleInfo ? "收起" : "展開說明"}
        </button>
      </div>
      <div style={{ display:"grid", gap:14 }}>
        {scheduleOptions.map((opt,i)=>(
          <Card key={i}>
            <div style={{ display:"flex", gap:12 }}>
              <span style={{ fontSize:24 }}>{opt.icon}</span>
              <div style={{ flex:1 }}>
                <h4 style={{ margin:"0 0 6px", fontSize:14, fontWeight:700, color:C.navy }}>{opt.title}</h4>
                <p style={{ margin:"0 0 10px", color:C.muted, fontSize:13 }}>{opt.desc}</p>
                {scheduleInfo && (
                  <pre style={{ background:C.navyMid, color:"#a5f3fc", padding:12, borderRadius:8, fontSize:11, overflowX:"auto", margin:0, lineHeight:1.7 }}>{opt.code}</pre>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Update SOP */}
      <Card style={{ marginTop:20, background:C.tealBg }}>
        <h3 style={{ margin:"0 0 12px", fontSize:15, fontWeight:700, color:C.teal }}>📋 人工查核 SOP</h3>
        {[
          "判斷新增資料用途：校級政策、教師教學、學生指引、學術誠信、研究倫理或 AI 素養",
          "優先找官方來源：政府、學校教務處、教學中心、學術誠信辦公室、圖書館、正式 PDF",
          "補齊基本欄位：發布日期、更新日期、適用對象、正式 URL、查核日期",
          "用政策強度 A-E 編碼，再用使用情境標籤標示",
          "人工校對中文摘要：保留原文標題，中文摘要只描述重點，不直接照機器翻譯",
          "每學期更新一次；若台灣法規或校級政策更新，立即重新查核相關段落",
          "本地 PDF 備份除檢查 HTTP 狀態外，須人工開檔確認有指引本文（2026-09-06 抽查：7 筆僅為網頁殼，待補）",
        ].map((s,i)=>(
          <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:i<6?`1px solid ${C.border}`:"none", fontSize:13, color:C.text }}>
            <span style={{ color:C.teal, fontWeight:700, minWidth:20 }}>{i+1}.</span> {s}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────

export default function App() {
  const initialTab = () => {
    const hash = window.location.hash.replace("#","");
    return TABS.some(tab=>tab.id===hash) ? hash : "summary";
  };
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    document.body.style.margin = "0";
    const onHashChange = () => {
      const hash = window.location.hash.replace("#","");
      if (TABS.some(tab=>tab.id===hash)) setActiveTab(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) window.history.replaceState(null,"","#summary");
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigateTo = id => {
    setActiveTab(id);
    if (window.location.hash !== `#${id}`) window.location.hash = id;
    document.getElementById("main-content")?.scrollTo({ top:0 });
  };

  const content = {
    summary:   <SummaryTab onNavigate={navigateTo} />,
    howto:     <HowtoTab />,
    apply:     <ApplyTab onNavigate={navigateTo} />,
    decision:  <DecisionTab />,
    templates: <TemplatesTab copyTemplate={(id,c)=>{navigator.clipboard.writeText(c);}} copiedId={null} />,
    codes:     <CodesTab />,
    taiwan:    <TaiwanTab />,
    intl:      <IntlTab />,
    keyuni:    <KeyUnisTab />,
    globaldb:  <GlobalDBTab />,
    tools:     <ToolsTab />,
    updates:   <UpdatesTab />,
  };

  // Special stateful template tab
  function StatefulTemplateTab() {
    const [copiedId, setCopiedId] = useState(null);
    const copyTemplate = (id, c) => {
      navigator.clipboard.writeText(c);
      setCopiedId(id);
      setTimeout(()=>setCopiedId(null), 2000);
    };
    return <TemplatesTab copyTemplate={copyTemplate} copiedId={copiedId} />;
  }

  return (
    <>
    <AppStyles />
    <a className="skip-link" href="#main-content" onClick={e=>{ e.preventDefault(); document.getElementById("main-content")?.focus(); }}>跳至主要內容</a>
    <div className="app-shell" style={{ fontFamily:"'Noto Sans TC', sans-serif", display:"flex", height:"100vh", background:C.skyBg, overflow:"hidden" }}>
      {/* Sidebar */}
      <nav className="app-nav" aria-label="主要導覽" style={{ width:195, background:C.navy, display:"flex", flexDirection:"column", flexShrink:0, overflowY:"auto" }}>
        <div className="app-nav-head" style={{ padding:"18px 14px 14px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize:15, fontWeight:800, color:C.skyLight, letterSpacing:"-0.3px" }}>AI 教學指引</div>
          <div style={{ fontSize:11, color:C.subtle, marginTop:3 }}>全球政策資料庫平台</div>
          <div style={{ marginTop:10, display:"flex", gap:6 }}>
            <span style={{ background:"rgba(56,189,248,0.15)", color:C.skyLight, fontSize:10, padding:"2px 6px", borderRadius:4 }}>90 校</span>
            <span style={{ background:"rgba(16,185,129,0.15)", color:"#34d399", fontSize:10, padding:"2px 6px", borderRadius:4 }}>更新 09-06</span>
          </div>
        </div>
        <div className="app-nav-tabs" style={{ flex:1, padding:"8px 0" }}>
          {TABS.map(tab=>(
            <button key={tab.id} type="button" className="nav-tab" aria-current={activeTab===tab.id?"page":undefined} onClick={()=>navigateTo(tab.id)}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:9, padding:"9px 14px",
                border:"none", cursor:"pointer", textAlign:"left",
                background:activeTab===tab.id?"rgba(56,189,248,0.12)":"transparent",
                color:activeTab===tab.id?C.skyLight:C.subtle,
                borderLeft:activeTab===tab.id?`3px solid ${C.sky}`:"3px solid transparent",
                fontSize:13, fontFamily:"inherit", fontWeight:activeTab===tab.id?700:400,
                transition:"background-color .15s ease, color .15s ease, border-color .15s ease",
              }}>
              <span aria-hidden="true" style={{ fontSize:15 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="app-nav-footer" style={{ padding:"10px 14px", borderTop:"1px solid rgba(255,255,255,0.08)", fontSize:10, color:"#64748b" }}>
          最後文件更新：2026-09-06
        </div>
      </nav>

      {/* Content */}
      <main id="main-content" className="app-main" tabIndex="-1" style={{ flex:1, overflowY:"auto", padding:"24px 28px 40px" }}>
        {activeTab === "templates" ? <StatefulTemplateTab /> : content[activeTab]}
      </main>
    </div>
    </>
  );
}

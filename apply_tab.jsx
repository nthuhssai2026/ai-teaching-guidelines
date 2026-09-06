
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

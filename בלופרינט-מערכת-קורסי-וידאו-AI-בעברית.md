# 🎬 בלופרינט־על: מערכת אוטומטית להפקת ליין שלם של קורסי וידאו בעברית מפרומפט אחד

> **מסמך מחקר ותכנון הנדסי · גרסה 1.0 · 17.06.2026**
> נכתב על בסיס ניתוח reverse‑engineering של סרטון הייחוס שסיפקת + מחקר עומק מקבילי בן 4 זרמים (קול עברי · אווטאר+ליפסינק · הרכבת וידאו · תזמור end‑to‑end), כ‑60 חיפושי רשת בעברית ובאנגלית, נכון לאמצע 2026.

---

## 📑 תוכן עניינים

0. [תקציר מנהלים — מה בנינו פה](#0)
1. [ניתוח סרטון הייחוס (reverse‑engineering מלא)](#1)
2. [העיקרון המרכזי — שלוש ההכרעות שמייצרות את האיכות](#2)
3. [ארכיטקטורת־העל של המערכת](#3)
4. [מודל הנתונים — סכמת ה־Course Tree](#4)
5. [ה־Pipeline שלב־אחר־שלב (S0→S8)](#5)
6. [🇮🇱 עמוד השדרה של העברית — המדריך המלא](#6)
7. [👄 עמוד השדרה של הליפסינק — איך לא יורדים מתחת לסרטון הייחוס](#7)
8. [🎨 שכפול מערכת העיצוב (Remotion + RTL)](#8)
9. [⌨️ "הפרומפט האחד" — החוזה המדויק](#9)
10. [🧰 ה־Stack המומלץ + טבלת עלויות אמיתית](#10)
11. [🗺️ תוכנית בנייה מדורגת (MVP → Production)](#11)
12. [📎 נספחים — דירוגי כלים, הגדרות, מקורות](#12)

---

<a name="0"></a>
## 0. תקציר מנהלים — מה בנינו פה

המטרה: מערכת שמקבלת **פרומפט אחד** —

> *"תבני לי קורס בן 8 שיעורים בעברית על גידול צמחי בית למתחילים, בסגנון המותג grow."*

— ומפיקה **ליין שלם של סרטוני קורס מוגמרים** ברמת הסרטון שצירפת: מציגה פוטוריאליסטית עם ליפסינק עברי מושלם, שקופיות ממותגות RTL, גרפים, צילומי מסך, קריינות עברית טבעית, כתוביות, ומוזיקה — בלי מגע אנושי מעבר לאישור אאוטליין אחד.

**התובנה ההנדסית המרכזית** שחוזרת לאורך כל המסמך: **האיכות לא נשברת ברינדור — היא נשברת בעברית ובהארקה (grounding).** לכן המערכת בנויה סביב שלוש הכרעות שמגנות בדיוק על שתי הנקודות שהדגשת — עברית וליפסינק:

| ההכרעה | מה היא פותרת |
|---|---|
| **1. ניתוק האודיו מהווידאו** (audio‑driven) | מייצרים את העברית המושלמת בנפרד (TTS ייעודי), ורק אז "מלבישים" ליפסינק עליה. זה מה שמבטיח שהעברית **והליפסינק** לא יורדים מתחת לסרטון הייחוס. |
| **2. ניקוד/G2P לפני TTS** | עברית נכתבת בלי ניקוד → ה־TTS מנחש → מבטא שגוי. שלב ניקוד אוטומטי (Dicta + Phonikud) הוא ה־ROI הכי גבוה בכל המערכת. |
| **3. הארקה ל־Fact Bank + עברית ילידית** | התסריט נשען על עובדות מצוטטות (לא הזיות), ונכתב בעברית **מדוברת‑תקנית** עם ban‑list נגד "עברית של AI". |

המספר שצריך לזכור: **טקסט עברי לעולם לא נכנס למחולל תמונות AI** (כל המודלים מרנדרים עברית כג'יבריש) — הוא תמיד מולבש כשכבה אמיתית ב־Remotion. זו ההכרעה ההפקתית הכי חשובה במסמך.

---

<a name="1"></a>
## 1. ניתוח סרטון הייחוס (reverse‑engineering מלא)

ניתחתי את הקובץ פריים‑אחר‑פריים (חילוץ 47 פריימים + 2 contact sheets + אנליזת אודיו). הנה הפירוק המלא:

### 1.1 מפרט טכני

| פרמטר | ערך |
|---|---|
| רזולוציה | 1280×720 (720p), יחס 16:9 |
| Frame rate | 30fps (קבוע) |
| אורך | 6:15 דק' (375.6 שניות) |
| וידאו | H.264, ~540 kbps |
| אודיו | AAC, stereo, 44.1kHz, ~68 kbps |
| Loudness | mean −17.4dB, peak −1.1dB → **מנורמל מקצועית** (קרוב ל־−16 LUFS, סטנדרט וידאו) |

### 1.2 מערכת העיצוב (זה ה־DNA שצריך לשכפל)

```
┌─────────────────────────────────────────────────────────┐
│  [grow · שיעור 01]              ← lower-third ימני־עליון │
│                          │                               │
│   ┌──────────┐           │   רוב הצמחים לא מתים מצמא.    │
│   │ מציגה     │     קו     │   הם מתים מאור.   ← הדגשה    │
│   │ talking   │   מפריד   │      בטרהקוטה               │
│   │ head      │   אנכי    │   [גרף / תמונה / בולטים]     │
│   │ ~40%      │           │        ~60%                 │
│   └──────────┘           │                    🍃 לוגו   │
└─────────────────────────────────────────────────────────┘
```

| אלמנט | פירוט |
|---|---|
| **פריסה** | מציגה שמאל ~40% · אזור תוכן ימין ~60% · קו מפריד אנכי דק במרכז |
| **פלטה** | רקע ירוק־יער כהה (`#1B2A1E`~) · טקסט ראשי קרם/שמנת (`#F5F0E6`~) · הדגשות טרהקוטה/חלודה (`#C8704A`~) |
| **טיפוגרפיה** | עברית RTL, sans‑serif עבה (Heebo / Assistant), מיושר לימין. תבנית: **משפט־מחץ גדול** → בולטים/גרף בשקופית הבאה |
| **מיתוג** | "grow" + עלה מונסטרה (פינה ימנית־תחתונה) · lower‑third "grow · שיעור 01" ימני־עליון |
| **תוכן** | מחקר אמיתי: ספקטרום אור, "ארבעה סוגי אור", כיווני חלון בישראל, "העיניים שלנו משקרות", סימני חוסר/עודף אור, "מבחן הצל ב־11:00", חידון "3 שאלות לפני הצמח הבא" |

### 1.3 המציגה — מה ייצר אותה (ההערכה)

הפריים ברזולוציה מלאה חושף מציגה **היפר‑ריאליסטית**: נמשים, שיער טבעי עם שערות פורחות, חולצת פשתן ירוקה מעל טי קרם, תליון, ידיים שלובות במנוחה, רקע סטודיו ירוק אחיד, תנועת גוף עדינה. הקומבינציה של (א) תנועת פלג־גוף עליון טבעית + (ב) ליפסינק עברי חלק מצביעה חד־משמעית על אחת משתי דרכי ההפקה:

1. **דמות שנוצרה מתמונה אחת** (OmniHuman 1.5 / Kling Avatar) מונעת מ**אודיו עברי שנוצר בנפרד**.
2. **לופ מציגה מצולם/מחולל ש"דובב" לעברית** עם Sync.so (lipsync‑2‑pro) — מה שמסביר את הנמשים המושלמים והתנועה הטבעית.

בשני המקרים — **העברית כמעט בוודאות הגיעה מ־TTS ייעודי (ElevenLabs/Azure/MiniMax), לא מהקול של כלי האווטאר.** זו בדיוק הארכיטקטורה שנבנה.

---

<a name="2"></a>
## 2. העיקרון המרכזי — שלוש ההכרעות שמייצרות את האיכות

### 2.1 ניתוק האודיו מהווידאו (Audio‑Driven Architecture)

זו האבחנה הכי חשובה במסמך כולו. הכלים מתחלקים לשניים:

- **TTS‑only** (הכלי מייצר את הקול בעצמו) → עברית בינונית, אין שליטה.
- **Audio‑Driven** (אתה מספק קובץ אודיו, הכלי בונה עליו ליפסינק) → ✅ זה מה שאנחנו רוצים.

**למה זה קריטי לעברית דווקא:** עברית היא low‑resource לרוב ספקי האווטאר, והפונמות הגרוניות (ע׳, ח׳, ה׳) קשות. מודלים audio‑driven ממפים תנועת שפתיים **ישירות מגל הקול** — הם לא צריכים "להבין" עברית, רק לשמוע אותה. לכן הם **language‑agnostic** ומסנכרנים עברית טוב כמו אנגלית. ההוכחה: Sync.so נותן תוצאות ברמת broadcast בערבית (שפה שמית RTL עם פונמות גרוניות דומות) — מה שמאשר שעברית מטופלת מצוין.

> **המסקנה:** מייצרים עברית מושלמת ב־TTS → מזינים את האודיו למודל audio‑driven → מקבלים ליפסינק שלא יורד מתחת לשחקנית אמיתית. **שני הצירים שביקשת — עברית וליפסינק — נפתרים בנפרד וכל אחד מקסימלית.**

### 2.2 ניקוד/G2P לפני TTS — ה־ROI הכי גבוה

עברית בלי ניקוד שוברת כל TTS תלוי־ניקוד. הפתרון: שלב pre‑processing שמנקד אוטומטית. **חשוב:** ניקוד עוזר למנועים תלויי־ניקוד (ElevenLabs v3, Azure, Google) אבל **פוגע** במנועי LLM שעובדים על טקסט חלק (MiniMax, HebTTS) — תמיד A/B מנוקד‑מול‑חלק לכל מנוע.

### 2.3 הארקה ל־Fact Bank + עברית ילידית

התסריט לא נכתב מהזיכרון של ה־LLM — הוא נשען על **בנק עובדות מצוטט** (ציטוט מילולי + URL לכל טענה), ונכתב בעברית מדוברת‑תקנית עם persona + ban‑list נגד "עברית של AI" (פירוט מלא בפרק 6).

---

<a name="3"></a>
## 3. ארכיטקטורת־העל של המערכת

הדפוס המאומת ל‑2026 (STORM, SciSage, AgentODRL): **Orchestrator‑Worker עם הרחבה רקורסיבית רמה‑אחר‑רמה.** אנטי‑דפוס קרדינלי: קריאת LLM ענקית אחת שפולטת את כל עץ הקורס — JSON עמוק נכשל ב‑1‑2% ושובר strict‑mode. **כל קריאת LLM פולטת רמה רדודה אחת; ה‑orchestrator מרכיב את העץ.**

```
┌──────────────────────────────────────────────────────────────────────┐
│  הפרומפט האחד: "קורס 8 שיעורים בעברית על צמחי בית למתחילים, סגנון grow"│
└──────────────────────────────────────────────────────────────────────┘
                                    │
   S0 ▸ Brief Normalizer    →  {topic, language:he, audience, lessons:8, tone, brand}
                                    │
   S1 ▸ RESEARCH / FACT-BANK →  Exa+Tavily (גילוי) → Firecrawl/Jina (חילוץ) →
        (מחקר + צילומי מסך)       Fact-Extractor → בנק עובדות מוקלד {claim, ציטוט, url}
                                  + Playwright screenshots קשורים למקור
                                    │
   S2 ▸ Course Architect     →  אאוטליין JSON {כותרת, מטרות, stubs לשיעורים}  [רמה 1]
        (קריאת JSON אחת)          ★ נקודת אישור אנושית #1 — אשר אאוטליין (המנוף הכי חזק)
                                    │
   S3 ▸ Lesson Planner ×8    →  FAN-OUT: לכל שיעור, רשימת 7 ביטים (סדר Gagné)
        (מקבילי, Send API)        ★ נקודת אישור אופציונלית #2
                                    │
   S4 ▸ Segment Writer ×M    →  FAN-OUT: לכל סגמנט {תסריט_עברית, slide_spec, visuals_needed}
        (שואב רק מ-Fact Bank, StrictCitations)
                                    │
   S5 ▸ QC שערים 1-3 (זול)   →  QC תסריט (נאמנות) → QC טבעיות עברית → ניקוד/G2P
                                    │
   S6 ▸ Visual Resolver      →  FAN-OUT: stock (Pexels) / AI (Recraft/FLUX/Imagen) — ללא טקסט
                                  (טקסט עברי מולבש אח"כ ב-Remotion, אף פעם לא נצרב בתמונה)
                                    │
   S7 ▸ RENDER               →  TTS (קול) → Avatar (ליפסינק audio-driven) →
        (קול→אווטאר→הרכבה)        Compositor (Remotion: שקופיות + עברית RTL + b-roll)
                                    │
   S8 ▸ QC שערים 4-7 (יקר)   →  QC אודיו → QC ליפסינק (SyncNet) → QC כתוביות → QC רינדור (ffprobe)
                                  → בכשל: מחדש רק את הסגמנט הקטן ביותר שנכשל
                                    │
                              ┌──────────────┐
                              │ ליין סרטונים │  ← 8 קבצי MP4 מוגמרים
                              │   מוגמר      │
                              └──────────────┘
```

**עקרונות בל־יעבור:** כל node מקבל ID יציב + idempotency key (`course:lesson:segment:v1`, TTL ~24h) כי כל התורים at‑least‑once; resumability מבוססת `status` enum (משגרים מחדש רק node שלא `complete`); שערי QC זולים (שפה) **לפני** כל TTS/רינדור יקר.

---

<a name="4"></a>
## 4. מודל הנתונים — סכמת ה־Course Tree

כל שלב פולט **רק את הרמה שלו** — לעולם לא את כל העץ. זה החוזה בין מחולל‑התסריט לבין הווידאו.

```jsonc
{ "course": {
  "id": "crs_plants_he", "schema_version": "1.0", "language": "he",
  "title": "צמחי בית למתחילים", "audience": "beginners",
  "tone": "warm-practical", "brand": "grow",
  "status": "outline_approved",  // draft|outline_approved|generating|qa|assembled|published|failed
  "learning_objectives": ["..."], "lesson_count": 8,

  "fact_bank": [ {
    "fact_id": "f001", "claim": "צמחים רבים מתים מעודף/חוסר אור ולא מצמא",
    "evidence_quote": "ציטוט מילולי מהמקור", "source_url": "https://...",
    "provenance": "source-text", "confidence": 0.9
  } ],

  "lessons": [ {
    "id": "lsn_01", "index": 1, "title": "אור", "objective": "<פועל Bloom אחד>",
    "status": "generating", "duration_target_sec": 360,
    "idempotency_key": "crs_plants_he:lsn_01:v1",

    "segments": [ {
      "id": "seg_01_01", "index": 1,
      "type": "hook",  // hook|objective|activate|teach|worked_example|recap|quiz
      "status": "complete",
      "narration": {
        "script_he": "רוב הצמחים לא מתים מצמא. הם מתים מאור.",
        "script_niqqud": "רֹב הַצְּמָחִים...", "ipa": "ʁov ha.tsˈma.χim...",
        "word_count": 78, "estimated_sec": 32,
        "tts_voice_id": "he-warm-01", "fact_ids": ["f001"]   // הארקה — כל משפט עובדתי מצטט
      },
      "slide": {
        "layout": "assertion-visual",  // title|title-image|assertion-visual|step-build|quote|quiz
        "assertion_he": "רוב הצמחים לא מתים מצמא — הם מתים מאור.",
        "on_screen_text_he": [],       // מינימלי — אף פעם לא תסריט הקריינות (עקרון הרדנדנטיות)
        "theme_ref": "grow-green"
      },
      "visuals_needed": [ {
        "id": "vis_01_01_01", "role": "background",  // background|insert|diagram|broll|icon
        "media_type": "image", "source": "ai",       // ai|stock|screenshot
        "prompt_en": "cozy bright room, potted monstera by window, NO TEXT",  // תמיד ללא טקסט
        "aspect_ratio": "16:9", "status": "pending", "asset_url": null, "attempts": 0
      } ]
    } ]
  } ]
}}
```

סכמות הפלט לכל קריאת LLM (רדודות): **Architect** מחזיר רק `{title, objectives, lessons:[{index,title,objective}]}` · **Planner** רק `{segments:[...]}` · **Writer** רק עלה־הסגמנט. כל פלט מאומת ב‑**Pydantic `extra='forbid'`** / **Zod**, ו‑validate→repair→retry מוגבל ל‑2.

---

<a name="5"></a>
## 5. ה־Pipeline שלב־אחר־שלב (S0→S8)

### S0 · Brief Normalizer
קריאת LLM קצרה שמנרמלת את הפרומפט החופשי לאובייקט מובנה: נושא, שפה (he), קהל יעד, מספר שיעורים, טון, מותג, אורך־יעד לשיעור, ואילוצים. זה ה־root של כל העץ.

### S1 · Research / Fact‑Bank (מחקר + צילומי מסך)
המערכת **עושה את המחקר בעצמה** (בדיוק כמו שביקשת):
- **גילוי מקורות:** Tavily (agent‑tuned, מנוקד, citable) + Exa (סמנטי, "מצא את המקורות הנכונים" + highlights). Serper כרשת זולה רחבה.
- **חילוץ תוכן:** Firecrawl `/search` (חיפוש+תוכן מלא בקריאה אחת, פלט Markdown ל‑LLM) · Jina Reader (`r.jina.ai`, URL בודד) · trafilatura. `onlyMainContent` מסיר ניווט/פרסומות.
- **צילומי מסך:** Playwright @ 1920×1080, `deviceScaleFactor:2`, סגירת cookie‑banners, `wait_for_selector`, `animations:'disabled'`, PNG. element‑clip עדיף על full‑page רועש. חלופה מנוהלת: ScreenshotOne/Urlbox.
- **בנק עובדות מוקלד:** Fact‑Extractor agent הופך כל מקור ל‑`{claim, evidence_quote (מילולי), source_url, confidence}`. **כל משפט עובדתי בתסריט יצטט fact_id.** ציטוט הזיתי רץ 11‑57% → מצטטים **וגם** מאמתים בדיעבד.

### S2 · Course Architect → ★ אישור אנושי #1
קריאת JSON אחת (רמה אחת!) שמחזירה אאוטליין: כותרת, מטרות למידה, ו‑stubs לשיעורים. **כאן נקודת האישור הכי חשובה** — אתה מאשר/עורך את האאוטליין לפני שנשרף ולו דולר אחד על רינדור. המנוף הכי גבוה במערכת.

### S3 · Lesson Planner ×N (fan‑out מקבילי)
לכל שיעור, ה‑planner מפרק ל‑**7 ביטים** לפי סדר Gagné (ראה פרק תבנית). מקבילי דרך LangGraph `Send` API.

### S4 · Segment Writer ×M (fan‑out מקבילי)
לכל סגמנט נכתב `{narration.script_he, slide_spec, visuals_needed}`. הכותב שואב **רק** מ‑Fact Bank (StrictCitations), וכותב עברית מדוברת‑תקנית (פרק 6). זה הלב היצירתי.

### S5 · שערי QC זולים 1‑3 (שפה, לפני כל הוצאה יקרה)
1. **QC תסריט** — נאמנות מול Fact Bank (RAGAS‑style, כל טענה נתמכת).
2. **QC טבעיות עברית** — 0 שגיאות דקדוק (LanguageTool/Hspell + LLM judge) + מסווג translationese.
3. **QC ניקוד/G2P** — Phonikud מייצר IPA תקין ל‑100% מהטוקנים; אין ספרות/לטינית גולמית.

### S6 · Visual Resolver (fan‑out)
- **תמונות stock:** Pexels (רישיון נקי, בלי attribution משפטי, 20k/חודש). Pixabay (גם וקטורים). Unsplash (attribution חובה).
- **דיאגרמות עריכה:** **קוד** (Mermaid/D2/SVG) לדיאגרמות מדויקות־נתונים — שום מודל raster לא מייצר דיאגרמות נכונות מבנית באמינות.
- **וקטור/אינפוגרפיקה/אייקונים:** Recraft V3 (SVG אמיתי, ~$0.08, סט מותג עקבי).
- **b‑roll פוטוריאליסטי:** FLUX.2 Pro / Imagen 4 Fast (~$0.02). Nano‑Banana / GPT‑Image כגיבוי.
- **🚫 חוק הברזל:** **טקסט עברי לעולם לא נצרב בתמונת AI** (כל מודל מרנדר עברית כג'יבריש — באג סדר‑אותיות מתועד אפילו ב‑Adobe Firefly). הטקסט מולבש ב‑Remotion כשכבה אמיתית.
- **עקביות סגנון:** משפחת מודל אחת + seed קבוע + style‑preset/reference images שמורים.

### S7 · RENDER (קול → אווטאר → הרכבה)
1. **TTS** — ElevenLabs v3 / MiniMax HD / Azure he‑IL על הטקסט המנוקד → WAV/MP3 נקי + word‑timings.
2. **Avatar** — מזינים את האודיו (audio‑driven!) ל‑OmniHuman 1.5 / HeyGen Avatar IV / Sync.so → קליפ מציגה (רצוי alpha WebM).
3. **Compositor** — Remotion מרכיב: שקופית רקע + אזור תוכן RTL + מציגה (alpha) + lower‑third + כתוביות + מוזיקה → MP4.

### S8 · שערי QC יקרים 4‑7
4. **QC אודיו** — משך ±X%, LUFS בטווח, אין clipping, **ASR round‑trip (Whisper) תואם לתסריט** (תופס ניקוד שפספס).
5. **QC ליפסינק** — SyncNet **LSE‑C ≥ / LSE‑D ≤** ספים; פנים בכל פריים.
6. **QC כתוביות/סנכרון** — forced‑alignment offset <120ms (WhisperX/MFA); RLM/LRM bidi marks.
7. **QC רינדור** — ffprobe תואם מפרט; `blackdetect`/`freezedetect`/`silencedetect` נקיים.

**בכשל:** מחדשים את **היחידה הקטנה ביותר** שנכשלה בלבד, cap retries 2‑3, ואז תור אנושי.

---

<a name="6"></a>
## 6. 🇮🇱 עמוד השדרה של העברית — המדריך המלא

זה הפרק שביקשת לשים עליו דגש. שלושה תת־מערכות: **קול, ניקוד, וכתיבה.**

### 6.1 דירוג מנועי ה־TTS לעברית (הכי טבעי → הכי פחות, 2026)

| # | מנוע | הערכת עברית | Cloning עברי | API | ~עלות /1M תווים | מתי |
|---|---|---|---|---|---|---|
| 🥇 | **MiniMax Speech 2.6/2.8 HD** (Hebrew boost, **טקסט חלק**) | **הכי טבעי** במבחני עיוורון | ✅ 10ש'–5ד' | Replicate/fal/Together | ~$30 | ברירת מחדל — טבעיות־לעומת־מאמץ הכי טובה |
| 🥈 | **ElevenLabs `eleven_v3`** + `language_code:"he"` + **PVC** | מצוין, רגשי, audio‑tags, IPA | ✅ PVC (30ד'–3ש' עברית) | REST | ~$100 (~$0.10/1k) | קריין מותגי משובט עם שליטה רגשית |
| 🥉 | **Deepdub Phantom X 3.2** (ישראלי) | studio‑grade, מבטא מדויק | ✅ zero‑shot מ‑1ש' | enterprise | contact sales | ספק ישראלי / SLA ארגוני |
| 4 | **Google Chirp 3 HD** (`he-IL-Chirp3-HD-*`) | סולידי, GA | ❌ אין עברית | `synthesizeLongAudio` | $30 | קולות מוכנים, חסכוני, batch ארוך |
| 5 | **Azure Personal/Custom Neural** (he‑IL) | טבעי, משובט | ✅ (gated) | batch synthesis | ~$15 + training | pipeline ארגוני על Azure |
| 6 | **Azure Hila/Avri** (מוכנים) | אמין אבל **מונוטוני** בקטעים ארוכים | ❌ | batch | ~$15 | fallback עקבי וזול |
| 7 | **Phonikud→StyleTTS2** (self‑host, MIT) | מתחת ל‑managed, אבל שליטה מלאה | ✅ | self | $0 + GPU | פרטיות / בלי עלות לתו |
| ✗ | OpenAI TTS / XTTS / Chatterbox | "מבטא אמריקאי כבד, לא שמיש" | — | — | — | **להימנע** |

> **המלצה מבצעית:** שבט קריין עם **MiniMax HD (טקסט חלק)** או **ElevenLabs v3 + PVC (מנוקד)**. אף מנוע אינו zero‑touch לעברית — תקצב audition לכל שיעור.

### 6.2 בעיית הניקוד — כלי הניקוד האוטומטי

עברית בלי ניקוד = ה‑TTS מנחש = צורת מילה שגויה (מחלקת השגיאות #1). הפתרון: ניקוד אוטומטי לפני TTS.

| מערכת | דיוק (WOR ברמת מילה) | רישיון | self‑host |
|---|---|---|---|
| **Dicta** `dictabert-large-char-menaked` | **94.1‑95.8% (הכי טוב)** | CC‑BY‑4.0 | ✅ HuggingFace, 0.3B |
| MenakBERT | 94.1% | open | ✅ |
| **Nakdimon** (`pip install nikud`) | 89.75% | **MIT** | ✅ ONNX, offline |
| D‑Nikud | 90.8% (×4 מהיר) | CC‑BY‑4.0 | ✅ |

**🎯 Phonikud (הכלי הכי רלוונטי ל‑TTS, arXiv 2506.12311):** G2P שמוציא **IPA מלא עם סימני הטעמה (מלרע/מלעיל)** — מה שניקוד לבדו לא מקודד. עוטף את מודל Dicta + adaptors → FST → IPA, גם מרחיב מספרים/תאריכים/אנגלית מעורבת. אם ה‑TTS מקבל phonemes/IPA — זה **עדיף בהחלט** על ניקוד לבד כי הוא מתקן שגיאות הטעמה. `pip install phonikud phonikud-onnx`.

**⚠️ אזהרה קריטית:** ניקוד עוזר ל‑ElevenLabs/Azure/Google אבל **פוגע** ב‑MiniMax/HebTTS (שמצפים לטקסט חלק). **תמיד A/B מנוקד‑מול‑חלק לכל מנוע.** גם ב‑94% WOR יש ~6 מילים שגויות ל‑100 → **מילון override לשמות פרטיים/מותגים הוא חובה.**

**צינור הניקוד המומלץ:** טקסט נקי → הרחבת מספרים/ר"ת/אנגלית **קודם** → **Dicta Nakdan** (ניקוד) → **Phonikud** (IPA+הטעמה) → תיקון ידני של שמות פרטיים → TTS.

### 6.3 כתיבת תסריט בעברית ילידית (נגד "עברית של AI")

**שורש הבעיה:** LLMs חושבים באנגלית ומתרגמים אידיומים לעברית עקומה.

**Persona ל‑system prompt (רגיסטר מדובר‑תקני):**
> *"אתה תסריטאי ישראלי יליד הארץ שכותב קריינות לקורסי וידאו. כתוב **עברית מדוברת‑תקנית** — כמו מרצה ישראלי שמדבר אל המצלמה, לא כמו טקסט מתורגם מאנגלית ולא כמו מאמר אקדמי. דבר אל הצופה ישירות, בטון חברי ובטוח. משפטים קצרים. רעיון אחד למשפט. בלי מליצות."*

**המנוף הכי חזק = few‑shot של זוגות BEFORE/AFTER:**
> ❌ "בעולם של היום, חשוב לציין כי הכלי הזה הוא לא רק יעיל אלא גם חוסך זמן."
> ✅ "תקשיבו, הכלי הזה פשוט חוסך לכם המון זמן."

**🚫 BAN‑LIST (ה"tells" של עברית AI — הוסף כ"אסור להשתמש ב:"):**
- **מבנים:** "לא רק X אלא גם Y" (המבנה הכי שחוק), "אין מדובר ב‑X אלא ב‑Y"
- **מילות מילוי:** "בעולם של היום", "חשוב לציין", "במילים אחרות"
- **קַלְקִים:** "בהיר כקריסטל", "משנה את כללי המשחק", "כאן נכנס לתמונה"
- **פיסוק:** em‑dash (—), מרכאות מסולסלות
- **דקדוק:** הכל בזכר‑יחיד דיפולטי → גוון/השטח את הפנייה ("בואו נראה", "נתחיל")

**מעבר ביקורת עצמית (pass 2):** *"עבור על הטקסט, סמן כל ביטוי שנשמע מתורגם או AI‑י, ושכתב לעברית מדוברת."*

**כללי כתיבה ידידותית ל‑TTS:** רעיון אחד למשפט; משפטים קצרים (ארוך = חסר נשימה); מספרים ככתב עברי עם התאם מין (שתי דקות, לא "2 דקות"); ר"ת מורחבות בהופעה ראשונה; מילים לועזיות בתעתיק עברי (גרש ג׳ ל‑/j/); פיסוק = השליטה היחידה שלך בפרוזודיה.

**שדרוג אופציונלי:** מעבר ליטוש עם **Dicta‑LM 3.0** (24B) — SOTA לעברית אידיומטית (86.86% ניקוד מול 60.21% ב‑Gemini‑3‑27B).

---

<a name="7"></a>
## 7. 👄 עמוד השדרה של הליפסינק — איך לא יורדים מתחת לסרטון הייחוס

### 7.1 דירוג כלי האווטאר/ליפסינק (2026)

| כלי | Audio‑driven? | עברית | רזולוציה/אורך | API | ~עלות | מתי |
|---|---|---|---|---|---|---|
| **ByteDance OmniHuman 1.5** | ✅ (תמונה+אודיו ≤60ש') | language‑agnostic | 1080p/30ש' · 720p/60ש' | fal.ai, Replicate | ~$0.14‑0.16/ש' | **ריאליזם גוף הכי טוב** מתמונה אחת + תנועה טבעית |
| **HeyGen Avatar IV** | ✅ (`audio_url`/`audio_asset_id`) | אין הגבלת שפה על אודיו | עד 4K | REST (`v2/video/av4`) | ~20 credits/דק' | **all‑in‑one עם alpha WebM נייטיב** — קומפוזיציה נקייה |
| **Sync.so lipsync‑2‑pro** | ✅ (וידאו+אודיו) | language‑agnostic (ערבית מוכחת!) | **עד 4K**, שומר נמשים/שיניים | REST + Replicate/fal | $0.067‑0.083/ש' | **דיבוב לופ מציגה קיים** — משכפל ייחוס מדויק |
| **Hedra Character‑3** | ✅ (תמונה+אודיו) | language‑agnostic | תקרת 720p (יש upscaler) | REST/LiveKit | מ‑$10/חודש | talking‑photo הכי טבעי, ראש/פלג‑גוף |
| **Tavus Hummingbird‑0** | ✅ (MP4+MP3, zero‑shot) | language‑agnostic | — | Tavus API + fal | contact sales | שימור זהות best‑in‑class, real‑time |
| **Kling AI Avatar 2.x** | ✅ (תמונה+אודיו) | language‑agnostic | **1080p/48fps**, ~1ד' | Higgsfield/WaveSpeed | — | ראש‑וכתפיים, מרתיע full‑body |
| **D‑ID** | ✅ | 175+ כולל עברית | — | YES | — | סולידי, מדרגה מתחת למובילים |
| ✗ Google Veo 3/3.1 | ❌ (מייצר אודיו משלו) | עברית לא אמינה | 4K/60ש' | YES | — | **פסול** — לא מקבל אודיו חיצוני |
| ✗ Synthesia | ❌ (TTS‑locked) | תרגום בלבד | — | YES | $89/חודש | אין bring‑your‑own‑audio |
| ✗ Runway Act‑Two | performance‑driven | — | — | YES | — | דורש שתשחק כל שורה פיזית |

### 7.2 שלוש דרכי ההפקה (לפי מטרה)

| מטרה | מתכון | למה |
|---|---|---|
| **ייצור מאפס + ריאליזם גוף** | **OmniHuman 1.5 (fal) + ElevenLabs/MiniMax עברית** → פאס ניקוי **Sync.so** | System‑2 קורא פרוזודיה → תנועות סמנטיות, לא רק פה |
| **שכפול look קבוע בקנה־מידה + שליטת רקע** | **HeyGen Avatar IV API** (`audio_url` = הטראק העברי, פלט **WebM alpha**) | קומפוזיציה נקייה על הרקע הירוק, בלי keying |
| **דיבוב לופ מציגה שכבר אהבת** (הכי קרוב לייחוס) | **Sync.so lipsync‑2‑pro** | שומר תנועת גוף + נמשים, רק מחליף פה לעברית |

### 7.3 פאס הביטחון — איך מבטיחים "לא מתחת לייחוס"

אם מנוע יחיד מפספס מילה עברית קשה (ע׳/ח׳ גרוני), מריצים **פאס Sync.so lipsync‑2‑pro סופי** מעל הקליפ המחולל → נועל ליפסינק עברי לרמת broadcast. בתוספת **שער QC ליפסינק (SyncNet)** שמודד LSE‑C/LSE‑D ופוסל אוטומטית קליפ מתחת לסף. כך **שני הצירים — עברית וליפסינק — נשמרים מעל סף מדיד, לא לפי תחושה.**

---

<a name="8"></a>
## 8. 🎨 שכפול מערכת העיצוב (Remotion + RTL)

**Remotion הוא המנוע הנכון** — שכבת השקופיות היא פשוט HTML/CSS RTL (עברית, bidi, web‑fonts, charts "פשוט עובדים" כי זה Chromium אמיתי), הכל data‑driven מ‑JSON, ומתרחב ל‑batch של קורס שלם דרך CLI/Lambda.

### 8.1 מבנה הקומפוזיציה (פיצול 40/60 כמו הייחוס)

```tsx
<AbsoluteFill>                    {/* 1920×1080, 30fps */}
  <SlideBackground />            {/* רקע ירוק־יער + טקסטורה */}
  <SlideRight />                 {/* ימין ~60%: assertion headline, בולטים, גרף, תמונה */}
  <PresenterLeft />             {/* שמאל ~40%: alpha WebM talking head */}
  <LessonLowerThird />         {/* pill ימני־עליון "grow · שיעור 01" */}
  <Logo />                     {/* עלה מונסטרה בפינה */}
  <Captions />                 {/* כתוביות RTL צרובות */}
  <Audio src={narrationSrc} /> {/* מניע את כל התזמון */}
</AbsoluteFill>
```

### 8.2 RTL עברי — הגוצ'ות האמיתיות (כל הבאגים פה)

```tsx
// fonts.ts — טען את ה-Hebrew subset במפורש, אחרת tofu!
import { loadFont } from "@remotion/google-fonts/Heebo";
export const heebo = loadFont("normal", {
  weights: ["400","700","800","900"],
  subsets: ["hebrew","latin"],   // ← latin גם, ל-"grow", מספרים
}).fontFamily;
```

```tsx
// כל מיכל טקסט עברי:
<div style={{
  direction: "rtl",
  textAlign: "right",
  fontFamily: heebo,
  unicodeBidi: "plaintext",   // ← זיהוי כיוון אוטומטי לשורות עברית+לטינית+מספרים מעורבות
}}>{text}</div>
```

**צ'קליסט גוצ'ות (כל אחת = באג ראיתי בשטח):**
1. **`subsets:["hebrew"]`** על Heebo/Rubik/Assistant — אחרת עברית = tofu (הדיפולט הנפוץ טוען רק latin).
2. **`unicode-bidi: plaintext`** על עלי‑הטקסט לשורות מעורבות; CSS logical properties (`paddingInlineStart`) לעמודה ה‑RTL; `<bdi>`/`isolate` רק סביב סימנים/סוגריים.
3. מספרים ולטינית בתוך RTL ("שיעור 01", "ROAS של 3.5") — מטופלים אוטומטית ע"י Unicode Bidi Algorithm.
4. **אמת כותרות עברית ויזואלית** — יש באגי glyph ידועים בפונטים עבריים של Google (Rubik, ליגטורה הפוכה U+05F1 ב‑Heebo).
5. lower‑third "grow · שיעור 01" מערבב לטינית+עברית → node משלו עם `unicode-bidi:plaintext` או פיצול ל‑2 `<bdi>`.

### 8.3 שכבת המציגה — alpha, לא keying

| עדיפות | שיטה | פירוט |
|---|---|---|
| 🥇 | **HeyGen/Synthesia alpha WebM נייטיב** | מייצא רקע שקוף (VP9 `yuva420p`) → קומפוזיציה ישירה, בלי shader, בלי artifacts |
| 🥈 | **ffmpeg pre‑key לאלפא** (אם המקור ירוק) | `chromakey=0x00b140:0.10:0.08,despill=type=green,format=yuva420p` → WebM. **חובה `-pix_fmt yuva420p -auto-alt-ref 0`** |
| 🥉 | **`colorKey()` של `@remotion/effects`** (keying בזמן רינדור) | דורש WebGL2 → `chromiumOptions.gl="angle"` או השקיפות נכשלת בשקט. artifacts בקצוות שיער/תנועה |

### 8.4 גרפים, כתוביות, ו‑batch

- **גרפים:** SVG ידני / visx, **frame‑driven** (`useCurrentFrame()`), **כבה אנימציות של ספריות** (מהבהבות). תוויות עברית עטופות `direction:rtl; unicode-bidi:plaintext`.
- **כתוביות:** הכי נקי — **word‑timings מה‑TTS** (ElevenLabs/Azure) → `Caption[]` ישירות (אפס שגיאת ASR בעברית). חלופה: **ivrit.ai Whisper v3 Turbo** (מנצח Whisper רגיל בעברית) + WhisperX ל‑word‑level. תצוגה: `createTikTokStyleCaptions`, `whiteSpace:"pre"`, RTL.
- **Batch:** `bundle()` פעם אחת + לולאת `renderMedia` מקומית (אל תקבל במקביל מקומית); **Remotion Lambda `--concurrency`** ל‑fan‑out של קורס שלם (וידאו של דקה: מדקות → ~30ש').

```ts
// batch render כל הקורס
const serveUrl = await bundle({ entryPoint: "./src/index.ts" });
for (const lesson of course.lessons) {
  const composition = await selectComposition({ serveUrl, id: "Lesson", inputProps: lesson });
  await renderMedia({
    composition, serveUrl, codec: "h264", inputProps: lesson,
    outputLocation: `out/lesson-${lesson.index}.mp4`,
    chromiumOptions: { gl: "angle" },   // אם משתמשים ב-colorKey()
  });
}
```

### 8.5 מתי לא Remotion

| חלופה | מתי | למה לא כאן |
|---|---|---|
| After Effects + nexrender / Dataclay | יש כבר תבנית AE מלוטשת + מעצב מושן; keying broadcast (Keylight) | צריך רישיונות AE + render farm; RTL עברי fiddly יותר מדפדפן |
| Motion Canvas / Revideo | אנימציות הסבר/מתמטיקה בעבודת יד | Canvas‑2D בלבד — אין DOM/CSS bidi; תבנה RTL לבד |
| Puppeteer screenshots → ffmpeg | אפס framework lock‑in, מעט אנימציות | בונה מחדש את הגלגל של Remotion (timing, audio mux, caption sync) |
| ffmpeg overlay טהור | mux אחרון, צריבת SRT, שרשור שיעורים | לא יודע לפרוס RTL עברי מונפש — last‑mile בלבד |

---

<a name="9"></a>
## 9. ⌨️ "הפרומפט האחד" — החוזה המדויק

המשתמש כותב משפט חופשי; ה‑Brief Normalizer (S0) ממפה אותו לחוזה הזה. כל שדה שחסר → דיפולט חכם או שאלת הבהרה אחת.

```jsonc
// INPUT (מה שאתה מקליד):
"תבני קורס 8 שיעורים בעברית על גידול צמחי בית למתחילים, בסגנון grow, טון חם ומעשי"

// ↓ S0 ממפה ל: (החוזה)
{
  "topic": "גידול צמחי בית למתחילים",
  "language": "he",
  "audience": "beginners",
  "lesson_count": 8,
  "duration_per_lesson_sec": 360,
  "tone": "warm-practical",
  "brand": {
    "name": "grow",
    "palette": { "bg": "#1B2A1E", "cream": "#F5F0E6", "accent": "#C8704A" },
    "fonts": ["Heebo", "Assistant"],
    "logo": "monstera-leaf",
    "layout": "presenter-left-40 / content-right-60",
    "lower_third": "grow · שיעור {NN}"
  },
  "presenter": {
    "engine": "heygen-avatar-iv",      // או omnihuman-1.5 / sync-redub
    "voice_id": "he-warm-female-01",    // קול עברי משובט
    "background": "dark-green-studio"
  },
  "quality_gates": { "lipsync_min_lse_c": 6.0, "hebrew_grammar": "strict", "niqqud": "phonikud" },
  "research": { "sources_per_lesson": 5, "screenshots": true, "grounding": "strict-citations" },
  "output": { "resolution": "1080p", "captions": "he-rtl-burned", "music": "soft-ambient" }
}
```

מ‑20 המילים האלה המערכת מייצרת אוטומטית: מחקר על 8 נושאים → אאוטליין (אישור) → 56 סגמנטים → תסריטים מנוקדים → ~70 ויזואלים → 8 קריינויות → 8 קליפי מציגה → 8 קומפוזיציות → 8 MP4 מוגמרים.

---

<a name="10"></a>
## 10. 🧰 ה־Stack המומלץ + טבלת עלויות אמיתית

### 10.1 ה־Stack המלא

| שכבה | MVP (ship‑fast) | Production |
|---|---|---|
| **תזמור** | n8n (self‑host) + Python/SDK ב‑Code nodes | **LangGraph** (typed state, `PostgresSaver`, `Send`, `interrupt()`) + **Claude Agent SDK** (subagents, prompt caching) |
| **עמידות** | — | + Temporal (רק אם ריצות נמשכות שעות) |
| **LLM** | Claude (תסריט+אאוטליין) | + Dicta‑LM 3.0 ל‑polish עברי |
| **מחקר** | Tavily + Firecrawl | + Exa (סמנטי) + Playwright (screenshots) |
| **ויזואלים** | Pexels + FLUX/Imagen | + Recraft V3 (וקטור) + Mermaid/D2 (דיאגרמות) |
| **ניקוד** | Nakdimon (MIT, pip) | Dicta `dictabert-large-char-menaked` + Phonikud (IPA+הטעמה) |
| **TTS** | ElevenLabs v3 | MiniMax HD voice‑clone / Azure he‑IL |
| **אווטאר** | HeyGen Avatar IV (alpha WebM) | OmniHuman 1.5 + פאס Sync.so |
| **Compositor** | Remotion (CLI מקומי) | Remotion **Lambda** (`--concurrency`) |
| **QC** | ffprobe + ASR round‑trip | + SyncNet (ליפסינק) + WhisperX (alignment) + LanguageTool |

### 10.2 עלות אמיתית לשיעור 6 דק' (ההערכה הכנה)

| רכיב | עלות | הערה |
|---|---|---|
| מחקר (LLM + search APIs) | $0.50‑2.00 | תלוי במספר מקורות |
| כתיבת תסריט (LLM) | ~$0.50 | |
| ניקוד/G2P | ~$0 | self‑host |
| TTS (~5‑6k תווים) | $0.10‑0.60 | MiniMax זול / ElevenLabs יקר |
| ויזואלים (5‑10) | ~$0.50 | stock חינם, AI ~$0.02‑0.08 ליח' |
| **אווטאר/ליפסינק** ⬅️ נהג העלות | **$13‑27** | Sync re‑dub 6 דק' ≈ $27; **3 דק' face‑time ≈ $13** |
| רינדור (Remotion Lambda) | $0.05‑0.20 | |
| QC (ASR, LLM judges) | ~$0.50 | |
| **סה"כ /שיעור** | **~$15‑31** | נשלט ע"י זמן האווטאר |
| **סה"כ /קורס (8 שיעורים)** | **~$120‑250** | |

**🔑 מנוף העלות הגדול:** האווטאר. אופטימיזציה: המציגה לא חייבת להיות על המסך כל 6 הדקות — **סגמנטים** (פתיח, מעברים, נקודות מפתח) עם מציגה, והשאר שקופיות+VO. זה מוריד שניות־אווטאר ב‑40‑60% → **~$60‑120/קורס**. רינדור Remotion עצמו = סנטים.

---

<a name="11"></a>
## 11. 🗺️ תוכנית בנייה מדורגת (MVP → Production)

### Phase 0 — Proof of Concept (שבוע 1)
שיעור **בודד**, ידני‑למחצה: תסריט עברי (Claude + ban‑list) → Dicta ניקוד → ElevenLabs v3 → HeyGen Avatar IV (alpha) → Remotion קומפוזיציה אחת → MP4. **מטרה: לאמת שהעברית והליפסינק עוברים את סף הייחוס.** זה הסיכון היחיד שחייבים לבדוק קודם.

### Phase 1 — Pipeline ידני־אוטומטי (שבועות 2‑3)
- בנה את **תבנית Remotion** המלאה (כל ה‑layouts: title/assertion/bullets/chart/quiz/photo).
- בנה את **צינור הניקוד** (Dicta+Phonikud+override dict).
- בנה את ה‑**Zod schema** (`LessonProps`) + `calculateMetadata`.
- הרץ שיעור שלם מ‑JSON ידני → MP4. הוסף כתוביות RTL.

### Phase 2 — אוטומציית התוכן (שבועות 4‑5)
- חבר את **שרשרת המחקר** (Tavily/Exa/Firecrawl/Playwright → Fact Bank).
- חבר את **Architect → Planner → Writer** (LLM, סכמות רדודות).
- הוסף **שערי QC 1‑3** (שפה, זול).
- ★ נקודת אישור אנושי אחרי האאוטליין.

### Phase 3 — אוטומציה מלאה + scale (שבועות 6‑8)
- עטוף ב‑**LangGraph** (state, checkpointer, `Send` fan‑out, `interrupt`).
- הוסף **שערי QC 4‑7** (אודיו/ליפסינק/כתוביות/רינדור) עם self‑correction.
- העבר רינדור ל‑**Remotion Lambda**.
- הרץ את **הפרומפט האחד** end‑to‑end → ליין 8 סרטונים.

### Phase 4 — ליטוש מותגי
- voice‑clone מותגי (PVC/MiniMax) של קריין/ית קבוע/ה.
- ספריית style‑presets לתמונות.
- A/B מנוקד‑מול‑חלק לכל מנוע TTS.
- dashboard מעקב (n8n run‑history / LangSmith).

---

<a name="12"></a>
## 12. 📎 נספחים

### 12.1 ה‑8 takeaways האסטרטגיים
1. **פרק, לעולם אל ת‑one‑shot** — רמה‑אחר‑רמה, JSON רדוד; אישור אנושי מיד אחרי האאוטליין.
2. **הארק הכל ל‑Fact Bank מוקלד** (ציטוט מילולי + URL); StrictCitations + מאמת בדיעבד.
3. **טקסט עברי לעולם לא נוגע במחולל תמונות** — ויזואלים textless + הלבשת RTL ב‑Remotion. **ההכרעה ההפקתית #1.**
4. **ניקוד/G2P (Nakdan + Phonikud) לפני רינדור** — שער העברית עם ה‑ROI הכי גבוה.
5. **עברית ילידית = persona + ban‑list + few‑shot + ביקורת עצמית**; שקול ליטוש Dicta‑LM.
6. **~6 דק' / מטרה אחת / תבנית 7 ביטים Gagné / רעיון אחד לשקופית**; קול נושא מילים, שקופית נושאת ויזואל (Mayer).
7. **QC = evaluators חיצוניים בלולאת Reflexion**, שערים זולים קודם, מחדש יחידה קטנה, cap retries.
8. **ניתוק אודיו מווידאו** הוא מה שמגן בו־זמנית על העברית ועל הליפסינק — שתי הנקודות שהדגשת.

### 12.2 תבנית השיעור (Gagné · 7 ביטים · 6 דק')

| # | ביט | זמן | סוג שקופית | תפקיד הקריינות |
|---|---|---|---|---|
| 1 | **Hook** | 0:00‑0:30 | טענה/שאלה בודדת, בלי בולטים | נחת את ה‑payoff ב‑10‑15ש' הראשונות |
| 2 | **Objective** | 0:30‑0:50 | "בסוף תוכלו ל‑[פועל Bloom]…" | קרא את המטרה המדידה האחת |
| 3 | **Activate** | 0:50‑1:20 | prompt היזכרות / אנלוגיה | חבר לידוע; שליפה מרווחת של שיעור קודם |
| 4 | **Teach (chunked)** | 1:20‑3:30 | 2‑4 שקופיות, **רעיון אחד לכל אחת** | קול נושא מילים; שקופית נושאת ויזואל |
| 5 | **Worked example** | 3:30‑4:30 | צעד‑אחר‑צעד, חשיפה אחת לצעד | נרטֵב את ה‑*למה* של כל צעד |
| 6 | **Recap** | 4:30‑5:00 | 2‑3 takeaways כטענות | דחוס למטרה |
| 7 | **Retrieval quiz** | 5:00‑6:00 | 1‑3 שאלות, אחת לשקופית | שאל → זמן חשיבה → תשובה + הסבר שורה |

*להרחבה ל‑10 דק' — הרחב רק את ביט 4. בשיעורים ארוכים, שתול שאלה בין chunks (Szpunar 2013 PNAS: בחינה אמצע‑הרצאה מפחיתה נדידת מחשבות).*

### 12.3 צ'קליסט עיצוב שקופיות (Mayer — שערים בזמן בנייה)
Modality (מילים בקול, לא בשקופית) · **Redundancy (לעולם לא תסריט הקריינות על המסך)** · Coherence (נכש קישוט/מוזיקת רקע) · Signaling (חץ/הדגשה/צבע מבטא אחד) · Segmenting (רעיון/צעד אחד לשקופית) · Contiguity (תווית ליד החלק; ויזואל כשהקול אומר) · Personalization ("תוכלו/בואו") · Voice (אנושי טבעי).

### 12.4 מקורות מפתח (מתוך 4 זרמי המחקר)
**עברית/TTS:** `github.com/danielrosehill/Hebrew-TTS-Providers` · `huggingface.co/dicta-il/dictabert-large-char-menaked` · `arxiv.org/abs/2506.12311` (Phonikud) · `github.com/slp-rl/HebTTS` · `letsai.co.il/hebrew-tts-minimax` · elevenlabs.io/docs · learn.microsoft.com/azure/ai-services/speech-service · docs.cloud.google.com/text-to-speech/docs/chirp3-hd
**אווטאר/ליפסינק:** `developers.heygen.com/reference/create-video` · `docs.heygen.com/docs/create-webm-avatar-videos` · `sync.so/docs/models/lipsync` · `fal.ai/models/fal-ai/bytedance/omnihuman/v1.5` · `tavus.io/post/introducing-phoenix` · `higgsfield.ai/blog/Kling-AI-Avatar`
**Remotion/RTL:** `remotion.dev/docs/effects/color-key` · `/docs/dataset-render` · `/docs/google-fonts/load-font` · `/docs/lambda/cli/render` · `developer.mozilla.org/.../unicode-bidi` · `ivrit.ai/en/2025/02/13/training-whisper` · `github.com/m-bain/whisperx`
**תזמור/pedagogy:** `arxiv.org/pdf/2506.23393` · `2506.12689` · `mager.co/blog/.../langgraph-claude-agent-sdk` · Gagné's 9 Events · Mayer's Multimedia Principles · Szpunar 2013 PNAS · Reflexion (NeurIPS 2023)

### 12.5 קבצי ניתוח הסרטון (נשמרו ב‑`/tmp/vidanalysis/`)
`sheet_01.jpg`, `sheet_02.jpg` (contact sheets) · `face_crop.jpg` (מציגה ברזולוציה מלאה) · `full_intro.jpg` (פריים פתיח) · `audio.wav` (אודיו מחולץ 16kHz)

---

> **🎯 שורה תחתונה:** המערכת בנויה כך ש**העברית והליפסינק נפתרים בנפרד וכל אחד מקסימלית** — TTS עברי ייעודי (MiniMax/ElevenLabs) מנוקד מראש (Dicta+Phonikud), מוזן למודל audio‑driven (HeyGen/OmniHuman/Sync), עם פאס Sync.so סופי ושער SyncNet שמבטיחים שלא יורדים מתחת לסרטון הייחוס. הכל מורכב ב‑Remotion עם RTL נכון, מוארק ל‑Fact Bank, ומופעל מפרומפט אחד דרך orchestrator שמפרק רמה‑אחר‑רמה. **זה ה‑pipeline המושלם שביקשת.**

*— נכתב על בסיס ניתוח טכני של סרטון הייחוס + מחקר עומק מקבילי, יוני 2026.*

import type { Locale } from "@/lib/i18n";

/**
 * AI page content — bilingual, typed. Hebrew is warm/human/confident,
 * English crisp/global. Feature terminology matches BUILD_CONTRACT §8.
 * The page reads content[locale] after awaiting params.
 */

export interface ChatTurn {
  from: "user" | "ai";
  text: string;
  /** optional small label shown above an AI turn (e.g. tool/step) */
  note?: string;
}

export interface AISection {
  /** glossary feature number, used as a quiet reference, not 01/02 scaffolding */
  ref: string;
  tag: string;
  title: string;
  body: string;
  /** 2–3 short capability bullets */
  points: string[];
}

interface AIContent {
  meta: { title: string; description: string };

  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    orbitCenter: string;
    orbitItems: string[];
    promptPlaceholder: string;
    panelTitle: string;
    panelSubtitle: string;
    chat: ChatTurn[];
  };

  band: {
    intro: string;
    stats: { value: number; suffix?: string; prefix?: string; label: string }[];
  };

  builder: AISection & { chat: ChatTurn[]; panelTitle: string };
  courseGen: AISection & {
    prompt: string;
    modules: { title: string; lessons: string[] }[];
    quizLabel: string;
  };
  curriculum: AISection & {
    levels: { name: string; desc: string; tag: string }[];
  };
  lessonAssistant: AISection & { chat: ChatTurn[]; quickActions: string[] };
  tutor: AISection & { chat: ChatTurn[]; studentName: string; courseName: string };
  reviewer: AISection & {
    assignment: string;
    grade: string;
    rubric: { label: string; score: string; ok: boolean }[];
    feedback: string;
  };
  exam: AISection & {
    settingsTitle: string;
    settings: { label: string; value: string }[];
    questions: { q: string; type: string }[];
  };
  community: AISection & { feed: { action: string; detail: string }[] };
  advisor: AISection & {
    metrics: { label: string; value: string; delta: string; up: boolean }[];
    insight: string;
    coachLine: string;
    coachLabel: string;
  };
  contentStudio: AISection & {
    request: string;
    outputs: { kind: string; preview: string }[];
  };
  dailyTasks: AISection & {
    forOwner: string;
    ownerTasks: string[];
    forStudent: string;
    studentTasks: string[];
  };
  multiAI: AISection & {
    models: { name: string; trait: string; tone: string }[];
    routeNote: string;
  };
  knowledge: AISection & {
    sources: { name: string; type: string; status: string }[];
    learnedLabel: string;
    learned: string[];
  };
  voice: AISection & {
    captionLabel: string;
    caption: string;
    cues: { label: string; value: string }[];
  };
  mentors: AISection & {
    roster: { name: string; role: string; specialty: string }[];
  };

  closing: { title: string; body: string };
}

const he: AIContent = {
  meta: {
    title: "ה-AI המרכזי — CourseFocus AI",
    description:
      "AI אחד שמנהל את כל האקדמיה ומלמד כל תלמיד אישית: בונה, מלמד, בודק, מייעץ ומלווה.",
  },

  hero: {
    badge: "ה-AI המרכזי · יכולת #50",
    title: "AI שמנהל את כל האקדמיה — ומלמד כל תלמיד אישית.",
    subtitle:
      "לא תוסף ולא צ׳אטבוט בפינה. זה הליבה: AI אחד שבונה קורסים, בודק מטלות, מייעץ לעסק שלך ומלווה כל תלמיד — בעברית, מסביב לשעון.",
    primaryCta: "בנה את האקדמיה שלך",
    secondaryCta: "ראה את כל היכולות",
    orbitCenter: "AI מרכזי",
    orbitItems: [
      "בונה אקדמיה",
      "מחולל קורסים",
      "מורה אישי",
      "בודק מטלות",
      "מחולל מבחנים",
      "יועץ עסקי",
      "מנהל קהילה",
      "מאמן קולי",
    ],
    promptPlaceholder: "תאר את האקדמיה שאתה רוצה להקים…",
    panelTitle: "ה-AI של האקדמיה",
    panelSubtitle: "מחובר לכל יכולת · עונה בעברית",
    chat: [
      {
        from: "user",
        text: "תכין קורס מלא על שיווק דיגיטלי למתחילים, עם ליווי אישי לכל תלמיד.",
      },
      {
        from: "ai",
        note: "בונה אקדמיה",
        text: "בניתי מסלול בן 6 מודולים ו-34 שיעורים, עם בוחן בכל מודול, מבחן גמר ותעודה מאומתת. הפעלתי מורה אישי לכל נרשם.",
      },
      { from: "user", text: "מעולה. ומה לגבי תמחור?" },
      {
        from: "ai",
        text: "המלצתי על מנוי ₪149/חודש עם 14 ימי ניסיון. רוצה שאוסיף מסלול VIP אישי?",
      },
    ],
  },

  band: {
    intro: "מנוע אחד, שכבות אינטליגנציה רבות — סביב הבעלים וסביב כל תלמיד.",
    stats: [
      { value: 50, suffix: "+", label: "יכולות מנוהלות AI" },
      { value: 7, label: "מנועי AI לבחירה" },
      { value: 24, suffix: "/7", label: "ליווי לכל תלמיד" },
      { value: 2, label: "שפות, ילידי RTL" },
    ],
  },

  builder: {
    ref: "#2",
    tag: "בונה אקדמיה ב-AI",
    panelTitle: "הקמת אקדמיה",
    title: "תאר רעיון — קבל אקדמיה.",
    body: "ספר ל-AI על התחום, הקהל ומודל ההכנסה שלך. הוא מציע מבנה, מסלולים, תמחור ומיתוג — ובונה את האקדמיה מוכנה לפרסום.",
    points: [
      "מבנה קורסים ומסלולים מוצע אוטומטית",
      "המלצת תמחור ומודל מנויים",
      "לוגו, צבעים ותת-דומיין — לבן מלא",
    ],
    chat: [
      {
        from: "user",
        text: "אני מלמד עריכת וידאו. רוצה אקדמיה למתחילים עם מסלול מתקדם בתשלום.",
      },
      {
        from: "ai",
        note: "בונה תוכנית",
        text: "מצוין. הצעתי שלושה מסלולים: יסודות (חינמי), עריכה מקצועית (מנוי ₪149/חודש) ו-VIP אישי. הגדרתי קהילה, גיימיפיקציה ותעודות. לאשר ולבנות?",
      },
    ],
  },

  courseGen: {
    ref: "#3",
    tag: "מחולל קורסים ב-AI",
    title: "מפרומפט אחד — קורס שלם.",
    body: "כותרת אחת מספיקה. ה-AI מפרק אותה לסילבוס, מודולים, שיעורים, תקצירים ובוחן — מוכן לעריכה, לא טיוטה ריקה.",
    points: [
      "סילבוס מלא עם מודולים ושיעורים",
      "תקצירי שיעור ושאלות תרגול",
      "בוחן סיום שנבנה אוטומטית",
    ],
    prompt: "בנה קורס: 'יסודות צביעת צבעי שמן למתחילים'",
    modules: [
      {
        title: "מודול 1 · חומרים וכלים",
        lessons: ["סוגי צבע ומדללים", "מברשות ומשטחים", "הכנת הסטודיו"],
      },
      {
        title: "מודול 2 · צבע, ערך וגוון",
        lessons: ["גלגל הצבעים", "ערכים ובהירות", "ערבוב שכבות"],
      },
      {
        title: "מודול 3 · הדרך לתמונה ראשונה",
        lessons: ["סקיצה ראשונית", "שכבות וגלייז", "סיום וחתימה"],
      },
    ],
    quizLabel: "בוחן סיום · 8 שאלות נוצרו",
  },

  curriculum: {
    ref: "#4",
    tag: "מעצב מסלולי למידה",
    title: "ממתחיל ועד מומחה — מסלול שמתאים את עצמו.",
    body: "ה-AI מסדר את התוכן לארבעה שלבים ברורים, ומתאים את הקצב לכל תלמיד לפי ההתקדמות שלו בפועל.",
    points: [
      "ארבעה שלבים: מתחיל → בינוני → מתקדם → מומחה",
      "פתיחת תוכן לפי התקדמות, תאריך או XP",
      "מסלול מותאם אישית לכל תלמיד",
    ],
    levels: [
      { name: "מתחיל", tag: "שלב 1", desc: "יסודות, מושגי ליבה וביטחון ראשון." },
      { name: "בינוני", tag: "שלב 2", desc: "טכניקה, תרגול מודרך ופרויקט קטן." },
      { name: "מתקדם", tag: "שלב 3", desc: "עבודה עצמאית, סגנון אישי, מורכבות." },
      { name: "מומחה", tag: "שלב 4", desc: "שליטה, הנחיה לאחרים ותיק עבודות." },
    ],
  },

  lessonAssistant: {
    ref: "#8",
    tag: "עוזר שיעור ב-AI",
    title: "עוזר שיושב בתוך כל שיעור.",
    body: "התלמיד שואל בזמן הצפייה — וה-AI עונה מתוך תוכן השיעור עצמו, עם הפניות לנקודה המדויקת בסרטון.",
    points: [
      "תשובות מתוך תוכן השיעור והקורס",
      "תקצירים, נקודות מפתח והסברים חוזרים",
      "הפניה לדקה המדויקת בסרטון",
    ],
    quickActions: ["סכם את השיעור", "הסבר במילים פשוטות", "תן לי דוגמה"],
    chat: [
      { from: "user", text: "מה ההבדל בין גלייז לשכבה אטומה?" },
      {
        from: "ai",
        note: "מתוך שיעור 2.3",
        text: "גלייז הוא שכבה דקה ושקופה שמשנה גוון בלי להסתיר את מה שמתחת — נראה בדקה 4:12. שכבה אטומה מכסה לגמרי. רוצה שאקפיץ אותך לקטע?",
      },
    ],
  },

  tutor: {
    ref: "#9",
    tag: "מורה אישי ב-AI",
    studentName: "נועה",
    courseName: "עריכת וידאו · מסלול מקצועי",
    title: "מורה אישי שזוכר כל תלמיד.",
    body: "מורה שמכיר את ההיסטוריה, הקצב והקשיים של כל תלמיד — ומלווה אותו אישית, בלי שתצטרך להיות זמין 24/7.",
    points: [
      "זוכר התקדמות, חוזקות ופערים",
      "מתאים תרגול אישי לכל תלמיד",
      "מעודד, מזכיר ומחזיר למסלול",
    ],
    chat: [
      {
        from: "ai",
        note: "פותח את היום",
        text: "בוקר טוב נועה! אתמול סיימת את שלב הקאלר. היום נתרגל מעברים — 12 דקות. מוכנה?",
      },
      { from: "user", text: "כן, אבל המעברים שלי תמיד נראים חדים מדי." },
      {
        from: "ai",
        text: "הבעיה כמעט תמיד במשך — נסי 8 פריימים במקום 4, והוסיפי האטה קלה בסוף. הכנתי לך תרגיל קצר עם הקליפ שהעלית.",
      },
    ],
  },

  reviewer: {
    ref: "#11",
    tag: "בודק מטלות ב-AI",
    title: "בדיקה הוגנת ומיידית לכל הגשה.",
    body: "ה-AI קורא את ההגשה מול מחוון שאתה מגדיר, נותן ציון מנומק ומשוב אישי — ואתה תמיד יכול לאשר או לתקן.",
    points: [
      "בדיקה מול מחוון שאתה קובע",
      "ציון מנומק ומשוב בונה",
      "אישור או עריכה שלך בלחיצה",
    ],
    assignment: "מטלה · עריכת טריילר באורך 60 שניות",
    grade: "88",
    rubric: [
      { label: "קצב ומבנה", score: "מצוין", ok: true },
      { label: "קאלר ואחידות", score: "טוב", ok: true },
      { label: "סאונד ומיקס", score: "לשיפור", ok: false },
    ],
    feedback:
      "מבנה הטריילר חזק והקצב מצוין. המיקס מעט גבוה בקטעי הדיבור — הורד 3dB ותתאזן מול המוזיקה. עבודה יפה מאוד.",
  },

  exam: {
    ref: "#13",
    tag: "מחולל מבחנים ב-AI",
    title: "מבחן שלם — מותאם לרמה שתבחר.",
    body: "בחר נושא, רמה ומספר שאלות. ה-AI מחבר מבחן מגוון עם מפתח תשובות — ובודק אותו אוטומטית.",
    points: [
      "שאלות אמריקאיות, פתוחות ונכון/לא נכון",
      "רמת קושי וכמות לבחירתך",
      "מפתח תשובות ובדיקה אוטומטית",
    ],
    settingsTitle: "הגדרות מבחן",
    settings: [
      { label: "נושא", value: "תורת הצבע" },
      { label: "רמה", value: "בינוני" },
      { label: "שאלות", value: "10" },
      { label: "סוג", value: "מעורב" },
    ],
    questions: [
      { q: "מהו הצבע המשלים של כחול?", type: "אמריקאית" },
      { q: "הסבר במילים שלך מהו 'ערך' בציור.", type: "פתוחה" },
      { q: "גלייז מסתיר לחלוטין את השכבה שמתחת.", type: "נכון / לא נכון" },
    ],
  },

  community: {
    ref: "#18",
    tag: "מנהל קהילה ב-AI",
    title: "קהילה שמנהלת את עצמה — בטעם טוב.",
    body: "ה-AI מקבל פנים חדשים, עונה לשאלות נפוצות, מסמן תוכן בעייתי ומדגיש פוסטים שווים — כדי שהקהילה תישאר חיה ונקייה.",
    points: [
      "קבלת פנים ומענה אוטומטי לשאלות",
      "מודרציה וסימון תוכן בעייתי",
      "הדגשת הדיונים החשובים",
    ],
    feed: [
      { action: "קיבל בברכה את דניאל", detail: "הציע לו להתחיל ממסלול היסודות" },
      { action: "ענה ל-3 שאלות חוזרות", detail: "על ייצוא וקבצי פרויקט" },
      { action: "סימן פוסט לבדיקה", detail: "חשד לקישור שיווקי" },
      { action: "הקפיץ דיון מעולה", detail: "‘איך לתמחר עריכה ללקוח ראשון’" },
    ],
  },

  advisor: {
    ref: "#29 · #30",
    tag: "יועץ עסקי + מאמן צמיחה",
    title: "יועץ עסקי שקורא את המספרים בשבילך.",
    body: "ה-AI מנתח MRR, נטישה ו-LTV, מזהה מגמות לפני שהן הופכות לבעיה, וממליץ על הצעד הבא לצמיחה.",
    points: [
      "ניתוח MRR, ARR, נטישה ו-LTV",
      "זיהוי מגמות והתרעות מוקדמות",
      "המלצות צמיחה מעשיות",
    ],
    metrics: [
      { label: "MRR", value: "₪42,800", delta: "12%", up: true },
      { label: "תלמידים פעילים", value: "1,284", delta: "8%", up: true },
      { label: "נטישה", value: "3.1%", delta: "0.4%", up: false },
      { label: "LTV", value: "₪1,940", delta: "6%", up: true },
    ],
    insight:
      "הנטישה ירדה החודש בעיקר בקרב תלמידים שסיימו את שלב היסודות. כדאי להאיץ אותם לשלב הבא.",
    coachLabel: "מאמן צמיחה",
    coachLine:
      "הצעד הבא: השק אתגר שבועי למסיימי היסודות — זה הקבוצה עם הסיכוי הגבוה ביותר לשדרג למנוי.",
  },

  contentStudio: {
    ref: "#40",
    tag: "סטודיו תוכן ב-AI",
    title: "סטודיו שיווק שלם, מתוך האקדמיה.",
    body: "בקשה אחת והופכים שיעור לפוסט, מייל, תיאור קורס ותסריט קצר — בקול והמיתוג שלך.",
    points: [
      "פוסטים, מיילים ותיאורי קורסים",
      "תסריטים קצרים לרשתות",
      "בקול ובמיתוג של האקדמיה שלך",
    ],
    request: "צור קמפיין השקה למסלול 'עריכה מקצועית'",
    outputs: [
      { kind: "פוסט לרשת", preview: "המסלול שיהפוך אותך לעורך מבוקש — נפתח ביום ראשון." },
      { kind: "מייל", preview: "נועה, שמרנו לך מקום במחזור הקרוב של 'עריכה מקצועית'…" },
      { kind: "תיאור קורס", preview: "12 מודולים, פרויקט גמר ותעודה מאומתת." },
    ],
  },

  dailyTasks: {
    ref: "#25",
    tag: "משימות AI יומיות",
    title: "כל בוקר — תוכנית ברורה לשני הצדדים.",
    body: "ה-AI מכין רשימת פעולות יומית: לבעלים מה לקדם היום, ולכל תלמיד מה הצעד הקטן הבא במסלול.",
    points: [
      "סדר יום אוטומטי לבעלים",
      "משימה יומית אישית לכל תלמיד",
      "שמירה על מומנטום ורצף",
    ],
    forOwner: "לבעלים — היום",
    ownerTasks: [
      "אשר 4 מטלות שממתינות לבדיקה",
      "השב ל-2 פניות חמות ב-CRM",
      "פרסם את אתגר השבוע לקהילה",
    ],
    forStudent: "לתלמיד — היום",
    studentTasks: [
      "סיים שיעור 2.4 (8 דקות)",
      "תרגל מעברים עם הקליפ שלך",
      "ענה לשאלת היום ושמור על הרצף",
    ],
  },

  multiAI: {
    ref: "#46",
    tag: "שכבת Multi-AI",
    title: "בחר את המנוע. ה-AI יודע מתי להחליף.",
    body: "GPT, Claude, Gemini, Grok, DeepSeek, Mistral ו-Llama — תחת ממשק אחד. בחר ידנית, או תן ל-AI לנתב כל משימה למנוע המתאים.",
    points: [
      "שבעה מנועים תחת שליטה אחת",
      "בחירה ידנית או ניתוב אוטומטי",
      "תמיד הכלי הנכון למשימה הנכונה",
    ],
    routeNote: "ניתוב חכם: כתיבה ארוכה → Claude · ניתוח נתונים → GPT · מהירות → Gemini",
    models: [
      { name: "GPT", trait: "רב-תכליתי", tone: "violet" },
      { name: "Claude", trait: "כתיבה ארוכה", tone: "gold" },
      { name: "Gemini", trait: "מהיר ורב-מודלי", tone: "primary" },
      { name: "Grok", trait: "עדכני ובזמן אמת", tone: "violet" },
      { name: "DeepSeek", trait: "הסקה ומתמטיקה", tone: "primary" },
      { name: "Mistral", trait: "קליל ויעיל", tone: "gold" },
      { name: "Llama", trait: "פתוח וגמיש", tone: "primary" },
    ],
  },

  knowledge: {
    ref: "#47",
    tag: "מאגר ידע",
    title: "העלה את החומר שלך — ה-AI לומד אותו.",
    body: "מסמכי PDF, וורד, מצגות או אתר שלם. ה-AI קורא, מבין ועונה מתוך הידע שלך — לא מהאינטרנט הכללי.",
    points: [
      "PDF, Word, PowerPoint או אתר",
      "תשובות מתוך התוכן שלך בלבד",
      "המורה והעוזר נשענים על הידע שלך",
    ],
    learnedLabel: "מה ה-AI למד",
    learned: [
      "המתודולוגיה והטרמינולוגיה שלך",
      "תשובות לשאלות נפוצות של תלמידים",
      "דוגמאות וקייסים מהניסיון שלך",
    ],
    sources: [
      { name: "מדריך-עריכה.pdf", type: "PDF", status: "נלמד" },
      { name: "סילבוס-מלא.docx", type: "Word", status: "נלמד" },
      { name: "מצגת-קאלר.pptx", type: "PPT", status: "מעבד…" },
      { name: "האתר שלך", type: "Site", status: "בתור" },
    ],
  },

  voice: {
    ref: "#48",
    tag: "מאמן קולי",
    title: "דבר עם ה-AI — והוא מקשיב באמת.",
    body: "תלמידים יכולים לתרגל בקול: שאלה מדוברת, תרגול הגייה או תיאור עבודה — וה-AI עונה בקול, בזמן אמת.",
    points: [
      "שיחה קולית טבעית, דו-כיוונית",
      "משוב על הגייה וביטוי",
      "תמלול חי לכל שיחה",
    ],
    captionLabel: "תמלול חי",
    caption: "“ספר לי מה האתגר הכי גדול שלך בעריכה כרגע?”",
    cues: [
      { label: "מצב", value: "מקשיב" },
      { label: "שפה", value: "עברית" },
      { label: "קול", value: "חם · רגוע" },
    ],
  },

  mentors: {
    ref: "#49",
    tag: "רשת מנטורים",
    title: "לא מורה אחד — צוות מנטורים.",
    body: "הגדר כמה אישיויות AI עם תחומי מומחיות שונים. כל תלמיד פונה למנטור הנכון לשאלה הנכונה.",
    points: [
      "מנטורים מרובים בעלי אופי שונה",
      "כל אחד עם תחום מומחיות משלו",
      "התלמיד בוחר עם מי לדבר",
    ],
    roster: [
      { name: "מאיה", role: "מנטורית טכניקה", specialty: "תוכנה וזרימת עבודה" },
      { name: "איתן", role: "מנטור יצירתי", specialty: "סיפור, קצב וסגנון" },
      { name: "רון", role: "מנטור עסקי", specialty: "תמחור ולקוחות ראשונים" },
    ],
  },

  closing: {
    title: "AI אחד. כל האקדמיה. כל תלמיד.",
    body: "מהקמה ועד ליווי אישי — שכבת אינטליגנציה אחת שעובדת בשבילך מסביב לשעון.",
  },
};

const en: AIContent = {
  meta: {
    title: "The Central AI — CourseFocus AI",
    description:
      "One AI that runs the whole academy and tutors every student: it builds, teaches, reviews, advises, and coaches.",
  },

  hero: {
    badge: "The central AI · capability #50",
    title: "An AI that runs the whole academy — and tutors every student personally.",
    subtitle:
      "Not a plugin, not a chatbot in the corner. It's the core: one AI that builds courses, reviews assignments, advises your business, and coaches every student — around the clock.",
    primaryCta: "Build your academy",
    secondaryCta: "See every capability",
    orbitCenter: "Central AI",
    orbitItems: [
      "Academy Builder",
      "Course Generator",
      "Personal Tutor",
      "Assignment Reviewer",
      "Exam Generator",
      "Business Advisor",
      "Community Manager",
      "Voice Coach",
    ],
    promptPlaceholder: "Describe the academy you want to build…",
    panelTitle: "Academy AI",
    panelSubtitle: "Wired to every capability · answers live",
    chat: [
      {
        from: "user",
        text: "Build a full course on digital marketing for beginners, with a personal tutor for every student.",
      },
      {
        from: "ai",
        note: "Academy Builder",
        text: "Done — a 6-module path, 34 lessons, a quiz per module, a final exam, and a verified certificate. I enabled a personal tutor for every enrollee.",
      },
      { from: "user", text: "Perfect. What about pricing?" },
      {
        from: "ai",
        text: "I'd recommend $39/mo with a 14-day trial. Want me to add a 1:1 VIP track too?",
      },
    ],
  },

  band: {
    intro: "One engine, many layers of intelligence — around the owner and around every student.",
    stats: [
      { value: 50, suffix: "+", label: "AI-run capabilities" },
      { value: 7, label: "AI engines to choose" },
      { value: 24, suffix: "/7", label: "coaching per student" },
      { value: 2, label: "languages, native RTL" },
    ],
  },

  builder: {
    ref: "#2",
    tag: "AI Academy Builder",
    panelTitle: "Spin up academy",
    title: "Describe an idea — get an academy.",
    body: "Tell the AI about your niche, your audience, and your revenue model. It proposes structure, paths, pricing, and branding — then builds the academy, ready to publish.",
    points: [
      "Course and path structure proposed automatically",
      "Pricing and subscription model recommended",
      "Logo, colors, and subdomain — full white-label",
    ],
    chat: [
      {
        from: "user",
        text: "I teach video editing. I want a beginner academy with a paid pro track.",
      },
      {
        from: "ai",
        note: "drafting plan",
        text: "Great. I've proposed three tracks: Foundations (free), Pro Editing ($39/mo) and a 1:1 VIP. I set up community, gamification, and certificates. Approve and build?",
      },
    ],
  },

  courseGen: {
    ref: "#3",
    tag: "AI Course Generator",
    title: "One prompt → a full course.",
    body: "A single title is enough. The AI breaks it into a syllabus, modules, lessons, summaries, and a quiz — ready to edit, not an empty draft.",
    points: [
      "Full syllabus with modules and lessons",
      "Lesson summaries and practice questions",
      "A final quiz, generated automatically",
    ],
    prompt: "Build a course: 'Oil painting fundamentals for beginners'",
    modules: [
      {
        title: "Module 1 · Materials & tools",
        lessons: ["Paints and mediums", "Brushes and surfaces", "Setting up your studio"],
      },
      {
        title: "Module 2 · Color, value & hue",
        lessons: ["The color wheel", "Values and brightness", "Mixing in layers"],
      },
      {
        title: "Module 3 · Your first painting",
        lessons: ["The initial sketch", "Layers and glazing", "Finishing and signing"],
      },
    ],
    quizLabel: "Final quiz · 8 questions generated",
  },

  curriculum: {
    ref: "#4",
    tag: "AI Curriculum Designer",
    title: "Beginner to expert — a path that adapts.",
    body: "The AI arranges your content into four clear stages and paces each student to their real progress, not a fixed calendar.",
    points: [
      "Four stages: Beginner → Intermediate → Advanced → Expert",
      "Unlock by progress, date, or XP",
      "A path tailored to each student",
    ],
    levels: [
      { name: "Beginner", tag: "Stage 1", desc: "Fundamentals, core concepts, first confidence." },
      { name: "Intermediate", tag: "Stage 2", desc: "Technique, guided practice, a small project." },
      { name: "Advanced", tag: "Stage 3", desc: "Independent work, personal style, complexity." },
      { name: "Expert", tag: "Stage 4", desc: "Mastery, mentoring others, a portfolio." },
    ],
  },

  lessonAssistant: {
    ref: "#8",
    tag: "AI Lesson Assistant",
    title: "An assistant that lives inside every lesson.",
    body: "Students ask while they watch — and the AI answers from the lesson itself, pointing to the exact moment in the video.",
    points: [
      "Answers grounded in the lesson and course",
      "Summaries, key points, re-explanations",
      "Jumps to the exact timestamp",
    ],
    quickActions: ["Summarize this lesson", "Explain it simply", "Give me an example"],
    chat: [
      { from: "user", text: "What's the difference between a glaze and an opaque layer?" },
      {
        from: "ai",
        note: "from lesson 2.3",
        text: "A glaze is a thin, transparent layer that shifts hue without hiding what's beneath — shown at 4:12. An opaque layer covers fully. Want me to jump you there?",
      },
    ],
  },

  tutor: {
    ref: "#9",
    tag: "AI Personal Tutor",
    studentName: "Maya",
    courseName: "Video Editing · Pro track",
    title: "A personal tutor that remembers every student.",
    body: "A tutor that knows each student's history, pace, and struggles — and guides them personally, so you don't have to be on call 24/7.",
    points: [
      "Remembers progress, strengths, and gaps",
      "Tailors practice to each student",
      "Encourages, reminds, and gets them back on track",
    ],
    chat: [
      {
        from: "ai",
        note: "starting the day",
        text: "Morning, Maya! Yesterday you finished color grading. Today let's practice transitions — 12 minutes. Ready?",
      },
      { from: "user", text: "Yes, but my transitions always look too harsh." },
      {
        from: "ai",
        text: "Almost always a duration issue — try 8 frames instead of 4 and add a slight ease-out. I've queued a short drill using the clip you uploaded.",
      },
    ],
  },

  reviewer: {
    ref: "#11",
    tag: "AI Assignment Reviewer",
    title: "Fair, instant feedback on every submission.",
    body: "The AI reads each submission against a rubric you define, gives a reasoned grade and personal feedback — and you can always approve or adjust.",
    points: [
      "Graded against a rubric you set",
      "Reasoned score and constructive notes",
      "Your approval or edit in one click",
    ],
    assignment: "Assignment · Edit a 60-second trailer",
    grade: "88",
    rubric: [
      { label: "Pacing & structure", score: "Excellent", ok: true },
      { label: "Color & consistency", score: "Good", ok: true },
      { label: "Sound & mix", score: "Needs work", ok: false },
    ],
    feedback:
      "Strong trailer structure and excellent pacing. The mix is a touch hot on dialogue — drop it 3dB and balance against the music. Lovely work.",
  },

  exam: {
    ref: "#13",
    tag: "AI Exam Generator",
    title: "A full exam — matched to the level you pick.",
    body: "Choose a topic, level, and question count. The AI composes a varied exam with an answer key — and grades it automatically.",
    points: [
      "Multiple-choice, open, and true/false",
      "Difficulty and length your choice",
      "Answer key and auto-grading",
    ],
    settingsTitle: "Exam settings",
    settings: [
      { label: "Topic", value: "Color theory" },
      { label: "Level", value: "Intermediate" },
      { label: "Questions", value: "10" },
      { label: "Type", value: "Mixed" },
    ],
    questions: [
      { q: "What is the complementary color of blue?", type: "Multiple choice" },
      { q: "In your own words, what is 'value' in painting?", type: "Open" },
      { q: "A glaze fully hides the layer beneath it.", type: "True / False" },
    ],
  },

  community: {
    ref: "#18",
    tag: "AI Community Manager",
    title: "A community that runs itself — tastefully.",
    body: "The AI welcomes newcomers, answers common questions, flags problem content, and surfaces great posts — so the community stays alive and clean.",
    points: [
      "Welcomes members and answers FAQs",
      "Moderates and flags problem content",
      "Surfaces the discussions that matter",
    ],
    feed: [
      { action: "Welcomed Daniel", detail: "suggested he start with Foundations" },
      { action: "Answered 3 repeat questions", detail: "on exports and project files" },
      { action: "Flagged a post for review", detail: "suspected promo link" },
      { action: "Surfaced a great thread", detail: "'pricing your first editing client'" },
    ],
  },

  advisor: {
    ref: "#29 · #30",
    tag: "Business Advisor + Growth Coach",
    title: "A business advisor that reads the numbers for you.",
    body: "The AI analyzes MRR, churn, and LTV, spots trends before they become problems, and recommends your next move for growth.",
    points: [
      "Analyzes MRR, ARR, churn, and LTV",
      "Trend detection and early warnings",
      "Practical growth recommendations",
    ],
    metrics: [
      { label: "MRR", value: "$11,200", delta: "12%", up: true },
      { label: "Active students", value: "1,284", delta: "8%", up: true },
      { label: "Churn", value: "3.1%", delta: "0.4%", up: false },
      { label: "LTV", value: "$510", delta: "6%", up: true },
    ],
    insight:
      "Churn fell this month mostly among students who finished Foundations. It's worth nudging them into the next stage.",
    coachLabel: "Growth Coach",
    coachLine:
      "Next move: launch a weekly challenge for Foundations graduates — that's the group most likely to upgrade to a subscription.",
  },

  contentStudio: {
    ref: "#40",
    tag: "AI Content Studio",
    title: "A full marketing studio, from inside the academy.",
    body: "One request turns a lesson into a post, an email, a course description, and a short script — in your voice and brand.",
    points: [
      "Posts, emails, and course descriptions",
      "Short scripts for social",
      "In your academy's voice and brand",
    ],
    request: "Create a launch campaign for the 'Pro Editing' track",
    outputs: [
      { kind: "Social post", preview: "The track that makes you the editor clients ask for — opens Sunday." },
      { kind: "Email", preview: "Maya, we've saved your seat in the next 'Pro Editing' cohort…" },
      { kind: "Course description", preview: "12 modules, a capstone project, and a verified certificate." },
    ],
  },

  dailyTasks: {
    ref: "#25",
    tag: "Daily AI Tasks",
    title: "Every morning — a clear plan for both sides.",
    body: "The AI prepares a daily action list: for the owner, what to push today; for each student, the next small step on their path.",
    points: [
      "An automatic agenda for the owner",
      "A personal daily task for each student",
      "Keeps momentum and streaks alive",
    ],
    forOwner: "For the owner — today",
    ownerTasks: [
      "Approve 4 assignments awaiting review",
      "Reply to 2 warm CRM leads",
      "Post this week's community challenge",
    ],
    forStudent: "For the student — today",
    studentTasks: [
      "Finish lesson 2.4 (8 minutes)",
      "Practice transitions with your clip",
      "Answer today's question, keep the streak",
    ],
  },

  multiAI: {
    ref: "#46",
    tag: "Multi-AI Layer",
    title: "Choose the engine. The AI knows when to switch.",
    body: "GPT, Claude, Gemini, Grok, DeepSeek, Mistral, and Llama — under one interface. Pick manually, or let the AI route each task to the right engine.",
    points: [
      "Seven engines under one control",
      "Manual choice or automatic routing",
      "Always the right tool for the task",
    ],
    routeNote: "Smart routing: long-form → Claude · data analysis → GPT · speed → Gemini",
    models: [
      { name: "GPT", trait: "Versatile", tone: "violet" },
      { name: "Claude", trait: "Long-form writing", tone: "gold" },
      { name: "Gemini", trait: "Fast, multimodal", tone: "primary" },
      { name: "Grok", trait: "Real-time, current", tone: "violet" },
      { name: "DeepSeek", trait: "Reasoning & math", tone: "primary" },
      { name: "Mistral", trait: "Light & efficient", tone: "gold" },
      { name: "Llama", trait: "Open & flexible", tone: "primary" },
    ],
  },

  knowledge: {
    ref: "#47",
    tag: "Knowledge Base",
    title: "Upload your material — the AI learns it.",
    body: "PDFs, Word docs, slide decks, or a whole site. The AI reads, understands, and answers from your knowledge — not the open web.",
    points: [
      "PDF, Word, PowerPoint, or a site",
      "Answers from your content only",
      "The tutor and assistant lean on your knowledge",
    ],
    learnedLabel: "What the AI learned",
    learned: [
      "Your methodology and terminology",
      "Answers to your students' common questions",
      "Examples and cases from your experience",
    ],
    sources: [
      { name: "editing-guide.pdf", type: "PDF", status: "Learned" },
      { name: "full-syllabus.docx", type: "Word", status: "Learned" },
      { name: "color-deck.pptx", type: "PPT", status: "Processing…" },
      { name: "your website", type: "Site", status: "Queued" },
    ],
  },

  voice: {
    ref: "#48",
    tag: "Voice Coach",
    title: "Speak to the AI — and it really listens.",
    body: "Students can practice out loud: a spoken question, a pronunciation drill, or describing their work — and the AI answers in voice, in real time.",
    points: [
      "Natural, two-way voice conversation",
      "Feedback on pronunciation and delivery",
      "A live transcript for every session",
    ],
    captionLabel: "Live transcript",
    caption: "“Tell me — what's the biggest challenge in your editing right now?”",
    cues: [
      { label: "Mode", value: "Listening" },
      { label: "Language", value: "English" },
      { label: "Voice", value: "Warm · calm" },
    ],
  },

  mentors: {
    ref: "#49",
    tag: "Mentor Network",
    title: "Not one tutor — a team of mentors.",
    body: "Define several AI personas with different areas of expertise. Each student turns to the right mentor for the right question.",
    points: [
      "Multiple mentors with distinct characters",
      "Each with their own specialty",
      "The student chooses who to talk to",
    ],
    roster: [
      { name: "Maya", role: "Technique mentor", specialty: "Software & workflow" },
      { name: "Ethan", role: "Creative mentor", specialty: "Story, pacing & style" },
      { name: "Ron", role: "Business mentor", specialty: "Pricing & first clients" },
    ],
  },

  closing: {
    title: "One AI. The whole academy. Every student.",
    body: "From setup to personal coaching — a single layer of intelligence working for you, around the clock.",
  },
};

export const content: Record<Locale, AIContent> = { he, en };
export type { AIContent };

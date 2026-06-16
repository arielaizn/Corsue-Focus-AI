import type { Locale } from "@/lib/i18n";

/**
 * FEATURES page content — the full 50 capabilities in 10 art-directed clusters.
 * Typed { he, en }. Hebrew is warm/human/confident; English crisp/global.
 * Terminology follows BUILD_CONTRACT §8 glossary exactly.
 */

export interface FeatureItem {
  /** glossary feature number (#1–#50) */
  n: number;
  label: string;
  desc?: string;
}

export interface ClusterCopy {
  kicker: string;
  title: string;
  subtitle: string;
}

interface FeaturesContent {
  hero: {
    badge: string;
    title: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: number; suffix?: string; label: string }[];
  };

  c1: ClusterCopy & {
    panelTitle: string;
    fields: { label: string; value: string }[];
    brandColors: string;
    languageValue: string;
    currencyValue: string;
    ctaption: string;
    points: { title: string; desc: string }[];
  };

  c2: ClusterCopy & {
    coreLabel: string;
    aiLink: string;
    items: FeatureItem[];
  };

  c3: ClusterCopy & {
    nowPlaying: string;
    chapterLabel: string;
    chapters: string[];
    transcriptLabel: string;
    summaryLabel: string;
    summaryText: string;
    transcriptLines: string[];
    railTitle: string;
    rail: FeatureItem[];
    courseTypesLabel: string;
    courseTypes: string[];
  };

  c4: ClusterCopy & {
    quizTitle: string;
    question: string;
    options: { text: string; correct?: boolean }[];
    aiReviewLabel: string;
    aiReviewText: string;
    scoreLabel: string;
    certTitle: string;
    certSubtitle: string;
    certName: string;
    certCourse: string;
    certVerified: string;
    certIssued: string;
    points: { title: string; desc: string }[];
  };

  c5: ClusterCopy & {
    feedTitle: string;
    posts: { author: string; time: string; text: string; likes: number; comments: number; tag?: string }[];
    chatTitle: string;
    chatStatus: string;
    messages: { from: "them" | "me"; text: string; time: string }[];
    composer: string;
    aiManagerNote: string;
  };

  c6: ClusterCopy & {
    levelLabel: string;
    level: number;
    xpCurrent: number;
    xpNext: number;
    xpLabel: string;
    streakLabel: string;
    streakDays: number;
    badgesLabel: string;
    badges: string[];
    leaderboardLabel: string;
    leaderboard: { rank: number; name: string; xp: number; me?: boolean }[];
    challengeLabel: string;
    challengeText: string;
    dailyLabel: string;
    dailyTasks: string[];
  };

  c7: ClusterCopy & {
    ownerLabel: string;
    studentLabel: string;
    ownerMetrics: { label: string; value: string; trend: string; up?: boolean }[];
    revenueLabel: string;
    advisorLabel: string;
    advisorText: string;
    studentMetrics: { label: string; value: string }[];
    studentProgressLabel: string;
    studentCourses: { name: string; pct: number }[];
  };

  c8: ClusterCopy & {
    providersLabel: string;
    providers: string[];
    items: FeatureItem[];
    planLabel: string;
    plans: { name: string; price: string; cycle: string }[];
    couponLabel: string;
    couponCode: string;
    couponOff: string;
    affiliateLabel: string;
    affiliateText: string;
  };

  c9: ClusterCopy & {
    calendarTitle: string;
    weekdays: string[];
    events: { day: number; label: string; tone: "live" | "task" | "drop" }[];
    liveLabel: string;
    liveTitle: string;
    liveStatus: string;
    liveAttendees: string;
    livePlatforms: string[];
    liveCtaJoin: string;
  };

  c10: ClusterCopy & {
    apiLabel: string;
    apiComment: string;
    apiCode: { kind: "comment" | "kw" | "fn" | "str" | "plain"; text: string }[][];
    webhookLabel: string;
    webhooks: string[];
    automationLabel: string;
    automationTitle: string;
    nodes: { label: string; sub: string }[];
    mobileLabel: string;
    mobileTitle: string;
    mobileFeatures: string[];
    marketplaceLabel: string;
    marketplaceText: string;
  };
}

export const content: Record<Locale, FeaturesContent> = {
  he: {
    hero: {
      badge: "50 יכולות. מערכת הפעלה אחת.",
      title: "כל מה שאקדמיה צריכה. כלום מעבר.",
      sub: "קורסים, קהילה, מנויים, גיימיפיקציה, אנליטיקות, אפליקציה ו-API — שכבת AI מרכזית אחת שמנהלת, בונה ומלמדת. הנה כל הפלטפורמה, מקצה לקצה.",
      ctaPrimary: "בנה את האקדמיה שלך",
      ctaSecondary: "לעמוד ה-AI",
      stats: [
        { value: 50, label: "יכולות מובנות" },
        { value: 10, label: "מערכות חיות" },
        { value: 7, label: "ספקי תשלום" },
      ],
    },

    c1: {
      kicker: "אקדמיה ולייבל לבן",
      title: "אקדמיה ממותגת בלחיצה.",
      subtitle:
        "שם, לוגו, צבעי מותג, סאב-דומיין, שפה, מטבע ואזור זמן — האקדמיה שלך עולה לאוויר בדקות, על הדומיין שלך, בלי שום חותם זר.",
      panelTitle: "יצירת אקדמיה",
      fields: [
        { label: "שם האקדמיה", value: "סטודיו AI של אריאל" },
        { label: "סאב-דומיין", value: "ariel.coursefocus.ai" },
      ],
      brandColors: "צבעי מותג",
      languageValue: "עברית (RTL)",
      currencyValue: "₪ שקל",
      ctaption: "לייבל לבן מלא — הדומיין שלך, המותג שלך, ה-AI שלך.",
      points: [
        {
          title: "יצירת אקדמיה בלחיצה",
          desc: "מאפס לאקדמיה חיה תוך דקות — בלי קוד ובלי הקמה טכנית.",
        },
        {
          title: "לייבל לבן מלא",
          desc: "דומיין משלך, ללא מיתוג של CourseFocus — הבעלות כולה שלך.",
        },
      ],
    },

    c2: {
      kicker: "שכבת ה-AI",
      title: "AI אחד מנהל הכול.",
      subtitle:
        "ה-AI לא פיצ'ר — הוא מערכת ההפעלה. הוא בונה אקדמיה, מחולל קורסים, מעצב מסלולים, בודק מטלות, מלמד אישית ומייעץ עסקית. שש-עשרה יכולות AI, ליבה אחת.",
      coreLabel: "ליבת ה-AI",
      aiLink: "לצלילה המלאה בעמוד ה-AI",
      items: [
        { n: 2, label: "בונה אקדמיה ב-AI" },
        { n: 3, label: "מחולל קורסים ב-AI" },
        { n: 4, label: "מעצב מסלולי למידה" },
        { n: 8, label: "עוזר שיעור ב-AI" },
        { n: 9, label: "מורה אישי (AI Tutor)" },
        { n: 11, label: "בודק מטלות ב-AI" },
        { n: 13, label: "מחולל מבחנים ב-AI" },
        { n: 18, label: "מנהל קהילה ב-AI" },
        { n: 25, label: "משימות AI יומיות" },
        { n: 29, label: "יועץ עסקי ב-AI" },
        { n: 30, label: "מאמן צמיחה ב-AI" },
        { n: 40, label: "סטודיו תוכן ב-AI" },
        { n: 46, label: "Multi-AI נבחר" },
        { n: 47, label: "מאגר ידע" },
        { n: 48, label: "מאמן קולי" },
        { n: 49, label: "רשת מנטורים" },
      ],
    },

    c3: {
      kicker: "קורסים · שיעורים · וידאו",
      title: "נגן וידאו שחושב יחד עם הלומד.",
      subtitle:
        "מהירות, צ'אפטרים, כתוביות, תמלול AI, סיכום AI ו-Picture-in-Picture. כל שיעור — וידאו, אודיו, PDF, מצגת או טקסט — עם הערות, סימניות וסיכומים.",
      nowPlaying: "שיעור 04 · ארכיטקטורת פרומפטים",
      chapterLabel: "צ'אפטרים",
      chapters: ["פתיחה", "עקרונות יסוד", "תבניות מתקדמות", "סיכום ותרגול"],
      transcriptLabel: "תמלול AI",
      summaryLabel: "סיכום AI",
      summaryText:
        "השיעור מציג שלוש תבניות פרומפט מרכזיות, מתי להשתמש בכל אחת, ושתי מלכודות נפוצות.",
      transcriptLines: [
        "0:42 — נתחיל מהמבנה: הקשר, מטרה, אילוצים.",
        "1:15 — שימו לב לסדר — הוא משנה את התוצאה.",
      ],
      railTitle: "בכל שיעור, בנוי פנימה",
      rail: [
        { n: 7, label: "מהירות נגינה", desc: "0.5× עד 2× עם שמירת גובה צליל." },
        { n: 7, label: "צ'אפטרים", desc: "ניווט מהיר בין חלקי השיעור." },
        { n: 7, label: "כתוביות", desc: "נוצרות אוטומטית, בכל שפה." },
        { n: 7, label: "תמלול AI", desc: "טקסט מלא לחיפוש וקריאה." },
        { n: 7, label: "סיכום AI", desc: "תקציר חכם בלחיצה." },
        { n: 7, label: "PiP · AirPlay", desc: "צפייה בכל מסך, בכל מקום." },
      ],
      courseTypesLabel: "סוגי קורסים",
      courseTypes: ["חינמי", "חד-פעמי", "מנוי", "VIP", "סגור", "קבוצתי"],
    },

    c4: {
      kicker: "מטלות, מבחנים ותעודות",
      title: "בדיקה אוטומטית. תעודה מאומתת.",
      subtitle:
        "מטלות, מחולל מבחנים ב-AI ובודק שמסביר את הציון. בסיום — תעודה ממותגת עם קוד QR שמאמת אותה לכל מי שסורק.",
      quizTitle: "מבחן · יסודות AI",
      question: "מהו הרכיב הראשון בכל פרומפט אפקטיבי?",
      options: [
        { text: "מספר המילים" },
        { text: "הקשר ומטרה", correct: true },
        { text: "סוג המודל" },
        { text: "טמפרטורה" },
      ],
      aiReviewLabel: "בודק מטלות ב-AI",
      aiReviewText:
        "תשובה מצוינת. זיהית נכון את ההקשר כעוגן — הוסף דוגמה אחת קונקרטית והניקוד מושלם.",
      scoreLabel: "ציון",
      certTitle: "תעודת סיום",
      certSubtitle: "סטודיו AI של אריאל",
      certName: "דניאל כהן",
      certCourse: "מאסטר פרומפטינג · 2026",
      certVerified: "אומת בסריקה",
      certIssued: "הונפק 16.06.2026",
      points: [
        { title: "מחולל מבחנים ב-AI", desc: "מבחן מלא מתוך תוכן הקורס בלחיצה." },
        { title: "אימות QR", desc: "כל תעודה ניתנת לאימות ציבורי מיידי." },
      ],
    },

    c5: {
      kicker: "קהילה והודעות",
      title: "המקום שבו האקדמיה מתעוררת.",
      subtitle:
        "פיד עם פוסטים, תגובות, לייקים, תיוגים והאשטגים. קבוצות ציבוריות, פרטיות ו-VIP. צ'אט אישי, קבוצתי, קבצים וקול — והכול תחת מנהל קהילה AI שלא ישן.",
      feedTitle: "פיד הקהילה",
      posts: [
        {
          author: "מאיה לוי",
          time: "לפני 12 דק'",
          text: "סיימתי את מסלול הפרומפטים — הפרויקט הראשון שלי כבר עלה לאוויר 🚀",
          likes: 47,
          comments: 12,
          tag: "#הישג",
        },
        {
          author: "יונתן בר",
          time: "לפני שעה",
          text: "מישהו מחבר.ת ל-API של CourseFocus? @אריאל יש דוגמה?",
          likes: 18,
          comments: 6,
          tag: "#שאלה",
        },
      ],
      chatTitle: "הודעות",
      chatStatus: "מחובר.ת עכשיו",
      messages: [
        { from: "them", text: "היי, אפשר עזרה עם המבחן בפרק 3?", time: "14:02" },
        { from: "me", text: "בטח — שולח לך עכשיו סיכום AI שיעזור.", time: "14:03" },
        { from: "them", text: "תודה! זה בדיוק מה שחיפשתי 🙏", time: "14:04" },
      ],
      composer: "כתוב הודעה...",
      aiManagerNote: "מנהל קהילה ב-AI עונה על שאלות נפוצות, מסמן ספאם וממריץ דיון.",
    },

    c6: {
      kicker: "גיימיפיקציה",
      title: "התקדמות שמרגישים.",
      subtitle:
        "XP, רמות 1 עד 100, רצפים, תגים, טבלאות מובילים ואתגרים — ומשימות AI יומיות שמתאימות עצמן לכל לומד. אלגנטי ושאפתני, לא מגרש משחקים.",
      levelLabel: "רמה",
      level: 42,
      xpCurrent: 8450,
      xpNext: 10000,
      xpLabel: "XP לרמה הבאה",
      streakLabel: "רצף",
      streakDays: 23,
      badgesLabel: "תגים שהושגו",
      badges: ["מתמיד", "מנטור", "ראשון לסיים", "100 ימים", "תורם מצטיין"],
      leaderboardLabel: "טבלת מובילים · השבוע",
      leaderboard: [
        { rank: 1, name: "נועה שגב", xp: 12400 },
        { rank: 2, name: "אתה", xp: 8450, me: true },
        { rank: 3, name: "עידן רז", xp: 7900 },
        { rank: 4, name: "טל אבני", xp: 6510 },
      ],
      challengeLabel: "אתגר השבוע",
      challengeText: "השלם 5 שיעורים ופרסם פרויקט אחד · 3/5",
      dailyLabel: "משימות AI להיום",
      dailyTasks: ["צפה בשיעור 04", "ענה על שאלת התרגול", "הגב לחבר.ה בפיד"],
    },

    c7: {
      kicker: "אנליטיקות",
      title: "שני לוחות מחוונים. שקיפות מלאה.",
      subtitle:
        "הבעלים רואה MRR, ARR, שימור, נטישה, LTV ו-CAC — עם יועץ עסקי AI שמסביר מה לעשות. הלומד רואה התקדמות, רצף וצעד הבא ברור.",
      ownerLabel: "לוח הבעלים",
      studentLabel: "לוח הלומד",
      ownerMetrics: [
        { label: "MRR", value: "₪42,800", trend: "+12%", up: true },
        { label: "שימור", value: "94%", trend: "+3%", up: true },
        { label: "נטישה", value: "2.1%", trend: "-0.4%", up: true },
        { label: "LTV", value: "₪3,240", trend: "+8%", up: true },
      ],
      revenueLabel: "הכנסה · 6 חודשים",
      advisorLabel: "יועץ עסקי ב-AI",
      advisorText:
        "השימור עלה, אבל ה-CAC טיפס בערוץ אחד. הצע מסלול שנתי בהנחה — צפי לגידול של 9% ב-LTV.",
      studentMetrics: [
        { label: "השלמה", value: "78%" },
        { label: "רצף", value: "23 ימים" },
      ],
      studentProgressLabel: "ההתקדמות שלי",
      studentCourses: [
        { name: "מאסטר פרומפטינג", pct: 78 },
        { name: "אוטומציות AI", pct: 45 },
        { name: "בניית סוכנים", pct: 12 },
      ],
    },

    c8: {
      kicker: "מונטיזציה",
      title: "גובה תשלום מהיום הראשון.",
      subtitle:
        "סליקה דרך SUMIT, Stripe, PayPal, Tranzila ו-Pelecard. מנויים חודשיים, שנתיים ו-Lifetime, קופונים, שותפים, CRM, דיוור ופוש — הכול במקום אחד.",
      providersLabel: "ספקי סליקה",
      providers: ["SUMIT", "Stripe", "PayPal", "Tranzila", "Pelecard"],
      items: [
        { n: 35, label: "CRM", desc: "כרטיס לקוח, תגיות ומסע מלא." },
        { n: 36, label: "דיוור", desc: "קמפיינים ואוטומציות אימייל." },
        { n: 37, label: "פוש", desc: "התראות חכמות לאפליקציה." },
      ],
      planLabel: "מסלולי מנוי",
      plans: [
        { name: "חודשי", price: "₪199", cycle: "/חודש" },
        { name: "שנתי", price: "₪1,990", cycle: "/שנה" },
        { name: "Lifetime", price: "₪4,990", cycle: "חד-פעמי" },
      ],
      couponLabel: "קופון פעיל",
      couponCode: "LAUNCH40",
      couponOff: "40%- הנחה",
      affiliateLabel: "תוכנית שותפים",
      affiliateText: "כל שותף מקבל לינק, מעקב המרות ועמלות אוטומטיות.",
    },

    c9: {
      kicker: "תפעול",
      title: "יומן ושיעורים חיים, מסונכרנים.",
      subtitle:
        "יומן אקדמיה מלא — שיעורים חיים, מועדי הגשה ו-Drops — וחיבור ישיר ל-Zoom, Google Meet ו-Teams. הלומדים יודעים תמיד מה הלאה.",
      calendarTitle: "יוני 2026",
      weekdays: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
      events: [
        { day: 16, label: "שיעור חי", tone: "live" },
        { day: 18, label: "הגשה", tone: "task" },
        { day: 22, label: "Drop", tone: "drop" },
        { day: 25, label: "שיעור חי", tone: "live" },
      ],
      liveLabel: "עכשיו בשידור",
      liveTitle: "שיעור חי · בניית סוכן AI ראשון",
      liveStatus: "LIVE",
      liveAttendees: "128 לומדים מחוברים",
      livePlatforms: ["Zoom", "Google Meet", "Teams"],
      liveCtaJoin: "הצטרף לשיעור",
    },

    c10: {
      kicker: "פלטפורמה ומפתחים",
      title: "פתוח. נייד. אוטומטי.",
      subtitle:
        "API למפתחים, Webhooks לכל אירוע, בונה אוטומציות בסגנון Make/Zapier, אפליקציות iOS ו-Android עם הורדות לצפייה אופליין, ושוק (Marketplace) לחשיפה.",
      apiLabel: "Developer API",
      apiComment: "// צור הרשמה לקורס דרך ה-API",
      apiCode: [
        [
          { kind: "kw", text: "const" },
          { kind: "plain", text: " res " },
          { kind: "kw", text: "=" },
          { kind: "plain", text: " " },
          { kind: "kw", text: "await" },
          { kind: "plain", text: " coursefocus." },
          { kind: "fn", text: "enroll" },
          { kind: "plain", text: "({" },
        ],
        [
          { kind: "plain", text: "  student: " },
          { kind: "str", text: '"stu_8f2a"' },
          { kind: "plain", text: "," },
        ],
        [
          { kind: "plain", text: "  course:  " },
          { kind: "str", text: '"crs_prompting"' },
          { kind: "plain", text: "," },
        ],
        [
          { kind: "plain", text: "  plan:    " },
          { kind: "str", text: '"subscription"' },
          { kind: "plain", text: "," },
        ],
        [{ kind: "plain", text: "});" }],
        [{ kind: "comment", text: "// → 201  enrollment.created ✓" }],
      ],
      webhookLabel: "Webhooks",
      webhooks: ["course.completed", "payment.succeeded", "student.joined"],
      automationLabel: "בונה אוטומציות ב-AI",
      automationTitle: "כשתלמיד מסיים קורס →",
      nodes: [
        { label: "טריגר", sub: "course.completed" },
        { label: "פעולה", sub: "הענק תג + XP" },
        { label: "פעולה", sub: "שלח אימייל ברכה" },
      ],
      mobileLabel: "אפליקציות מובייל",
      mobileTitle: "האקדמיה בכיס",
      mobileFeatures: ["iOS · Android", "הורדות לאופליין", "פוש חכם", "סנכרון מלא"],
      marketplaceLabel: "שוק (Marketplace)",
      marketplaceText: "חשוף את האקדמיה לקהל חדש דרך שוק הקורסים של CourseFocus.",
    },
  },

  en: {
    hero: {
      badge: "50 capabilities. One operating system.",
      title: "Everything an academy needs. Nothing it doesn't.",
      sub: "Courses, community, subscriptions, gamification, analytics, a mobile app and an API — run by one central AI layer that builds, manages and tutors. Here is the whole platform, end to end.",
      ctaPrimary: "Build your academy",
      ctaSecondary: "See the AI page",
      stats: [
        { value: 50, label: "Built-in capabilities" },
        { value: 10, label: "Living systems" },
        { value: 7, label: "Payment providers" },
      ],
    },

    c1: {
      kicker: "Academy & White-Label",
      title: "A fully-branded academy in one click.",
      subtitle:
        "Name, logo, brand colors, subdomain, language, currency and timezone — your academy goes live in minutes, on your domain, with no foreign mark on it.",
      panelTitle: "Create academy",
      fields: [
        { label: "Academy name", value: "Ariel AI Studio" },
        { label: "Subdomain", value: "ariel.coursefocus.ai" },
      ],
      brandColors: "Brand colors",
      languageValue: "English (LTR)",
      currencyValue: "$ USD",
      ctaption: "Full white-label — your domain, your brand, your AI.",
      points: [
        {
          title: "One-click academy",
          desc: "From zero to a live academy in minutes — no code, no setup.",
        },
        {
          title: "Full white-label",
          desc: "Your own domain, no CourseFocus branding — the ownership is entirely yours.",
        },
      ],
    },

    c2: {
      kicker: "The AI Suite",
      title: "One AI runs everything.",
      subtitle:
        "The AI isn't a feature — it's the operating system. It builds the academy, generates courses, designs curricula, reviews assignments, tutors personally and advises on the business. Sixteen AI capabilities, one core.",
      coreLabel: "AI Core",
      aiLink: "See the full AI page",
      items: [
        { n: 2, label: "AI Academy Builder" },
        { n: 3, label: "AI Course Generator" },
        { n: 4, label: "AI Curriculum Designer" },
        { n: 8, label: "AI Lesson Assistant" },
        { n: 9, label: "AI Tutor" },
        { n: 11, label: "AI Assignment Reviewer" },
        { n: 13, label: "AI Exam Generator" },
        { n: 18, label: "AI Community Manager" },
        { n: 25, label: "Daily AI tasks" },
        { n: 29, label: "AI Business Advisor" },
        { n: 30, label: "AI Growth Coach" },
        { n: 40, label: "AI Content Studio" },
        { n: 46, label: "Multi-AI, your pick" },
        { n: 47, label: "Knowledge Base" },
        { n: 48, label: "Voice Coach" },
        { n: 49, label: "Mentor Network" },
      ],
    },

    c3: {
      kicker: "Courses · Lessons · Video",
      title: "A video player that thinks with the learner.",
      subtitle:
        "Speed, chapters, captions, AI transcript, AI summary and Picture-in-Picture. Every lesson — video, audio, PDF, slides or text — with notes, bookmarks and summaries.",
      nowPlaying: "Lesson 04 · Prompt architecture",
      chapterLabel: "Chapters",
      chapters: ["Intro", "Core principles", "Advanced patterns", "Recap & practice"],
      transcriptLabel: "AI transcript",
      summaryLabel: "AI summary",
      summaryText:
        "The lesson covers three core prompt patterns, when to use each, and two common pitfalls.",
      transcriptLines: [
        "0:42 — Start with structure: context, goal, constraints.",
        "1:15 — Order matters — it changes the output.",
      ],
      railTitle: "In every lesson, built in",
      rail: [
        { n: 7, label: "Playback speed", desc: "0.5× to 2× with pitch preserved." },
        { n: 7, label: "Chapters", desc: "Jump between lesson sections fast." },
        { n: 7, label: "Captions", desc: "Auto-generated, in any language." },
        { n: 7, label: "AI transcript", desc: "Full searchable, readable text." },
        { n: 7, label: "AI summary", desc: "A smart recap in one click." },
        { n: 7, label: "PiP · AirPlay", desc: "Watch on any screen, anywhere." },
      ],
      courseTypesLabel: "Course types",
      courseTypes: ["Free", "One-time", "Subscription", "VIP", "Private", "Cohort"],
    },

    c4: {
      kicker: "Assessments & Certificates",
      title: "Auto-graded. Verifiably yours.",
      subtitle:
        "Assignments, an AI exam generator and a reviewer that explains the grade. On completion — a branded certificate with a QR code that verifies it for anyone who scans.",
      quizTitle: "Exam · AI Fundamentals",
      question: "What is the first component of any effective prompt?",
      options: [
        { text: "The word count" },
        { text: "Context and goal", correct: true },
        { text: "The model type" },
        { text: "Temperature" },
      ],
      aiReviewLabel: "AI Assignment Reviewer",
      aiReviewText:
        "Excellent answer. You correctly anchored on context — add one concrete example and the score is perfect.",
      scoreLabel: "Score",
      certTitle: "Certificate of Completion",
      certSubtitle: "Ariel AI Studio",
      certName: "Daniel Cohen",
      certCourse: "Prompting Master · 2026",
      certVerified: "Verified by scan",
      certIssued: "Issued 06.16.2026",
      points: [
        { title: "AI Exam Generator", desc: "A full exam from your course content, in one click." },
        { title: "QR verification", desc: "Every certificate is publicly verifiable instantly." },
      ],
    },

    c5: {
      kicker: "Community & Messaging",
      title: "Where the academy comes alive.",
      subtitle:
        "A feed with posts, comments, likes, mentions and hashtags. Public, private and VIP groups. 1:1, group, files and voice chat — all watched over by an AI community manager that never sleeps.",
      feedTitle: "Community feed",
      posts: [
        {
          author: "Maya Levi",
          time: "12 min ago",
          text: "Finished the prompting track — my first project is already live 🚀",
          likes: 47,
          comments: 12,
          tag: "#win",
        },
        {
          author: "Jonathan Bar",
          time: "1 hr ago",
          text: "Anyone wired up the CourseFocus API yet? @ariel got an example?",
          likes: 18,
          comments: 6,
          tag: "#question",
        },
      ],
      chatTitle: "Messages",
      chatStatus: "Online now",
      messages: [
        { from: "them", text: "Hey, can you help with the chapter 3 exam?", time: "14:02" },
        { from: "me", text: "Of course — sending you an AI summary now.", time: "14:03" },
        { from: "them", text: "Thanks! That's exactly what I needed 🙏", time: "14:04" },
      ],
      composer: "Write a message...",
      aiManagerNote: "An AI Community Manager answers FAQs, flags spam and keeps discussion alive.",
    },

    c6: {
      kicker: "Gamification",
      title: "Progress you can feel.",
      subtitle:
        "XP, Levels 1 to 100, streaks, badges, leaderboards and challenges — plus daily AI tasks that adapt to each learner. Elegant and aspirational, never a playground.",
      levelLabel: "Level",
      level: 42,
      xpCurrent: 8450,
      xpNext: 10000,
      xpLabel: "XP to next level",
      streakLabel: "Streak",
      streakDays: 23,
      badgesLabel: "Badges earned",
      badges: ["Consistent", "Mentor", "First to finish", "100 days", "Top contributor"],
      leaderboardLabel: "Leaderboard · This week",
      leaderboard: [
        { rank: 1, name: "Noa Segev", xp: 12400 },
        { rank: 2, name: "You", xp: 8450, me: true },
        { rank: 3, name: "Idan Raz", xp: 7900 },
        { rank: 4, name: "Tal Avni", xp: 6510 },
      ],
      challengeLabel: "This week's challenge",
      challengeText: "Complete 5 lessons and ship one project · 3/5",
      dailyLabel: "Today's AI tasks",
      dailyTasks: ["Watch lesson 04", "Answer the practice question", "Reply to a peer in the feed"],
    },

    c7: {
      kicker: "Analytics",
      title: "Two dashboards. Total clarity.",
      subtitle:
        "The owner sees MRR, ARR, retention, churn, LTV and CAC — with an AI business advisor that says what to do. The learner sees progress, streak and a clear next step.",
      ownerLabel: "Owner dashboard",
      studentLabel: "Student dashboard",
      ownerMetrics: [
        { label: "MRR", value: "$11,400", trend: "+12%", up: true },
        { label: "Retention", value: "94%", trend: "+3%", up: true },
        { label: "Churn", value: "2.1%", trend: "-0.4%", up: true },
        { label: "LTV", value: "$860", trend: "+8%", up: true },
      ],
      revenueLabel: "Revenue · 6 months",
      advisorLabel: "AI Business Advisor",
      advisorText:
        "Retention is up, but CAC climbed in one channel. Offer a discounted annual plan — projected 9% LTV lift.",
      studentMetrics: [
        { label: "Completion", value: "78%" },
        { label: "Streak", value: "23 days" },
      ],
      studentProgressLabel: "My progress",
      studentCourses: [
        { name: "Prompting Master", pct: 78 },
        { name: "AI Automations", pct: 45 },
        { name: "Building Agents", pct: 12 },
      ],
    },

    c8: {
      kicker: "Monetization",
      title: "Charge from day one.",
      subtitle:
        "Payments via SUMIT, Stripe, PayPal, Tranzila and Pelecard. Monthly, annual and lifetime subscriptions, coupons, affiliates, CRM, email and push — all in one place.",
      providersLabel: "Payment providers",
      providers: ["SUMIT", "Stripe", "PayPal", "Tranzila", "Pelecard"],
      items: [
        { n: 35, label: "CRM", desc: "Customer record, tags and full journey." },
        { n: 36, label: "Email marketing", desc: "Campaigns and email automations." },
        { n: 37, label: "Push", desc: "Smart notifications to the app." },
      ],
      planLabel: "Subscription plans",
      plans: [
        { name: "Monthly", price: "$49", cycle: "/mo" },
        { name: "Annual", price: "$490", cycle: "/yr" },
        { name: "Lifetime", price: "$1,290", cycle: "one-time" },
      ],
      couponLabel: "Active coupon",
      couponCode: "LAUNCH40",
      couponOff: "40% off",
      affiliateLabel: "Affiliate program",
      affiliateText: "Every affiliate gets a link, conversion tracking and automatic payouts.",
    },

    c9: {
      kicker: "Operations",
      title: "Calendar and live classes, in sync.",
      subtitle:
        "A full academy calendar — live classes, deadlines and drops — wired directly to Zoom, Google Meet and Teams. Learners always know what's next.",
      calendarTitle: "June 2026",
      weekdays: ["S", "M", "T", "W", "T", "F", "S"],
      events: [
        { day: 16, label: "Live class", tone: "live" },
        { day: 18, label: "Deadline", tone: "task" },
        { day: 22, label: "Drop", tone: "drop" },
        { day: 25, label: "Live class", tone: "live" },
      ],
      liveLabel: "On air now",
      liveTitle: "Live class · Build your first AI agent",
      liveStatus: "LIVE",
      liveAttendees: "128 learners connected",
      livePlatforms: ["Zoom", "Google Meet", "Teams"],
      liveCtaJoin: "Join the class",
    },

    c10: {
      kicker: "Platform & Developer",
      title: "Open. Mobile. Automated.",
      subtitle:
        "A developer API, webhooks for every event, an automation builder in the spirit of Make/Zapier, iOS and Android apps with offline downloads, and a marketplace for reach.",
      apiLabel: "Developer API",
      apiComment: "// Create a course enrollment via the API",
      apiCode: [
        [
          { kind: "kw", text: "const" },
          { kind: "plain", text: " res " },
          { kind: "kw", text: "=" },
          { kind: "plain", text: " " },
          { kind: "kw", text: "await" },
          { kind: "plain", text: " coursefocus." },
          { kind: "fn", text: "enroll" },
          { kind: "plain", text: "({" },
        ],
        [
          { kind: "plain", text: "  student: " },
          { kind: "str", text: '"stu_8f2a"' },
          { kind: "plain", text: "," },
        ],
        [
          { kind: "plain", text: "  course:  " },
          { kind: "str", text: '"crs_prompting"' },
          { kind: "plain", text: "," },
        ],
        [
          { kind: "plain", text: "  plan:    " },
          { kind: "str", text: '"subscription"' },
          { kind: "plain", text: "," },
        ],
        [{ kind: "plain", text: "});" }],
        [{ kind: "comment", text: "// → 201  enrollment.created ✓" }],
      ],
      webhookLabel: "Webhooks",
      webhooks: ["course.completed", "payment.succeeded", "student.joined"],
      automationLabel: "AI Automation Builder",
      automationTitle: "When a student completes a course →",
      nodes: [
        { label: "Trigger", sub: "course.completed" },
        { label: "Action", sub: "Grant badge + XP" },
        { label: "Action", sub: "Send a welcome email" },
      ],
      mobileLabel: "Mobile apps",
      mobileTitle: "The academy in your pocket",
      mobileFeatures: ["iOS · Android", "Offline downloads", "Smart push", "Full sync"],
      marketplaceLabel: "Marketplace",
      marketplaceText: "Expose your academy to a new audience through the CourseFocus marketplace.",
    },
  },
};

export default content;

import type { Locale } from "@/lib/i18n";

/**
 * HOME page content — typed bilingual model. The page reads content[locale].
 * Hebrew: warm, human, confident. English: crisp, global, declarative.
 * Terminology from BUILD_CONTRACT §8 glossary is used verbatim.
 */

export interface HomeContent {
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    sub: string;
    ctaBuild: string;
    ctaTour: string;
    stats: { value: number; suffix?: string; prefix?: string; label: string }[];
  };
  trust: {
    eyebrow: string;
    integrationsLabel: string;
    aiLabel: string;
  };
  reframe: {
    title: string;
    sub: string;
    tools: string[];
    osLabel: string;
    note: string;
  };
  academy: {
    title: string;
    sub: string;
    bullets: string[];
    panel: {
      title: string;
      nameLabel: string;
      nameValue: string;
      subdomainLabel: string;
      subdomainValue: string;
      brandLabel: string;
      langLabel: string;
      langValue: string;
      currencyLabel: string;
      currencyValue: string;
      tzLabel: string;
      tzValue: string;
      logoLabel: string;
      cta: string;
      building: string;
      ready: string;
    };
  };
  orbit: {
    title: string;
    sub: string;
    centerLabel: string;
    items: string[];
  };
  pillars: {
    title: string;
    sub: string;
    cards: {
      key: string;
      title: string;
      desc: string;
      href: string;
      tag: string;
    }[];
  };
  generator: {
    title: string;
    sub: string;
    promptLabel: string;
    prompt: string;
    generate: string;
    generating: string;
    steps: { label: string; detail: string }[];
    outlineTitle: string;
    modules: { title: string; lessons: string[] }[];
    quizLabel: string;
    quizItems: string[];
  };
  gamification: {
    title: string;
    sub: string;
    levelLabel: string;
    level: number;
    xpCurrent: number;
    xpNext: number;
    xpUnit: string;
    streakLabel: string;
    streakValue: string;
    badgesLabel: string;
    badges: { name: string; icon: string }[];
    leaderboardLabel: string;
    leaders: { name: string; xp: number }[];
    youLabel: string;
  };
  analytics: {
    title: string;
    sub: string;
    metrics: {
      key: string;
      label: string;
      value: number;
      prefix?: string;
      suffix?: string;
      decimals?: number;
      delta: string;
      up: boolean;
    }[];
    chartLabel: string;
    advisorLabel: string;
    advisorMessage: string;
    advisorAction: string;
  };
  platform: {
    title: string;
    sub: string;
    marketplace: { title: string; desc: string; items: string[] };
    mobile: { title: string; desc: string; appName: string; nav: string[]; lesson: string; progress: string };
    api: { title: string; desc: string; method: string; endpoint: string; code: string; caption: string };
  };
}

export const content: Record<Locale, HomeContent> = {
  he: {
    hero: {
      badge: "Academy OS · מערכת הפעלה לאקדמיות",
      title: "מערכת ההפעלה לאקדמיה",
      titleAccent: "הדיגיטלית שלך.",
      sub: "אקדמיה, קהילה ועסק מנויים — מנוהלים על ידי AI מרכזי אחד. בדקות, לא בחודשים.",
      ctaBuild: "בנה את האקדמיה שלך",
      ctaTour: "סיור במערכת",
      stats: [
        { value: 50, suffix: "+", label: "יכולות בפלטפורמה אחת" },
        { value: 1, label: "AI מרכזי שמנהל הכול" },
        { value: 100, suffix: "%", label: "לייבל לבן — המותג שלך" },
      ],
    },
    trust: {
      eyebrow: "מחובר לכל מה שאתה כבר משתמש בו",
      integrationsLabel: "תשלומים ושיעורים חיים",
      aiLabel: "מנועי AI נבחרים",
    },
    reframe: {
      title: "במקום שמונה כלים — מערכת הפעלה אחת.",
      sub: "הפסק לחבר בין פלטפורמת קורסים, קהילה, חיוב, CRM, אנליטיקה ואוטומציה. כולם מתמזגים לליבה אחת חכמה.",
      tools: [
        "קורסים",
        "קהילה",
        "חיוב ומנויים",
        "CRM",
        "אנליטיקה",
        "דיוור",
        "גיימיפיקציה",
        "אוטומציה",
      ],
      osLabel: "Academy OS",
      note: "אחד במקום שמונה — והכול מדבר אותה שפה.",
    },
    academy: {
      title: "אקדמיה ממותגת בלחיצה.",
      sub: "תן שם, צבע ולוגו — וקבל אקדמיה שלמה על הדומיין שלך. בלי קוד, בלי ספקים, בלי חודשי הקמה.",
      bullets: [
        "לייבל לבן מלא — אפס אזכור שלנו",
        "תת-דומיין או דומיין משלך",
        "שפה, מטבע ואזור זמן מקומיים",
        "מוכן לתשלומים מהרגע הראשון",
      ],
      panel: {
        title: "יצירת אקדמיה",
        nameLabel: "שם האקדמיה",
        nameValue: "אקדמיית הצמיחה",
        subdomainLabel: "כתובת",
        subdomainValue: "tzmicha",
        brandLabel: "צבע מותג",
        langLabel: "שפה",
        langValue: "עברית",
        currencyLabel: "מטבע",
        currencyValue: "₪ שקל",
        tzLabel: "אזור זמן",
        tzValue: "ירושלים",
        logoLabel: "לוגו",
        cta: "צור אקדמיה",
        building: "מקים את האקדמיה…",
        ready: "האקדמיה מוכנה ✦",
      },
    },
    orbit: {
      title: "AI אחד מנהל הכול.",
      sub: "במרכז האקדמיה יושב AI שבונה, מלמד, בודק, מייעץ ומפעיל. כל יכולת סובבת סביב ליבה חכמה אחת.",
      centerLabel: "Academy AI",
      items: [
        "בונה אקדמיה",
        "מחולל קורסים",
        "מעצב מסלולים",
        "מורה אישי",
        "בודק מטלות",
        "מחולל מבחנים",
        "מנהל קהילה",
        "יועץ עסקי",
        "מאמן צמיחה",
        "סטודיו תוכן",
      ],
    },
    pillars: {
      title: "שש מערכות. שלמות אחת.",
      sub: "כל עמוד תווך הוא עולם שלם — וכולם רצים יחד תחת ה-AI המרכזי.",
      cards: [
        { key: "build", title: "בנייה", desc: "קורסים, שיעורים ונגן וידאו מתקדם — חינמי עד VIP, עם דריפ ופתיחה לפי התקדמות.", href: "features", tag: "#5–7" },
        { key: "ai", title: "שכבת ה-AI", desc: "בונה, מלמד, בודק ומייעץ. מרובה מנועים: GPT, Claude, Gemini ועוד.", href: "ai", tag: "#2–13" },
        { key: "community", title: "קהילה", desc: "פיד, קבוצות, צ׳אט ומנהל קהילה AI ששומר על חיים ומעורבות.", href: "community", tag: "#15–18" },
        { key: "game", title: "גיימיפיקציה", desc: "XP, רמות 1–100, רצפים, תגים, טבלאות מובילים ואתגרים יומיים.", href: "community", tag: "#19–26" },
        { key: "money", title: "הכנסות", desc: "תשלומים, מנויים, קופונים, שותפים, CRM ודיוור — בתוך המערכת.", href: "pricing", tag: "#31–37" },
        { key: "platform", title: "פלטפורמה", desc: "אפליקציה, API, וובהוקים, אוטומציות ומרקטפלייס לצמיחה.", href: "features", tag: "#41–45" },
      ],
    },
    generator: {
      title: "מפרומפט אחד — קורס שלם.",
      sub: "תאר מה תרצה ללמד. ה-AI בונה מבנה, מודולים, שיעורים ומבחן — מוכנים לעריכה.",
      promptLabel: "פרומפט",
      prompt: "בנה קורס מתחילים לשיווק במייל לבעלי עסקים קטנים",
      generate: "חולל קורס",
      generating: "מחולל מבנה…",
      steps: [
        { label: "ניתוח קהל יעד", detail: "בעלי עסקים קטנים · רמת מתחילים" },
        { label: "בניית מסלול", detail: "מתחיל ← בינוני · 4 מודולים" },
        { label: "יצירת שיעורים", detail: "12 שיעורים · וידאו + טקסט" },
        { label: "מבחן וסיכום", detail: "8 שאלות · תעודה עם אימות QR" },
      ],
      outlineTitle: "שיווק במייל לעסקים קטנים",
      modules: [
        { title: "יסודות הרשימה", lessons: ["למה רשימת מייל מנצחת", "בניית טופס הרשמה", "מגנט לידים ראשון"] },
        { title: "כתיבה שממירה", lessons: ["נושא שנפתח", "מבנה מייל מוכר", "קריאה לפעולה"] },
        { title: "אוטומציה", lessons: ["רצף קבלת פנים", "פילוח קהל", "תזמון חכם"] },
        { title: "מדידה וצמיחה", lessons: ["שיעורי פתיחה והקלקה", "בדיקות A/B", "ניקוי רשימה"] },
      ],
      quizLabel: "מבחן מסכם",
      quizItems: ["מהו מגנט לידים?", "מה משפיע על שיעור פתיחה?", "מתי לשלוח רצף קבלת פנים?"],
    },
    gamification: {
      title: "למידה שמרגישה כמו התקדמות.",
      sub: "גיימיפיקציה אלגנטית — לא מגרש משחקים. XP, רמות, רצפים ותגים שמחזירים תלמידים שוב ושוב.",
      levelLabel: "רמה",
      level: 24,
      xpCurrent: 7820,
      xpNext: 9000,
      xpUnit: "XP",
      streakLabel: "רצף יומי",
      streakValue: "31 ימים",
      badgesLabel: "תגים אחרונים",
      badges: [
        { name: "מסיים ראשון", icon: "★" },
        { name: "רצף חודש", icon: "✦" },
        { name: "עזרה לקהילה", icon: "❖" },
        { name: "5 קורסים", icon: "◆" },
      ],
      leaderboardLabel: "טבלת מובילים · שבועי",
      leaders: [
        { name: "נועה ל.", xp: 9420 },
        { name: "דניאל מ.", xp: 8870 },
        { name: "את/ה", xp: 7820 },
        { name: "יעל ק.", xp: 7110 },
      ],
      youLabel: "את/ה",
    },
    analytics: {
      title: "אנליטיקה שמייעצת, לא רק מדווחת.",
      sub: "MRR, ARR, נטישה ו-LTV במקום אחד — ויועץ עסקי AI שאומר לך מה לעשות הלאה.",
      metrics: [
        { key: "mrr", label: "MRR", value: 48200, prefix: "₪", delta: "12.4%", up: true },
        { key: "arr", label: "ARR", value: 578400, prefix: "₪", delta: "11.0%", up: true },
        { key: "churn", label: "נטישה", value: 2.1, suffix: "%", decimals: 1, delta: "0.4%", up: false },
        { key: "ltv", label: "LTV", value: 3240, prefix: "₪", delta: "8.2%", up: true },
      ],
      chartLabel: "הכנסה חודשית · 12 חודשים",
      advisorLabel: "יועץ עסקי AI",
      advisorMessage: "הנטישה ירדה ל-2.1%. שלושה תלמידים ב-VIP לא נכנסו 9 ימים — שלח רצף החזרה אוטומטי ותחזיר כ-₪1,800 בחודש.",
      advisorAction: "הפעל רצף החזרה",
    },
    platform: {
      title: "מעבר לאקדמיה.",
      sub: "מרקטפלייס לצמיחה, אפליקציה לתלמידים שלך, ו-API לכל מי שרוצה לבנות מעבר.",
      marketplace: {
        title: "מרקטפלייס",
        desc: "חשוף את הקורסים שלך לקהל חדש והרווח מהפניות.",
        items: ["שיווק במייל", "בניית קהילה", "AI לעסקים", "עיצוב מותג"],
      },
      mobile: {
        title: "אפליקציה",
        desc: "iOS ו-Android, צפייה אופליין והורדות — בלייבל שלך.",
        appName: "האקדמיה שלי",
        nav: ["בית", "קורסים", "קהילה", "פרופיל"],
        lesson: "שיעור 4 · אוטומציה",
        progress: "68% הושלם",
      },
      api: {
        title: "API למפתחים",
        desc: "צור אקדמיות, רשום תלמידים והזרם אירועים — עם וובהוקים ואוטומציה.",
        method: "POST",
        endpoint: "/v1/academies",
        code: `curl -X POST https://api.coursefocus.ai/v1/academies \\
  -H "Authorization: Bearer $KEY" \\
  -d '{ "name": "Growth Academy",
        "locale": "he",
        "currency": "ILS" }'`,
        caption: "REST API · Webhooks · אוטומציות בסגנון Make/Zapier",
      },
    },
  },
  en: {
    hero: {
      badge: "Academy OS · the OS for academies",
      title: "The operating system for your",
      titleAccent: "digital academy.",
      sub: "An academy, a community, and a subscription business — run by one central AI. In minutes, not months.",
      ctaBuild: "Build your academy",
      ctaTour: "Take the tour",
      stats: [
        { value: 50, suffix: "+", label: "capabilities, one platform" },
        { value: 1, label: "central AI runs it all" },
        { value: 100, suffix: "%", label: "white-label — your brand" },
      ],
    },
    trust: {
      eyebrow: "Connected to everything you already use",
      integrationsLabel: "Payments & live classes",
      aiLabel: "Selectable AI engines",
    },
    reframe: {
      title: "Eight tools become one OS.",
      sub: "Stop wiring a course platform to a community to billing to a CRM to analytics to automation. They all collapse into one intelligent core.",
      tools: [
        "Courses",
        "Community",
        "Billing & subs",
        "CRM",
        "Analytics",
        "Email",
        "Gamification",
        "Automation",
      ],
      osLabel: "Academy OS",
      note: "One instead of eight — and everything speaks the same language.",
    },
    academy: {
      title: "A fully-branded academy in one click.",
      sub: "Give it a name, a color, and a logo — get a complete academy on your own domain. No code, no vendors, no months of setup.",
      bullets: [
        "Full white-label — zero mention of us",
        "Subdomain or your own domain",
        "Local language, currency & timezone",
        "Payment-ready from minute one",
      ],
      panel: {
        title: "Create academy",
        nameLabel: "Academy name",
        nameValue: "Growth Academy",
        subdomainLabel: "Address",
        subdomainValue: "growth",
        brandLabel: "Brand color",
        langLabel: "Language",
        langValue: "English",
        currencyLabel: "Currency",
        currencyValue: "$ USD",
        tzLabel: "Timezone",
        tzValue: "New York",
        logoLabel: "Logo",
        cta: "Create academy",
        building: "Provisioning academy…",
        ready: "Academy is live ✦",
      },
    },
    orbit: {
      title: "One AI runs everything.",
      sub: "At the center of the academy sits an AI that builds, teaches, reviews, advises, and operates. Every capability orbits one intelligent core.",
      centerLabel: "Academy AI",
      items: [
        "Academy Builder",
        "Course Generator",
        "Curriculum Designer",
        "Personal Tutor",
        "Assignment Reviewer",
        "Exam Generator",
        "Community Manager",
        "Business Advisor",
        "Growth Coach",
        "Content Studio",
      ],
    },
    pillars: {
      title: "Six systems. One whole.",
      sub: "Each pillar is a full world — and they all run together under one central AI.",
      cards: [
        { key: "build", title: "Build", desc: "Courses, lessons & an advanced video player — free to VIP, with drip and progress-based unlocking.", href: "features", tag: "#5–7" },
        { key: "ai", title: "AI Layer", desc: "Builds, teaches, reviews, advises. Multi-engine: GPT, Claude, Gemini and more.", href: "ai", tag: "#2–13" },
        { key: "community", title: "Community", desc: "Feed, groups, chat and an AI Community Manager that keeps engagement alive.", href: "community", tag: "#15–18" },
        { key: "game", title: "Gamification", desc: "XP, levels 1–100, streaks, badges, leaderboards and daily challenges.", href: "community", tag: "#19–26" },
        { key: "money", title: "Monetization", desc: "Payments, subscriptions, coupons, affiliates, CRM and email — built in.", href: "pricing", tag: "#31–37" },
        { key: "platform", title: "Platform", desc: "Mobile app, API, webhooks, automations and a marketplace for growth.", href: "features", tag: "#41–45" },
      ],
    },
    generator: {
      title: "One prompt → a full course.",
      sub: "Describe what you want to teach. The AI builds the structure, modules, lessons and an exam — ready to edit.",
      promptLabel: "Prompt",
      prompt: "Build a beginner email-marketing course for small business owners",
      generate: "Generate course",
      generating: "Generating structure…",
      steps: [
        { label: "Analyze audience", detail: "Small business owners · beginner level" },
        { label: "Design the path", detail: "Beginner → Intermediate · 4 modules" },
        { label: "Author lessons", detail: "12 lessons · video + text" },
        { label: "Exam & certificate", detail: "8 questions · QR-verified certificate" },
      ],
      outlineTitle: "Email Marketing for Small Business",
      modules: [
        { title: "List foundations", lessons: ["Why a list wins", "Build a signup form", "Your first lead magnet"] },
        { title: "Writing that converts", lessons: ["Subject lines that open", "A proven email frame", "The call to action"] },
        { title: "Automation", lessons: ["A welcome sequence", "Audience segmentation", "Smart scheduling"] },
        { title: "Measure & grow", lessons: ["Open & click rates", "A/B testing", "List hygiene"] },
      ],
      quizLabel: "Final exam",
      quizItems: ["What is a lead magnet?", "What drives open rate?", "When to send a welcome sequence?"],
    },
    gamification: {
      title: "Learning that feels like progress.",
      sub: "Elegant gamification — not a playground. XP, levels, streaks and badges that bring students back, again and again.",
      levelLabel: "Level",
      level: 24,
      xpCurrent: 7820,
      xpNext: 9000,
      xpUnit: "XP",
      streakLabel: "Daily streak",
      streakValue: "31 days",
      badgesLabel: "Recent badges",
      badges: [
        { name: "First finisher", icon: "★" },
        { name: "Month streak", icon: "✦" },
        { name: "Community help", icon: "❖" },
        { name: "5 courses", icon: "◆" },
      ],
      leaderboardLabel: "Leaderboard · weekly",
      leaders: [
        { name: "Noa L.", xp: 9420 },
        { name: "Daniel M.", xp: 8870 },
        { name: "You", xp: 7820 },
        { name: "Yael K.", xp: 7110 },
      ],
      youLabel: "You",
    },
    analytics: {
      title: "Analytics that advise, not just report.",
      sub: "MRR, ARR, churn and LTV in one place — with an AI Business Advisor that tells you what to do next.",
      metrics: [
        { key: "mrr", label: "MRR", value: 48200, prefix: "$", delta: "12.4%", up: true },
        { key: "arr", label: "ARR", value: 578400, prefix: "$", delta: "11.0%", up: true },
        { key: "churn", label: "Churn", value: 2.1, suffix: "%", decimals: 1, delta: "0.4%", up: false },
        { key: "ltv", label: "LTV", value: 3240, prefix: "$", delta: "8.2%", up: true },
      ],
      chartLabel: "Monthly revenue · 12 months",
      advisorLabel: "AI Business Advisor",
      advisorMessage: "Churn dropped to 2.1%. Three VIP students haven't logged in for 9 days — trigger an automated win-back sequence to recover roughly $480/mo.",
      advisorAction: "Run win-back sequence",
    },
    platform: {
      title: "Beyond the academy.",
      sub: "A marketplace for growth, an app for your students, and an API for anyone who wants to build further.",
      marketplace: {
        title: "Marketplace",
        desc: "Expose your courses to a new audience and earn from referrals.",
        items: ["Email marketing", "Community building", "AI for business", "Brand design"],
      },
      mobile: {
        title: "Mobile app",
        desc: "iOS and Android, offline viewing and downloads — in your brand.",
        appName: "My Academy",
        nav: ["Home", "Courses", "Community", "Profile"],
        lesson: "Lesson 4 · Automation",
        progress: "68% complete",
      },
      api: {
        title: "Developer API",
        desc: "Create academies, enroll students and stream events — with webhooks and automation.",
        method: "POST",
        endpoint: "/v1/academies",
        code: `curl -X POST https://api.coursefocus.ai/v1/academies \\
  -H "Authorization: Bearer $KEY" \\
  -d '{ "name": "Growth Academy",
        "locale": "en",
        "currency": "USD" }'`,
        caption: "REST API · Webhooks · Make/Zapier-style automations",
      },
    },
  },
};

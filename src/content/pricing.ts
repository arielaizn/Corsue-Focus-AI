import type { Locale } from "@/lib/i18n";

export type BillingCycle = "monthly" | "annual";

export interface TierCopy {
  /** stable id used as React key / logic flag */
  id: "starter" | "pro" | "scale" | "enterprise";
  name: string;
  tagline: string;
  /** null = custom (Enterprise). Numeric ILS/USD per month at monthly billing. */
  priceMonthly: number | null;
  /** per-month price when paying annually (2 months free → monthly*10/12). null = custom. */
  priceAnnual: number | null;
  /** label shown for the custom tier instead of a number */
  customLabel?: string;
  /** unit suffix, e.g. "/mo" */
  perUnit: string;
  /** short note under the price, e.g. billed annually */
  annualNote: string;
  /** primary capacity line, e.g. "Up to 50 students" */
  meta: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  /** the small ribbon on the recommended tier */
  ribbon?: string;
}

export interface ComparisonRow {
  label: string;
  /** one cell per tier in order starter/pro/scale/enterprise. true = check, false = dash, string = literal */
  values: (boolean | string)[];
}

export interface ComparisonGroup {
  group: string;
  rows: ComparisonRow[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PaymentProvider {
  name: string;
  /** short region/role caption */
  note: string;
}

export interface PricingContent {
  meta: { title: string; description: string };
  hero: {
    title: string;
    subtitle: string;
    /** small trust chips under the hero */
    chips: string[];
  };
  toggle: {
    monthly: string;
    annual: string;
    /** badge next to annual */
    annualBadge: string;
    /** currency symbol used for prices */
    currency: string;
  };
  indicativeNote: string;
  tiers: TierCopy[];
  /** mock dashboard panel labels (revenue card) */
  revenuePanel: {
    title: string;
    caption: string;
    mrrLabel: string;
    mrr: number;
    activeLabel: string;
    active: number;
    churnLabel: string;
    churn: string;
    months: string[];
  };
  lifetime: {
    title: string;
    body: string;
    bullets: string[];
    priceLabel: string;
    price: number;
    cta: string;
    badge: string;
  };
  growth: {
    coupons: {
      title: string;
      body: string;
      /** mock coupon code shown in the panel */
      code: string;
      codeNote: string;
    };
    affiliate: {
      title: string;
      body: string;
      /** mock affiliate stats */
      stats: { label: string; value: string }[];
    };
  };
  comparison: {
    title: string;
    subtitle: string;
    /** tier column heads, in order */
    columns: string[];
    groups: ComparisonGroup[];
    /** shown when a cell is a plain check / dash for screen readers */
    yes: string;
    no: string;
  };
  payments: {
    title: string;
    providers: PaymentProvider[];
  };
  faq: {
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
}

const he: PricingContent = {
  meta: {
    title: "תמחור — CourseFocus AI",
    description:
      "תוכניות פשוטות לאקדמיה דיגיטלית מלאה: קורסים, קהילה, מנויים ושכבת AI מרכזית. התחל בחינם, שדרג כשאתה גדל.",
  },
  hero: {
    title: "האקדמיה שלך. בבעלותך מהיום הראשון.",
    subtitle:
      "תמחור שקוף, בלי הפתעות. התחל בחינם, שלם רק כשאתה גדל, ושמור על המותג, הדומיין והתלמידים שלך — תמיד.",
    chips: ["14 יום ניסיון על Pro", "בלי כרטיס אשראי להתחלה", "ביטול בכל רגע"],
  },
  toggle: {
    monthly: "חודשי",
    annual: "שנתי",
    annualBadge: "חודשיים חינם",
    currency: "₪",
  },
  indicativeNote:
    "המחירים להמחשה בלבד וניתנים לעריכה. המספרים מוצגים לפני מע״מ.",
  tiers: [
    {
      id: "starter",
      name: "Starter",
      tagline: "לבדוק את הרעיון ולצאת לדרך.",
      priceMonthly: 0,
      priceAnnual: 0,
      perUnit: "",
      annualNote: "חינם, לתמיד.",
      meta: "אקדמיה אחת · עד 50 תלמידים",
      features: [
        "אקדמיה אחת מלאה",
        "קורסים וקהילה בסיסיים",
        "נגן וידאו מתקדם",
        "תגית CourseFocus באתר",
      ],
      cta: "התחל בחינם",
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "המנוע המלא ליוצר רציני.",
      priceMonthly: 199,
      priceAnnual: 166,
      perUnit: "/חודש",
      annualNote: "בחיוב שנתי · חודשיים חינם",
      meta: "לייבל לבן מלא · קורסים ללא הגבלה",
      features: [
        "לייבל לבן מלא + דומיין משלך",
        "קורסים ותלמידים ללא הגבלה",
        "שכבת ה-AI המלאה",
        "גיימיפיקציה מלאה (XP, רמות, תגים)",
        "סליקה ומנויים",
      ],
      cta: "בחר Pro",
      highlighted: true,
      ribbon: "הכי פופולרי",
    },
    {
      id: "scale",
      name: "Scale",
      tagline: "לכמה אקדמיות וצמיחה מהירה.",
      priceMonthly: 549,
      priceAnnual: 457,
      perUnit: "/חודש",
      annualNote: "בחיוב שנתי · חודשיים חינם",
      meta: "אקדמיות מרובות · אנליטיקה מתקדמת",
      features: [
        "כל מה שב-Pro, בלי תקרה",
        "אקדמיות מרובות תחת חשבון אחד",
        "אנליטיקה מתקדמת ואוטומציות",
        "API ותוכנית שותפים",
        "מודלי AI בעדיפות גבוהה",
      ],
      cta: "בחר Scale",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "לארגונים ואקדמיות בקנה מידה.",
      priceMonthly: null,
      priceAnnual: null,
      customLabel: "התאמה אישית",
      perUnit: "",
      annualNote: "תמחור לפי צורך",
      meta: "SSO · AI ייעודי · SLA",
      features: [
        "כל מה שב-Scale, בהתאמה מלאה",
        "התחברות SSO ארגונית",
        "מנוע AI ייעודי ומבודד",
        "אפליקציות מובייל ממותגות",
        "SLA ומנהל לקוח ייעודי",
      ],
      cta: "דברו איתנו",
    },
  ],
  revenuePanel: {
    title: "האקדמיה שלך, במספרים",
    caption: "תצוגה חיה · academy.coursefocus.ai",
    mrrLabel: "הכנסה חודשית",
    mrr: 48200,
    activeLabel: "מנויים פעילים",
    active: 312,
    churnLabel: "נטישה חודשית",
    churn: "2.1%",
    months: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני"],
  },
  lifetime: {
    title: "רישיון לכל החיים",
    body: "מעדיף תשלום אחד? קח גישה לכל החיים ל-Pro — בלי חיוב חוזר, עם כל העדכונים העתידיים.",
    bullets: [
      "תשלום חד-פעמי, גישה לתמיד",
      "כולל כל יכולות ה-Pro",
      "כל העדכונים העתידיים בלי תוספת",
    ],
    priceLabel: "תשלום חד-פעמי",
    price: 3990,
    cta: "קבל גישה לכל החיים",
    badge: "מהדורה מוגבלת",
  },
  growth: {
    coupons: {
      title: "קופונים שמזיזים מכירות",
      body: "צור קודי הנחה לקמפיינים, השקות ומבצעי עונה — באחוזים או בסכום קבוע, עם תאריך תפוגה ותקרת שימושים.",
      code: "LAUNCH40",
      codeNote: "40% הנחה · בתוקף עד סוף החודש",
    },
    affiliate: {
      title: "תוכנית שותפים מובנית",
      body: "תן לתלמידים ולמשפיענים להביא לך לקוחות. עמלות, מעקב לינקים ותשלומים — הכול בתוך המערכת.",
      stats: [
        { label: "שותפים פעילים", value: "128" },
        { label: "עמלה ממוצעת", value: "30%" },
        { label: "הכנסה מהפניות", value: "₪14.6K" },
      ],
    },
  },
  comparison: {
    title: "השוואת תוכניות מלאה",
    subtitle: "כל מה שכלול בכל תוכנית, בשורה אחת ברורה.",
    columns: ["Starter", "Pro", "Scale", "Enterprise"],
    yes: "כלול",
    no: "לא כלול",
    groups: [
      {
        group: "אקדמיה ומיתוג",
        rows: [
          { label: "אקדמיות", values: ["1", "1", "מרובות", "מרובות"] },
          { label: "תלמידים", values: ["עד 50", "ללא הגבלה", "ללא הגבלה", "ללא הגבלה"] },
          { label: "לייבל לבן ודומיין משלך", values: [false, true, true, true] },
          { label: "אפליקציות מובייל ממותגות", values: [false, false, true, true] },
        ],
      },
      {
        group: "שכבת ה-AI",
        rows: [
          { label: "בונה אקדמיה ומחולל קורסים", values: [false, true, true, true] },
          { label: "מורה אישי וסוקר מטלות", values: [false, true, true, true] },
          { label: "יועץ עסקי ומאמן צמיחה", values: [false, false, true, true] },
          { label: "מודלי AI בעדיפות גבוהה", values: [false, false, true, true] },
          { label: "מנוע AI ייעודי ומבודד", values: [false, false, false, true] },
        ],
      },
      {
        group: "מסחר וצמיחה",
        rows: [
          { label: "סליקה ומנויים", values: [false, true, true, true] },
          { label: "קופונים ותוכנית שותפים", values: [false, "בסיסי", true, true] },
          { label: "אנליטיקה מתקדמת ואוטומציות", values: [false, false, true, true] },
          { label: "גישת API ו-Webhooks", values: [false, false, true, true] },
        ],
      },
      {
        group: "תמיכה",
        rows: [
          { label: "תמיכת קהילה", values: [true, true, true, true] },
          { label: "תמיכה בעדיפות", values: [false, true, true, true] },
          { label: "SLA ומנהל לקוח ייעודי", values: [false, false, false, true] },
        ],
      },
    ],
  },
  payments: {
    title: "מקבל תשלומים מכל ספק מוביל",
    providers: [
      { name: "SUMIT", note: "חשבוניות ישראל" },
      { name: "Stripe", note: "גלובלי" },
      { name: "PayPal", note: "ארנק" },
      { name: "Tranzila", note: "סליקה ישראל" },
      { name: "Pelecard", note: "סליקה ישראל" },
    ],
  },
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שצריך לדעת לפני שמתחילים.",
    items: [
      {
        q: "אני באמת הבעלים של האקדמיה והתלמידים?",
        a: "כן. הדומיין שלך, המיתוג שלך, רשימת התלמידים והתוכן — הכול בבעלותך. אנחנו התשתית, לא המתווך. אפשר לייצא את הנתונים בכל רגע.",
      },
      {
        q: "מה זה אומר ׳חודשיים חינם׳ בחיוב שנתי?",
        a: "בחיוב שנתי אתה משלם על 10 חודשים ומקבל 12. זה בערך 17% הנחה לעומת חודשי, בלי שום תנאי נוסף.",
      },
      {
        q: "אפשר לעבור בין תוכניות?",
        a: "בכל רגע. שדרוג נכנס לתוקף מיד, והורדה נכנסת בסוף מחזור החיוב. בלי קנסות ובלי טפסים.",
      },
      {
        q: "מה קורה כשאני חורג מ-50 התלמידים ב-Starter?",
        a: "התלמידים הקיימים נשארים. כדי לצרף תלמידים חדשים מעבר לתקרה פשוט עוברים ל-Pro — בלחיצה, בלי לאבד נתונים.",
      },
      {
        q: "האם יש עמלה על מכירות?",
        a: "לא לוקחים אחוז מהמכירות שלך. אתה משלם מחיר תוכנית קבוע, וההכנסות הן כולן שלך (מעבר לעמלות ספק הסליקה).",
      },
      {
        q: "אילו אמצעי תשלום נתמכים?",
        a: "SUMIT, Stripe, PayPal, Tranzila ו-Pelecard — כולל חשבוניות ישראליות מלאות וסליקה מקומית.",
      },
    ],
  },
};

const en: PricingContent = {
  meta: {
    title: "Pricing — CourseFocus AI",
    description:
      "Simple plans for a complete digital academy: courses, community, subscriptions, and a central AI layer. Start free, upgrade as you grow.",
  },
  hero: {
    title: "Your academy. Yours from day one.",
    subtitle:
      "Transparent pricing, no surprises. Start free, pay only as you grow, and keep your brand, your domain, and your students — always.",
    chips: ["14-day Pro trial", "No card to start", "Cancel anytime"],
  },
  toggle: {
    monthly: "Monthly",
    annual: "Annual",
    annualBadge: "2 months free",
    currency: "$",
  },
  indicativeNote: "Prices are illustrative and editable. Figures shown exclude tax.",
  tiers: [
    {
      id: "starter",
      name: "Starter",
      tagline: "Test the idea and get going.",
      priceMonthly: 0,
      priceAnnual: 0,
      perUnit: "",
      annualNote: "Free, forever.",
      meta: "1 academy · up to 50 students",
      features: [
        "One full academy",
        "Core courses & community",
        "Advanced video player",
        "CourseFocus badge",
      ],
      cta: "Start free",
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "The full engine for serious creators.",
      priceMonthly: 49,
      priceAnnual: 41,
      perUnit: "/mo",
      annualNote: "billed annually · 2 months free",
      meta: "Full white-label · unlimited courses",
      features: [
        "Full white-label + your domain",
        "Unlimited courses & students",
        "The full AI suite",
        "Full gamification (XP, levels, badges)",
        "Payments & subscriptions",
      ],
      cta: "Choose Pro",
      highlighted: true,
      ribbon: "Most popular",
    },
    {
      id: "scale",
      name: "Scale",
      tagline: "Multiple academies, faster growth.",
      priceMonthly: 139,
      priceAnnual: 116,
      perUnit: "/mo",
      annualNote: "billed annually · 2 months free",
      meta: "Multiple academies · advanced analytics",
      features: [
        "Everything in Pro, uncapped",
        "Multiple academies, one account",
        "Advanced analytics & automations",
        "API & affiliate program",
        "Priority AI models",
      ],
      cta: "Choose Scale",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "For organizations and academies at scale.",
      priceMonthly: null,
      priceAnnual: null,
      customLabel: "Custom",
      perUnit: "",
      annualNote: "Priced to fit",
      meta: "SSO · dedicated AI · SLA",
      features: [
        "Everything in Scale, tailored",
        "Enterprise SSO",
        "Dedicated, isolated AI engine",
        "Branded mobile apps",
        "SLA & dedicated success manager",
      ],
      cta: "Talk to us",
    },
  ],
  revenuePanel: {
    title: "Your academy, in numbers",
    caption: "Live preview · academy.coursefocus.ai",
    mrrLabel: "Monthly revenue",
    mrr: 12060,
    activeLabel: "Active subscribers",
    active: 312,
    churnLabel: "Monthly churn",
    churn: "2.1%",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  lifetime: {
    title: "Lifetime license",
    body: "Prefer to pay once? Take lifetime access to Pro — no recurring charge, every future update included.",
    bullets: [
      "One-time payment, access forever",
      "Includes all Pro capabilities",
      "Every future update, no extra cost",
    ],
    priceLabel: "One-time payment",
    price: 999,
    cta: "Get lifetime access",
    badge: "Limited edition",
  },
  growth: {
    coupons: {
      title: "Coupons that move sales",
      body: "Create discount codes for campaigns, launches, and seasonal offers — percentage or fixed, with expiry dates and usage caps.",
      code: "LAUNCH40",
      codeNote: "40% off · valid to month end",
    },
    affiliate: {
      title: "A built-in affiliate program",
      body: "Let students and influencers bring you customers. Commissions, link tracking, and payouts — all inside the system.",
      stats: [
        { label: "Active affiliates", value: "128" },
        { label: "Avg. commission", value: "30%" },
        { label: "Referred revenue", value: "$4.2K" },
      ],
    },
  },
  comparison: {
    title: "Full plan comparison",
    subtitle: "Everything each plan includes, in one clear line.",
    columns: ["Starter", "Pro", "Scale", "Enterprise"],
    yes: "Included",
    no: "Not included",
    groups: [
      {
        group: "Academy & branding",
        rows: [
          { label: "Academies", values: ["1", "1", "Multiple", "Multiple"] },
          { label: "Students", values: ["Up to 50", "Unlimited", "Unlimited", "Unlimited"] },
          { label: "White-label & your domain", values: [false, true, true, true] },
          { label: "Branded mobile apps", values: [false, false, true, true] },
        ],
      },
      {
        group: "The AI layer",
        rows: [
          { label: "Academy Builder & Course Generator", values: [false, true, true, true] },
          { label: "Personal Tutor & Assignment Reviewer", values: [false, true, true, true] },
          { label: "Business Advisor & Growth Coach", values: [false, false, true, true] },
          { label: "Priority AI models", values: [false, false, true, true] },
          { label: "Dedicated, isolated AI engine", values: [false, false, false, true] },
        ],
      },
      {
        group: "Commerce & growth",
        rows: [
          { label: "Payments & subscriptions", values: [false, true, true, true] },
          { label: "Coupons & affiliate program", values: [false, "Basic", true, true] },
          { label: "Advanced analytics & automations", values: [false, false, true, true] },
          { label: "API access & webhooks", values: [false, false, true, true] },
        ],
      },
      {
        group: "Support",
        rows: [
          { label: "Community support", values: [true, true, true, true] },
          { label: "Priority support", values: [false, true, true, true] },
          { label: "SLA & dedicated success manager", values: [false, false, false, true] },
        ],
      },
    ],
  },
  payments: {
    title: "Take payments from every major provider",
    providers: [
      { name: "SUMIT", note: "IL invoicing" },
      { name: "Stripe", note: "Global" },
      { name: "PayPal", note: "Wallet" },
      { name: "Tranzila", note: "IL gateway" },
      { name: "Pelecard", note: "IL gateway" },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know before you start.",
    items: [
      {
        q: "Do I really own the academy and the students?",
        a: "Yes. Your domain, your branding, your student list, your content — all yours. We're the infrastructure, not the middleman. Export your data anytime.",
      },
      {
        q: "What does ‘2 months free’ on annual billing mean?",
        a: "On annual billing you pay for 10 months and get 12. That's roughly 17% off the monthly rate, with no extra conditions.",
      },
      {
        q: "Can I switch plans?",
        a: "Anytime. Upgrades take effect immediately; downgrades apply at the end of your billing cycle. No penalties, no forms.",
      },
      {
        q: "What happens when I pass 50 students on Starter?",
        a: "Existing students stay. To add new students beyond the cap, just move to Pro — one click, no data lost.",
      },
      {
        q: "Do you take a cut of my sales?",
        a: "We don't take a percentage of your sales. You pay a fixed plan price and keep your revenue (beyond your payment provider's fees).",
      },
      {
        q: "Which payment methods are supported?",
        a: "SUMIT, Stripe, PayPal, Tranzila, and Pelecard — including full Israeli invoicing and local gateways.",
      },
    ],
  },
};

export const content: Record<Locale, PricingContent> = { he, en };

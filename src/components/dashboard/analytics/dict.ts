import type { Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   Bilingual strings local to the ANALYTICS feature. Kept here (not in the
   shared app-dictionary, which is owned by the foundation) per ownership rules.
--------------------------------------------------------------------------- */

export interface AnalyticsDict {
  index: {
    title: string;
    subtitle: string;
    noAcademyTitle: string;
    noAcademyBody: string;
    noAcademyCta: string;
    notAuthorizedTitle: string;
    notAuthorizedBody: string;
  };
  stats: {
    students: string;
    studentsHint: string;
    completionRate: string;
    completionHint: string;
    revenue: string;
    revenueHint: string;
    enrollments: string;
    enrollmentsHint: string;
  };
  trends: {
    revenueTitle: string;
    revenueSub: string;
    enrollmentsTitle: string;
    enrollmentsSub: string;
    topCoursesTitle: string;
    topCoursesSub: string;
    empty: string;
    enrolledUnit: string;
  };
  advisor: {
    label: string;
    sub: string;
    intro: string;
    placeholder: string;
    ask: string;
    asking: string;
    again: string;
    disabledTitle: string;
    disabledBody: string;
    footnote: string;
    error: string;
    presets: string[];
  };
  /** Month abbreviations indexed 1..12 (index 0 unused). */
  monthsShort: string[];
}

export const analyticsDict: Record<Locale, AnalyticsDict> = {
  he: {
    index: {
      title: "אנליטיקה",
      subtitle:
        "המספרים האמיתיים של האקדמיה — תלמידים, השלמות, הכנסות ומגמות — עם יועץ עסקי AI.",
      noAcademyTitle: "צריך אקדמיה קודם",
      noAcademyBody:
        "כדי לראות אנליטיקה צריך תחילה אקדמיה. צור אחת ותחזור לכאן.",
      noAcademyCta: "צור אקדמיה",
      notAuthorizedTitle: "אין לך הרשאה",
      notAuthorizedBody:
        "האנליטיקה זמינה לבעלים ולמנהלי האקדמיה בלבד. פנה לבעל האקדמיה כדי לקבל גישה.",
    },
    stats: {
      students: "תלמידים",
      studentsHint: "פעילים מתוך הכלל",
      completionRate: "שיעור השלמה",
      completionHint: "מתוך כלל ההרשמות",
      revenue: "הכנסות",
      revenueHint: "כל הזמן · תשלומים שאושרו",
      enrollments: "הרשמות",
      enrollmentsHint: "סך הכל לקורסים",
    },
    trends: {
      revenueTitle: "הכנסות לפי חודש",
      revenueSub: "ששת החודשים האחרונים — תשלומים שאושרו.",
      enrollmentsTitle: "הרשמות לפי חודש",
      enrollmentsSub: "קצב ההרשמה לאורך זמן.",
      topCoursesTitle: "הקורסים המובילים",
      topCoursesSub: "לפי מספר הנרשמים.",
      empty: "אין עדיין נתונים להצגה.",
      enrolledUnit: "נרשמו",
    },
    advisor: {
      label: "יועץ עסקי AI",
      sub: "מנתח את הנתונים האמיתיים של האקדמיה שלך",
      intro:
        "שאל שאלה עסקית — צמיחה, תמחור, שימור או המרה — והיועץ ינתח את המספרים האמיתיים שלך וייתן המלצה ממוקדת.",
      placeholder:
        "לדוגמה: איך להעלות את שיעור ההשלמה ולהגדיל הכנסה חוזרת?",
      ask: "קבל המלצה",
      asking: "מנתח את הנתונים…",
      again: "שאל שוב",
      disabledTitle: "היועץ אינו זמין",
      disabledBody:
        "כדי להפעיל את היועץ העסקי, הגדר מפתח ANTHROPIC_API_KEY בשרת.",
      footnote: "ההמלצות מבוססות על נתוני האקדמיה שלך בלבד.",
      error: "משהו השתבש בניתוח. נסה שוב.",
      presets: [
        "איפה ההזדמנות הכי גדולה לצמיחה?",
        "איך לשפר את שיעור ההשלמה?",
        "מה לתמחר אחרת כדי להגדיל הכנסה?",
      ],
    },
    monthsShort: [
      "",
      "ינו",
      "פבר",
      "מרץ",
      "אפר",
      "מאי",
      "יונ",
      "יול",
      "אוג",
      "ספט",
      "אוק",
      "נוב",
      "דצמ",
    ],
  },
  en: {
    index: {
      title: "Analytics",
      subtitle:
        "Your academy's real numbers — students, completions, revenue, and trends — with an AI business advisor.",
      noAcademyTitle: "Create an academy first",
      noAcademyBody:
        "You need an academy before you can see analytics. Create one and come back here.",
      noAcademyCta: "Create academy",
      notAuthorizedTitle: "You don't have access",
      notAuthorizedBody:
        "Analytics is available to academy owners and admins only. Ask the academy owner for access.",
    },
    stats: {
      students: "Students",
      studentsHint: "active of total",
      completionRate: "Completion rate",
      completionHint: "of all enrollments",
      revenue: "Revenue",
      revenueHint: "lifetime · succeeded payments",
      enrollments: "Enrollments",
      enrollmentsHint: "across all courses",
    },
    trends: {
      revenueTitle: "Revenue by month",
      revenueSub: "Last six months — succeeded payments.",
      enrollmentsTitle: "Enrollments by month",
      enrollmentsSub: "Enrollment pace over time.",
      topCoursesTitle: "Top courses",
      topCoursesSub: "By number of enrollments.",
      empty: "No data to show yet.",
      enrolledUnit: "enrolled",
    },
    advisor: {
      label: "AI Business Advisor",
      sub: "Analyzing your academy's real data",
      intro:
        "Ask a business question — growth, pricing, retention, or conversion — and the advisor analyzes your real numbers and gives a focused recommendation.",
      placeholder:
        "e.g. How do I lift completion rate and grow recurring revenue?",
      ask: "Get recommendation",
      asking: "Analyzing your data…",
      again: "Ask again",
      disabledTitle: "Advisor unavailable",
      disabledBody:
        "To enable the business advisor, set an ANTHROPIC_API_KEY on the server.",
      footnote: "Recommendations are based only on your academy's data.",
      error: "Something went wrong analyzing. Please try again.",
      presets: [
        "Where is my biggest growth opportunity?",
        "How can I improve completion rate?",
        "What should I price differently to grow revenue?",
      ],
    },
    monthsShort: [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
};

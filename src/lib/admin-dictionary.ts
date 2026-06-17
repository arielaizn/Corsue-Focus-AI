import type { Locale } from "./i18n";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN dictionary — strings for the /[locale]/admin/** surface
   that oversees ALL academies/users. Kept separate from app-dictionary.ts
   (academy dashboard) and dictionary.ts (marketing) so the three surfaces
   never collide. Fully bilingual he (default, RTL) + en (LTR).
--------------------------------------------------------------------------- */

export type AdminDict = {
  nav: {
    overview: string;
    academies: string;
    users: string;
    moderation: string;
    system: string;
    billing: string;
  };
  shell: {
    platform: string;
    backToApp: string;
    signOut: string;
    account: string;
  };
  overview: {
    title: string;
    subtitle: string;
    academies: string;
    users: string;
    courses: string;
    enrollments: string;
    revenue: string;
    admins: string;
    reports: string;
  };
  academies: {
    title: string;
    search: string;
    status: string;
    active: string;
    suspended: string;
    owner: string;
    members: string;
    courses: string;
    created: string;
    suspend: string;
    reinstate: string;
    inspect: string;
    confirmSuspend: string;
    none: string;
  };
  users: {
    title: string;
    search: string;
    joined: string;
    academies: string;
    admin: string;
    grantAdmin: string;
    revokeAdmin: string;
    you: string;
    lastAdmin: string;
    none: string;
  };
  moderation: {
    title: string;
    open: string;
    reviewing: string;
    resolved: string;
    reason: string;
    reporter: string;
    entity: string;
    post: string;
    comment: string;
    viewContent: string;
    removeContent: string;
    dismiss: string;
    markActioned: string;
    none: string;
    empty: string;
  };
  system: {
    title: string;
    plans: string;
    activeSubs: string;
    aiUsage: string;
    tokens: string;
    featureFlags: string;
    none: string;
  };
  billing: {
    title: string;
    mrr: string;
    totalRevenue: string;
    byAcademy: string;
    recentPayments: string;
    amount: string;
    status: string;
    paidAt: string;
    none: string;
  };
  common: {
    back: string;
    loading: string;
    confirm: string;
    cancel: string;
    saved: string;
  };
  errors: {
    generic: string;
    notAllowed: string;
    lastAdmin: string;
  };
};

export const adminDict: Record<Locale, AdminDict> = {
  he: {
    nav: {
      overview: "סקירה",
      academies: "אקדמיות",
      users: "משתמשים",
      moderation: "ניהול תוכן",
      system: "מערכת",
      billing: "חיובים",
    },
    shell: {
      platform: "פלטפורמה",
      backToApp: "חזרה לאפליקציה",
      signOut: "התנתקות",
      account: "החשבון שלי",
    },
    overview: {
      title: "מרכז הבקרה של הפלטפורמה",
      subtitle: "פיקוח על כלל האקדמיות, המשתמשים וההכנסות בפלטפורמה.",
      academies: "אקדמיות",
      users: "משתמשים",
      courses: "קורסים",
      enrollments: "הרשמות",
      revenue: "הכנסות",
      admins: "מנהלי פלטפורמה",
      reports: "דיווחים פתוחים",
    },
    academies: {
      title: "אקדמיות",
      search: "חיפוש לפי שם או כתובת…",
      status: "סטטוס",
      active: "פעילה",
      suspended: "מושעית",
      owner: "בעלים",
      members: "חברים",
      courses: "קורסים",
      created: "נוצרה",
      suspend: "השעיה",
      reinstate: "החזרה לפעילות",
      inspect: "בדיקה",
      confirmSuspend: "להשעות את האקדמיה? היא תוסתר מכלל המשתמשים.",
      none: "לא נמצאו אקדמיות.",
    },
    users: {
      title: "משתמשים",
      search: "חיפוש לפי דוא״ל או שם…",
      joined: "הצטרף",
      academies: "אקדמיות",
      admin: "מנהל פלטפורמה",
      grantAdmin: "הענקת הרשאת מנהל",
      revokeAdmin: "ביטול הרשאת מנהל",
      you: "אתה",
      lastAdmin: "המנהל האחרון",
      none: "לא נמצאו משתמשים.",
    },
    moderation: {
      title: "ניהול תוכן",
      open: "פתוח",
      reviewing: "בבדיקה",
      resolved: "טופל",
      reason: "סיבה",
      reporter: "מדווח",
      entity: "פריט",
      post: "פוסט",
      comment: "תגובה",
      viewContent: "צפייה בתוכן",
      removeContent: "הסרת תוכן",
      dismiss: "דחיית הדיווח",
      markActioned: "סימון כטופל",
      none: "אין דיווחים.",
      empty: "תור ניהול התוכן ריק — הכול נקי.",
    },
    system: {
      title: "מערכת",
      plans: "תוכניות",
      activeSubs: "מנויים פעילים",
      aiUsage: "שימוש ב-AI",
      tokens: "טוקנים",
      featureFlags: "דגלי תכונות",
      none: "אין נתונים.",
    },
    billing: {
      title: "חיובים",
      mrr: "הכנסה חודשית חוזרת",
      totalRevenue: "סך ההכנסות",
      byAcademy: "לפי אקדמיה",
      recentPayments: "תשלומים אחרונים",
      amount: "סכום",
      status: "סטטוס",
      paidAt: "שולם",
      none: "אין תשלומים.",
    },
    common: {
      back: "חזרה",
      loading: "טוען…",
      confirm: "אישור",
      cancel: "ביטול",
      saved: "נשמר",
    },
    errors: {
      generic: "משהו השתבש. נסה שוב.",
      notAllowed: "אין לך הרשאה לפעולה זו.",
      lastAdmin: "לא ניתן להסיר את מנהל הפלטפורמה האחרון.",
    },
  },
  en: {
    nav: {
      overview: "Overview",
      academies: "Academies",
      users: "Users",
      moderation: "Moderation",
      system: "System",
      billing: "Billing",
    },
    shell: {
      platform: "Platform",
      backToApp: "Back to app",
      signOut: "Sign out",
      account: "Account",
    },
    overview: {
      title: "Platform control room",
      subtitle: "Oversight of every academy, user, and revenue stream on the platform.",
      academies: "Academies",
      users: "Users",
      courses: "Courses",
      enrollments: "Enrollments",
      revenue: "Revenue",
      admins: "Platform admins",
      reports: "Open reports",
    },
    academies: {
      title: "Academies",
      search: "Search by name or slug…",
      status: "Status",
      active: "Active",
      suspended: "Suspended",
      owner: "Owner",
      members: "Members",
      courses: "Courses",
      created: "Created",
      suspend: "Suspend",
      reinstate: "Reinstate",
      inspect: "Inspect",
      confirmSuspend: "Suspend this academy? It will be hidden from all users.",
      none: "No academies found.",
    },
    users: {
      title: "Users",
      search: "Search by email or name…",
      joined: "Joined",
      academies: "Academies",
      admin: "Platform admin",
      grantAdmin: "Grant admin",
      revokeAdmin: "Revoke admin",
      you: "You",
      lastAdmin: "Last admin",
      none: "No users found.",
    },
    moderation: {
      title: "Moderation",
      open: "Open",
      reviewing: "Reviewing",
      resolved: "Resolved",
      reason: "Reason",
      reporter: "Reporter",
      entity: "Item",
      post: "Post",
      comment: "Comment",
      viewContent: "View content",
      removeContent: "Remove content",
      dismiss: "Dismiss report",
      markActioned: "Mark actioned",
      none: "No reports.",
      empty: "Moderation queue is empty — all clear.",
    },
    system: {
      title: "System",
      plans: "Plans",
      activeSubs: "Active subscriptions",
      aiUsage: "AI usage",
      tokens: "Tokens",
      featureFlags: "Feature flags",
      none: "No data.",
    },
    billing: {
      title: "Billing",
      mrr: "Monthly recurring revenue",
      totalRevenue: "Total revenue",
      byAcademy: "By academy",
      recentPayments: "Recent payments",
      amount: "Amount",
      status: "Status",
      paidAt: "Paid at",
      none: "No payments.",
    },
    common: {
      back: "Back",
      loading: "Loading…",
      confirm: "Confirm",
      cancel: "Cancel",
      saved: "Saved",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      notAllowed: "You are not allowed to do that.",
      lastAdmin: "You cannot remove the last platform admin.",
    },
  },
};

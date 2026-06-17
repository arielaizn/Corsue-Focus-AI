import type { Locale } from "./i18n";

/**
 * Bilingual strings for the authenticated app (auth screens + dashboard).
 * Marketing chrome strings live in src/lib/dictionary.ts — kept separate so
 * the two surfaces never collide.
 */

export interface AppDict {
  auth: {
    brandKicker: string;
    welcome: string;
    welcomeSub: string;
    signupLead: string;
    signupSub: string;
    email: string;
    password: string;
    name: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    signIn: string;
    signUp: string;
    signingIn: string;
    creating: string;
    orContinue: string;
    google: string;
    apple: string;
    forgotPassword: string;
    magicLink: string;
    magicLinkSent: string;
    usePassword: string;
    useMagicLink: string;
    noAccount: string;
    haveAccount: string;
    toSignup: string;
    toLogin: string;
    backToSite: string;
    pillars: { title: string; body: string }[];
    errors: {
      generic: string;
      invalid: string;
      googleUnconfigured: string;
      appleUnconfigured: string;
      emailRequired: string;
    };
  };
  nav: {
    overview: string;
    academy: string;
    courses: string;
    analytics: string;
    grading: string;
    community: string;
    students: string;
    settings: string;
  };
  shell: {
    signOut: string;
    switchAcademy: string;
    yourAcademies: string;
    account: string;
    backToSite: string;
    noAcademy: string;
    openMenu: string;
    closeMenu: string;
    skipToContent: string;
  };
  dashboard: {
    greetingMorning: string;
    greetingDay: string;
    greetingEvening: string;
    overviewSub: string;
    stats: {
      courses: string;
      lessons: string;
      students: string;
      members: string;
    };
    createTitle: string;
    createBody: string;
    createCta: string;
    rolePrefix: string;
    quickLinks: string;
    manageCourses: string;
    manageCommunity: string;
    manageStudents: string;
  };
  stubs: {
    community: { title: string; body: string };
    students: { title: string; body: string };
    settings: { title: string; body: string };
    academy: { title: string; body: string };
    soon: string;
  };
  roles: Record<"owner" | "admin" | "instructor" | "student", string>;
}

export const appDictionary: Record<Locale, AppDict> = {
  he: {
    auth: {
      brandKicker: "מערכת ההפעלה לאקדמיה",
      welcome: "ברוך שובך",
      welcomeSub: "התחבר כדי לנהל את האקדמיה, הקהילה והמנויים שלך.",
      signupLead: "בנה את האקדמיה שלך",
      signupSub: "צור חשבון והקם אקדמיה דיגיטלית בדקות.",
      email: "אימייל",
      password: "סיסמה",
      name: "שם מלא",
      namePlaceholder: "ישראל ישראלי",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "לפחות 8 תווים",
      signIn: "התחברות",
      signUp: "יצירת חשבון",
      signingIn: "מתחבר…",
      creating: "יוצר חשבון…",
      orContinue: "או המשך עם",
      google: "המשך עם Google",
      apple: "המשך עם Apple",
      forgotPassword: "שכחת סיסמה?",
      magicLink: "שלח לי קישור קסם",
      magicLinkSent: "שלחנו קישור התחברות לאימייל שלך. בדוק את תיבת הדואר.",
      usePassword: "התחברות עם סיסמה",
      useMagicLink: "התחברות עם קישור קסם",
      noAccount: "אין לך חשבון?",
      haveAccount: "כבר יש לך חשבון?",
      toSignup: "הרשמה",
      toLogin: "התחברות",
      backToSite: "חזרה לאתר",
      pillars: [
        {
          title: "AI מרכזי אחד",
          body: "בונה קורסים, מנהל קהילה ומייעץ עסקית — מתוך מרכז אחד.",
        },
        {
          title: "קורסים, קהילה ומנויים",
          body: "כל מה שאקדמיה צריכה, מאוחד במערכת אחת מעוצבת.",
        },
        {
          title: "בדקות, לא בחודשים",
          body: "מהרעיון לאקדמיה חיה — מהר, יוקרתי, מותג שלך.",
        },
      ],
      errors: {
        generic: "משהו השתבש. נסה שוב.",
        invalid: "אימייל או סיסמה שגויים.",
        googleUnconfigured:
          "התחברות עם Google עדיין לא מופעלת. השתמש באימייל וסיסמה או בקישור קסם.",
        appleUnconfigured:
          "התחברות עם Apple עדיין לא מופעלת. השתמש באימייל וסיסמה או בקישור קסם.",
        emailRequired: "נא להזין כתובת אימייל תקינה.",
      },
    },
    nav: {
      overview: "סקירה",
      academy: "אקדמיה",
      courses: "קורסים",
      analytics: "אנליטיקס",
      grading: "בדיקת מטלות",
      community: "קהילה",
      students: "תלמידים",
      settings: "הגדרות",
    },
    shell: {
      signOut: "התנתקות",
      switchAcademy: "החלף אקדמיה",
      yourAcademies: "האקדמיות שלך",
      account: "החשבון שלי",
      backToSite: "לאתר השיווקי",
      noAcademy: "אין אקדמיה",
      openMenu: "פתח תפריט",
      closeMenu: "סגור תפריט",
      skipToContent: "דלג לתוכן הראשי",
    },
    dashboard: {
      greetingMorning: "בוקר טוב",
      greetingDay: "צהריים טובים",
      greetingEvening: "ערב טוב",
      overviewSub: "מבט-על על האקדמיה שלך.",
      stats: {
        courses: "קורסים",
        lessons: "שיעורים",
        students: "תלמידים",
        members: "חברי צוות",
      },
      createTitle: "הקם את האקדמיה הראשונה שלך",
      createBody:
        "עדיין אין לך אקדמיה. צור אחת והתחל לבנות קורסים, קהילה ומנויים — בניהול AI מרכזי.",
      createCta: "צור אקדמיה",
      rolePrefix: "התפקיד שלך",
      quickLinks: "קיצורי דרך",
      manageCourses: "נהל קורסים",
      manageCommunity: "נהל קהילה",
      manageStudents: "נהל תלמידים",
    },
    stubs: {
      community: {
        title: "קהילה",
        body: "פיד, קבוצות, הודעות וגיימיפיקציה — מנוהלים על ידי ה-AID המרכזי.",
      },
      students: {
        title: "תלמידים",
        body: "כל התלמידים, ההרשמות וההתקדמות שלהם במקום אחד.",
      },
      settings: {
        title: "הגדרות",
        body: "מיתוג, דומיין, שפה, מטבע ואזור זמן של האקדמיה.",
      },
      academy: {
        title: "אקדמיה",
        body: "פרטי האקדמיה, המיתוג והקטגוריות שלך.",
      },
      soon: "בקרוב",
    },
    roles: {
      owner: "בעלים",
      admin: "מנהל",
      instructor: "מדריך",
      student: "תלמיד",
    },
  },
  en: {
    auth: {
      brandKicker: "The academy operating system",
      welcome: "Welcome back",
      welcomeSub: "Sign in to run your academy, community, and subscriptions.",
      signupLead: "Build your academy",
      signupSub: "Create an account and launch a digital academy in minutes.",
      email: "Email",
      password: "Password",
      name: "Full name",
      namePlaceholder: "Jane Doe",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "At least 8 characters",
      signIn: "Sign in",
      signUp: "Create account",
      signingIn: "Signing in…",
      creating: "Creating account…",
      orContinue: "or continue with",
      google: "Continue with Google",
      apple: "Continue with Apple",
      forgotPassword: "Forgot password?",
      magicLink: "Send me a magic link",
      magicLinkSent: "We sent a sign-in link to your email. Check your inbox.",
      usePassword: "Sign in with password",
      useMagicLink: "Sign in with a magic link",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      toSignup: "Sign up",
      toLogin: "Sign in",
      backToSite: "Back to site",
      pillars: [
        {
          title: "One central AI",
          body: "Builds courses, runs the community, and advises the business — from one core.",
        },
        {
          title: "Courses, community & subscriptions",
          body: "Everything an academy needs, unified in one designed system.",
        },
        {
          title: "Minutes, not months",
          body: "From idea to a live academy — fast, premium, fully your brand.",
        },
      ],
      errors: {
        generic: "Something went wrong. Please try again.",
        invalid: "Invalid email or password.",
        googleUnconfigured:
          "Google sign-in isn't enabled yet. Use email + password or a magic link.",
        appleUnconfigured:
          "Apple sign-in isn't enabled yet. Use email + password or a magic link.",
        emailRequired: "Please enter a valid email address.",
      },
    },
    nav: {
      overview: "Overview",
      academy: "Academy",
      courses: "Courses",
      analytics: "Analytics",
      grading: "Grading",
      community: "Community",
      students: "Students",
      settings: "Settings",
    },
    shell: {
      signOut: "Sign out",
      switchAcademy: "Switch academy",
      yourAcademies: "Your academies",
      account: "Account",
      backToSite: "Marketing site",
      noAcademy: "No academy",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      skipToContent: "Skip to main content",
    },
    dashboard: {
      greetingMorning: "Good morning",
      greetingDay: "Good afternoon",
      greetingEvening: "Good evening",
      overviewSub: "A calm overview of your academy.",
      stats: {
        courses: "Courses",
        lessons: "Lessons",
        students: "Students",
        members: "Team members",
      },
      createTitle: "Create your first academy",
      createBody:
        "You don't own an academy yet. Create one to start building courses, community, and subscriptions — run by one central AI.",
      createCta: "Create academy",
      rolePrefix: "Your role",
      quickLinks: "Quick links",
      manageCourses: "Manage courses",
      manageCommunity: "Manage community",
      manageStudents: "Manage students",
    },
    stubs: {
      community: {
        title: "Community",
        body: "Feed, groups, messaging, and gamification — orchestrated by the central AI.",
      },
      students: {
        title: "Students",
        body: "Every student, enrollment, and their progress in one place.",
      },
      settings: {
        title: "Settings",
        body: "Branding, domain, language, currency, and timezone for your academy.",
      },
      academy: {
        title: "Academy",
        body: "Your academy details, branding, and categories.",
      },
      soon: "Coming soon",
    },
    roles: {
      owner: "Owner",
      admin: "Admin",
      instructor: "Instructor",
      student: "Student",
    },
  },
};

export function greetingFor(locale: Locale, hour: number): string {
  const d = appDictionary[locale].dashboard;
  if (hour < 12) return d.greetingMorning;
  if (hour < 18) return d.greetingDay;
  return d.greetingEvening;
}

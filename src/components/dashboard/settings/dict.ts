import type { Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   Bilingual strings local to the SETTINGS feature (account + danger zone).
   Kept here (not in the shared app-dictionary, owned by the foundation) per
   ownership rules — mirrors components/dashboard/courses/dictionary.ts.
--------------------------------------------------------------------------- */

export interface SettingsDict {
  page: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  account: {
    title: string;
    hint: string;
    avatarLabel: string;
    avatarHint: string;
    displayName: string;
    displayNamePlaceholder: string;
    bio: string;
    bioPlaceholder: string;
    locale: string;
    localeNames: Record<Locale, string>;
    timezone: string;
    website: string;
    websitePlaceholder: string;
    publicLabel: string;
    publicHint: string;
    save: string;
    saving: string;
    saved: string;
  };
  quickLinks: {
    title: string;
    hint: string;
    branding: string;
    brandingDesc: string;
    team: string;
    teamDesc: string;
  };
  danger: {
    title: string;
    hint: string;
    warning: string;
    confirmLabel: string;
    confirmPlaceholder: (name: string) => string;
    delete: string;
    deleting: string;
    deleted: string;
    note: string;
  };
  errors: {
    generic: string;
    notSignedIn: string;
    nameRequired: string;
    notOwner: string;
    confirmMismatch: string;
  };
}

export const settingsDict: Record<Locale, SettingsDict> = {
  he: {
    page: {
      kicker: "הגדרות",
      title: "החשבון שלי",
      subtitle: "נהל את הפרופיל האישי, ההעדפות והאזור המסוכן של האקדמיה.",
    },
    account: {
      title: "פרופיל אישי",
      hint: "פרטים אלו שייכים לחשבון שלך ומופיעים בכל האקדמיות.",
      avatarLabel: "תמונת פרופיל",
      avatarHint: "העלה תמונה או הדבק כתובת. רצוי ריבועית, עד 50MB.",
      displayName: "שם תצוגה",
      displayNamePlaceholder: "לדוגמה: דנה כהן",
      bio: "אודות",
      bioPlaceholder: "כמה מילים עליך (אופציונלי).",
      locale: "שפה",
      localeNames: { he: "עברית", en: "English" },
      timezone: "אזור זמן",
      website: "אתר אינטרנט",
      websitePlaceholder: "https://…",
      publicLabel: "פרופיל ציבורי",
      publicHint: "אפשר לתלמידים לראות את הפרופיל שלך בקהילה ובדירוגים.",
      save: "שמור שינויים",
      saving: "שומר…",
      saved: "הפרופיל נשמר",
    },
    quickLinks: {
      title: "הגדרות נוספות",
      hint: "מיתוג, צוות ותלמידים מנוהלים בעמודים ייעודיים.",
      branding: "מיתוג האקדמיה",
      brandingDesc: "שם, כתובת, צבעים, שפה ומטבע.",
      team: "צוות ותלמידים",
      teamDesc: "ניהול חברים, הרשאות והזמנות.",
    },
    danger: {
      title: "אזור מסוכן",
      hint: "פעולות בלתי הפיכות. רק הבעלים יכול לבצע אותן.",
      warning:
        "מחיקת האקדמיה מסתירה אותה ואת כל התוכן שלה. תלמידים יאבדו גישה. כדי לאשר, הקלד את שם האקדמיה במדויק.",
      confirmLabel: "אשר את שם האקדמיה",
      confirmPlaceholder: (name) => name,
      delete: "מחק את האקדמיה",
      deleting: "מוחק…",
      deleted: "האקדמיה נמחקה.",
      note: "רק הבעלים רואה את האזור הזה.",
    },
    errors: {
      generic: "משהו השתבש. נסה שוב.",
      notSignedIn: "צריך להתחבר מחדש.",
      nameRequired: "נא להזין שם תצוגה.",
      notOwner: "רק הבעלים יכול למחוק את האקדמיה.",
      confirmMismatch: "השם שהוקלד אינו תואם. לא בוצעה מחיקה.",
    },
  },
  en: {
    page: {
      kicker: "Settings",
      title: "My account",
      subtitle:
        "Manage your personal profile, preferences, and the academy danger zone.",
    },
    account: {
      title: "Personal profile",
      hint: "These details belong to your account and apply across every academy.",
      avatarLabel: "Profile photo",
      avatarHint: "Upload an image or paste a URL. Square works best, up to 50MB.",
      displayName: "Display name",
      displayNamePlaceholder: "e.g. Dana Cohen",
      bio: "About",
      bioPlaceholder: "A few words about you (optional).",
      locale: "Language",
      localeNames: { he: "עברית", en: "English" },
      timezone: "Timezone",
      website: "Website",
      websitePlaceholder: "https://…",
      publicLabel: "Public profile",
      publicHint: "Let students see your profile in the community and leaderboards.",
      save: "Save changes",
      saving: "Saving…",
      saved: "Profile saved",
    },
    quickLinks: {
      title: "More settings",
      hint: "Branding, team, and students are managed on dedicated pages.",
      branding: "Academy branding",
      brandingDesc: "Name, address, colors, language, and currency.",
      team: "Team & students",
      teamDesc: "Manage members, roles, and invitations.",
    },
    danger: {
      title: "Danger zone",
      hint: "Irreversible actions. Only the owner can perform them.",
      warning:
        "Deleting the academy hides it and all of its content. Students lose access. To confirm, type the academy name exactly.",
      confirmLabel: "Confirm the academy name",
      confirmPlaceholder: (name) => name,
      delete: "Delete academy",
      deleting: "Deleting…",
      deleted: "Academy deleted.",
      note: "Only the owner can see this zone.",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      notSignedIn: "Please sign in again.",
      nameRequired: "Please enter a display name.",
      notOwner: "Only the owner can delete the academy.",
      confirmMismatch: "The name you typed doesn't match. Nothing was deleted.",
    },
  },
};

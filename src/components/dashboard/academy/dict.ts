import type { Locale } from "@/lib/i18n";

/**
 * Academy-management bilingual strings. Kept local to the academy feature so
 * the shared app-dictionary (foundation) stays untouched.
 */
export interface AcademyDict {
  createKicker: string;
  createTitle: string;
  createSub: string;
  settingsKicker: string;
  settingsTitle: string;
  settingsSub: string;

  sectionIdentity: string;
  sectionIdentityHint: string;
  sectionBranding: string;
  sectionBrandingHint: string;
  sectionRegional: string;
  sectionRegionalHint: string;

  name: string;
  namePlaceholder: string;
  slug: string;
  slugHint: string;
  slugDomainPreview: string;
  description: string;
  descriptionPlaceholder: string;

  brandPrimary: string;
  brandAccent: string;
  brandPreview: string;
  brandPreviewBadge: string;

  locale: string;
  currency: string;
  timezone: string;
  whiteLabel: string;
  whiteLabelHint: string;

  create: string;
  creating: string;
  save: string;
  saving: string;
  saved: string;

  // slug live states
  slugChecking: string;
  slugAvailable: string;
  slugTaken: string;
  slugInvalid: string;
  slugUnknown: string;

  errors: {
    validation: string;
    slug_taken: string;
    denied: string;
    unknown: string;
    slug_check: string;
    nameRequired: string;
    slugRequired: string;
    slugFormat: string;
    colorFormat: string;
  };

  localeNames: Record<string, string>;
}

export const academyDict: Record<Locale, AcademyDict> = {
  he: {
    createKicker: "האקדמיה שלך",
    createTitle: "הקם את האקדמיה שלך",
    createSub:
      "בחר שם, כתובת ומיתוג — והאקדמיה הדיגיטלית שלך תקום תוך שניות. הכל ניתן לעריכה אחר כך.",
    settingsKicker: "אקדמיה",
    settingsTitle: "הגדרות האקדמיה",
    settingsSub: "מיתוג, כתובת, שפה, מטבע ואזור זמן — מנוהלים במקום אחד.",

    sectionIdentity: "זהות",
    sectionIdentityHint: "השם והכתובת שהתלמידים שלך יראו.",
    sectionBranding: "מיתוג",
    sectionBrandingHint: "צבעי המותג של האקדמיה, חלים על כל חוויית התלמיד.",
    sectionRegional: "אזור ושפה",
    sectionRegionalHint: "שפת ברירת המחדל, המטבע לתשלומים ואזור הזמן.",

    name: "שם האקדמיה",
    namePlaceholder: "האקדמיה של ישראל",
    slug: "כתובת (subdomain)",
    slugHint: "אותיות לטיניות קטנות, ספרות ומקפים בלבד.",
    slugDomainPreview: "כתובת האקדמיה",
    description: "תיאור",
    descriptionPlaceholder: "משפט אחד שמתאר את האקדמיה שלך…",

    brandPrimary: "צבע ראשי",
    brandAccent: "צבע משני (גוון זהב)",
    brandPreview: "תצוגה מקדימה",
    brandPreviewBadge: "המותג שלך",

    locale: "שפת ברירת מחדל",
    currency: "מטבע",
    timezone: "אזור זמן",
    whiteLabel: "מיתוג לבן (White-label)",
    whiteLabelHint: "הסתר את מיתוג הפלטפורמה והצג רק את המותג שלך.",

    create: "צור אקדמיה",
    creating: "יוצר…",
    save: "שמור שינויים",
    saving: "שומר…",
    saved: "השינויים נשמרו",

    slugChecking: "בודק זמינות…",
    slugAvailable: "הכתובת פנויה",
    slugTaken: "הכתובת תפוסה",
    slugInvalid: "כתובת לא תקינה",
    slugUnknown: "לא ניתן לאמת כעת — נבדוק בעת השמירה",

    errors: {
      validation: "נא לתקן את השדות המסומנים.",
      slug_taken: "הכתובת כבר תפוסה. בחר כתובת אחרת.",
      denied: "אין לך הרשאה לבצע פעולה זו.",
      unknown: "משהו השתבש. נסה שוב.",
      slug_check: "לא ניתן לבדוק את הכתובת כעת.",
      nameRequired: "נא להזין שם אקדמיה.",
      slugRequired: "נא להזין כתובת.",
      slugFormat: "אותיות קטנות, ספרות ומקפים בלבד (2–40 תווים).",
      colorFormat: "צבע לא תקין (פורמט HEX).",
    },

    localeNames: { he: "עברית", en: "English" },
  },
  en: {
    createKicker: "Your academy",
    createTitle: "Create your academy",
    createSub:
      "Pick a name, an address, and your branding — your digital academy goes live in seconds. Everything is editable later.",
    settingsKicker: "Academy",
    settingsTitle: "Academy settings",
    settingsSub: "Branding, address, language, currency, and timezone — in one place.",

    sectionIdentity: "Identity",
    sectionIdentityHint: "The name and address your students will see.",
    sectionBranding: "Branding",
    sectionBrandingHint: "Your academy's brand colors, applied across the student experience.",
    sectionRegional: "Region & language",
    sectionRegionalHint: "Default language, the currency for payments, and the timezone.",

    name: "Academy name",
    namePlaceholder: "Acme Academy",
    slug: "Address (subdomain)",
    slugHint: "Lowercase letters, digits, and hyphens only.",
    slugDomainPreview: "Academy address",
    description: "Description",
    descriptionPlaceholder: "One line that describes your academy…",

    brandPrimary: "Primary color",
    brandAccent: "Accent color (gilt tone)",
    brandPreview: "Preview",
    brandPreviewBadge: "Your brand",

    locale: "Default language",
    currency: "Currency",
    timezone: "Timezone",
    whiteLabel: "White-label",
    whiteLabelHint: "Hide the platform badge and show only your brand.",

    create: "Create academy",
    creating: "Creating…",
    save: "Save changes",
    saving: "Saving…",
    saved: "Changes saved",

    slugChecking: "Checking availability…",
    slugAvailable: "Address is available",
    slugTaken: "Address is taken",
    slugInvalid: "Invalid address",
    slugUnknown: "Can't verify now — we'll check on save",

    errors: {
      validation: "Please fix the highlighted fields.",
      slug_taken: "That address is taken. Choose another.",
      denied: "You don't have permission to do that.",
      unknown: "Something went wrong. Please try again.",
      slug_check: "Couldn't check the address right now.",
      nameRequired: "Please enter an academy name.",
      slugRequired: "Please enter an address.",
      slugFormat: "Lowercase letters, digits, and hyphens only (2–40 chars).",
      colorFormat: "Invalid color (HEX format).",
    },

    localeNames: { he: "עברית", en: "English" },
  },
};

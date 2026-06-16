import type { Locale } from "./i18n";

/**
 * Shared chrome strings (Nav / Footer / CTASection). Page-specific copy
 * lives in src/content/<page>.ts to prevent write races.
 */

export interface NavDict {
  links: { href: string; label: string }[];
  cta: string;
  menu: string;
  close: string;
}

export interface FooterDict {
  mission: string;
  columns: { title: string; links: { href: string; label: string }[] }[];
  paymentsLabel: string;
  aiLabel: string;
  copyright: string;
}

export interface CTADict {
  heading: string;
  cta: string;
  tour: string;
}

interface Chrome {
  nav: NavDict;
  footer: FooterDict;
  cta: CTADict;
}

const paymentChips = ["SUMIT", "Stripe", "PayPal", "Tranzila", "Pelecard"];
const aiChips = ["GPT", "Claude", "Gemini", "Grok", "DeepSeek", "Mistral", "Llama"];

export { paymentChips, aiChips };

export const dictionary: Record<Locale, Chrome> = {
  he: {
    nav: {
      links: [
        { href: "", label: "בית" },
        { href: "features", label: "יכולות" },
        { href: "ai", label: "ה-AI" },
        { href: "pricing", label: "תמחור" },
        { href: "community", label: "קהילה" },
      ],
      cta: "בנה אקדמיה",
      menu: "פתח תפריט",
      close: "סגור תפריט",
    },
    footer: {
      mission:
        "מערכת ההפעלה לאקדמיה הדיגיטלית שלך — קורסים, קהילה ומנויים, מנוהלים על ידי AI מרכזי אחד.",
      columns: [
        {
          title: "מוצר",
          links: [
            { href: "features", label: "יכולות" },
            { href: "pricing", label: "תמחור" },
            { href: "community", label: "קהילה" },
          ],
        },
        {
          title: "AI",
          links: [
            { href: "ai", label: "ה-AI המרכזי" },
            { href: "ai", label: "מורה אישי" },
            { href: "ai", label: "יועץ עסקי" },
          ],
        },
        {
          title: "פלטפורמה",
          links: [
            { href: "features", label: "אפליקציה" },
            { href: "features", label: "API" },
            { href: "features", label: "אוטומציות" },
          ],
        },
        {
          title: "חברה",
          links: [
            { href: "", label: "אודות" },
            { href: "", label: "צור קשר" },
            { href: "", label: "פרטיות" },
          ],
        },
      ],
      paymentsLabel: "תשלומים",
      aiLabel: "מנועי AI",
      copyright: "© CourseFocus AI",
    },
    cta: {
      heading: "מוכן להקים אקדמיה?",
      cta: "בנה את האקדמיה שלך",
      tour: "סיור במערכת",
    },
  },
  en: {
    nav: {
      links: [
        { href: "", label: "Home" },
        { href: "features", label: "Features" },
        { href: "ai", label: "AI" },
        { href: "pricing", label: "Pricing" },
        { href: "community", label: "Community" },
      ],
      cta: "Build academy",
      menu: "Open menu",
      close: "Close menu",
    },
    footer: {
      mission:
        "The operating system for your digital academy — courses, community, and subscriptions, run by one central AI.",
      columns: [
        {
          title: "Product",
          links: [
            { href: "features", label: "Features" },
            { href: "pricing", label: "Pricing" },
            { href: "community", label: "Community" },
          ],
        },
        {
          title: "AI",
          links: [
            { href: "ai", label: "Central AI" },
            { href: "ai", label: "Personal tutor" },
            { href: "ai", label: "Business advisor" },
          ],
        },
        {
          title: "Platform",
          links: [
            { href: "features", label: "Mobile app" },
            { href: "features", label: "API" },
            { href: "features", label: "Automations" },
          ],
        },
        {
          title: "Company",
          links: [
            { href: "", label: "About" },
            { href: "", label: "Contact" },
            { href: "", label: "Privacy" },
          ],
        },
      ],
      paymentsLabel: "Payments",
      aiLabel: "AI engines",
      copyright: "© CourseFocus AI",
    },
    cta: {
      heading: "Ready to build your academy?",
      cta: "Build your academy",
      tour: "Take the tour",
    },
  },
};

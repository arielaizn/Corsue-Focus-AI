import type { Locale } from "@/lib/i18n";
import type { SubmissionType } from "@/lib/data/grading";

/* ---------------------------------------------------------------------------
   Bilingual strings local to the GRADING feature. Kept here (not in the shared
   app-dictionary, which is owned by the foundation) per ownership rules.
--------------------------------------------------------------------------- */

export interface GradingDict {
  index: {
    kicker: string;
    title: string;
    subtitle: string;
    noAcademyTitle: string;
    noAcademyBody: string;
    noAcademyCta: string;
    pendingTab: string;
    gradedTab: string;
    pending: string;
    graded: string;
    emptyPending: { title: string; body: string };
    emptyGraded: { title: string; body: string };
    submittedAt: string;
    student: string;
    assignment: string;
    viewFile: string;
    viewVideo: string;
    openUrl: string;
    noBody: string;
    score: string;
    outOf: string;
    aiAssisted: string;
    editGrade: string;
    cancelEdit: string;
  };
  mine: {
    kicker: string;
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    awaitingGrade: string;
    feedbackLabel: string;
  };
  form: {
    heading: string;
    scoreLabel: string;
    feedbackLabel: string;
    feedbackPlaceholder: string;
    save: string;
    saving: string;
    saved: string;
    aiDraft: string;
    aiDrafting: string;
    aiHint: string;
    aiUnavailable: string;
    scoreRangeHint: string;
  };
  quizzes: {
    heading: string;
    subtitle: string;
    empty: string;
    passed: string;
    failed: string;
    pendingResult: string;
  };
  readOnly: {
    title: string;
    body: string;
  };
  errors: {
    generic: string;
    notGrader: string;
    scoreInvalid: string;
    notFound: string;
    aiFailed: string;
  };
  submissionType: Record<SubmissionType, string>;
}

export const gradingDict: Record<Locale, GradingDict> = {
  he: {
    index: {
      kicker: "בדיקה והערכה",
      title: "תור הבדיקה",
      subtitle:
        "בדוק הגשות של תלמידים, תן ציון ומשוב — בעזרת טיוטת משוב חכמה שאפשר לערוך לפני השמירה.",
      noAcademyTitle: "צריך אקדמיה קודם",
      noAcademyBody:
        "כדי לבדוק הגשות צריך תחילה אקדמיה. צור אחת ותחזור לכאן.",
      noAcademyCta: "צור אקדמיה",
      pendingTab: "ממתינות לבדיקה",
      gradedTab: "נבדקו לאחרונה",
      pending: "ממתינה",
      graded: "נבדקה",
      emptyPending: {
        title: "אין הגשות שממתינות לבדיקה",
        body: "כשתלמידים יגישו מטלות, הן יופיעו כאן לבדיקה.",
      },
      emptyGraded: {
        title: "עדיין לא נבדקו הגשות",
        body: "הגשות שתסיים לבדוק יופיעו כאן.",
      },
      submittedAt: "הוגש",
      student: "תלמיד",
      assignment: "מטלה",
      viewFile: "פתח קובץ",
      viewVideo: "צפה בווידאו",
      openUrl: "פתח קישור",
      noBody: "ההגשה ללא טקסט (קובץ/קישור בלבד).",
      score: "ציון",
      outOf: "מתוך",
      aiAssisted: "נוצר בסיוע AI",
      editGrade: "ערוך ציון",
      cancelEdit: "בטל",
    },
    mine: {
      kicker: "ההגשות שלי",
      title: "ההגשות והציונים שלי",
      subtitle: "כאן מרוכזות ההגשות שלך והציונים שקיבלת עליהן.",
      emptyTitle: "עדיין אין הגשות",
      emptyBody: "כשתגיש מטלות, הן יופיעו כאן יחד עם הציון והמשוב.",
      awaitingGrade: "ממתינה לציון",
      feedbackLabel: "משוב",
    },
    form: {
      heading: "מתן ציון",
      scoreLabel: "ציון",
      feedbackLabel: "משוב לתלמיד",
      feedbackPlaceholder: "כתוב משוב, או צור טיוטה חכמה וערוך אותה…",
      save: "שמור ציון",
      saving: "שומר…",
      saved: "הציון נשמר",
      aiDraft: "טיוטת משוב חכמה",
      aiDrafting: "מנסח…",
      aiHint: "ה-AI ינסח טיוטת משוב על בסיס ההגשה. תוכל לערוך אותה לפני השמירה.",
      aiUnavailable: "סיוע ה-AI אינו מוגדר (חסר מפתח). אפשר עדיין לכתוב משוב ידנית.",
      scoreRangeHint: "מספר בין 0 ל-",
    },
    quizzes: {
      heading: "ניסיונות מבחן אחרונים",
      subtitle: "תובנה לקריאה בלבד — נבדקים אוטומטית, ללא בדיקה ידנית.",
      empty: "עדיין אין ניסיונות מבחן.",
      passed: "עבר",
      failed: "נכשל",
      pendingResult: "—",
    },
    readOnly: {
      title: "מצב צפייה בלבד",
      body: "אין לך הרשאת בדיקה באקדמיה הזו. אפשר לעיין בהגשות אך לא לתת ציון.",
    },
    errors: {
      generic: "משהו השתבש. נסה שוב.",
      notGrader: "אין לך הרשאה לבדוק הגשות באקדמיה הזו.",
      scoreInvalid: "הציון חייב להיות מספר בטווח התקין.",
      notFound: "ההגשה לא נמצאה.",
      aiFailed: "יצירת הטיוטה נכשלה. נסה שוב או כתוב ידנית.",
    },
    submissionType: {
      text: "טקסט",
      file: "קובץ",
      video: "וידאו",
      url: "קישור",
    },
  },
  en: {
    index: {
      kicker: "Review & assessment",
      title: "Grading queue",
      subtitle:
        "Review student submissions, assign a score and feedback — with an AI feedback draft you can edit before saving.",
      noAcademyTitle: "Create an academy first",
      noAcademyBody:
        "You need an academy before you can review submissions. Create one and come back here.",
      noAcademyCta: "Create academy",
      pendingTab: "Awaiting review",
      gradedTab: "Recently graded",
      pending: "Pending",
      graded: "Graded",
      emptyPending: {
        title: "Nothing awaiting review",
        body: "When students submit assignments, they'll show up here to grade.",
      },
      emptyGraded: {
        title: "No graded submissions yet",
        body: "Submissions you finish grading will appear here.",
      },
      submittedAt: "Submitted",
      student: "Student",
      assignment: "Assignment",
      viewFile: "Open file",
      viewVideo: "Watch video",
      openUrl: "Open link",
      noBody: "No written submission (file/link only).",
      score: "Score",
      outOf: "of",
      aiAssisted: "AI-assisted",
      editGrade: "Edit grade",
      cancelEdit: "Cancel",
    },
    mine: {
      kicker: "My work",
      title: "My submissions & grades",
      subtitle: "Your submissions and the grades you've received, all in one place.",
      emptyTitle: "No submissions yet",
      emptyBody:
        "When you submit assignments, they'll appear here with your score and feedback.",
      awaitingGrade: "Awaiting grade",
      feedbackLabel: "Feedback",
    },
    form: {
      heading: "Assign a grade",
      scoreLabel: "Score",
      feedbackLabel: "Feedback to student",
      feedbackPlaceholder: "Write feedback, or draft it with AI and edit…",
      save: "Save grade",
      saving: "Saving…",
      saved: "Grade saved",
      aiDraft: "AI feedback draft",
      aiDrafting: "Drafting…",
      aiHint:
        "AI will draft feedback based on the submission. You can edit it before saving.",
      aiUnavailable:
        "AI assist isn't configured (no API key). You can still write feedback manually.",
      scoreRangeHint: "A number between 0 and ",
    },
    quizzes: {
      heading: "Recent quiz attempts",
      subtitle: "Read-only insight — these auto-grade, no manual review needed.",
      empty: "No quiz attempts yet.",
      passed: "Passed",
      failed: "Failed",
      pendingResult: "—",
    },
    readOnly: {
      title: "View-only mode",
      body: "You don't have grading permission in this academy. You can browse submissions but not assign grades.",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      notGrader: "You don't have permission to grade submissions in this academy.",
      scoreInvalid: "The score must be a number within the valid range.",
      notFound: "Submission not found.",
      aiFailed: "Drafting failed. Try again or write feedback manually.",
    },
    submissionType: {
      text: "Text",
      file: "File",
      video: "Video",
      url: "Link",
    },
  },
};

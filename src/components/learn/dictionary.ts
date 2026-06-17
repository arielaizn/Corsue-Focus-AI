import type { Locale } from "@/lib/i18n";

/**
 * Bilingual strings for the LEARNER surface (/[locale]/learn/*).
 *
 * Hebrew is the primary voice — warm, human, encouraging, with no AI-jargon.
 * English is a natural, friendly equivalent. Every feature agent imports
 * `learnDict` and reads from these keys; the shape below is the contract, so
 * keep keys in sync with the LearnDict type (downstream imports typecheck
 * against it).
 */
export type LearnDict = {
  nav: {
    overview: string;
    courses: string;
    community: string;
    leaderboard: string;
    profile: string;
    settings: string;
  };
  shell: {
    backToSite: string;
    signOut: string;
    account: string;
    learner: string;
  };
  overview: {
    title: string;
    continueLearning: string;
    resume: string;
    noCourses: string;
    browseCourses: string;
    xp: string;
    level: string;
    streak: string;
    days: string;
    recentActivity: string;
    completed: string;
    inProgress: string;
    welcome: string;
  };
  courses: {
    title: string;
    subtitle: string;
    myCourses: string;
    inProgress: string;
    completed: string;
    progress: string;
    lessons: string;
    continue: string;
    empty: string;
    emptyCta: string;
    review: string;
    rate: string;
  };
  player: {
    lessons: string;
    markComplete: string;
    completed: string;
    markedComplete: string;
    nextLesson: string;
    prevLesson: string;
    overview: string;
    notes: string;
    addNote: string;
    notePlaceholder: string;
    saveNote: string;
    bookmark: string;
    resources: string;
    transcript: string;
    aiTutor: string;
    tutorPlaceholder: string;
    tutorSend: string;
    quiz: string;
    takeQuiz: string;
    locked: string;
    backToCourses: string;
    captions: string;
  };
  quiz: {
    title: string;
    start: string;
    submit: string;
    question: string;
    of: string;
    passed: string;
    failed: string;
    score: string;
    passScore: string;
    attemptsLeft: string;
    noAttempts: string;
    retry: string;
    review: string;
    correct: string;
    incorrect: string;
    yourAnswer: string;
    backToCourse: string;
    submitting: string;
    results: string;
  };
  complete: {
    congrats: string;
    courseComplete: string;
    getCertificate: string;
    issuing: string;
    viewCertificate: string;
    verifyCode: string;
    backToCourses: string;
    certIssued: string;
    issuedOn: string;
    rateCourse: string;
    rateThanks: string;
  };
  community: {
    title: string;
    feed: string;
    write: string;
    postPlaceholder: string;
    post: string;
    posting: string;
    like: string;
    comment: string;
    comments: string;
    addComment: string;
    commentPlaceholder: string;
    noPosts: string;
    members: string;
    reply: string;
  };
  leaderboard: {
    title: string;
    subtitle: string;
    rank: string;
    learner: string;
    xp: string;
    level: string;
    you: string;
    badges: string;
    earnedBadges: string;
    noBadges: string;
    streak: string;
    currentStreak: string;
    longestStreak: string;
    days: string;
  };
  profile: {
    title: string;
    myCertificates: string;
    myBadges: string;
    noCertificates: string;
    noBadges: string;
    joined: string;
    edit: string;
  };
  settings: {
    title: string;
    account: string;
    displayName: string;
    avatar: string;
    language: string;
    save: string;
    saved: string;
    saving: string;
    profileUpdated: string;
  };
  enroll: {
    enrollNow: string;
    enrolled: string;
    freeEnroll: string;
    signInToEnroll: string;
    goToCourse: string;
    enrolling: string;
    alreadyEnrolled: string;
  };
  errors: {
    generic: string;
    notEnrolled: string;
    loadFailed: string;
  };
};

export const learnDict: Record<Locale, LearnDict> = {
  he: {
    nav: {
      overview: "מבט כללי",
      courses: "הקורסים שלי",
      community: "קהילה",
      leaderboard: "טבלת מובילים",
      profile: "הפרופיל שלי",
      settings: "הגדרות",
    },
    shell: {
      backToSite: "חזרה לאתר",
      signOut: "התנתקות",
      account: "החשבון שלי",
      learner: "לומד",
    },
    overview: {
      title: "מבט כללי",
      continueLearning: "המשך ללמוד",
      resume: "המשך מאיפה שהפסקת",
      noCourses: "עדיין לא נרשמת לאף קורס",
      browseCourses: "גלה קורסים",
      xp: "נקודות ניסיון",
      level: "רמה",
      streak: "רצף",
      days: "ימים",
      recentActivity: "פעילות אחרונה",
      completed: "הושלם",
      inProgress: "בתהליך",
      welcome: "שמחים לראות אותך",
    },
    courses: {
      title: "הקורסים שלי",
      subtitle: "כל מה שנרשמת אליו — במקום אחד.",
      myCourses: "הקורסים שלי",
      inProgress: "בתהליך",
      completed: "הושלמו",
      progress: "התקדמות",
      lessons: "שיעורים",
      continue: "המשך",
      empty: "עדיין לא נרשמת לאף קורס",
      emptyCta: "גלה קורסים",
      review: "כתוב ביקורת",
      rate: "דרג את הקורס",
    },
    player: {
      lessons: "שיעורים",
      markComplete: "סמן כהושלם",
      completed: "הושלם",
      markedComplete: "סומן כהושלם",
      nextLesson: "השיעור הבא",
      prevLesson: "השיעור הקודם",
      overview: "סקירה",
      notes: "הערות",
      addNote: "הוסף הערה",
      notePlaceholder: "כתוב כאן את ההערה שלך…",
      saveNote: "שמור הערה",
      bookmark: "סימנייה",
      resources: "חומרים נלווים",
      transcript: "תמלול",
      aiTutor: "מורה AI",
      tutorPlaceholder: "שאל כל שאלה על השיעור…",
      tutorSend: "שלח",
      quiz: "בוחן",
      takeQuiz: "התחל בוחן",
      locked: "נעול",
      backToCourses: "חזרה לקורסים",
      captions: "כתוביות",
    },
    quiz: {
      title: "בוחן",
      start: "התחל בוחן",
      submit: "הגש תשובות",
      question: "שאלה",
      of: "מתוך",
      passed: "עברת!",
      failed: "לא עברת הפעם",
      score: "ציון",
      passScore: "ציון עובר",
      attemptsLeft: "ניסיונות שנותרו",
      noAttempts: "נגמרו הניסיונות",
      retry: "נסה שוב",
      review: "סקירת תשובות",
      correct: "נכון",
      incorrect: "שגוי",
      yourAnswer: "התשובה שלך",
      backToCourse: "חזרה לקורס",
      submitting: "מגיש…",
      results: "תוצאות",
    },
    complete: {
      congrats: "כל הכבוד!",
      courseComplete: "סיימת את הקורס",
      getCertificate: "קבל תעודה",
      issuing: "מפיק תעודה…",
      viewCertificate: "צפה בתעודה",
      verifyCode: "קוד אימות",
      backToCourses: "חזרה לקורסים",
      certIssued: "התעודה הופקה",
      issuedOn: "הונפקה בתאריך",
      rateCourse: "דרג את הקורס",
      rateThanks: "תודה על הדירוג!",
    },
    community: {
      title: "קהילה",
      feed: "פיד",
      write: "כתוב פוסט",
      postPlaceholder: "מה בא לך לשתף?",
      post: "פרסם",
      posting: "מפרסם…",
      like: "אהבתי",
      comment: "תגובה",
      comments: "תגובות",
      addComment: "הוסף תגובה",
      commentPlaceholder: "כתוב תגובה…",
      noPosts: "עדיין אין פוסטים. תהיה הראשון!",
      members: "חברים",
      reply: "השב",
    },
    leaderboard: {
      title: "טבלת מובילים",
      subtitle: "הלומדים הכי מתמידים באקדמיה.",
      rank: "דירוג",
      learner: "לומד",
      xp: "נקודות ניסיון",
      level: "רמה",
      you: "את/ה",
      badges: "תגים",
      earnedBadges: "תגים שזכית בהם",
      noBadges: "עדיין אין תגים — תמשיך ללמוד!",
      streak: "רצף",
      currentStreak: "רצף נוכחי",
      longestStreak: "הרצף הארוך ביותר",
      days: "ימים",
    },
    profile: {
      title: "הפרופיל שלי",
      myCertificates: "התעודות שלי",
      myBadges: "התגים שלי",
      noCertificates: "עדיין אין תעודות",
      noBadges: "עדיין אין תגים",
      joined: "הצטרף",
      edit: "ערוך פרופיל",
    },
    settings: {
      title: "הגדרות",
      account: "חשבון",
      displayName: "שם תצוגה",
      avatar: "תמונת פרופיל",
      language: "שפה",
      save: "שמור",
      saved: "נשמר",
      saving: "שומר…",
      profileUpdated: "הפרופיל עודכן בהצלחה",
    },
    enroll: {
      enrollNow: "הירשם עכשיו",
      enrolled: "רשום",
      freeEnroll: "הירשם בחינם",
      signInToEnroll: "התחבר כדי להירשם",
      goToCourse: "עבור לקורס",
      enrolling: "נרשם…",
      alreadyEnrolled: "כבר נרשמת לקורס הזה",
    },
    errors: {
      generic: "משהו השתבש. נסה שוב.",
      notEnrolled: "אינך רשום לקורס הזה.",
      loadFailed: "טעינת הנתונים נכשלה.",
    },
  },
  en: {
    nav: {
      overview: "Overview",
      courses: "My Courses",
      community: "Community",
      leaderboard: "Leaderboard",
      profile: "Profile",
      settings: "Settings",
    },
    shell: {
      backToSite: "Back to site",
      signOut: "Sign out",
      account: "My account",
      learner: "Learner",
    },
    overview: {
      title: "Overview",
      continueLearning: "Continue learning",
      resume: "Pick up where you left off",
      noCourses: "You haven't enrolled in any courses yet",
      browseCourses: "Browse courses",
      xp: "XP",
      level: "Level",
      streak: "Streak",
      days: "days",
      recentActivity: "Recent activity",
      completed: "Completed",
      inProgress: "In progress",
      welcome: "Welcome back",
    },
    courses: {
      title: "My Courses",
      subtitle: "Everything you've enrolled in — in one place.",
      myCourses: "My Courses",
      inProgress: "In progress",
      completed: "Completed",
      progress: "Progress",
      lessons: "lessons",
      continue: "Continue",
      empty: "You haven't enrolled in any courses yet",
      emptyCta: "Browse courses",
      review: "Write a review",
      rate: "Rate this course",
    },
    player: {
      lessons: "Lessons",
      markComplete: "Mark complete",
      completed: "Completed",
      markedComplete: "Marked complete",
      nextLesson: "Next lesson",
      prevLesson: "Previous lesson",
      overview: "Overview",
      notes: "Notes",
      addNote: "Add note",
      notePlaceholder: "Write your note here…",
      saveNote: "Save note",
      bookmark: "Bookmark",
      resources: "Resources",
      transcript: "Transcript",
      aiTutor: "AI Tutor",
      tutorPlaceholder: "Ask anything about this lesson…",
      tutorSend: "Send",
      quiz: "Quiz",
      takeQuiz: "Take quiz",
      locked: "Locked",
      backToCourses: "Back to courses",
      captions: "Captions",
    },
    quiz: {
      title: "Quiz",
      start: "Start quiz",
      submit: "Submit answers",
      question: "Question",
      of: "of",
      passed: "You passed!",
      failed: "Not quite this time",
      score: "Score",
      passScore: "Pass score",
      attemptsLeft: "Attempts left",
      noAttempts: "No attempts left",
      retry: "Try again",
      review: "Review answers",
      correct: "Correct",
      incorrect: "Incorrect",
      yourAnswer: "Your answer",
      backToCourse: "Back to course",
      submitting: "Submitting…",
      results: "Results",
    },
    complete: {
      congrats: "Congratulations!",
      courseComplete: "You completed the course",
      getCertificate: "Get certificate",
      issuing: "Issuing certificate…",
      viewCertificate: "View certificate",
      verifyCode: "Verification code",
      backToCourses: "Back to courses",
      certIssued: "Certificate issued",
      issuedOn: "Issued on",
      rateCourse: "Rate this course",
      rateThanks: "Thanks for your rating!",
    },
    community: {
      title: "Community",
      feed: "Feed",
      write: "Write a post",
      postPlaceholder: "What would you like to share?",
      post: "Post",
      posting: "Posting…",
      like: "Like",
      comment: "Comment",
      comments: "Comments",
      addComment: "Add comment",
      commentPlaceholder: "Write a comment…",
      noPosts: "No posts yet. Be the first!",
      members: "Members",
      reply: "Reply",
    },
    leaderboard: {
      title: "Leaderboard",
      subtitle: "The most dedicated learners in the academy.",
      rank: "Rank",
      learner: "Learner",
      xp: "XP",
      level: "Level",
      you: "You",
      badges: "Badges",
      earnedBadges: "Badges you've earned",
      noBadges: "No badges yet — keep learning!",
      streak: "Streak",
      currentStreak: "Current streak",
      longestStreak: "Longest streak",
      days: "days",
    },
    profile: {
      title: "My Profile",
      myCertificates: "My certificates",
      myBadges: "My badges",
      noCertificates: "No certificates yet",
      noBadges: "No badges yet",
      joined: "Joined",
      edit: "Edit profile",
    },
    settings: {
      title: "Settings",
      account: "Account",
      displayName: "Display name",
      avatar: "Avatar",
      language: "Language",
      save: "Save",
      saved: "Saved",
      saving: "Saving…",
      profileUpdated: "Profile updated successfully",
    },
    enroll: {
      enrollNow: "Enroll now",
      enrolled: "Enrolled",
      freeEnroll: "Enroll for free",
      signInToEnroll: "Sign in to enroll",
      goToCourse: "Go to course",
      enrolling: "Enrolling…",
      alreadyEnrolled: "You're already enrolled in this course",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      notEnrolled: "You're not enrolled in this course.",
      loadFailed: "Failed to load data.",
    },
  },
};

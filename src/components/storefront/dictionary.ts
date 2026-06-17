import type { Locale } from "@/lib/i18n";

/**
 * Bilingual strings for the public STOREFRONT surface — academy landing pages
 * and public course pages where prospective students browse and enroll.
 *
 * Hebrew is the primary voice — warm, inviting, sales-aware but never pushy.
 * Keep the shape in sync with StorefrontDict (downstream imports typecheck).
 */
export type StorefrontDict = {
  landing: {
    exploreCourses: string;
    courses: string;
    students: string;
    by: string;
    featured: string;
    viewAll: string;
    about: string;
    coursesCount: string;
  };
  course: {
    about: string;
    curriculum: string;
    freePreview: string;
    lessons: string;
    modules: string;
    enroll: string;
    enrolled: string;
    free: string;
    paid: string;
    membersOnly: string;
    signInToEnroll: string;
    preview: string;
    instructor: string;
    rating: string;
    goToCourse: string;
  };
  catalog: {
    title: string;
    allCourses: string;
    noCourses: string;
  };
  common: {
    backToAcademy: string;
    poweredBy: string;
  };
};

export const storefrontDict: Record<Locale, StorefrontDict> = {
  he: {
    landing: {
      exploreCourses: "גלה את הקורסים",
      courses: "קורסים",
      students: "תלמידים",
      by: "מאת",
      featured: "מומלצים",
      viewAll: "צפה בהכל",
      about: "אודות",
      coursesCount: "קורסים",
    },
    course: {
      about: "על הקורס",
      curriculum: "תוכן הקורס",
      freePreview: "תצוגה חינמית",
      lessons: "שיעורים",
      modules: "מודולים",
      enroll: "הירשם לקורס",
      enrolled: "רשום",
      free: "חינם",
      paid: "בתשלום",
      membersOnly: "לחברים בלבד",
      signInToEnroll: "התחבר כדי להירשם",
      preview: "תצוגה מקדימה",
      instructor: "מרצה",
      rating: "דירוג",
      goToCourse: "עבור לקורס",
    },
    catalog: {
      title: "קטלוג הקורסים",
      allCourses: "כל הקורסים",
      noCourses: "אין קורסים זמינים כרגע",
    },
    common: {
      backToAcademy: "חזרה לאקדמיה",
      poweredBy: "מופעל על ידי",
    },
  },
  en: {
    landing: {
      exploreCourses: "Explore courses",
      courses: "Courses",
      students: "Students",
      by: "by",
      featured: "Featured",
      viewAll: "View all",
      about: "About",
      coursesCount: "courses",
    },
    course: {
      about: "About this course",
      curriculum: "Curriculum",
      freePreview: "Free preview",
      lessons: "lessons",
      modules: "modules",
      enroll: "Enroll",
      enrolled: "Enrolled",
      free: "Free",
      paid: "Paid",
      membersOnly: "Members only",
      signInToEnroll: "Sign in to enroll",
      preview: "Preview",
      instructor: "Instructor",
      rating: "Rating",
      goToCourse: "Go to course",
    },
    catalog: {
      title: "Course catalog",
      allCourses: "All courses",
      noCourses: "No courses available right now",
    },
    common: {
      backToAcademy: "Back to academy",
      poweredBy: "Powered by",
    },
  },
};

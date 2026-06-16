import type { Locale } from "@/lib/i18n";
import type {
  CourseType,
  ContentType,
} from "@/lib/data/courses.shared";

/* ---------------------------------------------------------------------------
   Bilingual strings local to the COURSES feature. Kept here (not in the shared
   app-dictionary, which is owned by the foundation) per ownership rules.
--------------------------------------------------------------------------- */

export interface CoursesDict {
  index: {
    kicker: string;
    title: string;
    subtitle: string;
    newCourse: string;
    empty: { title: string; body: string };
    noAcademyTitle: string;
    noAcademyBody: string;
    noAcademyCta: string;
    lessons: string;
    modules: string;
    enrolled: string;
    published: string;
    draft: string;
    free: string;
    open: string;
  };
  create: {
    title: string;
    titleLabel: string;
    titlePlaceholder: string;
    descLabel: string;
    descPlaceholder: string;
    typeLabel: string;
    priceLabel: string;
    pricePlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
  };
  builder: {
    cancel: string;
    back: string;
    metaTitle: string;
    metaSubtitle: string;
    titleLabel: string;
    descLabel: string;
    descPlaceholder: string;
    typeLabel: string;
    priceLabel: string;
    publishedLabel: string;
    publishedOn: string;
    publishedOff: string;
    save: string;
    saving: string;
    saved: string;
    delete: string;
    deleteCourse: string;
    deleteCourseConfirm: string;
    curriculum: string;
    curriculumSub: string;
    addModule: string;
    moduleNamePlaceholder: string;
    emptyModules: { title: string; body: string };
    emptyLessons: string;
    rename: string;
    renameModule: string;
    deleteModule: string;
    deleteModuleConfirm: string;
    moveUp: string;
    moveDown: string;
    addLesson: string;
    lessonTitle: string;
    lessonTitlePlaceholder: string;
    contentTypeLabel: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    mediaUrlLabel: string;
    mediaUrlPlaceholder: string;
    editLesson: string;
    deleteLesson: string;
    deleteLessonConfirm: string;
    addLessonHeading: string;
    saveLesson: string;
    lessonCountOne: string;
    lessonCountMany: string;
  };
  errors: {
    titleRequired: string;
    generic: string;
    notOwner: string;
  };
  courseType: Record<CourseType, string>;
  contentType: Record<ContentType, string>;
}

export const coursesDict: Record<Locale, CoursesDict> = {
  he: {
    index: {
      kicker: "בניית קורסים",
      title: "קורסים",
      subtitle: "נהל את כל הקורסים של האקדמיה — תוכן, תמחור וסטטוס פרסום.",
      newCourse: "קורס חדש",
      empty: {
        title: "עדיין אין קורסים",
        body: "צור את הקורס הראשון שלך והתחל לבנות מודולים ושיעורים.",
      },
      noAcademyTitle: "צריך אקדמיה קודם",
      noAcademyBody:
        "כדי לבנות קורסים צריך תחילה אקדמיה. צור אחת ותחזור לכאן.",
      noAcademyCta: "צור אקדמיה",
      lessons: "שיעורים",
      modules: "מודולים",
      enrolled: "נרשמו",
      published: "פורסם",
      draft: "טיוטה",
      free: "חינם",
      open: "פתח בונה",
    },
    create: {
      title: "קורס חדש",
      titleLabel: "כותרת הקורס",
      titlePlaceholder: "לדוגמה: יסודות הצילום הדיגיטלי",
      descLabel: "תיאור קצר",
      descPlaceholder: "במשפט אחד — על מה הקורס.",
      typeLabel: "סוג קורס",
      priceLabel: "מחיר",
      pricePlaceholder: "0",
      submit: "צור קורס",
      submitting: "יוצר…",
      cancel: "ביטול",
    },
    builder: {
      cancel: "ביטול",
      back: "חזרה לקורסים",
      metaTitle: "פרטי הקורס",
      metaSubtitle: "כותרת, תיאור, סוג, מחיר וסטטוס פרסום.",
      titleLabel: "כותרת הקורס",
      descLabel: "תיאור",
      descPlaceholder: "תאר את הקורס לתלמידים.",
      typeLabel: "סוג קורס",
      priceLabel: "מחיר",
      publishedLabel: "סטטוס פרסום",
      publishedOn: "מפורסם",
      publishedOff: "טיוטה",
      save: "שמור שינויים",
      saving: "שומר…",
      saved: "נשמר",
      delete: "מחק",
      deleteCourse: "מחק קורס",
      deleteCourseConfirm: "למחוק את הקורס לצמיתות? פעולה זו בלתי הפיכה.",
      curriculum: "תוכנית הלימודים",
      curriculumSub: "ארגן מודולים ושיעורים. גרור בעזרת החצים לסידור מחדש.",
      addModule: "הוסף מודול",
      moduleNamePlaceholder: "שם המודול",
      emptyModules: {
        title: "עדיין אין מודולים",
        body: "הוסף את המודול הראשון כדי להתחיל לבנות את תוכנית הלימודים.",
      },
      emptyLessons: "אין שיעורים במודול הזה עדיין.",
      rename: "שנה שם",
      renameModule: "שנה שם מודול",
      deleteModule: "מחק מודול",
      deleteModuleConfirm: "למחוק את המודול וכל השיעורים שבו?",
      moveUp: "העבר למעלה",
      moveDown: "העבר למטה",
      addLesson: "הוסף שיעור",
      lessonTitle: "כותרת השיעור",
      lessonTitlePlaceholder: "שם השיעור",
      contentTypeLabel: "סוג תוכן",
      bodyLabel: "תוכן / טקסט",
      bodyPlaceholder: "תוכן השיעור, הערות או תמלול.",
      mediaUrlLabel: "כתובת מדיה (URL)",
      mediaUrlPlaceholder: "https://…",
      editLesson: "ערוך שיעור",
      deleteLesson: "מחק שיעור",
      deleteLessonConfirm: "למחוק את השיעור הזה?",
      addLessonHeading: "שיעור חדש",
      saveLesson: "שמור שיעור",
      lessonCountOne: "שיעור אחד",
      lessonCountMany: "שיעורים",
    },
    errors: {
      titleRequired: "נא להזין כותרת.",
      generic: "משהו השתבש. נסה שוב.",
      notOwner: "אין לך הרשאה לערוך את האקדמיה הזו.",
    },
    courseType: {
      free: "חינם",
      one_time: "תשלום חד-פעמי",
      subscription: "מנוי",
      vip: "VIP",
      private: "פרטי",
      cohort: "מחזור",
    },
    contentType: {
      video: "וידאו",
      audio: "אודיו",
      pdf: "PDF",
      ppt: "מצגת",
      image: "תמונה",
      text: "טקסט",
      embed: "הטמעה",
      link: "קישור",
    },
  },
  en: {
    index: {
      kicker: "Course builder",
      title: "Courses",
      subtitle:
        "Manage every course in your academy — content, pricing, and publish status.",
      newCourse: "New course",
      empty: {
        title: "No courses yet",
        body: "Create your first course and start building modules and lessons.",
      },
      noAcademyTitle: "Create an academy first",
      noAcademyBody:
        "You need an academy before you can build courses. Create one and come back here.",
      noAcademyCta: "Create academy",
      lessons: "lessons",
      modules: "modules",
      enrolled: "enrolled",
      published: "Published",
      draft: "Draft",
      free: "Free",
      open: "Open builder",
    },
    create: {
      title: "New course",
      titleLabel: "Course title",
      titlePlaceholder: "e.g. Foundations of Digital Photography",
      descLabel: "Short description",
      descPlaceholder: "One line — what the course is about.",
      typeLabel: "Course type",
      priceLabel: "Price",
      pricePlaceholder: "0",
      submit: "Create course",
      submitting: "Creating…",
      cancel: "Cancel",
    },
    builder: {
      cancel: "Cancel",
      back: "Back to courses",
      metaTitle: "Course details",
      metaSubtitle: "Title, description, type, price, and publish status.",
      titleLabel: "Course title",
      descLabel: "Description",
      descPlaceholder: "Describe the course for your students.",
      typeLabel: "Course type",
      priceLabel: "Price",
      publishedLabel: "Publish status",
      publishedOn: "Published",
      publishedOff: "Draft",
      save: "Save changes",
      saving: "Saving…",
      saved: "Saved",
      delete: "Delete",
      deleteCourse: "Delete course",
      deleteCourseConfirm:
        "Delete this course permanently? This can't be undone.",
      curriculum: "Curriculum",
      curriculumSub:
        "Organize modules and lessons. Reorder with the arrow controls.",
      addModule: "Add module",
      moduleNamePlaceholder: "Module name",
      emptyModules: {
        title: "No modules yet",
        body: "Add your first module to start building the curriculum.",
      },
      emptyLessons: "No lessons in this module yet.",
      rename: "Rename",
      renameModule: "Rename module",
      deleteModule: "Delete module",
      deleteModuleConfirm: "Delete this module and all its lessons?",
      moveUp: "Move up",
      moveDown: "Move down",
      addLesson: "Add lesson",
      lessonTitle: "Lesson title",
      lessonTitlePlaceholder: "Lesson name",
      contentTypeLabel: "Content type",
      bodyLabel: "Content / text",
      bodyPlaceholder: "Lesson content, notes, or transcript.",
      mediaUrlLabel: "Media URL",
      mediaUrlPlaceholder: "https://…",
      editLesson: "Edit lesson",
      deleteLesson: "Delete lesson",
      deleteLessonConfirm: "Delete this lesson?",
      addLessonHeading: "New lesson",
      saveLesson: "Save lesson",
      lessonCountOne: "lesson",
      lessonCountMany: "lessons",
    },
    errors: {
      titleRequired: "Please enter a title.",
      generic: "Something went wrong. Please try again.",
      notOwner: "You don't have permission to edit this academy.",
    },
    courseType: {
      free: "Free",
      one_time: "One-time payment",
      subscription: "Subscription",
      vip: "VIP",
      private: "Private",
      cohort: "Cohort",
    },
    contentType: {
      video: "Video",
      audio: "Audio",
      pdf: "PDF",
      ppt: "Slides",
      image: "Image",
      text: "Text",
      embed: "Embed",
      link: "Link",
    },
  },
};

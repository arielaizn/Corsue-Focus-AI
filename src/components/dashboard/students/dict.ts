import type { Locale } from "@/lib/i18n";
import type { Role } from "@/lib/auth";

/* ---------------------------------------------------------------------------
   Bilingual strings local to the MEMBERS / STUDENTS feature. Kept here (not in
   the shared app-dictionary, which the foundation owns) per ownership rules.
--------------------------------------------------------------------------- */

export interface StudentsDict {
  index: {
    title: string;
    subtitle: string;
    noAcademyTitle: string;
    noAcademyBody: string;
    noAcademyCta: string;
  };
  stats: {
    team: string;
    students: string;
    pending: string;
  };
  team: {
    heading: string;
    sub: string;
    invite: string;
    empty: { title: string; body: string };
    you: string;
    joined: string;
    roleLabel: string;
    actions: string;
    remove: string;
    removeConfirm: string;
    removed: string;
    confirmShort: string;
    lastOwnerHint: string;
  };
  students: {
    heading: string;
    sub: string;
    enroll: string;
    empty: { title: string; body: string };
    courses: string;
    coursesOne: string;
    progress: string;
    enrolled: string;
    noProgress: string;
  };
  pending: {
    heading: string;
    sub: string;
    expires: string;
    expired: string;
    none: string;
  };
  invite: {
    title: string;
    emailLabel: string;
    emailPlaceholder: string;
    roleLabel: string;
    submit: string;
    submitting: string;
    cancel: string;
    sent: string;
  };
  enroll: {
    title: string;
    userLabel: string;
    userPlaceholder: string;
    courseLabel: string;
    coursePlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    done: string;
    noCourses: string;
  };
  roleSelect: {
    label: string;
    save: string;
    saving: string;
  };
  roles: Record<Role, string>;
  errors: {
    generic: string;
    notOwner: string;
    emailRequired: string;
    emailInvalid: string;
    lastOwner: string;
    selfRemove: string;
    userRequired: string;
    courseRequired: string;
    alreadyMember: string;
    alreadyInvited: string;
    userNotFound: string;
  };
}

export const studentsDict: Record<Locale, StudentsDict> = {
  he: {
    index: {
      title: "אנשים",
      subtitle:
        "נהל את הצוות והתלמידים של האקדמיה — הזמנות, תפקידים, רישום והתקדמות.",
      noAcademyTitle: "צריך אקדמיה קודם",
      noAcademyBody:
        "כדי לנהל אנשים צריך תחילה אקדמיה. צור אחת ותחזור לכאן.",
      noAcademyCta: "צור אקדמיה",
    },
    stats: {
      team: "חברי צוות",
      students: "תלמידים",
      pending: "הזמנות ממתינות",
    },
    team: {
      heading: "צוות",
      sub: "בעלים, מנהלים ומדריכים עם גישת ניהול.",
      invite: "הזמן חבר צוות",
      empty: {
        title: "אין עדיין חברי צוות",
        body: "הזמן מנהלים ומדריכים שיעזרו לך לנהל את האקדמיה.",
      },
      you: "את/ה",
      joined: "הצטרף",
      roleLabel: "תפקיד",
      actions: "פעולות",
      remove: "הסר",
      removeConfirm: "להסיר את החבר הזה מהאקדמיה?",
      removed: "החבר הוסר.",
      confirmShort: "אישור הסרה",
      lastOwnerHint: "לא ניתן לשנות או להסיר את הבעלים האחרון.",
    },
    students: {
      heading: "תלמידים",
      sub: "כל מי שרשום לקורס באקדמיה.",
      enroll: "רישום ידני",
      empty: {
        title: "אין עדיין תלמידים",
        body: "כשתלמידים יירשמו לקורסים הם יופיעו כאן.",
      },
      courses: "קורסים",
      coursesOne: "קורס אחד",
      progress: "התקדמות",
      enrolled: "נרשם",
      noProgress: "—",
    },
    pending: {
      heading: "הזמנות ממתינות",
      sub: "הזמנות שנשלחו וטרם אושרו.",
      expires: "פג תוקף",
      expired: "פג",
      none: "אין הזמנות ממתינות.",
    },
    invite: {
      title: "הזמן חבר צוות",
      emailLabel: "כתובת אימייל",
      emailPlaceholder: "name@example.com",
      roleLabel: "תפקיד",
      submit: "שלח הזמנה",
      submitting: "שולח…",
      cancel: "ביטול",
      sent: "ההזמנה נשלחה.",
    },
    enroll: {
      title: "רישום ידני לתלמיד",
      userLabel: "מזהה משתמש (User ID)",
      userPlaceholder: "uuid של המשתמש",
      courseLabel: "קורס",
      coursePlaceholder: "בחר קורס",
      submit: "רשום תלמיד",
      submitting: "רושם…",
      cancel: "ביטול",
      done: "התלמיד נרשם.",
      noCourses: "אין עדיין קורסים לרישום.",
    },
    roleSelect: {
      label: "שנה תפקיד",
      save: "שמור",
      saving: "שומר…",
    },
    roles: {
      owner: "בעלים",
      admin: "מנהל",
      instructor: "מדריך",
      student: "תלמיד",
    },
    errors: {
      generic: "משהו השתבש. נסה שוב.",
      notOwner: "אין לך הרשאה לנהל את האקדמיה הזו.",
      emailRequired: "נא להזין אימייל.",
      emailInvalid: "כתובת האימייל אינה תקינה.",
      lastOwner: "לא ניתן לשנות או להסיר את הבעלים האחרון.",
      selfRemove: "אי אפשר להסיר את עצמך.",
      userRequired: "נא להזין מזהה משתמש.",
      courseRequired: "נא לבחור קורס.",
      alreadyMember: "המשתמש כבר חבר באקדמיה.",
      alreadyInvited: "כבר נשלחה הזמנה לכתובת הזו.",
      userNotFound: "לא נמצא משתמש עם המזהה הזה.",
    },
  },
  en: {
    index: {
      title: "People",
      subtitle:
        "Manage your academy's team and students — invitations, roles, enrollment, and progress.",
      noAcademyTitle: "Create an academy first",
      noAcademyBody:
        "You need an academy before you can manage people. Create one and come back here.",
      noAcademyCta: "Create academy",
    },
    stats: {
      team: "Team members",
      students: "Students",
      pending: "Pending invites",
    },
    team: {
      heading: "Team",
      sub: "Owners, admins, and instructors with management access.",
      invite: "Invite member",
      empty: {
        title: "No team members yet",
        body: "Invite admins and instructors to help you run the academy.",
      },
      you: "You",
      joined: "Joined",
      roleLabel: "Role",
      actions: "Actions",
      remove: "Remove",
      removeConfirm: "Remove this member from the academy?",
      removed: "Member removed.",
      confirmShort: "Confirm remove",
      lastOwnerHint: "The last owner can't be changed or removed.",
    },
    students: {
      heading: "Students",
      sub: "Everyone enrolled in a course in this academy.",
      enroll: "Manual enroll",
      empty: {
        title: "No students yet",
        body: "When students enroll in courses, they'll appear here.",
      },
      courses: "courses",
      coursesOne: "course",
      progress: "Progress",
      enrolled: "Enrolled",
      noProgress: "—",
    },
    pending: {
      heading: "Pending invites",
      sub: "Invitations sent but not yet accepted.",
      expires: "Expires",
      expired: "Expired",
      none: "No pending invites.",
    },
    invite: {
      title: "Invite a team member",
      emailLabel: "Email address",
      emailPlaceholder: "name@example.com",
      roleLabel: "Role",
      submit: "Send invite",
      submitting: "Sending…",
      cancel: "Cancel",
      sent: "Invitation sent.",
    },
    enroll: {
      title: "Manually enroll a student",
      userLabel: "User ID",
      userPlaceholder: "user's uuid",
      courseLabel: "Course",
      coursePlaceholder: "Choose a course",
      submit: "Enroll student",
      submitting: "Enrolling…",
      cancel: "Cancel",
      done: "Student enrolled.",
      noCourses: "No courses available to enroll into yet.",
    },
    roleSelect: {
      label: "Change role",
      save: "Save",
      saving: "Saving…",
    },
    roles: {
      owner: "Owner",
      admin: "Admin",
      instructor: "Instructor",
      student: "Student",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      notOwner: "You don't have permission to manage this academy.",
      emailRequired: "Please enter an email.",
      emailInvalid: "That email address isn't valid.",
      lastOwner: "The last owner can't be changed or removed.",
      selfRemove: "You can't remove yourself.",
      userRequired: "Please enter a user ID.",
      courseRequired: "Please choose a course.",
      alreadyMember: "That user is already a member of the academy.",
      alreadyInvited: "An invite has already been sent to that address.",
      userNotFound: "No user found with that ID.",
    },
  },
};

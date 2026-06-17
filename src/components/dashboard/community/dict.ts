import type { Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   Bilingual strings local to the COMMUNITY (moderation) feature. Kept here per
   ownership rules — the shared app-dictionary is owned by the foundation.
--------------------------------------------------------------------------- */

export interface CommunityDict {
  index: {
    kicker: string;
    title: string;
    subtitle: string;
    noAcademyTitle: string;
    noAcademyBody: string;
    noAcademyCta: string;
    readOnly: string;
  };
  feed: {
    title: string;
    subtitle: string;
    empty: { title: string; body: string };
    announcement: string;
    pinned: string;
    likes: string;
    comments: string;
    pin: string;
    unpin: string;
    delete: string;
    deleteConfirm: string;
    deleteFailed: string;
    confirm: string;
    cancel: string;
    by: string;
    anon: string;
    viewThread: string;
    hideThread: string;
    threadEmpty: string;
    deleteComment: string;
    deleteCommentConfirm: string;
  };
  announce: {
    title: string;
    subtitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    submit: string;
    submitting: string;
  };
  groups: {
    title: string;
    subtitle: string;
    empty: string;
    nameLabel: string;
    namePlaceholder: string;
    descLabel: string;
    descPlaceholder: string;
    visibilityLabel: string;
    visibility: { public: string; private: string; vip: string };
    members: string;
    create: string;
    creating: string;
  };
  grants: {
    title: string;
    subtitle: string;
    xpTab: string;
    badgeTab: string;
    userIdLabel: string;
    userIdPlaceholder: string;
    userIdHint: string;
    amountLabel: string;
    amountPlaceholder: string;
    noteLabel: string;
    notePlaceholder: string;
    grantXp: string;
    grantingXp: string;
    badgeLabel: string;
    noBadges: string;
    grantBadge: string;
    grantingBadge: string;
  };
  leaderboard: {
    title: string;
    subtitle: string;
    empty: string;
    rank: string;
    member: string;
    level: string;
    xp: string;
    anon: string;
  };
  errors: {
    generic: string;
    notOwner: string;
    notMember: string;
    bodyRequired: string;
    nameRequired: string;
    userRequired: string;
    amountInvalid: string;
    badgeRequired: string;
  };
  notices: {
    pinned: string;
    unpinned: string;
    deleted: string;
    commentDeleted: string;
    groupCreated: string;
    announced: string;
    xpGranted: string;
    badgeGranted: string;
  };
}

export const communityDict: Record<Locale, CommunityDict> = {
  he: {
    index: {
      kicker: "קהילה",
      title: "קהילה ומודרציה",
      subtitle:
        "נהל את הפיד, קבוצות, הכרזות ותגמולים — ושמור על שיח בריא באקדמיה.",
      noAcademyTitle: "צריך אקדמיה קודם",
      noAcademyBody:
        "כדי לנהל קהילה צריך תחילה אקדמיה. צור אחת ותחזור לכאן.",
      noAcademyCta: "צור אקדמיה",
      readOnly: "צפייה בלבד",
    },
    feed: {
      title: "פיד הקהילה",
      subtitle: "פוסטים אחרונים. נעץ, בטל נעיצה או הסר תוכן לא ראוי.",
      empty: {
        title: "אין פוסטים עדיין",
        body: "כשחברי הקהילה יפרסמו, הפוסטים יופיעו כאן לניהול.",
      },
      announcement: "הכרזה",
      pinned: "נעוץ",
      likes: "לייקים",
      comments: "תגובות",
      pin: "נעץ",
      unpin: "בטל נעיצה",
      delete: "מחק",
      deleteConfirm: "למחוק את הפוסט?",
      deleteFailed: "המחיקה נכשלה. נסה שוב.",
      confirm: "אישור",
      cancel: "ביטול",
      by: "מאת",
      anon: "משתמש לא ידוע",
      viewThread: "הצג תגובות",
      hideThread: "הסתר תגובות",
      threadEmpty: "אין תגובות בפוסט הזה.",
      deleteComment: "מחק תגובה",
      deleteCommentConfirm: "למחוק את התגובה?",
    },
    announce: {
      title: "הכרזה חדשה",
      subtitle: "פרסם עדכון רשמי שיופיע מודגש בראש הפיד.",
      titleLabel: "כותרת (אופציונלי)",
      titlePlaceholder: "לדוגמה: שיעור חי ביום ראשון",
      bodyLabel: "תוכן ההכרזה",
      bodyPlaceholder: "מה תרצה להודיע לקהילה?",
      submit: "פרסם הכרזה",
      submitting: "מפרסם…",
    },
    groups: {
      title: "קבוצות",
      subtitle: "מרחבי משנה לדיון. צור וארגן את הקהילה לקבוצות.",
      empty: "אין קבוצות עדיין. צור את הראשונה.",
      nameLabel: "שם הקבוצה",
      namePlaceholder: "לדוגמה: בוגרי מחזור 2026",
      descLabel: "תיאור (אופציונלי)",
      descPlaceholder: "על מה הקבוצה.",
      visibilityLabel: "נראות",
      visibility: { public: "ציבורית", private: "פרטית", vip: "VIP" },
      members: "חברים",
      create: "צור קבוצה",
      creating: "יוצר…",
    },
    grants: {
      title: "תגמולים ידניים",
      subtitle: "הענק נקודות XP או תג למשתמש כהוקרה ידנית.",
      xpTab: "הענקת XP",
      badgeTab: "הענקת תג",
      userIdLabel: "מזהה משתמש",
      userIdPlaceholder: "UUID של המשתמש",
      userIdHint: "העתק את מזהה המשתמש מטבלת הדירוג למטה.",
      amountLabel: "כמות XP",
      amountPlaceholder: "100",
      noteLabel: "הערה (אופציונלי)",
      notePlaceholder: "סיבת ההענקה.",
      grantXp: "הענק XP",
      grantingXp: "מעניק…",
      badgeLabel: "בחר תג",
      noBadges: "אין תגים מוגדרים לאקדמיה עדיין.",
      grantBadge: "הענק תג",
      grantingBadge: "מעניק…",
    },
    leaderboard: {
      title: "טבלת דירוג",
      subtitle: "המשתמשים המובילים לפי XP.",
      empty: "אין נתוני דירוג עדיין.",
      rank: "דירוג",
      member: "חבר",
      level: "רמה",
      xp: "XP",
      anon: "משתמש",
    },
    errors: {
      generic: "משהו השתבש. נסה שוב.",
      notOwner: "אין לך הרשאה לנהל את הקהילה הזו.",
      notMember: "המשתמש אינו חבר באקדמיה הזו.",
      bodyRequired: "נא להזין תוכן.",
      nameRequired: "נא להזין שם.",
      userRequired: "נא להזין מזהה משתמש.",
      amountInvalid: "נא להזין כמות XP חוקית.",
      badgeRequired: "נא לבחור תג.",
    },
    notices: {
      pinned: "הפוסט נועץ.",
      unpinned: "נעיצת הפוסט בוטלה.",
      deleted: "הפוסט נמחק.",
      commentDeleted: "התגובה נמחקה.",
      groupCreated: "הקבוצה נוצרה.",
      announced: "ההכרזה פורסמה.",
      xpGranted: "ה-XP הוענק.",
      badgeGranted: "התג הוענק.",
    },
  },
  en: {
    index: {
      kicker: "Community",
      title: "Community & moderation",
      subtitle:
        "Manage the feed, groups, announcements, and rewards — and keep the academy conversation healthy.",
      noAcademyTitle: "Create an academy first",
      noAcademyBody:
        "You need an academy before you can manage a community. Create one and come back here.",
      noAcademyCta: "Create academy",
      readOnly: "Read only",
    },
    feed: {
      title: "Community feed",
      subtitle: "Recent posts. Pin, unpin, or remove content that breaks the rules.",
      empty: {
        title: "No posts yet",
        body: "When members post, their posts appear here for moderation.",
      },
      announcement: "Announcement",
      pinned: "Pinned",
      likes: "likes",
      comments: "comments",
      pin: "Pin",
      unpin: "Unpin",
      delete: "Delete",
      deleteConfirm: "Delete this post?",
      deleteFailed: "Delete failed. Please try again.",
      confirm: "Confirm",
      cancel: "Cancel",
      by: "by",
      anon: "Unknown member",
      viewThread: "View comments",
      hideThread: "Hide comments",
      threadEmpty: "No comments on this post.",
      deleteComment: "Delete comment",
      deleteCommentConfirm: "Delete this comment?",
    },
    announce: {
      title: "New announcement",
      subtitle: "Publish an official update that appears highlighted at the top of the feed.",
      titleLabel: "Title (optional)",
      titlePlaceholder: "e.g. Live session this Sunday",
      bodyLabel: "Announcement body",
      bodyPlaceholder: "What do you want to tell the community?",
      submit: "Publish announcement",
      submitting: "Publishing…",
    },
    groups: {
      title: "Groups",
      subtitle: "Sub-spaces for discussion. Create and organize your community into groups.",
      empty: "No groups yet. Create the first one.",
      nameLabel: "Group name",
      namePlaceholder: "e.g. Class of 2026",
      descLabel: "Description (optional)",
      descPlaceholder: "What the group is about.",
      visibilityLabel: "Visibility",
      visibility: { public: "Public", private: "Private", vip: "VIP" },
      members: "members",
      create: "Create group",
      creating: "Creating…",
    },
    grants: {
      title: "Manual rewards",
      subtitle: "Grant XP points or a badge to a member as a manual recognition.",
      xpTab: "Grant XP",
      badgeTab: "Grant badge",
      userIdLabel: "User ID",
      userIdPlaceholder: "Member UUID",
      userIdHint: "Copy a member's ID from the leaderboard below.",
      amountLabel: "XP amount",
      amountPlaceholder: "100",
      noteLabel: "Note (optional)",
      notePlaceholder: "Reason for the grant.",
      grantXp: "Grant XP",
      grantingXp: "Granting…",
      badgeLabel: "Select badge",
      noBadges: "No badges defined for this academy yet.",
      grantBadge: "Grant badge",
      grantingBadge: "Granting…",
    },
    leaderboard: {
      title: "Leaderboard",
      subtitle: "Top members by XP.",
      empty: "No leaderboard data yet.",
      rank: "Rank",
      member: "Member",
      level: "Level",
      xp: "XP",
      anon: "Member",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      notOwner: "You don't have permission to manage this community.",
      notMember: "That user isn't a member of this academy.",
      bodyRequired: "Please enter some content.",
      nameRequired: "Please enter a name.",
      userRequired: "Please enter a user ID.",
      amountInvalid: "Please enter a valid XP amount.",
      badgeRequired: "Please select a badge.",
    },
    notices: {
      pinned: "Post pinned.",
      unpinned: "Post unpinned.",
      deleted: "Post deleted.",
      commentDeleted: "Comment deleted.",
      groupCreated: "Group created.",
      announced: "Announcement published.",
      xpGranted: "XP granted.",
      badgeGranted: "Badge granted.",
    },
  },
};

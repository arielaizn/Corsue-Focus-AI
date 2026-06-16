// Content for the COMMUNITY page — typed bilingual { he, en }.
// Hebrew: warm, human, confident. English: crisp, global, declarative.
// Terminology follows BUILD_CONTRACT §8 exactly.

export interface FeedPost {
  author: string;
  handle: string;
  initials: string;
  role: string;
  time: string;
  body: string;
  hashtags: string[];
  likes: number;
  comments: number;
  topComment: { author: string; initials: string; body: string };
  pinned?: boolean;
}

export interface GroupCard {
  name: string;
  type: "public" | "private" | "vip";
  typeLabel: string;
  members: number;
  desc: string;
  online: number;
}

export interface ChatMessage {
  self?: boolean;
  author: string;
  initials?: string;
  text?: string;
  time: string;
  kind?: "text" | "file" | "voice" | "image";
  fileName?: string;
  fileMeta?: string;
  voiceLen?: string;
}

export interface Badge {
  name: string;
  desc: string;
  earned: boolean;
  glyph: string;
}

export interface LeaderRow {
  rank: number;
  name: string;
  initials: string;
  xp: number;
  delta: string;
  you?: boolean;
}

export interface Challenge {
  title: string;
  reward: string;
  progress: number; // 0..100
  state: string;
}

export interface DailyTask {
  text: string;
  xp: number;
  done: boolean;
}

export interface LiveClass {
  title: string;
  host: string;
  platform: "Zoom" | "Google Meet" | "Teams";
  time: string;
  status: "live" | "soon" | "scheduled";
  statusLabel: string;
  attendees: number;
}

export interface CalendarEvent {
  day: number;
  label: string;
  tone: "aurora" | "gold";
}

interface CommunityContent {
  meta: { title: string; description: string };
  hero: {
    tag: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { value: number; suffix?: string; prefix?: string; label: string }[];
  };
  feed: {
    title: string;
    subtitle: string;
    composerPlaceholder: string;
    composerPost: string;
    composerHints: string[];
    pinnedLabel: string;
    selfInitials: string;
    likeLabel: string;
    commentLabel: string;
    shareLabel: string;
    replyLabel: string;
    posts: FeedPost[];
  };
  groups: {
    title: string;
    subtitle: string;
    membersLabel: string;
    onlineLabel: string;
    joinLabel: string;
    requestLabel: string;
    enterLabel: string;
    cards: GroupCard[];
  };
  messaging: {
    title: string;
    subtitle: string;
    threadName: string;
    threadMeta: string;
    inputPlaceholder: string;
    callLabels: { voice: string; video: string };
    capabilities: string[];
    messages: ChatMessage[];
  };
  aiManager: {
    title: string;
    subtitle: string;
    botName: string;
    duties: { title: string; desc: string }[];
    feedNote: string;
    sampleActions: { actor: string; action: string; time: string }[];
  };
  gamification: {
    title: string;
    subtitle: string;
    xp: {
      levelLabel: string;
      level: number;
      title: string;
      current: number;
      next: number;
      toNextLabel: string;
    };
    streak: { days: number; label: string; sub: string; weekLabels: string[] };
    levels: { rangeLabel: string; note: string; milestones: { lvl: number; title: string }[] };
    badges: { title: string; earnedLabel: string; lockedLabel: string; items: Badge[] };
    leaderboard: {
      title: string;
      tabs: { id: string; label: string }[];
      activeTab: string;
      rows: LeaderRow[];
      xpLabel: string;
    };
    challenges: { title: string; items: Challenge[] };
    daily: { title: string; sub: string; tasks: DailyTask[]; totalLabel: string };
  };
  profile: {
    title: string;
    subtitle: string;
    name: string;
    handle: string;
    initials: string;
    bio: string;
    role: string;
    location: string;
    joined: string;
    stats: { value: string; label: string }[];
    badges: string[];
    followLabel: string;
    messageLabel: string;
    topBadgesLabel: string;
  };
  live: {
    title: string;
    subtitle: string;
    joinLabel: string;
    remindLabel: string;
    attendeesLabel: string;
    classes: LiveClass[];
    calendar: {
      monthLabel: string;
      weekdays: string[];
      events: CalendarEvent[];
      legend: { aurora: string; gold: string };
    };
  };
}

export const content: Record<"he" | "en", CommunityContent> = {
  he: {
    meta: {
      title: "קהילה — CourseFocus AI",
      description:
        "פיד, קבוצות, צ׳אט, ניהול AI, מערכת גיימיפיקציה מלאה ושיעורים חיים — כל מה שמחזיק את האקדמיה שלך חיה.",
    },
    hero: {
      tag: "הלב הפועם של האקדמיה",
      title: "כאן האקדמיה שלך מתעוררת לחיים.",
      subtitle:
        "פיד שמדבר, קבוצות שמתחברות, צ׳אט שזורם, ומערכת שלמה של דירוגים, סטריקים ותגים — מנוהלת על ידי AI שלא ישן. הקהילה היא לא תוסף. היא הסיבה שתלמידים נשארים.",
      ctaPrimary: "בנה את הקהילה שלך",
      ctaSecondary: "סיור בקהילה",
      stats: [
        { value: 12, suffix: "K+", label: "הודעות בשבוע" },
        { value: 94, suffix: "%", label: "השתתפות חודשית" },
        { value: 3.4, prefix: "×", label: "שימור גבוה יותר" },
      ],
    },
    feed: {
      title: "פיד הקהילה",
      subtitle:
        "פוסטים, תגובות, לייקים, אזכורים והאשטאגים — מרחב חי שבו תלמידים משתפים נצחונות, שואלים שאלות ובונים יחד.",
      composerPlaceholder: "מה למדת היום? שתף עם הקהילה…",
      composerPost: "פרסם",
      composerHints: ["@אזכור", "#האשטאג", "מדיה", "סקר"],
      pinnedLabel: "מוצמד",
      selfInitials: "את",
      likeLabel: "אהבתי",
      commentLabel: "תגובות",
      shareLabel: "שתף",
      replyLabel: "הגב",
      posts: [
        {
          author: "מאיה לוי",
          handle: "@maya",
          initials: "מל",
          role: "תלמידה · רמה 42",
          time: "לפני 12 דק׳",
          body: "סיימתי את מסלול ה-AI המתקדם ובניתי את הסוכן הראשון שלי שעובד בפרודקשן. הקהילה כאן שינתה לי את הקצב לגמרי. תודה ענקית ל@דניאל על הליווי 🙏",
          hashtags: ["#בוגרים", "#AIמתקדם"],
          likes: 248,
          comments: 37,
          topComment: {
            author: "דניאל כהן",
            initials: "דכ",
            body: "מטורף לראות את זה! ידעתי שתגיעי לשם 🚀",
          },
          pinned: true,
        },
        {
          author: "יואב אבני",
          handle: "@yoav",
          initials: "יא",
          role: "תלמיד · רמה 18",
          time: "לפני שעה",
          body: "מישהו עבר על תרגיל 4 בשיעור על automations? נתקעתי על הטריגר של הוובהוק ואשמח לכיוון.",
          hashtags: ["#שאלה", "#אוטומציות"],
          likes: 41,
          comments: 14,
          topComment: {
            author: "AI Community Manager",
            initials: "AI",
            body: "הוספתי תשובה מפורטת בקבוצת ׳אוטומציות׳ + סרטון של 2 דק׳ שמסביר בדיוק את זה.",
          },
        },
      ],
    },
    groups: {
      title: "קבוצות",
      subtitle:
        "ציבוריות, פרטיות ו-VIP. בנה מרחבים לפי נושא, מחזור או רמת מנוי — כל אחד עם הכללים, התוכן והאנשים שלו.",
      membersLabel: "חברים",
      onlineLabel: "מחוברים עכשיו",
      joinLabel: "הצטרף",
      requestLabel: "בקש גישה",
      enterLabel: "כניסה",
      cards: [
        {
          name: "מחזור 2025",
          type: "public",
          typeLabel: "ציבורית",
          members: 1840,
          online: 126,
          desc: "המרחב הראשי של כל התלמידים הפעילים — הכרויות, נצחונות ושאלות.",
        },
        {
          name: "מאסטרמיינד מתקדמים",
          type: "private",
          typeLabel: "פרטית",
          members: 312,
          online: 41,
          desc: "קבוצה סגורה למי שסיים את המסלול המתקדם. ביקורת עמיתים ופרויקטים.",
        },
        {
          name: "מעגל ה-VIP",
          type: "vip",
          typeLabel: "VIP",
          members: 48,
          online: 9,
          desc: "ליווי אישי, שיחות חודשיות ותוכן בלעדי. גישה למנויי הפרימיום בלבד.",
        },
      ],
    },
    messaging: {
      title: "הודעות וצ׳אט",
      subtitle:
        "אחד-על-אחד, קבוצות, קבצים, הודעות קוליות ושיחות וידאו — הכול בתוך האקדמיה, בלי לקפוץ לאפליקציה אחרת.",
      threadName: "מאסטרמיינד מתקדמים",
      threadMeta: "8 חברים · 3 מחוברים",
      inputPlaceholder: "כתוב הודעה…",
      callLabels: { voice: "שיחה קולית", video: "שיחת וידאו" },
      capabilities: ["1:1", "קבוצתי", "קבצים", "הודעה קולית", "וידאו"],
      messages: [
        {
          author: "נועה",
          initials: "נ",
          text: "העליתי את הגרסה החדשה של המצגת, תגידו לי מה דעתכם 👇",
          time: "09:41",
        },
        {
          author: "נועה",
          initials: "נ",
          kind: "file",
          fileName: "Academy-OS-Deck.pdf",
          fileMeta: "4.2MB · PDF",
          time: "09:41",
        },
        {
          self: true,
          author: "אני",
          text: "נראה מעולה. אהבתי במיוחד את הסליידים על המודל העסקי.",
          time: "09:43",
        },
        {
          author: "איתי",
          initials: "א",
          kind: "voice",
          voiceLen: "0:24",
          time: "09:45",
        },
        {
          self: true,
          author: "אני",
          text: "מתחילים וידאו עוד 5 דק׳?",
          time: "09:46",
        },
      ],
    },
    aiManager: {
      title: "מנהל הקהילה ה-AI",
      subtitle:
        "AI שמלווה את הקהילה 24/7 — מקבל את פני החדשים, עונה על שאלות, מסמן פוסטים שדורשים תשומת לב ושומר על האנרגיה גבוהה.",
      botName: "AI Community Manager",
      duties: [
        {
          title: "קבלת פנים אוטומטית",
          desc: "כל תלמיד חדש מקבל הודעה אישית, הכוונה לקבוצה הנכונה והמלצה על הצעד הבא.",
        },
        {
          title: "תשובות מיידיות",
          desc: "שאלות חוזרות נענות מתוך מאגר הידע של האקדמיה — בשפה שלך, מסביב לשעון.",
        },
        {
          title: "ניהול האנרגיה",
          desc: "מזהה שקט, מציף דיונים, מסמן צורך באדם אמיתי — ושומר על קהילה פעילה.",
        },
      ],
      feedNote: "פעולות אחרונות של ה-AI",
      sampleActions: [
        { actor: "AI", action: "קיבל בברכה את רוני ושייך אותה ל׳מחזור 2025׳", time: "עכשיו" },
        { actor: "AI", action: "ענה על שאלה ב׳אוטומציות׳ עם סרטון הסבר", time: "לפני 4 דק׳" },
        { actor: "AI", action: "סימן פוסט למנהל אנושי — דורש תשומת לב", time: "לפני 11 דק׳" },
      ],
    },
    gamification: {
      title: "מערכת ההתקדמות",
      subtitle:
        "XP, רמות 1–100, סטריקים, קיר תגים, דירוגים ואתגרים — אלגנטי ושאפתני, לא ילדותי. כל פעולה היא צעד קדימה.",
      xp: {
        levelLabel: "רמה",
        level: 42,
        title: "אסטרטג",
        current: 8420,
        next: 10000,
        toNextLabel: "נקודות לרמה הבאה",
      },
      streak: {
        days: 28,
        label: "ימי רצף",
        sub: "השיא האישי שלך: 41 ימים",
        weekLabels: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
      },
      levels: {
        rangeLabel: "מסע של 100 רמות",
        note: "כל רמה פותחת תגים, גישה ויוקרה בקהילה.",
        milestones: [
          { lvl: 1, title: "מתחיל" },
          { lvl: 25, title: "בונה" },
          { lvl: 50, title: "מומחה" },
          { lvl: 75, title: "מנטור" },
          { lvl: 100, title: "אגדה" },
        ],
      },
      badges: {
        title: "קיר התגים",
        earnedLabel: "הושג",
        lockedLabel: "נעול",
        items: [
          { name: "צעד ראשון", desc: "השלמת השיעור הראשון", earned: true, glyph: "star" },
          { name: "רצף של 30", desc: "30 ימי פעילות ברצף", earned: true, glyph: "flame" },
          { name: "מנטור", desc: "עזרת ל-50 תלמידים", earned: true, glyph: "hands" },
          { name: "בליין", desc: "סיימת מסלול שלם", earned: true, glyph: "trophy" },
          { name: "אלוף הדירוג", desc: "מקום ראשון שבועי", earned: false, glyph: "crown" },
          { name: "אגדה", desc: "הגעת לרמה 100", earned: false, glyph: "diamond" },
        ],
      },
      leaderboard: {
        title: "טבלת המובילים",
        tabs: [
          { id: "daily", label: "יומי" },
          { id: "weekly", label: "שבועי" },
          { id: "monthly", label: "חודשי" },
          { id: "all", label: "כל הזמנים" },
        ],
        activeTab: "weekly",
        xpLabel: "XP",
        rows: [
          { rank: 1, name: "מאיה לוי", initials: "מל", xp: 2840, delta: "+320" },
          { rank: 2, name: "דניאל כהן", initials: "דכ", xp: 2610, delta: "+180" },
          { rank: 3, name: "תמר בר", initials: "תב", xp: 2390, delta: "+240" },
          { rank: 4, name: "אתה", initials: "את", xp: 2180, delta: "+410", you: true },
          { rank: 5, name: "יואב אבני", initials: "יא", xp: 1970, delta: "+90" },
        ],
      },
      challenges: {
        title: "אתגרים פעילים",
        items: [
          { title: "השלם 5 שיעורים השבוע", reward: "+500 XP", progress: 60, state: "3 מתוך 5" },
          { title: "עזור ל-3 תלמידים בפיד", reward: "תג מנטור", progress: 66, state: "2 מתוך 3" },
          { title: "שמור על רצף 30 יום", reward: "+1000 XP", progress: 93, state: "28 מתוך 30" },
        ],
      },
      daily: {
        title: "משימות AI יומיות",
        sub: "נבחרות עבורך כל בוקר לפי ההתקדמות שלך",
        totalLabel: "סך XP היום",
        tasks: [
          { text: "צפה בשיעור ׳סוכני AI בפרודקשן׳", xp: 50, done: true },
          { text: "הגב על שאלה אחת בפיד הקהילה", xp: 30, done: true },
          { text: "השלם את הקוויז של מודול 7", xp: 80, done: false },
        ],
      },
    },
    profile: {
      title: "הפרופיל הציבורי",
      subtitle: "כרטיס הביקור של כל תלמיד בקהילה — הישגים, תגים ודירוג, במקום אחד.",
      name: "מאיה לוי",
      handle: "@maya",
      initials: "מל",
      bio: "בונה סוכני AI לעסקים. בוגרת המסלול המתקדם. כאן כדי ללמוד, לעזור ולגדול.",
      role: "אסטרטגית · רמה 42",
      location: "תל אביב",
      joined: "הצטרפה במרץ 2024",
      stats: [
        { value: "8,420", label: "XP" },
        { value: "12", label: "תגים" },
        { value: "#1", label: "דירוג שבועי" },
      ],
      badges: ["trophy", "flame", "hands", "star"],
      followLabel: "עקוב",
      messageLabel: "שלח הודעה",
      topBadgesLabel: "התגים הבולטים",
    },
    live: {
      title: "שיעורים חיים ויומן",
      subtitle:
        "Zoom, Google Meet ו-Teams — מחוברים ישירות לאקדמיה. הצטרף בלחיצה, קבל תזכורת, וכל מפגש מסונכרן ביומן.",
      joinLabel: "הצטרף עכשיו",
      remindLabel: "תזכיר לי",
      attendeesLabel: "נרשמו",
      classes: [
        {
          title: "סדנת AI חיה: בניית סוכן ראשון",
          host: "דניאל כהן",
          platform: "Zoom",
          time: "עכשיו · 19:00",
          status: "live",
          statusLabel: "משדר",
          attendees: 184,
        },
        {
          title: "שאלות ותשובות שבועי",
          host: "מאיה לוי",
          platform: "Google Meet",
          time: "מחר · 20:30",
          status: "soon",
          statusLabel: "בקרוב",
          attendees: 96,
        },
        {
          title: "מאסטרקלאס: מודל מנויים",
          host: "צוות CourseFocus",
          platform: "Teams",
          time: "יום ה׳ · 18:00",
          status: "scheduled",
          statusLabel: "מתוזמן",
          attendees: 230,
        },
      ],
      calendar: {
        monthLabel: "יוני 2026",
        weekdays: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
        events: [
          { day: 16, label: "חי", tone: "aurora" },
          { day: 17, label: "שו״ת", tone: "gold" },
          { day: 19, label: "קלאס", tone: "aurora" },
          { day: 24, label: "אתגר", tone: "gold" },
        ],
        legend: { aurora: "שיעור חי", gold: "אירוע קהילה" },
      },
    },
  },
  en: {
    meta: {
      title: "Community — CourseFocus AI",
      description:
        "Feed, groups, chat, AI management, a full gamification system, and live classes — everything that keeps your academy alive.",
    },
    hero: {
      tag: "The beating heart of your academy",
      title: "Where your academy comes alive.",
      subtitle:
        "A feed that talks, groups that connect, chat that flows, and a full system of leaderboards, streaks and badges — run by an AI that never sleeps. Community isn't an add-on. It's why students stay.",
      ctaPrimary: "Build your community",
      ctaSecondary: "Take the tour",
      stats: [
        { value: 12, suffix: "K+", label: "messages a week" },
        { value: 94, suffix: "%", label: "monthly participation" },
        { value: 3.4, prefix: "×", label: "higher retention" },
      ],
    },
    feed: {
      title: "Community Feed",
      subtitle:
        "Posts, comments, likes, mentions and hashtags — a living space where students share wins, ask questions and build together.",
      composerPlaceholder: "What did you learn today? Share it with the community…",
      composerPost: "Post",
      composerHints: ["@mention", "#hashtag", "Media", "Poll"],
      pinnedLabel: "Pinned",
      selfInitials: "YO",
      likeLabel: "Like",
      commentLabel: "Comments",
      shareLabel: "Share",
      replyLabel: "Reply",
      posts: [
        {
          author: "Maya Levi",
          handle: "@maya",
          initials: "ML",
          role: "Student · Level 42",
          time: "12m ago",
          body: "Just finished the Advanced AI track and shipped my first agent to production. This community completely changed my pace. Huge thanks to @daniel for the mentorship 🙏",
          hashtags: ["#alumni", "#advancedAI"],
          likes: 248,
          comments: 37,
          topComment: {
            author: "Daniel Cohen",
            initials: "DC",
            body: "Incredible to see this! I knew you'd get there 🚀",
          },
          pinned: true,
        },
        {
          author: "Yoav Avni",
          handle: "@yoav",
          initials: "YA",
          role: "Student · Level 18",
          time: "1h ago",
          body: "Has anyone gone through exercise 4 in the automations lesson? I'm stuck on the webhook trigger and would love a nudge.",
          hashtags: ["#question", "#automations"],
          likes: 41,
          comments: 14,
          topComment: {
            author: "AI Community Manager",
            initials: "AI",
            body: "I posted a full answer in the ‘Automations’ group plus a 2-min clip that walks through exactly this.",
          },
        },
      ],
    },
    groups: {
      title: "Groups",
      subtitle:
        "Public, private and VIP. Build spaces by topic, cohort or membership tier — each with its own rules, content and people.",
      membersLabel: "members",
      onlineLabel: "online now",
      joinLabel: "Join",
      requestLabel: "Request access",
      enterLabel: "Enter",
      cards: [
        {
          name: "Cohort 2025",
          type: "public",
          typeLabel: "Public",
          members: 1840,
          online: 126,
          desc: "The main space for every active student — intros, wins and questions.",
        },
        {
          name: "Advanced Mastermind",
          type: "private",
          typeLabel: "Private",
          members: 312,
          online: 41,
          desc: "A closed group for advanced-track graduates. Peer reviews and projects.",
        },
        {
          name: "The VIP Circle",
          type: "vip",
          typeLabel: "VIP",
          members: 48,
          online: 9,
          desc: "1:1 mentorship, monthly calls and exclusive content. Premium members only.",
        },
      ],
    },
    messaging: {
      title: "Messaging & Chat",
      subtitle:
        "One-to-one, groups, files, voice notes and video calls — all inside your academy, with nothing bouncing out to another app.",
      threadName: "Advanced Mastermind",
      threadMeta: "8 members · 3 online",
      inputPlaceholder: "Write a message…",
      callLabels: { voice: "Voice call", video: "Video call" },
      capabilities: ["1:1", "Group", "Files", "Voice", "Video"],
      messages: [
        {
          author: "Noa",
          initials: "N",
          text: "Uploaded the new version of the deck — tell me what you think 👇",
          time: "09:41",
        },
        {
          author: "Noa",
          initials: "N",
          kind: "file",
          fileName: "Academy-OS-Deck.pdf",
          fileMeta: "4.2MB · PDF",
          time: "09:41",
        },
        {
          self: true,
          author: "You",
          text: "Looks great. Loved the slides on the business model especially.",
          time: "09:43",
        },
        {
          author: "Itai",
          initials: "I",
          kind: "voice",
          voiceLen: "0:24",
          time: "09:45",
        },
        {
          self: true,
          author: "You",
          text: "Hop on a video in 5?",
          time: "09:46",
        },
      ],
    },
    aiManager: {
      title: "AI Community Manager",
      subtitle:
        "An AI that runs the community 24/7 — welcomes newcomers, answers questions, flags posts that need a human, and keeps the energy high.",
      botName: "AI Community Manager",
      duties: [
        {
          title: "Automatic welcomes",
          desc: "Every new student gets a personal message, a nudge to the right group, and a next step.",
        },
        {
          title: "Instant answers",
          desc: "Recurring questions are answered from your academy's knowledge base — in your voice, around the clock.",
        },
        {
          title: "Energy management",
          desc: "Detects silence, surfaces discussions, flags when a human is needed — and keeps the room alive.",
        },
      ],
      feedNote: "Recent AI activity",
      sampleActions: [
        { actor: "AI", action: "Welcomed Roni and added her to ‘Cohort 2025’", time: "now" },
        { actor: "AI", action: "Answered a question in ‘Automations’ with a clip", time: "4m ago" },
        { actor: "AI", action: "Flagged a post for a human moderator", time: "11m ago" },
      ],
    },
    gamification: {
      title: "The progression system",
      subtitle:
        "XP, levels 1–100, streaks, a badge wall, leaderboards and challenges — elegant and aspirational, never childish. Every action moves you forward.",
      xp: {
        levelLabel: "Level",
        level: 42,
        title: "Strategist",
        current: 8420,
        next: 10000,
        toNextLabel: "XP to next level",
      },
      streak: {
        days: 28,
        label: "day streak",
        sub: "Your personal best: 41 days",
        weekLabels: ["S", "M", "T", "W", "T", "F", "S"],
      },
      levels: {
        rangeLabel: "A journey of 100 levels",
        note: "Each level unlocks badges, access and standing in the community.",
        milestones: [
          { lvl: 1, title: "Newcomer" },
          { lvl: 25, title: "Builder" },
          { lvl: 50, title: "Expert" },
          { lvl: 75, title: "Mentor" },
          { lvl: 100, title: "Legend" },
        ],
      },
      badges: {
        title: "The badge wall",
        earnedLabel: "Earned",
        lockedLabel: "Locked",
        items: [
          { name: "First Step", desc: "Completed your first lesson", earned: true, glyph: "star" },
          { name: "30-Day Streak", desc: "30 consecutive active days", earned: true, glyph: "flame" },
          { name: "Mentor", desc: "Helped 50 students", earned: true, glyph: "hands" },
          { name: "Finisher", desc: "Completed a full track", earned: true, glyph: "trophy" },
          { name: "Top of the Board", desc: "First place this week", earned: false, glyph: "crown" },
          { name: "Legend", desc: "Reached level 100", earned: false, glyph: "diamond" },
        ],
      },
      leaderboard: {
        title: "Leaderboard",
        tabs: [
          { id: "daily", label: "Daily" },
          { id: "weekly", label: "Weekly" },
          { id: "monthly", label: "Monthly" },
          { id: "all", label: "All-time" },
        ],
        activeTab: "weekly",
        xpLabel: "XP",
        rows: [
          { rank: 1, name: "Maya Levi", initials: "ML", xp: 2840, delta: "+320" },
          { rank: 2, name: "Daniel Cohen", initials: "DC", xp: 2610, delta: "+180" },
          { rank: 3, name: "Tamar Bar", initials: "TB", xp: 2390, delta: "+240" },
          { rank: 4, name: "You", initials: "YO", xp: 2180, delta: "+410", you: true },
          { rank: 5, name: "Yoav Avni", initials: "YA", xp: 1970, delta: "+90" },
        ],
      },
      challenges: {
        title: "Active challenges",
        items: [
          { title: "Complete 5 lessons this week", reward: "+500 XP", progress: 60, state: "3 of 5" },
          { title: "Help 3 students in the feed", reward: "Mentor badge", progress: 66, state: "2 of 3" },
          { title: "Hold a 30-day streak", reward: "+1000 XP", progress: 93, state: "28 of 30" },
        ],
      },
      daily: {
        title: "Daily AI tasks",
        sub: "Picked for you every morning based on your progress",
        totalLabel: "XP available today",
        tasks: [
          { text: "Watch ‘AI agents in production’", xp: 50, done: true },
          { text: "Reply to one question in the feed", xp: 30, done: true },
          { text: "Finish the Module 7 quiz", xp: 80, done: false },
        ],
      },
    },
    profile: {
      title: "The public profile",
      subtitle: "Every student's calling card in the community — achievements, badges and rank in one place.",
      name: "Maya Levi",
      handle: "@maya",
      initials: "ML",
      bio: "Building AI agents for businesses. Advanced-track graduate. Here to learn, help and grow.",
      role: "Strategist · Level 42",
      location: "Tel Aviv",
      joined: "Joined March 2024",
      stats: [
        { value: "8,420", label: "XP" },
        { value: "12", label: "Badges" },
        { value: "#1", label: "Weekly rank" },
      ],
      badges: ["trophy", "flame", "hands", "star"],
      followLabel: "Follow",
      messageLabel: "Message",
      topBadgesLabel: "Top badges",
    },
    live: {
      title: "Live classes & calendar",
      subtitle:
        "Zoom, Google Meet and Teams — wired straight into your academy. Join in one click, get a reminder, and every session syncs to the calendar.",
      joinLabel: "Join now",
      remindLabel: "Remind me",
      attendeesLabel: "registered",
      classes: [
        {
          title: "Live AI workshop: build your first agent",
          host: "Daniel Cohen",
          platform: "Zoom",
          time: "Now · 19:00",
          status: "live",
          statusLabel: "Live",
          attendees: 184,
        },
        {
          title: "Weekly Q&A",
          host: "Maya Levi",
          platform: "Google Meet",
          time: "Tomorrow · 20:30",
          status: "soon",
          statusLabel: "Soon",
          attendees: 96,
        },
        {
          title: "Masterclass: the subscription model",
          host: "CourseFocus team",
          platform: "Teams",
          time: "Thu · 18:00",
          status: "scheduled",
          statusLabel: "Scheduled",
          attendees: 230,
        },
      ],
      calendar: {
        monthLabel: "June 2026",
        weekdays: ["S", "M", "T", "W", "T", "F", "S"],
        events: [
          { day: 16, label: "Live", tone: "aurora" },
          { day: 17, label: "Q&A", tone: "gold" },
          { day: 19, label: "Class", tone: "aurora" },
          { day: 24, label: "Quest", tone: "gold" },
        ],
        legend: { aurora: "Live class", gold: "Community event" },
      },
    },
  },
};

export default content;

import type { Metadata } from "next";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { CTASection } from "@/components/shared";
import { Reveal } from "@/components/ui";
import { content } from "@/content/ai";
import {
  AIHero,
  StatBand,
  CapabilityIntro,
  CapabilitySplit,
  ChatPanel,
  ModelSelector,
  ClosingLine,
  CourseOutlineMock,
  CurriculumPath,
  LessonPlayerMock,
  ReviewerCard,
  ExamCard,
  AdvisorDashboard,
  CommunityActivity,
  ContentStudioMock,
  DailyTasksMock,
  KnowledgeBaseMock,
  VoiceCoachMock,
  MentorNetwork,
} from "@/components/ai";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = content[locale].meta;
  return { title: t.title, description: t.description };
}

export default async function AIPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = content[locale];

  return (
    <>
      {/* 1 — Hero: central-AI orbit + live academy chat */}
      <AIHero locale={locale} />

      {/* 2 — Quiet stat band */}
      <StatBand locale={locale} />

      {/* 3 — Course Generator: prompt → full course (visual leads) */}
      <CapabilitySplit
        section={t.courseGen}
        visual={<CourseOutlineMock data={t.courseGen} />}
        visualFirst
        balance="visual-wide"
      />

      {/* 4 — Curriculum Designer: Beginner → Expert path */}
      <CapabilitySplit
        section={t.curriculum}
        visual={<CurriculumPath data={t.curriculum} />}
        balance="text-wide"
      />

      {/* 5 — Personal Tutor: chat that remembers the student */}
      <CapabilitySplit
        section={t.tutor}
        visual={
          <ChatPanel
            title={t.tutor.tag}
            subtitle={`${t.tutor.studentName} · ${t.tutor.courseName}`}
            turns={t.tutor.chat}
            placeholder=""
          />
        }
        visualFirst
      />

      {/* 6 — Lesson Assistant: video player + in-lesson chat */}
      <CapabilitySplit
        section={t.lessonAssistant}
        visual={<LessonPlayerMock data={t.lessonAssistant} />}
        balance="visual-wide"
      />

      {/* 7 — Assignment Reviewer: graded card */}
      <CapabilitySplit
        section={t.reviewer}
        visual={<ReviewerCard data={t.reviewer} />}
        visualFirst
      />

      {/* 8 — Exam Generator: settings + questions */}
      <CapabilitySplit
        section={t.exam}
        visual={<ExamCard data={t.exam} />}
      />

      {/* 9 — Business Advisor + Growth Coach: analytics dashboard (full-bleed visual) */}
      <CapabilitySplit
        section={t.advisor}
        visual={<AdvisorDashboard data={t.advisor} />}
        visualFirst
        balance="visual-wide"
      />

      {/* 10 — Community Manager: AI activity log */}
      <CapabilitySplit
        section={t.community}
        visual={<CommunityActivity data={t.community} />}
      />

      {/* 11 — Content Studio: one request → many outputs */}
      <CapabilitySplit
        section={t.contentStudio}
        visual={<ContentStudioMock data={t.contentStudio} />}
        visualFirst
      />

      {/* 12 — Daily AI Tasks: full-width two-pane agenda */}
      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-[44rem] text-center">
          <CapabilityIntro section={t.dailyTasks} align="center" />
        </Reveal>
        <Reveal y={26} delay={0.05} className="mt-10">
          <DailyTasksMock data={t.dailyTasks} />
        </Reveal>
      </section>

      {/* 13 — Multi-AI Layer: full-width interactive selector */}
      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-[44rem] text-center">
          <CapabilityIntro section={t.multiAI} align="center" />
        </Reveal>
        <Reveal y={26} delay={0.05} className="mt-10">
          <ModelSelector locale={locale} />
        </Reveal>
      </section>

      {/* 14 — Knowledge Base: upload → learns */}
      <CapabilitySplit
        section={t.knowledge}
        visual={<KnowledgeBaseMock data={t.knowledge} />}
        visualFirst
      />

      {/* 15 — Voice Coach: voice session surface */}
      <CapabilitySplit
        section={t.voice}
        visual={<VoiceCoachMock data={t.voice} />}
      />

      {/* 16 — Mentor Network: full-width roster */}
      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-[44rem] text-center">
          <CapabilityIntro section={t.mentors} align="center" />
        </Reveal>
        <Reveal y={26} delay={0.05} className="mt-10">
          <MentorNetwork data={t.mentors} />
        </Reveal>
      </section>

      {/* Closing thesis + shared CTA */}
      <ClosingLine locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}

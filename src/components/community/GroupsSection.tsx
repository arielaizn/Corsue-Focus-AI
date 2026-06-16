import { Reveal, SectionHeading } from "@/components/ui";
import type { content } from "@/content/community";
import { Avatar } from "./Avatar";
import { GlobeIcon, LockIcon, CrownIcon } from "./icons";

type Locale = "he" | "en";
type T = (typeof content)[Locale]["groups"];
type Card = T["cards"][number];

const typeMeta = {
  public: {
    Icon: GlobeIcon,
    chip: "text-[oklch(0.8_0.1_200)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.12_200_/_0.4)]",
  },
  private: {
    Icon: LockIcon,
    chip: "text-violet-bright [box-shadow:inset_0_0_0_1px_oklch(0.62_0.215_294_/_0.45)]",
  },
  vip: {
    Icon: CrownIcon,
    chip: "text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)] bg-[oklch(0.83_0.13_88_/_0.1)]",
  },
} as const;

function GroupTile({ card, t, featured }: { card: Card; t: T; featured?: boolean }) {
  const meta = typeMeta[card.type];
  const cta =
    card.type === "public" ? t.joinLabel : card.type === "private" ? t.requestLabel : t.enterLabel;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-[16px] p-5 sm:p-6 ${
        card.type === "vip"
          ? "bg-surface glow-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4),inset_0_1px_0_oklch(1_0_0_/_0.06),0_36px_110px_-42px_oklch(0.83_0.13_88_/_0.45)]"
          : "panel-premium"
      } ${featured && card.type !== "vip" ? "glow-aurora" : ""}`}
    >
      {card.type === "vip" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[oklch(0.83_0.13_88_/_0.12)] blur-3xl"
        />
      )}
      <div className="relative flex items-center justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.chip}`}
        >
          <meta.Icon size={13} />
          {card.typeLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-status-online" />
          {card.online} {t.onlineLabel}
        </span>
      </div>

      <h3 className="relative mt-4 text-lg font-semibold text-ink sm:text-xl">{card.name}</h3>
      <p className={`relative mt-2 text-pretty text-sm leading-relaxed text-ink-soft ${featured ? "max-w-[46ch]" : ""}`}>
        {card.desc}
      </p>

      <div className="relative mt-auto flex items-center justify-between gap-3 pt-5">
        <div className="flex items-center">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {["AB", "CD", "EF"].map((s) => (
              <Avatar key={s} initials={s} size={28} ring />
            ))}
          </div>
          <span className="ms-3 text-xs text-muted">
            {card.members.toLocaleString()} {t.membersLabel}
          </span>
        </div>
        <span
          className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            card.type === "vip"
              ? "bg-gold-grad text-bg-deep [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.25)]"
              : "text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)] group-hover:bg-surface-2/70"
          }`}
        >
          {cta}
        </span>
      </div>
    </div>
  );
}

export function GroupsSection({ t }: { t: T }) {
  const [first, ...rest] = t.cards;
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:py-28">
      <Reveal>
        <SectionHeading title={t.title} subtitle={t.subtitle} />
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
        <Reveal className="md:row-span-2" y={26}>
          <GroupTile card={first} t={t} featured />
        </Reveal>
        {rest.map((c, i) => (
          <Reveal key={c.name} y={26} delay={0.06 * (i + 1)}>
            <GroupTile card={c} t={t} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default GroupsSection;

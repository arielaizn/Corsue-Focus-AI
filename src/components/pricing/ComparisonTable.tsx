"use client";

import { Fragment } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import type { PricingContent } from "@/content/pricing";
import { CheckIcon, DashIcon } from "./icons";

interface Props {
  locale: Locale;
  t: PricingContent["comparison"];
}

function Cell({
  value,
  yes,
  no,
  highlight,
}: {
  value: boolean | string;
  yes: string;
  no: string;
  highlight: boolean;
}) {
  if (typeof value === "string") {
    return (
      <span
        className={cn(
          "text-sm font-medium",
          highlight ? "text-ink" : "text-ink-soft",
        )}
      >
        {value}
      </span>
    );
  }
  if (value) {
    return (
      <span className="inline-grid place-items-center">
        <span className="sr-only">{yes}</span>
        <CheckIcon
          className={cn("size-4", highlight ? "text-gold" : "text-primary-bright")}
        />
      </span>
    );
  }
  return (
    <span className="inline-grid place-items-center">
      <span className="sr-only">{no}</span>
      <DashIcon className="size-4 text-muted/60" />
    </span>
  );
}

export function ComparisonTable({ locale, t }: Props) {
  const proIndex = 1; // Pro column highlighted
  return (
    <div className="overflow-x-auto rounded-2xl bg-surface/30 ring-line">
      <table className="w-full min-w-[640px] border-collapse text-start">
        <caption className="sr-only">
          {locale === "he"
            ? "השוואת יכולות בין התוכניות"
            : "Feature comparison across plans"}
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="bg-surface/80 px-5 py-4 text-start text-sm font-semibold text-ink-soft"
            >
              {locale === "he" ? "יכולת" : "Capability"}
            </th>
            {t.columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={cn(
                  "px-4 py-4 text-center font-[family-name:var(--font-display)] text-sm font-semibold [.font-he_&]:font-[family-name:var(--font-he)]",
                  i === proIndex
                    ? "text-gold [box-shadow:inset_0_1px_0_0_oklch(0.82_0.135_84_/_0.4)]"
                    : "text-ink",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.groups.map((g) => (
            <Fragment key={g.group}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={t.columns.length + 1}
                  className="bg-bg-deep/40 px-5 pb-2 pt-5 text-start text-xs font-semibold uppercase tracking-wider text-gold/80"
                >
                  {g.group}
                </th>
              </tr>
              {g.rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-t border-line/60 transition-colors hover:bg-surface/40"
                >
                  <th
                    scope="row"
                    className="px-5 py-3 text-start text-sm font-normal text-ink-soft"
                  >
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-4 py-3 text-center",
                        i === proIndex && "bg-[oklch(0.82_0.135_84_/_0.05)]",
                      )}
                    >
                      <Cell
                        value={v}
                        yes={t.yes}
                        no={t.no}
                        highlight={i === proIndex}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;

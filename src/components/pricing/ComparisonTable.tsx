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
          className={cn("size-4", highlight ? "text-gold" : "text-ink-soft")}
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
    <div
      className="panel-couture overflow-x-auto overflow-y-clip [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] sm:[mask-image:none]"
      tabIndex={0}
      role="region"
      aria-label={
        locale === "he" ? "השוואת תוכניות — ניתן לגלול לצדדים" : "Plan comparison — scroll for more"
      }
    >
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
              className="bg-surface-2 px-6 py-5 text-start text-sm font-semibold text-ink"
            >
              {locale === "he" ? "יכולת" : "Capability"}
            </th>
            {t.columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={cn(
                  "px-5 py-5 text-center font-[family-name:var(--font-display)] text-base font-medium tracking-[-0.01em] [.font-he_&]:font-[family-name:var(--font-he-display)] [.font-he_&]:font-bold",
                  i === proIndex
                    ? "text-gold bg-[oklch(0.76_0.105_80_/_0.06)] [box-shadow:inset_0_1px_0_0_oklch(0.76_0.105_80_/_0.5)]"
                    : "bg-surface-2 text-ink",
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
                  className="text-gilt bg-bg-deep/50 px-6 pb-3 pt-6 text-start"
                >
                  {g.group}
                </th>
              </tr>
              {g.rows.map((row) => (
                <tr
                  key={row.label}
                  className="[border-top:1px_solid_oklch(0.32_0.004_70_/_0.5)] transition-colors hover:bg-surface/50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-start text-sm font-normal text-ink-soft"
                  >
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={cn(
                        "px-5 py-4 text-center",
                        i === proIndex && "bg-[oklch(0.76_0.105_80_/_0.05)]",
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

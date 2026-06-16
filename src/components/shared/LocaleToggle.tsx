"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, swapLocaleInPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export interface LocaleToggleProps {
  current: Locale;
  className?: string;
}

export function LocaleToggle({ current, className }: LocaleToggleProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full p-0.5 [box-shadow:inset_0_0_0_1px_var(--color-line)]",
        className,
      )}
    >
      {locales.map((l) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            aria-pressed={active}
            aria-label={l === "he" ? "עברית" : "English"}
            onClick={() => router.push(swapLocaleInPath(pathname, l))}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors",
              active
                ? "bg-surface-2 text-ink"
                : "text-muted hover:text-ink-soft",
            )}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

export default LocaleToggle;

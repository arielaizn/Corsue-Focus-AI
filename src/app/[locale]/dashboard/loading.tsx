/**
 * Dashboard loading state — premium "Midnight Atelier" skeleton.
 * Calm animate-pulse bars on the dark surface, mirroring the StatCard grid +
 * panel layout so the shell never shows a blank frozen frame while RLS-scoped
 * Supabase reads resolve. globals.css neutralizes the pulse under
 * prefers-reduced-motion, so this is accessibility-safe by default.
 */

function Bar({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-surface-2/40 ${className}`} />
  );
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      {/* Header block */}
      <div className="flex flex-col gap-3">
        <Bar className="h-3 w-28" />
        <Bar className="h-8 w-64" />
        <Bar className="h-3 w-80 max-w-full" />
      </div>

      {/* StatCard grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="panel-premium flex flex-col gap-4 p-5"
          >
            <div className="flex items-center justify-between">
              <Bar className="h-3 w-20" />
              <Bar className="size-5 rounded-lg" />
            </div>
            <Bar className="h-8 w-16" />
            <Bar className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Content panel */}
      <div className="panel-premium flex flex-col gap-4 p-6">
        <Bar className="h-4 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Bar key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from 'react'
import { MousePointerClick } from 'lucide-react'

interface ActivityCardProps {
  title: string
  instructions?: string
  children: ReactNode
}

/** Frame for ungraded practice activities. */
export function ActivityCard({ title, instructions, children }: ActivityCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-100/60 p-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3 pb-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <MousePointerClick className="size-4 text-indigo-600" />
          {title}
        </p>
        <span className="text-xs font-medium text-slate-500">Práctica · sin calificación</span>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        {instructions && <p className="mb-4 text-sm text-slate-500">{instructions}</p>}
        {children}
      </div>
    </section>
  )
}

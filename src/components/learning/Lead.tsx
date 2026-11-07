import type { ReactNode } from 'react'

/** Short introductory paragraph for a lesson. */
export function Lead({ children }: { children: ReactNode }) {
  return <p className="max-w-prose text-base leading-relaxed text-slate-600">{children}</p>
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</h3>
}

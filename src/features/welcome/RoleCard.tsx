import { ArrowRight } from 'lucide-react'
import type { Role } from '../../types'
import { cn } from '../../utils/cn'

export interface RoleCardStatus {
  /** e.g. "En progreso · 3 de 9 lecciones" */
  progress?: string
  lastResult?: { label: string; passed: boolean }
}

interface RoleCardProps {
  role: Role
  status?: RoleCardStatus
  onSelect: (role: Role) => void
}

export function RoleCard({ role, status, onSelect }: RoleCardProps) {
  const Icon = role.icon

  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className="group flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600">
        <Icon className="size-5" />
      </span>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{role.name}</h3>
      <p className="mt-1 text-sm font-medium text-slate-700">{role.tagline}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">{role.description}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {role.focus.map((item) => (
          <span
            key={item}
            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
          >
            {item}
          </span>
        ))}
      </div>

      {(status?.progress || status?.lastResult) && (
        <div className="mt-5 flex flex-wrap gap-1.5 text-xs font-medium">
          {status.progress && (
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700">{status.progress}</span>
          )}
          {status.lastResult && (
            <span
              className={cn(
                'rounded-md px-2 py-0.5',
                status.lastResult.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
              )}
            >
              {status.lastResult.label}
            </span>
          )}
        </div>
      )}

      <span className="mt-6 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-sm font-medium text-indigo-600">
        {status?.progress ? 'Continuar' : 'Seleccionar rol'}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}

import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface FlowStep {
  title: string
  description?: string
  icon: LucideIcon
  actor?: 'system' | 'user'
}

interface FlowDiagramProps {
  steps: FlowStep[]
  layout?: 'vertical' | 'horizontal'
}

const actorLabel = { system: 'Sistema', user: 'Usuario' } as const

function ActorChip({ actor }: { actor: 'system' | 'user' }) {
  return (
    <span
      className={cn(
        'rounded-md px-1.5 py-0.5 text-[11px] font-medium',
        actor === 'system' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700',
      )}
    >
      {actorLabel[actor]}
    </span>
  )
}

export function FlowDiagram({ steps, layout = 'vertical' }: FlowDiagramProps) {
  if (layout === 'horizontal') {
    return (
      <ol className="grid gap-3 md:grid-flow-col md:auto-cols-fr">
        {steps.map((step, i) => (
          <li key={step.title} className="relative">
            <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <step.icon className="size-4.5" />
                </span>
                {step.actor && <ActorChip actor={step.actor} />}
              </div>
              <p className="mt-3 text-xs font-medium text-slate-400">Paso {i + 1}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{step.title}</p>
              {step.description && (
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.description}</p>
              )}
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-slate-50 text-slate-400 md:block" />
            )}
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const isUser = step.actor === 'user'
        return (
          <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
            {!isLast && (
              <span className="absolute top-10 bottom-0 left-[19px] w-px bg-slate-200" aria-hidden />
            )}
            <span
              className={cn(
                'relative flex size-10 shrink-0 items-center justify-center rounded-full ring-4 ring-slate-50',
                isUser ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white',
              )}
            >
              <step.icon className="size-4.5" />
            </span>
            <div className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-400">{i + 1}</span>
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                {step.actor && <ActorChip actor={step.actor} />}
              </div>
              {step.description && (
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.description}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

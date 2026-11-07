import type { ReactNode } from 'react'
import { OctagonAlert } from 'lucide-react'
import type { CriterionStatus, Score } from '../../types/simulation'
import { cn } from '../../utils/cn'

const statusStyles: Record<CriterionStatus, { label: string; className: string }> = {
  achieved: { label: 'Logrado', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  partial: { label: 'Parcial', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  missed: { label: 'No logrado', className: 'bg-rose-50 text-rose-700 ring-rose-200' },
}

export function StatusChip({ status }: { status: CriterionStatus }) {
  return (
    <span className={cn('rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset', statusStyles[status].className)}>
      {statusStyles[status].label}
    </span>
  )
}

const scoreTone: Record<Score, string> = {
  2: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  1: 'bg-amber-50 text-amber-700 ring-amber-200',
  0: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export function ScoreChip({ score }: { score: Score }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset', scoreTone[score])}>
      {score}/2 pts
    </span>
  )
}

export function CriticalChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-1.5 py-0.5 text-xs font-semibold text-white">
      <OctagonAlert className="size-3.5" />
      Error crítico
    </span>
  )
}

interface ChatMessageProps {
  from: 'customer' | 'participant'
  author: string
  initials: string
  children: ReactNode
  meta?: ReactNode
}

/** Conversation bubble: customer on the left, participant on the right. */
export function ChatMessage({ from, author, initials, children, meta }: ChatMessageProps) {
  const isCustomer = from === 'customer'
  return (
    <div className={cn('motion-safe:animate-enter flex gap-3', !isCustomer && 'flex-row-reverse')}>
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
          isCustomer ? 'bg-slate-200 text-slate-700' : 'bg-indigo-600 text-white',
        )}
      >
        {initials}
      </span>
      <div className={cn('flex max-w-[85%] flex-col gap-1', !isCustomer && 'items-end')}>
        <span className="text-xs font-medium text-slate-500">{author}</span>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
            isCustomer
              ? 'rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-xs'
              : 'rounded-tr-sm bg-indigo-600 text-white',
          )}
        >
          {children}
        </div>
        {meta && <div className="flex flex-wrap items-center gap-1.5">{meta}</div>}
      </div>
    </div>
  )
}

import { useState, type ReactNode } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface RevealCardProps {
  icon: LucideIcon
  title: string
  prompt?: string
  children: ReactNode
}

export function RevealCard({ icon: Icon, title, prompt = 'Ver cómo actuar', children }: RevealCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={cn(
        'rounded-xl border bg-white shadow-xs transition-colors',
        open ? 'border-indigo-200' : 'border-slate-200 hover:border-slate-300',
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-start gap-3 rounded-xl p-4 text-left focus-visible:outline-2 focus-visible:outline-indigo-600"
      >
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            open ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600',
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-slate-900">{title}</span>
          <span className="mt-0.5 block text-xs font-medium text-indigo-600">
            {open ? 'Ocultar' : prompt}
          </span>
        </span>
        <ChevronDown
          className={cn('mt-1 size-4 text-slate-400 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="motion-safe:animate-enter border-t border-slate-100 px-4 pt-3 pb-4 text-sm leading-relaxed text-slate-600">
          {children}
        </div>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps {
  children: ReactNode
  tone?: 'neutral' | 'indigo'
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        tone === 'indigo'
          ? 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100'
          : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200',
        className,
      )}
    >
      {children}
    </span>
  )
}

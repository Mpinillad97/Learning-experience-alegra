import type { ReactNode } from 'react'
import { CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

type Tone = 'info' | 'warning' | 'success'

const tones: Record<Tone, { box: string; icon: string; Icon: LucideIcon }> = {
  info: { box: 'border-indigo-100 bg-indigo-50/60', icon: 'text-indigo-600', Icon: Info },
  warning: { box: 'border-amber-200/80 bg-amber-50/70', icon: 'text-amber-600', Icon: TriangleAlert },
  success: { box: 'border-emerald-200/80 bg-emerald-50/70', icon: 'text-emerald-600', Icon: CircleCheck },
}

interface CalloutProps {
  tone?: Tone
  title?: string
  children: ReactNode
}

export function Callout({ tone = 'info', title, children }: CalloutProps) {
  const { box, icon, Icon } = tones[tone]

  return (
    <div className={cn('flex gap-3 rounded-xl border p-4', box)}>
      <Icon className={cn('mt-0.5 size-5 shrink-0', icon)} />
      <div className="text-sm leading-relaxed text-slate-700">
        {title && <p className="font-semibold text-slate-900">{title}</p>}
        <div className={cn(title && 'mt-1')}>{children}</div>
      </div>
    </div>
  )
}

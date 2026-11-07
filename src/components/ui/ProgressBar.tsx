import { cn } from '../../utils/cn'

interface ProgressBarProps {
  /** Value between 0 and 1. */
  value: number
  className?: string
  label?: string
}

export function ProgressBar({ value, className, label = 'Progreso' }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70', className)}
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

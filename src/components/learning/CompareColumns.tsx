import { CircleCheck, CircleX } from 'lucide-react'
import { cn } from '../../utils/cn'

interface Column {
  title: string
  items: string[]
}

interface CompareColumnsProps {
  positive: Column
  negative: Column
}

function ColumnCard({ column, kind }: { column: Column; kind: 'positive' | 'negative' }) {
  const isPositive = kind === 'positive'
  const Icon = isPositive ? CircleCheck : CircleX

  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-5 shadow-xs',
        isPositive ? 'border-emerald-200' : 'border-rose-200',
      )}
    >
      <p
        className={cn(
          'flex items-center gap-2 text-sm font-semibold',
          isPositive ? 'text-emerald-700' : 'text-rose-700',
        )}
      >
        <span
          className={cn(
            'flex size-7 items-center justify-center rounded-lg',
            isPositive ? 'bg-emerald-50' : 'bg-rose-50',
          )}
        >
          <Icon className="size-4" />
        </span>
        {column.title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {column.items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
            <Icon
              className={cn('mt-0.5 size-4 shrink-0', isPositive ? 'text-emerald-500' : 'text-rose-400')}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CompareColumns({ positive, negative }: CompareColumnsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ColumnCard column={positive} kind="positive" />
      <ColumnCard column={negative} kind="negative" />
    </div>
  )
}

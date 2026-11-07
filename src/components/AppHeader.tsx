import { Check, History } from 'lucide-react'
import { experience } from '../data/experience'
import { cn } from '../utils/cn'

interface AppHeaderProps {
  onHome: () => void
  onResults: () => void
  resultsActive?: boolean
}

export function AppHeader({ onHome, onResults, resultsActive = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={onHome}
          className="flex cursor-pointer items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Check className="size-4" strokeWidth={2.75} />
          </span>
          <span className="text-sm font-semibold tracking-tight">{experience.name}</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-500 md:block">{experience.product}</span>
          <button
            type="button"
            onClick={onResults}
            aria-current={resultsActive ? 'page' : undefined}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors',
              resultsActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )}
          >
            <History className="size-4" />
            Resultados
          </button>
        </div>
      </div>
    </header>
  )
}

import { useState } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ClassifyCategory {
  id: string
  label: string
}

export interface ClassifyItem {
  text: string
  answer: string
  feedback: string
}

interface ClassifyActivityProps {
  categories: ClassifyCategory[]
  items: ClassifyItem[]
}

/** Each item is classified into one category with immediate per-item feedback. */
export function ClassifyActivity({ categories, items }: ClassifyActivityProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const correctCount = items.filter((item, i) => answers[i] === item.answer).length

  return (
    <div>
      <ul className="space-y-3">
        {items.map((item, i) => {
          const chosen = answers[i]
          const isCorrect = chosen === item.answer
          return (
            <li
              key={item.text}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                chosen === undefined && 'border-slate-200',
                chosen !== undefined && isCorrect && 'border-emerald-200 bg-emerald-50/40',
                chosen !== undefined && !isCorrect && 'border-rose-200 bg-rose-50/40',
              )}
            >
              <p className="text-sm font-medium leading-relaxed text-slate-800">{item.text}</p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Clasificación">
                {categories.map((category) => {
                  const isChosen = chosen === category.id
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={isChosen}
                      disabled={isCorrect}
                      onClick={() => setAnswers((prev) => ({ ...prev, [i]: category.id }))}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                        isChosen && isCorrect && 'border-emerald-600 bg-emerald-600 text-white',
                        isChosen && !isCorrect && 'border-rose-500 bg-rose-500 text-white',
                        !isChosen && 'border-slate-200 bg-white text-slate-600',
                        !isChosen && !isCorrect && 'cursor-pointer hover:border-indigo-300 hover:text-indigo-700',
                        !isChosen && isCorrect && 'opacity-50',
                      )}
                    >
                      {category.label}
                    </button>
                  )
                })}
              </div>
              {chosen !== undefined && (
                <p
                  key={chosen}
                  role="status"
                  className={cn(
                    'motion-safe:animate-enter mt-3 flex gap-2 text-sm leading-relaxed',
                    isCorrect ? 'text-emerald-800' : 'text-rose-800',
                  )}
                >
                  {isCorrect ? (
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <CircleX className="mt-0.5 size-4 shrink-0 text-rose-500" />
                  )}
                  <span>{isCorrect ? item.feedback : 'Revisa de nuevo la definición e inténtalo otra vez.'}</span>
                </p>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-right text-xs font-medium text-slate-500">
        {correctCount} de {items.length} correctas
      </p>
    </div>
  )
}

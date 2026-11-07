import { useState, type ReactNode } from 'react'
import { CircleCheck, CircleX } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface QuizOption {
  text: string
  correct?: boolean
  feedback: string
}

interface QuizProps {
  question: string
  context?: ReactNode
  options: QuizOption[]
}

const letters = ['A', 'B', 'C', 'D']

/** Single-choice question with immediate feedback. Wrong answers can be retried. */
export function Quiz({ question, context, options }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const answeredCorrectly = selected !== null && options[selected].correct === true
  const choice = selected !== null ? options[selected] : null

  return (
    <div>
      {context && <div className="mb-3">{context}</div>}
      <p className="text-sm font-semibold text-slate-900">{question}</p>

      <div className="mt-3 space-y-2">
        {options.map((option, i) => {
          const isSelected = selected === i
          const state = isSelected ? (option.correct ? 'correct' : 'wrong') : 'idle'
          return (
            <button
              key={option.text}
              type="button"
              disabled={answeredCorrectly}
              onClick={() => setSelected(i)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                state === 'correct' && 'border-emerald-300 bg-emerald-50 text-emerald-900',
                state === 'wrong' && 'border-rose-300 bg-rose-50 text-rose-900',
                state === 'idle' && 'border-slate-200 text-slate-700',
                state === 'idle' && !answeredCorrectly && 'cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/40',
                state === 'idle' && answeredCorrectly && 'opacity-60',
              )}
            >
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold',
                  state === 'correct' && 'bg-emerald-600 text-white',
                  state === 'wrong' && 'bg-rose-500 text-white',
                  state === 'idle' && 'bg-slate-100 text-slate-500',
                )}
              >
                {letters[i]}
              </span>
              <span className="leading-relaxed">{option.text}</span>
            </button>
          )
        })}
      </div>

      {choice && (
        <div
          key={selected}
          role="status"
          className={cn(
            'motion-safe:animate-enter mt-3 flex gap-2.5 rounded-lg p-3 text-sm leading-relaxed',
            choice.correct ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900',
          )}
        >
          {choice.correct ? (
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          ) : (
            <CircleX className="mt-0.5 size-4 shrink-0 text-rose-500" />
          )}
          <p>
            <span className="font-semibold">{choice.correct ? 'Correcto. ' : 'No del todo. '}</span>
            {choice.feedback}
            {!choice.correct && <span className="text-rose-700"> Intenta con otra opción.</span>}
          </p>
        </div>
      )}
    </div>
  )
}

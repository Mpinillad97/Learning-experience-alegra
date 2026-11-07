import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, CircleCheck, CircleX, MessageSquareText, Target, TriangleAlert } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { evaluateSimulation } from '../../evaluation/evaluate'
import { getScenario } from '../../scenarios'
import type { Role } from '../../types'
import type { ResponseOption, Scenario, SimulationResult } from '../../types/simulation'
import { cn } from '../../utils/cn'
import type { SimulationProgress } from '../../utils/storage'
import { ChatMessage, CriticalChip, ScoreChip } from './parts'
import { SimulationResultView } from './SimulationResultView'

interface SimulationScreenProps {
  role: Role
  initialProgress?: SimulationProgress
  onProgressChange?: (progress: SimulationProgress) => void
  /** Called once, when the participant moves from the last decision to the result. */
  onComplete?: (result: SimulationResult) => void
  onExit: () => void
  onViewHistory?: () => void
}

/** Rebuilds a stored run; anything inconsistent with the scenario restarts it. */
function restore(scenario: Scenario, progress?: SimulationProgress): { answers: ResponseOption[]; index: number } {
  if (!progress) return { answers: [], index: 0 }
  const answers = progress.answerIds.map((id, i) => scenario.decisions[i]?.options.find((o) => o.id === id))
  const valid =
    answers.every((a): a is ResponseOption => a !== undefined) &&
    progress.index >= answers.length - 1 &&
    progress.index <= answers.length
  return valid ? { answers: answers as ResponseOption[], index: progress.index } : { answers: [], index: 0 }
}

export function SimulationScreen({ role, initialProgress, onProgressChange, onComplete, onExit, onViewHistory }: SimulationScreenProps) {
  const scenario = getScenario(role.id)
  const total = scenario.decisions.length
  const [restored] = useState(() => restore(scenario, initialProgress))
  /** Answers are append-only: earlier decisions cannot be changed during a run. */
  const [answers, setAnswers] = useState<ResponseOption[]>(restored.answers)
  const [index, setIndex] = useState(restored.index)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    onProgressChange?.({ answerIds: answers.map((a) => a.id), index })
  }, [answers, index, onProgressChange])
  const currentRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  const finished = index >= total
  const result = useMemo(
    () => (finished ? evaluateSimulation(scenario, answers) : null),
    [finished, scenario, answers],
  )

  const decision = scenario.decisions[index]
  const answer = answers[index]

  useEffect(() => {
    if (finished) window.scrollTo({ top: 0 })
    else if (index > 0) currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [index, finished])

  useEffect(() => {
    if (answer) feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [answer])

  const confirm = () => {
    const option = decision.options.find((o) => o.id === selectedId)
    if (!option || answers.length !== index) return
    setAnswers([...answers, option])
    setSelectedId(null)
  }

  const restart = () => {
    setAnswers([])
    setIndex(0)
    setSelectedId(null)
  }

  if (result) {
    return (
      <SimulationResultView
        scenario={scenario}
        role={role}
        result={result}
        onRestart={restart}
        onExit={onExit}
        onViewHistory={onViewHistory}
      />
    )
  }

  const advance = () => {
    if (index === total - 1) onComplete?.(evaluateSimulation(scenario, answers))
    setIndex(index + 1)
  }

  const isCorrectish = answer && answer.score === 2

  return (
    <div className="motion-safe:animate-enter">
      {/* Scenario header */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="indigo">Simulación evaluada</Badge>
          <Badge>{role.name}</Badge>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{scenario.title}</h1>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
              {scenario.customer.initials}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{scenario.customer.name}</p>
              <p className="text-xs text-slate-500">{scenario.customer.description}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{scenario.context}</p>
          <p className="mt-3 flex gap-2 text-sm text-slate-700">
            <Target className="mt-0.5 size-4 shrink-0 text-indigo-600" />
            <span>
              <span className="font-medium">Tu objetivo: </span>
              {scenario.objective}
            </span>
          </p>
        </div>
      </header>

      {/* Progress */}
      <div className="sticky top-14 z-[5] -mx-1 mt-6 border-b border-slate-200/70 bg-slate-50 px-1 py-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-900">
            Decisión {index + 1} de {total}
          </span>
          <span className="text-slate-500">Criterio: {decision.criterion}</span>
        </div>
        <ol className="mt-2 grid grid-cols-5 gap-1.5" aria-label="Progreso de la simulación">
          {scenario.decisions.map((d, i) => (
            <li
              key={d.id}
              aria-current={i === index ? 'step' : undefined}
              className={cn(
                'h-1.5 rounded-full transition-colors duration-300',
                i < index || (i === index && answer) ? 'bg-indigo-600' : i === index ? 'bg-indigo-300' : 'bg-slate-200',
              )}
            />
          ))}
        </ol>
      </div>

      {/* Conversation */}
      <div className="mt-4 space-y-5">
        {scenario.decisions.slice(0, index).map((d, i) => (
          <div key={d.id} className="space-y-4">
            <ChatMessage from="customer" author={scenario.customer.name} initials={scenario.customer.initials}>
              {d.customerMessage}
            </ChatMessage>
            <ChatMessage
              from="participant"
              author={scenario.participantLabel}
              initials="Tú"
              meta={
                <>
                  <ScoreChip score={answers[i].score} />
                  {answers[i].critical && <CriticalChip />}
                </>
              }
            >
              {answers[i].text}
            </ChatMessage>
          </div>
        ))}

        <div ref={currentRef} className="scroll-mt-32 space-y-4">
          <ChatMessage from="customer" author={scenario.customer.name} initials={scenario.customer.initials}>
            {decision.customerMessage}
          </ChatMessage>

          {!answer ? (
            <section className="motion-safe:animate-enter rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                <MessageSquareText className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                {decision.prompt}
              </p>
              <div role="radiogroup" className="mt-4 space-y-2">
                {decision.options.map((option, i) => {
                  const isSelected = selectedId === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedId(option.id)}
                      className={cn(
                        'flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm leading-relaxed transition-colors',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/60 text-slate-900 ring-1 ring-indigo-500'
                          : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50',
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold',
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500',
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{option.text}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Tu respuesta no podrá modificarse.</p>
                <Button onClick={confirm} disabled={!selectedId}>
                  Responder
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </section>
          ) : (
            <>
              <ChatMessage from="participant" author={scenario.participantLabel} initials="Tú">
                {answer.text}
              </ChatMessage>

              <section
                ref={feedbackRef}
                role="status"
                className={cn(
                  'motion-safe:animate-enter scroll-mb-6 rounded-2xl border p-5',
                  answer.critical
                    ? 'border-rose-300 bg-rose-50'
                    : isCorrectish
                      ? 'border-emerald-200 bg-emerald-50/70'
                      : answer.score === 1
                        ? 'border-amber-200 bg-amber-50/70'
                        : 'border-rose-200 bg-rose-50/70',
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {isCorrectish ? (
                    <CircleCheck className="size-5 text-emerald-600" />
                  ) : answer.score === 1 ? (
                    <TriangleAlert className="size-5 text-amber-600" />
                  ) : (
                    <CircleX className="size-5 text-rose-600" />
                  )}
                  <p className="font-semibold text-slate-900">
                    {isCorrectish ? 'Respuesta adecuada' : answer.score === 1 ? 'Respuesta parcial' : 'Respuesta inadecuada'}
                  </p>
                  <ScoreChip score={answer.score} />
                  {answer.critical && <CriticalChip />}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{answer.feedback}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Criterio evaluado: <span className="font-medium text-slate-700">{decision.criterion}</span> —{' '}
                  {decision.criterionDescription}
                </p>
                <div className="mt-4 flex justify-end">
                  <Button onClick={advance}>
                    {index === total - 1 ? 'Ver resultado' : 'Siguiente decisión'}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

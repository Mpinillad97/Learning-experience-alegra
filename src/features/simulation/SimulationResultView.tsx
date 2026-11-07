import { useState } from 'react'
import {
  ArrowLeft,
  Award,
  ChevronDown,
  CircleCheck,
  CircleX,
  History,
  Lightbulb,
  OctagonAlert,
  RotateCcw,
  TrendingUp,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import type { Role } from '../../types'
import type { Scenario, SimulationResult } from '../../types/simulation'
import { cn } from '../../utils/cn'
import { CriticalChip, ScoreChip, StatusChip } from './parts'

interface SimulationResultViewProps {
  scenario: Scenario
  role: Role
  result: SimulationResult
  onRestart: () => void
  onExit: () => void
  onViewHistory?: () => void
}

const summaryByReason = {
  passed: 'Alcanzaste el mínimo de 8 puntos sin errores críticos. Aplicaste con criterio lo aprendido sobre Smart Reconciliation.',
  'critical-error': 'Cometiste un error crítico. Un error crítico implica no aprobar, independientemente de la puntuación obtenida.',
  'low-score': 'Obtuviste menos de 8 puntos. Refuerza los criterios indicados y vuelve a intentarlo.',
}

export function SimulationResultView({ scenario, role, result, onRestart, onExit, onViewHistory }: SimulationResultViewProps) {
  const [reviewOpen, setReviewOpen] = useState(false)
  const achieved = result.criteria.filter((c) => c.status === 'achieved')
  const toImprove = result.criteria.filter((c) => c.status !== 'achieved')

  return (
    <div className="motion-safe:animate-enter space-y-6">
      {/* Summary */}
      <section
        className={cn(
          'rounded-2xl border bg-white p-6 shadow-xs sm:p-8',
          result.passed ? 'border-emerald-200' : 'border-rose-200',
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Resultado · {role.name} · {scenario.title}
        </p>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                'flex size-14 shrink-0 items-center justify-center rounded-2xl',
                result.passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white',
              )}
            >
              {result.passed ? <Award className="size-7" /> : <CircleX className="size-7" />}
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {result.passed ? 'Aprobado' : 'No aprobado'}
              </h1>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">{summaryByReason[result.reason]}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-4xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {result.score}
              <span className="text-xl text-slate-400">/{result.maxScore}</span>
            </p>
            <p className="text-xs text-slate-500">Mínimo para aprobar: {result.passScore}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Puntuación</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">
              {result.score} de {result.maxScore}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Criterios logrados</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">
              {achieved.length} de {result.criteria.length}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Error crítico</dt>
            <dd className={cn('font-semibold', result.criticalErrors.length ? 'text-rose-600' : 'text-emerald-600')}>
              {result.criticalErrors.length ? 'Sí' : 'No'}
            </dd>
          </div>
        </dl>
      </section>

      {/* Critical errors */}
      {result.criticalErrors.map(({ decision, option, error }) => (
        <section key={decision.id} className="rounded-2xl border border-rose-300 bg-rose-50 p-5">
          <p className="flex items-center gap-2 font-semibold text-rose-800">
            <OctagonAlert className="size-5" />
            Error crítico: {error.label}
          </p>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Conducta incorrecta ({decision.criterion}): </span>«{option.text}»
            </p>
            <p>
              <span className="font-medium text-slate-900">Por qué representa un riesgo: </span>
              {error.risk}
            </p>
          </div>
        </section>
      ))}

      {/* Criteria */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900">Resultado por criterio</h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {result.criteria.map(({ decision, option, status }, i) => (
            <li key={decision.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 text-xs font-medium text-slate-400 tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{decision.criterion}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{decision.criterionDescription}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
                <StatusChip status={status} />
                <ScoreChip score={option.score} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Strengths & improvements */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <CircleCheck className="size-4 text-emerald-600" />
            Qué hiciste bien
          </h2>
          {achieved.length ? (
            <ul className="mt-3 space-y-2.5">
              {achieved.map(({ decision }) => (
                <li key={decision.id} className="text-sm leading-relaxed text-slate-600">
                  <span className="font-medium text-slate-900">{decision.criterion}: </span>
                  {decision.strength}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Ningún criterio se logró completamente en esta ocasión.</p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <TrendingUp className="size-4 text-amber-600" />
            {result.reason === 'low-score' ? 'Criterios a reforzar' : 'Qué debes mejorar'}
          </h2>
          {toImprove.length ? (
            <ul className="mt-3 space-y-2.5">
              {toImprove.map(({ decision, option }) => (
                <li key={decision.id} className="text-sm leading-relaxed text-slate-600">
                  <span className="font-medium text-slate-900">{decision.criterion}: </span>
                  {option.feedback}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Lograste todos los criterios. ¡Excelente trabajo!</p>
          )}
        </section>
      </div>

      {/* Recommendations */}
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Lightbulb className="size-4 text-indigo-600" />
          Recomendaciones para reforzar
        </h2>
        {toImprove.length ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700 marker:text-indigo-400">
            {toImprove.map(({ decision }) => (
              <li key={decision.id}>{decision.recommendation}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Mantén el mismo enfoque en conversaciones reales: entiende primero la situación, describe el producto con
            precisión y no prometas lo que no está confirmado.
          </p>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={onExit}>
          <ArrowLeft className="size-4" />
          Volver al aprendizaje
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row">
          {onViewHistory && (
            <Button variant="secondary" onClick={onViewHistory}>
              <History className="size-4" />
              Ver historial
            </Button>
          )}
          <Button variant="secondary" onClick={() => setReviewOpen((open) => !open)} aria-expanded={reviewOpen}>
            {reviewOpen ? 'Ocultar revisión' : 'Revisar decisiones'}
            <ChevronDown className={cn('size-4 transition-transform', reviewOpen && 'rotate-180')} />
          </Button>
          <Button onClick={onRestart}>
            <RotateCcw className="size-4" />
            Reiniciar simulación
          </Button>
        </div>
      </div>

      {/* Review */}
      {reviewOpen && (
        <section aria-label="Revisión de decisiones" className="motion-safe:animate-enter space-y-4">
          {result.criteria.map(({ decision, option }, i) => {
            const best = decision.options.find((o) => o.score === 2)
            return (
              <article key={decision.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-medium text-slate-500">
                  Decisión {i + 1} · {decision.criterion}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  <span className="font-medium text-slate-900">{scenario.customer.name}: </span>«{decision.customerMessage}»
                </p>
                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tu respuesta</p>
                    <ScoreChip score={option.score} />
                    {option.critical && <CriticalChip />}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{option.text}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{option.feedback}</p>
                </div>
                {best && option.score < 2 && (
                  <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Respuesta recomendada</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-800">{best.text}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{best.feedback}</p>
                  </div>
                )}
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}

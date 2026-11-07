import { useState } from 'react'
import { ArrowRight, Award, CircleX, History, OctagonAlert, Trash2, UserRound } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { getRole, modes, roles } from '../../data/experience'
import type { RoleId } from '../../types'
import { cn } from '../../utils/cn'
import { clearAllData, loadAttempts, type AttemptRecord } from '../../utils/storage'
import { ScoreChip, StatusChip } from '../simulation/parts'

interface ResultsScreenProps {
  initialRoleId?: RoleId
  onStartRole: (roleId: RoleId) => void
  onDataCleared: () => void
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

function AttemptDetail({ attempt, number }: { attempt: AttemptRecord; number: number }) {
  const critical = attempt.criticalErrors[0]
  return (
    <section
      className={cn(
        'motion-safe:animate-enter rounded-2xl border bg-white p-5 shadow-xs sm:p-6',
        attempt.passed ? 'border-emerald-200' : 'border-rose-200',
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-xl text-white',
              attempt.passed ? 'bg-emerald-600' : 'bg-rose-600',
            )}
          >
            {attempt.passed ? <Award className="size-6" /> : <CircleX className="size-6" />}
          </span>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Intento #{number} · {modes[attempt.mode].label}
            </p>
            <p className="text-xl font-semibold tracking-tight text-slate-900">
              {attempt.passed ? 'Aprobado' : 'No aprobado'}
            </p>
          </div>
        </div>
        <p className="text-4xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {attempt.score}
          <span className="text-xl text-slate-400">/{attempt.maxScore}</span>
        </p>
      </div>

      <dl className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-slate-500">Participante</dt>
          <dd className="font-medium text-slate-900">Participante</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Rol</dt>
          <dd className="font-medium text-slate-900">{getRole(attempt.roleId).name}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Fecha</dt>
          <dd className="font-medium text-slate-900">{formatDate(attempt.completedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Error crítico</dt>
          <dd className={cn('font-medium', critical ? 'text-rose-600' : 'text-emerald-600')}>{critical ? 'Sí' : 'No'}</dd>
        </div>
      </dl>

      {attempt.criticalErrors.map((error) => (
        <p key={error.id} className="mt-4 flex gap-2 rounded-xl bg-rose-50 p-3 text-sm leading-relaxed text-rose-900">
          <OctagonAlert className="mt-0.5 size-4 shrink-0 text-rose-600" />
          <span>
            <span className="font-semibold">{error.label}</span> (criterio: {error.criterion})
          </span>
        </p>
      ))}

      <h3 className="mt-6 text-sm font-semibold text-slate-900">Resultados por criterio</h3>
      <ul className="mt-3 divide-y divide-slate-100">
        {attempt.criteria.map((criterion, i) => (
          <li key={criterion.decisionId} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="text-xs text-slate-400 tabular-nums">{i + 1}</span>
            <span className="flex-1 font-medium text-slate-800">{criterion.criterion}</span>
            <StatusChip status={criterion.status} />
            <ScoreChip score={criterion.score} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ResultsScreen({ initialRoleId, onStartRole, onDataCleared }: ResultsScreenProps) {
  const [roleId, setRoleId] = useState<RoleId>(
    () => initialRoleId ?? roles.find((r) => loadAttempts(r.id).length > 0)?.id ?? 'sales',
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const attempts = loadAttempts(roleId)
  const selectedIndex = Math.max(0, attempts.findIndex((a) => a.id === selectedId))
  const selected = attempts[selectedIndex]
  const numberOf = (index: number) => attempts.length - index
  const role = getRole(roleId)

  const changeRole = (id: RoleId) => {
    setRoleId(id)
    setSelectedId(null)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Resultados</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <UserRound className="size-4" />
            Participante · Resultados guardados en este navegador
          </p>
        </div>
        <div role="tablist" aria-label="Rol" className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
          {roles.map((r) => {
            const count = loadAttempts(r.id).length
            const active = r.id === roleId
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => changeRole(r.id)}
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50',
                )}
              >
                {r.name}
                <span className={cn('rounded px-1.5 text-xs tabular-nums', active ? 'bg-indigo-500' : 'bg-slate-100 text-slate-500')}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </header>

      <div className="mt-8 space-y-6">
        {selected ? (
          <>
            <AttemptDetail attempt={selected} number={numberOf(selectedIndex)} />

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <History className="size-4 text-indigo-600" />
                Historial de {role.name}
              </h2>
              <ul className="mt-3 space-y-1.5">
                {attempts.map((attempt, i) => {
                  const active = i === selectedIndex
                  return (
                    <li key={attempt.id}>
                      <button
                        type="button"
                        aria-current={active ? 'true' : undefined}
                        onClick={() => setSelectedId(attempt.id)}
                        className={cn(
                          'grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors sm:grid-cols-[auto_1fr_auto_auto_auto]',
                          active ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200 hover:bg-slate-50',
                        )}
                      >
                        <span className="font-semibold text-slate-900 tabular-nums">#{numberOf(i)}</span>
                        <span className="text-slate-600">
                          {formatDate(attempt.completedAt)}
                          <span className="text-slate-400"> · {modes[attempt.mode].label}</span>
                        </span>
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {attempt.score}/{attempt.maxScore}
                        </span>
                        <span
                          className={cn(
                            'col-start-2 w-fit rounded-md px-1.5 py-0.5 text-xs font-medium sm:col-start-auto',
                            attempt.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
                          )}
                        >
                          {attempt.passed ? 'Aprobado' : 'No aprobado'}
                        </span>
                        <span className={cn('text-xs', attempt.criticalErrors.length ? 'font-medium text-rose-600' : 'text-slate-400')}>
                          {attempt.criticalErrors.length ? 'Error crítico' : 'Sin error crítico'}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          </>
        ) : (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="font-medium text-slate-900">Aún no hay evaluaciones de {role.name}</p>
            <p className="mt-1 text-sm text-slate-500">Completa la ruta y la simulación evaluada para ver tu resultado aquí.</p>
            <Button className="mt-5" onClick={() => onStartRole(roleId)}>
              Ir a {role.name}
              <ArrowRight className="size-4" />
            </Button>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-900">Datos de demostración</h2>
          <p className="mt-1 text-sm text-slate-500">
            El progreso y los resultados se guardan solo en este navegador. Puedes borrarlos para empezar una demostración desde cero.
          </p>
          {confirmClear ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-medium text-rose-900">
                ¿Borrar todo el progreso y el historial de Sales y Customer Experience? Esta acción no se puede deshacer.
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" onClick={() => setConfirmClear(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700"
                  onClick={() => {
                    clearAllData()
                    onDataCleared()
                  }}
                >
                  Sí, borrar datos
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" className="mt-4" onClick={() => setConfirmClear(true)}>
              <Trash2 className="size-4" />
              Borrar datos de demostración
            </Button>
          )}
        </section>
      </div>
    </div>
  )
}

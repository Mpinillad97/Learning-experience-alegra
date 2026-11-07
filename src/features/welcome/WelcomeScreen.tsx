import { useState } from 'react'
import { CheckCircle2, Clock, Layers, Zap } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { experience, modes, roles } from '../../data/experience'
import type { ExperienceMode, Role } from '../../types'
import { cn } from '../../utils/cn'
import { loadAttempts, loadRoleProgress } from '../../utils/storage'
import { getLearningPath } from '../learning/modules'
import { RoleCard, type RoleCardStatus } from './RoleCard'

interface WelcomeScreenProps {
  onSelectRole: (role: Role, mode: ExperienceMode) => void
}

function getStatus(role: Role, mode: ExperienceMode): RoleCardStatus {
  const saved = loadRoleProgress(role.id, mode)
  const total = getLearningPath(role.id, mode).lessons.length
  const last = loadAttempts(role.id)[0]
  return {
    progress: saved ? `En progreso · ${Math.min(saved.completedLessonIds.length, total)} de ${total} lecciones` : undefined,
    lastResult: last
      ? { label: `Último resultado: ${last.score}/${last.maxScore} · ${last.passed ? 'Aprobado' : 'No aprobado'}`, passed: last.passed }
      : undefined,
  }
}

const modeIcons = { full: Clock, quick: Zap } as const

export function WelcomeScreen({ onSelectRole }: WelcomeScreenProps) {
  const [mode, setMode] = useState<ExperienceMode>('full')

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <section className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="indigo">
            <Layers className="size-3.5" />
            {experience.product}
          </Badge>
          <Badge>
            <Clock className="size-3.5" />
            {modes[mode].minutes} minutos
          </Badge>
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {experience.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{experience.description}</p>
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900">Lo que aprenderás</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {experience.outcomes.map((outcome) => (
            <li key={outcome} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-600" />
              {outcome}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Elige tu rol</h2>
            <p className="mt-1 text-sm text-slate-500">La experiencia se adapta a los retos de tu día a día.</p>
          </div>

          <div role="radiogroup" aria-label="Modalidad" className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            {(Object.keys(modes) as ExperienceMode[]).map((id) => {
              const Icon = modeIcons[id]
              const selected = mode === id
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMode(id)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    selected ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>
                    <span className="block font-medium leading-tight">{modes[id].label}</span>
                    <span className={cn('block text-xs', selected ? 'text-indigo-100' : 'text-slate-400')}>
                      {modes[id].minutes} min
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-500">{modes[mode].description}</p>

        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} status={getStatus(role, mode)} onSelect={(r) => onSelectRole(r, mode)} />
          ))}
        </div>
      </section>
    </div>
  )
}

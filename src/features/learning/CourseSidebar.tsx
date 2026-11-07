import { useState } from 'react'
import { ChevronDown, CircleCheck, Clock, FlaskConical, Lock, RotateCcw, Zap } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { modes } from '../../data/experience'
import type { LearningProgress } from '../../hooks/useLearningProgress'
import type { LearningPath, Role, Stage } from '../../types'
import { accentStyles } from '../../utils/accent'
import { cn } from '../../utils/cn'

interface CourseSidebarProps {
  role: Role
  path: LearningPath
  progress: LearningProgress
  stage: Stage
  onSelectLesson: (index: number) => void
  onOpenSimulation: () => void
  onChangeRole: () => void
  onResetLearning: () => void
}

export function CourseSidebar({ role, path, progress, stage, onSelectLesson, onOpenSimulation, onChangeRole, onResetLearning }: CourseSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const mode = modes[path.mode]
  const RoleIcon = role.icon
  const ratio = progress.completedCount / progress.total
  const entries = path.lessons.map((item, index) => ({ ...item, index }))

  const select = (index: number) => {
    onSelectLesson(index)
    setMobileOpen(false)
  }

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        {/* Role + overall progress */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <RoleIcon className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Rol seleccionado</p>
              <p className="truncate text-sm font-semibold text-slate-900">{role.name}</p>
            </div>
            <button
              type="button"
              onClick={onChangeRole}
              className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              Cambiar
            </button>
          </div>

          <p
            className={cn(
              'mt-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium',
              path.mode === 'quick' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-600',
            )}
          >
            {path.mode === 'quick' ? <Zap className="size-3.5" /> : <Clock className="size-3.5" />}
            {mode.label} · {mode.minutes} min
          </p>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Progreso general</span>
              <span className="text-slate-500 tabular-nums">
                {progress.completedCount}/{progress.total} · {Math.round(ratio * 100)}%
              </span>
            </div>
            <ProgressBar value={ratio} label="Progreso general" />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            className="mt-4 flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm lg:hidden"
          >
            <span className="min-w-0">
              <span className="block text-xs text-slate-500">
                {stage === 'lessons' ? progress.current.module.label : 'Aprendizaje completado'}
              </span>
              <span className="block truncate font-medium text-slate-900">
                {stage === 'lessons' ? progress.current.lesson.title : 'Simulación evaluada'}
              </span>
            </span>
            <ChevronDown className={cn('size-4 shrink-0 text-slate-400 transition-transform', mobileOpen && 'rotate-180')} />
          </button>
        </div>

        {/* Modules and lessons */}
        <nav aria-label="Contenido" className={cn('border-t border-slate-100 p-2', !mobileOpen && 'hidden lg:block')}>
          {path.modules.map((module, moduleIndex) => {
            const lessons = entries.filter((entry) => entry.module.id === module.id)
            const done = lessons.filter((entry) => progress.isCompleted(entry.index)).length
            const accent = accentStyles[module.accent]
            return (
              <div key={module.id} className="py-2">
                <div className="px-2 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn('rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset', accent.badge)}>
                      Módulo {moduleIndex + 1} · {module.label}
                    </span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {done}/{lessons.length}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">{module.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="size-3" />
                    {module.minutes} min
                  </p>
                </div>
                <ul className="space-y-0.5">
                  {lessons.map(({ lesson, index }) => {
                    const isCurrent = stage === 'lessons' && index === progress.currentIndex
                    const isDone = progress.isCompleted(index)
                    const unlocked = progress.isUnlocked(index)
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          disabled={!unlocked}
                          aria-current={isCurrent ? 'step' : undefined}
                          onClick={() => select(index)}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors',
                            isCurrent && 'bg-slate-100 font-medium text-slate-900',
                            !isCurrent && unlocked && 'cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                            !unlocked && 'cursor-not-allowed text-slate-400',
                          )}
                        >
                          {isDone ? (
                            <CircleCheck className="size-4 shrink-0 text-emerald-600" />
                          ) : unlocked ? (
                            <span className={cn('flex size-4 shrink-0 items-center justify-center rounded-full border-2', isCurrent ? 'border-indigo-600' : 'border-slate-300')}>
                              {isCurrent && <span className="size-1.5 rounded-full bg-indigo-600" />}
                            </span>
                          ) : (
                            <Lock className="size-3.5 shrink-0 text-slate-300" />
                          )}
                          <span className="flex-1 leading-snug">{lesson.title}</span>
                          <span className="text-[11px] text-slate-400 tabular-nums">{lesson.minutes}′</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}

          <div className="border-t border-slate-100 px-0 pt-2">
            <button
              type="button"
              disabled={!progress.isFinished}
              onClick={() => {
                onOpenSimulation()
                setMobileOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors',
                stage === 'simulation' && 'bg-slate-100 font-medium text-slate-900',
                stage !== 'simulation' && progress.isFinished && 'cursor-pointer text-slate-600 hover:bg-slate-50',
                !progress.isFinished && 'cursor-not-allowed text-slate-400',
              )}
            >
              {progress.isFinished ? (
                <FlaskConical className="size-4 shrink-0 text-indigo-600" />
              ) : (
                <Lock className="size-3.5 shrink-0 text-slate-300" />
              )}
              <span className="flex-1">Simulación evaluada</span>
              <span className="text-[11px] text-slate-400">5 decisiones</span>
            </button>
          </div>

          <div className="mt-2 border-t border-slate-100 px-2 pt-3 pb-1">
            {confirmReset ? (
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs leading-relaxed text-slate-600">
                  Se reiniciará el progreso de {role.name} en esta modalidad. El historial de evaluaciones se conserva.
                </p>
                <div className="mt-2.5 flex gap-2">
                  <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => setConfirmReset(false)}>
                    Cancelar
                  </Button>
                  <Button className="px-2.5 py-1 text-xs" onClick={onResetLearning}>
                    Reiniciar
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
              >
                <RotateCcw className="size-3.5" />
                Reiniciar aprendizaje
              </button>
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}

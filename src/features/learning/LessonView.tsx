import { ArrowLeft, ArrowRight, CircleCheck, Clock, Target } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import type { LearningProgress } from '../../hooks/useLearningProgress'
import { accentStyles } from '../../utils/accent'
import { cn } from '../../utils/cn'

interface LessonViewProps {
  progress: LearningProgress
  onNext: () => void
}

export function LessonView({ progress, onNext }: LessonViewProps) {
  const { current, currentIndex, total } = progress
  const { lesson, module, position } = current
  const accent = accentStyles[module.accent]
  const isDone = progress.isCompleted(currentIndex)
  const isLastOfModule = position === module.lessons.length - 1
  const isLast = currentIndex === total - 1
  const Content = lesson.Content

  const nextLabel = isLast
    ? 'Finalizar aprendizaje'
    : isLastOfModule
      ? 'Completar módulo'
      : isDone
        ? 'Siguiente lección'
        : 'Completar y continuar'

  return (
    <article key={lesson.id} className="motion-safe:animate-enter">
      {/* Module intro, shown when entering a module */}
      {position === 0 && (
        <div className={cn('mb-6 rounded-2xl p-5 ring-1 ring-inset', accent.badge)}>
          <p className="text-xs font-semibold uppercase tracking-wide">
            {module.kind === 'common' ? 'Módulo compartido' : 'Módulo específico de tu rol'} · {module.minutes} min
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{module.title}</p>
          <p className="mt-1 text-sm text-slate-600">{module.description}</p>
        </div>
      )}

      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
          <span className={accent.text}>{module.label}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">
            Lección {position + 1} de {module.lessons.length}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Clock className="size-3.5" />
            {lesson.minutes} min
          </span>
          {isDone && (
            <span className="flex items-center gap-1 text-emerald-600">
              <CircleCheck className="size-3.5" />
              Completada
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{lesson.title}</h1>
        <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
          <Target className={cn('mt-0.5 size-4 shrink-0', accent.text)} />
          {lesson.objective}
        </p>
      </header>

      <div className="mt-8">
        <Content />
      </div>

      <footer className="mt-12 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
        <Button variant="secondary" onClick={progress.goPrevious} disabled={currentIndex === 0}>
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>
        <span className="text-xs text-slate-400 tabular-nums">
          {currentIndex + 1} / {total}
        </span>
        <Button onClick={onNext}>
          {nextLabel}
          <ArrowRight className="size-4" />
        </Button>
      </footer>
    </article>
  )
}

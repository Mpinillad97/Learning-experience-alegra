import { ArrowRight, CircleCheck, GraduationCap, RotateCcw } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import type { LearningPath } from '../../types'

interface CompletionViewProps {
  path: LearningPath
  onContinue: () => void
  onReview: () => void
}

export function CompletionView({ path, onContinue, onReview }: CompletionViewProps) {
  return (
    <section className="motion-safe:animate-enter rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-10">
      <span className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100">
        <GraduationCap className="size-6" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Has completado el aprendizaje
      </h1>
      <p className="mt-3 max-w-prose leading-relaxed text-slate-600">
        Ahora pondremos a prueba cómo aplicarías estos conocimientos en una situación real.
      </p>

      <ul className="mt-8 space-y-2">
        {path.modules.map((module) => (
          <li key={module.id} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <CircleCheck className="size-5 shrink-0 text-emerald-600" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">{module.label}</p>
              <p className="truncate text-sm font-semibold text-slate-900">{module.title}</p>
            </div>
            <span className="text-xs text-slate-500">
              {module.lessons.length} lecciones · {module.minutes} min
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onReview}>
          <RotateCcw className="size-4" />
          Revisar lecciones
        </Button>
        <Button onClick={onContinue}>
          Continuar a la simulación
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  )
}

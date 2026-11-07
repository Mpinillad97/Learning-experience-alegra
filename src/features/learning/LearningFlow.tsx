import { useEffect, useMemo, useState } from 'react'
import { useLearningProgress } from '../../hooks/useLearningProgress'
import { getScenario } from '../../scenarios'
import type { ExperienceMode, Role, Stage } from '../../types'
import type { SimulationResult } from '../../types/simulation'
import {
  createAttemptRecord,
  loadRoleProgress,
  recordAttempt,
  saveRoleProgress,
  type SimulationProgress,
} from '../../utils/storage'
import { SimulationScreen } from '../simulation/SimulationScreen'
import { CompletionView } from './CompletionView'
import { CourseSidebar } from './CourseSidebar'
import { LessonView } from './LessonView'
import { getLearningPath } from './modules'

interface LearningFlowProps {
  role: Role
  mode: ExperienceMode
  onChangeRole: () => void
  onViewResults: () => void
  onResetLearning: () => void
}

export function LearningFlow({ role, mode, onChangeRole, onViewResults, onResetLearning }: LearningFlowProps) {
  const path = useMemo(() => getLearningPath(role.id, mode), [role.id, mode])
  const [saved] = useState(() => loadRoleProgress(role.id, mode))
  const progress = useLearningProgress(path.lessons, saved)
  // Completion and simulation stages are only restored when every lesson is completed.
  const [stage, setStage] = useState<Stage>(() => (saved && progress.isFinished ? saved.stage : 'lessons'))
  const [simulation, setSimulation] = useState<SimulationProgress>(() => saved?.simulation ?? { answerIds: [], index: 0 })

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [progress.currentIndex, stage])

  useEffect(() => {
    saveRoleProgress(role.id, mode, {
      completedLessonIds: progress.completedIds,
      currentLessonId: progress.current.lesson.id,
      stage,
      simulation,
    })
    // completedCount captures changes to completedIds (the set only grows).
  },[role.id, mode, progress.completedCount, progress.currentIndex, stage, simulation])

  const handleNext = () => {
    if (progress.completeCurrent()) setStage('completed')
  }

  const selectLesson = (index: number) => {
    progress.goTo(index)
    setStage('lessons')
  }

  const handleSimulationComplete = (result: SimulationResult) => {
    recordAttempt(createAttemptRecord(getScenario(role.id), mode, result))
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-10 lg:py-10">
      <CourseSidebar
        role={role}
        path={path}
        progress={progress}
        stage={stage}
        onSelectLesson={selectLesson}
        onOpenSimulation={() => setStage('simulation')}
        onChangeRole={onChangeRole}
        onResetLearning={onResetLearning}
      />
      <div className="min-w-0 max-w-3xl">
        {stage === 'lessons' && <LessonView progress={progress} onNext={handleNext} />}
        {stage === 'completed' && (
          <CompletionView path={path} onContinue={() => setStage('simulation')} onReview={() => selectLesson(0)} />
        )}
        {stage === 'simulation' && (
          <SimulationScreen
            role={role}
            initialProgress={simulation}
            onProgressChange={setSimulation}
            onComplete={handleSimulationComplete}
            onExit={() => setStage('completed')}
            onViewHistory={onViewResults}
          />
        )}
      </div>
    </div>
  )
}

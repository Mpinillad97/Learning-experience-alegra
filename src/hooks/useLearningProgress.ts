import { useState } from 'react'
import type { PathLesson } from '../types'

interface InitialProgress {
  completedLessonIds: string[]
  currentLessonId: string | null
}

export function useLearningProgress(lessons: PathLesson[], initial?: InitialProgress | null) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(0, lessons.findIndex((item) => item.lesson.id === initial?.currentLessonId)),
  )
  // Ignore stored ids that do not belong to this route.
  const [completed, setCompleted] = useState<ReadonlySet<string>>(
    () => new Set((initial?.completedLessonIds ?? []).filter((id) => lessons.some((item) => item.lesson.id === id))),
  )

  const isCompleted = (index: number) => completed.has(lessons[index].lesson.id)
  /** Lessons unlock sequentially: the first one, or any whose predecessor is completed. */
  const isUnlocked = (index: number) => index === 0 || isCompleted(index - 1)

  const goTo = (index: number) => {
    if (index >= 0 && index < lessons.length && isUnlocked(index)) setCurrentIndex(index)
  }

  /** Marks the current lesson as completed and moves forward. Returns true when the path is finished. */
  const completeCurrent = (): boolean => {
    const id = lessons[currentIndex].lesson.id
    setCompleted((prev) => new Set(prev).add(id))
    const isLast = currentIndex === lessons.length - 1
    if (!isLast) setCurrentIndex(currentIndex + 1)
    return isLast
  }

  return {
    currentIndex,
    current: lessons[currentIndex],
    completedIds: [...completed],
    completedCount: completed.size,
    total: lessons.length,
    isFinished: completed.size === lessons.length,
    isCompleted,
    isUnlocked,
    goTo,
    goPrevious: () => goTo(currentIndex - 1),
    completeCurrent,
  }
}

export type LearningProgress = ReturnType<typeof useLearningProgress>

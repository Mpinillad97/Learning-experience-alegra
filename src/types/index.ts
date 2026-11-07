import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type RoleId = 'sales' | 'cx'

export interface Role {
  id: RoleId
  name: string
  tagline: string
  description: string
  focus: string[]
  icon: LucideIcon
}

/** 'full' is the standard 25-minute route; 'quick' is the reduced demo route. */
export type ExperienceMode = 'full' | 'quick'

export type View =
  | { name: 'welcome' }
  | { name: 'learning'; roleId: RoleId; mode: ExperienceMode }
  | { name: 'results'; roleId?: RoleId }

/** Stage of a role's learning flow. */
export type Stage = 'lessons' | 'completed' | 'simulation'

export type ModuleId = 'fundamentals' | RoleId

export type Accent = 'indigo' | 'violet'

export interface Lesson {
  id: string
  title: string
  objective: string
  minutes: number
  /** Present when the lesson is part of the quick route, with its compressed duration. */
  quickMinutes?: number
  Content: ComponentType
}

export interface LearningModule {
  id: ModuleId
  kind: 'common' | 'role'
  label: string
  title: string
  description: string
  /** Computed from the lessons included in the active route. */
  minutes: number
  accent: Accent
  lessons: Lesson[]
}

/** A lesson placed in the learner's flattened path. */
export interface PathLesson {
  lesson: Lesson
  module: LearningModule
  /** 0-based position of the lesson inside its module. */
  position: number
}

export interface LearningPath {
  mode: ExperienceMode
  modules: LearningModule[]
  lessons: PathLesson[]
  minutes: number
}

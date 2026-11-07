import type { RoleId } from './index'

export type Score = 0 | 1 | 2

/** A behaviour that fails the simulation regardless of the score. */
export interface CriticalError {
  id: string
  label: string
  /** Why the behaviour is risky, shown in the result. */
  risk: string
}

export interface ResponseOption {
  id: string
  text: string
  score: Score
  /** Specific explanation of why the response is adequate or not. */
  feedback: string
  critical?: CriticalError
}

/** One evaluated decision; each decision assesses exactly one criterion. */
export interface Decision {
  id: string
  criterion: string
  criterionDescription: string
  customerMessage: string
  prompt: string
  options: ResponseOption[]
  /** Shown under "Qué hiciste bien" when the criterion is fully achieved. */
  strength: string
  /** Concrete reinforcement shown when the criterion is not fully achieved. */
  recommendation: string
}

export interface Scenario {
  id: string
  roleId: RoleId
  title: string
  participantLabel: string
  customer: {
    name: string
    initials: string
    description: string
  }
  context: string
  objective: string
  decisions: Decision[]
}

export type CriterionStatus = 'achieved' | 'partial' | 'missed'

export interface CriterionResult {
  decision: Decision
  option: ResponseOption
  status: CriterionStatus
}

export interface CriticalErrorResult {
  decision: Decision
  option: ResponseOption
  error: CriticalError
}

export type ResultReason = 'passed' | 'critical-error' | 'low-score'

export interface SimulationResult {
  score: number
  maxScore: number
  passScore: number
  passed: boolean
  reason: ResultReason
  criticalErrors: CriticalErrorResult[]
  criteria: CriterionResult[]
}

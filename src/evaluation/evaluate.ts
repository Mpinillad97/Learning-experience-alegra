import type { CriterionStatus, ResponseOption, Scenario, Score, SimulationResult } from '../types/simulation'

export const MAX_SCORE_PER_DECISION = 2
export const PASS_SCORE = 8

const statusByScore: Record<Score, CriterionStatus> = { 2: 'achieved', 1: 'partial', 0: 'missed' }

/**
 * Deterministic evaluation. Passing requires PASS_SCORE or more AND no critical error:
 * a critical error fails the simulation regardless of the score.
 */
export function evaluateSimulation(scenario: Scenario, answers: ResponseOption[]): SimulationResult {
  if (answers.length !== scenario.decisions.length) {
    throw new Error(`Expected ${scenario.decisions.length} answers, received ${answers.length}`)
  }

  const criteria = scenario.decisions.map((decision, i) => ({
    decision,
    option: answers[i],
    status: statusByScore[answers[i].score],
  }))

  const score = answers.reduce((sum, option) => sum + option.score, 0)
  const criticalErrors = criteria.flatMap(({ decision, option }) =>
    option.critical ? [{ decision, option, error: option.critical }] : [],
  )

  const reason = criticalErrors.length > 0 ? 'critical-error' : score < PASS_SCORE ? 'low-score' : 'passed'

  return {
    score,
    maxScore: scenario.decisions.length * MAX_SCORE_PER_DECISION,
    passScore: PASS_SCORE,
    passed: reason === 'passed',
    reason,
    criticalErrors,
    criteria,
  }
}

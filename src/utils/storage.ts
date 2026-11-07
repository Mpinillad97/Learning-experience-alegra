import type { ExperienceMode, RoleId, Stage, View } from '../types'
import type { CriterionStatus, ResultReason, Scenario, Score, SimulationResult } from '../types/simulation'

/**
 * Versioned localStorage persistence. Any unreadable, invalid or incompatible
 * data falls back to an empty store so the app never breaks.
 */
export const STORAGE_KEY = 'fintaz-learning-experience'
export const STORAGE_VERSION = 1

export interface SimulationProgress {
  answerIds: string[]
  index: number
}

export interface RoleProgress {
  completedLessonIds: string[]
  currentLessonId: string | null
  stage: Stage
  simulation: SimulationProgress
}

export interface AttemptRecord {
  id: string
  roleId: RoleId
  mode: ExperienceMode
  scenarioId: string
  completedAt: string
  score: number
  maxScore: number
  passed: boolean
  reason: ResultReason
  criticalErrors: { id: string; label: string; criterion: string }[]
  criteria: { decisionId: string; criterion: string; score: Score; status: CriterionStatus }[]
}

interface Store {
  version: typeof STORAGE_VERSION
  view: View
  /** Learning progress per role and mode, keyed "roleId:mode", so routes never mix. */
  progress: Record<string, RoleProgress>
  attempts: AttemptRecord[]
}

const emptyStore = (): Store => ({ version: STORAGE_VERSION, view: { name: 'welcome' }, progress: {}, attempts: [] })

/* ---------- Validation ---------- */

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const isRoleId = (v: unknown): v is RoleId => v === 'sales' || v === 'cx'
const isMode = (v: unknown): v is ExperienceMode => v === 'full' || v === 'quick'
const isStage = (v: unknown): v is Stage => v === 'lessons' || v === 'completed' || v === 'simulation'
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')
const isScore = (v: unknown): v is Score => v === 0 || v === 1 || v === 2

function readView(v: unknown): View {
  if (isObj(v)) {
    if (v.name === 'learning' && isRoleId(v.roleId) && isMode(v.mode)) return { name: 'learning', roleId: v.roleId, mode: v.mode }
    if (v.name === 'results') return isRoleId(v.roleId) ? { name: 'results', roleId: v.roleId } : { name: 'results' }
  }
  return { name: 'welcome' }
}

function readProgress(v: unknown): RoleProgress | null {
  if (!isObj(v) || !isStringArray(v.completedLessonIds) || !isStage(v.stage)) return null
  const sim = v.simulation
  const simulation =
    isObj(sim) && isStringArray(sim.answerIds) && typeof sim.index === 'number' ? { answerIds: sim.answerIds, index: sim.index } : { answerIds: [], index: 0 }
  return {
    completedLessonIds: v.completedLessonIds,
    currentLessonId: typeof v.currentLessonId === 'string' ? v.currentLessonId : null,
    stage: v.stage,
    simulation,
  }
}

function isAttempt(v: unknown): v is AttemptRecord {
  return (
    isObj(v) &&
    typeof v.id === 'string' &&
    isRoleId(v.roleId) &&
    isMode(v.mode) &&
    typeof v.scenarioId === 'string' &&
    typeof v.completedAt === 'string' &&
    !Number.isNaN(Date.parse(v.completedAt)) &&
    typeof v.score === 'number' &&
    typeof v.maxScore === 'number' &&
    typeof v.passed === 'boolean' &&
    (v.reason === 'passed' || v.reason === 'critical-error' || v.reason === 'low-score') &&
    Array.isArray(v.criticalErrors) &&
    v.criticalErrors.every((e) => isObj(e) && typeof e.id === 'string' && typeof e.label === 'string' && typeof e.criterion === 'string') &&
    Array.isArray(v.criteria) &&
    v.criteria.every((c) => isObj(c) && typeof c.decisionId === 'string' && typeof c.criterion === 'string' && isScore(c.score) && typeof c.status === 'string')
  )
}

function sanitize(raw: unknown): Store {
  if (!isObj(raw) || raw.version !== STORAGE_VERSION) return emptyStore()
  const progress: Record<string, RoleProgress> = {}
  if (isObj(raw.progress)) {
    for (const [key, value] of Object.entries(raw.progress)) {
      const [roleId, mode] = key.split(':')
      const parsed = readProgress(value)
      if (isRoleId(roleId) && isMode(mode) && parsed) progress[key] = parsed
    }
  }
  return {
    version: STORAGE_VERSION,
    view: readView(raw.view),
    progress,
    attempts: Array.isArray(raw.attempts) ? raw.attempts.filter(isAttempt) : [],
  }
}

/* ---------- Access ---------- */

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitize(JSON.parse(raw)) : emptyStore()
  } catch {
    return emptyStore()
  }
}

function update(change: (store: Store) => void) {
  const store = load()
  change(store)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Storage unavailable (private mode, quota): the app keeps working without persistence.
  }
}

const progressKey = (roleId: RoleId, mode: ExperienceMode) => `${roleId}:${mode}`

export const loadView = (): View => load().view
export const saveView = (view: View) => update((s) => void (s.view = view))

export const loadRoleProgress = (roleId: RoleId, mode: ExperienceMode): RoleProgress | null =>
  load().progress[progressKey(roleId, mode)] ?? null

export const saveRoleProgress = (roleId: RoleId, mode: ExperienceMode, progress: RoleProgress) =>
  update((s) => void (s.progress[progressKey(roleId, mode)] = progress))

/** Restarts a role's learning route. Evaluation history is kept. */
export const clearRoleProgress = (roleId: RoleId, mode: ExperienceMode) =>
  update((s) => void delete s.progress[progressKey(roleId, mode)])

export const recordAttempt = (attempt: AttemptRecord) => update((s) => void s.attempts.push(attempt))

/** Snapshot of an evaluation result, independent of future scenario changes. */
export function createAttemptRecord(scenario: Scenario, mode: ExperienceMode, result: SimulationResult): AttemptRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    roleId: scenario.roleId,
    mode,
    scenarioId: scenario.id,
    completedAt: new Date().toISOString(),
    score: result.score,
    maxScore: result.maxScore,
    passed: result.passed,
    reason: result.reason,
    criticalErrors: result.criticalErrors.map(({ error, decision }) => ({ id: error.id, label: error.label, criterion: decision.criterion })),
    criteria: result.criteria.map(({ decision, option, status }) => ({
      decisionId: decision.id,
      criterion: decision.criterion,
      score: option.score,
      status,
    })),
  }
}

/** Attempts, newest first, optionally filtered by role. */
export const loadAttempts = (roleId?: RoleId): AttemptRecord[] =>
  load()
    .attempts.filter((a) => !roleId || a.roleId === roleId)
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))

/** Explicit, user-confirmed removal of all demo data. */
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

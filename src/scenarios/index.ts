import type { RoleId } from '../types'
import type { Scenario } from '../types/simulation'
import { cxScenario } from './cx'
import { salesScenario } from './sales'

const scenarios: Record<RoleId, Scenario> = {
  sales: salesScenario,
  cx: cxScenario,
}

export const getScenario = (roleId: RoleId): Scenario => scenarios[roleId]

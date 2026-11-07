import type { ExperienceMode, LearningModule, LearningPath, RoleId } from '../../types'
import { ExpectationsAndEscalation, HandleSuggestions, UnderstandAndGuide } from './content/cx'
import {
  CapabilitiesAndLimits,
  FundamentalsCheck,
  ImportRegisterReconcile,
  PossibleSituations,
  WhatIsReconciliation,
  WhatIsSmartReconciliation,
} from './content/fundamentals'
import { ConnectNeedToValue, DiscoverFirst, ManageExpectations } from './content/sales'

/** Module definitions; `minutes` is computed per route from the included lessons. */
type ModuleDefinition = Omit<LearningModule, 'minutes'>

/*
 * Quick route: lessons with `quickMinutes` are included with that duration.
 * Fundamentals keep the essential explanations (what reconciliation is, how Smart
 * Reconciliation works, capabilities/limits, situations); every role lesson is kept.
 */
const fundamentals: ModuleDefinition = {
  id: 'fundamentals',
  kind: 'common',
  label: 'Fundamentos comunes',
  title: 'Entendiendo Smart Reconciliation',
  description: 'Qué es la conciliación bancaria, cómo funciona Smart Reconciliation y qué puede y no puede hacer.',
  accent: 'indigo',
  lessons: [
    { id: 'f-reconciliation', title: '¿Qué es la conciliación bancaria?', objective: 'Entender qué se compara al conciliar y por qué el valor no basta.', minutes: 1, quickMinutes: 1, Content: WhatIsReconciliation },
    { id: 'f-concepts', title: 'Importar, registrar y conciliar', objective: 'Distinguir tres acciones que suelen confundirse.', minutes: 2, Content: ImportRegisterReconcile },
    { id: 'f-smart', title: '¿Qué es Smart Reconciliation?', objective: 'Conocer el flujo: el sistema sugiere y el usuario decide.', minutes: 1, quickMinutes: 1, Content: WhatIsSmartReconciliation },
    { id: 'f-limits', title: 'Capacidades y limitaciones', objective: 'Comunicar con precisión qué hace y qué no hace el producto.', minutes: 2, quickMinutes: 1, Content: CapabilitiesAndLimits },
    { id: 'f-situations', title: 'Situaciones que pueden presentarse', objective: 'Interpretar correctamente los casos habituales de uso.', minutes: 1, quickMinutes: 1, Content: PossibleSituations },
    { id: 'f-check', title: 'Comprobación de comprensión', objective: 'Confirmar los conceptos clave antes de continuar.', minutes: 1, Content: FundamentalsCheck },
  ],
}

const roleModules: Record<RoleId, ModuleDefinition> = {
  sales: {
    id: 'sales',
    kind: 'role',
    label: 'Ruta Sales',
    title: 'Discover before you position',
    description: 'Entiende el proceso del cliente antes de presentar Smart Reconciliation.',
    accent: 'violet',
    lessons: [
      { id: 's-discover', title: 'Primero descubre', objective: 'Investigar la situación del cliente antes de hablar de funcionalidades.', minutes: 3, quickMinutes: 2, Content: DiscoverFirst },
      { id: 's-value', title: 'Conecta la necesidad con el valor', objective: 'Relacionar lo que el cliente expresó con lo que el producto hace.', minutes: 2, quickMinutes: 1, Content: ConnectNeedToValue },
      { id: 's-expectations', title: 'Gestiona las expectativas', objective: 'Diferenciar afirmaciones correctas de promesas que no deben hacerse.', minutes: 2, quickMinutes: 1, Content: ManageExpectations },
    ],
  },
  cx: {
    id: 'cx',
    kind: 'role',
    label: 'Ruta Customer Experience',
    title: 'Guide with confidence',
    description: 'Orienta al usuario y maneja correctamente las situaciones que pueden presentarse.',
    accent: 'violet',
    lessons: [
      { id: 'c-guide', title: 'Comprende y orienta el proceso', objective: 'Explicar el flujo de Smart Reconciliation con palabras sencillas.', minutes: 2, quickMinutes: 1, Content: UnderstandAndGuide },
      { id: 'c-suggestions', title: 'Maneja sugerencias incorrectas o ausentes', objective: 'Responder adecuadamente a tres situaciones frecuentes.', minutes: 3, quickMinutes: 2, Content: HandleSuggestions },
      { id: 'c-escalation', title: 'Expectativas y escalamiento', objective: 'Saber qué responder y qué escalar al área responsable.', minutes: 2, quickMinutes: 1, Content: ExpectationsAndEscalation },
    ],
  },
}

function forMode(definition: ModuleDefinition, mode: ExperienceMode): LearningModule {
  const lessons =
    mode === 'full'
      ? definition.lessons
      : definition.lessons.flatMap((lesson) => (lesson.quickMinutes ? [{ ...lesson, minutes: lesson.quickMinutes }] : []))
  return { ...definition, lessons, minutes: lessons.reduce((sum, lesson) => sum + lesson.minutes, 0) }
}

/** Shared fundamentals followed by the module specific to the selected role. */
export function getLearningPath(roleId: RoleId, mode: ExperienceMode = 'full'): LearningPath {
  const modules = [forMode(fundamentals, mode), forMode(roleModules[roleId], mode)]
  return {
    mode,
    modules,
    lessons: modules.flatMap((module) => module.lessons.map((lesson, position) => ({ lesson, module, position }))),
    minutes: modules.reduce((sum, module) => sum + module.minutes, 0),
  }
}

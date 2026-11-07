import { CircleSlash, Clock, Gauge, Layers, Lightbulb, MessageCircle, Puzzle, Workflow } from 'lucide-react'
import { ActivityCard } from '../../../components/learning/ActivityCard'
import { Callout } from '../../../components/learning/Callout'
import { ClassifyActivity } from '../../../components/learning/ClassifyActivity'
import { Lead, SectionLabel } from '../../../components/learning/Lead'
import { Quiz } from '../../../components/learning/Quiz'

/* ---------- Lección 1 ---------- */

const discoveryAreas = [
  { icon: Workflow, area: 'Proceso actual', question: '¿Cómo realizan actualmente la conciliación bancaria?' },
  { icon: Clock, area: 'Tiempo', question: '¿Cuánto tiempo les toma?' },
  { icon: Layers, area: 'Volumen', question: '¿Qué volumen de movimientos manejan?' },
  { icon: Gauge, area: 'Dificultades', question: '¿Qué dificultades encuentran?' },
  { icon: Puzzle, area: 'Información faltante', question: '¿Qué información suele faltar en los movimientos?' },
]

export function DiscoverFirst() {
  return (
    <div className="space-y-8">
      <Lead>
        No empieces presentando funcionalidades. Primero entiende cómo concilia hoy el cliente: esa información es la
        que te permitirá posicionar el producto con sentido.
      </Lead>

      <div className="space-y-3">
        <SectionLabel>Qué investigar y cómo preguntarlo</SectionLabel>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {discoveryAreas.map(({ icon: Icon, area, question }) => (
            <li key={area} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs last:sm:col-span-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Icon className="size-4.5" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500">{area}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">“{question}”</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ActivityCard title="Elige la mejor pregunta inicial">
        <Quiz
          question="Inicias una conversación con un cliente interesado en conciliación bancaria. ¿Con qué pregunta comienzas?"
          options={[
            { text: '¿Sabías que Smart Reconciliation sugiere coincidencias automáticamente?', feedback: 'Empieza por la funcionalidad, no por la situación del cliente.' },
            { text: '¿Cómo realizan actualmente la conciliación bancaria?', correct: true, feedback: 'Es abierta y te permite entender el proceso real del cliente antes de posicionar.' },
            { text: '¿Te gustaría que la IA conciliara todos tus bancos?', feedback: 'Induce la respuesta y además promete algo que el producto no hace.' },
          ]}
        />
      </ActivityCard>
    </div>
  )
}

/* ---------- Lección 2 ---------- */

export function ConnectNeedToValue() {
  return (
    <div className="space-y-8">
      <Lead>
        El valor se comunica a partir de una necesidad que el cliente ya expresó. Así la funcionalidad responde a su
        situación, no a un discurso genérico.
      </Lead>

      <div className="space-y-3">
        <SectionLabel>Ejemplo de conversación</SectionLabel>
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
          <div className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <MessageCircle className="size-4" />
            </span>
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm leading-relaxed text-slate-800">
              <p className="text-xs font-medium text-slate-500">Cliente</p>
              Tenemos muchos movimientos bancarios y revisar cuáles corresponden a nuestras transacciones nos toma tiempo.
            </div>
          </div>

          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              <Lightbulb className="size-3.5" />
              Necesidad: alto volumen y tiempo de revisión
            </span>
          </div>

          <div className="flex flex-row-reverse gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
              Tú
            </span>
            <div className="rounded-2xl rounded-tr-sm bg-violet-600 px-4 py-2.5 text-sm leading-relaxed text-white">
              <p className="text-xs font-medium text-violet-200">Respuesta adecuada</p>
              Smart Reconciliation analiza los movimientos y presenta posibles coincidencias para que puedan revisarlas y
              conciliar más rápido.
            </div>
          </div>
        </div>
      </div>

      <Callout tone="warning" title="Sin cifras inventadas">
        Relaciona el valor con la necesidad identificada. No inventes ahorros, porcentajes ni resultados cuantitativos.
      </Callout>

      <ActivityCard title="Conecta la necesidad">
        <Quiz
          question="El cliente dice que revisar sus movimientos bancarios le toma demasiado tiempo. ¿Qué respondes?"
          options={[
            { text: 'Con Smart Reconciliation reducirás ese tiempo en un 80%.', feedback: 'No deben prometerse cifras de ahorro que no están confirmadas.' },
            { text: 'Smart Reconciliation presenta posibles coincidencias para que puedan revisar y conciliar más rápido.', correct: true, feedback: 'Conecta la necesidad expresada con lo que el producto realmente hace.' },
            { text: 'No te preocupes, el sistema se encarga de toda la conciliación.', feedback: 'El producto sugiere coincidencias; la revisión sigue siendo del usuario.' },
          ]}
        />
      </ActivityCard>
    </div>
  )
}

/* ---------- Lección 3 ---------- */

export function ManageExpectations() {
  return (
    <div className="space-y-8">
      <Lead>
        Una promesa incorrecta puede cerrar una venta y generar un cliente insatisfecho. Identifica qué afirmaciones
        puedes hacer y cuáles no.
      </Lead>

      <ActivityCard title="¿Correcta o incorrecta?" instructions="Clasifica cada afirmación según si la puedes decir a un cliente.">
        <ClassifyActivity
          categories={[
            { id: 'ok', label: 'Correcta' },
            { id: 'wrong', label: 'Incorrecta' },
          ]}
          items={[
            {
              text: '“El sistema presenta sugerencias de posibles coincidencias que puedes revisar.”',
              answer: 'ok',
              feedback: 'Describe con precisión lo que hace el producto.',
            },
            {
              text: '“Ahora la IA concilia automáticamente todos tus bancos.”',
              answer: 'wrong',
              feedback: 'El producto no concilia automáticamente ni puede prometerse compatibilidad con todos los bancos.',
            },
            {
              text: '“Te garantizamos un ahorro del 80%.”',
              answer: 'wrong',
              feedback: 'No deben prometerse cifras de ahorro.',
            },
            {
              text: '“La disponibilidad es progresiva, por lo que debemos validar si tu cuenta tiene habilitada la funcionalidad.”',
              answer: 'ok',
              feedback: 'Gestiona la expectativa sin confirmar una disponibilidad que no conoces.',
            },
          ]}
        />
      </ActivityCard>

      <div className="space-y-3">
        <SectionLabel>Nunca prometas</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {['Cifras de ahorro', 'Compatibilidad bancaria', 'Costos', 'Disponibilidad no confirmada'].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 shadow-xs">
              <CircleSlash className="size-4 shrink-0 text-rose-500" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

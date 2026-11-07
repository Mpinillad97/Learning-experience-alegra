import {
  ArrowLeftRight,
  CircleCheck,
  Clock,
  Copy,
  EyeOff,
  FileText,
  Landmark,
  ListChecks,
  PenLine,
  ScanSearch,
  Search,
  SearchX,
  Sparkles,
  TriangleAlert,
  Upload,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'
import { ActivityCard } from '../../../components/learning/ActivityCard'
import { Callout } from '../../../components/learning/Callout'
import { ClassifyActivity } from '../../../components/learning/ClassifyActivity'
import { CompareColumns } from '../../../components/learning/CompareColumns'
import { FlowDiagram } from '../../../components/learning/FlowDiagram'
import { KeyMessage } from '../../../components/learning/KeyMessage'
import { Lead, SectionLabel } from '../../../components/learning/Lead'
import { Quiz } from '../../../components/learning/Quiz'
import { RevealCard } from '../../../components/learning/RevealCard'

/* ---------- Lección 1 ---------- */

function RecordCard({ source, icon: Icon, concept, amount }: { source: string; icon: LucideIcon; concept: string; amount: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="size-4 text-slate-400" />
        {source}
      </p>
      <p className="mt-3 text-sm text-slate-600">{concept}</p>
      <p className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{amount}</p>
    </div>
  )
}

export function WhatIsReconciliation() {
  return (
    <div className="space-y-8">
      <Lead>
        Una empresa registra sus operaciones en su sistema contable y, por otro lado, recibe los movimientos de su
        banco. <strong className="font-semibold text-slate-900">Conciliar</strong> es comparar ambos registros para
        identificar cuáles corresponden entre sí y detectar diferencias o movimientos pendientes de revisar.
      </Lead>

      <div className="space-y-3">
        <SectionLabel>Ejemplo</SectionLabel>
        <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
          <RecordCard source="Registro en Fintaz" icon={FileText} concept="Pago de proveedor" amount="$500.000" />
          <div className="flex items-center justify-center gap-2 py-1 md:flex-col">
            <span className="flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-xs">
              <ArrowLeftRight className="size-4" />
            </span>
            <span className="text-xs font-medium text-slate-500">¿Misma operación?</span>
          </div>
          <RecordCard source="Movimiento bancario" icon={Landmark} concept="Débito" amount="$500.000" />
        </div>
        <p className="text-sm text-slate-500">
          El usuario compara la información de ambos registros para determinar si corresponden a la misma operación.
        </p>
      </div>

      <Callout tone="warning" title="El mismo valor no es prueba suficiente">
        Dos movimientos pueden tener el mismo valor y corresponder a operaciones distintas. Antes de decidir, se revisa
        también otra información disponible, como la fecha o la referencia.
      </Callout>

      <div className="space-y-3">
        <SectionLabel>Al comparar, el usuario identifica</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: CircleCheck, title: 'Correspondencias', text: 'Registros que pertenecen a la misma operación.', tone: 'text-emerald-600 bg-emerald-50' },
            { icon: TriangleAlert, title: 'Diferencias', text: 'Información que no coincide entre ambos registros.', tone: 'text-amber-600 bg-amber-50' },
            { icon: Clock, title: 'Pendientes', text: 'Movimientos que aún deben revisarse.', tone: 'text-slate-600 bg-slate-100' },
          ].map(({ icon: Icon, title, text, tone }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className={`flex size-8 items-center justify-center rounded-lg ${tone}`}>
                <Icon className="size-4" />
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Lección 2 ---------- */

const concepts = [
  {
    id: 'import',
    icon: Upload,
    name: 'Importar',
    text: 'Incorporar movimientos bancarios al sistema para que puedan consultarse y procesarse.',
  },
  {
    id: 'register',
    icon: PenLine,
    name: 'Registrar',
    text: 'Crear o incorporar una transacción en los registros de la empresa.',
  },
  {
    id: 'reconcile',
    icon: ArrowLeftRight,
    name: 'Conciliar',
    text: 'Comparar los movimientos bancarios con las transacciones registradas para identificar cuáles corresponden entre sí.',
  },
]

export function ImportRegisterReconcile() {
  return (
    <div className="space-y-8">
      <Lead>
        Son tres acciones distintas que suelen confundirse. Distinguirlas te ayudará a explicar con precisión en qué
        parte del proceso actúa Smart Reconciliation.
      </Lead>

      <div className="grid gap-3 md:grid-cols-3">
        {concepts.map(({ id, icon: Icon, name, text }, i) => (
          <div key={id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="size-5" />
              </span>
              <span className="text-xs font-medium text-slate-400">0{i + 1}</span>
            </div>
            <p className="mt-4 font-semibold tracking-tight text-slate-900">{name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <ActivityCard title="Clasifica cada acción" instructions="Elige si cada acción corresponde a importar, registrar o conciliar.">
        <ClassifyActivity
          categories={concepts.map(({ id, name }) => ({ id, label: name }))}
          items={[
            {
              text: 'Traer al sistema los movimientos de la cuenta bancaria de la empresa.',
              answer: 'import',
              feedback: 'Importar incorpora los movimientos bancarios para que puedan consultarse y procesarse.',
            },
            {
              text: 'Crear en Fintaz el pago realizado a un proveedor.',
              answer: 'register',
              feedback: 'Registrar crea o incorpora la transacción en los registros de la empresa.',
            },
            {
              text: 'Verificar si un débito del banco corresponde al pago registrado.',
              answer: 'reconcile',
              feedback: 'Conciliar compara el movimiento bancario con la transacción registrada.',
            },
          ]}
        />
      </ActivityCard>
    </div>
  )
}

/* ---------- Lección 3 ---------- */

export function WhatIsSmartReconciliation() {
  return (
    <div className="space-y-8">
      <Lead>
        Smart Reconciliation forma parte del <strong className="font-semibold text-slate-900">módulo de conciliación
        bancaria</strong>. Cuando se importan o sincronizan movimientos bancarios, el sistema analiza la información
        disponible, busca posibles coincidencias con transacciones registradas y presenta sugerencias para que el
        usuario las revise.
      </Lead>

      <div className="space-y-3">
        <SectionLabel>Cómo funciona</SectionLabel>
        <FlowDiagram
          steps={[
            { icon: ListChecks, title: 'Consultar movimientos pendientes', actor: 'system' },
            { icon: ScanSearch, title: 'Analizar información disponible', actor: 'system' },
            { icon: Search, title: 'Identificar posibles coincidencias', actor: 'system' },
            { icon: Sparkles, title: 'Presentar sugerencias', actor: 'system' },
            { icon: UserCheck, title: 'El usuario revisa', actor: 'user' },
            { icon: CircleCheck, title: 'El usuario acepta o rechaza', actor: 'user' },
          ]}
        />
      </div>

      <Callout tone="success" title="El sistema sugiere. El usuario decide.">
        Las sugerencias agilizan la revisión, pero la decisión de aceptar o rechazar cada una es del usuario.
      </Callout>
    </div>
  )
}

/* ---------- Lección 4 ---------- */

export function CapabilitiesAndLimits() {
  return (
    <div className="space-y-8">
      <Lead>
        Comunicar con precisión lo que hace el producto, y lo que no, genera confianza y evita expectativas incorrectas.
      </Lead>

      <CompareColumns
        positive={{
          title: 'Sí hace',
          items: [
            'Analiza movimientos pendientes.',
            'Busca posibles coincidencias.',
            'Presenta sugerencias.',
            'Utiliza señales disponibles como valor, fecha, referencia e información de los documentos.',
            'Permite al usuario revisar y aceptar o rechazar.',
          ],
        }}
        negative={{
          title: 'No hace',
          items: [
            'No concilia automáticamente todas las transacciones.',
            'No garantiza que todas las sugerencias sean correctas.',
            'No crea facturas inexistentes.',
            'No modifica documentos contables automáticamente.',
            'No sustituye la revisión del usuario.',
          ],
        }}
      />

      <KeyMessage
        label="Mensaje autorizado"
        message="Fintaz analiza tus movimientos y te sugiere posibles coincidencias para que puedas revisar y conciliar más rápido."
      />
    </div>
  )
}

/* ---------- Lección 5 ---------- */

export function PossibleSituations() {
  return (
    <div className="space-y-8">
      <Lead>
        Estas situaciones son parte normal del uso del producto. Abre cada tarjeta para ver cómo interpretarla.
      </Lead>

      <div className="grid gap-3 sm:grid-cols-2">
        <RevealCard icon={SearchX} title="No aparece ninguna sugerencia">
          El sistema busca coincidencias con la información disponible y no siempre encuentra una. Esto no significa
          automáticamente que exista un error del producto: el usuario puede continuar con su proceso habitual.
        </RevealCard>
        <RevealCard icon={Copy} title="Varias transacciones con valores similares">
          El valor es solo una de las señales. Conviene revisar también la fecha, la referencia y la información de los
          documentos antes de decidir.
        </RevealCard>
        <RevealCard icon={TriangleAlert} title="Una sugerencia parece incorrecta">
          Las sugerencias no siempre son correctas. El usuario verifica la información y, si no corresponde, la
          rechaza.
        </RevealCard>
        <RevealCard icon={EyeOff} title="Movimientos con información limitada">
          Cuanta menos información contiene un movimiento, menos señales hay para comparar. La revisión del usuario
          sigue siendo clave para decidir.
        </RevealCard>
      </div>

      <Callout title="Sin sugerencia no significa error">
        La ausencia de sugerencias no indica automáticamente un problema del producto. El usuario puede continuar con
        su proceso habitual de conciliación.
      </Callout>
    </div>
  )
}

/* ---------- Lección 6 ---------- */

export function FundamentalsCheck() {
  return (
    <div className="space-y-8">
      <Lead>Antes de pasar a tu ruta, comprueba que tienes claros los conceptos clave.</Lead>

      <ActivityCard title="Comprobación de comprensión">
        <div className="space-y-8">
          <Quiz
            question="1. Un movimiento bancario y una transacción registrada tienen el mismo valor. ¿Qué significa?"
            options={[
              { text: 'Que son la misma operación.', feedback: 'El valor coincidente es una señal, no una prueba suficiente.' },
              { text: 'Que es una señal y conviene revisar otra información antes de decidir.', correct: true, feedback: 'El usuario compara también fecha, referencia e información disponible.' },
              { text: 'Que el sistema los conciliará automáticamente.', feedback: 'Smart Reconciliation no concilia automáticamente: presenta sugerencias para revisar.' },
            ]}
          />
          <Quiz
            question="2. ¿Quién decide si una sugerencia se acepta?"
            options={[
              { text: 'Smart Reconciliation, de forma automática.', feedback: 'El sistema solo sugiere; no sustituye la revisión del usuario.' },
              { text: 'El usuario, después de revisarla.', correct: true, feedback: 'El usuario revisa cada sugerencia y la acepta o la rechaza.' },
              { text: 'Se acepta al importar los movimientos.', feedback: 'Importar solo incorpora los movimientos; la decisión llega después de la revisión.' },
            ]}
          />
          <Quiz
            question="3. Un usuario no ve ninguna sugerencia para un movimiento. ¿Qué es lo correcto?"
            options={[
              { text: 'Asumir que el producto tiene una falla.', feedback: 'La ausencia de sugerencias no indica automáticamente un error.' },
              { text: 'Volver a registrar todas las transacciones.', feedback: 'No es necesario: el sistema simplemente no encontró una coincidencia.' },
              { text: 'Entender que no siempre hay sugerencias y continuar con el proceso habitual.', correct: true, feedback: 'El sistema no siempre encuentra coincidencias con la información disponible.' },
            ]}
          />
        </div>
      </ActivityCard>
    </div>
  )
}

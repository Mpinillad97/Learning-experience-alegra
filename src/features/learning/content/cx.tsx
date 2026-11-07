import {
  CircleSlash,
  Hand,
  MapPin,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
  BadgeCheck,
  Search,
} from 'lucide-react'
import { ActivityCard } from '../../../components/learning/ActivityCard'
import { Callout } from '../../../components/learning/Callout'
import { ClassifyActivity } from '../../../components/learning/ClassifyActivity'
import { FlowDiagram } from '../../../components/learning/FlowDiagram'
import { Lead, SectionLabel } from '../../../components/learning/Lead'
import { Quiz } from '../../../components/learning/Quiz'

/* ---------- Lección 1 ---------- */

const explainPoints = [
  { icon: MapPin, title: 'Dónde está', text: 'Dentro del módulo de conciliación bancaria, cuando se importan o sincronizan movimientos.' },
  { icon: ScanSearch, title: 'Qué analiza', text: 'Movimientos pendientes y señales como valor, fecha, referencia e información de los documentos.' },
  { icon: Sparkles, title: 'Por qué sugiere', text: 'Identifica posibles coincidencias para que el usuario pueda revisar y conciliar más rápido.' },
  { icon: UserCheck, title: 'Por qué decide el usuario', text: 'Las sugerencias no siempre son correctas; el usuario revisa y mantiene el control.' },
]

export function UnderstandAndGuide() {
  return (
    <div className="space-y-8">
      <Lead>
        Para orientar al usuario con confianza, necesitas explicar el flujo completo con palabras sencillas.
      </Lead>

      <FlowDiagram
        layout="horizontal"
        steps={[
          { icon: Upload, title: 'Movimientos importados o sincronizados', actor: 'system' },
          { icon: ScanSearch, title: 'Analiza la información disponible', actor: 'system' },
          { icon: Sparkles, title: 'Presenta posibles coincidencias', actor: 'system' },
          { icon: UserCheck, title: 'El usuario revisa y decide', actor: 'user' },
        ]}
      />

      <div className="space-y-3">
        <SectionLabel>Lo que debes poder explicar</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {explainPoints.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="flex size-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Icon className="size-4" />
                </span>
                {title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Lección 2 ---------- */

function SituationLabel({ letter }: { letter: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
      Situación {letter}
    </span>
  )
}

export function HandleSuggestions() {
  return (
    <div className="space-y-8">
      <Lead>
        Responde a cada situación como lo harías con un usuario real. Recibirás la respuesta esperada al instante.
      </Lead>

      <ActivityCard title="Situación A · Sugerencia de otro cliente">
        <Quiz
          context={<SituationLabel letter="A" />}
          question="El usuario encuentra una sugerencia que parece corresponder a otro cliente. ¿Qué le indicas?"
          options={[
            { text: 'Que la acepte para avanzar más rápido.', feedback: 'No se debe recomendar aceptar una sugerencia que parece no corresponder.' },
            { text: 'Que verifique la información y la rechace si no corresponde a la transacción correcta.', correct: true, feedback: 'El usuario verifica y rechaza la sugerencia si no corresponde.' },
            { text: 'Que el sistema tiene un error grave.', feedback: 'Las sugerencias no siempre son correctas; rechazarla es parte del proceso normal.' },
          ]}
        />
      </ActivityCard>

      <ActivityCard title="Situación B · Ninguna sugerencia">
        <Quiz
          context={<SituationLabel letter="B" />}
          question="El usuario no recibe ninguna sugerencia. ¿Qué le explicas?"
          options={[
            { text: 'Que el producto falló y debe esperar una solución.', feedback: 'La ausencia de sugerencias no indica automáticamente un error.' },
            { text: 'Que espere: el sistema terminará conciliando por su cuenta.', feedback: 'El sistema no concilia automáticamente.' },
            { text: 'Que el sistema busca coincidencias con la información disponible, no siempre las encuentra y puede continuar con su proceso habitual.', correct: true, feedback: 'Explica el comportamiento esperado y le permite seguir avanzando.' },
          ]}
        />
      </ActivityCard>

      <ActivityCard title="Situación C · Valores similares">
        <Quiz
          context={<SituationLabel letter="C" />}
          question="Existen varias transacciones con valores similares. ¿Qué le recomiendas?"
          options={[
            { text: 'Revisar también la fecha, la referencia y la información disponible antes de decidir.', correct: true, feedback: 'El valor es solo una de las señales.' },
            { text: 'Aceptar la primera que tenga el mismo valor.', feedback: 'Un valor igual no prueba que se trate de la misma operación.' },
            { text: 'Rechazar todas las sugerencias.', feedback: 'Alguna puede ser correcta; el usuario debe revisar antes de decidir.' },
          ]}
        />
      </ActivityCard>
    </div>
  )
}

/* ---------- Lección 3 ---------- */

const keyMessages = [
  { icon: Hand, title: 'No concilia todo automáticamente', text: 'Smart Reconciliation presenta sugerencias; no realiza toda la conciliación.' },
  { icon: ShieldCheck, title: 'El usuario mantiene el control', text: 'Revisa cada sugerencia y decide si la acepta o la rechaza.' },
  { icon: BadgeCheck, title: 'Disponibilidad por cuenta', text: 'La disponibilidad debe validarse para cada cuenta.' },
]

export function ExpectationsAndEscalation() {
  return (
    <div className="space-y-8">
      <Lead>
        Una buena orientación también implica reconocer qué puedes responder y qué debe confirmarse con el área
        responsable.
      </Lead>

      <div className="grid gap-3 md:grid-cols-3">
        {keyMessages.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="flex size-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Icon className="size-4.5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SectionLabel>No inventes respuestas sobre</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {['Bancos compatibles', 'Costos', 'Disponibilidad'].map((item) => (
            <span key={item} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-xs">
              <CircleSlash className="size-4 text-rose-500" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <Callout title="Información no confirmada">
        Las consultas sobre información que no está confirmada deben escalarse al área responsable.
      </Callout>

      <ActivityCard title="¿Respondes o escalas?" instructions="Decide si puedes responder directamente o si la consulta debe escalarse.">
        <ClassifyActivity
          categories={[
            { id: 'answer', label: 'Respondo' },
            { id: 'escalate', label: 'Escalo' },
          ]}
          items={[
            { text: '“¿Smart Reconciliation concilia automáticamente todas mis transacciones?”', answer: 'answer', feedback: 'Puedes responder: no, presenta sugerencias y el usuario decide.' },
            { text: '“¿Con qué bancos es compatible?”', answer: 'escalate', feedback: 'La compatibilidad bancaria no está confirmada: escala la consulta.' },
            { text: '“¿Por qué no veo sugerencias para este movimiento?”', answer: 'answer', feedback: 'Puedes explicarlo: el sistema no siempre encuentra coincidencias con la información disponible.' },
            { text: '“¿Cuánto cuesta esta funcionalidad?”', answer: 'escalate', feedback: 'Los costos no están confirmados: no los inventes y escala la consulta.' },
          ]}
        />
      </ActivityCard>

      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Search className="size-4" />
        Ante la duda, valida antes de responder.
      </p>
    </div>
  )
}

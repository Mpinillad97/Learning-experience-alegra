import type { CriticalError, Scenario } from '../types/simulation'

const recommendsWrongMatch: CriticalError = {
  id: 'cx-accept-wrong-suggestion',
  label: 'Recomendar aceptar una sugerencia que no corresponde con la transacción real',
  risk:
    'Aceptar una coincidencia incorrecta deja el movimiento asociado a una transacción que no le corresponde. La conciliación del cliente queda con información errónea y se pierde la confianza en la orientación recibida.',
}

export const cxScenario: Scenario = {
  id: 'cx-guidance',
  roleId: 'cx',
  title: 'Primeras sugerencias de Carlos',
  participantLabel: 'Tú · Agente de Customer Experience',
  customer: {
    name: 'Carlos Rivas',
    initials: 'CR',
    description: 'Contador · Ferretería El Puente',
  },
  context:
    'Carlos importó los movimientos bancarios del mes en el módulo de conciliación bancaria. Es la primera vez que ve sugerencias de Smart Reconciliation y escribe al chat de soporte.',
  objective:
    'Entender qué intenta hacer Carlos, orientarlo en el uso de las sugerencias y resolver sus dudas sin inventar información.',
  decisions: [
    {
      id: 'understanding',
      criterion: 'Comprensión del problema',
      criterionDescription: 'Identifica qué intenta hacer el cliente y en qué punto tiene dificultades.',
      customerMessage:
        'Hola, estoy en conciliación bancaria y me aparecen unas cosas que no entiendo. No sé si las tengo que aceptar todas.',
      prompt: 'Carlos está confundido. ¿Cuál es tu primera respuesta?',
      options: [
        {
          id: 'a',
          text: 'Sí, acéptalas todas para terminar más rápido.',
          score: 0,
          critical: recommendsWrongMatch,
          feedback:
            'Error crítico: recomiendas aceptar sugerencias sin revisarlas, incluidas las que podrían no corresponder. Además, no has entendido qué está viendo Carlos.',
        },
        {
          id: 'b',
          text: 'Hola Carlos, te ayudo. Para entender bien: ¿estás revisando los movimientos que importaste y lo que ves son sugerencias de coincidencia? ¿Con cuál tienes dudas?',
          score: 2,
          feedback:
            'Confirmas qué intenta hacer Carlos y en qué punto se atasca antes de orientarlo. Así tu respuesta será precisa.',
        },
        {
          id: 'c',
          text: '¿Qué te aparece exactamente? Envíame una captura.',
          score: 1,
          feedback:
            'Buscas entender el problema, pero sin ubicar a Carlos en el proceso. Confirma también qué estaba haciendo y qué decisión le genera dudas.',
        },
        {
          id: 'd',
          text: 'Te envío el manual de conciliación bancaria para que lo revises con calma.',
          score: 0,
          feedback:
            'Delegas el problema sin entenderlo. Carlos necesita orientación sobre su situación concreta.',
        },
      ],
      strength: 'Confirmaste qué intentaba hacer el cliente y en qué punto tenía dificultades.',
      recommendation:
        'Antes de orientar, confirma qué está haciendo el usuario (por ejemplo, revisando movimientos importados) y qué decisión le genera dudas.',
    },
    {
      id: 'how-it-works',
      criterion: 'Funcionamiento',
      criterionDescription: 'Explica cómo se generan las sugerencias y qué debe hacer el usuario.',
      customerMessage:
        'Sí, son los movimientos que importé hoy. Aparecen como «sugerencias». ¿De dónde salen y qué hago con ellas?',
      prompt: 'Explícale a Carlos cómo funcionan las sugerencias.',
      options: [
        {
          id: 'a',
          text: 'Son coincidencias que el sistema ya verificó, así que puedes confiar en ellas.',
          score: 0,
          feedback:
            'Las sugerencias son posibles coincidencias, no verificaciones. El sistema no garantiza que todas sean correctas y el usuario debe revisarlas.',
        },
        {
          id: 'b',
          text: 'Son sugerencias automáticas del sistema; revisa las que quieras.',
          score: 1,
          feedback:
            'Mencionas la revisión, pero no explicas cómo se generan ni que Carlos debe decidir sobre cada una.',
        },
        {
          id: 'c',
          text: 'Smart Reconciliation analiza los movimientos importados y busca posibles coincidencias con tus transacciones registradas, usando señales como valor, fecha, referencia e información de los documentos. Tú revisas cada sugerencia y decides si aceptarla o rechazarla.',
          score: 2,
          feedback:
            'Explicas de dónde salen las sugerencias, qué señales usa el sistema y que la decisión es de Carlos.',
        },
      ],
      strength: 'Explicaste cómo se generan las sugerencias y que el usuario revisa y decide.',
      recommendation:
        'Repasa «Comprende y orienta el proceso»: el sistema analiza movimientos con señales como valor, fecha y referencia, presenta posibles coincidencias y el usuario las acepta o rechaza.',
    },
    {
      id: 'wrong-suggestion',
      criterion: 'Sugerencia incorrecta',
      criterionDescription: 'Identifica que una sugerencia que no corresponde no debe aceptarse.',
      customerMessage:
        'Una sugerencia relaciona un depósito de $1.200.000 con una factura de Constructora Sol. El valor es igual, pero ese pago lo hizo Inversiones Rojas. ¿La acepto igual para avanzar?',
      prompt: 'La sugerencia no corresponde con la transacción real. ¿Qué le indicas?',
      options: [
        {
          id: 'a',
          text: 'Déjala pendiente por ahora y sigue con las demás.',
          score: 1,
          feedback:
            'Evitas que la acepte, pero no lo orientas a resolverla. Si después de verificar no corresponde, debe rechazarla.',
        },
        {
          id: 'b',
          text: 'Es un error del sistema; lo reporto para que lo corrijan.',
          score: 0,
          feedback:
            'Una sugerencia incorrecta no es necesariamente un error: las sugerencias no siempre aciertan. Rechazarla es parte del proceso normal.',
        },
        {
          id: 'c',
          text: 'No la aceptes. Verifica la información del movimiento y, si no corresponde a la transacción correcta, recházala. Luego puedes continuar con tu proceso habitual para ese movimiento.',
          score: 2,
          feedback:
            'Correcto: el usuario verifica y rechaza la sugerencia si no corresponde. Un valor igual no prueba que sea la misma operación.',
        },
        {
          id: 'd',
          text: 'Sí, acéptala; si el valor coincide no pasa nada y luego lo ajustas.',
          score: 0,
          critical: recommendsWrongMatch,
          feedback:
            'Error crítico: recomiendas aceptar una sugerencia que no corresponde con la transacción real. El mismo valor no prueba que sea la misma operación.',
        },
      ],
      strength: 'Identificaste que una sugerencia que no corresponde debe verificarse y rechazarse.',
      recommendation:
        'Repasa «Maneja sugerencias incorrectas o ausentes»: nunca recomiendes aceptar una sugerencia que no corresponde; el usuario verifica y la rechaza.',
    },
    {
      id: 'ambiguity',
      criterion: 'Ausencia o ambigüedad',
      criterionDescription:
        'Orienta al cliente cuando no hay sugerencias o existen varias transacciones con valores similares.',
      customerMessage:
        'Otra cosa: hay un movimiento sin ninguna sugerencia, y otro de $350.000 donde aparecen dos facturas con el mismo valor. ¿Qué hago con cada uno?',
      prompt: 'Carlos tiene dos situaciones distintas. ¿Cómo lo orientas?',
      options: [
        {
          id: 'a',
          text: 'El que no tiene sugerencia lo puedes trabajar con tu proceso habitual. Para el otro, elige la factura más reciente.',
          score: 1,
          feedback:
            'Orientas bien el caso sin sugerencia, pero en el segundo propones un atajo. Debe revisar fecha, referencia e información disponible antes de decidir.',
        },
        {
          id: 'b',
          text: 'Para el que no tiene sugerencia: el sistema no siempre encuentra una coincidencia con la información disponible; puedes continuar con tu proceso habitual. Para el de $350.000: el valor es solo una señal; revisa fecha, referencia e información de las facturas antes de decidir.',
          score: 2,
          feedback:
            'Orientas ambas situaciones con precisión: la ausencia de sugerencias no es un error y el valor no basta para decidir.',
        },
        {
          id: 'c',
          text: 'Si no hay sugerencia, es un fallo del sistema. Para el otro, acepta cualquiera de las dos: tienen el mismo valor.',
          score: 0,
          critical: recommendsWrongMatch,
          feedback:
            'Error crítico: recomiendas aceptar una factura sin verificar que corresponda; al menos una de las dos no es la transacción real. Además, la ausencia de sugerencias no indica un fallo.',
        },
        {
          id: 'd',
          text: 'Espera unos días; el sistema terminará conciliándolos automáticamente.',
          score: 0,
          feedback:
            'Smart Reconciliation no concilia automáticamente. Carlos puede continuar con su proceso habitual y revisar las señales disponibles.',
        },
      ],
      strength: 'Orientaste correctamente la ausencia de sugerencias y la ambigüedad entre valores similares.',
      recommendation:
        'Repasa «Situaciones que pueden presentarse»: sin sugerencia, el usuario continúa con su proceso habitual; con valores similares, revisa fecha, referencia e información disponible.',
    },
    {
      id: 'resolution',
      criterion: 'Resolución y expectativas',
      criterionDescription:
        'Ofrece orientación clara, evita inventar procedimientos internos y reconoce cuándo se requiere escalamiento.',
      customerMessage:
        'Gracias, ya me quedó más claro. Última pregunta: tengo otra cuenta en un banco distinto. ¿Smart Reconciliation funciona con todos los bancos?',
      prompt: 'Carlos pregunta por compatibilidad bancaria, información que no tienes confirmada. ¿Qué respondes?',
      options: [
        {
          id: 'a',
          text: 'Sí, funciona con todos los bancos y todas las cuentas.',
          score: 0,
          feedback:
            'Inventas información sobre compatibilidad bancaria que no está confirmada. Puede generar una expectativa falsa.',
        },
        {
          id: 'b',
          text: 'Abro un ticket prioritario con el equipo de integraciones bancarias y te responden en 24 horas.',
          score: 0,
          feedback:
            'Inventas un procedimiento, un equipo y un tiempo de respuesta que no están documentados.',
        },
        {
          id: 'c',
          text: 'Esa información no la tengo confirmada y no quiero darte una respuesta incorrecta, así que escalaré tu consulta al área responsable. Mientras tanto, en esa cuenta puedes seguir conciliando con tu proceso habitual.',
          score: 2,
          feedback:
            'Reconoces que la información no está confirmada, escalas sin inventar procedimientos y dejas a Carlos con una orientación clara.',
        },
        {
          id: 'd',
          text: 'No lo sé; búscalo en la página web.',
          score: 1,
          feedback:
            'No inventas información, pero tampoco orientas ni escalas. La consulta sobre información no confirmada debe escalarse al área responsable.',
        },
      ],
      strength: 'Reconociste la necesidad de escalar sin inventar procedimientos ni información.',
      recommendation:
        'Repasa «Expectativas y escalamiento»: no inventes respuestas sobre bancos, costos o disponibilidad; escala la consulta al área responsable sin prometer procedimientos ni tiempos.',
    },
  ],
}

import type { CriticalError, Scenario } from '../types/simulation'

const promisesFullAutomation: CriticalError = {
  id: 'sales-full-automation',
  label: 'Prometer que Smart Reconciliation automatiza completamente la conciliación',
  risk:
    'Smart Reconciliation sugiere posibles coincidencias y el usuario debe revisarlas. Prometer automatización total crea una expectativa falsa: el cliente puede dejar de revisar, aceptar coincidencias incorrectas y perder la confianza en Fintaz cuando descubra que el producto no hace lo prometido.',
}

const promisesUnbackedResults: CriticalError = {
  id: 'sales-unbacked-results',
  label: 'Prometer ahorros o resultados cuantitativos sin respaldo',
  risk:
    'Las cifras de ahorro no están respaldadas. Comprometer a Fintaz con resultados que no se pueden garantizar genera una expectativa que probablemente no se cumpla y deteriora la credibilidad de la relación comercial.',
}

export const salesScenario: Scenario = {
  id: 'sales-discovery',
  roleId: 'sales',
  title: 'Primera reunión con Distribuidora Andina',
  participantLabel: 'Tú · Representante de Fintaz',
  customer: {
    name: 'Laura Méndez',
    initials: 'LM',
    description: 'Gerente administrativa · Distribuidora Andina',
  },
  context:
    'Laura usa Fintaz para su contabilidad y aceptó una llamada breve porque escuchó que hay novedades en conciliación bancaria. Aún no sabes cómo concilia hoy su equipo.',
  objective:
    'Entender la situación de Laura, conectar su necesidad con Smart Reconciliation y gestionar sus expectativas con precisión.',
  decisions: [
    {
      id: 'discovery',
      criterion: 'Discovery',
      criterionDescription: 'Identifica cómo realiza actualmente el cliente su conciliación bancaria antes de presentar la solución.',
      customerMessage:
        'Hola, gracias por la llamada. Me comentaron que tienen algo nuevo para la conciliación bancaria. ¿De qué se trata?',
      prompt: 'Laura te pide que le presentes la novedad. ¿Cómo inicias la conversación?',
      options: [
        {
          id: 'a',
          text: 'Se llama Smart Reconciliation: analiza tus movimientos y sugiere posibles coincidencias. Te muestro la pantalla y luego vemos si te sirve.',
          score: 1,
          feedback:
            'La descripción es correcta, pero presentas la solución antes de entender cómo concilia hoy Laura. Sin ese contexto, tu propuesta será genérica.',
        },
        {
          id: 'b',
          text: 'Claro. Antes de mostrarte nada, me gustaría entender cómo realizan hoy la conciliación bancaria en tu equipo. ¿Me cuentas cómo es el proceso?',
          score: 2,
          feedback:
            'Abres con discovery: una pregunta abierta sobre el proceso actual. Así podrás posicionar el producto según la situación real de Laura.',
        },
        {
          id: 'c',
          text: 'Es nuestra nueva inteligencia artificial: concilia automáticamente todos tus movimientos bancarios. Ya no tendrás que hacerlo tú.',
          score: 0,
          critical: promisesFullAutomation,
          feedback:
            'Error crítico: Smart Reconciliation no concilia automáticamente. Analiza movimientos y sugiere posibles coincidencias que el usuario revisa y decide.',
        },
        {
          id: 'd',
          text: '¿Están conformes con su sistema contable actual?',
          score: 0,
          feedback:
            'Es una pregunta cerrada y ajena a la conciliación bancaria. No te ayuda a entender cómo concilia hoy el cliente.',
        },
      ],
      strength: 'Indagaste cómo concilia hoy el cliente antes de presentar la solución.',
      recommendation:
        'Repasa la lección «Primero descubre»: abre con una pregunta abierta como «¿Cómo realizan actualmente la conciliación bancaria?» antes de hablar de funcionalidades.',
    },
    {
      id: 'context',
      criterion: 'Necesidad y contexto',
      criterionDescription: 'Pregunta por volumen, tiempo invertido o dificultades del proceso.',
      customerMessage:
        'Hoy lo hacemos en Excel. Descargamos el extracto del banco y una persona lo compara línea por línea con lo que tenemos registrado en Fintaz.',
      prompt: 'Ya conoces el proceso general. ¿Cuál es tu siguiente paso?',
      options: [
        {
          id: 'a',
          text: 'Perfecto, entonces Smart Reconciliation es justo lo que necesitas. Déjame explicarte cómo funciona.',
          score: 0,
          feedback:
            'Asumes la necesidad sin profundizar. Todavía no sabes cuántos movimientos manejan, cuánto tiempo les toma ni qué les resulta difícil.',
        },
        {
          id: 'b',
          text: '¿Y eso les resulta difícil?',
          score: 1,
          feedback:
            'Vas en la dirección correcta, pero la pregunta es cerrada y superficial. Indaga también por volumen y tiempo para dimensionar la necesidad.',
        },
        {
          id: 'c',
          text: 'Con Excel deben estar perdiendo muchísimo tiempo. Con Smart Reconciliation ese tiempo se reduce a la mitad.',
          score: 0,
          critical: promisesUnbackedResults,
          feedback:
            'Error crítico: prometes un ahorro concreto («a la mitad») que no está respaldado. Además, sacas conclusiones sin preguntar.',
        },
        {
          id: 'd',
          text: 'Entiendo. ¿Qué volumen de movimientos manejan al mes, cuánto tiempo les toma revisarlos y qué es lo que más les cuesta?',
          score: 2,
          feedback:
            'Profundizas en volumen, tiempo y dificultades. Con esta información podrás conectar la funcionalidad con una necesidad concreta.',
        },
      ],
      strength: 'Profundizaste en el volumen, el tiempo invertido y las dificultades del proceso.',
      recommendation:
        'Después de conocer el proceso, pregunta por el volumen de movimientos, el tiempo que invierten y las dificultades que encuentran antes de posicionar el producto.',
    },
    {
      id: 'value',
      criterion: 'Propuesta de valor',
      criterionDescription: 'Conecta la necesidad identificada con la funcionalidad de Smart Reconciliation.',
      customerMessage:
        'Son unos 600 movimientos al mes. Lo que más nos cuesta es identificar qué movimiento corresponde a qué transacción; hay muchos pagos parecidos y se nos van varios días.',
      prompt: 'Laura describió su necesidad. ¿Cómo la conectas con Smart Reconciliation?',
      options: [
        {
          id: 'a',
          text: 'Smart Reconciliation analiza los movimientos que importan o sincronizan y presenta posibles coincidencias con sus transacciones registradas, para que tu equipo las revise y concilie más rápido.',
          score: 2,
          feedback:
            'Conectas la dificultad que Laura expresó (identificar correspondencias) con lo que el producto realmente hace, sin inventar cifras.',
        },
        {
          id: 'b',
          text: 'Smart Reconciliation tiene funcionalidades de inteligencia artificial muy avanzadas. Es lo más moderno del mercado.',
          score: 0,
          feedback:
            'Es un discurso genérico que no se relaciona con la necesidad de Laura ni explica qué hace el producto.',
        },
        {
          id: 'c',
          text: 'Fintaz tiene un módulo de conciliación bancaria que les puede servir.',
          score: 1,
          feedback:
            'Es correcto, pero no conectas con la dificultad concreta de Laura ni explicas cómo Smart Reconciliation la ayuda a identificar correspondencias.',
        },
        {
          id: 'd',
          text: 'Con Smart Reconciliation esos días de trabajo se convierten en una hora.',
          score: 0,
          critical: promisesUnbackedResults,
          feedback:
            'Error crítico: prometes un resultado cuantitativo sin respaldo. Relaciona el valor con la necesidad, no con cifras inventadas.',
        },
      ],
      strength: 'Conectaste la necesidad del cliente con lo que hace Smart Reconciliation.',
      recommendation:
        'Repasa «Conecta la necesidad con el valor»: retoma lo que el cliente expresó y explica cómo las sugerencias de posibles coincidencias lo ayudan, sin discursos genéricos ni cifras.',
    },
    {
      id: 'capabilities',
      criterion: 'Capacidades y limitaciones',
      criterionDescription:
        'Explica que el sistema analiza movimientos y sugiere posibles coincidencias para revisión del usuario.',
      customerMessage:
        'Suena bien. Entonces, ¿el sistema hace la conciliación por nosotros? ¿Ya no tendríamos que revisar nada?',
      prompt: 'Laura quiere saber qué hace exactamente el sistema. ¿Qué le respondes?',
      options: [
        {
          id: 'a',
          text: 'Sí, el sistema concilia todo automáticamente. Tu equipo solo tendría que mirar el resultado final de vez en cuando.',
          score: 0,
          critical: promisesFullAutomation,
          feedback:
            'Error crítico: el sistema no concilia automáticamente. Presenta sugerencias y el usuario revisa y decide cada una.',
        },
        {
          id: 'b',
          text: 'Hace una parte del trabajo. Los detalles técnicos te los puede explicar el equipo de soporte más adelante.',
          score: 1,
          feedback:
            'No prometes de más, pero evitas explicar cómo funciona. Laura necesita entender qué hace el sistema y qué le corresponde a su equipo.',
        },
        {
          id: 'c',
          text: 'Sugiere coincidencias y casi siempre acierta, así que la revisión es prácticamente un trámite.',
          score: 0,
          feedback:
            'El sistema no garantiza que todas las sugerencias sean correctas. Restarle importancia a la revisión genera una expectativa equivocada.',
        },
        {
          id: 'd',
          text: 'No exactamente. El sistema analiza los movimientos y sugiere posibles coincidencias usando señales como valor, fecha y referencia. Tu equipo revisa cada sugerencia y decide si la acepta o la rechaza.',
          score: 2,
          feedback:
            'Explicas con precisión capacidades y límites: el sistema sugiere a partir de señales disponibles y el usuario mantiene la decisión.',
        },
      ],
      strength: 'Explicaste con precisión que el sistema sugiere y el usuario revisa y decide.',
      recommendation:
        'Repasa «Capacidades y limitaciones»: el sistema analiza movimientos y sugiere posibles coincidencias; no concilia automáticamente ni garantiza que todas las sugerencias sean correctas.',
    },
    {
      id: 'expectations',
      criterion: 'Expectativas',
      criterionDescription:
        'Evita prometer automatización total, ahorros no respaldados o funcionalidades no confirmadas.',
      customerMessage:
        'Me interesa. ¿Funciona con todos nuestros bancos? ¿Lo puedo activar mañana mismo? ¿Y cuánto vamos a ahorrar en total?',
      prompt: 'Laura quiere confirmar compatibilidad, disponibilidad y ahorro. ¿Qué le respondes?',
      options: [
        {
          id: 'a',
          text: 'La disponibilidad es progresiva, así que debemos validar si tu cuenta tiene habilitada la funcionalidad. Sobre bancos y resultados, no quiero darte datos sin confirmar: lo valido y te respondo.',
          score: 2,
          feedback:
            'Gestionas las expectativas con honestidad: validas la disponibilidad por cuenta y no prometes compatibilidad ni ahorros que no están confirmados.',
        },
        {
          id: 'b',
          text: 'Sí, funciona con todos los bancos, está disponible para todas las cuentas y el ahorro suele ser del 70%.',
          score: 0,
          critical: promisesUnbackedResults,
          feedback:
            'Error crítico: prometes un ahorro cuantitativo sin respaldo. Además, confirmas compatibilidad y disponibilidad que no están validadas.',
        },
        {
          id: 'c',
          text: 'Seguramente sí; la mayoría de clientes ya lo tiene y activarlo es inmediato.',
          score: 0,
          feedback:
            'Prometes disponibilidad y compatibilidad sin confirmarlas. La disponibilidad es progresiva y debe validarse por cuenta.',
        },
        {
          id: 'd',
          text: 'Eso no te lo puedo responder.',
          score: 1,
          feedback:
            'Evitas prometer de más, pero no orientas a Laura. Explica que la disponibilidad se valida por cuenta y que confirmarás la información pendiente.',
        },
      ],
      strength: 'Gestionaste las expectativas sin prometer compatibilidad, disponibilidad ni resultados.',
      recommendation:
        'Repasa «Gestiona las expectativas»: indica que la disponibilidad es progresiva y se valida por cuenta, y no prometas cifras de ahorro, compatibilidad bancaria ni costos.',
    },
  ],
}

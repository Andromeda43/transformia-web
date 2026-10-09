// src/data/servicios.ts
// Las 7 líneas de servicio, agrupadas en 4 frentes. Alimenta /servicios, /servicios/[slug], home y footer.
import type { IconName } from '../components/ui/Icon.astro';

export type GrupoId = 'producto' | 'automatizacion' | 'integracion' | 'estrategia';

export interface Grupo {
  id: GrupoId;
  nombre: string;
  resumen: string;
  icon: IconName;
}

export interface Servicio {
  slug: string;
  nombre: string;
  nombreCorto: string;
  grupo: GrupoId;
  icon: IconName;
  resumen: string;
  problema: string;
  enfoque: string;
  ejemplos: string[];
  incluye: string[];
  tecnologias: string[];
  casos: string[];
  productos?: ('vera' | 'feriaapp')[];
  seoTitle: string;
  seoDescription: string;
}

export const grupos: Grupo[] = [
  {
    id: 'producto',
    nombre: 'Plataformas web y apps móviles',
    resumen: 'Sistemas de gestión, portales, marketplaces y apps construidos alrededor de cómo funciona tu empresa.',
    icon: 'layout',
  },
  {
    id: 'automatizacion',
    nombre: 'IA aplicada y automatización',
    resumen: 'Bots, validaciones automáticas y flujos que eliminan el trabajo manual que no escala.',
    icon: 'sparkles',
  },
  {
    id: 'integracion',
    nombre: 'Integración y datos',
    resumen: 'Bases de datos bien diseñadas, sistemas que se hablan entre sí y dispositivos conectados al software.',
    icon: 'workflow',
  },
  {
    id: 'estrategia',
    nombre: 'Arquitectura y asesoría',
    resumen: 'Diagnóstico de procesos y diseño técnico antes de escribir una sola línea de código.',
    icon: 'compass',
  },
];

export const servicios: Servicio[] = [
  {
    slug: 'desarrollo',
    nombre: 'Desarrollo de software a la medida',
    nombreCorto: 'Software a la medida',
    grupo: 'producto',
    icon: 'layout',
    resumen: 'Plataformas web, apps móviles y sistemas de gestión construidos para tu operación, no para un caso genérico.',
    problema:
      'La mayoría de los procesos que de verdad importan en una empresa no caben en un software de estante: tienen roles propios, reglas de negocio específicas e integraciones que ningún SaaS contempla. Terminas pagando por módulos que no usas y llevando en Excel lo que el sistema no resuelve.',
    enfoque:
      'Definimos el modelo de datos y la arquitectura antes de escribir código de producción, construimos por módulos en fases aprobadas y entregamos con migración de tus datos, capacitación por rol y manuales. No te entregamos solo código: te entregamos un sistema en operación.',
    ejemplos: ['Plataformas multirol', 'Portales de clientes', 'Marketplaces', 'Apps iOS y Android', 'Paneles administrativos'],
    incluye: [
      'Levantamiento de requerimientos y flujos reales',
      'Diseño de interfaz y prototipo navegable',
      'Desarrollo web y móvil por módulos',
      'Roles, permisos y seguridad a nivel de datos',
      'Migración de datos desde Excel o sistemas anteriores',
      'Despliegue, capacitación por rol y manuales',
    ],
    tecnologias: ['React', 'TypeScript', 'React Native', 'Astro', 'Supabase', 'PostgreSQL', 'Cloudflare'],
    casos: ['feriaapp', 'frigorinoquia', 'portafolio-interlink'],
    seoTitle: 'Desarrollo de software a la medida | Transformia',
    seoDescription:
      'Plataformas web, apps móviles y sistemas de gestión construidos a la medida de tu operación. Desarrollo por fases con precio fijo en Transformia.',
  },
  {
    slug: 'ia',
    nombre: 'Inteligencia artificial aplicada',
    nombreCorto: 'IA aplicada',
    grupo: 'automatizacion',
    icon: 'sparkles',
    resumen: 'IA puesta sobre un cuello de botella concreto: clasificar, extraer, validar o predecir lo que hoy se hace a mano.',
    problema:
      'Hay tareas que alguien de tu equipo repite cientos de veces al mes: revisar documentos, validar pagos, clasificar solicitudes, responder lo mismo. No escalan, cuestan tiempo y son donde más errores aparecen. Un chatbot genérico no las resuelve.',
    enfoque:
      'Antes de proponer un modelo validamos tres cosas: qué tarea exacta se automatiza, con qué datos propios se le da contexto y qué pasa cuando se equivoca. Si el costo de un error es alto, diseñamos con una persona en el circuito para aprobar los casos dudosos.',
    ejemplos: ['Validación automática de comprobantes', 'Extracción de datos de documentos', 'Asistentes sobre WhatsApp', 'Clasificación y priorización', 'Análisis y predicción'],
    incluye: [
      'Diagnóstico de la tarea a automatizar y su retorno',
      'Diseño del flujo con aprobación humana donde aplique',
      'Integración con modelos de lenguaje y visión',
      'Conexión con WhatsApp, correo o tus sistemas',
      'Tablero de seguimiento de aciertos y casos pendientes',
    ],
    tecnologias: ['Claude', 'OpenAI', 'Python', 'Supabase Edge Functions', 'WhatsApp Business API'],
    casos: [],
    productos: ['vera'],
    seoTitle: 'Inteligencia artificial aplicada para empresas | Transformia',
    seoDescription:
      'IA aplicada a procesos reales: validación automática, extracción de documentos y asistentes sobre WhatsApp, con aprobación humana donde importa.',
  },
  {
    slug: 'transformacion',
    nombre: 'Transformación digital y automatización',
    nombreCorto: 'Automatización',
    grupo: 'automatizacion',
    icon: 'route',
    resumen: 'Procesos que hoy viven en papel, Excel o WhatsApp convertidos en flujos digitales que corren solos.',
    problema:
      'Cuando un proceso depende de hojas de cálculo que viajan por correo o de mensajes sueltos, no solo pierdes tiempo: pierdes trazabilidad y la posibilidad de decidir con datos mientras la operación ocurre. La información se reconstruye a mano al final del día, con errores.',
    enfoque:
      'Mapeamos el flujo real antes de automatizar: no digitalizamos un proceso roto, primero lo corregimos. Capturamos el dato en la fuente y actualizamos estados en tiempo real, para que nadie trabaje con información desactualizada.',
    ejemplos: ['Formularios y flujos de aprobación', 'Reportes automáticos', 'Integraciones con Google Workspace', 'Alertas y recordatorios', 'Tableros en tiempo real'],
    incluye: [
      'Mapeo del proceso actual y del proceso objetivo',
      'Automatización de tareas repetitivas',
      'Notificaciones por WhatsApp o correo',
      'Reportes y tableros automáticos',
      'Acompañamiento en la adopción del equipo',
    ],
    tecnologias: ['Python', 'Google Apps Script', 'Looker Studio', 'Power Automate', 'Supabase'],
    casos: ['tracing-colombina', 'frigorinoquia'],
    seoTitle: 'Transformación digital y automatización de procesos | Transformia',
    seoDescription:
      'Llevamos tus procesos de papel, Excel y WhatsApp a flujos digitales automatizados con trazabilidad y datos en tiempo real.',
  },
  {
    slug: 'database',
    nombre: 'Diseño y gestión de bases de datos',
    nombreCorto: 'Bases de datos',
    grupo: 'integracion',
    icon: 'database',
    resumen: 'Modelos de datos pensados para tu volumen y tu forma de consultar, con seguridad por rol desde el inicio.',
    problema:
      'Un modelo de datos mal diseñado se nota tarde: cuando el sistema ya está en producción y cada consulta lenta, cada dato duplicado o cada tabla sin control de acceso cuesta caro de corregir.',
    enfoque:
      'Diseñamos el modelo pensando en el volumen y el patrón de uso real de tu operación. Aplicamos seguridad a nivel de fila para que cada rol vea solo lo suyo y funciones transaccionales para que ninguna operación quede a mitad de camino.',
    ejemplos: ['Modelos relacionales', 'Seguridad por rol (RLS)', 'Migraciones desde Excel', 'Optimización de consultas', 'Respaldos y auditoría'],
    incluye: [
      'Modelo entidad-relación y diccionario de datos',
      'Seguridad a nivel de fila por rol',
      'Funciones transaccionales y disparadores',
      'Migración y limpieza de datos históricos',
      'Monitoreo, respaldos y optimización',
    ],
    tecnologias: ['PostgreSQL', 'Supabase', 'Redis', 'MongoDB'],
    casos: ['frigorinoquia', 'tracing-colombina'],
    seoTitle: 'Diseño y gestión de bases de datos | Transformia',
    seoDescription:
      'Diseño, migración y optimización de bases de datos PostgreSQL con seguridad por rol y funciones transaccionales para operaciones críticas.',
  },
  {
    slug: 'iot',
    nombre: 'Integración con dispositivos y sistemas',
    nombreCorto: 'Integraciones',
    grupo: 'integracion',
    icon: 'plug',
    resumen: 'Conectamos sistemas, APIs y dispositivos físicos para que el dato llegue solo, sin transcribirlo a mano.',
    problema:
      'Cuando el dato nace en un dispositivo, en otro sistema o en una plataforma externa y alguien tiene que copiarlo a mano, se pierde precisión y tiempo. Los sistemas que no se hablan obligan a tu equipo a ser el puente.',
    enfoque:
      'Integramos por API, por archivo o por puerto serial según lo que haga falta, con lectura en segundo plano que no bloquea la operación y validaciones antes de aceptar un dato, para que un error de origen no se propague como si fuera válido.',
    ejemplos: ['APIs y webhooks', 'Lectores, sensores e impresoras', 'Sincronización entre sistemas', 'Importación automática de archivos', 'Etiquetado y códigos de barras'],
    incluye: [
      'Análisis de los sistemas y dispositivos a conectar',
      'Desarrollo de conectores y APIs',
      'Validación y manejo de errores en origen',
      'Funcionamiento sin conexión cuando aplica',
      'Monitoreo de la integración',
    ],
    tecnologias: ['FastAPI', 'Node.js', 'PySerial', 'REST', 'Webhooks', 'ZPL'],
    casos: ['frigorinoquia', 'tracing-colombina'],
    seoTitle: 'Integración de sistemas, APIs y dispositivos | Transformia',
    seoDescription:
      'Conectamos tus sistemas, APIs y dispositivos físicos para que la información fluya sola, con validación en origen y funcionamiento sin conexión.',
  },
  {
    slug: 'arquitectura',
    nombre: 'Arquitectura de software',
    nombreCorto: 'Arquitectura',
    grupo: 'estrategia',
    icon: 'blueprint',
    resumen: 'Decisiones técnicas tomadas a tiempo: módulos, datos, integraciones, multi-empresa y operación sin conexión.',
    problema:
      'Un sistema diseñado sobre la marcha acumula deuda técnica que se paga varias veces. Hay decisiones, como atender varias empresas en la misma plataforma o funcionar sin internet, que cuestan muy poco al inicio y una fortuna si se agregan después.',
    enfoque:
      'Levantamos requerimientos, modelamos casos de uso y definimos módulos, datos e integraciones antes de construir. Aplica tanto a proyectos nuevos como a sistemas existentes que necesitan orden antes de seguir creciendo.',
    ejemplos: ['Diseño de módulos', 'Multi-empresa (multi-tenant)', 'Operación sin conexión', 'Diagramas técnicos', 'Auditoría de sistemas existentes'],
    incluye: [
      'Casos de uso y requerimientos priorizados',
      'Arquitectura de módulos e integraciones',
      'Decisiones de multi-empresa y operación sin conexión',
      'Diagramas técnicos y documentación',
      'Hoja de ruta por fases con estimación',
    ],
    tecnologias: ['UML', 'C4', 'PostgreSQL', 'Supabase', 'Cloudflare'],
    casos: ['tracing-b4', 'frigorinoquia'],
    seoTitle: 'Arquitectura de software | Transformia',
    seoDescription:
      'Diseño técnico, casos de uso y decisiones de arquitectura (multi-empresa, sin conexión) antes de escribir código de producción.',
  },
  {
    slug: 'asesoria',
    nombre: 'Asesoría en optimización de procesos',
    nombreCorto: 'Asesoría',
    grupo: 'estrategia',
    icon: 'compass',
    resumen: 'Encontramos dónde se pierde tiempo o plata en tu operación y proponemos la intervención mínima que lo resuelve.',
    problema:
      'No todo problema operativo necesita un sistema nuevo. A veces la respuesta es reordenar un flujo; a veces sí es construir software. Decidirlo sin un diagnóstico serio suele salir caro.',
    enfoque:
      'Auditamos el proceso real, identificamos los cuellos de botella y proponemos una intervención con retorno medible. Si hace falta software, sales con un alcance claro, por fases y con lo que no incluye por escrito.',
    ejemplos: ['Diagnóstico de procesos', 'Priorización por retorno', 'Selección de herramientas', 'Acompañamiento en implementación'],
    incluye: [
      'Entrevistas y observación del proceso',
      'Mapa de cuellos de botella y costos',
      'Recomendación priorizada por retorno',
      'Alcance por fases si hay desarrollo',
    ],
    tecnologias: ['BPMN', 'Looker Studio', 'Google Workspace'],
    casos: ['tracing-colombina'],
    seoTitle: 'Asesoría en optimización de procesos | Transformia',
    seoDescription:
      'Diagnóstico de procesos para encontrar dónde se pierde tiempo o dinero y proponer la intervención mínima con retorno medible.',
  },
];

export const serviciosPorGrupo = (id: GrupoId) => servicios.filter((s) => s.grupo === id);

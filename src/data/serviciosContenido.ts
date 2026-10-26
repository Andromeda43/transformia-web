// src/data/serviciosContenido.ts
// Contenido explicativo de cada página de servicio, escrito para un público general:
// qué es, para qué sirve, ejemplos por tipo de negocio, cómo trabajamos y preguntas frecuentes.
// Los valores de las "pantallas" de ejemplo son ilustrativos.
import type { IconName } from '../components/ui/Icon.astro';

export interface Beneficio {
  icon: IconName;
  titulo: string;
  texto: string;
}

export interface ItemPantalla {
  label: string;
  valor: string;
  tono?: 'ok' | 'run' | 'warn';
}

export interface Escenario {
  negocio: string;
  icon: IconName;
  hoy: string;
  solucion: string;
  resultado: string;
  pantalla: { titulo: string; items: ItemPantalla[] };
}

export interface Paso {
  titulo: string;
  texto: string;
}

export interface Pregunta {
  q: string;
  a: string;
}

export interface ContenidoServicio {
  queEs: { pregunta: string; titulo: string; texto: string; analogia: string };
  beneficios: Beneficio[];
  escenarios: Escenario[];
  pasos: Paso[];
  faq: Pregunta[];
}

export const contenidoServicios: Record<string, ContenidoServicio> = {
  'sitios-web': {
    queEs: {
      pregunta: '¿Qué es una página web?',
      titulo: 'Tu negocio, abierto las 24 horas en internet.',
      texto:
        'Una página web es el lugar en internet donde vive tu negocio: qué haces, por qué elegirte y cómo contactarte. A diferencia de una red social, es tuya: tú decides qué se muestra, nadie te cambia las reglas y Google la encuentra cuando alguien busca lo que vendes.',
      analogia: 'Es tu vitrina y tu mejor vendedor al mismo tiempo: trabaja de noche, en festivos y atiende a cien personas a la vez.',
    },
    beneficios: [
      { icon: 'search', titulo: 'Que te encuentren', texto: 'Aparecer cuando alguien busca en Google lo que ofreces en tu ciudad.' },
      { icon: 'shield', titulo: 'Generar confianza', texto: 'Un sitio profesional es lo primero que revisa un cliente antes de comprarte.' },
      { icon: 'whatsapp', titulo: 'Convertir visitas en clientes', texto: 'Botones directos a WhatsApp, formularios y cotizaciones sin fricción.' },
      { icon: 'clock', titulo: 'Atender a cualquier hora', texto: 'Horarios, precios, catálogo y preguntas frecuentes disponibles siempre.' },
    ],
    escenarios: [
      {
        negocio: 'Restaurante',
        icon: 'store',
        hoy: 'Los clientes preguntan el menú y los horarios por mensaje, uno por uno.',
        solucion: 'Un sitio con menú actualizable, ubicación, horarios y reservas por WhatsApp.',
        resultado: 'Menos preguntas repetidas y más mesas reservadas.',
        pantalla: {
          titulo: 'La Casona · cocina llanera',
          items: [
            { label: 'Menú del día', valor: 'Actualizado hoy', tono: 'ok' },
            { label: 'Reservar mesa', valor: 'Por WhatsApp', tono: 'run' },
            { label: 'Cómo llegar', valor: 'Ver mapa' },
          ],
        },
      },
      {
        negocio: 'Clínica o consultorio',
        icon: 'heart',
        hoy: 'Las citas se agendan por teléfono y nadie encuentra los servicios en internet.',
        solucion: 'Un sitio con especialidades, profesionales y agendamiento en línea.',
        resultado: 'Pacientes que llegan sabiendo qué servicio necesitan.',
        pantalla: {
          titulo: 'Clínica Santa Ana',
          items: [
            { label: 'Especialidades', valor: '12 servicios' },
            { label: 'Agenda tu cita', valor: 'En línea', tono: 'run' },
            { label: 'Preguntas frecuentes', valor: 'Resueltas', tono: 'ok' },
          ],
        },
      },
      {
        negocio: 'Constructora',
        icon: 'building',
        hoy: 'Los proyectos se muestran en PDFs que circulan por WhatsApp.',
        solucion: 'Una ficha por proyecto con fotos, planos, avance de obra y botón para agendar visita.',
        resultado: 'Prospectos que llegan con el proyecto ya elegido.',
        pantalla: {
          titulo: 'Torres del Llano',
          items: [
            { label: 'Apartamentos', valor: 'Desde 58 m²' },
            { label: 'Avance de obra', valor: '72 %', tono: 'run' },
            { label: 'Agenda tu visita', valor: 'WhatsApp', tono: 'ok' },
          ],
        },
      },
      {
        negocio: 'Empresa de servicios',
        icon: 'truck',
        hoy: 'Tu empresa existe, pero en internet parece más pequeña de lo que es.',
        solucion: 'Un sitio corporativo con servicios, casos de éxito y formulario de cotización.',
        resultado: 'Una imagen a la altura de los clientes grandes que quieres conseguir.',
        pantalla: {
          titulo: 'Andina Logística',
          items: [
            { label: 'Servicios', valor: '6 líneas' },
            { label: 'Casos de éxito', valor: 'Ver proyectos' },
            { label: 'Cotiza', valor: 'En 2 minutos', tono: 'ok' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Entendemos tu negocio', texto: 'Quién es tu cliente, qué busca y qué debe hacer al entrar a tu sitio.' },
      { titulo: 'Estructura y textos', texto: 'Organizamos las secciones y escribimos para que se entienda en segundos.' },
      { titulo: 'Diseño y animación', texto: 'Una identidad visual propia, rápida y que se ve perfecta en el celular.' },
      { titulo: 'Publicación y Google', texto: 'Dominio, publicación, registro en Google y capacitación para actualizarlo.' },
    ],
    faq: [
      { q: '¿Cuánto tarda tener mi sitio listo?', a: 'Depende del número de páginas y de si ya tienes textos y fotos. En la propuesta te damos un cronograma por fases con fechas concretas.' },
      { q: '¿Puedo actualizar el contenido yo mismo?', a: 'Sí. Si necesitas cambiar textos, precios o publicar noticias con frecuencia, dejamos un panel sencillo para hacerlo sin tocar código y te capacitamos.' },
      { q: '¿Me ayudan con el dominio y el hosting?', a: 'Sí. Te asesoramos para registrar el dominio a nombre de tu empresa y dejamos el sitio publicado en un hosting rápido y seguro.' },
      { q: '¿Mi sitio va a aparecer en Google?', a: 'Lo dejamos técnicamente listo: velocidad, estructura, metadatos y registro en Google Search Console. Llegar a los primeros resultados también depende del contenido y del tiempo, y te explicamos cómo mejorar.' },
      { q: 'Ya tengo una página, ¿hay que hacerla de nuevo?', a: 'No siempre. La revisamos y te decimos con argumentos si conviene mejorarla o rehacerla antes de cotizar.' },
    ],
  },

  desarrollo: {
    queEs: {
      pregunta: '¿Qué es el software a la medida?',
      titulo: 'Un sistema hecho para cómo trabaja tu empresa.',
      texto:
        'El software a la medida es una aplicación que se construye para tu operación: tus procesos, tus roles y tus reglas. En lugar de adaptar tu empresa a un programa genérico, el programa se adapta a ti y crece contigo.',
      analogia: 'Es la diferencia entre un traje de almacén y uno hecho a la medida: los dos visten, pero solo uno te queda perfecto.',
    },
    beneficios: [
      { icon: 'layers', titulo: 'Todo en un solo lugar', texto: 'Clientes, pedidos, inventario y reportes conectados, sin archivos sueltos.' },
      { icon: 'users', titulo: 'Cada quien lo suyo', texto: 'Roles y permisos para que cada persona vea y haga lo que le corresponde.' },
      { icon: 'smartphone', titulo: 'En el computador o el celular', texto: 'Plataforma web y app móvil, incluso para trabajar sin señal.' },
      { icon: 'rocket', titulo: 'Crece por fases', texto: 'Empiezas con lo esencial y agregas módulos cuando los necesitas.' },
    ],
    escenarios: [
      {
        negocio: 'Distribuidora',
        icon: 'truck',
        hoy: 'Pedidos por WhatsApp, inventario en Excel y facturas en otro programa.',
        solucion: 'Una plataforma donde el vendedor toma el pedido, bodega lo despacha y gerencia lo ve en tiempo real.',
        resultado: 'Un solo dato, visto por todos, sin volver a digitar.',
        pantalla: {
          titulo: 'Pedidos · hoy',
          items: [
            { label: 'Pedido #1043', valor: 'Despachado', tono: 'ok' },
            { label: 'Stock en bodega', valor: '1.204 u' },
            { label: 'Ruta norte', valor: 'En camino', tono: 'run' },
          ],
        },
      },
      {
        negocio: 'Servicio técnico',
        icon: 'wrench',
        hoy: 'Órdenes en papel y técnicos que llaman para preguntar a dónde ir.',
        solucion: 'Una app para técnicos con órdenes asignadas, fotos, firma del cliente y cierre en sitio.',
        resultado: 'Cada visita queda registrada con su evidencia.',
        pantalla: {
          titulo: 'Orden OS-2042',
          items: [
            { label: 'Cliente', valor: 'Agro del Llano' },
            { label: 'Evidencia', valor: '3 fotos', tono: 'run' },
            { label: 'Firma del cliente', valor: 'Recibida', tono: 'ok' },
          ],
        },
      },
      {
        negocio: 'Asociación o gremio',
        icon: 'users',
        hoy: 'Afiliados, pagos y certificados en hojas de cálculo distintas.',
        solucion: 'Un portal de afiliados con estado de cuenta, pagos y certificados descargables.',
        resultado: 'Afiliados que se atienden solos, a cualquier hora.',
        pantalla: {
          titulo: 'Portal de afiliados',
          items: [
            { label: 'Estado de cuenta', valor: 'Al día', tono: 'ok' },
            { label: 'Certificado', valor: 'Descargar' },
            { label: 'Próximo evento', valor: '12 nov', tono: 'run' },
          ],
        },
      },
      {
        negocio: 'Emprendimiento digital',
        icon: 'rocket',
        hoy: 'Una idea de negocio que conecta a dos tipos de usuarios.',
        solucion: 'Una app con registro, publicaciones, chat y membresías, como hicimos con FeriaApp.',
        resultado: 'Un producto real, listo para salir al mercado y crecer.',
        pantalla: {
          titulo: 'Tu marketplace',
          items: [
            { label: 'Publicaciones', valor: '248 activas', tono: 'ok' },
            { label: 'Mensajes', valor: '12 nuevos', tono: 'run' },
            { label: 'Membresías', valor: 'Renovación' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Levantamos tus procesos', texto: 'Cómo trabaja hoy cada área, qué se repite y qué se pierde.' },
      { titulo: 'Diseñamos datos y pantallas', texto: 'Modelo de datos, roles y un prototipo navegable que validas con tu equipo.' },
      { titulo: 'Construimos por módulos', texto: 'Fases con precio fijo y entregables que puedes usar desde el primer hito.' },
      { titulo: 'Migramos y acompañamos', texto: 'Cargamos tus datos, capacitamos a cada rol y acompañamos la puesta en marcha.' },
    ],
    faq: [
      { q: '¿Por qué no usar un programa que ya existe?', a: 'Si un programa del mercado resuelve tu proceso, te lo recomendamos. El software a la medida conviene cuando tu operación tiene reglas propias, cuando pagas por módulos que no usas o cuando terminas llenando Excel por fuera del sistema.' },
      { q: '¿Cuánto cuesta?', a: 'Depende del alcance. Trabajamos por fases con precio fijo: primero un diagnóstico y luego una propuesta con lo que incluye cada fase y lo que no.' },
      { q: '¿Qué pasa con la información que tengo en Excel?', a: 'La migramos: limpiamos y cargamos tu información histórica para que arranques con todo adentro.' },
      { q: '¿Funciona en el celular?', a: 'Sí. Diseñamos para web y, cuando hace falta, una app para iOS y Android que funciona incluso sin señal.' },
      { q: '¿Qué pasa después de la entrega?', a: 'Capacitamos a cada rol, entregamos manuales de usuario y acompañamos las primeras semanas de operación.' },
    ],
  },

  ia: {
    queEs: {
      pregunta: '¿Qué es la IA aplicada?',
      titulo: 'Que el computador haga el trabajo repetitivo que hoy hace una persona.',
      texto:
        'La inteligencia artificial aplicada usa modelos que entienden texto, imágenes y documentos para hacer tareas que antes exigían que alguien leyera y decidiera: revisar un comprobante, clasificar una solicitud, sacar los datos de una factura o responder una pregunta frecuente.',
      analogia: 'Es como sumar a tu equipo un asistente que no se cansa, lee en segundos y te consulta cuando tiene dudas.',
    },
    beneficios: [
      { icon: 'file', titulo: 'Lee documentos por ti', texto: 'Facturas, comprobantes y formularios convertidos en datos en segundos.' },
      { icon: 'whatsapp', titulo: 'Responde a cualquier hora', texto: 'Un asistente con la información de tu empresa en WhatsApp o en tu web.' },
      { icon: 'alert', titulo: 'Detecta lo raro', texto: 'Comprobantes falsos, datos que no cuadran o casos urgentes, al instante.' },
      { icon: 'users', titulo: 'Siempre con supervisión', texto: 'Los casos dudosos pasan a una persona; la IA no decide sola lo importante.' },
    ],
    escenarios: [
      {
        negocio: 'Comercio',
        icon: 'store',
        hoy: 'Alguien revisa cada comprobante de transferencia a ojo y a veces se cuela uno falso.',
        solucion: 'Un asistente en WhatsApp que valida el comprobante contra la notificación del banco.',
        resultado: 'Pagos confirmados en segundos y menos fraude.',
        pantalla: {
          titulo: 'Validación de pagos',
          items: [
            { label: 'Comprobante #882', valor: 'Validado', tono: 'ok' },
            { label: 'Banco', valor: 'Nequi' },
            { label: 'En revisión humana', valor: '1 caso', tono: 'warn' },
          ],
        },
      },
      {
        negocio: 'Área contable',
        icon: 'file',
        hoy: 'Facturas en PDF que se digitan una por una.',
        solucion: 'IA que extrae proveedor, valor e impuestos y los carga al sistema para revisión.',
        resultado: 'Horas de digitación convertidas en minutos de revisión.',
        pantalla: {
          titulo: 'Facturas recibidas',
          items: [
            { label: 'Proveedor', valor: 'Insumos del Meta' },
            { label: 'Total', valor: '$ 4.280.000' },
            { label: 'IVA', valor: 'Extraído', tono: 'ok' },
          ],
        },
      },
      {
        negocio: 'Atención al cliente',
        icon: 'whatsapp',
        hoy: 'Las mismas diez preguntas, todos los días, por todos los canales.',
        solucion: 'Un asistente que responde con la información de tu empresa y pasa a una persona lo complejo.',
        resultado: 'Tu equipo atiende solo lo que de verdad lo necesita.',
        pantalla: {
          titulo: 'Asistente virtual',
          items: [
            { label: 'Horario y precios', valor: 'Respondido', tono: 'ok' },
            { label: 'Pedido especial', valor: 'Pasa a asesor', tono: 'warn' },
            { label: 'Disponible', valor: '24/7', tono: 'run' },
          ],
        },
      },
      {
        negocio: 'Operación en campo',
        icon: 'factory',
        hoy: 'Reportes de campo en texto libre que nadie alcanza a leer.',
        solucion: 'IA que clasifica cada reporte por tipo y urgencia y alerta lo crítico.',
        resultado: 'Lo importante llega primero a quien debe actuar.',
        pantalla: {
          titulo: 'Reportes de campo',
          items: [
            { label: 'Urgentes', valor: '3', tono: 'warn' },
            { label: 'Mantenimiento', valor: '12', tono: 'run' },
            { label: 'Informativos', valor: '28' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Elegimos la tarea', texto: 'Una tarea concreta, repetitiva y con un retorno que se pueda medir.' },
      { titulo: 'Probamos con tus datos', texto: 'Una prueba corta con casos reales para saber cuánto acierta antes de construir todo.' },
      { titulo: 'Lo integramos a tus canales', texto: 'WhatsApp, correo o tu sistema, con aprobación humana donde importa.' },
      { titulo: 'Medimos y ajustamos', texto: 'Seguimos aciertos y casos dudosos para mejorar con el uso.' },
    ],
    faq: [
      { q: '¿La IA va a reemplazar a mi equipo?', a: 'No es la idea. La usamos para quitarle a tu equipo el trabajo repetitivo, y siempre dejamos a una persona aprobando los casos dudosos o importantes.' },
      { q: '¿Qué pasa si la IA se equivoca?', a: 'Lo diseñamos para eso: cuando la confianza es baja, el caso pasa a revisión humana. Además medimos los aciertos para mejorar.' },
      { q: '¿Mis datos quedan seguros?', a: 'Trabajamos con proveedores de IA empresariales que, por contrato, no usan tu información para entrenar sus modelos, y aplicamos permisos por rol en todo el sistema.' },
      { q: '¿Necesito tener muchos datos?', a: 'No siempre. Muchas tareas funcionan con modelos ya entrenados y algunos ejemplos de tu operación. Lo validamos en una prueba antes de construir todo.' },
      { q: '¿Funciona en WhatsApp?', a: 'Sí. Podemos conectar el asistente a WhatsApp, al correo o a tu sistema interno.' },
    ],
  },

  transformacion: {
    queEs: {
      pregunta: '¿Qué es automatizar un proceso?',
      titulo: 'Procesos que avanzan solos, sin perseguir a nadie.',
      texto:
        'Automatizar es lograr que las tareas que se repiten todos los días —pasar datos de un lado a otro, pedir aprobaciones, enviar recordatorios, armar reportes— ocurran solas, en el orden correcto y dejando registro de cada paso.',
      analogia: 'Como una fila de fichas de dominó bien armada: empujas la primera y todo lo demás pasa en orden.',
    },
    beneficios: [
      { icon: 'zap', titulo: 'Menos tareas manuales', texto: 'Lo repetitivo pasa solo y tu equipo se dedica a lo que importa.' },
      { icon: 'route', titulo: 'Nada se queda en un chat', texto: 'Cada solicitud tiene dueño, estado y fecha, de principio a fin.' },
      { icon: 'bell', titulo: 'Avisos automáticos', texto: 'Recordatorios y notificaciones por WhatsApp o correo en el momento justo.' },
      { icon: 'trending', titulo: 'Reportes que se arman solos', texto: 'Tableros actualizados sin consolidar hojas de cálculo a mano.' },
    ],
    escenarios: [
      {
        negocio: 'Compras',
        icon: 'cart',
        hoy: 'Las solicitudes de compra se aprueban por WhatsApp y se pierden.',
        solucion: 'Un flujo: solicitud → aprobación del jefe → aviso a compras, con historial.',
        resultado: 'Cada solicitud tiene dueño, estado y fecha.',
        pantalla: {
          titulo: 'Solicitud #318',
          items: [
            { label: 'Solicitado por', valor: 'Bodega' },
            { label: 'Aprobación', valor: 'Gerencia', tono: 'ok' },
            { label: 'Notificado a', valor: 'Compras', tono: 'run' },
          ],
        },
      },
      {
        negocio: 'Recursos humanos',
        icon: 'users',
        hoy: 'Novedades de nómina en correos y hojas sueltas.',
        solucion: 'Un formulario de novedades que alimenta un reporte consolidado y un tablero.',
        resultado: 'La nómina se cierra con la información completa y a tiempo.',
        pantalla: {
          titulo: 'Novedades del mes',
          items: [
            { label: 'Horas extra', valor: '46 registros' },
            { label: 'Incapacidades', valor: '3', tono: 'warn' },
            { label: 'Reporte', valor: 'Generado', tono: 'ok' },
          ],
        },
      },
      {
        negocio: 'Ventas y renovaciones',
        icon: 'bell',
        hoy: 'Clientes que olvidan renovar y nadie les avisa a tiempo.',
        solucion: 'Recordatorios automáticos por WhatsApp antes de cada vencimiento.',
        resultado: 'Más renovaciones sin llamar uno por uno.',
        pantalla: {
          titulo: 'Renovaciones',
          items: [
            { label: 'Vencen esta semana', valor: '14', tono: 'warn' },
            { label: 'Recordatorios', valor: 'Enviados', tono: 'ok' },
            { label: 'Renovados', valor: '9', tono: 'run' },
          ],
        },
      },
      {
        negocio: 'Producción',
        icon: 'factory',
        hoy: 'La orden de producción llega en Excel por correo cada semana.',
        solucion: 'La orden se carga sola a la base de datos y la planta la ve lista para ejecutar.',
        resultado: 'Planeación y planta trabajando con el mismo dato.',
        pantalla: {
          titulo: 'Orden semanal',
          items: [
            { label: 'Fórmulas', valor: '24' },
            { label: 'Carga', valor: 'Automática', tono: 'ok' },
            { label: 'Planta', valor: 'Lista', tono: 'run' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Mapeamos el proceso', texto: 'Quién hace qué, con qué herramienta y dónde se atasca.' },
      { titulo: 'Lo corregimos', texto: 'Antes de automatizar quitamos los pasos que sobran.' },
      { titulo: 'Lo automatizamos', texto: 'Flujos, avisos y reportes sobre las herramientas que ya usas o una nueva.' },
      { titulo: 'Medimos el ahorro', texto: 'Tiempo, errores y tareas eliminadas, para decidir qué sigue.' },
    ],
    faq: [
      { q: '¿Qué procesos se pueden automatizar?', a: 'Casi cualquier tarea repetitiva con reglas claras: aprobaciones, recordatorios, reportes, traspaso de datos entre sistemas y notificaciones.' },
      { q: '¿Tengo que cambiar las herramientas que uso?', a: 'No necesariamente. Muchas veces automatizamos sobre lo que ya tienes: Google Workspace, Excel, WhatsApp o tu sistema actual.' },
      { q: '¿Y si mi proceso está mal hecho?', a: 'Primero lo corregimos. Automatizar un proceso roto solo hace que falle más rápido.' },
      { q: '¿Cuándo veo resultados?', a: 'Te proponemos empezar por la automatización que más tiempo ahorra, para que el resultado se note desde la primera fase.' },
    ],
  },

  database: {
    queEs: {
      pregunta: '¿Qué es una base de datos?',
      titulo: 'El lugar donde vive la información de tu empresa, ordenada y segura.',
      texto:
        'Una base de datos guarda la información de tu negocio —clientes, ventas, inventario, movimientos— de forma ordenada, para que varias personas y sistemas la usen al mismo tiempo sin dañarla, duplicarla ni perderla.',
      analogia: 'Si Excel es una libreta, una base de datos es un archivo con bibliotecario: cada cosa en su lugar, con llave y con registro de quién la tocó.',
    },
    beneficios: [
      { icon: 'database', titulo: 'Una sola versión de la verdad', texto: 'Se acabaron los diez archivos con el mismo dato y ninguno igual.' },
      { icon: 'shield', titulo: 'Seguridad por rol', texto: 'La base de datos misma bloquea lo que cada persona no debe ver.' },
      { icon: 'zap', titulo: 'Rápida aunque crezca', texto: 'Diseñada para tu volumen de hoy y el de los próximos años.' },
      { icon: 'clock', titulo: 'Respaldos y auditoría', texto: 'Copias automáticas y registro de cada cambio importante.' },
    ],
    escenarios: [
      {
        negocio: 'Empresa en Excel',
        icon: 'file',
        hoy: 'Diez archivos con la misma información y ninguno coincide.',
        solucion: 'Migramos todo a una base de datos limpia, sin duplicados y con relaciones claras.',
        resultado: 'Una sola fuente de verdad para toda la empresa.',
        pantalla: {
          titulo: 'Clientes',
          items: [
            { label: 'Registros únicos', valor: '3.412', tono: 'ok' },
            { label: 'Duplicados unidos', valor: '418', tono: 'run' },
            { label: 'Último cambio', valor: 'Hace 2 min' },
          ],
        },
      },
      {
        negocio: 'Sistema lento',
        icon: 'clock',
        hoy: 'Reportes que tardan minutos y pantallas que se congelan.',
        solucion: 'Rediseñamos el modelo de datos y optimizamos las consultas más usadas.',
        resultado: 'Respuestas en segundos, aunque los datos sigan creciendo.',
        pantalla: {
          titulo: 'Reporte de ventas',
          items: [
            { label: 'Consulta', valor: 'Ventas por mes' },
            { label: 'Índices', valor: 'Optimizados', tono: 'ok' },
            { label: 'Respuesta', valor: 'En segundos', tono: 'run' },
          ],
        },
      },
      {
        negocio: 'Varias sedes',
        icon: 'building',
        hoy: 'Cada sede puede ver la información de todas las demás.',
        solucion: 'Seguridad a nivel de fila: cada sede y cada rol ven solo lo suyo.',
        resultado: 'Datos compartidos sin exponer nada.',
        pantalla: {
          titulo: 'Acceso por sede',
          items: [
            { label: 'Sede Yopal', valor: 'Solo sus datos', tono: 'run' },
            { label: 'Gerencia', valor: 'Todas las sedes' },
            { label: 'Auditoría', valor: 'Activa', tono: 'ok' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Inventario de tu información', texto: 'Qué datos existen, dónde están y quién los usa.' },
      { titulo: 'Modelo de datos', texto: 'Tablas, relaciones y reglas pensadas para tu operación.' },
      { titulo: 'Migración y limpieza', texto: 'Cargamos lo histórico, unimos duplicados y validamos que todo cuadre.' },
      { titulo: 'Seguridad y respaldos', texto: 'Permisos por rol, copias automáticas y monitoreo.' },
    ],
    faq: [
      { q: '¿Por qué no seguir con Excel?', a: 'Excel es excelente para analizar, pero no para que varias personas trabajen sobre los mismos datos al tiempo, con permisos y sin errores.' },
      { q: '¿Pierdo información al migrar?', a: 'No. Migramos, validamos que todo cuadre y conservamos tus archivos originales.' },
      { q: '¿Dónde quedan guardados mis datos?', a: 'En servidores en la nube con respaldos automáticos. Acordamos contigo la ubicación y quién tiene acceso.' },
      { q: '¿Quién puede ver qué?', a: 'Definimos roles y la base de datos misma bloquea lo que cada uno no debe ver, no solo la pantalla.' },
    ],
  },

  iot: {
    queEs: {
      pregunta: '¿Qué es integrar sistemas?',
      titulo: 'Que tus sistemas y tus equipos se hablen solos.',
      texto:
        'Integrar es conectar programas, plataformas y dispositivos para que la información pase de uno a otro sin que nadie la copie. Una báscula que manda el peso al sistema, una tienda en línea que descuenta el inventario, un sensor que avisa si algo se sale de rango.',
      analogia: 'Es poner a todos tus sistemas a hablar el mismo idioma, con un traductor que nunca descansa.',
    },
    beneficios: [
      { icon: 'sync', titulo: 'Cero digitación doble', texto: 'El dato se captura una vez, en la fuente, y llega a todos lados.' },
      { icon: 'zap', titulo: 'Información en tiempo real', texto: 'Lo que pasa en planta, bodega o tienda se ve al instante.' },
      { icon: 'check', titulo: 'Menos errores', texto: 'Validaciones automáticas antes de aceptar un dato.' },
      { icon: 'plug', titulo: 'Aprovecha lo que ya tienes', texto: 'Conectamos tus equipos y sistemas actuales en lugar de reemplazarlos.' },
    ],
    escenarios: [
      {
        negocio: 'Planta o bodega',
        icon: 'factory',
        hoy: 'El peso se lee en la báscula y se anota en una planilla.',
        solucion: 'La báscula envía el peso al sistema y la etiqueta se imprime sola.',
        resultado: 'Pesos exactos y trazables, sin transcribir.',
        pantalla: {
          titulo: 'Estación de pesaje',
          items: [
            { label: 'Báscula', valor: '248,6 kg', tono: 'run' },
            { label: 'Etiqueta', valor: 'Impresa', tono: 'ok' },
            { label: 'Lote', valor: 'A-2041' },
          ],
        },
      },
      {
        negocio: 'Tienda en línea',
        icon: 'cart',
        hoy: 'Las ventas de la web se pasan a mano al inventario.',
        solucion: 'Conectamos la tienda, el inventario y la facturación por API.',
        resultado: 'Stock real en todos los canales.',
        pantalla: {
          titulo: 'Inventario',
          items: [
            { label: 'Venta web', valor: '#5521', tono: 'run' },
            { label: 'Stock', valor: 'Actualizado', tono: 'ok' },
            { label: 'Factura', valor: 'Emitida' },
          ],
        },
      },
      {
        negocio: 'Cadena de frío',
        icon: 'thermometer',
        hoy: 'Alguien revisa la temperatura del cuarto frío cada tantas horas.',
        solucion: 'Sensores que reportan solos y alertan si algo se sale de rango.',
        resultado: 'Problemas detectados antes de que cuesten producto.',
        pantalla: {
          titulo: 'Cuarto frío 2',
          items: [
            { label: 'Temperatura', valor: '2,4 °C', tono: 'run' },
            { label: 'Rango', valor: 'Normal', tono: 'ok' },
            { label: 'Alertas hoy', valor: '0' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Inventario de sistemas y equipos', texto: 'Qué tienes, cómo se comunica y qué dato debe viajar.' },
      { titulo: 'Diseño de la integración', texto: 'Qué se conecta con qué, cuándo y con qué validaciones.' },
      { titulo: 'Conectores y pruebas', texto: 'Construimos los conectores y probamos con datos y equipos reales.' },
      { titulo: 'Monitoreo', texto: 'Alertas si una conexión falla y operación sin internet cuando aplica.' },
    ],
    faq: [
      { q: '¿Se puede conectar un equipo que ya tengo?', a: 'En muchos casos sí: básculas, lectores e impresoras industriales suelen tener puerto serial o de red. Lo revisamos en sitio.' },
      { q: '¿Qué pasa si se cae internet?', a: 'Diseñamos para que la estación siga funcionando y sincronice cuando vuelva la conexión.' },
      { q: '¿Tengo que cambiar mi software actual?', a: 'No. La idea es conectar lo que ya usas, no reemplazarlo.' },
      { q: '¿Qué es una API?', a: 'Es la puerta que un sistema abre para que otro le pida o le envíe información de forma segura. Casi todas las plataformas modernas tienen una.' },
    ],
  },

  arquitectura: {
    queEs: {
      pregunta: '¿Qué es la arquitectura de software?',
      titulo: 'Los planos de tu sistema, antes de construirlo.',
      texto:
        'La arquitectura de software define cómo se organiza un sistema por dentro: qué módulos tendrá, cómo se guarda la información, cómo se conecta con otros sistemas y cómo va a crecer. Se decide antes de programar, igual que un edificio se diseña antes del primer ladrillo.',
      analogia: 'Nadie construye una casa sin planos. Con el software pasa igual: corregir un plano cuesta poco; tumbar una pared, mucho.',
    },
    beneficios: [
      { icon: 'shield', titulo: 'Menos sorpresas', texto: 'Los riesgos y costos se ven en el papel, no en producción.' },
      { icon: 'trending', titulo: 'Listo para crecer', texto: 'Más usuarios, más sedes o más empresas sin rehacer el sistema.' },
      { icon: 'clock', titulo: 'Decisiones a tiempo', texto: 'Multi-empresa y sin conexión se deciden cuando cuestan poco.' },
      { icon: 'file', titulo: 'Todo documentado', texto: 'Diagramas y decisiones que cualquier equipo técnico puede seguir.' },
    ],
    escenarios: [
      {
        negocio: 'Proyecto nuevo',
        icon: 'rocket',
        hoy: 'Tienes una idea clara, pero no sabes por dónde empezar ni cuánto costará.',
        solucion: 'Casos de uso, módulos, modelo de datos y una hoja de ruta por fases.',
        resultado: 'Un plan que se puede construir y presupuestar con confianza.',
        pantalla: {
          titulo: 'Hoja de ruta',
          items: [
            { label: 'Fase 1', valor: 'Núcleo', tono: 'ok' },
            { label: 'Fase 2', valor: 'App móvil', tono: 'run' },
            { label: 'Fase 3', valor: 'Reportes' },
          ],
        },
      },
      {
        negocio: 'Sistema que creció sin orden',
        icon: 'alert',
        hoy: 'Cada cambio rompe otra cosa y nadie se atreve a tocarlo.',
        solucion: 'Auditoría de lo existente y un plan para ordenarlo sin detener la operación.',
        resultado: 'Un sistema que se puede seguir mejorando.',
        pantalla: {
          titulo: 'Auditoría técnica',
          items: [
            { label: 'Módulos críticos', valor: '3', tono: 'warn' },
            { label: 'Riesgos', valor: 'Priorizados', tono: 'run' },
            { label: 'Plan', valor: 'Por etapas', tono: 'ok' },
          ],
        },
      },
      {
        negocio: 'Software para varias empresas',
        icon: 'building',
        hoy: 'Quieres ofrecer tu sistema a otras empresas o sedes.',
        solucion: 'Diseño multi-empresa desde el inicio: datos separados y configuración por cliente.',
        resultado: 'Un producto listo para escalar.',
        pantalla: {
          titulo: 'Plataforma',
          items: [
            { label: 'Empresas', valor: '12 activas', tono: 'run' },
            { label: 'Datos', valor: 'Aislados', tono: 'ok' },
            { label: 'Configuración', valor: 'Por cliente' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Requerimientos', texto: 'Qué debe hacer el sistema, para quién y con qué prioridad.' },
      { titulo: 'Casos de uso', texto: 'Cada flujo descrito paso a paso, validado con tu equipo.' },
      { titulo: 'Diseño técnico', texto: 'Módulos, datos, integraciones, seguridad y operación sin conexión.' },
      { titulo: 'Hoja de ruta', texto: 'Fases, estimaciones y lo que no incluye cada una.' },
    ],
    faq: [
      { q: '¿Por qué pagar por diseño si todavía no hay software?', a: 'Porque las decisiones más caras se toman al principio. Un buen diseño evita reconstruir partes enteras después.' },
      { q: '¿Qué es multi-empresa?', a: 'Que una misma plataforma atienda a varias empresas o sedes, cada una con sus datos separados. Es fácil decidirlo al inicio y muy costoso agregarlo después.' },
      { q: '¿Qué es offline-first?', a: 'Que la aplicación funcione sin internet y se sincronice cuando vuelva la señal. Es clave en campo, plantas y zonas rurales.' },
      { q: '¿Sirve si ya tengo un sistema funcionando?', a: 'Sí. Auditamos lo existente y proponemos cómo ordenarlo por etapas, sin detener la operación.' },
    ],
  },

  asesoria: {
    queEs: {
      pregunta: '¿Qué es una asesoría en procesos?',
      titulo: 'Una mirada externa para encontrar dónde se pierde tiempo y plata.',
      texto:
        'La asesoría en procesos es un diagnóstico de cómo funciona hoy tu operación: quién hace qué, con qué herramientas y dónde se atasca. El resultado es una lista priorizada de mejoras, algunas con tecnología y otras sin ella.',
      analogia: 'Es un chequeo médico para tu operación: primero el diagnóstico, después el tratamiento, y solo el que hace falta.',
    },
    beneficios: [
      { icon: 'search', titulo: 'Claridad', texto: 'Ver la operación completa, con datos y no con suposiciones.' },
      { icon: 'trending', titulo: 'Prioridades por retorno', texto: 'Primero lo que más impacto tiene con el menor esfuerzo.' },
      { icon: 'shield', titulo: 'Sin vender de más', texto: 'Si la solución no es software, te lo decimos.' },
      { icon: 'route', titulo: 'Un plan accionable', texto: 'Pasos concretos que puedes ejecutar con nosotros o con quien elijas.' },
    ],
    escenarios: [
      {
        negocio: 'Empresa en crecimiento',
        icon: 'trending',
        hoy: 'Más clientes, más empleados, y todo se siente más lento.',
        solucion: 'Mapeamos los procesos clave y encontramos los cuellos de botella.',
        resultado: 'Saber exactamente qué arreglar primero.',
        pantalla: {
          titulo: 'Mapa de procesos',
          items: [
            { label: 'Procesos revisados', valor: '8' },
            { label: 'Cuellos de botella', valor: '3', tono: 'warn' },
            { label: 'Prioridad alta', valor: '1', tono: 'run' },
          ],
        },
      },
      {
        negocio: 'Antes de comprar software',
        icon: 'cart',
        hoy: 'Varios proveedores te ofrecen cosas distintas y no sabes cuál elegir.',
        solucion: 'Definimos tus requisitos reales y te acompañamos a evaluar las opciones.',
        resultado: 'Una decisión con argumentos, no por intuición.',
        pantalla: {
          titulo: 'Comparativo',
          items: [
            { label: 'Requisitos', valor: '24' },
            { label: 'Opciones evaluadas', valor: '3', tono: 'run' },
            { label: 'Recomendación', valor: 'Lista', tono: 'ok' },
          ],
        },
      },
      {
        negocio: 'Transformación digital',
        icon: 'rocket',
        hoy: 'Sabes que hay que digitalizar, pero no por dónde empezar.',
        solucion: 'Una hoja de ruta por fases, empezando por lo que más retorno da.',
        resultado: 'Avances visibles desde la primera fase.',
        pantalla: {
          titulo: 'Hoja de ruta',
          items: [
            { label: 'Fase 1', valor: 'Inventario', tono: 'ok' },
            { label: 'Fase 2', valor: 'Ventas', tono: 'run' },
            { label: 'Fase 3', valor: 'Reportes' },
          ],
        },
      },
    ],
    pasos: [
      { titulo: 'Entrevistas y observación', texto: 'Hablamos con cada área y vemos el proceso como pasa en realidad.' },
      { titulo: 'Mapa del proceso', texto: 'Documentamos el flujo actual, con tiempos y responsables.' },
      { titulo: 'Diagnóstico priorizado', texto: 'Cuellos de botella ordenados por impacto y esfuerzo.' },
      { titulo: 'Plan de acción', texto: 'Recomendaciones concretas y, si hace falta software, un alcance por fases.' },
    ],
    faq: [
      { q: '¿La asesoría me obliga a contratar desarrollo?', a: 'No. Recibes un diagnóstico y un plan que puedes ejecutar con nosotros, con otro proveedor o con tu propio equipo.' },
      { q: '¿Cuánto dura?', a: 'Depende del tamaño de la operación. Definimos alcance y duración antes de empezar.' },
      { q: '¿Qué recibo al final?', a: 'Un mapa de tus procesos, los cuellos de botella encontrados y una recomendación priorizada por impacto y esfuerzo.' },
      { q: '¿Necesito tener todo documentado?', a: 'No. Parte del trabajo es documentar cómo funciona realmente hoy.' },
    ],
  },
};

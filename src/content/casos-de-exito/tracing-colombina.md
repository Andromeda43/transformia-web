---
cliente: "Colombina Conservas"
industria: "Manufactura de alimentos"
dolor: "Colombina Conservas programaba su producción mediante órdenes de trabajo semanales compartidas como archivos Excel sueltos por correo. No había trazabilidad sistemática de qué ingrediente, lote y peso exacto se usaba en cada bache, los pesos se anotaban a mano sin validar contra la fórmula esperada, y gerencia no tenía visibilidad en tiempo real de cuántos baches iban ni cuál era la eficiencia operativa del turno — esa información solo se conocía después, reconstruida a mano."
solucion: "Tracing 2.0: un flujo de 4 fases que convierte la orden de producción semanal en un ciclo de captura de datos en tiempo real. Planeación formaliza el punto de entrada, un proceso de scraping automatizado extrae y carga esa información a PostgreSQL, los formuladores operan en planta con una app de escritorio que registra cada pesaje/escaneo bache por bache, y un dashboard en tiempo real visualiza esa misma base de datos con filtro cruzado por fecha y elemento."
capacidades:
  - "Ingesta y limpieza automática de la orden de producción en Excel hacia PostgreSQL"
  - "Escaneo de ingredientes por código de barras y pesaje en báscula serial con validación de tolerancia contra la fórmula"
  - "Conversión automática de unidades (G, L, ML, GL) a KG"
  - "Impresión de etiqueta ZPL por ingrediente y bache"
  - "Dashboard en tiempo real: bache actual, fórmulas creadas/faltantes, eficiencia operativa"
  - "Informe final en PDF con el resumen de consumo por material"
stack:
  - "Python"
  - "Tkinter"
  - "pandas"
  - "PostgreSQL"
  - "PySerial"
resultado: "Colombina pasa de una orden de producción en Excel suelta por correo a un ciclo de trazabilidad continuo: se planea, se scrapea automáticamente hacia PostgreSQL, se ejecuta en planta con pesaje y escaneo validados contra la fórmula esperada, y todo se refleja en un dashboard en tiempo real que gerencia puede filtrar sin esperar al cierre del turno."
status: "ejecutado"
featured: true
---

Ciclo de trazabilidad de 4 fases (Tracing 2.0) construido por Transformia para la operación de formulación de Colombina Conservas.

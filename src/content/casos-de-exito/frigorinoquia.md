---
cliente: "Frigorinoquia"
industria: "Planta de beneficio animal y desposte"
dolor: "Frigorinoquia es una planta de beneficio animal (sacrificio) y sala de desposte mixto. Todo el proceso —desde el ingreso del animal hasta la salida del producto— se documentaba en papel y Excel: apertura de lote manual, pesaje sin sistema, sin visibilidad de inventario en cámara fría, despacho propenso a error en guías escritas a mano, reportes gerenciales tardíos, cobranza de maquila calculada manualmente y trazabilidad animal incompleta entre el ingreso, el examen ante/post mortem y el destino final de cada corte."
solucion: "Una suite de seis aplicaciones web independientes, cada una responsable de una estación física de la planta, conectadas a la misma base de datos con trazabilidad de extremo a extremo: desde el animal vivo hasta el corte empacado despachado al cliente. El peso se captura directamente de báscula serial en tiempo real, las etiquetas se generan automáticamente en ZPL, el inventario de cámara fría se actualiza solo con cada pesaje vía funciones transaccionales, y la liquidación de maquila se genera a partir de esos mismos datos operativos."
capacidades:
  - "app_apertura: apertura de lote, fichas técnicas de cortes, consolidados diarios"
  - "app_presa y app_granel: pesaje en báscula serial en tiempo real con impresión automática de etiqueta ZPL"
  - "app_despacho: guías, certificados de rendimiento y calidad, despacho de canales enteras y de cortes empacados"
  - "app_reportes: dashboard de KPIs y exportación a PDF/Excel"
  - "app_cobranza: liquidación automática de maquila y cuentas por cobrar"
  - "Trazabilidad completa por lote: beneficio → desposte → pesaje → despacho → cliente"
stack:
  - "Python"
  - "FastAPI"
  - "Supabase (PostgreSQL)"
  - "PySerial"
  - "ZPL/Zebra"
resultado: "Frigorinoquia pasa de un proceso documentado en papel y Excel a una suite conectada donde cada animal, lote, corte y despacho queda trazado de punta a punta, con el peso capturado directamente de báscula, las etiquetas impresas automáticamente, el inventario descontado en tiempo real, y la cobranza generada a partir de los mismos datos operativos, sin doble digitación."
status: "ejecutado"
featured: true
---

Suite de seis aplicaciones web construidas por Transformia para digitalizar la trazabilidad completa de beneficio y desposte de Frigorinoquia.

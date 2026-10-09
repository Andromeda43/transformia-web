// src/scripts/env.ts — condiciones de entorno compartidas por los scripts de animación.

/** true si el usuario prefiere menos movimiento, o si la URL trae ?sinmovimiento (útil para QA y capturas). */
export const reduceMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  new URLSearchParams(window.location.search).has('sinmovimiento');

/** true en dispositivos con mouse o trackpad (hover real). */
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

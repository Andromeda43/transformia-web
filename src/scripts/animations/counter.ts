// src/scripts/animations/counter.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function animateCounters(selector: string): void {
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targets.forEach((target) => {
    const rawTarget = target.dataset.target ?? '0';
    const targetValue = parseFloat(rawTarget);
    const decimals = rawTarget.includes('.') ? rawTarget.split('.')[1].length : 0;
    const suffix = target.dataset.suffix ?? '';

    if (prefersReducedMotion) {
      target.textContent = `${targetValue.toFixed(decimals)}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    ScrollTrigger.create({
      trigger: target,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          value: targetValue,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            target.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
          },
        });
      },
    });
  });
}

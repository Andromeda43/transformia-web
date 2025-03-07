// Animaciones para efectos retrofuturistas
document.addEventListener('DOMContentLoaded', () => {
    // Efecto para seguir el cursor en determinados elementos
    const glowElements = document.querySelectorAll('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      
      glowElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calcular la distancia al centro del elemento
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        
        // Si el cursor está a una distancia razonable, aplicar el efecto
        if (distance < 300) {
          const intensity = 1 - Math.min(distance / 300, 1);
          element.style.setProperty('--glow-intensity', intensity.toFixed(2));
          
          // Añadir una ligera inclinación 3D
          const tiltX = (centerY - y) / 30;
          const tiltY = (x - centerX) / 30;
          
          element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        } else {
          element.style.setProperty('--glow-intensity', '0');
          element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
      });
    });
    
    // Efecto parallax para fondos de malla
    const gridBackgrounds = document.querySelectorAll('.grid-background');
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      gridBackgrounds.forEach(grid => {
        const speed = grid.dataset.parallaxSpeed || 0.1;
        const rotation = scrollY * 0.02;
        grid.style.transform = `translateY(${scrollY * speed}px) rotateZ(${rotation}deg)`;
      });
    });
    
    // Manejo de animaciones al entrar en el viewport
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Efecto de desplazamiento para líneas de código en terminal
    const terminalContents = document.querySelectorAll('.terminal-content');
    
    terminalContents.forEach(terminal => {
      const lines = terminal.querySelectorAll('.terminal-line');
      let currentLineIndex = 0;
      
      function animateNextLine() {
        if (currentLineIndex < lines.length) {
          lines[currentLineIndex].classList.add('typing');
          
          setTimeout(() => {
            currentLineIndex++;
            if (currentLineIndex < lines.length) {
              animateNextLine();
            }
          }, 3000); // Tiempo de escritura de una línea
        }
      }
      
      if (lines.length > 0) {
        animateNextLine();
      }
    });
    
    // Efecto de "hover" para cards
    const retroCards = document.querySelectorAll('.retro-card');
    
    retroCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
  });
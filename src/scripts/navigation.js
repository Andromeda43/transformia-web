window.addEventListener('load', function() {
    console.log('Script de navegación cargado');
    
    // Seleccionar todos los enlaces internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        // Prevenir comportamiento predeterminado
        e.preventDefault();
        
        // Obtener el ID objetivo
        const targetId = this.getAttribute('href');
        console.log('Click en enlace hacia:', targetId);
        
        if (!targetId || targetId === '#') return;
        
        // Buscar elemento objetivo
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Calcular posición
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          console.log('Scrolling hacia:', offsetPosition);
          
          // Hacer scroll
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Cerrar menú móvil si está abierto
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
          }
        } else {
          console.warn('Elemento no encontrado:', targetId);
        }
      });
    });
  });
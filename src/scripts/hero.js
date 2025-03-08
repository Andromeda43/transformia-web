// Esperamos a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Función para animar la red neuronal
    function animateNeuralNetwork() {
      // Creamos las conexiones de la red neuronal
      const layers = document.querySelectorAll('.layer');
      if (layers.length < 2) return; // Necesitamos al menos dos capas
      
      for (let l = 0; l < layers.length - 1; l++) {
        const currentLayer = layers[l];
        const nextLayer = layers[l + 1];
        const currentNodes = currentLayer.querySelectorAll('.node');
        const nextNodes = nextLayer.querySelectorAll('.node');
        
        // Añadir líneas SVG entre nodos
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "connections-svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.zIndex = "0";
        svg.style.pointerEvents = "none";
        
        // Crear grupo para las conexiones
        const connectionsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        // Conectar cada nodo con todos los nodos de la siguiente capa
        currentNodes.forEach((currentNode, i) => {
          const currentRect = currentNode.getBoundingClientRect();
          const layerRect = currentLayer.getBoundingClientRect();
          
          nextNodes.forEach((nextNode, j) => {
            const nextRect = nextNode.getBoundingClientRect();
            const opacity = Math.random() * 0.4 + 0.1; // Opacidad aleatoria
            const animDuration = Math.random() * 3 + 2; // Duración aleatoria
            const animDelay = Math.random() * 2; // Retraso aleatorio
            
            // Crear línea
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            
            // Calcular posiciones relativas al SVG
            const x1 = currentRect.left - layerRect.left + currentRect.width / 2;
            const y1 = currentRect.top - layerRect.top + currentRect.height / 2;
            const x2 = nextRect.left - layerRect.left + nextRect.width / 2;
            const y2 = nextRect.top - layerRect.top + nextRect.height / 2;
            
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            
            // Estilo de la línea
            line.setAttribute("stroke", l === 0 ? "url(#grad1)" : "url(#grad2)");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("stroke-opacity", opacity.toString());
            
            // Animación de pulso
            const animate = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            animate.setAttribute("attributeName", "stroke-opacity");
            animate.setAttribute("values", `${opacity};${opacity * 2};${opacity}`);
            animate.setAttribute("dur", `${animDuration}s`);
            animate.setAttribute("begin", `${animDelay}s`);
            animate.setAttribute("repeatCount", "indefinite");
            
            line.appendChild(animate);
            connectionsGroup.appendChild(line);
          });
        });
        
        svg.appendChild(connectionsGroup);
        document.querySelector('.neural-layers').appendChild(svg);
      }
      
      // Animar los nodos con colores aleatorios
      const nodes = document.querySelectorAll('.node');
      nodes.forEach(node => {
        setInterval(() => {
          // Activar nodo aleatorio
          if (Math.random() > 0.7) {
            node.classList.add('active');
            setTimeout(() => {
              node.classList.remove('active');
            }, Math.random() * 500 + 200);
          }
        }, Math.random() * 2000 + 1000);
      });
    }
    
    // Función para animar la entrada de elementos
    function animateEntrance() {
      // Seleccionar elementos principales para animar
      const heroText = document.querySelector('.hero-text');
      const title = document.querySelector('.glitch-text');
      const tagline = document.querySelector('.tagline');
      const btnContainer = document.querySelector('.btn-container');
      const network = document.querySelector('.neural-network');
      
      // Asegurarse de que todo sea visible antes de iniciar
      if (heroText) heroText.style.opacity = '0';
      if (title) title.style.opacity = '1';
      if (tagline) tagline.style.opacity = '0';
      if (btnContainer) btnContainer.style.opacity = '0';
      if (network) network.style.opacity = '0';
      
      // Configurar animaciones de entrada en secuencia
      setTimeout(() => {
        if (heroText) {
          heroText.style.opacity = '1';
          heroText.style.transform = 'translateY(0)';
        }
      }, 100);
      
      setTimeout(() => {
        if (tagline) {
          tagline.style.opacity = '1';
          tagline.style.transform = 'translateY(0)';
        }
      }, 500);
      
      setTimeout(() => {
        if (btnContainer) {
          btnContainer.style.opacity = '1';
          btnContainer.style.transform = 'translateY(0)';
        }
      }, 700);
      
      setTimeout(() => {
        if (network) {
          network.style.opacity = '1';
          network.style.transform = 'scale(1)';
          
          // Iniciar animación de la red neuronal después de que aparezca
          setTimeout(animateNeuralNetwork, 400);
        }
      }, 1000);
    }
  
    // Función para crear efectos de glitch aleatorios
    function randomGlitch() {
      const title = document.querySelector('.glitch-text');
      if (!title) return;
      
      // Agregar clase de glitch intenso aleatoriamente
      setInterval(() => {
        title.classList.add('intensify-glitch');
        
        setTimeout(() => {
          title.classList.remove('intensify-glitch');
        }, 200);
      }, Math.random() * 3000 + 2000);
    }
    
    // Función para animar el movimiento del grid
    function animateGrid() {
      const grid = document.querySelector('.grid-background');
      if (!grid) return;
      
      // Cambiar la perspectiva y la rotación del grid con el scroll
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const rotationX = 60 - (scrollY * 0.05);
        
        grid.style.transform = `perspective(500px) rotateX(${Math.max(30, rotationX)}deg)`;
      });
    }
    
    // Función para hacer que los elementos respondan al movimiento del mouse
    function mouseParallax() {
      const hero = document.querySelector('.hero');
      if (!hero) return;
      
      const elements = {
        geometrics: document.querySelectorAll('.geometric-element'),
        particles: document.querySelectorAll('.particle'),
        network: document.querySelector('.neural-network'),
        glowCircles: document.querySelectorAll('.neon-circle')
      };
      
      hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Mover elementos geométricos
        elements.geometrics.forEach(el => {
          const moveX = (x - 0.5) * 20;
          const moveY = (y - 0.5) * 20;
          el.style.transform = `translate(${moveX}px, ${moveY}px) rotate(var(--rotate))`;
        });
        
        // Mover red neuronal
        if (elements.network) {
          const moveX = (x - 0.5) * 10;
          const moveY = (y - 0.5) * 10;
          elements.network.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        // Mover círculos de brillo
        elements.glowCircles.forEach(el => {
          const moveX = (x - 0.5) * 30;
          const moveY = (y - 0.5) * 30;
          el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
      });
    }
    
    // Iniciar todas las animaciones - con pequeño retraso para asegurar carga completa
    setTimeout(() => {
      document.body.classList.add('dom-loaded');
      animateEntrance();
      randomGlitch();
      animateGrid();
      mouseParallax();
    }, 200);
    
    // Efecto hover en los botones cyberpunk
    const buttons = document.querySelectorAll('.cybr-btn');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        // Opcionalmente se podría agregar sonido
        // const hoverSound = new Audio('/sounds/hover.mp3');
        // hoverSound.volume = 0.2;
        // hoverSound.play();
      });
    });
    
  });
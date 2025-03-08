// Script específico para la animación de la red neuronal
document.addEventListener('DOMContentLoaded', () => {
    // Función para animar la red neuronal
    function animateNeuralNetwork() {
      // Seleccionar todos los nodos
      const nodes = document.querySelectorAll('.neural-node');
      if (!nodes.length) return;
      
      // Activación inicial aleatoria
      setTimeout(() => {
        // Activar un nodo aleatorio al inicio
        const randomIndex = Math.floor(Math.random() * nodes.length);
        activateNode(nodes[randomIndex]);
      }, 1000);
      
      // Configurar activación periódica de nodos
      nodes.forEach((node, index) => {
        // Decidir un intervalo aleatorio para cada nodo
        const interval = 2000 + (Math.random() * 3000);
        
        // Activar nodos periódicamente
        setInterval(() => {
          // 30% de probabilidad de activarse
          if (Math.random() < 0.3) {
            activateNode(node);
          }
        }, interval);
      });
      
      // Propagación de activaciones
      function activateNode(node) {
        // Si el nodo ya está activo, no hacer nada
        if (node.classList.contains('active')) return;
        
        // Activar el nodo
        node.classList.add('active');
        
        // Tiempo de activación (200-500ms)
        const activeTime = 200 + Math.random() * 300;
        
        // Desactivar después de un tiempo
        setTimeout(() => {
          node.classList.remove('active');
        }, activeTime);
        
        // Propagar a nodos vecinos
        propagateActivation(node);
      }
      
      function propagateActivation(sourceNode) {
        // Determinar la capa actual
        const currentLayer = sourceNode.parentElement;
        const allLayers = document.querySelectorAll('.node-layer');
        const layerIndex = Array.from(allLayers).indexOf(currentLayer);
        
        // No propagar desde la última capa
        if (layerIndex >= allLayers.length - 1) return;
        
        // Obtener la siguiente capa
        const nextLayer = allLayers[layerIndex + 1];
        if (!nextLayer) return;
        
        // Seleccionar nodos de la siguiente capa
        const nextNodes = nextLayer.querySelectorAll('.neural-node');
        
        // Seleccionar nodos aleatorios para propagar (1-2 nodos)
        const numToPropagate = Math.floor(Math.random() * 2) + 1;
        const nodesToActivate = [];
        
        // Seleccionar nodos aleatorios sin repetir
        while (nodesToActivate.length < numToPropagate && nodesToActivate.length < nextNodes.length) {
          const randomIndex = Math.floor(Math.random() * nextNodes.length);
          const randomNode = nextNodes[randomIndex];
          
          if (!nodesToActivate.includes(randomNode)) {
            nodesToActivate.push(randomNode);
          }
        }
        
        // Activar los nodos seleccionados con retraso
        nodesToActivate.forEach((node, index) => {
          setTimeout(() => {
            activateNode(node);
          }, 150 * (index + 1)); // Retraso escalonado para efecto de propagación
        });
      }
      
      // Crear conexiones visuales SVG (opcional, solo si es posible)
      function createVisualConnections() {
        try {
          // Comprobar si podemos crear elementos SVG
          const svgNS = "http://www.w3.org/2000/svg";
          const testSvg = document.createElementNS(svgNS, "svg");
          
          if (!testSvg) return; // No soportado
          
          // Contenedor para las conexiones
          const container = document.querySelector('.neural-visualization-container');
          if (!container) return;
          
          // Crear SVG
          const svg = document.createElementNS(svgNS, "svg");
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.style.position = "absolute";
          svg.style.top = "0";
          svg.style.left = "0";
          svg.style.pointerEvents = "none";
          svg.style.zIndex = "1";
          
          // Añadir al contenedor
          container.appendChild(svg);
          
          // Crear gradientes para las conexiones
          const defs = document.createElementNS(svgNS, "defs");
          
          // Gradiente input-hidden
          const grad1 = document.createElementNS(svgNS, "linearGradient");
          grad1.setAttribute("id", "connectionGrad1");
          grad1.setAttribute("x1", "0%");
          grad1.setAttribute("y1", "0%");
          grad1.setAttribute("x2", "100%");
          grad1.setAttribute("y2", "0%");
          
          const stop1a = document.createElementNS(svgNS, "stop");
          stop1a.setAttribute("offset", "0%");
          stop1a.setAttribute("stop-color", "rgba(100,200,255,0.4)");
          
          const stop1b = document.createElementNS(svgNS, "stop");
          stop1b.setAttribute("offset", "100%");
          stop1b.setAttribute("stop-color", "rgba(176,66,255,0.4)");
          
          grad1.appendChild(stop1a);
          grad1.appendChild(stop1b);
          
          // Gradiente hidden-output
          const grad2 = document.createElementNS(svgNS, "linearGradient");
          grad2.setAttribute("id", "connectionGrad2");
          grad2.setAttribute("x1", "0%");
          grad2.setAttribute("y1", "0%");
          grad2.setAttribute("x2", "100%");
          grad2.setAttribute("y2", "0%");
          
          const stop2a = document.createElementNS(svgNS, "stop");
          stop2a.setAttribute("offset", "0%");
          stop2a.setAttribute("stop-color", "rgba(176,66,255,0.4)");
          
          const stop2b = document.createElementNS(svgNS, "stop");
          stop2b.setAttribute("offset", "100%");
          stop2b.setAttribute("stop-color", "rgba(255,100,200,0.4)");
          
          grad2.appendChild(stop2a);
          grad2.appendChild(stop2b);
          
          defs.appendChild(grad1);
          defs.appendChild(grad2);
          svg.appendChild(defs);
          
          // Añadir las conexiones entre capas
          const layers = document.querySelectorAll('.node-layer');
          for (let l = 0; l < layers.length - 1; l++) {
            const currentLayer = layers[l];
            const nextLayer = layers[l + 1];
            
            const currentNodes = currentLayer.querySelectorAll('.neural-node');
            const nextNodes = nextLayer.querySelectorAll('.neural-node');
            
            // Para cada nodo en la capa actual
            currentNodes.forEach(source => {
              const sourceRect = source.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();
              
              // Calcular posición relativa al SVG
              const sourceX = sourceRect.left - containerRect.left + sourceRect.width / 2;
              const sourceY = sourceRect.top - containerRect.top + sourceRect.height / 2;
              
              // Conectar con algunos nodos de la siguiente capa (no todos para evitar saturación)
              nextNodes.forEach((target, i) => {
                // Reducir número de conexiones mostrando solo algunas
                if (Math.random() > 0.4) return;
                
                const targetRect = target.getBoundingClientRect();
                const targetX = targetRect.left - containerRect.left + targetRect.width / 2;
                const targetY = targetRect.top - containerRect.top + targetRect.height / 2;
                
                // Crear línea
                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", sourceX);
                line.setAttribute("y1", sourceY);
                line.setAttribute("x2", targetX);
                line.setAttribute("y2", targetY);
                line.setAttribute("stroke", `url(#connectionGrad${l === 0 ? 1 : 2})`);
                line.setAttribute("stroke-width", "1");
                line.setAttribute("stroke-opacity", (Math.random() * 0.2 + 0.1).toString());
                
                svg.appendChild(line);
              });
            });
          }
        } catch (e) {
          console.log("SVG connections could not be created", e);
        }
      }
      
      // Intentar crear conexiones visuales
      setTimeout(createVisualConnections, 1000);
    }
    
    // Iniciar animación 
    setTimeout(animateNeuralNetwork, 500);
  });
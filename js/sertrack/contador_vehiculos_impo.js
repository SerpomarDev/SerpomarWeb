(function() { // Inicio de la IIFE

    // Función para filtrar y contar placas
    function filtrarYContarPlacas() {
      fetch('https://esenttiapp-production.up.railway.app/api/registroestadistico', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      })
      .then(response => response.json())
      .then(data => {
        // Obtener la fecha seleccionada de localStorage, o usar la fecha actual si no hay ninguna
        const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || new Date().toISOString().slice(0, 10);
        const placas = new Set();
  
        // Filtrar por cliente (asumiendo que 'cliente' es un campo en tu data) y por fecha
        data.forEach(item => {
          if (item.fecha_cita && item.cliente === "ESENTTIA S A") {
            const fechaCita = item.fecha_cita.slice(0, 10);
            // Comparar con la fecha seleccionada
            if (fechaCita === fechaSeleccionada && item.placa_puerto) {
              placas.add(item.placa_puerto);
            }
          }
        });
  
        const numeroPlacas = placas.size || 0;
        document.getElementById('placa-operacion').textContent = numeroPlacas;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  
    // Obtener el elemento del calendario
    const calendario = document.querySelector('.calendar');
  
    // Establecer la fecha inicial del calendario
    const fechaActual = new Date();
    const fechaActualFormateada = fechaActual.toISOString().split('T')[0];
    calendario.value = fechaActualFormateada;
  
    // Guardar la fecha actual en localStorage si no hay una fecha ya guardada
    if (!localStorage.getItem('fechaSeleccionada')) {
      localStorage.setItem('fechaSeleccionada', fechaActualFormateada);
    }
  
    // Ejecutar el filtrado inicial
    filtrarYContarPlacas();
  
    // Agregar un evento 'change' al calendario para re-ejecutar el filtrado cuando cambie la fecha
    calendario.addEventListener('change', () => {
      const fechaSeleccionada = calendario.value;
      // Guardar la fecha seleccionada en localStorage
      localStorage.setItem('fechaSeleccionada', fechaSeleccionada);
      // Filtrar y contar placas de nuevo
      filtrarYContarPlacas();
    });
  
  })(); // Fin de la IIFE
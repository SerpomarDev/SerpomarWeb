(function() { // Inicio de la IIFE

  // Función para filtrar y contar fechas de cita
  function filtrarYContarFechasCita() {
    fetch('https://esenttiapp-production.up.railway.app/api/registroestadistico', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => {
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('Error en la solicitud a la API: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // Obtener la fecha seleccionada de localStorage, o usar la fecha actual si no hay ninguna
      const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || new Date().toISOString().slice(0, 10);
      let contador = 0;

      // Obtener el cliente del localStorage
      const clienteFiltrar = localStorage.getItem("cliente");

      data.forEach(item => {
        // Filtrar por cliente (obtenido del localStorage)
        if (item.fecha_ingreso && item.cliente === clienteFiltrar) {
          const fechaCita = item.fecha_ingreso.slice(0, 10);
          // Comparar con la fecha seleccionada
          if (fechaCita === fechaSeleccionada) {
            contador++;
          }
        }
      });

      // Actualizar el valor en el HTML
      document.getElementById('fecha_scargue').textContent = contador;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      alert("Error al obtener los datos. Por favor, intenta de nuevo.");
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

  // Ejecutar el conteo inicial
  filtrarYContarFechasCita();

  // Agregar un evento 'change' al calendario para re-ejecutar el conteo cuando cambie la fecha
  calendario.addEventListener('change', () => {
    const fechaSeleccionada = calendario.value;
    // Guardar la fecha seleccionada en localStorage
    localStorage.setItem('fechaSeleccionada', fechaSeleccionada);
    // Contar fechas de cita de nuevo
    filtrarYContarFechasCita();
  });

})(); // Fin de la IIFE
(function() { // Inicio de la IIFE

  // Función para contar conductores con fecha de cita
  function contarConductoresFechaCita() {
    fetch('https://esenttiapp-production.up.railway.app/api/contenedorregistro', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud a la API: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        // Obtener la fecha seleccionada de localStorage, o usar la fecha actual si no hay ninguna
        const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || new Date().toISOString().slice(0, 10);
        const conductores = new Set(); // Usar un Set para evitar contar conductores duplicados

        data.data.forEach(item => {
          if (item.fecha_cita && item.conductor_puerto) {
            const fechaCita = item.fecha_cita.slice(0, 10);
            if (fechaCita === fechaSeleccionada) {
              conductores.add(item.conductor_puerto);
            }
          }
        });

        // Actualizar el valor en el HTML (reemplaza 'id-del-contador' con el ID real de tu elemento)
        document.getElementById('asignados-dia').textContent = conductores.size;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
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
  contarConductoresFechaCita();

  // Agregar un evento 'change' al calendario
  calendario.addEventListener('change', () => {
    const fechaSeleccionada = calendario.value;
    localStorage.setItem('fechaSeleccionada', fechaSeleccionada);
    contarConductoresFechaCita();
  });

})(); // Fin de la IIFE
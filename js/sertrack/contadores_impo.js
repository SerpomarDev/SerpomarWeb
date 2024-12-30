(function() { // Inicio de la IIFE

  const calendario = document.querySelector('.calendar');
  const fechaActual = new Date();
  const fechaActualFormateada = fechaActual.toISOString().split('T')[0];

  calendario.value = fechaActualFormateada;

  // Guardar la fecha actual en localStorage
  localStorage.setItem('fechaSeleccionada', fechaActualFormateada);

  filtrarCitas(fechaActual);

  calendario.addEventListener('change', () => {
    const fechaSeleccionada = new Date(calendario.value);
    // Guardar la fecha seleccionada en localStorage
    localStorage.setItem('fechaSeleccionada', calendario.value);
    filtrarCitas(fechaSeleccionada);
  });

  function filtrarCitas(fechaSeleccionada) {
    fetch('https://esenttiapp-production.up.railway.app/api/citaprogramada', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(response => {
      const citasEsenttia = response.data.filter(cita => cita.cliente === "ESENTTIA S A");

      let pendienteCitaCount = 0;
      let tieneCitaCount = 0;

      citasEsenttia.forEach(cita => {
        const fechaCita = new Date(cita.fecha_cita);

        if (fechaCita.getFullYear() === fechaSeleccionada.getFullYear() &&
          fechaCita.getMonth() === fechaSeleccionada.getMonth() &&
          fechaCita.getDate() === fechaSeleccionada.getDate()) {

          if (cita.Pendiente_cita === "PENDIENTE CITA") {
            pendienteCitaCount++;
          }

          if (cita.Pendiente_cita === "TIENE CITA") {
            tieneCitaCount++;
          }
        }
      });

      document.getElementById('pendiente_cita').textContent = pendienteCitaCount;
      document.getElementById('total-citas-programa').textContent = tieneCitaCount;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
  }

})(); // Fin de la IIFE
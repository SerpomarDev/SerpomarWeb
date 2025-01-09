(function () {
  // Inicio de la IIFE

  function filtrarCitas() {
    // Obtener la fecha del localStorage
    const fechaSeleccionada = localStorage.getItem("fechaSeleccionada");
    console.log("Fecha seleccionada en contadores:", fechaSeleccionada);

    fetch("https://esenttiapp-production.up.railway.app/api/citaprogramada", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        // Obtener el cliente del localStorage
        const clienteFiltrar = localStorage.getItem("cliente");

        // Filtrar las citas por el cliente obtenido del localStorage
        const citasFiltradas = response.data.filter(
          (cita) => cita.cliente === clienteFiltrar
        );

        let pendienteCitaCount = 0;
        let tieneCitaCount = 0;

        citasFiltradas.forEach((cita) => {
          if (cita.Pendiente_cita === "PENDIENTE CITA") {
            // Si la cita está pendiente, no importa la fecha, se cuenta
            pendienteCitaCount++;
          } else if (cita.Pendiente_cita === "TIENE CITA") {
            // Solo si tiene fecha se compara
            if (cita.fecha_cita !== null) {
              const fechaCita = cita.fecha_cita.slice(0, 10);
              if (fechaCita === fechaSeleccionada) {
                tieneCitaCount++;
              }
            }
          }
        });

        document.getElementById("pendiente_cita").textContent =
          pendienteCitaCount;
        document.getElementById("total-citas-programa").textContent =
          tieneCitaCount;
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }

  // Escuchar evento personalizado para actualizar contadores
  window.addEventListener("fechaCambiada", (event) => {
    console.log("Evento fechaCambiada detectado en contadores!", event);
    filtrarCitas();
  });

  // Llamar a filtrarCitas al inicio para inicializar los contadores
  filtrarCitas();
})(); // Fin de la IIFE
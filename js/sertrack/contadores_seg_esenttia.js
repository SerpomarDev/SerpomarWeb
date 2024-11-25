
fetch('https://sertrack-production.up.railway.app/api/intervalfifteenday')
  .then(response => response.json())
  .then(data => {

    const calendar = document.querySelector('.calendar');

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const fechaHoy = moment().format('YYYY-MM-DD'); 

    // Establecer la fecha de hoy en el calendario
    calendar.value = fechaHoy;

    // Función para actualizar los contadores
    function actualizarContadores(datos) {
      // Contar los vehículos que tienen un valor en "cita_puerto"
      const vehiculosEnRuta = datos.filter(programa => programa.cita_puerto !== null).length;
      document.getElementById('vehiculos-ruta').textContent = vehiculosEnRuta;

      // Contar los programas que tienen un valor en "fecha_global"
      const totalPrograma = datos.filter(programa => programa.fecha_global !== null).length;
      document.getElementById('total-programa').textContent = totalPrograma;

      // Contar los programas que tienen un valor en "puerto_ingreso"
      const ingresoPuerto = datos.filter(programa => programa.puerto_ingreso !== null).length;
      document.getElementById('ingreso-puerto').textContent = ingresoPuerto;

    }

    // Filtrar los datos por la fecha de hoy al cargar la página
    const datosFiltradosHoy = data.filter(programa => {
      return programa.fecha_global !== null && programa.fecha_global === fechaHoy;
    });
    actualizarContadores(datosFiltradosHoy); 

    // Escuchar cambios en el calendario
    calendar.addEventListener('change', () => {
      const fechaSeleccionada = calendar.value;

      // Filtrar los datos por la fecha seleccionada
      const datosFiltrados = data.filter(programa => {
        // Asegúrate de que programa.fecha_global no sea nulo antes de compararlo
        return programa.fecha_global !== null && programa.fecha_global === fechaSeleccionada;
      });

      // Actualizar los contadores con los datos filtrados
      actualizarContadores(datosFiltrados);
    });

  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

  
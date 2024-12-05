fetch('https://sertrack-production.up.railway.app/api/intervalfifteenday')
  .then(response => response.json())
  .then(data => {

    // Filtrar por estado "FINALIZADO" al inicio
    const finalizados = data.filter(programa => programa.estado_operacion === "FINALIZADO");

    // Contador para programas finalizados con estado "DELAYED"
    const totalDelayed = finalizados.filter(programa => programa.on_timec === "DELAYED").length;
    document.getElementById('total-delayed').textContent = totalDelayed;

    // Contador para programas finalizados con estado "ON TIME"
    const totalOnTime = finalizados.filter(programa => programa.on_timec === "ON TIME").length;
    document.getElementById('total-ontime').textContent = totalOnTime;

    // Contador para programas con estado "FINALIZADO"
    const totalFinalizado = finalizados.length; // Ya está filtrado
    document.getElementById('total-programa').textContent = totalFinalizado; 

    // Contador para vehículos únicos (solo finalizados)
    const vehiculosUnicos = new Set();
    finalizados.forEach(programa => { // Iterar sobre los finalizados
      vehiculosUnicos.add(programa.vehiculo); 
    });
    const totalVehiculos = vehiculosUnicos.size;
    document.getElementById('total-vehiculos').textContent = totalVehiculos;

    // Contador para programas con "cita_puerto" con datos (solo finalizados)
    const citaPuertoConDatos = finalizados.filter(programa => programa.cita_puerto !== null && programa.cita_puerto !== ""); // Filtrar sobre los finalizados
    const totalCitaPuerto = citaPuertoConDatos.length;
    document.getElementById('total-vehiculos-puerto').textContent = totalCitaPuerto;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });
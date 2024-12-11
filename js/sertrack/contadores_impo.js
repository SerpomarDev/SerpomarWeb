fetch('https://esenttiapp-production.up.railway.app/api/citaprogramada', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
.then(response => response.json())
.then(response => {
  let pendienteCitaCount = 0;
  let tieneCitaCount = 0;

  const fechaActual = new Date();
  // Obtener solo la fecha (año, mes, día)
  const añoActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth();
  const diaActual = fechaActual.getDate();

  response.data.forEach(cita => {
    if (cita.Pendiente_cita === "PENDIENTE CITA") {
      pendienteCitaCount++;
    } 

    // Corrección: usar cita.fecha_cita
    const fechaCita = new Date(cita.fecha_cita); 
    // Obtener solo la fecha de la cita (año, mes, día)
    const añoCita = fechaCita.getFullYear();
    const mesCita = fechaCita.getMonth();
    const diaCita = fechaCita.getDate();

    // Comparar si la fecha de la cita es mayor o igual a la fecha actual
    if ((añoCita > añoActual) || 
        (añoCita === añoActual && mesCita > mesActual) || 
        (añoCita === añoActual && mesCita === mesActual && diaCita >= diaActual) 
        && cita.Pendiente_cita === "TIENE CITA") { 
      tieneCitaCount++;
    }
  });

  document.getElementById('pendiente_cita').textContent = pendienteCitaCount;
  document.getElementById('total-citas-programa').textContent = tieneCitaCount;
})
.catch(error => {
  console.error('Error al obtener los datos:', error);
});
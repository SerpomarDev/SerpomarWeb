fetch('https://esenttiapp-production.up.railway.app/api/citaprogramada', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
.then(response => response.json())
.then(response => {
  // Filtrar por cliente "ESENTTIA S A"
  const citasEsenttia = response.data.filter(cita => cita.cliente === "DISAN COLOMBIA S.A.S"); 

  let pendienteCitaCount = 0;
  let tieneCitaCount = 0;

  const fechaActual = new Date();
  const añoActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth();
  const diaActual = fechaActual.getDate();

  citasEsenttia.forEach(cita => { // Iterar sobre las citas filtradas
    if (cita.Pendiente_cita === "PENDIENTE CITA") {
      pendienteCitaCount++;
    } 

    const fechaCita = new Date(cita.fecha_cita); 
    const añoCita = fechaCita.getFullYear();
    const mesCita = fechaCita.getMonth();
    const diaCita = fechaCita.getDate();

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
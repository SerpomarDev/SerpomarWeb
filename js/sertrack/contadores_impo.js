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

  response.data.forEach(cita => {

    if (cita.Pendiente_cita === "PENDIENTE CITA") {
      pendienteCitaCount++;
    } 

    const fechaCita = new Date(cita.fecha); 

  
    if (fechaCita >= fechaActual && cita.Pendiente_cita === "TIENE CITA") { 
      tieneCitaCount++;
    }
  });

  document.getElementById('pendiente_cita').textContent = pendienteCitaCount;
  document.getElementById('total-citas-programa').textContent = tieneCitaCount;
})
.catch(error => {
  console.error('Error al obtener los datos:', error);
});
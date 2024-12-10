fetch('https://esenttiapp-production.up.railway.app/api/citaprogramada', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
.then(response => response.json())
.then(response => { // Cambiado 'data' por 'response'
  let pendienteCitaCount = 0;
  let tieneCitaCount = 0;

  // Accede al array dentro de la propiedad 'data'
  response.data.forEach(cita => { 
    if (cita.Pendiente_cita === "PENDIENTE CITA") {
      pendienteCitaCount++;
    } else if (cita.Pendiente_cita === "TIENE CITA") {
      tieneCitaCount++;
    }
  });

  document.getElementById('pendiente_cita').textContent = pendienteCitaCount;
  document.getElementById('total-citas-programa').textContent = tieneCitaCount;
})
.catch(error => {
  console.error('Error al obtener los datos:', error);
});
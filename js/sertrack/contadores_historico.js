fetch('https://sertrack-production.up.railway.app/api/intervalfifteenday')
  .then(response => response.json())
  .then(data => {
    const totalFinalizado = data.filter(programa => programa.estado_operacion === "FINALIZADO").length;
    document.getElementById('total-programa').textContent = totalFinalizado;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
  });
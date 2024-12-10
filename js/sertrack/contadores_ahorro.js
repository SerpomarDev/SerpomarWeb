fetch('https://esenttiapp-production.up.railway.app/api/ahorrobycliente', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {

    const filteredData = data.data.filter(item =>
      item.cliente === "ESENTTIA S A" &&
      item.modalidad === "EXPORTACION" &&
      item.lleno === "LLENO"
    );

    const contadorContenedor = document.getElementById('total-contenedores'); 
    contadorContenedor.textContent = filteredData.length; 

    const totalCostoBodegaje = filteredData.reduce((sum, item) => 
        sum + parseFloat(item.costo_bodegaje.replace(/,/g, '')), 0
    );

    const totalCostoSerpomar = filteredData.reduce((sum, item) => sum + item.costo_serpomar, 0);
    const totalAhorro = totalCostoBodegaje - totalCostoSerpomar;

    const totalAhorroFormateado = totalAhorro.toLocaleString('es-CO', {
      style: 'decimal', 
      minimumFractionDigits: 0 
    });

    const contadorAhorro = document.getElementById('total-ahorro');
    contadorAhorro.textContent = totalAhorroFormateado; 
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });
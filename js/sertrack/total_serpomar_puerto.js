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

    // Calcular el total de costo_bodegaje
    const totalCostoBodegaje = filteredData.reduce((sum, item) => 
        sum + parseFloat(item.costo_bodegaje.replace(/,/g, '')), 0
    );

    // Calcular el total de costo_serpomar
    const totalCostoSerpomar = filteredData.reduce((sum, item) => sum + item.costo_serpomar, 0);

    // Formatear los totales
    const totalCostoBodegajeFormateado = totalCostoBodegaje.toLocaleString('es-CO', {
        style: 'decimal', 
        minimumFractionDigits: 0 
    });

    const totalCostoSerpomarFormateado = totalCostoSerpomar.toLocaleString('es-CO', {
        style: 'decimal', 
        minimumFractionDigits: 0 
    });

    // Mostrar los totales en el HTML
    const contadorPuerto = document.getElementById('total-puerto');
    contadorPuerto.textContent = totalCostoBodegajeFormateado;

    const contadorSerpomar = document.getElementById('total-serpomar');
    contadorSerpomar.textContent = totalCostoSerpomarFormateado;

})
.catch(error => {
    console.error('Error al obtener los datos:', error);
});
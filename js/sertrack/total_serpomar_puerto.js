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

    // **Agregar los valores adicionales**
    const totalPuerto = totalCostoBodegaje + 179374828 + 308438812; 
    const totalSerpomar = totalCostoSerpomar + 61880000 + 81640000;

    // Formatear los totales
    const totalPuertoFormateado = totalPuerto.toLocaleString('es-CO', {
        style: 'decimal', 
        minimumFractionDigits: 0 
    });

    const totalSerpomarFormateado = totalSerpomar.toLocaleString('es-CO', {
        style: 'decimal', 
        minimumFractionDigits: 0 
    });

    // Mostrar los totales en el HTML
    const contadorPuerto = document.getElementById('total-puerto');
    contadorPuerto.textContent = totalPuertoFormateado;

    const contadorSerpomar = document.getElementById('total-serpomar');
    contadorSerpomar.textContent = totalSerpomarFormateado;

})
.catch(error => {
    console.error('Error al obtener los datos:', error);
});
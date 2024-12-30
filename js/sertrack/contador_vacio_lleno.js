(function() { // Inicio de la IIFE (si estás usando IIFEs, si no, ignora esta línea)

  function filtrarInventario() {
    const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || new Date().toISOString().slice(0, 10); // Obtiene la fecha del localStorage

    fetch('https://esenttiapp-production.up.railway.app/api/cargarinventario', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const totalVacios = data.filter(item =>
        item.cliente === "ESENTTIA S A" &&
        item.modalidad === "IMPORTACION" &&
        item.lleno_vacio === "VACIO" &&
        item.fecha_retiro === null && // Verifica que fecha_retiro sea null
        item.fecha_entrada.slice(0, 10) <= fechaSeleccionada // Compara fecha_entrada con fechaSeleccionada
      ).length;

      const totalLlenos = data.filter(item =>
        item.cliente === "ESENTTIA S A" &&
        item.modalidad === "IMPORTACION" &&
        item.lleno_vacio === "LLENO" &&
        item.fecha_retiro === null && // Verifica que fecha_retiro sea null
        item.fecha_entrada.slice(0, 10) <= fechaSeleccionada // Compara fecha_entrada con fechaSeleccionada
      ).length;

      document.getElementById('total-vacios').textContent = totalVacios;
      document.getElementById('total-llenos').textContent = totalLlenos;
    })
    .catch(error => console.error('Error al obtener los datos:', error));
  }

  // Ejecutar el filtrado inicial
  filtrarInventario();

  // Re-ejecutar el filtrado cuando cambie la fecha en el calendario (si es necesario)
  const calendario = document.querySelector('.calendar');
  calendario.addEventListener('change', () => {
    filtrarInventario();
  });

})(); // Fin de la IIFE (si estás usando IIFEs, si no, ignora esta línea)
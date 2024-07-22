document.addEventListener('DOMContentLoaded', () => {
    // Event listener para el botón "Ver Detalles"
    document.getElementById('btnVerDetalles').addEventListener('click', function(event) {
      event.preventDefault();
      let queryString = window.location.search;
      let urlParams = new URLSearchParams(queryString);
      let id = urlParams.get("id");
      mostrarDetalles(id);
    });
  
    // Cerrar el modal
    document.getElementById('closeModal').onclick = function() {
      document.getElementById('detailsModal').style.display = "none";
    }
  
    window.onclick = function(event) {
      if (event.target == document.getElementById('detailsModal')) {
        document.getElementById('detailsModal').style.display = "none";
      }
    }
  });
  
  function mostrarDetalles(id) {
    fetch(`https://esenttiapp-production.up.railway.app/api/uploadsolisev/${id}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const detalle = data[0];
          const modalContent = `
            <div><strong>Nro. SP:</strong> ${detalle.do_sp}</div>
            <div><strong>Contenedores:</strong> ${detalle.contendedor}</div>
            <div><strong>Cliente:</strong> ${detalle.cliente}</div>
            <div><strong>Modalidad:</strong> ${detalle.imp_exp}</div>
            <div><strong>ETA:</strong> ${detalle.eta}</div>
            <div><strong>Levante:</strong> ${detalle.levante}</div>
            <div><strong>Documental:</strong> ${detalle.documental}</div>
            <div><strong>Físico:</strong> ${detalle.fisico}</div>
            <div><strong>Libre Hasta:</strong> ${detalle.libre_hasta}</div>
            <div><strong>Bodega Hasta:</strong> ${detalle.bodega_hasta}</div>
            <div><strong>Propuesta:</strong> ${detalle.propuesta}</div>
            <div><strong>Motonave:</strong> ${detalle.motonave}</div>
            <div><strong>Viaje:</strong> ${detalle.viaje}</div>
            <div><strong>UVI:</strong> ${detalle.uvi}</div>
            <div><strong>SAE:</strong> ${detalle.sae}</div>
             <div><strong>BOOKING:</strong> ${detalle.booking}</div>
          `;
  
          document.getElementById('modalDetailsContent').innerHTML = modalContent;
          document.getElementById('detailsModal').style.display = 'block';
        }
      })
      .catch(error => console.error('Error al cargar los detalles:', error));
  }
  
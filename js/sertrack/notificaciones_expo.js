const token = localStorage.getItem('authToken');

function openModal(tipo) {
  Swal.fire({
    title: 'Selecciona el tipo de alerta',
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: 'Documental',
    denyButtonText: `Físico`,
  }).then((result) => {
    if (result.isConfirmed) {
      mostrarAlertas('Documental', tipo);
    } else if (result.isDenied) {
      mostrarAlertas('Fisico', tipo);
    }
  })
}

function calcularDiferenciaDias(fecha1, fecha2) {
  // Asegurar que las fechas se comparen en la misma zona horaria (Colombia)
  const fecha1Colombia = new Date(fecha1.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  const fecha2Colombia = new Date(fecha2.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  return Math.ceil(Math.abs(fecha1Colombia - fecha2Colombia) / (1000 * 60 * 60 * 24));
}

function mostrarAlertas(tipoAlerta, tipo) {
  // Obtener la fecha de hoy en la zona horaria de Colombia
  const hoyColombia = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
  const fechaHoy = new Date(hoyColombia).toISOString().split('T')[0]; 

  fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      // Filtrar los datos según el tipo de alerta, el estado de la operación Y la fecha global
      const alertas = data.filter(item => {
        // Convertir la fecha del item a la zona horaria de Colombia
        const fechaItem = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
        const fechaColombia = new Date(fechaItem.toLocaleString('en-US', { timeZone: 'America/Bogota' }));

        const diffDias = calcularDiferenciaDias(fechaColombia, new Date(hoyColombia)); // Usar fechas con zona horaria de Colombia
        return diffDias <= 3 && item.estado_operacion !== "FINALIZADO" && item.fecha_global === fechaHoy; 
      });

      // Dividir las alertas en tres arrays según la cercanía de la fecha
      const alertasBien = alertas.filter(item => {
        const fecha = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
        const diffDias = calcularDiferenciaDias(fecha, new Date(hoyColombia));
        return diffDias === 3;
      });
      const alertasAtencion = alertas.filter(item => {
        const fecha = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
        const diffDias = calcularDiferenciaDias(fecha, new Date(hoyColombia));
        return diffDias === 2;
      });
      const alertasCritico = alertas.filter(item => {
        const fecha = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
        const diffDias = calcularDiferenciaDias(fecha, new Date(hoyColombia));
        return diffDias <= 1;
      });

      // Generar el HTML para cada columna
      const htmlAlertasBien = generarHTMLAlertas(alertasBien, 'bien', tipoAlerta);
      const htmlAlertasAtencion = generarHTMLAlertas(alertasAtencion, 'atencion', tipoAlerta);
      const htmlAlertasCritico = generarHTMLAlertas(alertasCritico, 'critico', tipoAlerta);

      // Mostrar la alerta con SweetAlert con el HTML generado en tres columnas
      Swal.fire({
        title: `Notificaciones ${tipo === 'export' ? 'Exportación' : ''} ${tipoAlerta}`,
        html: `
          <div style="display: flex; justify-content: space-around;">
            <div class="contenedor-alerta"> 
              <h3 style="color: green;">Bajo</h3>
              ${htmlAlertasBien}
            </div>
            <div class="contenedor-alerta">
              <h3 style="color: orange;">Medio</h3>
              ${htmlAlertasAtencion}
            </div>
            <div class="contenedor-alerta">
              <h3 style="color: red;">Crítico</h3>
              ${htmlAlertasCritico}
            </div>
          </div>
        `,
        showConfirmButton: true,
      });
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener los datos',
        text: 'Hubo un problema al obtener la información de la API.'
      });
    });
}

// Función para generar el HTML de una lista de alertas
function generarHTMLAlertas(alertas, tipoAlerta, tipoFecha) {
  let html = '<ul>';
  alertas.forEach(item => {
    let color = "";

    if (tipoAlerta === 'bien') {
      color = "green";
    } else if (tipoAlerta === 'atencion') {
      color = "orange";
    } else if (tipoAlerta === 'critico') {
      color = "red";
    }

    html += `<li style="color: ${color};">`;

    if (tipoAlerta === 'bien') {
      html += `¡3 días! para la orden: ${item.pedido}`;
    } else if (tipoAlerta === 'atencion') {
      html += `¡2 días! para la orden: ${item.pedido}`;
    } else if (tipoAlerta === 'critico') {
      html += `¡1 día! o menos para la orden: ${item.pedido}`;
    }

    html += `</li><hr>`;
  });
  html += '</ul>';
  return html;
}
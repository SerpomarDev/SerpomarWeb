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
  // Usar moment.js para asegurar la correcta comparación de fechas en la zona horaria de Colombia
  const fecha1Colombia = moment(fecha1).tz('America/Bogota');
  const fecha2Colombia = moment(fecha2).tz('America/Bogota');
  return fecha1Colombia.diff(fecha2Colombia, 'days'); 
}

function mostrarAlertas(tipoAlerta, tipo) {
  // Obtener la fecha de hoy en la zona horaria de Colombia con moment.js
  const hoyColombia = moment().tz('America/Bogota').startOf('day'); 

  fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
      const alertas = data.filter(item => {
        try {
          // Convertir la fecha del item a la zona horaria de Colombia con moment.js
          const fechaItem = moment(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']).tz('America/Bogota');
  
          const diffDias = calcularDiferenciaDias(fechaItem, hoyColombia); 
          // Comparar solo la parte de la fecha con moment.js
          return diffDias <= 3 && item.estado_operacion !== "FINALIZADO" && moment(item.fecha_global).tz('America/Bogota').isSame(hoyColombia, 'day'); 
        } catch (error) {
          console.error("Error al convertir la fecha:", item.fecha_global, error);
          return false;
        }
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
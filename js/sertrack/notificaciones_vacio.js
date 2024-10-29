const token = localStorage.getItem('authToken');

const navierasDiasPermitidos = {
  'MAERSK': 21,
  'HAPAG LlOYD': 25,
  'SHIPLILLY': 20,
  'SEABOARD': 12,
  'MEDITERRANEA': 22,
  'AGUNSA': 21,
  'CMA CGM': 20,
  'COSCO': 22,
  'ZIM': 21,
};

function openModal() {
  mostrarAlertasNavieras();
}

function mostrarAlertasNavieras() {
  fetch("https://esenttiapp-production.up.railway.app/api/esenttiavacio", {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error en la solicitud a la API: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Datos recibidos de la API:", data); 

    if (!Array.isArray(data)) {
      throw new Error("Los datos de la API no son un array.");
    }

    const alertas = data.map(item => {
      if (!item.fecha_entrada || !item.naviera) {
        console.warn("Elemento con datos faltantes:", item);
        return null; 
      }

      // Convertir la fecha del item a la zona horaria de Colombia
      const fechaEntrada = new Date(item.fecha_entrada);
      const fechaEntradaColombia = new Date(fechaEntrada.toLocaleString('en-US', { timeZone: 'America/Bogota' }));

      // Obtener la fecha de hoy en la zona horaria de Colombia
      const hoyColombia = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
      const hoy = new Date(hoyColombia);

      const diffDias = Math.ceil(Math.abs(hoy - fechaEntradaColombia) / (1000 * 60 * 60 * 24));
      const diasPermitidos = navierasDiasPermitidos[item.naviera] || 0; 
      const diasRestantes = diasPermitidos - diffDias;

      return {
        ...item,
        diasRestantes
      };
    }).filter(item => item !== null); 

    console.log("Alertas calculadas:", alertas); 

            // Dividir las alertas en tres arrays según la cercanía de la fecha
            const alertasBien = alertas.filter(item => item.diasRestantes === 3);
            const alertasAtencion = alertas.filter(item => item.diasRestantes === 2);
            const alertasCritico = alertas.filter(item => item.diasRestantes <= 1);

            // Generar el HTML para cada columna
            const htmlAlertasBien = generarHTMLAlertas(alertasBien, 'bien');
            const htmlAlertasAtencion = generarHTMLAlertas(alertasAtencion, 'atencion');
            const htmlAlertasCritico = generarHTMLAlertas(alertasCritico, 'critico');

            // Mostrar la alerta con SweetAlert con el HTML generado en tres columnas
            Swal.fire({
                title: `Notificaciones Navieras`,
                html: `
                    <div style="display: flex; justify-content: space-around;">
                        <div class="contenedor-alerta"> 
                            <h3 style="color: green;">Bajo</h3>
                            ${htmlAlertasBien}
                        </div>
                        <div class="contenedor-alerta">
                            <h3 style="color: orange;">Alto</h3>
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
                text: error.message // Mostrar el mensaje de error específico
            });
        });
}

// Función para generar el HTML de una lista de alertas
function generarHTMLAlertas(alertas, tipoAlerta) {
    let html = '<ul>';
    alertas.forEach(item => {
        let color = "";

        if (tipoAlerta === 'bien') {
            color = "green";
        } else if (tipoAlerta === 'atencion') {
            color = "yellow";
        } else if (tipoAlerta === 'critico') {
            color = "red";
        }

        html += `<li style="color: ${color};">`;

        if (tipoAlerta === 'bien') {
            html += `¡3 días! ${item.naviera} - Contenedor: ${item.contenedor}`;
        } else if (tipoAlerta === 'atencion') {
            html += `¡2 días! ${item.naviera} - Contenedor: ${item.contenedor}`;
        } else if (tipoAlerta === 'critico') {
            html += `¡1 día! o menos ${item.naviera} - Contenedor: ${item.contenedor}`;
        }

        html += `</li><hr>`;
    });
    html += '</ul>';
    return html;
}
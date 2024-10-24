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

function mostrarAlertas(tipoAlerta, tipo) {
    fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            // Filtrar los datos según el tipo de alerta seleccionado
            const alertas = data.filter(item => {
                const fecha = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
                const hoy = new Date();
                const diffDias = Math.ceil(Math.abs(fecha - hoy) / (1000 * 60 * 60 * 24));
                return diffDias <= 3; // Mostrar alertas hasta 3 días antes de la fecha
            });

            // Dividir las alertas en tres arrays según la cercanía de la fecha
            const alertasBien = alertas.filter(item => {
                const fecha = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
                const hoy = new Date();
                const diffDias = Math.ceil(Math.abs(fecha - hoy) / (1000 * 60 * 60 * 24));
                return diffDias === 3;
            });
            const alertasAtencion = alertas.filter(item => {
                const fecha = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
                const hoy = new Date();
                const diffDias = Math.ceil(Math.abs(fecha - hoy) / (1000 * 60 * 60 * 24));
                return diffDias === 2;
            });
            const alertasCritico = alertas.filter(item => {
                const fecha = new Date(item[tipoAlerta === 'Documental' ? 'fecha_documental' : 'fecha_fisico']);
                const hoy = new Date();
                const diffDias = Math.ceil(Math.abs(fecha - hoy) / (1000 * 60 * 60 * 24));
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
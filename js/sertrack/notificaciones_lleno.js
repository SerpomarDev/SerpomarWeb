const token = localStorage.getItem('authToken');

function openModal() {
    mostrarAlertasCutoff();
}

function mostrarAlertasCutoff() {
    fetch("https://esenttiapp-production.up.railway.app/api/esenttialleno", {
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
            if (!item.cutoff) {
                console.warn("Elemento con datos faltantes:", item);
                return null; 
            }

            const fechaCutoff = new Date(item.cutoff);
            fechaCutoff.setDate(fechaCutoff.getDate() - 6); // Restar 6 días a la fecha de cutoff
            const hoy = new Date();
            const diffDias = Math.ceil(Math.abs(hoy - fechaCutoff) / (1000 * 60 * 60 * 24));
            let nivelAlerta;

            if (diffDias === 3) {
                nivelAlerta = 'Baja';
            } else if (diffDias === 2) {
                nivelAlerta = 'Alta';
            } else if (diffDias <= 1) {
                nivelAlerta = 'Critica';
            } else {
                return null; // Ignorar si no cumple con las condiciones de alerta
            }

            return {
                ...item,
                nivelAlerta,
                diasRestantes: diffDias
            };
        }).filter(item => item !== null); 

        console.log("Alertas calculadas:", alertas); 

        const alertasBaja = alertas.filter(item => item.nivelAlerta === 'Baja');
        const alertasAlta = alertas.filter(item => item.nivelAlerta === 'Alta');
        const alertasCritica = alertas.filter(item => item.nivelAlerta === 'Critica');

        const htmlAlertasBaja = generarHTMLAlertas(alertasBaja, 'Baja');
        const htmlAlertasAlta = generarHTMLAlertas(alertasAlta, 'Alta');
        const htmlAlertasCritica = generarHTMLAlertas(alertasCritica, 'Critica');

        Swal.fire({
            title: `Alertas de Cutoff`,
            html: `
                <div style="display: flex; justify-content: space-around;">
                    <div class="contenedor-alerta"> 
                        <h3 style="color: green;">Baja</h3>
                        ${htmlAlertasBaja}
                    </div>
                    <div class="contenedor-alerta">
                        <h3 style="color: orange;">Alta</h3>
                        ${htmlAlertasAlta}
                    </div>
                    <div class="contenedor-alerta">
                        <h3 style="color: red;">Crítica</h3>
                        ${htmlAlertasCritica}
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
            text: error.message 
        });
    });
}

function generarHTMLAlertas(alertas, nivelAlerta) {
    let html = '<ul>';
    alertas.forEach(item => {
        let color = "";
        switch(nivelAlerta) {
            case 'Baja': color = "green"; break;
            case 'Alta': color = "orange"; break;
            case 'Critica': color = "red"; break;
        }
        html += `<li style="color: ${color};">`;
        html += `Faltan ${item.diasRestantes} días para ingresar de ${item.naviera} - Contenedor: ${item.contenedor}`; 
        html += `</li><hr>`;
    });
    html += '</ul>';
    return html;
}
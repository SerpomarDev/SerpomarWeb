const endpointURL = "https://esenttiapp-production.up.railway.app/api/uploadtipologia";
const container = document.getElementById("tipologiaPlacas");

fetch(endpointURL, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
    const tipologias = procesarDatos(data);
    renderizarTipologias(tipologias);
})
.catch(error => {
    console.error("Error al obtener los datos:", error);
    container.innerHTML = `<p>Error al cargar la información: ${error.message}</p>`;
});

function procesarDatos(data) {
    const tipologias = {
        "MINIMULA": [],
        "PATINETA": [],
        "TRACTOMULA": [],
        "SENCILLO": [],
        "TURBO": []
    };

    data.forEach(item => {
        for (const tipo in tipologias) {
            if (item[tipo] !== null) {
                tipologias[tipo].push(item[tipo]);
            }
        }
    });

    return tipologias;
}

function renderizarTipologias(tipologias) {
    let html = "";
    for (const tipo in tipologias) {
        // Si el contador es mayor que 0, entonces genera el HTML
        if (tipologias[tipo].length > 0) {
            html += `<div class="columna">`;
            html += `<div class="total">${tipologias[tipo].length}</div>`;
            html += `<div class="tipo">${tipo}</div>`;
            html += `<ul class="placas">`;
            tipologias[tipo].forEach(placa => {
                html += `<li>${placa}</li>`;
            });
            html += `</ul>`;
            html += `</div>`;
        }
    }
    container.innerHTML = html;
}
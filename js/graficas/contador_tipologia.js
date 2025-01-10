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
      if (tipologias[tipo].length > 0) {
          const iconClass = getIconClass(tipo); // Obtiene la clase del icono
          html += `<div class="columna">`;
          html += `<div class="header-tipologia" onclick="togglePlacas(this)">`;
          html += `<div class="info-tipologia">`; // Contenedor para icono, total y tipo
          html += `<div class="icon-container">`;
          html += `<i class="${iconClass}"></i>`;
          html += `</div>`;
          html += `<div class="total">${tipologias[tipo].length}</div>`;
          html += `<div class="tipo">${tipo}</div>`;
          html += `</div>`; // Cierra info-tipologia
          html += `<i class="fas fa-chevron-down expand-icon"></i>`; // Icono de expandir
          html += `</div>`; // Cierra header-tipologia
          html += `<ul class="placas" style="display: none;">`; // Inicialmente oculto
          tipologias[tipo].forEach(placa => {
              html += `<li>${placa}</li>`;
          });
          html += `</ul>`;
          html += `</div>`;
      }
  }
  container.innerHTML = html;
}

// ... otras funciones ...

function togglePlacas(element) {
  const ul = element.nextElementSibling;
  const icon = element.querySelector('.expand-icon'); // Obtiene el icono
  if (ul.style.display === "none") {
      ul.style.display = "block";
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-up'); // Cambia a icono de contraer
  } else {
      ul.style.display = "none";
      icon.classList.remove('fa-chevron-up');
      icon.classList.add('fa-chevron-down'); // Cambia a icono de expandir
  }
}

// Función para obtener la clase del icono según la tipología
function getIconClass(tipo) {
    switch (tipo) {
        case "MINIMULA":
            return "fas fa-truck-moving";
        case "PATINETA":
            return "fas fa-dolly";
        case "TRACTOMULA":
            return "fas fa-truck";
        case "SENCILLO":
            return "fas fa-car-side";
        case "TURBO":
            return "fas fa-fighter-jet";
        default:
            return "fas fa-question-circle"; // Icono por defecto
    }
}

// Función para contraer/expandir las placas
function togglePlacas(element) {
    const ul = element.nextElementSibling;
    if (ul.style.display === "none") {
        ul.style.display = "block";
    } else {
        ul.style.display = "none";
    }
}
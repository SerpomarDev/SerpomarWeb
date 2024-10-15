document.addEventListener('DOMContentLoaded', () => {

    const endpoint = "https://sertrack-production.up.railway.app/api/planeacion";


async function fetchData() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        console.error("Error de autenticación: Token no encontrado.");
        mostrarError("Error de autenticación");
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error en la solicitud:", response.status, errorData);
            mostrarError(`Error en la solicitud: ${response.status} - ${errorData.message}`);
            return;
        }

        const data = await response.json();

        const totalPrograma = contarRegistrosFechaActual(data);
        const totalDocumentoLleno = contarDocumentoCargadoFechaActual(data)
        mostrarResultado(totalPrograma, totalDocumentoLleno); // Actualizar la función mostrarResultado

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        mostrarError("Error al obtener datos");
    }
}


function contarRegistrosFechaActual(data) {
  const fechaActual = new Date().toISOString().slice(0, 10);
  let contador = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].fecha_global) { // Verificar si la propiedad existe
      const fechaIngreso = data[i].fecha_global.slice(0, 10);
      if (fechaIngreso === fechaActual) {
        contador++;
      }
    }
  }

  return contador;
}

function contarDocumentoCargadoFechaActual(data) {
  const fechaActual = new Date().toISOString().slice(0, 10);
  let contador = 0;

  for (let i = 0; i < data.length; i++) {
      if (data[i].fecha_global && data[i].documentos_lleno) {
          const documentos_lleno = data[i].fecha_global.slice(0, 10);
          if (documentos_lleno === fechaActual) {
              contador++;
          }
      }
  }

  return contador;
}

function mostrarResultado(totalPrograma, totalDocumentoLleno) { 
  document.getElementById("total-programa").textContent = totalPrograma;
  document.getElementById("total-documento-lleno").textContent = totalDocumentoLleno; 
}

function mostrarError(mensaje) {
  document.getElementById("total-programa").textContent = mensaje; 
  document.getElementById("total-documento-lleno").textContent = mensaje; 
}

  fetchData(); 

});
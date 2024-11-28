const buscador = document.getElementById('buscador');
const botonBuscar = document.getElementById('buscar');
const resultadoDiv = document.getElementById('resultado');
const checkDO = document.getElementById('checkDO');
const checkPedido = document.getElementById('checkPedido');
const checkContenedor = document.getElementById('checkContenedor');

async function obtenerDatos(textoBusqueda) {
  let url = `https://esenttiapp-production.up.railway.app/api/registroestadistico`;

  if (textoBusqueda) {
    if (checkDO.checked) {
      url += `?do=${textoBusqueda}`;
    } else if (checkPedido.checked) {
      url += `?pedido=${textoBusqueda}`;
    } else if (checkContenedor.checked) {
      url += `?contenedor=${textoBusqueda}`;
    } else {
      Swal.fire('Error', 'Por favor, seleccione un tipo de búsqueda.', 'error');
      return null;
    }
  }

  try {
    console.log("URL de la solicitud:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    console.log("Respuesta del servidor:", response);

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Datos recibidos:", data);

    // Verificar si la respuesta es un array y si tiene elementos
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      console.log("La respuesta no es un array o está vacía.");
      return null;
    }

  } catch (error) {
    console.error('Error al obtener los datos:', error);
    Swal.fire('Error', 'No se pudieron obtener los datos.', 'error');
    return null;
  }
}

botonBuscar.addEventListener('click', async () => {
  const textoBusqueda = buscador.value.toLowerCase();
  const datos = await obtenerDatos(textoBusqueda);

  console.log("Datos obtenidos:", datos);

  if (datos && datos.length > 0) {
    resultadoDiv.innerHTML = `<p>SP: ${datos[0].sp}</p>`;
  } else {
    resultadoDiv.innerHTML = `<p>No se encontraron resultados.</p>`;
  }
});
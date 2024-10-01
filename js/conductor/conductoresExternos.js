import { Grid, h } from 'gridjs';

const te = new Date();
const azDate = new Intl.DateTimeFormat("az").format(te);

// Definición de columnas para Grid.js
const columnDefs = [
  { id: 'id', name: 'Id', hidden: true }, 
  { id: 'fecha', name: 'Fecha' },
  { id: 'cliente', name: 'Cliente' },
  { id: 'do_sp', name: 'SP' },
  { id: 'numero_contenedor', name: 'Numero Contenedor' },
  { id: 'placa', name: 'Placa' },
  { id: 'estado', name: 'Estado' },
  { 
    id: 'accion', 
    name: 'Accion', 
    hidden: true,
    formatter: (cell) => 
      h('button', {
        className: 'py- mb-4 px-4 bg-blue-600',
        onClick: () => actualizarFactura(cell) 
      }, 'Programar')
  }
];

// Crear la instancia de Grid.js
const grid = new Grid({
  columns: columnDefs,
  search: true, // Habilitar búsqueda (opcional)
  pagination: {
    limit: 20 // Tamaño de página
  },
  // ... otras opciones de Grid.js que necesites
});

// Montar la tabla en el contenedor
grid.render(document.getElementById('programar')); 

// Función para cargar los datos y actualizar la tabla
async function cargarDatos(fechaSeleccionada) {
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      // Manejar el caso en que no hay token (redirigir al login, mostrar mensaje, etc.)
      console.error("No hay token de autenticación.");
      return; 
    }

    const response = await fetch(`https://esenttiapp-production.up.railway.app/api/viewprogramacion/${fechaSeleccionada}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) {
      // Manejar errores de la petición (token inválido, etc.)
      console.error("Error en la petición:", response.status, response.statusText);
      return;
    }

    const data = await response.json();

    const processedData = data.map(Preprogramar => ({
      id: Preprogramar.id,
      fecha: Preprogramar.fecha,
      cliente: Preprogramar.cliente,
      do_sp: Preprogramar.do_sp,
      numero_contenedor: Preprogramar.numero_contenedor,
      placa: Preprogramar.placa,
      estado: Preprogramar.estado
    }));

    grid.updateConfig({ data: processedData }).forceRender(); 
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
}

// Cargar datos iniciales al iniciar la tabla
const fechaInicial = localStorage.getItem("fechaSeleccionada") || azDate;
cargarDatos(fechaInicial);

// Observar cambios en localStorage para recargar la tabla
window.addEventListener('storage', (event) => {
  if (event.key === 'fechaSeleccionada') {
    cargarDatos(event.newValue);
  }
});
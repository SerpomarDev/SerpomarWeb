// Función para crear la tabla 'Preprogramaciones'
function createPreprogramacionesGrid() {
    const columnDefsPreprogramaciones = [
      { headerName: "id", field: "id", hide: true },
      { headerName: "fecha", field: "fecha" },
      { headerName: "Hora", field: "hora" },
      { headerName: "Tipo servicio", field: "tipo_servicio" },
      { headerName: "Origen", field: "origen" },
      { headerName: "Destino", field: "destino" },
  
      {
        headerName: "Accion",
        cellRenderer: params => {
          return `
            <button class="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700" 
                    onclick="openModal('editar', ${params.data.id})">
              Editar
            </button>`;
        }
      }
    ];
  
    fetch("https://esenttiapp-production.up.railway.app/api/preprogramacion", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // Formatear fechas en el campo 'fecha'
        const formattedData = data.map(item => ({
          ...item,
          fecha: item.fecha ? new Date(item.fecha).toLocaleDateString() : ''
        }));
  
        const gridOptions = {
          columnDefs: columnDefsPreprogramaciones,
          defaultColDef: {
            resizable: true,
            sortable: true,
            filter: "agTextColumnFilter",
            floatingFilter: true,
            flex: 1,
            minWidth: 100,
          },
          rowSelection: 'multiple',
          enableRangeSelection: true,
          suppressMultiRangeSelection: true,
          pagination: true,
          paginationPageSize: 20,
          rowData: formattedData,
        };
  
        const eGridDiv = document.getElementById('Preprogramaciones');
        new agGrid.Grid(eGridDiv, gridOptions);
      })
      .catch(error => {
        console.error("Error al cargar los datos:", error);
        alert("Error al cargar los datos de preprogramaciones. Por favor, intenta de nuevo más tarde.");
      });
  }
  
  // Función para abrir el modal con SweetAlert2
  function openModal(modo = 'editar', id = null) {
    Swal.fire({
      title: modo === 'crear' ? 'Crear Preprogramación' : 'Editar Preprogramación',
      html: `
       <form id="swal-form">
  <input type="hidden" name="id" id="swal-id"> 
  <div class="mb-4">
    <label for="swal-fecha" class="block text-sm font-medium">Fecha Programada</label>
    <input type="date" id="swal-fecha" name="fecha" class="w-full px-3 py-2 border rounded">
  </div>
  <div class="mb-4">
    <label for="swal-hora" class="block text-sm font-medium">Hora Programada</label>
    <input type="time" id="swal-hora" name="hora" class="w-full px-3 py-2 border rounded">
  </div>
  <div class="mb-4">
    <label for="swal-tipo_servicio" class="block text-sm font-medium">Tipo Operación</label>
    <select id="swal-tipo_servicio" name="tipo_servicio" class="w-full px-3 py-2 border rounded">
      <option>Seleccione Operación</option>
      <option value="IMPORTACION">IMPORTACION</option>
      <option value="EXPORTACION">EXPORTACION</option>
      <option value="RETIRO VACIO">RETIRO VACIO</option>
      <option value="TRASLADO">TTRASLADO</option> 
      <option value="DEVOLUCION">DEVOLUCION</option>
    </select>
  </div>
  <div class="mb-4">
    <label for="swal-origen" class="block text-sm font-medium">Origen</label>
    <select id="swal-origen" name="origen" class="w-full px-3 py-2 border rounded">
      <option>Seleccione Origen</option>
      <option value="SERPOMAR">SERPOMAR</option>
      <option value="ESENTTIA">ESENTTIA</option>
      <option value="CABOT">CABOT</option>
      <option value="SYNGENTA">SYNGENTA</option>
      <option value="ARCLAD">ARCLAD</option>
      <option value="KNAUF">KNAUF</option>
      <option value="ESENTTIA MB">ESENTTIA MB</option>
      <option value="ZONA FRANCA CANDELARIA">ZONA FRANCA CANDELARIA</option>
      <option value="ZONA FRANCA PARQUE CENTRAL">ZONA FRANCA PARQUE CENTRAL</option>
      <option value="CONTECAR">CONTECAR</option>
      <option value="SPRC">SPRC</option>
      <option value="COMPAS">COMPAS</option>
      <option value="BROOM">BROOM</option>
      <option value="SINMARITIMA TURBANA">SINMARITIMA TURBANA</option>
      <option value="SINMARITIMA CTG">SINMARITIMA CTG</option>
      <option value="CY TRACTOCAR">CY TRACTOCAR</option>
      <option value="APM">APM</option>
      <option value="INTERMODAL">INTERMODAL</option>
      <option value="TRANSPORTUARIA">TRANSPORTUARIA</option>
    </select>
  </div>
  <div class="mb-4">
    <label for="swal-destino" class="block text-sm font-medium">Destino</label>
    <select id="swal-destino" name="destino" class="w-full px-3 py-2 border rounded">
      <option>Seleccione Destino</option>
      <option value="SERPOMAR">SERPOMAR</option>
      <option value="ESENTTIA">ESENTTIA</option>
      <option value="CABOT">CABOT</option>
      <option value="SYNGENTA">SYNGENTA</option>
      <option value="ARCLAD">ARCLAD</option>
      <option value="KNAUF">KNAUF</option>
      <option value="ESENTTIA MB">ESENTTIA MB</option>
      <option value="ZONA FRANCA CANDELARIA">ZONA FRANCA CANDELARIA</option>
      <option value="ZONA FRANCA PARQUE CENTRAL">ZONA FRANCA PARQUE CENTRAL</option>
      <option value="CONTECAR">CONTECAR</option>
      <option value="SPRC">SPRC</option>
      <option value="COMPAS">COMPAS</option>
      <option value="BROOM">BROOM</option>
      <option value="SINMARITIMA TURBANA">SINMARITIMA TURBANA</option>
      <option value="SINMARITIMA CTG">SINMARITIMA CTG</option>
      <option value="CY TRACTOCAR">CY TRACTOCAR</option>
      <option value="APM">APM</option>
      <option value="INTERMODAL">INTERMODAL</option>
      <option value="TRANSPORTUARIA">TRANSPORTUARIA</option>
    </select>
  </div>
</form>
      `,
      
      showCancelButton: true,
      confirmButtonText: modo === 'crear' ? 'Crear' : 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        // Obtener los valores del formulario SweetAlert2
        const id = document.getElementById('swal-id').value;
        const fecha = document.getElementById('swal-fecha').value;
        const hora = document.getElementById('swal-hora').value;
        const tipo_servicio = document.getElementById('swal-tipo_servicio').value;
        const origen = document.getElementById('swal-origen').value;
        const destino = document.getElementById('swal-destino').value;
  
        // Validar los datos del formulario aquí si es necesario
  
        return { id, fecha, hora, tipo_servicio, origen, destino };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const data = result.value;
        let method = 'POST'; // Por defecto, se asume que se está creando
        let url = 'https://esenttiapp-production.up.railway.app/api/preprogramacion';
        if (data.id) {
          method = 'PUT';
          url = `https://esenttiapp-production.up.railway.app/api/preprogramacion/${data.id}`;
        }
        fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          },
          body: JSON.stringify({
            fecha: data.fecha,
            hora: data.hora,
            tipo_servicio: data.tipo_servicio,
            origen: data.origen,
            destino: data.destino
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error al ${method === 'POST' ? 'crear' : 'actualizar'} la preprogramación: ${response.status} ${response.statusText}`);
            }
            return response.json();
          })
          .then(data => {
            console.log(`${method === 'POST' ? 'Preprogramación creada' : 'Preprogramación actualizada'}:`, data);
            createPreprogramacionesGrid();
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: `La preprogramación se ha ${method === 'POST' ? 'creado' : 'actualizado'} correctamente.`
            });
          })
          .catch(error => {
            console.error(`Error al ${method === 'POST' ? 'crear' : 'actualizar'} la preprogramación:`, error);
            alert(`Error al ${method === 'POST' ? 'crear' : 'actualizar'} la preprogramación: ` + error.message);
          });
      }
    });
  
    // Si es modo editar, obtener los datos y rellenar el formulario de SweetAlert2
    if (modo === 'editar') {
      fetch(`https://esenttiapp-production.up.railway.app/api/preprogramacion/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      })
      .then(response => { 
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        return response.json();
       // Retornar response.json() aquí
      })
      .then(data => {
        document.getElementById('swal-id').value = data.id;
        document.getElementById('swal-fecha').value = data.fecha.split('T')[0];
        document.getElementById('swal-hora').value = data.hora || '';
        document.getElementById('swal-tipo_servicio').value = data.tipo_servicio;
        document.getElementById('swal-origen').value = data.origen;
        document.getElementById('swal-destino').value = data.destino;
      })
      .catch(error => {
        console.error("Error al obtener los datos de la preprogramación:", error);
        Swal.fire("Error", "Error al obtener los datos de la preprogramación: " + error.message, "error");
      });
      
          
  }
}

// Llamar a la función para crear la tabla 'Preprogramaciones'
document.addEventListener('DOMContentLoaded', createPreprogramacionesGrid);
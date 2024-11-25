let gridOptions;

const columnDefs = [
  { headerName: "id", field: "id", hide: true },
  {
    headerName: "Fecha Global",
    field: "fecha_global",
    filter: "agDateColumnFilter",
    floatingFilter: true,
    filterParams: {
      browserDatePicker: true,
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        const [year, month, day] = cellValue.split('-');
        const cellDate = new Date(year, month - 1, day);
        cellDate.setHours(0, 0, 0, 0);
        const filterDate = new Date(filterLocalDateAtMidnight);

        if (cellDate.getTime() === filterDate.getTime()) {
          return 0;
        }
        if (cellDate < filterDate) {
          return -1;
        }
        if (cellDate > filterDate) {
          return 1;
        }
      },
    }
  },
  { headerName: "Puerto Ingreso", field: "puerto_ingreso" },
  { headerName: "Cita Puerto", field: "cita_puerto" },
  { headerName: "Vehiculo", field: "vehiculo" },
  { headerName: "Conductor", field: "conductor" },
  { headerName: "Cedula C", field: "cedula_conductor" },
  { headerName: "Contenedor", field: "contenedor" },
  { headerName: "Peso Bascula", field: "peso_bascula" },
  { headerName: "Peso Puerto", field: "peso_puerto" },
  // { headerName: "Pedido", field: "pedido" },

];


fetch("https://sertrack-production.up.railway.app/api/intervalfifteenday", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    // Filtrar los datos aquí
    const filteredData = data.filter(Preprogramar => Preprogramar.cita_puerto); 

    const processedData = filteredData.map(Preprogramar => {
      return {
        id: Preprogramar.id,
        fecha_global: Preprogramar.fecha_global,
        puerto_ingreso: Preprogramar.puerto_ingreso,
        cita_puerto: Preprogramar.cita_puerto,
        vehiculo: Preprogramar.vehiculo,
        conductor: Preprogramar.conductor,
        cedula_conductor: Preprogramar.cedula_conductor,
        contenedor: Preprogramar.contenedor,
        peso_bascula: Preprogramar.peso_bascula,
        peso_puerto: Preprogramar.peso_puerto,
        // pedido: Preprogramar.pedido, 
      };
    });

    gridOptions = {
      columnDefs: columnDefs,
      defaultColDef: {
        resizable: true,
        sortable: false,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        flex: 1,
        minWidth: 100,
        editable: true
      },
      rowSelection: 'multiple',
      enableRangeSelection: true,
      suppressMultiRangeSelection: true,
      pagination: true,
      paginationPageSize: 20,
      rowData: processedData,

      onCellValueChanged: (event) => {
        const updatedRowData = event.data;
        const id = updatedRowData.id;

        Swal.fire({
          title: 'Actualizando...',
          text: "Se actualizará la información en la base de datos",
          icon: 'info',
          timer: 1000,
          timerProgressBar: true,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });

        setTimeout(() => {
          fetch(`https://sertrack-production.up.railway.app/api/planeacion/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(updatedRowData)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Error al actualizar datos');
              }
              console.log('Datos actualizados correctamente');
              Swal.fire({
                title: '¡Actualizado!',
                text: 'El registro ha sido actualizado.',
                icon: 'success',
                timer: 1000,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showConfirmButton: false
              });
            })
            .catch(error => {
              console.error('Error al actualizar datos:', error);
              Swal.fire(
                'Error',
                'No se pudo actualizar el registro.',
                'error'
              );
            });
        }, 2000);
      }
    };

    const eGridDiv = document.getElementById('preprogramar');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

function deleteSelectedRows() {
  const selectedRows = gridOptions.api.getSelectedRows();

  if (selectedRows.length === 0) {
    Swal.fire(
      'Ninguna fila seleccionada',
      'Por favor, selecciona al menos una fila para eliminar.',
      'warning'
    );
    return;
  }

  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción eliminará los registros seleccionados de la base de datos.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {
      const idsToDelete = selectedRows.map(row => row.id);
      idsToDelete.forEach(id => {
        fetch(`https://sertrack-production.up.railway.app/api/planeacion/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al eliminar el registro');
            }
            // Eliminar las filas seleccionadas del grid
            gridOptions.api.applyTransaction({ remove: selectedRows }); 
          })
          .catch(error => {
            console.error('Error al eliminar el registro:', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar el registro.',
              'error'
            );
          });
      });

      Swal.fire(
        'Eliminados!',
        'Los registros han sido eliminados.',
        'success'
      );
    }
  });
}
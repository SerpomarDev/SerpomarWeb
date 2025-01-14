let gridOptions;

const columnDefsOS = [
  { headerName: "id", field: "id", hide: false },
  { headerName: "ID C.", field: "id_contenedor", hide: false },
  { headerName: "Fecha Cargue", field: "fecha_cargue" },
  { headerName: "Fecha Devolucion", field: "fecha_devolucion" },
  { headerName: "Sitio", field: "sitio" },
  { headerName: "Manifiesto", field: "manifiesto" },
  { headerName: "Fecha Manifiesto", field: "fecha_manifiesto" },
  { headerName: "Remesa", field: "remesa" },
  { headerName: "Fecha Remesa", field: "fecha_remesa" },
  { headerName: "Fecha Cita", field: "fecha_cita" },
  { headerName: "Fecha Cliente", field: "fecha_cliente" },
  { headerName: "Sitio Cargue/Descargue", field: "sitio_cargue_descargue" },
  { headerName: "Patio", field: "patio" },
];

fetch("https://esenttiapp-production.up.railway.app/api/ordenservicios", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {

    // Obtener los IDs desde localStorage
    let contenedoresFiltradosIds = JSON.parse(localStorage.getItem('contenedoresFiltradosIds'));

    // Verificar si contenedoresFiltradosIds es null o no es un array
    if (!contenedoresFiltradosIds || !Array.isArray(contenedoresFiltradosIds)) {
      contenedoresFiltradosIds = []; // Asignar un array vacío si es null o no es un array
    }

    // Filtrar ordenserviciosData 
    const ordenserviciosFiltrados = data.filter(orden => contenedoresFiltradosIds.includes(orden.id_contenedor));

    const processedData = ordenserviciosFiltrados.map(Ordenservicios => {
      return {
        id: Ordenservicios.id,
        id_contenedor: Ordenservicios.id_contenedor,
        fecha_cargue: Ordenservicios.fecha_cargue,
        fecha_devolucion: Ordenservicios.fecha_devolucion,
        sitio: Ordenservicios.sitio,
        manifiesto: Ordenservicios.manifiesto,
        fecha_manifiesto: Ordenservicios.fecha_manifiesto,
        remesa: Ordenservicios.remesa,
        fecha_remesa: Ordenservicios.fecha_remesa,
        fecha_cita: Ordenservicios.fecha_cita,
        fecha_cliente: Ordenservicios.fecha_cliente,
        sitio_cargue_descargue: Ordenservicios.sitio_cargue_descargue,
        patio: Ordenservicios.patio
      };
    });

    gridOptions = {
      columnDefs: columnDefsOS,
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
          fetch(`https://esenttiapp-production.up.railway.app/api/ordenservicios/${id}`, {
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
              //console.log('Datos actualizados correctamente');
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

    const eGridDiv = document.getElementById('Ordenservicios');
    new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });
let gridOptions2;

const columnDefsC = [
  { headerName: "Id", field: "id", hide: false },
  { headerName: "ID S.S.", field: "id_solicitud_servicio", hide: false },
  { headerName: "Contenedor", field: "nu_serie" },
  { headerName: "Id Solicitud Servicio", field: "id_solicitud_servicio", hide: true },
  { headerName: "Id Tipo Contenedor", field: "id_tipo_contenedor" },
  { headerName: "Tara", field: "tara" },
  { headerName: "Payload", field: "payload" }
];

Promise.all([
  fetch("https://esenttiapp-production.up.railway.app/api/contenedores", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => response.json()),
  fetch("https://esenttiapp-production.up.railway.app/api/solicitudservicios", {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  }).then(response => response.json())
])
  .then(([contenedoresData, solicitudServiciosData]) => {

    // Filtrar solicitudServiciosData para obtener solo los registros con "inactivo" = 0 y "estado" = "ACEPTADO"
    const solicitudServiciosActivos = solicitudServiciosData.filter(solicitud =>
      solicitud.inactivo === 0 && solicitud.estado === 'ACEPTADO'
    );

    // Obtener los IDs de las solicitudes de servicio activas
    const idsSolicitudServiciosActivos = solicitudServiciosActivos.map(solicitud => solicitud.id);

    // Filtrar contenedoresData para incluir solo los contenedores con "id_solicitud_servicio" presente en idsSolicitudServiciosActivos
    const contenedoresFiltrados = contenedoresData.filter(contenedor => idsSolicitudServiciosActivos.includes(contenedor.id_solicitud_servicio));

    // Guardar los IDs en localStorage DESPUÉS de filtrar contenedoresData
    localStorage.setItem('contenedoresFiltradosIds', JSON.stringify(contenedoresFiltrados.map(contenedor => contenedor.id)));


    const processedData = contenedoresFiltrados.map(Contenedores => {
      return {
        id: Contenedores.id,
        nu_serie: Contenedores.nu_serie,
        id_solicitud_servicio: Contenedores.id_solicitud_servicio,
        id_tipo_contenedor: Contenedores.id_tipo_contenedor,
        tara: Contenedores.tara,
        payload: Contenedores.payload
      };
    });

    gridOptions2 = {
      columnDefs: columnDefsC,
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
          fetch(`https://esenttiapp-production.up.railway.app/api/contenedores/${id}`, {
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

    const eGridDiv = document.getElementById('Contenedores');
    new agGrid.Grid(eGridDiv, gridOptions2);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });
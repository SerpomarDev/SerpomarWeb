
let gridOptions1; 

const columnDefsSS = [
  { headerName: "id", field: "id", hide: false}, 
  { 
    headerName: "SP",
    field: "sp", // Puedes mantener este campo o usar uno nuevo si lo prefieres
    valueGetter: params => {
        return params.data.sp + params.data.id;
    },
    cellRenderer: params => {
        const cellValue = params.value; // Aquí cellValue ya tendrá el valor concatenado
        const button = document.createElement('a');
        button.textContent = cellValue; 
        button.style.cursor = 'pointer';
        button.style.color = '#6495ED';
        button.style.fontWeight = 'bold';
        button.onclick = () => showOrdenService(params.data.id);
        return button;
    }
  },
  { headerName: "DO", field: "do_pedido" },
  { headerName: "Pedido", field: "pedido" },
  { headerName: "# Contenedores", field: "cantidad_contenedor", hide: true },
  { headerName: "Cliente", field: "id_cliente" },
  { headerName: "Modalidad", field: "imp_exp" },
  { headerName: "Fecha Levante", field: "fecha_levante" },
  { headerName: "Fecha ETA", field: "fecha_eta" },
  { headerName: "Fecha Notificacion", field: "fecha_notificacion" },
  { headerName: "Fecha Documental", field: "fecha_documental" },
  { headerName: "Fecha Cutoff Fisico", field: "fecha_cutoff_fisico" },
  { headerName: "Producto", field: "observaciones" },
  { headerName: "Booking", field: "booking_number" },
  { headerName: "Libre Hasta", field: "libre_hasta" },
  { headerName: "Bodegaje Hasta", field: "bodegaje_hasta" },
  { headerName: "Naviera", field: "id_naviera" },
  { headerName: "Puerto", field: "puerto" },
  { headerName: "inactivo", field: "inactivo", hide: true},
  { headerName: "Estado", field: "estado", hide: true },
];

fetch("https://esenttiapp-production.up.railway.app/api/solicitudservicios", {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    // Filtrar los datos aquí
    const filteredData = data.filter(Solicitudservicios => Solicitudservicios.inactivo === 0 && Solicitudservicios.estado === 'ACEPTADO'); 

    const processedData = []; 

    filteredData.forEach(Solicitudservicios => {
      // Duplicar las filas según la cantidad de contenedores
      for (let i = 0; i < Solicitudservicios.cantidad_contenedor; i++) {
        processedData.push({
          id: Solicitudservicios.id, 
          id_cliente: Solicitudservicios.id_cliente,
          sp: Solicitudservicios.sp,
          do_pedido: Solicitudservicios.do_pedido,
          pedido: Solicitudservicios.pedido,
          cantidad_contenedor: Solicitudservicios.cantidad_contenedor, // Puedes mostrar el total o 1 si prefieres
          imp_exp: Solicitudservicios.imp_exp,
          fecha_levante: Solicitudservicios.fecha_levante,
          fecha_eta: Solicitudservicios.fecha_eta,
          fecha_notificacion: Solicitudservicios.fecha_notificacion,
          fecha_documental: Solicitudservicios.fecha_documental,
          fecha_cutoff_fisico: Solicitudservicios.fecha_cutoff_fisico,
          observaciones: Solicitudservicios.observaciones,
          booking_number: Solicitudservicios.booking_number,
          libre_hasta: Solicitudservicios.libre_hasta,
          bodegaje_hasta: Solicitudservicios.bodegaje_hasta,
          id_naviera: Solicitudservicios.id_naviera,
          puerto: Solicitudservicios.puerto,
          inactivo: Solicitudservicios.inactivo,
          estado: Solicitudservicios.estado,
        });
      }
    });

    gridOptions1 = {
      columnDefs: columnDefsSS,
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
          fetch(`https://esenttiapp-production.up.railway.app/api/solicitudservicios/${id}`, {
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

    const eGridDiv = document.getElementById('Solicitudservicios');
    new agGrid.Grid(eGridDiv, gridOptions1);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });

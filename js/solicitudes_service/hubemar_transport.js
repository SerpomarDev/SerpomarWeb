const columnDefs = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
    { headerName: "Fecha creación", field: "fecha"},
    { headerName: "id", field: "id_primario", hide: true },
    { headerName: "SP", field: "do_sp" },
    { headerName: "DO pedido", field: "do_pedido" },
    { headerName: "Pedido", field: "pedido" },
    { headerName: "Contenedores", field: "numero_contenedor" },
    { headerName: "Tipo servicio", field: "impexp" },
    { headerName: "Cliente", field: "cliente" },
    //  { 
    // headerName: "Acción", 
    // cellRenderer: params => {
    //     const link = document.createElement('a');
    //     link.href = '';
    //     link.onclick = function(e) {
    //         e.preventDefault();
    //         actualizarEstado([params.data.id_primario]);
    //     };

    //     const img = document.createElement('img');
    //     img.src = '/img/editar-texto.png';
    //     img.alt = 'Actualizar';
    //     img.style.width = '20px';
    //     img.style.height = '20px';
    //     link.appendChild(img);

    //     return link;
    // }
    // }
    {
      headerName: "Acción",
      cellRenderer: params => {
          return `
              <button class="py-2 mb-4 px-4 border rounded bg-blue-600" onclick="actualizarEstado()">Enviar</button>`;
      }
  }
];
fetch("https://esenttiapp-production.up.railway.app/api/showsolicitudservpro",{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const processedData = data.map(Preprogramar => {
      return {
        fecha: Preprogramar.fecha_creacion,
        id_primario: Preprogramar.id_primario,
        do_sp: Preprogramar.do_sp,
        do_pedido: Preprogramar.do_pedido,
        pedido: Preprogramar.pedido,
        numero_contenedor: Preprogramar.contenedor,
        impexp: Preprogramar.impexp,
        cliente: Preprogramar.cliente,
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
        },
        rowSelection: 'multiple',
        enableRangeSelection: true,
        suppressMultiRangeSelection:true,
        pagination: true,
        paginationPageSize: 20,
        rowData: processedData,
      };
      
      // Renderizar la tabla en el contenedor
        const eGridDiv = document.getElementById('ordenService');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
        console.error("Error al cargar los datos:", error);
    });


    function actualizarEstado() {
      const selectedNodes = gridOptions.api.getSelectedNodes();
      
      if (selectedNodes.length === 0) {
          Swal.fire({
              title: "Advertencia",
              text: "Debe seleccionar al menos un registro para actualizar.",
              icon: "warning"
          });
          return;
      }
  
      // Recopilar IDs de los registros seleccionados
      const payload = selectedNodes.map(node => node.data.id_primario);
  
      Swal.fire({
          title: "¿Estás seguro?",
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, procesar"
      }).then((result) => {
          if (result.isConfirmed) {
              
              fetch(`https://esenttiapp-production.up.railway.app/api/actualizarestado/${payload}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                  },
                  body: JSON.stringify({ ids: payload })
              })
              .then(response => {
                if (!response.ok) {
                    throw new Error('Error al procesar los registros');
                  }
                  Swal.fire({
                      title: "¡Procesado!",
                      text: "Registros procesados con éxito.",
                      icon: "success"
                  });
                      location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                      title: "¡Error!",
                      text: "Hubo un problema al procesar la solicitud.",
                      icon: "error"
                    });
                });
          }
      });
  }
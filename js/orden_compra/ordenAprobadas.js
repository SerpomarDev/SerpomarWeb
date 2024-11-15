const columnDefs = [
    { headerName: "OC", field: "id" },
    { headerName: "Nit", field: "nit" },
    { headerName: "Razón Social", field: "razon_social" },
    { headerName: "Valor", field: "valor" },
    { headerName: "Condición", field: "condicion" },
    { headerName: "Centro de Costo", field: "centro_costo" },
    { headerName: "Equipo", field: "equipo" },
    { headerName: "SP", field: "sp" },
    {
      headerName: "Soportes",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'upload-btn no-file';
            button.innerText = 'Ver Adjuntos';
            button.onclick = () => uploadId(params.data.id);
            return button;
        }
    },
  ];

  fetch("https://esenttiapp-production.up.railway.app/api/uploadordenaprobadas",{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const processedData = data.map(ordenCompra => {
      return {
        id: ordenCompra.id,
        nit: ordenCompra.nit,
        razon_social: ordenCompra.razon_social,
        valor: ordenCompra.valor,
        condicion: ordenCompra.condicion,
        centro_costo: ordenCompra.centro_costo,
        equipo: ordenCompra.equipo,
        sp: ordenCompra.sp,
      };
    });

    // Configurar la tabla con los datos procesados
    const gridOptions = {
      columnDefs: columnDefs,
      defaultColDef: {
        resizable: true,
        sortable: false,
        filter: "agTextColumnFilter",
        floatingFilter: true,
      },
      pagination: true,
      paginationPageSize: 20,
      rowData: processedData // Asignar los datos procesados
    };

    // Renderizar la tabla en el contenedor
      const eGridDiv = document.getElementById('ordenAprobadas');
      new agGrid.Grid(eGridDiv, gridOptions);
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });
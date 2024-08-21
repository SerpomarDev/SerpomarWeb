const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "Concepto", field: "concepto" },
    { headerName: "Valor", field: "valor" },

];

    fetch("https://esenttiapp-production.up.railway.app/api/uploadcostoclientes",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const processedData = data.map(costoClientes => {
        return {
          id: costoClientes.id,
          cliente: costoClientes.cliente,
          concepto: costoClientes.concepto,
          valor: costoClientes.valor,

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
          cellStyle: {
         'font-size': '14px',
         'color': '#333',
         'border-bottom': '1px solid #ddd'
        }
        },
        pagination: true,
        paginationPageSize: 7,
        rowData: processedData,
      };
  
        const eGridDiv = document.getElementById('tarifas_clientes_edit');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });
const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Cliente", field: "cliente" },
    { headerName: "Concepto", field: "concepto" },
    { headerName: "Valor", field: "valor" },


    {
        headerName: "Actualizar",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = '<i class="fas fa-edit"></i>';
            button.id = `btn-${params.data.id}`;
            button.addEventListener('click', () => editTarifaCliente(params.data.id));
            return button;
        }
    },
    {
        headerName: "Eliminar",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = '<i class="fas fa-trash-alt"></i>';
            button.addEventListener('click', () => deleteTarifaCliente(params.data.id));
            return button;
        }
    }
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
        getRowStyle: params => {
            if (params.node.rowIndex % 2 === 0) {
              return { background: '#f9f9f9' }; // Color para filas pares
            }
            return { background: '#ffffff' }; // Color para filas impares
          } 
      };
  
      // Renderizar la tabla en el contenedor
        const eGridDiv = document.getElementById('tarifas_clientes');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });

    function editTarifaCliente(id) {
      window.location.href = `/view/tarifas_clientes/edit.html?id=${id}`
    }
  
    function deleteTarifaCliente(id){
      DeleteData(id)
    }
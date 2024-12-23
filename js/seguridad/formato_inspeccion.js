// Define un componente para el encabezado
class MyHeaderComponent {
    init(params) {
      this.params = params;
      this.eGui = document.createElement('div');
      this.eGui.innerHTML = `
        <div style="white-space: normal; width: 320px;">${this.params.displayName}</div>
      `; // Ajusta el ancho (150px) según tus necesidades
    }
  
    getGui() {
      return this.eGui;
    }
  
    // Otros métodos del ciclo de vida del componente si son necesarios
  }
  
  const columnDefs = [
    { headerName: "ID", field: "id", hide: true }, 
    { headerName: "Fecha Inspección", field: "fecha_inspeccion" },
    { headerName: "Responsable", field: "responsable" },
    { 
      headerName: "Las puertas de acceso a las oficinas administrativas se les puede dar llave, candado o cerrojo.", 
      field: "item1_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent // Usa el componente personalizado
    },
    { headerName: "Obs.", field: "observaciones_item1" },
    { 
      headerName: "Todas las ventanas de la oficina administrativa tienen dispositivos de seguro interno.", 
      field: "item2_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item2" },
    { 
      headerName: "La puerta interna asegura al pasar llave impidiendo el ingreso desde la Recepción hacia las áreas administrativas.", 
      field: "item3_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item3" },
    { 
      headerName: "Existe señalización de prohibido el acceso a personal no autorizado.", 
      field: "item4_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item4" },
    { 
      headerName: "Cuenta con cámara del circuito cerrado de televisión (CCTV).", 
      field: "item5_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item5" },
    { 
      headerName: "Los DVR se encuentran aislados con una barrera que impida su manipulación de personas no autorizadas.", 
      field: "item6_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item6" },
    { 
      headerName: "Cuenta con minuta para el control de acceso del personal visitante.", 
      field: "item7_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item7" },
    { 
      headerName: "¿El sistema para asegurar internamente las puertas enrollables de las bodegas se encuentran en buen estado?", 
      field: "item8_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item8" },
    { 
      headerName: "¿El circuito cerrado de televisión (CCTV) ubicado en los muelles de la bodega se encuentra grabando a conformidad en cuanto a resolución y enfoque?", 
      field: "item9_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item9" },
    { 
      headerName: "¿El circuito cerrado de televisión (CCTV) ubicado en el interior de la bodega se encuentra grabando a conformidad en cuanto a resolución y enfoque?", 
      field: "item10_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item10" },
    { 
      headerName: "¿Las paredes y techos de las bodegas están asegurados?", 
      field: "item11_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item11" },
    { 
      headerName: "¿Los desagües cuentan con sus rejillas y éstas se encuentran en buen estado?", 
      field: "item12_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item12" },
    { 
      headerName: "¿Los baños se encuentran en condiciones de higiene y sanidad?", 
      field: "item13_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item13" },
    { 
      headerName: "¿Las puertas de acceso a las oficinas operativas cuentan con cerrojos acordes para asegurar debidamente las oficinas?", 
      field: "item14_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item14" },
    { 
      headerName: "¿Las mallas perimetrales están en buenas condiciones de seguridad, es decir, NO están rotas?", 
      field: "item15_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item15" },
    { 
      headerName: "¿El patio cuenta con iluminación y estas iluminan totalmente el área?", 
      field: "item16_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item16" },
    { 
      headerName: "¿El patio cuenta con cámaras (CCTV)?", 
      field: "item17_c", 
      cellRenderer: params => params.value ? 'Cumple' : 'No Cumple',
      headerComponent: MyHeaderComponent 
    },
    { headerName: "Obs.", field: "observaciones_item17" },
    { headerName: "Firma Responsable", field: "firma_responsable" } 
  ];
  
  const eGridDiv = document.getElementById('inspeccionFisica');
  
  const gridContainer = document.createElement('div');
  gridContainer.style.width = '100%';
  gridContainer.style.height = '100%';
  gridContainer.style.margin = '10px auto';
  eGridDiv.appendChild(gridContainer); 
  
  fetch("https://esenttiapp-production.up.railway.app/api/inspeccionFisica", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (Array.isArray(data) && data.length > 0) {
      const gridOptions = {
        columnDefs: columnDefs,
        defaultColDef: {
          resizable: true,
          sortable: false, 
          filter: "agTextColumnFilter",
          floatingFilter: true,
          flex: 1,
          minWidth: 100,
        },
        pagination: true,
        paginationPageSize: 15,
        rowData: data 
      };
  
      new agGrid.Grid(gridContainer, gridOptions); 
    } else {
      console.error("La respuesta del servidor no contiene datos válidos.");
      const gridOptions = {
        columnDefs: columnDefs,
        rowData: [] 
      };
  
      new agGrid.Grid(gridContainer, gridOptions);
    }
  })
  .catch(error => {
    console.error("Error al cargar los datos:", error);
  });
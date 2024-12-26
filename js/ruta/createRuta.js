// new gridjs.Grid({
//     search: true,
//     language:{
//         search:{
//             placeholder: '🔍 Buscar...'
//         }
//     },
//     pagination: {
//         limit:7,
//         enabled: true,
//     },
//     resizable: true,
//     sort: false,
//     columns: ["#","Nombre", "Tarifa",{
//         name:'Acciones',
//         columns:[{
//             name:'Actualizar',
//             formatter:(cell,row)=>{
//                 return gridjs.h('a', {
//                     href: '/view/rutas/edit.html',
//                     onclick: (e) => {
//                         e.preventDefault(); // Evita que el enlace se recargue la página
//                         editRuta(row.cells[0].data);
//                     }
//                 }, [
//                     // Imagen dentro del enlace
//                     gridjs.h('img', {
//                         src: '/img/editar-texto.png',
//                         alt: 'Actualizar',
//                         style: 'width: 20px; height: 20px;' 
//                     })
//                 ]);
//             }
//         },
//         {
//             name:'Eliminar',
//             formatter:(cell,row)=>{
//                 return gridjs.h('a', {
//                     href: '/view/rutas/create.html',
//                     onclick: (e) => {
//                         e.preventDefault(); // Evita que el enlace se recargue la página
//                         deleteRuta(row.cells[0].data);
//                     }
//                 }, [
//                     // Imagen dentro del enlace
//                     gridjs.h('img', {
//                         src: '/img/basura.png',
//                         alt: 'eliminar',
//                         style: 'width: 20px; height: 20px;' 
//                     })
//                 ]);
//             }
//         },
//     ],
//     }],
//     server: {
//         url: "https://esenttiapp-production.up.railway.app/api/uploadrutas",
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`
//         },
//         then: (data) => {
//             if (Array.isArray(data) && data.length > 0) {
//                 return data.map((ruta) => [
//                     ruta.id,
//                     ruta.item,
//                     ruta.tarifas,

//                 ]);
//             } else {
//                 console.error("La respuesta del servidor no contiene datos válidos.");
//                 return [];
//             }
//         }
//     }
// }).render(document.getElementById('rutas'));

const columnDefs = [
    { headerName: "ID", field: "id" },
    { headerName: "Cliente", field: "item" },
    { headerName: "Concepto", field: "tarifas" },


    {
        headerName: "Actualizar",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = '<i class="fas fa-edit"></i>';
            button.id = `btn-${params.data.id}`;
            button.addEventListener('click', () => editRuta(params.data.id));
            return button;
        }
    },
    {
        headerName: "Eliminar",
        cellRenderer: params => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary';
            button.innerHTML = '<i class="fas fa-trash-alt"></i>';
            button.addEventListener('click', () => deleteRuta(params.data.id));
            return button;
        }
    }
];

    fetch("https://esenttiapp-production.up.railway.app/api/uploadrutas",{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      })
      .then(response => response.json())
      .then(data => {
        const processedData = data.map(rutas => {
          return {
            id: rutas.id,
            item: rutas.item,
            tarifas: rutas.tarifas,
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
        paginationPageSize: 15,
        rowData: processedData,
        onFirstDataRendered: function(params) {
            params.api.sizeColumnsToFit();
          }, 
    };

    // Renderizar la tabla en el contenedor
    const eGridDiv = document.getElementById('rutas');
    new agGrid.Grid(eGridDiv, gridOptions);
      })
      .catch(error => {
        console.error("Error al cargar los datos:", error);
      });

  document.getElementById('createRuta').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('https://esenttiapp-production.up.railway.app/api/rutas', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
         },
        body: jsonData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos del formulario');
        }
    })
    .then(data => {
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "¡Has creado una ruta",
          icon: "success",
        });
        location.reload();
    })
    .then((response)=>{
     time();
    })
  });

  function time() {
    document.getElementById('createRuta').reset();
    setTimeout(() => {
        window.location.href = `/view/rutas/create.html`; 
    },  1200);
  }   

  function editRuta(id) {
    window.location.href = `/view/rutas/edit.html?id=${id}`
}

function deleteRuta(id){
    DeleteData(id)
}
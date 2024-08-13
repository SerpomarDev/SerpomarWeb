// Definir las columnas
const columnDefs = [
    { headerName: "#", field: "id_aliado" },
    { headerName: "Nombre", field: "nombre" },
    { headerName: "Razón Social", field: "razon_social" },
    { headerName: "Teléfono", field: "celular" },
    {
      headerName: "Acciones",
      cellRenderer: params => {
        const div = document.createElement('div');
  
        // Botón de Actualizar
        const updateButton = document.createElement('a');
        updateButton.href = '/view/aliados/edit.html';
        updateButton.onclick = function(e) {
          e.preventDefault();
          editAliado(params.data.id_aliado);
        };
        const updateImg = document.createElement('img');
        updateImg.src = '/img/editar-texto.png';
        updateImg.alt = 'Actualizar';
        updateImg.style.width = '20px';
        updateImg.style.height = '20px';
        updateButton.appendChild(updateImg);
  
        // Botón de Eliminar
        const deleteButton = document.createElement('a');
        deleteButton.href = '/view/aliados/create.html';
        deleteButton.onclick = function(e) {
          e.preventDefault();
          deleteAliado(params.data.id_aliado);
        };
        const deleteImg = document.createElement('img');
        deleteImg.src = '/img/basura.png';
        deleteImg.alt = 'Eliminar';
        deleteImg.style.width = '20px';
        deleteImg.style.height = '20px';
        deleteButton.appendChild(deleteImg);
  
        // Agregar botones al contenedor
        div.appendChild(updateButton);
        div.appendChild(deleteButton);
  
        return div;
      },

    }
  ];
  

    fetch("https://esenttiapp-production.up.railway.app/api/showaliado",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const processedData = data.map(aliado => {
        return {
          id_aliado: aliado.id_aliado,
          nombre: aliado.nombre,
          razon_social: aliado.razon_social,
          celular: aliado.celular,
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
        paginationPageSize: 7,
        rowData: processedData // Asignar los datos procesados
      };
  
      // Renderizar la tabla en el contenedor
        const eGridDiv = document.getElementById('aliado');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });


  document.getElementById('createAliado').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('https://esenttiapp-production.up.railway.app/api/aliados', {
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
          text: "¡Has creado un aliado",
          icon: "success",
        });
    })
    .then((response)=>{
     time();
    })
  });

  function time() {
    document.getElementById('createAliado').reset();
    setTimeout(() => {
        window.location.href = `/view/aliados/create.html`; 
    },  1200);
  }   

  function editAliado(id) {
  
    window.location.href = `/view/aliados/edit.html?id=${id}`
}

function deleteAliado(id){
    DeleteData(id)
}
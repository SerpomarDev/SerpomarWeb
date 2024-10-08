const columnDefs = [
    { headerName: "#", field: "id" },
    { headerName: "Nit", field: "nit" },
    { headerName: "Razón Social", field: "razon_social" },
    { headerName: "Descripcion", field: "descripcion" },
    {
      headerName: "Acciones",
      cellRenderer: params => {
        const div = document.createElement('div');
  
        // Botón de Actualizar
        const updateButton = document.createElement('a');
        updateButton.href = '/view/proveedores/edit.html';
        updateButton.onclick = function(e) {
          e.preventDefault();
          editProveedor(params.data.id);
        };
        const updateImg = document.createElement('img');
        updateImg.src = '/img/editar-texto.png';
        updateImg.alt = 'Actualizar';
        updateImg.style.width = '20px';
        updateImg.style.height = '20px';
        updateButton.appendChild(updateImg);
  
        // Botón de Eliminar
        const deleteButton = document.createElement('a');
        deleteButton.href = '/view/proveedores/create.html';
        deleteButton.onclick = function(e) {
          e.preventDefault();
          deleteProveedor(params.data.id);
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
  
    fetch("https://esenttiapp-production.up.railway.app/api/uploadproveedor",{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const processedData = data.map(proveedor => {
        return {
          id: proveedor.id,
          nit: proveedor.nit,
          razon_social: proveedor.razon_social,
          descripcion: proveedor.descripcion,
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
        const eGridDiv = document.getElementById('proveedores');
        new agGrid.Grid(eGridDiv, gridOptions);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });

    document.getElementById('createProveedor').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://esenttiapp-production.up.railway.app/api/proveedor', {
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
                text: "¡Has creado un Cliente",
                icon: "success",
            });
            setTimeout(() => {
                location.reload();
              }, 1500);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });


    function editProveedor(id) {
      window.location.href = `/view/proveedores/edit.html?id=${id}`
  }
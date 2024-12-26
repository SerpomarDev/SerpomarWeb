let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

    fetch(`https://esenttiapp-production.up.railway.app/api/uploadrutaid/${id}`,{
        method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                }
    })
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const ruta = data[0];
          document.getElementById("id").value = ruta.id;
          document.getElementById("item").value = ruta.item;
          document.getElementById("tarifas").value = ruta.tarifas;
          document.getElementById("notas").value = ruta.notas

      } else {
        console.log('La propiedad array no existe en la respuesta');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    
    const columnDefs = [
        { headerName: "ID", field: "id" },
        { headerName: "Ruta", field: "item" },
        { headerName: "Tarifas", field: "tarifas" },
    
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
              cellStyle: {
             'font-size': '14px',
             'color': '#333',
             'border-bottom': '1px solid #ddd'
            }
            },
            pagination: true,
            paginationPageSize: 15,
            rowData: processedData,
            onFirstDataRendered: function(params) {
              params.api.sizeColumnsToFit();
            },  
        };
            const eGridDiv = document.getElementById('editRutas');
            new agGrid.Grid(eGridDiv, gridOptions);
        })
        .catch(error => {
          console.error("Error al cargar los datos:", error);
        });

   
    document.getElementById("editRuta").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const jsonData = JSON.stringify(Object.fromEntries(formData));

            fetch(`https://esenttiapp-production.up.railway.app/api/rutas/${id}`, {
                method: "PUT",
                headers:{ 
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                        },
                body: jsonData,
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al enviar los datos del formulario");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Respuesta del servidor:", data);
                Swal.fire({
                    title: "¡Buen trabajo!",
                    text: "Has actualizado un conductor.",
                    icon: "success",
                });
            })
            .then(response=>{
                time()
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });

    function time() {
        document.getElementById('editRuta').reset();
        setTimeout(() => {
          window.location.href = `/view/rutas/create.html`;  
        },  1500);
      }
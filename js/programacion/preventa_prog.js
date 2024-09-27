
 showPreventa()

 function showPreventa(){
    new gridjs.Grid({
        search:true,
        language:{
            search:{
                placeholder: '🔍 Buscar...'
            }
        },
        sort: false,
        columns: [{
            name: "#",
            hidden: true
        },"Placa",
      ],
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/selectbyinac",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((preventa) => [
                      preventa.id,
                      preventa.placa
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        },
        style: {
          table: {with:"80%"}
        }
    }).render(document.getElementById('preventas'));
 }
 
 localStorage.setItem("authToken", data.token);

function editPreventa(id) {
    window.location.href = `/view/preventas/edit.html?id=${id}`
}

function CrearPreventa() {
    window.location.href = `../preventas/create`;
}

function asignarPreventa(id){
    window.location.href = `/view/asignacion/asignacion.html?id=${id}`
}

function deleteD(id){
    DeleteData(id)
}

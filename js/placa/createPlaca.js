new gridjs.Grid({
    search: true,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit:10,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [{
        name:'id',
        hidden: true,
    },"Placa", "Eje", "Tipologia", "Propietario",{
        name:'Telefono',
        hidden: true,
    },{
        name:'Accion',
        columns:[{
            name:'Actualizar',
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/Placa/edit.html',
                    onclick: (e) => {
                        e.preventDefault();
                        editPlaca(row.cells[0].data);
                    }
                },[
                    // Imagen dentro del enlace
                    gridjs.h('img', {
                        src: '/img/editar-texto.png',
                        alt: 'Actualizar',
                        style: 'width: 20px; height: 20px;' 
                    })
                ]);
            },
        },
        {
        name:'Eliminar',
        formatter:(cell,row)=>{
            return gridjs.h('a', {
                href: '/view/Placa/create.html',
                onclick: (e) => {
                    e.preventDefault();
                 deletePlaca(row.cells[0].data);
                }
            },[
                // Imagen dentro del enlace
                gridjs.h('img', {
                    src: '/img/basura.png',
                    alt: 'eliminar',
                    style: 'width: 20px; height: 20px;' 
                })
            ]);
        },
    }],
        
    }],
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showplaca",
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((placa) => [
                    placa.id_placa,
                    placa.placa,
                    placa.eje,
                    placa.tipologia,
                    placa.nombre,
                    placa.telefono
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('Placa'));


document.getElementById('createPlaca').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('https://esenttiapp-production.up.railway.app/api/placas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          text: "Has Creado una Placa.",
          icon: "success",
        });
    })
    .then((response)=>{
     time();
    })
  });

  function time() {
    document.getElementById('createPlaca').reset();
    setTimeout(() => {
        window.location.href = `/view/placa/create.html`; 
    },  1200);
  }

function editPlaca(id) {
  
    window.location.href = `/view/placa/edit.html?id=${id}`
}


function deletePlaca(id){
DeleteData(id)
}
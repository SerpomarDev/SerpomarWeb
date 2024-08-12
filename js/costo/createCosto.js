new gridjs.Grid({
    search: true,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit:7,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: ["#","Valor",{
        name:'Acciones',
        columns:[{
            name:'Actualizar',
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/costos/edit.html',
                    onclick: (e) => {
                        e.preventDefault();
                        editCosto(row.cells[0].data);
                    }
                }, [
                    // Imagen dentro del enlace
                    gridjs.h('img', {
                        src: '/img/editar-texto.png',
                        alt: 'Actualizar',
                        style: 'width: 20px; height: 20px;' 
                    })
                ]);
            }
        },
        {
            name:'Eliminar',
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/costos/create.html',
                    onclick: (e) => {
                        e.preventDefault();
                        deleteCosto(row.cells[0].data);
                    }
                }, [
                    // Imagen dentro del enlace
                    gridjs.h('img', {
                        src: '/img/basura.png',
                        alt: 'eliminar',
                        style: 'width: 20px; height: 20px;' 
                    })
                ]);
            }
        },
    ],
    }],
    server: {
        url: "http://esenttiapp.test/api/showcostos",
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((costo) => [
                    costo.id,
                    costo.valor,
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('costo'));


  document.getElementById('createCosto').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('http://esenttiapp.test/api/costos', {
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
          text: "¡Has creado un costo",
          icon: "success",
        });
    })
    .then((response)=>{
     time();
    })
  });

  function time() {
    document.getElementById('createCosto').reset();
    setTimeout(() => {
        location.reload();
    },  1200);
  }   

  function editCosto(id) {
  
    window.location.href = `/view/costos/edit.html?id=${id}`
}

function deleteCosto(id){
    DeleteData(id)
}
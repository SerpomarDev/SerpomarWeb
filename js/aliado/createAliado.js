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
    columns: ["#","Nombre", "Razon social","Telefono",{
        name:'Acciones',
        columns:[{
            name:'Actualizar',
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/aliados/edit.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        editAliado(row.cells[0].data);
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
                    href: '/view/aliados/create.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        deleteAliado(row.cells[0].data);
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
        url: "https://esenttiapp-production.up.railway.app/api/showaliado",
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((aliado) => [
                    aliado.id_aliado,
                    aliado.nombre,
                    aliado.razon_social,
                    aliado.celular

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('aliado'));


  document.getElementById('createAliado').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('https://esenttiapp-production.up.railway.app/api/aliados', {
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
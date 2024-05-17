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
    columns: ["#","Nombre", "Nit","Dirección","Ciudad",{
        name:'Acciones',
        columns:[{
            name:'Actualizar',
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/cliente/edit.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        editCliente(row.cells[0].data);
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
                    href: '/view/cliente/create.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        deleteCliente(row.cells[0].data);
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
        url: "https://esenttiapp-production.up.railway.app/api/showclientes",
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((cliente) => [
                    cliente.id,
                    cliente.nombre,
                    cliente.identificacion,
                    cliente.direccion,
                    cliente.ciudad

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('cliente'));


document.getElementById('createCliente').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('https://esenttiapp-production.up.railway.app/api/clientes', {
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
          text: "¡Has creado un Cliente",
          icon: "success",
        });
    })
    .then((response)=>{
     time();
    })
  });

  function time() {
    document.getElementById('createCliente').reset();
    setTimeout(() => {
        window.location.href = `/view/cliente/create.html`; 
    },  1200);
  }   

  function editCliente(id) {
  
    window.location.href = `/view/cliente/edit.html?id=${id}`
}

function deleteCliente(id){
    DeleteData(id)
}
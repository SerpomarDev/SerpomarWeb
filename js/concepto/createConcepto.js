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
    columns: ["#","Concepto", "Descripción",{
        name:'Acciones',
        columns:[{
            name:'Actualizar',
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/conceptos/edit.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        editRuta(row.cells[0].data);
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
                    href: '/view/conceptos/create.html',
                    onclick: (e) => {
                        e.preventDefault(); // Evita que el enlace se recargue la página
                        deleteConcepto(row.cells[0].data);
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
        url: "http://esenttiapp.test/api/uploadconceptos",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((ruta) => [
                    ruta.id,
                    ruta.concepto,
                    ruta.descripcion,

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('conceptos'));

  document.getElementById('createConcepto').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
  
    const jsonData = JSON.stringify(Object.fromEntries(formData));
    
    fetch('http://esenttiapp.test/api/concepto', {
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
    document.getElementById('createConcepto').reset();
    setTimeout(() => {
        window.location.href = `/view/conceptos/create.html`; 
    },  1200);
  }   

  function editRuta(id) {
    window.location.href = `/view/conceptos/edit.html?id=${id}`
}

function deleteConcepto(id){
    DeleteData(id)
}
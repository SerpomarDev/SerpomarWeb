
new gridjs.Grid({
    search: true,
    language:{
        search:{
            placeholder: '🔍 Buscar...'
        }
    },
    pagination: {
        limit:30,
        enabled: true,
    },
    resizable: true,
    sort: false,
    columns: [
        {
            name:"#",
            hidden:true,
        },{
            name:'SP',
            attributes: (cell,row)=>{
            if(cell){
                return{
                  'data-cell-content': cell,
                  onclick:()=>showOrdenService(row.cells[0].data),
                  'style': 'cursor: pointer; color: #6495ED;  font-weight: bold;',
                }
            }
        }
    }, "DO pedido","Pedido","Contendores","Tipo Transporte","Cliente","Fecha entrada",{
        name:'Acciones',
        hidden:true,
        columns:[{
            name:'Actualizar',
            hidden:true,
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '',
                    onclick: (e) => {
                        e.preventDefault();
                        editRuta(row.cells[0].data);
                    }
                }, [
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
            hidden:true,
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/rutas/create.html',
                    onclick: (e) => {
                        e.preventDefault();
                        deleteRuta(row.cells[0].data);
                    }
                }, [
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
    // sort: true,
    server: {
        url: "https://esenttiapp-production.up.railway.app/api/showsolicitudserv",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((soliserv) => [
                    soliserv.id_primario,
                    soliserv.do_sp,
                    soliserv.do_pedido,
                    soliserv.pedido,
                    soliserv.contenedor,
                    soliserv.impexp,
                    soliserv.cliente,
                    soliserv.fecha_actualizacion,

                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    }
}).render(document.getElementById('ordenService'));

localStorage.setItem("authToken", data.token);

function showOrdenService(id){
    window.location.href = `/view/contenedor/create.html?id=${id}`
}

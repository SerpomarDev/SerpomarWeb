let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

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
        // sort: false,
        columns: [{
            name:'id',
            hidden: true,
            },"SP","Cantidad contenedor", "Tipo operación", "Fecha eta", "Fecha levante","Fecha documental","Fecha cutoff fisico","Libre hasta","Bodegaje hasta","Fecha propuesta",{
         
                name:'Actualizar',
                formatter:(cell,row)=>{
                    return gridjs.h('a', {
                        href: '/view/solicitudes_servicios/edit.html',
                        onclick: (e) => {
                            e.preventDefault();
                            editSoliServi(row.cells[0].data);
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
            hidden:true,
            formatter:(cell,row)=>{
                return gridjs.h('a', {
                    href: '/view/',
                    onclick: (e) => {
                        e.preventDefault();
                     deleteSoliServi(row.cells[0].data);
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
            
        server: {
            url: "https://esenttiapp-production.up.railway.app/api/showeditsolicitud",
            then: (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    return data.map((solic) => [
                        solic.pk,
                        solic.do_sp,
                        solic.cantidad_contenedores,
                        solic.tipo_operacion,
                        solic.fecha_eta,
                        solic.fecha_levante,
                        solic.fecha_documental,
                        solic.fecha_cutoff_fisico,
                        solic.libre_hasta,
                        solic.bodegaje_hasta,
                        solic.fecha_propuesta
                    ]);
                } else {
                    console.error("La respuesta del servidor no contiene datos válidos.");
                    return [];
                }
            }
        }
    }).render(document.getElementById('editSoli'));


    function editSoliServi(id){
         window.location.href = `/view/solicitudes_servicios/edit.html?id=${id}`
    }
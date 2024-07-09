new gridjs.Grid({
    search: true,
    language:{
      search:{
          placeholder: '🔍 Buscar...'
      }
    },
    pagination: {
        limit:5,
        enabled: false,
        //summary: true
    },
    sort: false,
    columns: [
    "Fecha","SP","Contenedor","Placa","Aliado",{
        name:"Tarifa",
        formatter:(_,row)=> `$ ${(row.cells[5].data).toLocaleString()}`
    },"Ruta","Nombre","Estado",{
    name:'Soportes',
    hidden:false,
      formatter:(cell,row)=>{
        return gridjs.html(`
            <input type="file" data-row-index="${row.index}" multiple onchange="handleFileUpload(event)"/>
            `);
      }
  },{
    name:"enviar",
    formatter:(cell,row)=>{
        return gridjs.h('button',{
          className: 'py-2 mb-4 px-4 border rounded bg-blue-600',
          onClick: () => editAsignacion()
        },'enviar')
      }
  }],
    fixedHeader: true,
    //height: '400px',
    server: {
        url: `https://esenttiapp-production.up.railway.app/api/controlasignaciones`,
        then: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                return data.map((asigControl) => [
                  asigControl.fecha,
                  asigControl.do_sp,
                  asigControl.numero_contenedor,
                  asigControl.placa,
                  asigControl.aliado,
                  asigControl.tarifa,
                  asigControl.ruta,
                  asigControl.nombre,
                  asigControl.estado,
                  asigControl.adjunto,
                ]);
            } else {
                console.error("La respuesta del servidor no contiene datos válidos.");
                return [];
            }
        }
    },
    resizable: true,
    style: {
      table: {with:"80%"}
    }
}).render(document.getElementById('controlAsig'));



function handleFileUpload(event) {
    
    const files = event.target.files;
    const rowIndex = event.target.getAttribute('data-row-index');
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }

    formData.append('rowIndex', rowIndex);

    // Enviar los archivos al servidor
    // fetch('/upload-endpoint', {
    //     method: 'PUT',
    //     body: formData
    // }).then(response => response.json())
    //   .then(data => {
    //       console.log('Success:', data);
    //   }).catch((error) => {
    //       console.error('Error:', error);
    //   });
}
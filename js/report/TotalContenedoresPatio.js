document.addEventListener('DOMContentLoaded',()=>{

    const selector = document.getElementById('reporteSelector');

    selector.addEventListener('change',function(event){

        const selectedValue = selector.value;
        let endpoint = '';

        switch(selectedValue){
            
            case 'endpointone':
                endpoint = 'https://esenttiapp-production.up.railway.app/api/exceltotalcontenedores';
                break;

            case 'endpointtwo':
                endpoint = 'https://esenttiapp-production.up.railway.app/api/excelinventariocontenedores';
                break;

            default:
                console.error('Opción no válida');
                return;
        }

        selector.disabled = true;

    fetch(endpoint)
    .then(response=>{
        if(!response.ok){
            throw new Error('Error al obtener los datos de la API');
        }
        return response.blob()
    })
    .then((blob)=>{
        // Crear un objeto URL a partir del blob
        const url = window.URL.createObjectURL(blob);
    
        // Crear un enlace <a> para descargar el reporte
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventario.xlsx';
    
        // Agregar el enlace al documento y hacer clic en él para descargar el reporte
        document.body.appendChild(a);
        a.click();

        Swal.fire({
            title: "¡Buen trabajo!",
            text: "Su reporte se ha sido creado!",
            icon: "success"
        });
        
        // Limpiar el objeto URL y remover el enlace del documento
        window.URL.revokeObjectURL(url);
        a.remove();

         selector.value = "";
    })
    .catch((error)=>{
        console.error("Error", error)
    })
    .finally(() => {
        // Volver a habilitar el select
        selector.disabled = false;
    });

  })
})

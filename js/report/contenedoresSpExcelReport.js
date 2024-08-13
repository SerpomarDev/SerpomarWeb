let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

document.getElementById('GeneReportExcelContenedor').addEventListener('click', function(event){
    event.preventDefault();

    fetch(`https://esenttiapp-production.up.railway.app/api/contenedoressp/${id}`,{
        method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
    })
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
        a.download = 'ContendoresSp.xlsx';
    
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
    })
    .catch((error)=>{
        console.error("Error", error)
    })
})
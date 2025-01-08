document.getElementById('ReportByFecha').addEventListener('click', function(event){
    event.preventDefault();

    let cliente = document.getElementById('id_cliente').value
    let fechaInicial = document.getElementById('fecha_inicial').value
    let fechaFinal = document.getElementById('fecha_final').value

    if (fechaInicial && fechaFinal) {
        fetch(`https://esenttiapp-production.up.railway.app/api/excelcontenedorbyfecha/${cliente}/${fechaInicial}/${fechaFinal}`,{
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
            a.download = 'Reporte_Contenedor.xlsx';
        
            // Agregar el enlace al documento y hacer clic en él para descargar el reporte
            document.body.appendChild(a);
            a.click();

            Swal.fire({
                title: "¡Buen trabajo!",
                text: "Su reporte se ha sido creado!",
                icon: "success"
            });
            setTimeout(() => {
                location.reload();
              }, 1500);
            
            // Limpiar el objeto URL y remover el enlace del documento
            window.URL.revokeObjectURL(url);
            a.remove();
        })
        .catch((error)=>{
            console.error("Error", error)
        })
    }else{

        Swal.fire({
            title: "Error",
            text: "Por favor seleccione ambas fechas.",
            icon: "error"
        });
    }
})
function excelCostoAfiliado(payload) {
    fetch('https://esenttiapp-production.up.railway.app/api/costoafiliado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'costo_afiliado.xlsx';
        document.body.appendChild(a);
        a.click();
  
        Swal.fire({
            title: "¡Buen trabajo!",
            text: "Su reporte se ha sido creado!",
            icon: "success"
        });
        setTimeout(() => {
        }, 1500);
  
        window.URL.revokeObjectURL(url);
        a.remove();
    })
    .catch(error => {
        console.error("Error", error);
    });
  }
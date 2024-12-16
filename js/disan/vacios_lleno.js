fetch('https://esenttiapp-production.up.railway.app/api/cargarinventario', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(response => response.json())
  .then(data => {
    const totalVacios = data.filter(item => 
      item.cliente === "DISAN COLOMBIA S.A.S" && 
      item.modalidad === "IMPORTACION" && 
      item.lleno_vacio === "VACIO"
    ).length;

    const totalLlenos = data.filter(item => 
      item.cliente === "DISAN COLOMBIA S.A.S" && 
      item.modalidad === "IMPORTACION" && 
      item.lleno_vacio === "LLENO"
    ).length;

    document.getElementById('total-vacios').textContent = totalVacios;
    document.getElementById('total-llenos').textContent = totalLlenos;
  })
  .catch(error => console.error('Error al obtener los datos:', error));
document.addEventListener('DOMContentLoaded', () => {
  function fetchData(url, elementId) {
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then(data => {
          // Mostrar "Total llenos:" junto con la cantidad
          if (elementId === "arclad-lleno") {
            document.getElementById(elementId).textContent = "Patio Llenos: " + data.length;
          } else {
            document.getElementById(elementId).textContent = "Patio Vacios: " + data.length;
          }
        })
        .catch(error => {
          console.error("Error al obtener datos:", error);
          // Manejar el error, por ejemplo, mostrar un mensaje al usuario
          document.getElementById(elementId).textContent = "Error al cargar datos";
        });
    }
  

  // Llamar a la función para obtener los datos de "arclad-lleno"
  fetchData("https://esenttiapp-production.up.railway.app/api/arcladlleno", "arclad-lleno");
  fetchData("https://esenttiapp-production.up.railway.app/api/arcladvacio", "arclad-vacio"); 
});
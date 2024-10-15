// const endpoint = "https://sertrack-production.up.railway.app/api/planeacion";

// async function fetchData() {
//   const authToken = localStorage.getItem("authToken");

//   if (!authToken) {
//     console.error("Error de autenticación: Token no encontrado.");
//     mostrarError("Error de autenticación");
//     return;
//   }

//   try {
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${authToken}`
//       }
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Error en la solicitud:", response.status, errorData);
//       mostrarError(`Error en la solicitud: ${response.status} - ${errorData.message}`);
//       return;
//     }

//   } catch (error) {
//     console.error("Error al obtener los datos:", error);
//     mostrarError("Error al obtener datos");
//   }
// }


// async function fetchData() {
//   const authToken = localStorage.getItem("authToken");

//   if (!authToken) {
//     console.error("Error de autenticación: Token no encontrado.");
//     mostrarError("Error de autenticación");
//     return;
//   }

//   try {
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${authToken}`
//       }
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Error en la solicitud:", response.status, errorData);
//       mostrarError(`Error en la solicitud: ${response.status} - ${errorData.message}`);
//       return;
//     }

//     const data = await response.json(); 
//     const estadoOperacionCounts = {};

//     // Contar las ocurrencias de cada estado_operacion
//     data.forEach(item => {
//       const estado = item.estado_operacion;
//       estadoOperacionCounts[estado] = (estadoOperacionCounts[estado] || 0) + 1;
//     });

//     // Preparar los datos para el gráfico
//     const labels = Object.keys(estadoOperacionCounts);
//     const values = Object.values(estadoOperacionCounts);

//     // Crear el gráfico de barras
//     const ctx = document.getElementById('estado-operacion').getContext('2d');
//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: labels,
//         datasets: [{
//           label: 'Total por estado_operacion',
//           data: values,
//           backgroundColor: 'rgba(54, 162, 235, 0.2)',
//           borderColor: 'rgba(54, 162, 235, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,

//             precision: 0 // Para mostrar solo números enteros en el eje Y
//           }
//         }
//       }
//     });

//   } catch (error) {
//     console.error("Error al obtener los datos:", error);
//     mostrarError("Error al obtener datos");
//   }
// }


// fetchData();
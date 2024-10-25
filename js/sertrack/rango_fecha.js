
fetch('https://sertrack-production.up.railway.app/api/intervalfifteenday')
  .then(response => response.json())
  .then(data => {
    generarGraficoTotalPorFecha(data);
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });

function generarGraficoTotalPorFecha(data) {
  const ctx = document.getElementById('dias-total-programa').getContext('2d');

  // Agrupar los datos por fecha y contar los IDs
  const conteoPorFecha = {};
  data.forEach(elemento => {
    const fecha = elemento.fecha_global;
    conteoPorFecha[fecha] = (conteoPorFecha[fecha] || 0) + 1;
  });

  // Preparar los datos para el gráfico
  const labels = Object.keys(conteoPorFecha);
  const values = Object.values(conteoPorFecha);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Conteo de IDs', // Cambiado a "Conteo de IDs"
        data: values,
        backgroundColor: ['#1e90ff', '#00bfff'],
        borderColor: ['#00bfff', '#1e90ff'],
        borderWidth: 1,
        borderRadius: 10,
        borderSkipped: false
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false,
          position: 'top',
          labels: {
            color: '#496ecc',
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return "Total de IDs: " + tooltipItem.raw; // Cambiado a "Total de IDs"
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#3e4954',
            font: {
              size: 8,
              family: 'poppins',
              weight: 400
            },
            autoSkip: false,
            maxRotation: 40,
            minRotation: 40
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#496ecc',
            font: {
              size: 13,
              family: 'poppins',
              weight: 400
            }
          },
          grid: {
            color: '#eee'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
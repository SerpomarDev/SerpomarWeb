document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('navieras').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [], // Aquí irán las navieras
        datasets: [{
          label: 'Cantidad de Contenedores',
          data: [], // Aquí irá la cantidad de contenedores por naviera
          backgroundColor: [
            '#00bfff', // Puedes personalizar los colores
            '#1e90ff'  // Puedes agregar más colores si hay más navieras
          ],
          borderColor: [
            '#1e90ff',
            '#00bfff'
          ],
          borderWidth: 1,
          borderRadius: 12
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: '#3e4954',
              font: {
                size: 13,
                family: 'poppins',
                weight: 400
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#3e4954',
              font: {
                size: 13,
                family: 'poppins',
                weight: 400
              }
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Cantidad por Naviera',
            font: {
              size: 18,
              weight: 'bold',
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
            },
            padding: {
              top: 0,
              bottom: 20
            }
          },
          legend: {
            display: false,
            position: 'top',
            align: 'end',
            labels: {
              color: '#000000',
              font: {
                size: 12
              },
              usePointStyle: true,
              pointStyleWidth: 18
            },
  
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Total ' + context.raw;
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  
    fetch('https://esenttiapp-production.up.railway.app/api/ahorrobycliente', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      })
      .then(response => response.json())
      .then(data => {
        // Filtrar los datos
        const filteredData = data.data.filter(item =>
          item.cliente === "ESENTTIA S A" &&
          item.modalidad === "EXPORTACION" &&
          item.lleno === "LLENO"
        );
  
        // Contar la cantidad de contenedores por naviera
        const navieraCounts = {};
        filteredData.forEach(item => {
          const naviera = item.naviera;
          navieraCounts[naviera] = (navieraCounts[naviera] || 0) + 1;
        });
  
        // Actualizar los datos del gráfico
        myChart.data.labels = Object.keys(navieraCounts); // Navieras en las etiquetas
        myChart.data.datasets[0].data = Object.values(navieraCounts); // Cantidades en los datos
        myChart.update(); // Actualizar el gráfico
      })
      .catch(error => console.error('Error fetching data:', error));
  });
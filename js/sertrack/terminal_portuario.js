document.addEventListener('DOMContentLoaded', function() {
  generarGraficoEstadoPrograma(); 

  function generarGraficoEstadoPrograma() {
    fetch('https://sertrack-production.up.railway.app/api/lineanaviera')
      .then(response => response.json())
      .then(data => {
        // Preparar datos para el gráfico
        const labels = data.map(item => item.linea_naviera);
        const valores = data.map(item => item.total_patio_retiro);

        // Crear gradientes para las barras
        const ctx = document.getElementById('grafico-puerto-ingreso').getContext('2d');
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient1.addColorStop(0, '#00bfff');
        gradient1.addColorStop(1, '#87cefa');

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient2.addColorStop(0, '#87cefa');
        gradient2.addColorStop(1, '#4682b4');

        const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
        gradient3.addColorStop(0, '#4682b4');
        gradient3.addColorStop(1, '#1e90ff');

        // Asignar los gradientes a las barras
        const backgroundColor = [];
        for (let i = 0; i < valores.length; i++) {
          switch (i % 3) {
            case 0: backgroundColor.push(gradient1); break;
            case 1: backgroundColor.push(gradient2); break;
            case 2: backgroundColor.push(gradient3); break;
          }
        }

        // Crear gráfico con Chart.js
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Estado del programa',
              data: valores,
              backgroundColor: backgroundColor,
              borderColor: 'transparent', // Sin borde para que se vea el gradiente
              borderWidth: 0,
              borderRadius: 15,
              barPercentage: 0.7,
              categoryPercentage: 0.6
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  display: false
                },
                ticks: {
                  stepSize: 1  // <-- Aquí se configura el incremento en 1
                }
              },
              y: {
                beginAtZero: true,
                precision: 0,
                grid: {
                  color: '#e0e0e0',
                  borderDash: [3, 3]
                }
              }
            }
          }
        });
      });
  }
});
 // Generar gráficos
 const ctxLineChart = document.getElementById('lineChart').getContext('2d');
 const lineChart = new Chart(ctxLineChart, {
     type: 'line',
     data: {
         labels: ['INDEGA', 'KENWORTH', 'ESENTTIA', 'ETEX', 'ARCLAD', 'SYNGENTA', 'QCA & SYRUS', 'EUROFERT', 'PLASTIMIX', 'MANTOSCORP', 'G. N. LOGISTICS', 'BDP', 'HUBEMAR', 'GRUPOAQUA'],
         datasets: [{
             label: 'Ingresos ($M)',
             data: [420, 163, 154, 73, 53, 42, 31, 9, 8, 2, 2, 2, 1, 1],
             backgroundColor: [
                '#00bfff',
                '#1e90ff'
            ],
            borderColor: [
                '#1e90ff',
                '#00bfff'
            ],
            borderWidth: 1,
            borderRadius: 12,
             tension: 0.3,
             fill: false,
             pointBackgroundColor: '#1e90ff',
             pointRadius: 5,
             pointHoverRadius: 7,
         }]
     },
     options: {
         scales: {
             y: {
                 beginAtZero: true,
                 title: {
                     display: true,
                     text: 'Ingresos ($M)'
                 },
                 ticks: {
                     callback: function (value) {
                         return '$' + value + 'M';
                     }
                 }
             },
             x: {
                 title: {
                     display: true,
                     text: 'Clientes'
                 },
                 ticks: {
                     maxRotation: 90,
                     minRotation: 45
                 }
             }
         },
         plugins: {
            title: {
                display: true,
                text: 'Clientes',
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
                 display: false
             },
             tooltip: {
                 callbacks: {
                     label: function (context) {
                         return `Ingresos: $${context.parsed.y}M`;
                     }
                 }
             }
         }
     }
 });
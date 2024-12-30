document.addEventListener('DOMContentLoaded', function() {
    // Obtener la fecha seleccionada de localStorage, o usar la fecha actual si no hay ninguna
    const fechaSeleccionada = localStorage.getItem('fechaSeleccionada') || moment().format('YYYY-MM-DD');

    // Actualizar el calendario con la fecha seleccionada
    const calendario = document.querySelector('.calendar');
    calendario.value = fechaSeleccionada;

    let miGrafico; // Variable para guardar la instancia del gráfico

    generarGraficoEstadoOperacion(fechaSeleccionada); // Pasar la fecha a la función

    calendario.addEventListener('change', () => {
        const nuevaFechaSeleccionada = calendario.value;
        localStorage.setItem('fechaSeleccionada', nuevaFechaSeleccionada);
        generarGraficoEstadoOperacion(nuevaFechaSeleccionada); // Actualizar el gráfico
    });

    function generarGraficoEstadoOperacion(fecha) { // Recibir la fecha como parámetro
        fetch('https://esenttiapp-production.up.railway.app/api/registroestadistico', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Filtrar datos por cliente, modalidad, fecha y que no sean nulos
            const datosFiltrados = data.filter(item => 
                item.cliente === "ESENTTIA S A" && 
                item.modalidad === "importacion" && 
                item.puerto !== null &&
                moment(item.fecha_cita).format('YYYY-MM-DD') === fecha // Usar la fecha del parámetro
            );

            // Contar la cantidad de estados de operación (usando puerto)
            const conteoEstados = {};
            datosFiltrados.forEach(item => {
                conteoEstados[item.puerto] = (conteoEstados[item.puerto] || 0) + 1;
            });

            // Obtener las etiquetas y valores para el gráfico
            const labels = Object.keys(conteoEstados);
            const valores = Object.values(conteoEstados);

            // Crear gradientes para las barras
            const ctx = document.getElementById('terminal-retiro').getContext('2d');
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

            // Destruir el gráfico anterior si existe
            if (miGrafico) {
                miGrafico.destroy();
            }

            // Crear gráfico con Chart.js
            miGrafico = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cantidad de estados',
                        data: valores,
                        backgroundColor: backgroundColor,
                        borderColor: 'transparent', 
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
                                stepSize: 1 
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

        })
        .catch(error => {
            console.error("Error al obtener o procesar los datos:", error);
        });
    }
});
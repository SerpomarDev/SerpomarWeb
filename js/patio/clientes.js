window.onload = function() {
    // Obtener los datos de la API


        fetch("https://esenttiapp-production.up.railway.app/api/cargarinventario",{
            method: 'GET',
                headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                }
        })
        .then(response => response.json())
        .then(data => {
            // Contar importaciones, exportaciones y traslados
            let importaciones = data.filter(item => item.modalidad === "IMPORTACION").length;
            let exportaciones = data.filter(item => item.modalidad === "EXPORTACION").length;
            let traslados = data.filter(item => item.modalidad === "TRASLADO").length;

            // Crear el gráfico
            const ctx = document.getElementById('impoexpoChart').getContext('2d');

            // Crear gradientes para las barras
            const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient1.addColorStop(0, '#87cefa');
            gradient1.addColorStop(1, '#87cefa');

            const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient2.addColorStop(0, '#00bfff');
            gradient2.addColorStop(1, '#87cefa');

            const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient3.addColorStop(0, '#4682b4');
            gradient3.addColorStop(1, '#1e90ff');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Impo', 'Expo', 'Traslado'],
                    datasets: [{
                        label: '',
                        data: [importaciones, exportaciones, traslados],
                        backgroundColor: [
                            gradient1,
                            gradient2,
                            gradient3
                        ],
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 15,
                        barPercentage: 0.7,
                        categoryPercentage: 0.6
                    }]
                },
                options: {
                    indexAxis: 'x', // Barras verticales
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                color: '#fff',
                                display: true,
                                text: 'Cantidad',
                                font: {

                                    size: 14,
                                    weight: 'bold',
                                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                                }
                            },
                            ticks: {
                                color: '#fff',
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: '#fff',
                                borderDash: [3, 3]
                            }
                        },
                        y: {
                            grid: {
                                display: false // Ocultar líneas de cuadrícula verticales
                            },
                            ticks: {
                                color: '#fff',
                                font: {

                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed.y}`; // Mostrar valor correcto
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: '',
                            font: {
                                size: 18,
                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                            },
                            padding: {
                                top: 0,
                                bottom: 20
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));




        fetch("https://esenttiapp-production.up.railway.app/api/cargarinventario",{
            method: 'GET',
                headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Agrupar datos por cliente y contar entradas
            let clientes = {};
            data.forEach(item => {
                if (clientes[item.cliente]) {
                    clientes[item.cliente]++;
                } else {
                    clientes[item.cliente] = 1;
                }
            });

            // Crear el gráfico
            const ctx = document.getElementById('clientesChart').getContext('2d');

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(clientes),
                    datasets: [{
                        label: '',
                        data: Object.values(clientes),
                        backgroundColor: [
                            '#00bfff', // --bs-success
                            '#87cefa', // --bs-info
                            '#4682b4', // --bs-warning (Steel Blue)
                            '#1e90ff' // --bs-danger
                        ], // Colores fijos como en ECharts
                        borderColor: '#fff', // Borde blanco
                        borderWidth: 5, // Ancho del borde
                        hoverOffset: 10, // Separación al pasar el mouse
                    }]
                },
                options: {
                    cutout: '30%', // Agujero central para simular 'doughnut'
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                            position: 'top', // Leyenda en la parte superior
                            align: 'center', // Leyenda centrada
                            labels: {
                                font: {
                                    size: 14,
                                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                                }
                            }
                        },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const porcentaje = ((context.parsed / total) * 100).toFixed(2);
                                    return ` cantidad: ${context.parsed} (${porcentaje}%)`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            color: '#fff',
                            text: 'Total por Cliente', // Título como en ECharts
                            align: 'center',
                            font: {
                                size: 18,
                                weight: 'bold',
                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                            },
                            padding: {
                                bottom: 0
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
};
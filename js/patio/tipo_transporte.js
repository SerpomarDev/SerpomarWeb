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
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Cantidad',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                                }
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--bs-dark'),
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: '#e0e0e0',
                                borderDash: [3, 3]
                            }
                        },
                        y: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--bs-dark'),
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
                                    return `${context.label}: ${context.parsed.x}`;
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Total tipo Transporte', // Título actualizado
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
};
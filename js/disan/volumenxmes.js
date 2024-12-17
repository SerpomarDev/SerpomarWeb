document.addEventListener('DOMContentLoaded', function() {
    generarGraficoEstadoOperacion();

    function generarGraficoEstadoOperacion() {
        fetch('https://esenttiapp-production.up.railway.app/api/registroestadistico', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        .then(response => response.json())
        .then(data => {

            // Filtrar datos por cliente, modalidad y que no sean nulos
            const datosFiltrados = data.filter(item => 
                item.cliente === "DISAN COLOMBIA S.A.S" && 
                item.modalidad === "importacion" && 
                item.fecha_cita !== null 
            );

            // Obtener el mes actual
            const fechaActual = new Date();
            const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11

            // Datos manuales para meses anteriores
            const datosManuales = {
                8: 77,  // Agosto
                9: 50,  // Septiembre
                10: 196, // Octubre
                11: 97  // Noviembre
            };

            // Contar la cantidad de estados de operación por mes
            const conteoEstados = {};
            datosFiltrados.forEach(item => {
                const fechaCita = new Date(item.fecha_cita);
                const mes = fechaCita.getMonth() + 1;
                if (mes >= mesActual) { // Solo contar para el mes actual y posteriores
                    conteoEstados[mes] = (conteoEstados[mes] || 0) + 1;
                }
            });

            // Combinar datos manuales con los datos obtenidos de la API
            const labels = [];
            const valores = [];
            for (let mes = 8; mes <= 12; mes++) { // Meses de agosto a diciembre
                labels.push(obtenerNombreMes(mes));
                if (mes < mesActual) {
                    valores.push(datosManuales[mes]);
                } else {
                    valores.push(conteoEstados[mes] || 0); 
                }
            }

            // Crear gradientes para las barras
            const ctx = document.getElementById('volumenxmes').getContext('2d');
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
                        label: 'Volumen x Mes',
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

    // Función auxiliar para obtener el nombre del mes
    function obtenerNombreMes(numeroMes) {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return meses[numeroMes - 1];
    }
});
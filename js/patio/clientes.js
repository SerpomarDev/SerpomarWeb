window.onload = function() {
    // Realizar la llamada a la API una sola vez
    fetch("https://esenttiapp-production.up.railway.app/api/cargarinventario", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Procesar y crear los diferentes gráficos utilizando los datos obtenidos
            crearGraficoImpoExpo(data);
            crearGraficoLlenoVacio(data);
            crearGraficoClientes(data);
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
};

// Función para crear el gráfico de importaciones y exportaciones
function crearGraficoImpoExpo(data) {
    let importaciones = data.filter(item => item.modalidad === "IMPORTACION").length;
    let exportaciones = data.filter(item => item.modalidad === "EXPORTACION").length;

    const ctx = document.getElementById('impoexpoChart').getContext('2d');

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, '#87cefa');
    gradient1.addColorStop(1, '#87cefa');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, '#00bfff');
    gradient2.addColorStop(1, '#87cefa');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Impo', 'Expo'],
            datasets: [{
                label: '',
                data: [importaciones, exportaciones],
                backgroundColor: [gradient1, gradient2],
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 15,
                barPercentage: 0.7,
                categoryPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'x',
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
                        display: false
                    },
                    ticks: {
                        color: '#fff',
                        font: {
                            size: 8,
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
                            return `${context.label}: ${context.parsed.y}`;
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
}

// Función para crear el gráfico de lleno y vacío
function crearGraficoLlenoVacio(data) {
    let vacio = data.filter(item => item.lleno_vacio === "VACIO").length;
    let lleno = data.filter(item => item.lleno_vacio === "LLENO").length;

    const ctx = document.getElementById('llenovacio').getContext('2d');

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, '#87cefa');
    gradient1.addColorStop(1, '#87cefa');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, '#00bfff');
    gradient2.addColorStop(1, '#87cefa');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['vacio', 'lleno'],
            datasets: [{
                label: '',
                data: [vacio, lleno],
                backgroundColor: [gradient1, gradient2],
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 15,
                barPercentage: 0.7,
                categoryPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'x',
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
                        display: false
                    },
                    ticks: {
                        color: '#fff',
                        font: {
                            size: 8,
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
                            return `${context.label}: ${context.parsed.y}`;
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
}


// // Función para crear el gráfico de clientes
// function crearGraficoClientes(data) {
//     let clientes = {};
//     data.forEach(item => {
//         if (clientes[item.cliente]) {
//             clientes[item.cliente]++;
//         } else {
//             clientes[item.cliente] = 1;
//         }
//     });

//     const ctx = document.getElementById('clientesChart').getContext('2d');

//     new Chart(ctx, {
//         type: 'pie',
//         data: {
//             labels: Object.keys(clientes),
//             datasets: [{
//                 label: '',
//                 data: Object.values(clientes),
//                 backgroundColor: [
//                     '#00bfff',
//                     '#87cefa',
//                     '#4682b4',
//                     '#1e90ff'
//                 ],
//                 borderColor: '#fff',
//                 borderWidth: 2,
//                 hoverOffset: 10,
//             }]
//         },
//         options: {
//             cutout: '30%',
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     display: false,
//                     position: 'top',
//                     align: 'center',
//                     labels: {
//                         font: {
//                             size: 14,
//                             family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
//                         }
//                     }
//                 },
//                 tooltip: {
//                     enabled: true,
//                     callbacks: {
//                         label: function(context) {
//                             const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                             const porcentaje = ((context.parsed / total) * 100).toFixed(2);
//                             return ` cantidad: <span class="math-inline">\{context\.parsed\} \(</span>{porcentaje}%)`;
//                         }
//                     }
//                 },
//                 title: {
//                     display: true,
//                     color: '#fff',
//                     text: 'Total por Cliente',
//                     align: 'center',
//                     font: {

//                         size: 18,
//                         weight: 'bold',
//                         family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
//                     },
//                     padding: {
//                         top: 0,
//                         bottom: 20
//                     }
//                 }
//             }
//         }
//     });
// }
const ctx = document.getElementById('line-ahorros').getContext('2d');

fetch('https://esenttiapp-production.up.railway.app/api/ahorrobycliente', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
    }
})
.then(response => response.json())
.then(apiData => {
    const filteredData = apiData.data.filter(item =>
        item.cliente === "ESENTTIA S A" &&
        item.modalidad === "EXPORTACION" &&
        item.lleno === "LLENO"
    );

    // Calculate total cost
    const totalCostoBodegaje = filteredData.reduce((sum, item) =>
        sum + parseFloat(item.costo_bodegaje.replace(/,/g, '')), 0);
    const totalCostoSerpomar = filteredData.reduce((sum, item) =>
        sum + item.costo_serpomar, 0);

    // Prepare data for progressive animation
    const dataBodegaje = [];
    const dataSerpomar = [];
    const labels = [];

    for (let i = 0; i <= 100; i++) {
        const valueBodegaje = (totalCostoBodegaje / 100) * i;
        const valueSerpomar = (totalCostoSerpomar / 100) * i;
        dataBodegaje.push(valueBodegaje);
        dataSerpomar.push(valueSerpomar);
        labels.push(i); 
    }

    // Chart.js data with progressive line animation
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Costo Bodegaje en Puerto',
            data: dataBodegaje,
            borderColor: '#FF0041',
            borderWidth: 4,
            radius: 0,
            fill: false,
            tension: 0.4,
            animation: {
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: 100, // Total animation duration
                    from: 0,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * 50; // Delay between each point
                    }
                }
            }
        }, {
            label: 'Costo en Serpomar',
            data: dataSerpomar,
            borderColor: '#0073FF',
            borderWidth: 4,
            radius: 0,
            fill: false,
            tension: 0.1,
            animation: {
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: 100, // Total animation duration
                    from: 0,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * 50; // Delay between each point
                    }
                }
            }
        }]
    };

    const config = {
        type: 'line',
        data: chartData,
        options: {
            // Define la configuración de animación aquí
            animation: {
                duration: 3000, // Duración total de la animación
                easing: 'easeOutQuart' // Función de aceleración para la animación
            }, 
            interaction: {
                intersect: false
            },
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
                        }
                    }
                }
            }
        }
    };

    new Chart(ctx, config);
})
.catch(error => console.error('Error fetching data:', error));
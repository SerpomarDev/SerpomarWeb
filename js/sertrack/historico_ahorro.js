fetch('https://esenttiapp-production.up.railway.app/api/ahorrobycliente', {
  headers: {
      'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
.then(response => response.json())
.then(apiData => {
  // Filtrar los datos
  const filteredData = apiData.data.filter(item =>
      item.cliente === "ESENTTIA S A" &&
      item.modalidad === "EXPORTACION" &&
      item.lleno === "LLENO"
  );

  // Agrupar los datos por mes y sumar "costo_bodegaje" y "costo_serpomar"
  const groupedData = filteredData.reduce((acc, item) => {
      const month = new Date(item.fecha_hora_entrada).toLocaleString('default', { month: 'long' });
      acc[month] = acc[month] || { costo_bodegaje: 0, costo_serpomar: 0 };
      acc[month].costo_bodegaje += parseFloat(item.costo_bodegaje.replace(/,/g, ''));
      acc[month].costo_serpomar += item.costo_serpomar;
      return acc;
  }, {});

  // Agregar datos de octubre
  groupedData['Octubre'] = {
      costo_bodegaje: 179374828,
      costo_serpomar: 61880000
  };

  // Agregar datos de Noviembre 
  groupedData['Noviembre'] = {
      costo_bodegaje: 308438812,
      costo_serpomar: 81640000 
  };

  // Calcular el ahorro por mes
  const ahorroPorMes = {};
  for (const month in groupedData) {
      ahorroPorMes[month] = groupedData[month].costo_bodegaje - groupedData[month].costo_serpomar;
  }

  // Obtener la lista de meses (excluyendo Octubre y Noviembre)
  const mesesRestantes = Object.keys(groupedData).filter(month => month !== 'Octubre' && month !== 'Noviembre');

  // Ordenar los meses restantes cronológicamente
  const monthOrder = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Diciembre"];
  mesesRestantes.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  // Unir "Octubre" con los meses restantes ordenados
  const labels = ['Octubre', 'Noviembre', ...mesesRestantes];

  // Preparar los datos para Chart.js
  const dataBodegaje = labels.map(month => groupedData[month].costo_bodegaje);
  const dataSerpomar = labels.map(month => groupedData[month].costo_serpomar);
  const dataAhorro = labels.map(month => ahorroPorMes[month]);

  // Crear el gráfico
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [
              {
                  label: 'Costo Bodegaje',
                  data: dataBodegaje,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1
              },
              {
                  label: 'Costo Serpomar',
                  data: dataSerpomar,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
              },
              {
                  label: 'Ahorro',
                  data: dataAhorro,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }
          ]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true,
                  stacked: true
              },
              x: {
                  stacked: true
              }
          }
      }
  });
});
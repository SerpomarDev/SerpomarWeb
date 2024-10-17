document.addEventListener('DOMContentLoaded', () => {
  // Función para obtener los datos de la API
  function fetchData(url) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
      }
    })
    .then(response => response.json());
  }

  // Función para preparar los datos para la tabla
  function prepareTableData(data) {
    const tableData = {};
    data.forEach(item => {
      const key = `${item.estado_operacion}-${item.on_time}`;
      tableData[key] = (tableData[key] || 0) + 1;
    });
    return tableData;
  }

  // Función para crear la tabla dinámica
  function createTable(tableData) {
    const tableContainer = document.getElementById('table-container'); // Asegúrate de tener un div con este ID en tu HTML
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Estado de la Operación</th>
          <th>Estado</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;
    const tbody = table.querySelector('tbody');

    let total = 0; // Variable para acumular el total
    for (const key in tableData) {
      const [estado, onTime] = key.split('-');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${estado}</td>
        <td>${onTime}</td>
        <td>${tableData[key]}</td>
      `;
      tbody.appendChild(row);
      total += tableData[key]; // Sumar la cantidad al total
    }

    // Agregar fila con el total
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td>Total</td>
      <td></td>
      <td>${total}</td>
    `;
    tbody.appendChild(totalRow);

    tableContainer.appendChild(table);
  }

  // Obtener los datos y crear la tabla
  fetchData('https://sertrack-production.up.railway.app/api/ontime')
    .then(data => prepareTableData(data))
    .then(tableData => createTable(tableData))
    .catch(error => console.error('Error:', error));
});


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

  // Función para crear la tabla dinámica (modificada)
  function createTable(tableData) {
    const tableContainer = document.getElementById('table-container');
    const table = document.createElement('table');

    // Crear la estructura de la tabla siempre
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
    tableContainer.appendChild(table); 

    // Verificar si hay datos
    if (!tableData || Object.keys(tableData).length === 0) {
      // Si no hay datos, agregar una fila con el mensaje
      const tbody = table.querySelector('tbody');
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 3; // Para que la celda ocupe las 3 columnas
      cell.textContent = "Sin datos aún";
      cell.style.textAlign = "center"; // Centrar el texto
      row.appendChild(cell);
      tbody.appendChild(row);
    } else {
      // Si hay datos, agregar las filas con datos
      const tbody = table.querySelector('tbody');
      let total = 0; 
      for (const key in tableData) {
        const [estado, onTime] = key.split('-');
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${estado}</td>
          <td>${onTime}</td>
          <td>${tableData[key]}</td>
        `;
        tbody.appendChild(row);
        total += tableData[key]; 
      }

      const totalRow = document.createElement('tr');
      totalRow.innerHTML = `
        <td>Total</td>
        <td></td>
        <td>${total}</td>
      `;
      tbody.appendChild(totalRow);
    }
  }

  // Obtener los datos y crear la tabla (con manejo de errores)
  fetchData('https://sertrack-production.up.railway.app/api/ontime')
    .then(data => {
      // Verificar si la respuesta de la API indica un error
      if (data.message === "No hay datos disponibles.") {
        // Si hay un mensaje de error, pasar un objeto vacío a createTable
        return {}; 
      } else {
        // Si no hay error, procesar los datos normalmente
        return prepareTableData(data); 
      }
    })
    .then(tableData => createTable(tableData))
    .catch(error => {
      console.error('Error:', error);
      // En caso de cualquier error, mostrar la tabla sin datos
      createTable({}); 
    });
});
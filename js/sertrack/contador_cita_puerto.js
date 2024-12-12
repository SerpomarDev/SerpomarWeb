// counter.js

const counterValue = document.getElementById('ingreso-puerto-hoy');
const apiUrl = 'https://sertrack-production.up.railway.app/api/intervalfifteenday';

fetch(apiUrl, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("authToken")}`
  }
})
  .then(response => response.json())
  .then(data => {
    // Usar moment.js para obtener la fecha actual en formato YYYY-MM-DD
    const today = moment().format('YYYY-MM-DD'); 
    let count = 0;

    data.forEach(item => {
      // Asumiendo que cita_puerto viene en formato DD-MM-YYYY
      const citaPuerto = moment(item.cita_puerto, 'DD-MM-YYYY').format('YYYY-MM-DD');

      if (citaPuerto === today && item.hora_llegada) {
        count++;
      }
    });

    counterValue.textContent = count;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    counterValue.textContent = 'Error';
  });
    document.addEventListener('DOMContentLoaded', function(){
        
        let selectPlaca = document.getElementById('id_placa');

        fetch('https://esenttiapp-production.up.railway.app/api/loadplaca')
        .then(response => response.json())
        .then(data => {
            data.forEach(placa => {
                let option = document.createElement('option');
                option.value = placa.id;
                option.text = placa.placa;
                selectPlaca.appendChild(option);
            });
        })
         .then(() => {
            // Agregar evento input para el filtrado de placa
            selectPlaca.addEventListener('input', filtrarPlacas);
        })
        .catch(error => console.error('Error:', error));
    });
  
  function filtrarPlacas() {
    let input = this.value.toUpperCase();
    let selectPlaca = document.getElementById('id_placa');
    let options = selectPlaca.getElementsByTagName('option');
  
    for (let i = 0; i < options.length; i++) {
        let txtValue = options[i].text;
        if (txtValue.toUpperCase().indexOf(input) > -1) {
            options[i].style.display = '';
        } else {
            options[i].style.display = 'none';
        }
    }
  }
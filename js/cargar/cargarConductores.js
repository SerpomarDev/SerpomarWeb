
document.addEventListener('DOMContentLoaded', function() {

    //obtenemos los ids de los campos seleccionados
    let selectNombre = document.getElementById('id_conductor');
    let inputIdentificacion = document.getElementById('identificacion');
    let inputTelefono = document.getElementById('telefono');
  
    // Carga inicial de los nombres de los conductores en el select
      fetch('https://esenttiapp-production.up.railway.app/api/uploadconductor',{
        method: 'GET',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem("authToken")}`
          }
      })
      .then(response => response.json())
      .then(data => {
        data.forEach(conductor => {
          let option = document.createElement('option');
          option.value = conductor.id;
          option.text = conductor.nombre;
          selectNombre.appendChild(option);
        });
        
      });
  
      // capturamos los valores de telefono e identidicacion mediante el id seleccionado
      selectNombre.addEventListener('change', function() {

        let idConductorSeleccionado = this.value

          fetch(`https://esenttiapp-production.up.railway.app/api/uploadoptid/${idConductorSeleccionado}`,{
            method: 'GET',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem("authToken")}`
              }
          })  
          .then(response => {
            if (!response.ok) {
              throw new Error('Error en la respuesta de la API: ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            const conductor =  data[0]
            if (conductor.identificacion && conductor.telefono) {
                inputIdentificacion.value = conductor.identificacion;
                inputTelefono.value = conductor.telefono;
            } else {
              console.error('Los datos esperados no están presentes en la respuesta de la API');
            } 
          })
          .catch(error => console.error('Error:', error));
      });
  });

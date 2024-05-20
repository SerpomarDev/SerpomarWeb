document.addEventListener('DOMContentLoaded', function() {

    let selectSp = document.getElementById('id_sp');
    let inputCliente = document.getElementById('cliente');
    let inputCantidadContenedor = document.getElementById('cantidad_contenedor');
    let inputModalidad = document.getElementById('imp_exp');
    let inputIdCliente = document.getElementById('id_cliente');
    let selectConcepto = document.getElementById('id_tarifa');
    let inputTarifa = document.getElementById('tarifa');
    let inputValor = document.getElementById('valor');

    fetch('https://esenttiapp-production.up.railway.app/api/uploadsp')
      .then(response => response.json())
      .then(data => {
        data.forEach(sp_do => {
          let option = document.createElement('option');
          option.value = sp_do.id_sp;
          option.text = sp_do.do_sp;
          selectSp.appendChild(option);
        });
      });
  
      selectSp.addEventListener('change', function() {

        selectConcepto.innerHTML = '';
        inputTarifa.value = '';
        inputValor.value = '';

        let idSpSeleccionado = this.value

        fetch(`https://esenttiapp-production.up.railway.app/api/uploadspbyid/${idSpSeleccionado}`)  
          .then(response => {
            if (!response.ok) {
              throw new Error('Error en la respuesta de la API: ' + response.statusText);
            }
            return response.json();
          })
          .then(data => {
            const sp_do =  data[0]
            if (sp_do.cliente && sp_do.cantidad_contenedor && sp_do.emp_exp && sp_do.id_cliente) {
                inputCliente.value = sp_do.cliente;
                inputCantidadContenedor.value = sp_do.cantidad_contenedor;
                inputModalidad.value = sp_do.emp_exp;
                inputIdCliente.value = sp_do.id_cliente;
                
                let id  = inputIdCliente.value
                uploadConceptos(id)

            } else {
              console.error('Los datos esperados no están presentes en la respuesta de la API');
            } 
          })
          .catch(error => console.error('Error:', error));
      });


      function uploadConceptos(id){ 
  
        fetch(`https://esenttiapp-production.up.railway.app/api/uploadconceptosbyidcl/${id}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(concepto => {
            let option = document.createElement('option');
            option.value = concepto.id;
            option.text = concepto.concepto;
            selectConcepto.appendChild(option);
          })
          .catch(error => console.error('Error:', error));
        });
  
        selectConcepto.addEventListener('change',function(){
  
         let idselectConcepto = this.value
  
          fetch(`https://esenttiapp-production.up.railway.app/api/uploadconceptosbyid/${idselectConcepto}`)  
            .then(response => {
              if (!response.ok) {
                throw new Error('Error en la respuesta de la API: ' + response.statusText);
              }
              return response.json();
            })
            .then(data => {
              if(data.length > 0){
                const concepto = data[0]
                inputTarifa.value = concepto.tarifa;
                contenedorBytarifa();
              }else{
                console.log('La propiedad array no existe en la respuesta');
              }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
        })
    }

      function contenedorBytarifa() {

        let cantidad_contenedor = inputCantidadContenedor.value;
        let tarifa = inputTarifa.value;
  
        if (!isNaN(cantidad_contenedor) && !isNaN(tarifa)) {
            let multi = cantidad_contenedor * tarifa;
            inputValor.value = multi
        } else {
            console.error('Cantidad de contenedor o tarifa no son valores numéricos.');
        }
    }
    
  });
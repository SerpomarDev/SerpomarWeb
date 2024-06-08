
document.addEventListener('DOMContentLoaded', function() {

  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let id = urlParams.get("id");

  let selectConcepto = document.getElementById('id_concepto');
  let inputCostoCliente = document.getElementById('id_costo_cliente');
  let inputTarifa = document.getElementById('tarifa');
  let inputCantidadContenedor = document.getElementById('cantidad_contenedor');
  let inputValor = document.getElementById('valor');

  fetch(`https://esenttiapp-production.up.railway.app/api/cargarcontenedorbypre/${id}`)
.then((responde) => {
  if (!responde) {
    throw new Error("Error al obtener los datos de la API");
  }
  return responde.json();
})
.then((data) => {
  if (data.length > 0) {
    const contenedor = data[0];
    document.getElementById('id_solicitud_servicio').value = contenedor.id_sc;
    document.getElementById('id_cliente').value = contenedor.id_cliente;
    document.getElementById('id_contenedor').value = contenedor.id_contenedor;
    document.getElementById('numero_contenedor').value = contenedor.numero_co;
    document.getElementById('cliente').value = contenedor.cliente;
    inputCantidadContenedor.value = contenedor.cantidad_contenedor;
    document.getElementById('imp_exp').value = contenedor.tipo_transporte;

   let idcliente = id_cliente.value
      uploadConceptos(idcliente)
  } else {
    console.log("La propiedad array no existe en la respuesta");
  }
})
.catch((error) => {
  console.error("Error:", error);
});


      function uploadConceptos(idcliente){ 
  
        fetch(`https://esenttiapp-production.up.railway.app/api/uploadconceptosbyidcl/${idcliente}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(concepto => {
            let option = document.createElement('option');
            option.value = concepto.id_concepto;
            option.text = concepto.concepto;
            selectConcepto.appendChild(option);
          })
          
        });
  
        selectConcepto.addEventListener('change',function(){
  
         let idselectConcepto = this.value
         console.log(idselectConcepto)
  
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
                inputCostoCliente.value = concepto.id;
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

        let cantidad_contenedor = 1;
        let tarifa = inputTarifa.value;
  
        if (!isNaN(cantidad_contenedor) && !isNaN(tarifa)) {
            let multi = cantidad_contenedor * tarifa;
            inputValor.value = multi
        } else {
            console.error('Cantidad de contenedor o tarifa no son valores numéricos.');
        }
    }
    
  });
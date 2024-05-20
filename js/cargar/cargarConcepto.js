
    export function uploadConceptos(id){ 
      
        let selectConcepto = document.getElementById('id_tarifa');
  
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
                 document.getElementById('tarifa').value = concepto.tarifa;
              }else{
                console.log('La propiedad array no existe en la respuesta');
              }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
        })
    }

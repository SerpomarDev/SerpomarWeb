let dataContenedores = [];

const calendarInput = document.querySelector('.calendar');
const saveButton = document.querySelector('.save');

const seccionesContenedores = {
    'IMPORTACION': document.getElementById('importacion'),
    'EXPORTACION': document.getElementById('exportacion'),
    'RETIRO VACIO': document.getElementById('retiro-vacio'),
    'TRASLADO': document.getElementById('traslado'),
    'DEVOLUCION': document.getElementById('devolucion')
};

calendarInput.addEventListener('change', filtrarContenedoresPorFecha);
saveButton.addEventListener('click', guardarRelacionesEnLocalStorage);

async function obtenerDatosYCrearInterfaz() {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No se encontró el token de autenticación en localStorage');
        }

        const responseContenedores = await fetch("http://127.0.0.1:8000/api/uploadprogramacion", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        });
        const responsePlacas = await fetch("http://127.0.0.1:8000/api/uploadplacapreventa", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        });

        if (!responseContenedores.ok || !responsePlacas.ok) {
            throw new Error('Error al obtener datos de los endpoints');
        }

        dataContenedores = await responseContenedores.json();
        const dataPlacas = await responsePlacas.json();

        const fechaHoy = new Date().toISOString().slice(0, 10);

        calendarInput.value = fechaHoy;

        filtrarContenedoresPorFecha();

        mostrarPlacas(dataPlacas);
        hacerPlacasArrastrables();

        reconstruirRelacionesDesdeLocalStorage(authToken); 

        const saveButton = document.querySelector('.save'); 
        if (saveButton) { 
            saveButton.addEventListener('click', () => guardarRelacionesEnLocalStorage(authToken));
        } else {
            console.error("No se encontró el botón 'save'. Asegúrate de que el HTML esté cargado correctamente.");
        }

    } catch (error) {
        console.error("Error al obtener o procesar los datos:", error);
    }
}

function filtrarContenedoresPorFecha() {
    const fechaSeleccionada = calendarInput.value;
    const contenedoresFiltrados = dataContenedores.filter(contenedor => contenedor.fecha === fechaSeleccionada);

    limpiarSeccionesContenedores();

    mostrarContenedores(contenedoresFiltrados);

    reconstruirRelacionesDesdeLocalStorage(); 
}

function limpiarSeccionesContenedores() {
    for (const servicio in seccionesContenedores) {
        const seccion = seccionesContenedores[servicio];
        while (seccion.firstChild) {
            seccion.removeChild(seccion.firstChild);
        }
    }
}

function mostrarContenedores(programacion) {
    programacion.forEach(item => {
        const contenedorDiv = document.createElement('div');
        contenedorDiv.id = item.numero_contenedor; 
        contenedorDiv.classList.add('contenedor');

        const servicioSpan = document.createElement('span');
        servicioSpan.textContent = item.cliente;

        const numeroContenedorSpan = document.createElement('span');
        numeroContenedorSpan.textContent = item.numero_contenedor;
        numeroContenedorSpan.style.fontWeight = 'bold';
        numeroContenedorSpan.style.fontSize = '12px';
        numeroContenedorSpan.style.color = '#007bff';
        numeroContenedorSpan.style.paddingRight = '5px';
        numeroContenedorSpan.style.paddingLeft = '5px';

        const origenSpan = document.createElement('span');
        origenSpan.textContent = `Origen: ${item.origen}`;
        origenSpan.style.fontSize = '10px';
        origenSpan.style.paddingRight = '5px';

        const destinoSpan = document.createElement('span');
        destinoSpan.textContent = `Destino: ${item.destino}`;
        destinoSpan.style.fontSize = '10px';
        destinoSpan.style.paddingRight = '5px';

        const cargueSpan = document.createElement('span');
        cargueSpan.textContent = `Cargue: ${item.cargue}`;
        cargueSpan.style.fontSize = '10px';

        const dropZone = document.createElement('div');
        dropZone.classList.add('placa-drop-zone');
        dropZone.style.border = '2px dashed #ccc'; 
        dropZone.style.backgroundColor = '#f0f0f0'; 
        dropZone.style.padding = '5px'; 
        dropZone.style.borderRadius = '5px'; 
        dropZone.style.marginBottom = '5px'; 

        contenedorDiv.appendChild(servicioSpan);
        contenedorDiv.appendChild(numeroContenedorSpan);
        contenedorDiv.appendChild(dropZone); 
        contenedorDiv.appendChild(origenSpan);
        contenedorDiv.appendChild(destinoSpan);
        contenedorDiv.appendChild(cargueSpan);

        const seccion = seccionesContenedores[item.servicio];
        if (seccion) {
            seccion.appendChild(contenedorDiv);

            new Sortable(dropZone, {
                group: 'shared',
                animation: 150,
                onAdd: function(evt) {
                    console.log("Placa soltada en el contenedor:", item.numero_contenedor);
                }
            });
        } else {
            console.warn(`Servicio desconocido: ${item.servicio}`);
        }
    });
}

function mostrarPlacas(placasData) {
    const placasUl = document.getElementById('placas');

    const placasPorTipologia = {};
    placasData.forEach(item => {
        const tipologia = item.tipologia;
        if (!placasPorTipologia[tipologia]) {
            placasPorTipologia[tipologia] = [];
        }
        placasPorTipologia[tipologia].push(item.placa);
    });

    for (const tipologia in placasPorTipologia) {
        const placasDeTipologia = placasPorTipologia[tipologia];


        const tipologiaHeader = document.createElement('h6');
        tipologiaHeader.textContent = tipologia;
        placasUl.appendChild(tipologiaHeader);

        placasDeTipologia.forEach(placa => {
            const placaLi = document.createElement('li');
            placaLi.classList.add('placa');
            placaLi.textContent = placa;
            placasUl.appendChild(placaLi);
        });
    }
}

function hacerPlacasArrastrables() {
    const placasUl = document.getElementById('placas');

    placasUl.querySelectorAll('.placa').forEach(placa => {
        placa.addEventListener('click', () => {
            const accion = confirm("¿Desea duplicar esta placa?");
            if (accion) {
                duplicarPlaca(placa);
            }
        });
    });

    new Sortable(placasUl, {
        group: 'shared',
        animation: 150,
        onEnd: function (evt) {
            if (evt.item === evt.to && evt.newIndex === evt.oldIndex) {
                const placaOriginal = evt.item;
                if (confirm("¿Desea duplicar esta placa?")) {
                    duplicarPlaca(placaOriginal);
                }
            }
        }
    });
}

function duplicarPlaca(placaOriginal) {
    const nuevaPlaca = placaOriginal.cloneNode(true);

    const numDuplicaciones = parseInt(placaOriginal.dataset.duplicaciones || 0);
    const colorOriginal = placaOriginal.style.backgroundColor || ""; // Obtener el color original o dejarlo vacío si no tiene

    switch (numDuplicaciones) {
        case 0:
            nuevaPlaca.style.backgroundColor = 'green';
            break;
        case 1:
            nuevaPlaca.style.backgroundColor = 'orange';
            break;
        case 2:
            nuevaPlaca.style.backgroundColor = 'red';
            break;
        case 3:
            nuevaPlaca.style.backgroundColor = 'purple';
            break;
        case 4:
            nuevaPlaca.style.backgroundColor = 'black';
            break;
        default:
            alert("Se ha alcanzado el límite de duplicaciones para esta placa.");
            return;
    }

    placaOriginal.dataset.duplicaciones = numDuplicaciones + 1;
    nuevaPlaca.dataset.duplicaciones = numDuplicaciones + 1;
    nuevaPlaca.dataset.colorOriginal = colorOriginal;
    placaOriginal.parentNode.insertBefore(nuevaPlaca, placaOriginal.nextSibling);

    nuevaPlaca.addEventListener('click', () => {
        duplicarPlaca(nuevaPlaca);
    });
}

function eliminarPlaca(placa) {
    placa.parentNode.removeChild(placa);
}

function hacerContenedoresSoltables(programacion) {
    programacion.forEach(item => {
        new Sortable(document.getElementById(item.numero_contenedor), {
            group: 'shared',
            animation: 150
        });
    });
}

async function guardarRelacionesEnLocalStorage() { 
    const fechaSeleccionada = calendarInput.value;
    const relaciones = obtenerRelacionesContenedoresPlacas(fechaSeleccionada); 

    try {
        const response = await fetch('http://127.0.0.1:8000/api/preprograma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({   
 
                programacion: relaciones, 
                fecha: fechaSeleccionada
            })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: data.message || 'La Pre-programación se guardó correctamente.'
            });
        }

    } catch (error) {

        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'La Pre-programación ya esta creada para esta fecha.'
        });
        console.error('Error al guardar la programación:', error);
    }
}

function obtenerRelacionesContenedoresPlacas() {
    const relaciones = [];

    for (const servicio in seccionesContenedores) {
        const seccion = seccionesContenedores[servicio];
        const contenedores = seccion.querySelectorAll('.contenedor');

        contenedores.forEach(contenedor => {
            const numeroContenedor = contenedor.id;
            const dropZone = contenedor.querySelector('.placa-drop-zone');
            if (!dropZone) {
                console.warn(`No se encontró la zona de colocación de placas para el contenedor ${numeroContenedor}`);
                return;
            }

            const placas = dropZone.querySelectorAll('.placa');
            const placasAsociadas = Array.from(placas).map(placa => ({
                texto: placa.textContent.trim(),
                colorOriginal: placa.dataset.colorOriginal || "", // Obtener el color original si existe
                colorActual: placa.style.backgroundColor || ""     // Obtener el color actual de la placa
            }));

            relaciones.push({
                contenedor: numeroContenedor,
                placas: placasAsociadas,
            });
        });
    }

    return relaciones;
}

async function reconstruirRelacionesDesdeLocalStorage() {
    const fechaSeleccionada = calendarInput.value;
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preprograma?fecha=${fechaSeleccionada}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener la pre-programación del servidor');
      }
  
      const data = await response.json();

      const relacionesGuardadas = data.length > 0 ? data[0].programacion : []; 
  
      if (relacionesGuardadas && relacionesGuardadas.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100)); 

        const placasOriginales = {};
        document.querySelectorAll('#placas .placa').forEach(placa => {
          placasOriginales[placa.textContent.trim()] = placa;
        });
  
        relacionesGuardadas.forEach(relacion => {
          const contenedor = document.getElementById(relacion.contenedor);
          if (!contenedor) {
            console.warn(`No se encontró el contenedor con ID ${relacion.contenedor}`);
            return; 
          }
  
          const dropZone = contenedor.querySelector('.placa-drop-zone');
          if (!dropZone) {
            console.warn(`No se encontró la zona de colocación de placas para el contenedor ${relacion.contenedor}`);
            return; 
          }
  
          relacion.placas.forEach(placaObj => { // placaObj ahora es un objeto
            const textoPlaca = placaObj.texto; // Extraer el texto de placa del objeto
    
            const placaOriginal = placasOriginales[textoPlaca];
    
            if (placaOriginal) {
        
              const placaExistente = Array.from(dropZone.querySelectorAll('.placa'))
                .find(placa => placa.textContent.trim() === textoPlaca);
  
              if (!placaExistente) { 
                const nuevaPlaca = placaOriginal.cloneNode(true);
                dropZone.appendChild(nuevaPlaca);
  
                let numDuplicaciones = parseInt(nuevaPlaca.dataset.duplicaciones || 0); 
                nuevaPlaca.dataset.duplicaciones = numDuplicaciones + 1;
  
                switch (numDuplicaciones) {
                  case 0:
                    break; 
                  case 1:
                    nuevaPlaca.style.backgroundColor = 'green';
                    break;
                  case 2:
                    nuevaPlaca.style.backgroundColor = 'orange';
                    break;
                  case 3:
                    nuevaPlaca.style.backgroundColor = 'red';
                    break;
                  case 4:
                    nuevaPlaca.style.backgroundColor = 'purple';
                    break;
                  case 5:
                    nuevaPlaca.style.backgroundColor = 'black';
                    break;
                  default:
                
                    console.error("Se ha alcanzado el límite de duplicaciones para esta placa.");
                    return; 
                }
  
                nuevaPlaca.addEventListener('click', () => {
                  duplicarPlaca(nuevaPlaca);
                });
  
              } 
            } else {
                console.warn(`No se encontró la placa original con texto ${textoPlaca}`);
            }
        });
    });
      }
  
    } catch (error) {
      console.error('Error al obtener o procesar la pre-programación:', error);
    }
  }

obtenerDatosYCrearInterfaz();
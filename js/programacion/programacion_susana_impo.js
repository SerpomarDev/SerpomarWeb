let dataContenedores = [];

const calendarInput = document.querySelector('.calendar');
const saveButton = document.querySelector('.save');

const seccionesContenedores = {
    'IMPORTACION': document.getElementById('importacion'),
    'TRASLADO': document.getElementById('traslado'),
    'DEVOLUCION': document.getElementById('devolucion')
};

calendarInput.addEventListener('change', () => {
    const fechaSeleccionada = calendarInput.value;
    localStorage.setItem('fechaSeleccionada', fechaSeleccionada); 
    filtrarContenedoresPorFecha(); 

    // Disparar el evento personalizado
    window.dispatchEvent(new Event('fechaCambiada')); 
});


// Obtener la fecha de hoy en formato YYYY-MM-DD
const fechaHoy = new Date().toISOString().slice(0, 10);

const fechaGuardada = localStorage.getItem('fechaSeleccionada');
if (!fechaGuardada) { // Si no hay fecha guardada, usar la de hoy
    localStorage.setItem('fechaSeleccionada', fechaHoy);
    console.log("Fecha de hoy establecida por defecto:", fechaHoy);
} else {
    console.log("Fecha seleccionada previamente:", fechaGuardada);
}

// Cacheamos el elemento del contador para evitar buscarlo cada vez
const contadorElemento = document.querySelector('.contador-programa');

// Función para actualizar el contador de programaciones
function actualizarContadorProgramaciones(total) {
    if (contadorElemento) {
        contadorElemento.textContent = `Total programaciones: ${total}`;
    } else {
        console.error("No se encontró el elemento .contador-programa");
    }
}

// Función principal que obtiene los datos de la API y crea la interfaz de usuario
async function obtenerDatosYCrearInterfaz() {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('No se encontró el token de autenticación en localStorage');
        }

        const [responseContenedores, responsePlacas] = await Promise.all([
            fetch("https://esenttiapp-production.up.railway.app/api/uploadprogramacion", {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch("https://esenttiapp-production.up.railway.app/api/uploadplacapreventa", {
                headers: { 'Authorization': `Bearer ${authToken}` }
            })
        ]);

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
        reconstruirRelacionesDesdeLocalStorage();

        saveButton.addEventListener('click', () => guardarRelacionesEnLocalStorage(authToken));

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
    actualizarContadorProgramaciones(contenedoresFiltrados.length);
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
        // Filtrar por el cliente "PRODUCTOS AUTOADHESIVOS ARCLAD S.A"
        if (item.cliente !== "PRODUCTOS AUTOADHESIVOS ARCLAD S.A") {
            return; // Saltar este contenedor si no es del cliente deseado
        }

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

        const horaSpan = document.createElement('span');
        horaSpan.textContent = `Hora: ${item.hora}`;
        horaSpan.style.fontSize = '10px';
        horaSpan.style.paddingRight = '5px';

        const origenSpan = document.createElement('span');
        origenSpan.textContent = `Origen: ${item.origen}`;
        origenSpan.style.fontSize = '10px';
        origenSpan.style.paddingRight = '5px';

        const destinoSpan = document.createElement('span');
        destinoSpan.textContent = `Destino: ${item.destino}`;
        destinoSpan.style.fontSize = '10px';
        destinoSpan.style.paddingRight = '5px';

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
        contenedorDiv.appendChild(horaSpan);
        contenedorDiv.appendChild(origenSpan);
        contenedorDiv.appendChild(destinoSpan);
    

        const seccion = seccionesContenedores[item.servicio];
        if (seccion) {
            seccion.appendChild(contenedorDiv);
            new Sortable(dropZone, {
                group: 'shared',
                animation: 150,
                onAdd: function (evt) {
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
    const colorOriginal = placaOriginal.style.backgroundColor || ""; 

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

    // Insertamos la nueva placa
    placaOriginal.parentNode.insertBefore(nuevaPlaca, placaOriginal.nextSibling);

    // Eliminamos todos los event listeners de la nueva placa
    // nuevaPlaca.replaceWith(nuevaPlaca.cloneNode(true)); 

    // Solo agregamos el event listener si es la placa madre original
    if (!placaOriginal.dataset.colorOriginal) { 
        nuevaPlaca.addEventListener('click', () => {
            duplicarPlaca(nuevaPlaca);
        });
    }
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
    saveButton.disabled = true;

    const fechaSeleccionada = calendarInput.value;
    const relaciones = obtenerRelacionesContenedoresPlacas(fechaSeleccionada);

    try {
        const responseCheck = await fetch(`https://esenttiapp-production.up.railway.app/api/programacion?fecha=${fechaSeleccionada}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        });

        if (!responseCheck.ok) {
            throw new Error('Error al verificar la programación en el servidor');
        }

        const dataCheck = await responseCheck.json();
        const existeProgramacion = dataCheck.length > 0;
        let programacionId = null;
        if (existeProgramacion) {
            programacionId = dataCheck[0].id; 
        }

        if (existeProgramacion) {
            const result = await Swal.fire({
                icon: 'warning',
                title: '¿Desea actualizar la Programación existente?',
                text: 'Si continúa, se sobrescribirán los datos actuales.',
                showCancelButton: true,
                confirmButtonText: 'Actualizar',
                cancelButtonText: 'Cancelar'
            });

            if (!result.isConfirmed) {
                saveButton.disabled = false; 
                return; 
            }
        }
        const method = existeProgramacion ? 'PUT' : 'POST';
        const endpoint = existeProgramacion
            ? `https://esenttiapp-production.up.railway.app/api/programacion/${programacionId}`
            : 'https://esenttiapp-production.up.railway.app/api/programacion';

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`

            },
            body: JSON.stringify({

                programacion: relaciones,
                fecha: fechaSeleccionada
            })
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text(); 
            console.error('La respuesta del servidor no es JSON:', text);
            throw new Error('La respuesta del servidor no es válida.');
        }

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: data.message || (existeProgramacion ? 'La Programación se actualizó correctamente.' : 'La Programación se guardó correctamente.')
            });
        } else {

            let errorMessage = 'Ocurrió un error al guardar/actualizar la programación.';
            if (data && data.message) {
                errorMessage += ' ' + data.message;
            }
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: errorMessage
            });
        }

    } catch (error) {

        console.error('Error al guardar la programación:', error);
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Ocurrió un error al comunicarse con el servidor. Por favor, inténtalo de nuevo más tarde.'
        });
    } finally {
        saveButton.disabled = false;
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
                colorOriginal: placa.dataset.colorOriginal || "", 
                colorActual: placa.style.backgroundColor || "",  
                numDuplicaciones: placa.dataset.duplicaciones || 0 
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
        const response = await fetch(`https://esenttiapp-production.up.railway.app/api/programacion?fecha=${fechaSeleccionada}`, {
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

                relacion.placas.forEach(placaObj => { 
                    const textoPlaca = placaObj.texto; 
                    const colorOriginal = placaObj.colorOriginal;
                    const colorActual = placaObj.colorActual;
                    const numDuplicaciones = placaObj.numDuplicaciones; 

                    const placaOriginal = placasOriginales[textoPlaca];

                    if (placaOriginal) {
                        const placaExistente = Array.from(dropZone.querySelectorAll('.placa'))
                            .find(placa => placa.textContent.trim() === textoPlaca);

                        if (!placaExistente) { 
                            const nuevaPlaca = placaOriginal.cloneNode(true);
                            nuevaPlaca.style.backgroundColor = colorActual; 
                            nuevaPlaca.dataset.duplicaciones = numDuplicaciones; 
                            nuevaPlaca.dataset.colorOriginal = colorOriginal; 
                            dropZone.appendChild(nuevaPlaca);

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

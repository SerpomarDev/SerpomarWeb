var preguntas = [
    { question: "Nombres", dbColumn: "nombre" },
    { question: "Apellidos", dbColumn: "apellido" },
    { question: "No. Identificación", dbColumn: "identificacion" },
    { question: "ARL", dbColumn: "arl" },
    { question: "¿De donde visita?", dbColumn: "de_donde" },
    { question: "¿Conoce las normas de seguridad? (SI/NO)", dbColumn: "conoce_normas_seguridad" },
    { question: "¿Trae algun dispositivo electronico? (SI/NO)", dbColumn: "trae_dispositivo" },
    { question: "Firma", dbColumn: "firma" } 
];

(function() {

    var tTime = 100;
    var wTime = 200;
    var eTime = 1000;

    var posicion = 0;

    ponerPregunta();

    // Agregar listeners a los botones
    progressButton.addEventListener('click', validar); 
    backButton.addEventListener('click', retroceder);
    nextButton.addEventListener('click', validar);

    inputField.addEventListener('keyup', function(e) {
        transform(0, 0); // hack para IE para redibujar
        if (e.keyCode == 13) validar();
    });


    function ponerPregunta() {
        inputLabel.innerHTML = preguntas[posicion].question;
        inputField.value = '';
        inputField.type = preguntas[posicion].type || 'text';

        mostrarActual();
    }


    function terminado() {

        register.className = 'close';

        // Crear un objeto con los datos del formulario, usando los nombres de columna de la BD
        var formData = {};
        preguntas.forEach(function(pregunta) {
            formData[pregunta.dbColumn] = pregunta.value;
        });

        // Agregar la fecha y hora actual al formData (formateada)
        formData.fecha_ingreso = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Mostrar el mensaje "Enviando..."
        mostrarMensajeEnviando();

        // Enviar los datos al servidor (pero no esperar la respuesta)
        fetch('https://esenttiapp-production.up.railway.app/api/visitante', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify(formData) 
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });

        // Mostrar el mensaje de bienvenida después de 3 segundos
        setTimeout(mostrarMensajeBienvenida, 3000);
    }

    function mostrarMensajeEnviando() {
        var loadingMessage = document.createElement('h1');
        loadingMessage.appendChild(document.createTextNode('Enviando...'));
        loadingMessage.style.opacity = 1;
        register.parentElement.appendChild(loadingMessage);
    }

    function mostrarMensajeBienvenida() {
        // Eliminar el mensaje "Enviando..." si aún existe
        const loadingMessage = register.parentElement.querySelector('h1');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        var h1 = document.createElement('h1');
        h1.appendChild(document.createTextNode('Gracias ' + preguntas[0].value + ', y bienvenido a una experiencia H3MAX.'));
        setTimeout(function() {
            register.parentElement.appendChild(h1);
            setTimeout(function() { h1.style.opacity = 1 }, 50);
        }, eTime);
    }

    function retroceder() {
        if (posicion > 0) {
            posicion--;
            ponerPregunta();
            progress.style.width = posicion * 100 / preguntas.length + 'vw';
            // Habilitar/deshabilitar botones según la posición
            backButton.disabled = (posicion === 0);
            nextButton.disabled = false; 

            // Restablecer el texto del botón a "Adelante"
            nextButton.innerHTML = 'Adelante <i class="fas fa-arrow-right"></i>'; 
        }
    }

    function validar() {

        preguntas[posicion].value = inputField.value;

        // Verificar si la pregunta actual es sobre las normas de seguridad
        if (preguntas[posicion].dbColumn === "conoce_normas_seguridad") {
            if (inputField.value.toUpperCase() === "NO") {
                // Mostrar el video en una ventana emergente
                mostrarVideo();
                // No avanzar a la siguiente pregunta
                return; 
            }
        }

        // Verificar si la pregunta actual es sobre dispositivos electrónicos
        if (preguntas[posicion].dbColumn === "trae_dispositivo") {
            if (inputField.value.toUpperCase() === "SI") {
                // Agregar las preguntas de modelo y número de serie
                preguntas.splice(posicion + 1, 0, 
                    { question: "Modelo del dispositivo:", dbColumn: "modelo_dispositivo" },
                    { question: "Número de serie del dispositivo:", dbColumn: "numero_serie_dispositivo" }
                );
            } 
        }

        if (!inputField.value.match(preguntas[posicion].pattern || /.+/)) {
            incorrecto();
        } else {
            correcto(function() {
                progress.style.width = ++posicion * 100 / preguntas.length + 'vw';

                // Habilitar/deshabilitar botones según la posición
                backButton.disabled = (posicion === 0);

                // Cambiar el texto del botón "Adelante" a "Finalizar" en la última pregunta
                if (posicion === preguntas.length - 1) {
                  nextButton.innerHTML = 'Finalizar <i class="fas fa-check"></i>'; 
                }

                if (preguntas[posicion]) {
                    ocultarActual(ponerPregunta);
                } else {
                    ocultarActual(terminado);
                }
            });
        }
    }

    function mostrarVideo() {
        // Crear un elemento de video
        var video = document.createElement('video');
        video.src = 'VIDEO1.MP4'; // Reemplaza con la ruta correcta
        video.controls = true;
        video.autoplay = true;

        // Crear un elemento div para la ventana emergente
        var modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.appendChild(video);

        // Ajustar el tamaño del video
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100vh';
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.objectFit = 'contain';

        // Agregar la ventana emergente al cuerpo del documento
        document.body.appendChild(modal);

        // Agregar un evento para cerrar la ventana emergente al finalizar el video
        video.addEventListener('ended', function() {
            document.body.removeChild(modal);
            // Avanzar a la siguiente pregunta después de que el video termina
            correcto(function() {
                progress.style.width = ++posicion * 100 / preguntas.length + 'vw';
                // Habilitar/deshabilitar botones según la posición
                backButton.disabled = (posicion === 0);
                nextButton.disabled = (posicion === preguntas.length - 1); 

                // Cambiar el texto del botón "Adelante" a "Finalizar" en la última pregunta
                if (posicion === preguntas.length - 1) {
                  nextButton.innerHTML = 'Finalizar <i class="fas fa-check"></i>'; 
                }

                ocultarActual(ponerPregunta);
            });
        });
    }

    function ocultarActual(callback) {
        inputContainer.style.opacity = 0;
        inputProgress.style.transition = 'none';
        inputProgress.style.width = 0;
        setTimeout(callback, wTime);
    }

    function mostrarActual(callback) {
        inputContainer.style.opacity = 1;
        inputProgress.style.transition = '';
        inputProgress.style.width = '100%';
        setTimeout(callback, wTime);
    }

    function transform(x, y) {
        register.style.transform = 'translate(' + x + 'px , ' + y + 'px)';
    }

    function correcto(callback) {
        register.className = '';
        setTimeout(transform, tTime * 0, 0, 10);
        setTimeout(transform, tTime * 1, 0, 0);
        setTimeout(callback, tTime * 2);
    }

    function incorrecto(callback) {
        register.className = 'wrong';
        for (var i = 0; i < 6; i++)
            setTimeout(transform, tTime * i, (i % 2 * 2 - 1) * 20, 0);
        setTimeout(transform, tTime * 6, 0, 0);
        setTimeout(callback, tTime * 7);
    }

})();
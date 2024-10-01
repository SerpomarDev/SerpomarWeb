
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");


const btnComentar  = document.getElementById("BtnComentar");
const modal = document.getElementById("myModal");
const cerrar = document.getElementById("close");

let id_soli =document.getElementById('id_solicitud').value = id

btnComentar.addEventListener('click',function(){
    modal.style.display ="block"
})

cerrar.addEventListener('click',function(){
    modal.style.display = "none";
})


cargarComentario()


document.getElementById("saveComentario").addEventListener('submit',function(event){
    event.preventDefault();

    const formData = new FormData(this)
    const comentario = formData.get('comentario'); 
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    fetch('https://esenttiapp-production.up.railway.app/api/comentario',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem("authToken")}`
        },
        body: jsonData
    })
    .then(response=>{
        if(!response.ok){
            throw new Error('Error al enviar los datos al formulario');
        }
    })
    .then(data=>{
        Swal.fire({
            title: "¡Buen trabajo!",
            text: "¡Has creado una ruta",
            icon: "success",
          });

          agregarComentarioAlChat(comentario);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
})



function agregarComentarioAlChat(comentario) {
    const chatContainer = document.getElementById("chat-container");

    const mensajeElemento = document.createElement("div");
    mensajeElemento.className = `chat-message animate__animated animate__fadeInUp`;
    mensajeElemento.textContent = `${comentario}`;
    chatContainer.appendChild(mensajeElemento);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function cargarComentario(){

    btnComentar.addEventListener('click', function () {
        modal.style.display = "block";
    
        fetch(`https://esenttiapp-production.up.railway.app/api/uploadcomentario/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los comentarios');
                }
                return response.json();
            })
            .then(data => {
           
                const chatContainer = document.getElementById("chat-container");
                chatContainer.innerHTML = "";
    
                data.forEach(observacion => {
                    agregarComentarioAlChat(observacion.comentario);
                });
            })
            .catch(error => {
                console.error('Error al cargar los comentarios:', error);
            });
    });
}
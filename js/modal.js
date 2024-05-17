let contenerdorModal = document.getElementById('contenerdorModal')
contenerdorModal.addEventListener('show.bs.modal', function (event) {

  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  let modalTitle = contenerdorModal.querySelector('.modal-title')
  let modalBodyInput = contenerdorModal.querySelector('.modal-body input')

  modalTitle.textContent = 'Crear Contenedor '
  modalBodyInput.value = recipient
})
function createHeader() {
  const headerHTML = `
      <header>
          <img src="/img/nodhus.png" alt="Nodhus Logo" class="logo" id="nodhus-logo">
          <div class="header">
              <div class="inner">
                  <div class="user-ui">
                      <div class="user-menu-toggle">
                          <div class="profile-img" style="background-image: url('/img/configuraciones.png')"></div>
                          <span class="simple-arrow fa fa-chevron-down"></span>
                      </div>
                      <div class="user-menu">
                          <div class="menu-nav">
                              <div class="profile-section">
                                  <div class="profile-info">
                                      <p>Tu Rol</p>
                                  </div>
                              </div>
                              <li><span class="fas fa-user"></span> Perfil</li>
                              <li><span class="fa fa-cogs"></span> Ajustes</li>
                              <li><span class="fa fa-question"></span> Ayuda</li>
                              <a href="javascript:void(0)" id="logout-button" class="logout-link" aria-expanded="false">
                                  <i class="fas fa-sign-out-alt"></i>
                                  <span class="nav-text">Cerrar Sesión</span>
                              </a>
                          </div>
                      </div>
                      <div class="sign-out-icon">
                          <div class="settings-icon">
                              <div class="profile-icon">
                                  <i class="fas fa-user-circle"></i>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <button class="floating-button">
              <i class="fas fa-comment-alt"></i> 
          </button>
      </header>
      <div id="loading-spinner" class="spinner" style="display: none;">
          <div class="loading-spinner"></div>
          <i class="fas fa-spinner fa-spin"></i>
      </div>
      <div class="dlabnav">
          <div id="layout">
              <div class="dlabnav" id="sidebar">
                  <div class="dlabnav-scroll sidebar-scroll">
                      <ul class="metismenu" id="menu">
                          <li id="roles-container"></li>
                          <li id="menu-items-container"></li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  `;

  const headerContainer = document.getElementById('header-container');
  headerContainer.innerHTML = headerHTML;

  // Retrasar la ejecución del código que agrega el evento al botón
  setTimeout(() => {
      // Agregar evento al botón flotante
      const floatingButton = document.querySelector('.floating-button');
      if (floatingButton) { 
        floatingButton.addEventListener('click', () => {
          Swal.fire({
            title: 'PQRS',
            html: `
              <style>
                #pqrs-form {
                  text-align: left;
                  max-width: 400px; 
                  margin: 30px auto; 
                  padding: 20px;
                  background-color: #fff; 
                  border-radius: 12px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
                }
        
                #pqrs-form .form-group {
                  margin-bottom: 15px;
                }
        
                #pqrs-form label {
                  display: block;
                  margin-bottom: 5px;
                  font-weight: 600; 
                  color: #333; 
                }
        
                #pqrs-form input,
                #pqrs-form select,
                #pqrs-form textarea {
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #ddd; 
                  border-radius: 6px;
                  box-sizing: border-box;
                  font-size: 16px; 
                }
        
                #pqrs-form input:focus,
                #pqrs-form select:focus,
                #pqrs-form textarea:focus {
                  outline: none; 
                  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); 
                }
        
                #pqrs-form textarea {
                  resize: vertical;
                  min-height: 150px; 
                }
        
                #pqrs-form button[type="submit"] {
                  background-color: #007bff; 
                  color: white;
                  padding: 12px 20px;
                  border: none;
                  border-radius: 6px; 
                  cursor: pointer;
                  font-size: 16px; 
                  transition: background-color 0.3s ease;
         
                }
        
                #pqrs-form button[type="submit"]:hover {
                  background-color: #0056b3; 
                }
        
                .form-group .fa {
                  margin-right: 8px; 
                }
              </style>
              <form id="pqrs-form">
                <div class="form-group">
                  <label for="tipo"><i class="fas fa-question-circle"></i> Tipo de solicitud:</label>
                  <select id="tipo" class="form-control">
                    <option value="peticion">Petición</option>
                    <option value="soporte">Queja</option>
                    <option value="reclamo">Reclamo</option>
                    <option value="sugerencia">Sugerencia</option>
        
                  </select>
                </div>
                <div class="form-group">
        
                  <label for="nombre"><i class="fas fa-user"></i> Nombre completo:</label>
                  <input type="text" id="nombre" class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="email"><i class="fas fa-envelope"></i> Correo electrónico:</label>
                  <input type="email" id="email" class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="mensaje"><i class="fas fa-comment-alt"></i> Comentario:</label>
                  <textarea id="mensaje" class="form-control" required></textarea>
                </div>
              </form>
            `,
                  showCloseButton: true,
                  focusConfirm: false,
                  preConfirm: () => {
                    const form = document.getElementById('pqrs-form');
                    const tipo = form.tipo.value;
                    const nombre = form.nombre.value;
                    const email = form.email.value;
                    const mensaje = form.mensaje.value;
                
                    // Mostrar un mensaje de confirmación antes de enviar el correo
                    Swal.fire({
                      title: '¿Estás seguro de enviar estos datos?',
                      html: `
                            Tipo: ${tipo}<br>
                            Nombre: ${nombre}<br>
                            email: ${email}<br>
                            Mensaje: ${mensaje}
                            `,
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Sí, enviar',
                      cancelButtonText:   
                 'Cancelar'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // Si el usuario confirma, enviar la solicitud fetch
                        fetch('https://api-pqrs-7vca.onrender.com/enviar_correo', { 
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ tipo, nombre, email, mensaje })
                        })
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('Error al enviar el correo');
                          }
                          return response.json(); 
                        })
                        .then(data => {
                          Swal.fire('Correo enviado con éxito', '', 'success'); 
                        })
                        .catch(error => {
                          Swal.fire('Error', error.message, 'error');
                        });
                      }
                    });
                  }
              });
          });
      } else {
          console.error("Error: No se encontró el botón flotante.");
      }
  }, 100); 

  const event = new CustomEvent('headerLoaded');
  window.dispatchEvent(event);
}

window.onload = createHeader;
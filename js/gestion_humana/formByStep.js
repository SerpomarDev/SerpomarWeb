document.addEventListener("DOMContentLoaded", function () {
    let current_fs, next_fs, previous_fs;
    let opacity;
    let current = 1;
    const fieldsets = document.querySelectorAll("fieldset");
    const steps = fieldsets.length;
    
    setProgressBar(current);
  
     // Avanzar al siguiente fieldset
    document.querySelectorAll(".next").forEach(button => {
      button.addEventListener("click", function () {
        current_fs = this.parentElement;
        next_fs = current_fs.nextElementSibling;
  
        // Añadir clase 'active'
        document.querySelectorAll("#progressbar li")[Array.from(fieldsets).indexOf(next_fs)].classList.add("active");
  
        // Mostrar el siguiente fieldset
        next_fs.style.display = "block";
        
        // Animar el ocultado del current fieldset
        let fadeEffect = setInterval(() => {
          if (!opacity) {
            opacity = 1;
          }
          if (opacity > 0) {
            opacity -= 0.05;
            current_fs.style.opacity = opacity;
          } else {
            clearInterval(fadeEffect);
            current_fs.style.display = "none";
            current_fs.style.position = "relative";
            next_fs.style.opacity = 1;
            opacity = null;
          }
        }, 10);
  
        setProgressBar(++current);
      });
    });
  
    document.querySelectorAll(".previous").forEach(button => {
      button.addEventListener("click", function () {
        current_fs = this.parentElement;
        previous_fs = current_fs.previousElementSibling;
  
        // Quitar clase 'active'
        document.querySelectorAll("#progressbar li")[Array.from(fieldsets).indexOf(current_fs)].classList.remove("active");
  
        // Mostrar el previous fieldset
        previous_fs.style.display = "block";
  
        // Animar el ocultado del current fieldset
        let fadeEffect = setInterval(() => {
          if (!opacity) {
            opacity = 1;
          }
          if (opacity > 0) {
            opacity -= 0.05;
            current_fs.style.opacity = opacity;
          } else {
            clearInterval(fadeEffect);
            current_fs.style.display = "none";
            current_fs.style.position = "relative";
            previous_fs.style.opacity = 1;
            opacity = null;
          }
        }, 10);
  
        setProgressBar(--current);
      });
    });
  
    function setProgressBar(curStep) {
      const percent = parseFloat(100 / steps) * curStep;
      document.querySelector(".progress-bar").style.width = percent.toFixed() + "%";
    }
  
  });
  
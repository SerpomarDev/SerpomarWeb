// Buscar dentro de la tabla
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const tablaDatos = document.getElementById('preventas');
    const rows = tablaDatos.getElementsByTagName('tr');
  
    searchInput.addEventListener('input', function() {
      const searchText = this.value.toLowerCase();
  
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
  
        for (let j = 0; j < cells.length; j++) {
          const cellText = cells[j].innerText.toLowerCase();
          if (cellText.includes(searchText)) {
            found = true;
            break;
          }
        }
  
        if (found) {
          rows[i].style.display = '';
        } else {
          rows[i].style.display = 'none';
        }
      }
    });
  });
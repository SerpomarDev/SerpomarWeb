document.addEventListener('DOMContentLoaded', function() {
    const selectClientesManual = document.getElementById('selectClientesManual');
    const clienteSelectContainer = document.getElementById('clienteSelectContainer');
    const loader = document.getElementById('loader');

    // Función para mostrar el loader
    function showLoader() {
        loader.style.display = 'block';
    }

    // Función para ocultar el loader
    function hideLoader() {
        loader.style.display = 'none';
    }

    // Verificar si hay un valor guardado en localStorage para 'cliente'
    const storedCliente = localStorage.getItem('cliente');

    if (storedCliente) {
        // Si hay un cliente almacenado, ocultar el selector de cliente
        clienteSelectContainer.style.display = 'none';

        // Mostrar el loader antes de la posible recarga
        showLoader();

        // Simular una carga de datos (reemplaza esto con tu lógica real de carga de datos)
        setTimeout(function() {
            hideLoader();
        }, 1000); // Ocultar el loader después de 1 segundo (ajusta según sea necesario)

    } else {
        // Si no hay un cliente almacenado, mostrar el selector de cliente
        clienteSelectContainer.style.display = 'block';

        // Llenar el select con las opciones (código optimizado)
        const clientes = [
            "JOLI FOODS S.A.S.", "OCEANOS S.A.", "PRODUCTOS AUTOADHESIVOS ARCLAD S.A",
            "QUIMICA COMERCIAL ANDINA S A S", "SYRUS QCA S.A.S", "ESENTTIA S A",
            "RECICLAJES SF S.A.S.", "PANELTEC S.A.", "KNAUF DE COLOMBIA S.A.S.",
            "KNAUF DISTRIBUIDORA S.A.S", "KENWORTH DE LA MONTAÑA S.A.S.",
            "INDUSTRIA NACIONAL DE GASEOSAS S.A.", "GYPLAC S.A.", "ETEX COLOMBIA S.A.",
            "ESENTTIA MASTERBATCH LTDA", "EMBOTELLADORA DE LA SABANA SAS",
            "DSV AIR & SEA SAS", "DISAN COLOMBIA S.A.S", "CARIBBEAN TRADE S A S",
            "CAMBRIDGE LLC SUCURSAL COLOMBIA", "C.I. ALLINVESMENT S.A.S.",
            "BIMBO DE COLOMBIA S.A.", "ALPLA COLOMBIA LTDA",
            "AGENCIA DE ADUANAS HUBEMAR S.A.S NIVEL 1", "PAPELES NACIONALES S.A.",
            "QUIMICA INTERNACIONAL SA QUINTAL SA", "EUROFERT COLOMBIANA SAS",
            "ACCESORIOS Y VÁLVULAS APOLO S.A.S", "STEPAN COLOMBIA S.A.S",
            "SYNGENTA S.A.", "SOLUCIONES PLASTICAS CARIBE S.A.S.", "MANTOSCORP S.A.S",
            "INVERSIONES VIA TROPICAL S.A.S.", "BDP COLOMBIA S.A.", "CABOT COLOMBIANA",
            "PLASTIMIX SAS", "MERQUIAND S.A.S", "COCA-COLA BEBIDAS DE COLOMBIA S.A.",
            "INFEREX S.A.S", "DISAN AGRO SAS", "Juan García", "ASHLAND COLOMBIA SAS",
            "FUTURISTICO", "IMPORTADORA MULTI PARTES S.A.S",
            "EL CONSTRUCTOR, INVERSIONES S.A.", "BENCHMARK GENETICS COLOMBIA SAS",
            "BELLOTA COLOMBIA SAS", "JDF Servicios ZF",
            "CUATRO VIENTOS SPECIALTY ORIGINS S.A.S",
            "A LAUMAYER Y COMPAÑIA EXPORTADORES DE CAFE S.A.S.",
            "EQUIPOS Y LOGISTICA DEL CARIBE S.A.S", "TRANSILLANTAS SAS",
            "BASF QUÍMICA COLOBIANA S.A.", "BATERIAS WILLARD S.A.",
            "COMERCIALIZADORA INTERNACIONAL PROARCA S.A.S",
            "GRAN TIERRA OPERATIONS COLOMBIA", "BULKMATIC DE COLOMBIA SAS",
            "VEHIDIESEL S.A.S"
        ];

        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente;
            option.textContent = cliente;
            selectClientesManual.appendChild(option);
        });
    }

    // Guardar el valor seleccionado en localStorage en la clave 'cliente' y recargar (FUERA DEL ELSE)
    selectClientesManual.addEventListener('change', function() {
        localStorage.setItem('clienteselect', selectClientesManual.value);
        showLoader(); // Mostrar loader antes de recargar
        window.location.reload();
    });
});
// Comando para establecer la conexión
var socket = io();

// Creamos un alias para hacer referencia
// a las etiquetas HTML en 
var label = $('#lblListaCompra');
var producto = $('#producto');
var cantidad = $('#cantidad');
var autor = $('#autor');

/////////////////////////////////////////////////
/// Añadimos listener a lso campos para que funcionen
///     al pulsar intro
////////////////////////////////////////////////

// Get the input field
var input = document.getElementById("producto");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("anadirProducto").click();
    }
});

var select = document.getElementById("cantidad");

// Execute a function when the user releases a key on the keyboard
select.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("anadirProducto").click();
    }
});

//////////////////////////////////////////////////////////////////


function addCheckbox(name, estado, cantidad, autor, fecha) {
    var container = $('#tblListaCompra tbody');
    var inputs = container.find('input');
    var id = inputs.length + 1;

    moment().format();

    var fechaDias = moment().diff(moment(fecha), 'days');

    switch (fechaDias) {
        case 0:
            fechaDias = 'Hoy';
            break;
        case 1:
            fechaDias = 'Ayer';
            break;
        default:
            fechaDias = `Hace ${fechaDias} días`;
    }

    var cadenaProducto = `${name} - `;
    if (cantidad > 1) cadenaProducto += ` ( ${cantidad} ) - `;
    cadenaProducto += `${fechaDias}`;

    let filaTabla = '';

    if (estado) {
        filaTabla += '<tr class="filaComprado">';
    } else {
        filaTabla += '<tr class="filaPendiente">';
    }

    filaTabla += '<td style="text-align:center">';
    if (estado) {
        //$('<input />', { type: 'checkbox', id: 'cb' + id, value: name, class: 'productoCheckbox', checked: true }).appendTo(container);
        filaTabla += `<input type="checkbox" id="cb${id}" value="${name}" class="productoCheckbox" checked="checked"></input>`;
    } else {
        //$('<input />', { type: 'checkbox', id: 'cb' + id, value: name, class: 'productoCheckbox' }).appendTo(container);
        filaTabla += `<input type="checkbox" id="cb${id}" value="${name}" class="productoCheckbox"></input>`;
    }
    filaTabla += '</td>';

    filaTabla += '<td>';
    filaTabla += `<img id="borra${name}" src="imagenes/boton-borrar.png" class="imgBorrar" alt="${name}" style="height: 15px;"></img>`;
    filaTabla += '</td>'

    //$('<img />', { id: 'borra' + name, src: 'imagenes/boton-borrar.png', height: '15', class: 'imgBorrar', alt: name }).appendTo(container);

    filaTabla += '<td>';
    if (estado) {
        //$('<label />', { 'for': 'cb' + id, text: cadenaProducto, class: 'productoComprado' }).appendTo(container);
        filaTabla += `<label for="cb${id}" class="productoComprado">${name}</label>`;
    } else {
        //$('<label />', { 'for': 'cb' + id, text: cadenaProducto, class: 'productoPendiente' }).appendTo(container);
        filaTabla += `<label for="cb${id}" class="productoPendiente">${name}</label>`;
    }
    filaTabla += '</td>';

    filaTabla += '<td style="text-align:center">';
    filaTabla += `${autor}`;
    filaTabla += '</td>';

    filaTabla += '<td style="text-align:center">';
    filaTabla += `${cantidad}`;
    filaTabla += '</td>';

    filaTabla += '<td>';
    filaTabla += `${fechaDias}`;
    filaTabla += '</td>';

    filaTabla += '</tr>';

    $('#tblListaCompra tbody').append(filaTabla);

}

function actualizaLista(data) {

    // Se muestra la fecha de modificación de la lista
    var options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
    $('#fechaActualiza').text(new Date(data.fecha).toLocaleDateString("es-ES", options));

    // Se borra la lista anterior
    label.text('');
    $('#tblListaCompra tbody').empty();

    data.productosPendientes.forEach(producto => {
        addCheckbox(producto.nombre, false, producto.cantidad, producto.autor, producto.fecha);
    });

    data.productosComprados.forEach(producto => {
        //console.log('comprados');
        addCheckbox(producto.nombre, true, producto.cantidad, producto.autor, producto.fecha);
    });

    var elements = document.getElementsByClassName("imgBorrar");
    for (var i = 0; i < elements.length; i++) {
        //console.log(elements[i].id);
        elements[i].addEventListener('click', function(event) {

            var elementoId = event.target.id;

            borraProducto(document.getElementById(elementoId).alt);

        })
    }
}

function borraProducto(nombreProductoBorrar) {
    socket.emit('borrarProducto', { nombre: nombreProductoBorrar }, function(data) {

        //console.log('Respuesta server: Lista Vacía');
        //label.text('');

        actualizaLista(data);


    });
}

socket.on('connect', function() {
    //console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    //console.log('Desconectado del servidor');
});

//recibir evento on 
socket.on('actualizaLista', function(data) {

    actualizaLista(data);

});

$('#anadirProducto').on('click', function() {
    //console.log('clicka añadir: Usuario ' + $("input:radio[name='autor']:checked").val());
    socket.emit('crearProducto', { nombre: producto.val(), cantidad: cantidad.val(), autor: $("input:radio[name='autor']:checked").val() }, function(data) {

        //console.log('Respuesta server: ', productoCreado);
        //label.text(productoCreado.nombre + ' ' + productoCreado.cantidad);
        actualizaLista(data);
        producto.val('');
        cantidad.val('1');

    });

})

$('#borrarLista').on('click', function() {
    //console.log('click borrar');
    socket.emit('borrarLista', null, function() {

        //console.log('Respuesta server: Lista Vacía');
        label.text('');

    });
});

$(document).on('change ', '[type = checkbox]', function(event) {

    var elementoId = event.target.id;
    var nombreProducto = document.getElementById(elementoId).value;
    var estadoProducto = document.getElementById(elementoId).checked;

    //console.log(nombreProducto + ' ' + estadoProducto);

    socket.emit('cambiarEstadoProducto', { nombre: nombreProducto, estado: estadoProducto }, function(data) {
        actualizaLista(data);
    })

})

$('.productoComprado').on('click', function(event) {

    var elementoId = event.target.id;

    //console.log(elementoId);

})
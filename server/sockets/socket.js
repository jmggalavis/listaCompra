const { io } = require('../server');
const { ListaCompraControl } = require('../classes/lista-compra-control');
const { ProductoCompra } = require('../classes/lista-compra-control');


const listaCompraControl = new ListaCompraControl();

io.on('connection', (client) => {

    //console.log('Usuario conectado');

    listaActualizada = listaCompraControl.devolverListaCompra();
    client.emit('actualizaLista', listaActualizada);



    client.on('disconnect', () => {
        //console.log('Usuario desconectado');
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        //console.log(data);

        client.broadcast.emit('enviarMensaje', data);


        // if (mensaje.usuario) {
        //     callback({
        //         resp: 'TODO SALIO BIEN!'
        //     });

        // } else {
        //     callback({
        //         resp: 'TODO SALIO MAL!!!!!!!!'
        //     });
        // }



    });

    client.on('crearProducto', (data, callback) => {
        //console.log(`Autor: ${data.autor}`);

        let nuevoProducto = new ProductoCompra(data.nombre, data.cantidad, data.autor, null);

        //console.log(nuevoProducto);

        listaActualizada = listaCompraControl.crearProductoCompra(nuevoProducto);

        client.broadcast.emit('actualizaLista', listaActualizada);

        callback(listaActualizada);

    });

    client.on('borrarLista', (data, callback) => {
        listaCompraControl.borrarListaCompra();

        listaActualizada = listaCompraControl.devolverListaCompra();

        client.broadcast.emit('actualizaLista', listaActualizada);

        callback();
    });

    client.on('cambiarEstadoProducto', (data, callback) => {

        listaActualizada = listaCompraControl.cambiarEstado(data.nombre, data.estado);

        client.broadcast.emit('actualizaLista', listaActualizada);

        callback(listaActualizada);
    });

    client.on('borrarProducto', (data, callback) => {

        listaActualizada = listaCompraControl.borrarProducto(data.nombre);

        client.broadcast.emit('actualizaLista', listaActualizada);

        callback(listaActualizada);

    })

});
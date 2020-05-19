const fs = require('fs');

class ProductoCompra {

    constructor(nombre, cantidad, autor, fecha) {

        this.nombre = nombre;
        this.cantidad = cantidad;
        this.autor = autor;
        if (fecha === null) {
            this.fecha = new Date().getTime();
        } else {
            this.fecha = fecha;
        }

    }

    getProducto() {
        return {
            nombre: this.nombre,
            cantidad: this.cantidad,
            autor: this.autor,
            fecha: this.fecha
        };
    }


}

class ListaCompraControl {


    constructor() {

        this.productosPendientes = []; // Va a contener los productos pendientes de comprar
        this.productosComprados = []; // Array que va a contener los productos ya comprados

        let data = require('../data/data.json');

        this.productosPendientes = data.productosPendientes;
        this.productosComprados = data.productosComprados;
        if (data.ultimaModificacion === 0) {
            this.ultimaModificacion = new Date().getTime();
        } else {
            this.ultimaModificacion = data.ultimaModificacion;
        }


    }

    ////////////////////////////////////////////////////////////////////////////////
    // Borra todos los productos de la lista y reinicia a 0 la fecha de modificación
    ////////////////////////////////////////////////////////////////////////////////

    borrarListaCompra() {

        this.productosPendientes = [];
        this.productosComprados = [];
        this.ultimaModificacion = 0;
        this.grabarArchivo();


    }

    ////////////////////////////////////////////////////////////////////////////////
    // Ordena la lista de compra almacenados en el archivo por estado y fecha
    ////////////////////////////////////////////////////////////////////////////////

    ordenarListaCompra() {

        this.productosPendientes.sort(function(a, b) { return a.fecha - b.fecha });
        this.productosComprados.sort(function(a, b) { return a.fecha - b.fecha });

    }

    ////////////////////////////////////////////////////////////////////////////////
    // Carga un producto y lo añade a la lista de compra 
    ////////////////////////////////////////////////////////////////////////////////

    crearProductoCompra(productoCompra) {

        this.productosPendientes.push(productoCompra.getProducto());

        this.grabarArchivo();

        listaActualizada = this.devolverListaCompra();

        return listaActualizada;

    }

    ////////////////////////////////////////////////////////////////////////////////
    // Devuelve la lista de compra almacenada en el archivo
    ////////////////////////////////////////////////////////////////////////////////

    devolverListaCompra() {

        return {
            fecha: this.ultimaModificacion,
            productosPendientes: this.productosPendientes,
            productosComprados: this.productosComprados
        }

    }

    ////////////////////////////////////////////////////////////////////////////////
    // Borra un producto de la lista de productos en la que se encuentre
    ////////////////////////////////////////////////////////////////////////////////

    borrarProducto(nombre) {

        this.productosPendientes = this.productosPendientes.filter(producto => producto.nombre != nombre);
        this.productosComprados = this.productosComprados.filter(producto => producto.nombre != nombre);

        this.ordenarListaCompra();
        this.grabarArchivo();

        return this.devolverListaCompra();

    }

    ////////////////////////////////////////////////////////////////////////////////
    // Cambia un producto de una lista a otra al cambiar su estado
    ////////////////////////////////////////////////////////////////////////////////

    cambiarEstado(nombre, estado) {

        if (estado) {

            var productoComprado = this.productosPendientes.find(producto => producto.nombre === nombre);

            this.productosPendientes = this.productosPendientes.filter(producto => producto.nombre != nombre);
            this.productosComprados.push(productoComprado);

        } else {

            var devolverProductoComprado = this.productosComprados.find(producto => producto.nombre === nombre);

            this.productosComprados = this.productosComprados.filter(producto => producto.nombre != nombre);

            this.productosPendientes.push(devolverProductoComprado);
        }

        this.ordenarListaCompra();
        this.grabarArchivo();

        return this.devolverListaCompra();
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Carga la lista de compra con los datos almacenados en el archivo
    ////////////////////////////////////////////////////////////////////////////////

    grabarArchivo() {

        this.ultimaModificacion = new Date().getTime();
        let jsonData = {
            ultimaModificacion: this.ultimaModificacion,
            productosPendientes: this.productosPendientes,
            productosComprados: this.productosComprados
        };

        let jsonDataString = JSON.stringify(jsonData);

        fs.writeFileSync('./server/data/data.json', jsonDataString);

    }

}

module.exports = {
    ListaCompraControl,
    ProductoCompra
}
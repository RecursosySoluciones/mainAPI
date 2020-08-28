const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

var Ecommerce = new Schema({
    orderId: {
        type: String
    },
    fechaPedido: {
        type: String
    },
    clientName: {
        type: String
    },
    clientLastName: {
        type: String
    },
    clientDocument: {
        type: String
    },
    SKUName: {
        type: String
    },
    SKUValue: {
        type: Number
    },
    lineaLogueada: {
        type: String
    },
    statusClick: {
        type: String
    },
    motivoClick: {
        type: String
    },
    observacionesClick: {
        type: String
    },
    pedidoDelClick: {
        type: Number
    },
    tipoMail: {
        type: String
    },
    fechaMail: {
        type: String
    }
});


module.exports = mongoose.model('Ecommerce',Ecommerce);
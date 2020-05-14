const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

var Ecommerce = new Schema({
    orderId: {
        type: String,
        required: true
    },
    fechaPedido: {
        type: String,
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    clientLastName: {
        type: String,
        required: true
    },
    clientDocument: {
        type: Number,
        required: true
    },
    SKUName: {
        type: String,
        required: true
    },
    SKUValue: {
        type: Number,
        required: true
    },
    lineaLogeada: {
        type: Number
    },
    statusClick: {
        type: String,
        required: true
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
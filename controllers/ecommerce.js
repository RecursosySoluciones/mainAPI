const csvtojson = require('csvtojson');
const helper = require('./helper');
const views     = require('../views');
const FilesModel    = require('./files');
const ecommerceSchema = require('../database/migrations/ecommerce');
const ecommerce = require('../models/ecommerce');
const { where } = require('../database/migrations/ecommerce');

const controller = {
    async get (req, res) {
        let dataReturn = [],tempData;

        let { OrderId, clientDNI, limit } = req.query;

        let wh = {};

        if(OrderId) {
            wh['orderId'] = new RegExp(OrderId);
        }

        if(clientDNI) {
            wh['clientDocument'] = clientDNI
        }
        
        limit = limit ? parseInt(limit) : 10;
        let c = await ecommerceSchema.find().where(wh).limit(limit);
        for(let x = 0; x < c.length; x++){
            tempData = {
                id: c[x]._id,
                orderId: c[x].orderId,
                fechaPedido: c[x].fechaPedido,
                cliente: {
                    name: c[x].clientName,
                    lastName: c[x].clientLastName,
                    document: c[x].clientDocument,
                    linea: c[x].lineaLogeada
                },
                compra: {
                    SKU: c[x].SKUName,
                    valor: c[x].SKUValue
                },
                click: {
                    status: c[x].statusClick,
                    motivo: c[x].motivoClick,
                    observaciones: c[x].observacionesClick,
                    pedido: c[x].pedidoDelClick
                },
                mail: {
                    tipo: c[x].tipoMail,
                    fecha: c[x].fechaMail
                }
            }
            dataReturn.push(tempData);
        }
        return views.customResponse(res,true,200,"",dataReturn);
    },
    async update(req, res) {
        if(!req.files) return views.error.code(res, 'ERR_01'); 
        if(!req.files.file) return views.error.code(res, 'ERR_01'); 
        const file = req.files.file;
        // Guardamos el archivo
        let a = new FilesModel(req);
        archivo = await a.save();
        ecommerce.save(archivo).then(v => {
            if(v) {
                a.delete();
                return views.customResponse(res, true, 200, "Datos ecommerce", v);
                
            } else {
                return views.error.message(res, "Error al mostrar los datos de ecommerce"); 
            }
        }).catch(e => {
            return views.error.message(res, e.message);
        })
    }
}

module.exports = controller;
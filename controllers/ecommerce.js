const csvtojson = require('csvtojson');
const helper = require('./helper');
const views     = require('../views');
const FilesModel    = require('./files');
const ecommerceSchema = require('../database/migrations/ecommerce');


const controller = {
    async get (req, res) {
        let dataReturn = [],tempData;
        let c = await ecommerceSchema.find();
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

        // Comprobamos si es csv
        if(file.mimetype != "text/csv") return views.error.code(res, 'ERR_02'); 

        // Guardamos el archivo
        let archivo = new FilesModel(req);
        archivo = await archivo.save();
        await ecommerceSchema.deleteMany({});
        let data = await csvtojson({}).fromFile(archivo.url);
        let tempData;
        for(let x = 0; x < data.length; x++){
            tempData = {
                orderId:            controller.checkExcelError(data[x].Order),
                fechaPedido:        controller.checkExcelError(data[x]['Fecha pedido']),
                clientName:         controller.checkExcelError(data[x]['Client Name']),
                clientLastName:     controller.checkExcelError(data[x]['Client Last Name']),
                clientDocument:     controller.checkExcelError(data[x]['Client Document'],false),
                SKUName:            controller.checkExcelError(data[x]['SKU Name']),
                SKUValue:           controller.checkExcelError(data[x]['SKU Value'], false),
                lineaLogeada:       controller.checkExcelError(data[x]['Linea logeada'], false),
                statusClick:        controller.checkExcelError(data[x]['Estado (click)']),
                motivoClick:        controller.checkExcelError(data[x]['Motivo (click)']),
                observacionesClick: controller.checkExcelError(data[x]['Observaciones (click)']),
                pedidoDelClick:     controller.checkExcelError(data[x]['Pedidodel (click)'], false),
                tipoMail:           controller.checkExcelError(data[x]['Tipo mail']),
                fechaMail:          controller.checkExcelError(data[x]['Fecha mail'])
            }
            let c = new ecommerceSchema(tempData);
            c.save().then(v => {
                if(x + 1 == data.length) {
                    helper.files.deleteUploaded(archivo.id).then(v => {
                        return views.success.create(res);
                    })
                } 
            },(e => {
                console.log(e)
            }))
        }
    },
    checkExcelError: (valor, expectedValue = true) => {
        if(valor != undefined && typeof(valor) == 'string'){
            if(valor.indexOf('#') == -1){
                if(expectedValue){
                    return valor
                }else{
                    if(!isNaN(parseFloat(valor))){
                        return parseFloat(valor)
                    }else{
                        return 0;
                    }
                }
            }else{ 
                return expectedValue ? '' : 0;
            }
        }else{
            return expectedValue ? '' : 0;
        }
    }
}

module.exports = controller;
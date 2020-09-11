const ecommerceSchema = require('../database/migrations/ecommerce');
const { XLSXFile } = require('./XLSXFiles');

module.exports = {
    file: null,
    dataTobase: [],
    async save (file) {
        this.file = file;
        await this.getData();

        console.log("Antes de eliminar")
        await ecommerceSchema.deleteMany({});
        
        console.log("Antes de guardar")
        let c = await ecommerceSchema.insertMany(this.dataTobase);
        console.log(c, "Despues de guardar")

        return true;
    },
    async getData () {
        let data = await XLSXFile.getData(this.file);

        const requiredHeaders = [
            "Order",
            "Fecha pedido",
            "Client Name",
            "Client Last Name",
            "Client Document",
            "SKU Name",
            "SKU Value",
            "Linea logueada",
            "Estado (click)",
            "Motivo (click)",
            "Observaciones (click)",
            "Pedidodel (click)",
            "Tipo mail",
            "Fecha mail"
        ]

        for(let d of data) {
            let cnt = false;
            if(d.name == 'Mails' || d.name == 'Glosario' || d.name == 'Sucursales CORREO') continue;

            // Chequeamos las columnas requeridas
            for(let h of requiredHeaders) {
                if(!d.data.headers.includes(h)) throw new Error("Error en las columnas requeridas");
            }

            for(let row of d.data.rows) {
                this.dataTobase.push(new ecommerceSchema({
                    orderId:            row.Order,
                    fechaPedido:        row['Fecha pedido'],
                    clientName:         row['Client Name'],
                    clientLastName:     row['Client Last Name'],
                    clientDocument:     row['Client Document'],
                    SKUName:            row['SKU Name'],
                    SKUValue:           row['SKU Value'],
                    lineaLogueada:       row['Linea logueada'],
                    statusClick:        row['Estado (click)'],
                    motivoClick:        row['Motivo (click)'],
                    observacionesClick: row['Observaciones (click)'],
                    pedidoDelClick:     row['Pedidodel (click)'],
                    tipoMail:           row['Tipo mail'],
                    fechaMail:          row['Fecha mail']
                }))

            }
        }
    },
    checkExcelError (valor, expectedValue = true) {
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
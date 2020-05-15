let headers = (req, res, next) => {
    global.completeUrl = req.protocol + '://' + req.get('host');
    // Headers de respuesta 
   // if(process.env.ENVRIORMENT == 'development'){
    if(true){

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.setHeader('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    }
    next();
}

module.exports = headers;
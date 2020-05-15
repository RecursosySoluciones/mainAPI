let headers = (req, res, next) => {
    global.completeUrl = req.protocol + '://' + req.get('host');
    // Headers de respuesta 
   // if(process.env.ENVRIORMENT == 'development'){
    if(true){

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    }
    next();
}

module.exports = headers;
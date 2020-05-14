const helper        = require('./helper');
const views         = require('../views');

var controller = {
    principalView: (req, res) => {
        let ini = "<h1>API en desarrollo y testing <strong style='color:#f00;'>*los datos son ficticios*</strong></h1>";
        ini += "<h4>Desarrollador: Ramiro Macciuci &copy; &reg;</h4>"
        ini += "<h4>Cel: +54 11 2174 2416 | ramimacciuci@gmail.com</h4>"
        return res.status(200).send(ini);
    },
    test: (req, res) => {
        return views.success.test(res);
    },
    frontUtilities: (req, res) => {
        console.log('oka front utilities');
    },
    getPublicFile: (req, res) => {
        let section = req.params.section;
        let type = req.params.type;
        let file   = req.params.file;
        let url    = `public/${section}/${type}/${file}`;
        if(helper.files.exists(url)){
            helper.return.success.file(res,url);
        }else{
            helper.return.success.file(res,'public/notFound.jpg');
        }
    } 
}

module.exports = controller;
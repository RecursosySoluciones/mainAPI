const helper        = require('./helper');
const views         = require('../views');
const Users         = require('../models/users');
const password_hash = require('password-hash');
const Auth          = require('../middlewares/authentication');

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
    },
    login: async (req, res) => {
        const {email, password} = req.body;
        if(email == undefined || password == undefined) return views.error.code(res,'ERR_01');
        let consulta = await Auth.checkUser(email,password);
        if(!consulta) return views.error.code(res,'ERR_02');
        // Asignamos Token
        let token = new Auth(consulta[0]);
        token = await token.generarToken();
        if(!token) return views.error.code(res,'ERR_03');
        else return views.customResponse(res,true,202,"",{},helper.users.loggedUser(consulta[0],token))
    }   
}

module.exports = controller;

const express       = require('express');
const bodyParser    = require('body-parser');
const migrations    = require('./database/migrations/migrations');
const dotenv        = require('dotenv').config();
const fileUpload    = require('express-fileupload');
const helper        = require('./controllers/helper');
const views         = require('./views');
const cors		    = require('cors')
const app           = express();

global.baseUrl      = require('path').resolve(); // almacenamos la ruta absoluta

app.set('view engine','pug');

app.use(bodyParser.json());
app.use(fileUpload());

// Start Middlewares
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use(function(req,res,next) {
    if(req.method != "GET"){
        let auth = req.headers.authorization;
        if(!auth) return views.error.code(res,'ERR_03');
        auth = auth.split(' ');
        if(auth[0] != 'Bearer')return views.error.code(res,'ERR_03');
        if(helper.configFile().mainInfo.staticPass != auth[1])return views.error.code(res,'ERR_03');
        next();
    }else{
        next();
    }
})


/**
 * Auth.checkToken -> validara el token y permisos de usuario para las rutas registradas en config.json,
 * si la ruta no existe entonces no solicitara ni token ni validara permiso.
 * "routesPermissions": { --> objeto principal config.json
        "/test": { --> la ruta test solicitara token y permisos de usuarios
            "GET": 1, --> para el metodo GET solicitara nivel de usuario <= 1
            "POST": 1, --> para el metodo POST solicitara nivel de usuario <= 1
            "PUT": 1, --> para el metodo PUT solicitara nivel de usuario <= 1
            "DELETE": 1 --> para el metodo DELETE solicitara nivel de usuario <= 1
        }
    }

 */

migrations();

// End Middlewares

// Routes
app.use(require('./routes/index'));

module.exports = app;

const jwt           = require('jsonwebtoken');
const password_hash = require('password-hash');
const Users         = require('../models/users');
const Tokens        = require('../database/migrations/tokenTable');
const views         = require('../views');
const helper        = require('../controllers/helper')
const cfile         = helper.configFile();

const routesPath    = cfile.mainInfo.routes;
const TOKEN_PASS    = cfile.mainInfo.jwtPass;

class Auth {

    constructor(user) {
        this.user = user;
        return true;
    }

    async generarToken() {
        let tokenData = {
            id: this.user.id,
            email: this.user.email
        }
        let token = jwt.sign(tokenData,TOKEN_PASS,{
            expiresIn: 60 * 60 // Expires in 1 hour
        })
        let consulta = await Tokens.findOne({userId: this.user.id});
        if(!consulta){
            // generamos un registro nuevo
            let c = new Tokens({
                userId: this.user.id,
                token: token
            })
            c.save()
        }else{
            // Actualizamos el existente
            let c = await Tokens.updateOne({_id: consulta.id},{
                token: token
            })
            if(c.nModified == 0) return false;

        }
        return token;
    }

    static async checkToken(req, res, next) {
        let url = req.url;
        url = '/' + url.split('/')[3];
        if(cfile.routesPermissions[url]) {
            var token   = req.headers.authorization;
            if(!token) return views.error.code(res,'ERR_04');
            token = token.split(" ");
            if(token[0] != 'Bearer') return views.error.code(res,'ERR_04');

            jwt.verify(token[1], TOKEN_PASS, async (err, t) => {
                if(err) return views.error.code(res,'ERR_04');
                let user = await Users.get(t.id);
                // checkamos que el token almacenado a ese usuario sea el mismo
                let c = await Tokens.findOne({token: token[1]})
                if(!c || !(c.userId == t.id)) return views.error.code(res,'ERR_05');

                // Asignamos un nuevo token
                let newToken    = new Auth(user[0]);
                user[0].token   = await newToken.generarToken();;
                // Verificamos si el usuario esta autorizado
                let x = await Auth.UserPermissions(req, c.userId);
                if(!x) return views.error.code(res,'ERR_06');
                res.authUser = user;
                next();            
            })
        }else{
            next();
        }
    }

    static UserPermissions(req, userId){
        return new Promise(async (res,rej) => {
            let user = await Users.get(userId);
            let url = req.originalUrl;
            let method = req.method;
            url = url.split('/')[3];
            for(let x in cfile.routesPermissions){
                if(('/'+url) == x){
                    let perm = cfile.routesPermissions[x][method];
                    if (perm && perm >= user[0].level.id){
                        res(true)
                    }else{
                        return res(false)
                    }
                }
            }
            return res(false)
        })
    }

    static async checkUser(email, pass){
        let consulta = await Users.get(email);
        if(!consulta) return false;
        let originPass = consulta[0].password;
        if(!password_hash.verify(pass, originPass)) return false;
        else return consulta;
    }


}

module.exports = Auth;
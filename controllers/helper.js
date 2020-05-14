const fs            = require('fs');
const path          = require('path');
const files         = require('../database/migrations/Files');

var controller = {
    regExCheck: (value,type) => {
        let regEx, exp;
        switch(type){
            case 1:
                // SOLO PARA NUMEROSS
                regEx   = /^([0-9]{1,7})$/;
                exp     = new RegExp(regEx);
                return exp.test(value);
                // id regex
            break;
            case 2:
                regEx   = /^([A-Za-z]{1,15})+( [A-Za-z]{1,15})?$/;
                exp     = new RegExp(regEx);
                return exp.test(value);
            break;
            case 3:
                regEx   = /^([A-Za-z0-9\.\_\-]{1,20})+@+([a-z]{1,15})+(\.[a-z]{1,4})+(\.[a-z]{1,3})?$/;
                exp     = new RegExp(regEx);
                return exp.test(value);
            break; 
            case 4:
                // caso solo para planes de personal
                regEx   = /^([A-Za-z]{1,6})$/;
                exp     = new RegExp(regEx);
                return exp.test(value);
            break;
        }
    },
    objectSize: (obj) => {
        return Object.keys(obj).length
    },
    configFile: () => {
        let configFile = JSON.parse(fs.readFileSync("./config.json"));
        return configFile;
    },
    users: {
        getLevel(id) {
            let base = JSON.parse(fs.readFileSync('./database/json/userLevels.json'));
            let level = base.filter((value) => {
                if (value.ID == id) return true;
            })
            return level[0].NOMBRE;
        },
        loggedUser: (user, token) => {
            return {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                dni: user.dni,
                level: user.level.level,
                imagen: user.imagen,
                token: token ? token : user.token
            }
        }        
    },
    files:{
        delete: (path) => {
            try{
                fs.unlinkSync(path);
                return true;
            }catch (e) {
                return false;
            }
        },
        exists: (path, checkDir = false) => {
            try{
                let c = fs.statSync(path);
                return checkDir ? c.isDirectory() : c.isFile();
            }catch (e) {
                return false;
            }
        },
        deleteUploaded: (id) => {
            // Este metodo elimina el registro en la base de datos y en los archivos
            return new Promise((res, rej) => {
                files.findById(id).then((v) => {
                    controller.files.delete(v.url);
                    files.deleteOne({_id: id}).then((r) => {
                        if(r.deletedCount > 0) res(true);
                        else res(false)
                    })
                }).catch((e) => {
                    res(false);
                })
            })
        }
    },
    dates: {
        unix: () => {
            return Math.round((new Date()).getTime() / 1000);
        },
        mySqltoDate: (date) => {
            let obj = new Date(Date.parse(date));
            return `${obj.getDate()}/${obj.getMonth() + 1}/${obj.getFullYear()}`;
        }
    },
    return: {
        customResponse: (res, success = true, code = 200, msg = "", data = {}) => {
            return res.status(code).send({
                Success: success,
                Message: msg,
                Data: data,
                HttpCodeResponse: code
            });
        },
        error: {
            error: (res,msg = "") => controller.return.customResponse(res, false, 400, msg, {}),
            notFound: (res) => controller.return.customResponse(res,false,404,"Pagina o seccion no encontrada",[])
        },
        success: {
            file: (res, file) => res.sendFile(path.resolve(file)),
            test: (res) => controller.return.customResponse(res, true,200, "La API responde correctamente al test", {})
        }
    }
}

module.exports = controller;
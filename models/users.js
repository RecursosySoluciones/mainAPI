const helper        = require('../controllers/helper');
const password_hash = require('password-hash');
const userSchema    = require('../database/migrations/usersTable');
const files         = require('../database/migrations/Files');

/**
 * Clase para manejar usuarios 
 * 
 * Si en el constructor se especifica ID entonces va a modificar sobre 
 */
class Users {
    constructor(userObject = {}){
        let {
            id = 0, 
            name = false, 
            lastName = false, 
            dni = false,
            password = false,
            email = false,
            phone = false,
            level = false,
            imagen = false
        } = userObject

        this.id         = id;
        this.name       = name;
        this.lastName   = lastName;
        this.dni        = dni;
        this.password   = password === false ? password : password_hash.generate(password);
        this.email      = email;
        this.phone      = phone;
        this.level      = level;
        this.imagen     = imagen;
    }

    /**
     * Sirve para crear o modificar un usuario
     */
    async save() {
        // Preparamos el objeto de usuario
        let data = {};
        // Preparamos el objeto de usuario

        // Comprobamos si esta definido ID para ver si actualizar o crear
        if(this.id != 0){
            // Entonces buscamos el usuario para actualizarlo
            for (let x in this){
                if(x == 'id') continue;
                if(x == 'email') continue;
                if(this[x] !== false){
                    data[x] = this[x];
                }
            }
            let resultado = await Users.get(this.id);
            if(!resultado) return resultado; // devuelve false si no existe el usuario
            if(data.imagen !== false && resultado[0].imagen != "" && resultado[0].imagenObject){
                let deleteIMG = await helper.files.deleteUploaded(resultado[0].imagenObject._id);
                // console.log(deleteIMG)
            }
            let c = await userSchema.updateOne({_id: this.id},data)
            if(c.nModified > 0){
                return await Users.get(this.id, false);
            }else{
                return false;
            }
        }else{ // Entonces es porque se agrega un nuevo usuario
            // Comprobamos que esten todos los datos necesarios
            for (let x in this){
                if(x == 'id') continue;
                if(this[x] !== false){
                    data[x] = this[x];
                }
            }
            if(data.name == undefined ||
                data.lastName == undefined ||
                data.password == undefined ||
                data.email == undefined ||
                data.level == undefined) return false;
            
            // Comprobamos que no exista el usuario con ese email
            let consulta = await userSchema.find().where({email: data.email});
            if(consulta.length > 0) return false; 

            data.createdAt = Date.now();
            // Creamos el nuevo usuario
            let d = new userSchema(data);
            let c = await d.save();
            if(c._id != undefined){
                return await Users.get(c._id,false);
            }else{
                return false;
            }
        }

    }

    /**
     * Cambia el estado del usuario de activo a inactivo o viseversa
     */
    static async userChangeStatus(id = 0){
        if(id == 0) return false;
        let c = await userSchema.findById(id).where({userDelete: false})
        if(!c) return false;
        let status = c.userActive;
        let data = {};
        data.userActive = status ? false : true;
        let x = await userSchema.updateOne({_id: id},data)
        if(x.nModified == 0) return false;
        else return true;
    }

    /**
     * HardDelete a usuario
     */
    static async userDelete(id) {
        if(id == 0 || !id) return false;
        let c = await userSchema.findById(id).where({userDelete: false})
        if(!c) return false;
        let data = {
            userDelete: true
        }
        let x = await userSchema.updateOne({_id: id},data)
        if(x.nModified == 0) return false;
        else return true;
    }

    /**
     * 
     * @param {mixed} id 
     * 
     * @example userModel.get("ramimacciuci@gmail.com").then((v) => {
                    console.log(v);
                })
     */
    static async get(id = 0, allData = true){
        let where = {};
        let returnData = [];
        where.userDelete = false;
        if(helper.regExCheck(id,3)){
            // devuelve todos los usuarios
            where.email = id;
        }else if(id != 0){
            // Trae usuario especifico por id
            where._id = id;
        }
        let respuesta = await userSchema.find().where(where);
        if(respuesta.length == 0) return false;
        let img, userObject;
        for(let y = 0; y < respuesta.length; y++){
            if(respuesta[y].imagen){
                img = await files.findById(respuesta[y].imagen);
                respuesta[y].imagen = global.completeUrl + '/' + img.url;
            }
            userObject = {
                id: respuesta[y]._id,
                name: respuesta[y].name,
                lastName: respuesta[y].lastName,
                dni: respuesta[y].dni,
                email: respuesta[y].email,
                phone: respuesta[y].phone == null ? false : respuesta[y].phone,
                level: {
                    id: respuesta[y].level,
                    level: helper.users.getLevel(respuesta[y].level)
                },
                userActive: respuesta[y].userActive,
                imagen: respuesta[y].imagen == "" ? false : respuesta[y].imagen,
                dates: {
                    created: helper.dates.mySqltoDate(respuesta[y].createdAt),
                    updated: helper.dates.mySqltoDate(respuesta[y].updatedAt)
                }
            }
            if(allData){
                userObject.password = respuesta[y].password;
                userObject.imagenObject = img;
            }
            returnData.push(userObject)
            if(returnData.length == respuesta.length){
                return returnData;
            }
        } 

    }
}

module.exports = Users;


const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const password_hash = require('password-hash');

var Users = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true
    },
    dni: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phone: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 10
    },
    userDelete: {
        type: Boolean,
        default: false
    },
    userActive: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

let Model = mongoose.model('Users',Users);

let AdminUser = new Model({
    name: "Admin",
    lastName: "Admin",
    email: "ramimacciuci@gmail.com",
    password: password_hash.generate('admin'),
    level: 1,
    createdAt: new Date()
})
AdminUser.save().then(ok => ok).catch((err) => {
}); 



module.exports = Model;
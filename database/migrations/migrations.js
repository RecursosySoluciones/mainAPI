const helper = require('../../controllers/helper');
const db     = require('../../controllers/db');
const mongoose = require('mongoose');
const Schema    = mongoose.Schema;


// Users tables
const Files = require('./Files');
const Ecommerce = require('./ecommerce');

var migrations = function() {
    Files();       
    Ecommerce();    
}

module.exports = migrations;
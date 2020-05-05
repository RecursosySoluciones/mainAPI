const helper = require('../../controllers/helper');
const db     = require('../../controllers/db');
const mongoose = require('mongoose');
const Schema    = mongoose.Schema;


// Users tables
const usersTable = require('./usersTable');
const Files = require('./Files');

// ArticlesTable
const articlesTable                 = require('./articlesTable');
const articlesCategoriesTable       = require('./articlesCategoriesTable');
const articlesSubcategoriesTable    = require('./articlesSubcategoriesTable');
const articlesFiles                 = require('./articlesFiles');

var migrations = function() {
    usersTable();
    Files();
    articlesTable();
    articlesCategoriesTable();    
    articlesSubcategoriesTable(); 
    articlesFiles();              
}

module.exports = migrations;
const express       = require('express');
const helper        = require('../controllers/helper')
const cfile         = helper.configFile();
const routesPath    = cfile.mainInfo.routes;
const app = express();


app.use('/', require('./main'));
app.use(`${routesPath}/ecommerce`, require('./ecommerce'));

module.exports = app;

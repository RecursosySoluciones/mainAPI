const express       = require('express');
const helper        = require('../controllers/helper')
const main          = require('../controllers/main');
const cfile         = helper.configFile();
const routesPath    = cfile.mainInfo.routes;
const router        = express.Router();


router.get(`/`,main.principalView);
router.get(`${routesPath}/test`,main.test);
router.get(`${routesPath}/frontUtilities`, main.frontUtilities);
router.get(`/public/:section?/:type?/:file?`,main.getPublicFile);
router.post(`${routesPath}/login`, main.login);

module.exports = router;
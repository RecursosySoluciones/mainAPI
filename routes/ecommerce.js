const express           = require('express');
const ecommerce          = require('../controllers/ecommerce');


let router = express.Router();

router.route('/')
            .get(ecommerce.get)
            .post(ecommerce.update)

module.exports = router;
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/client/product.controller');
router.get('/', Controller.index);
router.get('/create', (req, res) => {
    res.render('client/pages/products/index')
});
module.exports = router;
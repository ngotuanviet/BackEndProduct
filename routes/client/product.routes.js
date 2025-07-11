const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/client/product.controller');
router.get('/', Controller.index);
router.post('/create', (req, res) => {
    const { title, description, price, discountPercentage, stock, thumbnail, status, position } = req.body
    res.render('client/pages/products/index')
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/client/cart.controller');
router.get('/', Controller.index);
router.post('/add/:productID', Controller.addPost);
router.get('/delete/:productID', Controller.deleteProduct);
router.get('/update/:productID/:quantity', Controller.updateQuantity)
module.exports = router;
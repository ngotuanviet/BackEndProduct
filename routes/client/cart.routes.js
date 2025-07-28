const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/client/cart.controller');
router.get('/', Controller.index);
router.post('/add/:productID', Controller.addPost);
router.delete('/delete/:productID', Controller.deleteProduct);
module.exports = router;
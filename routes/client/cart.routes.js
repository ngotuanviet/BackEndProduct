const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/client/cart.controller');
router.get('/', Controller.index);
router.post('/add/:productID', Controller.addPost);
module.exports = router;
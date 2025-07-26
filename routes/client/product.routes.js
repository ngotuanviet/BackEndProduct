const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/client/product.controller');
router.get('/', Controller.index);

// router.get('/:slug', Controller.detail)
router.get('/:slugCategory', Controller.ProductsByCategory)
module.exports = router;
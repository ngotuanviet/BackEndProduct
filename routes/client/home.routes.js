const express = require('express');
const Controller = require('../../controllers/client/home.controller');
const router = express.Router();
router.get('/', Controller.index);
router.get('/create', (req, res) => {
    res.render('client/pages/home/index')
});
module.exports = router;
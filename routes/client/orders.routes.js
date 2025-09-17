const express = require("express");
const Controller = require("../../controllers/client/orders.controller");
const router = express.Router();
router.get("/", Controller.index);
router.get("/detail/:id", Controller.detail);
module.exports = router;

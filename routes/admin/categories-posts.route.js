const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/categories-post.controller");
router.get("/", controller.index)
module.exports = router;
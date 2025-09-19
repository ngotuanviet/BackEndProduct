const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/posts.controller");
router.get("/", Controller.index);
module.exports = router;

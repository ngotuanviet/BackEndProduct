const express = require('express')
const router = express.Router()
const Controller = require("../../controllers/client/chat.controller")
router.get("/", Controller.index)
module.exports = router;
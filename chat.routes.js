const express = require("express");
const router = express.Router();
const chatMiddleware = require("../../Middleware/client/chat.Middleware");

const Controller = require("../../controllers/client/chat.controller");
router.get("/:roomChatID", chatMiddleware.isAccess, Controller.index);
module.exports = router;

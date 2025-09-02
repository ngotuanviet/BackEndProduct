const e = require("express");
const Controller = require("../../controllers/client/rooms-chat.controller");
const router = e.Router();
router.get("/", Controller.index);
module.exports = router;

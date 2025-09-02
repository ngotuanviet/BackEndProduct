const e = require("express");
const Controller = require("../../controllers/client/rooms-chat.controller");
const router = e.Router();
router.get("/", Controller.index);
router.get("/create", Controller.create);
router.post("/create", Controller.createPost);
module.exports = router;

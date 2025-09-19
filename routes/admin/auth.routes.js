const controller = require("../../controllers/admin/auth.controller");
const express = require("express");
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");
const validates = require("../../Middleware/validates/admin/auth.validates");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.get("/login", controller.index);
router.post("/login", validates.loginValidate, controller.login);
router.get("/logout", controller.logout);
module.exports = router;

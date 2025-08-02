const express = require('express');
const router = express.Router()
const Controller = require("../../controllers/admin/settings.controller");
const multer = require('multer')
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");

const upload = multer()
router.get("/general", Controller.general)
router.patch("/general", upload.single('logo'), uploadCloud.upload, Controller.generalPATCH)

module.exports = router
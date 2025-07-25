const controller = require("../../controllers/admin/my_account.controller")
const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");

router.get("/", controller.infoAcccount
);
router.get("/edit", controller.editAccount);

router.patch("/edit",
    upload.single('avatar'),
    uploadCloud.upload,
    controller.editAccountPATCH);
module.exports = router;
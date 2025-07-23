const controller = require("../../controllers/admin/accounts.controller")
const express = require('express');
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");
const validates = require("../../Middleware/validates/admin/accounts.validates");

const multer = require('multer')
const upload = multer()

const router = express.Router();
router.get("/", controller.index
);
router.get("/create", controller.create);
router.post("/create",

    upload.single('avatar'),
    uploadCloud.upload,
    controller.createPOST);
router.patch("/changeStatus/:status/:id", controller.changeStatus);
module.exports = router;
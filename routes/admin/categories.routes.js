const controller = require("../../controllers/admin/categories.controller")
const express = require('express');
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");
const validates = require("../../Middleware/validates/admin/categories.validates");

const multer = require('multer')
const upload = multer()

const router = express.Router();
router.get("/", controller.index
);
router.get("/create", controller.create);
router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validates.createPost,
    controller.createPost);
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)

module.exports = router;
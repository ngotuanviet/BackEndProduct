const express = require('express');
const router = express.Router();
const multer = require('multer')

const upload = multer()
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/categories-post.controller");
router.get("/", controller.index)
router.patch("/changeStatus/:status/:id", controller.changeStatus)
router.get("/create", controller.create)
router.post("/create", upload.single('thumbnail'),
    uploadCloud.upload, controller.createPost)
router.get("/edit/:id", controller.edit)
router.patch("/edit/:id", upload.single('thumbnail'),
    uploadCloud.upload, controller.editPost)
router.delete("/delete/:id", controller.deleteID)
module.exports = router;
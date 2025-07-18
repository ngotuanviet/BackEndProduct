const express = require('express');
const multer = require('multer')

const upload = multer()
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const validates = require("../../Middleware/validates/admin/products.validates");
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");


router.get("/", controller.index)
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)
router.delete("/delete/:id", controller.deleteProduct)
router.get("/create", controller.createProduct)
router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validates.createPost,
    controller.createProductPOST
)

router.get("/edit/:id",
    controller.editProduct
)
router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validates.createPost,
    controller.editProductPatch
)
router.get("/detail/:id",
    controller.detailProduct
)
module.exports = router;
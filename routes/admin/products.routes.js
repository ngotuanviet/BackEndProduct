const express = require('express');
const multer = require('multer')
const storageMulter = require("../../helper/storageMulter")

const upload = multer({ storage: storageMulter() })
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const validates = require("../../Middleware/validates/admin/products.validates");


router.get("/", controller.index)
router.patch("/change-status/:status/:id", controller.changeStatus)
router.patch("/change-multi", controller.changeMulti)
router.delete("/delete/:id", controller.deleteProduct)
router.get("/create", controller.createProduct)
router.post("/create",
    upload.single('thumbnail'),
    validates.createPost,
    controller.createProductPOST

)

router.get("/edit/:id",
    controller.editProduct
)
router.patch("/edit/:id",
    upload.single('thumbnail'),
    validates.createPost,
    controller.editProductPatch
)

module.exports = router;
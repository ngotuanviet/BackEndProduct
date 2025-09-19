const controller = require("../../controllers/admin/categories.controller");
const express = require("express");
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");
const validates = require("../../Middleware/validates/admin/categories.validates");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.array("thumbnail", 5),

  uploadCloud.upload,
  validates.createPost,
  controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.array("thumbnail", 5),

  uploadCloud.upload,
  validates.createPost,
  controller.editPost
);
router.delete("/delete/:id", controller.deleteID);
module.exports = router;

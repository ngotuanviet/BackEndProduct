const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const controller = require("../../controllers/admin/posts.controller");
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deletePost);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.array("thumbnail", 5),
  uploadCloud.upload,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.array("thumbnail", 5),
  uploadCloud.upload,
  controller.editPost
);
router.get("/detail/:id", controller.detailPost);
module.exports = router;

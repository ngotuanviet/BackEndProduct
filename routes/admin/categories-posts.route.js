const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/categories-post.controller");

const checkPermission = (permission) => (req, res, next) => {
  if (res.locals.rolesUser.permissions.includes(permission)) {
    next();
  } else {
    res.redirect("back");
  }
};

router.get("/", checkPermission("posts-category_view"), controller.index);
router.patch(
  "/changeStatus/:status/:id",
  checkPermission("posts-category_edit"),
  controller.changeStatus
);
router.get(
  "/create",
  checkPermission("posts-category_create"),
  controller.create
);
router.post(
  "/create",
  checkPermission("posts-category_create"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createPost
);
router.get(
  "/edit/:id",
  checkPermission("posts-category_edit"),
  controller.edit
);
router.patch(
  "/edit/:id",
  checkPermission("posts-category_edit"),
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPost
);
router.delete(
  "/delete/:id",
  checkPermission("posts-category_delete"),
  controller.deleteID
);
module.exports = router;

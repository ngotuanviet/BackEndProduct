const controller = require("../../controllers/admin/accounts.controller");
const express = require("express");
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");
const validates = require("../../Middleware/validates/admin/accounts.validates");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",

  upload.array("avatar", 5),

  uploadCloud.upload,
  controller.createPOST
);
router.patch("/changeStatus/:status/:id", controller.changeStatus);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.array("avatar", 5),

  uploadCloud.upload,
  controller.editPatch
);
router.delete("/delete/:id", controller.deleteID);
module.exports = router;

const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/settings.controller");
const multer = require("multer");
const uploadCloud = require("../../Middleware/admin/uploadCloud.middleware");

const upload = multer({ storage: multer.memoryStorage() });
router.get("/general", Controller.general);
router.patch(
  "/general",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "slider1", maxCount: 1 },
    { name: "slider2", maxCount: 1 },
    { name: "slider3", maxCount: 1 },
  ]),
  uploadCloud.upload,
  Controller.generalPATCH
);

module.exports = router;

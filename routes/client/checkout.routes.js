const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");
router.get("/", controller.index);
router.post("/order", controller.order);
router.post("/payment", controller.payment);
router.post("/create-payment-link", controller.pay);
router.get("/success/:orderID", controller.success);
router.get("/cancel", controller.cancel);

module.exports = router;

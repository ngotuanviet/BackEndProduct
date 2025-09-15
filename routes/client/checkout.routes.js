const express = require("express");
const router = express.Router();
const validate = require("../../Middleware/client/checkout.validates");
const controller = require("../../controllers/client/checkout.controller");
router.get("/", controller.index);
router.post("/order", validate.checkoutFormValidate, controller.order);
router.post("/payment", controller.payment);
router.post("/create-payment-link", controller.pay);
router.get("/success/:orderID", controller.success);
router.get("/cancel", controller.cancel);

module.exports = router;

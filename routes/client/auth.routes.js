const express = require('express');
const router = express.Router();
const Controller = require("../../controllers/client/auth.controller");
const validate = require("../../Middleware/client/validate.middleware");
router.get("/register", Controller.register)
router.post("/register", validate.validateRegister, Controller.registerPOST)
router.get("/login", Controller.login)
router.post("/login", validate.validateLogin, Controller.loginPost)
router.get("/logout", Controller.logOut)
router.get("/password/forgot", Controller.forgotPasswordGet)
router.post("/password/forgot", validate.validateFogotPassword, Controller.forgotPasswordPost)

module.exports = router
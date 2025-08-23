const md5 = require("md5");
const Users = require("../../models/Users.model");
const generate = require("../../helper/generate");
const sendMailHelper = require("../../helper/sendMail");
const forgotPassword = require("../../models/forgotPassword.model");
const Cart = require("../../models/Carts.model");
const register = (req, res) => {
  res.render("client/pages/auth/register", {
    title: "Đăng ký",
  });
};
const registerPOST = async (req, res) => {
  const exitsEmail = await Users.findOne({ email: req.body.email });
  if (exitsEmail) {
    req.flash("error", "Email đã tồn tại, vui lòng dùng tài khoản khác!");
    res.redirect("/user/register");
  }
  req.body.password = md5(req.body.password);
  const user = await Users(req.body);
  await user.save();
  req.flash("success", "Đăng ký thành công");
  res.cookie("tokenUser", user.token);
  res.redirect("/");
};
const login = (req, res) => {
  res.render("client/pages/auth/login", {
    title: "Đăng nhập",
  });
};
const loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({
    email,
    deleted: false,
    status: "active",
  });
  if (user) {
    if (user.password === md5(password)) {
      req.flash("success", "Đăng nhập thành công");
      res.cookie("tokenUser", user.token);

      const cart = await Cart.findOne({ user_id: user.id });
      if (cart) {
        res.cookie("cartID", cart.id);
      }
      await Cart.updateOne({ _id: req.cookies.cartID }, { user_id: user.id });
      await Users.updateOne({ token: user.token }, { statusOnline: "online" });
      res.redirect("/");
    } else {
      req.flash("error", "Mật khẩu không đúng");
      res.redirect("/user/login");
    }
  } else {
    req.flash("error", "Email không tồn tại");
    res.redirect("/user/login");
  }
  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("/user/login");
  }
};
const logOut = async (req, res) => {
  await Users.updateOne(
    { token: req.cookies.tokenUser },
    { statusOnline: "offline" }
  );
  res.clearCookie("tokenUser");
  res.clearCookie("cartID");
  res.redirect("/");
};
const forgotPasswordGet = (req, res) => {
  res.render("client/pages/auth/forgotPassword", {
    title: "Quên mật khẩu",
  });
};
const forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({ email, deleted: false, status: "active" });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("/user/password/forgot");
  }

  // lưu thông tin vào database
  const objectForgotPassword = {
    email: email,
    otp: generate.generateRandomNumber(6),
    expiresAt: Date.now(),
  };
  const forgot = new forgotPassword(objectForgotPassword);
  await forgot.save();
  // gửi email
  const subject = "Xác thực OTP lấy lại mật khẩu";
  const html = `Mã OTP để lấy lại mật khẩu là <b>${objectForgotPassword.otp}. Thời hạn sử dụng là 3 phút</b>`;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};
const otp = async (req, res) => {
  const { email } = req.query;
  res.render("client/pages/auth/otp", {
    title: "Xác thực OTP",
    email,
  });
};
const otpPost = async (req, res) => {
  const { email, otp } = req.body;

  const checkOTP = await forgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!checkOTP) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect(`/user/password/otp?email=${email}`);
  }
  const user = await Users.findOne({ email });
  res.cookie("tokenUser", user.token);
  res.redirect("/user/password/reset");
};
const reset = (req, res) => {
  res.render("client/pages/auth/reset", {
    title: "Đặt lại mật khẩu",
  });
};
const resetPost = async (req, res) => {
  const { password } = req.body;
  const tokenUser = req.cookies.tokenUser;
  await Users.updateOne({ token: tokenUser }, { password: md5(password) });
  req.flash("success", "Đặt lại mật khẩu thành công");
  res.redirect("/");
};
const info = async (req, res) => {
  res.render("client/pages/auth/info", {
    title: "Thông tin tài khoản",
  });
};
module.exports = {
  register,
  registerPOST,
  login,
  loginPost,
  logOut,
  forgotPasswordGet,
  forgotPasswordPost,
  otp,
  otpPost,
  reset,
  resetPost,
  info,
};

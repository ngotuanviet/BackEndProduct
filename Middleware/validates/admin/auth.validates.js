const loginValidate = (req, res, next) => {
  const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  const { email, password } = req.body;
  if (!email) {
    req.flash("error", "Vui lòng nhập email");
    return res.redirect("/admin/auth/login");
  }
  if (!password) {
    req.flash("error", "Vui lòng nhập mật khẩu");
    return res.redirect("/admin/auth/login");
  }
  if (!regex.test(email)) {
    req.flash("error", "Email không hợp lệ");
    return res.redirect("/admin/auth/login");
  }
  next();
};
module.exports = {
  loginValidate,
};

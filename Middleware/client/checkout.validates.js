const checkoutFormValidate = (req, res, next) => {
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

  const { fullName, email, phone, address, note } = req.body;
  if (!fullName || !email || !phone || !address) {
    return (
      req.flash("error", "Vui lòng điền đầy đủ thông tin"),
      res.redirect("/checkout")
    );
  }
  if (!regexPhoneNumber.test(phone)) {
    return (
      req.flash("error", "Số điện thoại không hợp lệ"),
      res.redirect("/checkout")
    );
  }
  next();
};
module.exports = {
  checkoutFormValidate,
};

const checkoutFormValidate = (req, res, next) => {
  const regexPhoneNumber = /^(0|\+84)\d{9,10}$/;
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const { fullName, email, phone, address } = req.body;

  if (!fullName || !email || !phone || !address) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin");
    return res.redirect("back");
  }

  if (!regexPhoneNumber.test(phone)) {
    req.flash("error", "Số điện thoại không hợp lệ");
    return res.redirect("back");
  }

  if (!regexEmail.test(email)) {
    req.flash("error", "Email không hợp lệ");
    return res.redirect("back");
  }
  console.log("t");

  next();
};
module.exports = {
  checkoutFormValidate,
};

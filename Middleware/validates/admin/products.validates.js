const systemConfig = require("../../../config/system");
const createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề sản phẩm")
        return res.redirect(`${systemConfig.prefixAdmin}/products/create`)
    }

    next();
}
module.exports = {
    createPost

}
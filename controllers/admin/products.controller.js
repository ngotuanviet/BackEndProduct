const Product = require("../../models/Product.model")

// [Get] /admin/products
const index = async (req, res) => {
    const products = await Product.find({
        deleted: 'false'
    })
    console.log(products);

    res.render('admin/pages/products/index', {
        title: "Trang quản lý sản phẩm",
        products
    })
}
module.exports = {
    index
}
const Product = require("../../models/Product.model")
const filtersStatusHelper = require("../../helper/filtersStatus")
// [Get] /admin/products
const index = async (req, res) => {
    const { status, keyword } = req.query;
    let find = {
        deleted: 'false',

    };

    // bộ lọc
    const filtersStatus = filtersStatusHelper(status, find)
    console.log(filtersStatus);


    if (keyword) {
        find.title = { $regex: keyword, $options: "i" }
    } else {
        find.title = { $regex: "", $options: "i" }
    }
    const products = await Product.find(find)


    res.render('admin/pages/products/index', {
        title: "Trang quản lý sản phẩm",
        products,
        filtersStatus
    })
}
module.exports = {
    index
}
const Product = require("../../models/Product.model")
const filtersStatusHelper = require("../../helper/filtersStatus")
const searchHelper = require("../../helper/search")

// [Get] /admin/products
const index = async (req, res) => {
    const { status, keyword } = req.query;
    let find = {
        deleted: 'false',

    };

    // bộ lọc
    const filtersStatus = filtersStatusHelper(status, find)
    const keywordSearch = searchHelper(keyword)
    if (keywordSearch.keyword) {
        find.title = keywordSearch.regex
    }




    const products = await Product.find(find)


    res.render('admin/pages/products/index', {
        title: "Trang quản lý sản phẩm",
        products,
        filtersStatus,
        keyword: keywordSearch.keyword
    })
}
module.exports = {
    index
}
const Product = require("../../models/Product.model")
const productsHelper = require("../../helper/products")
// [GET] /
const index = async (req, res) => {
    const featuredProducts = await Product.find({
        status: 'active',
        deleted: 'false',
        featured: "1"
    }).sort({ position: "desc" }).limit(6)
    const newProducts = productsHelper.priceNewProducts(featuredProducts)

    res.render('client/pages/home/index', {
        title: "Trang chủ",
        LayoutProductsCategory: res.locals.Categories,
        featuredProducts: newProducts
    })
}

module.exports = {
    index
}
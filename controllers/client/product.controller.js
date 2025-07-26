const Product = require("../../models/Product.model")
const productsHelper = require("../../helper/products")
// [get] /products
const index = async (req, res) => {
    const products = await Product.find({
        status: 'active',
        deleted: 'false'
    }).sort({ position: "desc" })
    const newProducts = productsHelper.priceNewProducts(products)
    res.render('client/pages/products/index', {
        title: "Sản phẩm",
        products: newProducts,
        LayoutProductsCategory: res.locals.Categories
    })
}
const detail = async (req, res) => {
    const { slug } = req.params;
    const find = {
        deleted: 'false',
        status: 'active',
        slug: slug
    }
    const product = await Product.findOne(find)

    res.render('client/pages/products/detail', {
        title: "Sản phẩm",
        LayoutProductsCategory: res.locals.Categories,
        product
    })

}
module.exports = {
    index,
    detail
}
const Product = require("../../models/Product.model")
const productsHelper = require("../../helper/products")
// [GET] /
const index = async (req, res) => {
    // Lấy sản phẩm HOT
    const featuredProducts = await Product.find({
        status: 'active',
        deleted: 'false',
        featured: "1"
    }).limit(6)
    const newProducts = productsHelper.priceNewProducts(featuredProducts)


    // lấy sản phẩm mới nhất
    const ProductsPosition = await Product.find({
        status: 'active',
        deleted: 'false',
    }).sort({ position: "desc" }).limit(6)
    const newProductsPosition = productsHelper.priceNewProducts(ProductsPosition)
    res.render('client/pages/home/index', {
        title: "Trang chủ",
        LayoutProductsCategory: res.locals.Categories,
        featuredProducts: newProducts,
        ProductsPosition: newProductsPosition
    })
}

module.exports = {
    index
}
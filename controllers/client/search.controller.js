const Products = require("../../models/Product.model")
const productsHelper = require("../../helper/products")
const index = async (req, res) => {
    const { keywords } = req.query;
    const find = {
        deleted: 'false',
        status: 'active'
    }
    if (keywords) {
        find.title = { $regex: keywords, $options: 'i' }
    } else {
        return res.redirect('/')
    }

    const product = await Products.find(find)
    const newProducts = productsHelper.priceNewProducts(product)
    res.render('client/pages/search/index', {
        title: "Kết quả tìm kiếm",
        LayoutProductsCategory: res.locals.Categories,
        products: newProducts,
        keywords
    })
}
module.exports = {
    index

}
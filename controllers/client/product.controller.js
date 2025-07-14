const Product = require("../../models/Product.model")
// [get] /products
const index = async (req, res) => {
    const products = await Product.find({
        status: 'active',
        deleted: 'false'
    }).sort({ position: "desc" })
    const newProducts = products.map((item) => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(3);
        item.price = item.price.toFixed(3);
        return item;
    })


    res.render('client/pages/products/index', {
        title: "Sản phẩm",
        products: newProducts
    })
}
module.exports = {
    index
}
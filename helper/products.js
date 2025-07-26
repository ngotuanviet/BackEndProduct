const priceNewProducts = (Products) => {
    Products.map((item) => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        item.price = item.price.toFixed(0);
        return item;
    })
    return Products
}
const priceNewProductsOne = (product) => {
    const priceNew = (product.price * (100 - product.discountPercentage) / 100).toFixed(0);
    return priceNew
}
module.exports = {
    priceNewProducts, priceNewProductsOne
}
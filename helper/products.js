const priceNewProducts = (Products) => {
    Products.map((item) => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        item.price = item.price.toFixed(0);
        return item;
    })
    return Products
}
module.exports = {
    priceNewProducts
}
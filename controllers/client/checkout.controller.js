const Cart = require("../../models/Carts.model");
const Product = require("../../models/Product.model");
const ProductsHelper = require("../../helper/products");
const Orders = require("../../models/Orders.model");
const index = async (req, res) => {
    const cartID = req.cookies.cartID;
    const dataCart = await Cart.findOne({ _id: cartID })
    if (dataCart.products.length > 0) {
        for (const item of dataCart.products) {
            const productId = item.product_id
            const productInfo = await Product.findOne({ _id: productId, deleted: false, status: 'active' }).select('title price thumbnail slug discountPercentage')
            productInfo.priceNew = ProductsHelper.priceNewProductsOne(productInfo)
            productInfo.totalPrice = item.quantity * productInfo.priceNew
            item.productInfo = productInfo
        }
    }
    dataCart.totalPrice = dataCart.products.reduce((total, item) => {
        return total + item.productInfo.totalPrice
    }, 0)
    res.render('client/pages/checkout/index', {
        title: "Đặt hàng",
        LayoutProductsCategory: res.locals.Categories,
        dataCart
    })
}
// [POST] /checkout/order
const order = async (req, res) => {
    const cartID = req.cookies.cartID;
    const userOrder = req.body;
    const cart = await Cart.findOne({ _id: cartID })
    console.log(cart);

    const products = []
    for (const item of cart.products) {
        const objectProducts = {
            product_id: item.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: item.quantity
        }
        const productInfo = await Product.findOne({ _id: objectProducts.product_id }).select("price discountPercentage")
        objectProducts.price = productInfo.price
        objectProducts.discountPercentage = productInfo.discountPercentage
        products.push(objectProducts)

    }
    const orderInfo = {
        cart_id: cartID,
        userInfo: userOrder,
        products: products,
    }

    const order = new Orders(orderInfo)
    await order.save()
    await Cart.updateOne({ _id: cartID }, {
        products: []
    })
    req.flash("success", "Đặt hàng thành công")
    res.redirect(`/checkout/success/${order._id}`)
}
const success = async (req, res) => {
    const { orderID } = req.params;
    const order = await Orders.findOne({ _id: orderID })
    for (const item of order.products) {
        const products = await Product.findOne({ _id: item.product_id }).select("title thumbnail price discountPercentage")
        item.priceNew = ProductsHelper.priceNewProductsOne(products)
        item.productInfo = products
        item.totalPrice = item.priceNew * item.quantity
    }
    order.totalPrice = order.products.reduce((total, item) => {
        return total + item.totalPrice
    }, 0)



    res.render('client/pages/checkout/success', {
        title: "Đặt hàng thành công",
        LayoutProductsCategory: res.locals.Categories,
        orderDetail: order
    })
}
module.exports = {
    index,
    order, success
}
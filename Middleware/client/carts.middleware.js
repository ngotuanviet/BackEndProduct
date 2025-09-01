const Cart = require("../../models/Carts.model");

const CartID = async (req, res, next) => {


    if (!req.cookies.cartID) {

        const cart = new Cart()
        await cart.save()
        const expiresCookie = 365 * 24 * 60 * 60 * 1000
        res.cookie('cartID', cart.id, { expires: new Date(Date.now() + expiresCookie), httpOnly: true })
        res.locals.CartID = cart.id
    } else {
        const cart = await Cart.findOne({ _id: req.cookies.cartID })
        cart.totalQuantity = cart.products.reduce((total, item) => total + item.quantity, 0)
        res.locals.miniCart = cart
    }


    next()
}
module.exports = {
    CartID
}
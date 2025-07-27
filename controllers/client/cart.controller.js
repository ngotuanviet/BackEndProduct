const Cart = require("../../models/Carts.model");

const index = (req, res) => {
    res.render('client/pages/cart/index', {
        title: "Giỏ hàng"
    })
}
const addPost = async (req, res) => {
    const { productID } = req.params;
    const cart_ID = req.cookies.cartID;
    const quantity = req.body.quantity;

    const CartProducts = await Cart.findOne({ _id: cart_ID });
    const existProductInCart = CartProducts.products.find(item =>
        item.product_id === productID
    );

    if (existProductInCart) {
        const quantityNew = parseInt(quantity) + existProductInCart.quantity
        await Cart.updateOne({ _id: cart_ID, "products.product_id": productID }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        })

    } else {
        const object = { product_id: productID, quantity: quantity }
        await Cart.updateOne({ _id: card_ID }, { $push: { products: object } })
    }


    req.flash("success", "Thêm vào giỏ hàng thành công")
    res.redirect(req.get('Referrer') || '/')
}
module.exports = {
    addPost, index
}
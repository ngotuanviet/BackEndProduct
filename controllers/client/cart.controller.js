const Cart = require("../../models/Carts.model");
const Product = require("../../models/Product.model");
const ProductsHelper = require("../../helper/products");
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
    console.log(dataCart);

    res.render('client/pages/cart/index', {
        title: "Giỏ hàng", LayoutProductsCategory: res.locals.Categories,
        dataCart
    })
}
const addPost = async (req, res) => {
    const { productID } = req.params;
    const cart_ID = req.cookies.cartID;
    const quantity = req.body.quantity;
    console.log(cart_ID);

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
        await Cart.updateOne({ _id: cart_ID }, { $push: { products: object } })
    }


    req.flash("success", "Thêm vào giỏ hàng thành công")
    res.redirect(req.get('Referrer') || '/')
}
const deleteProduct = async (req, res) => {
    const { productID } = req.params;
    // console.log(productID);

    const cart_ID = req.cookies.cartID;
    await Cart.updateOne({ _id: cart_ID }, {
        $pull: { products: { product_id: productID } }
    })
    req.flash("success", "Xoá thành công")
    res.redirect(req.get('Referrer') || '/')
}
module.exports = {
    addPost, index, deleteProduct
}
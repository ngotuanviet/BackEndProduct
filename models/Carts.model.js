const { default: mongoose } = require("mongoose");

const CartsSchema = new mongoose.Schema({
    user_id: {
        type: String,

    },
    products: [
        {
            product_id: {
                type: String,

            },
            quantity: {
                type: Number,
            }
        }
    ]
}, {
    timestamps: true,
}
);
const Cart = mongoose.model('Cart', CartsSchema, "carts")
module.exports = Cart;
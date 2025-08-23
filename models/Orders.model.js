const { default: mongoose } = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    cart_id: {
      type: String,
    },
    userInfo: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      note: String,
    },
    products: [
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      },
    ],
    status: {
      type: String,
      default: "initial",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const Orders = mongoose.model("orders", OrdersSchema, "orders");
module.exports = Orders;

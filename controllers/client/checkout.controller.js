const Cart = require("../../models/Carts.model");
const Product = require("../../models/Product.model");
const ProductsHelper = require("../../helper/products");
const Orders = require("../../models/Orders.model");
const payOS = require("../../config/payos");
const index = async (req, res) => {
  const cartID = req.cookies.cartID;
  const dataCart = await Cart.findOne({ _id: cartID });
  if (dataCart.products.length > 0) {
    for (const item of dataCart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false,
        status: "active",
      }).select("title price thumbnail slug discountPercentage");
      productInfo.priceNew = ProductsHelper.priceNewProductsOne(productInfo);
      productInfo.totalPrice = item.quantity * productInfo.priceNew;
      item.productInfo = productInfo;
    }
  }
  dataCart.totalPrice = dataCart.products.reduce((total, item) => {
    return total + item.productInfo.totalPrice;
  }, 0);
  res.render("client/pages/checkout/index", {
    title: "Đặt hàng",
    LayoutProductsCategory: res.locals.Categories,
    dataCart,
  });
};
// [POST] /checkout/order
const order = async (req, res) => {
  const cartID = req.cookies.cartID;
  const userOrder = req.body;
  const cart = await Cart.findOne({ _id: cartID });

  const products = [];
  for (const item of cart.products) {
    const objectProducts = {
      product_id: item.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: item.quantity,
    };
    const productInfo = await Product.findOne({
      _id: objectProducts.product_id,
    }).select("price discountPercentage");
    objectProducts.price = productInfo.price;
    objectProducts.discountPercentage = productInfo.discountPercentage;
    products.push(objectProducts);
  }
  const orderInfo = {
    cart_id: cartID,
    userInfo: userOrder,
    products: products,
  };

  const order = new Orders(orderInfo);
  await order.save();
  await Cart.updateOne(
    { _id: cartID },
    {
      products: [],
    }
  );
  req.flash("success", "Đặt hàng thành công");
  res.redirect(`/checkout/success/${order.id}`);
};
const success = async (req, res) => {
  try {
    const { orderID } = req.params;

    const cartID = req.cookies.cartID;
    // Online payment flow
    if (Object.keys(req.query).length > 0 && !req.params.orderID) {
      const userInfo = {
        fullName: req.query.fullName,
        email: req.query.email,
        phone: req.query.phone,
        address: req.query.address,
        note: req.query.note,
      };

      const cart = await Cart.findOne({ _id: cartID });
      const products = [];

      for (const item of cart.products) {
        const objectProducts = {
          product_id: item.product_id,
          price: 0,
          discountPercentage: 0,
          quantity: item.quantity,
        };
        const productInfo = await Product.findOne({
          _id: objectProducts.product_id,
        }).select("price discountPercentage");
        objectProducts.price = productInfo.price;
        objectProducts.discountPercentage = productInfo.discountPercentage;
        products.push(objectProducts);
      }

      const orderInfo = {
        // _id: req.params.orderID,
        cart_id: cartID,
        userInfo: userInfo,
        products: products,
        status: "paid",
      };

      const order = new Orders(orderInfo);
      await order.save();

      await Cart.updateOne({ _id: cartID }, { products: [] });

      for (const item of order.products) {
        const products = await Product.findOne({ _id: item.product_id }).select(
          "title thumbnail price discountPercentage"
        );
        item.priceNew = ProductsHelper.priceNewProductsOne(products);
        item.productInfo = products;
        item.totalPrice = item.priceNew * item.quantity;
      }
      order.totalPrice = order.products.reduce((total, item) => {
        return total + item.totalPrice;
      }, 0);

      res.render("client/pages/checkout/success", {
        title: "Đặt hàng thành công",
        LayoutProductsCategory: res.locals.Categories,
        order: order,
      });
    } else {
      // COD flow
      const orderId = req.params.orderID;
      if (!orderId) {
        return res.redirect("/");
      }
      const order = await Orders.findOne({ _id: orderId });
      if (!order) {
        return res.render("client/pages/checkout/success", {
          title: "Đặt hàng thành công",
          LayoutProductsCategory: res.locals.Categories,
          order: null,
        });
      }
      for (const item of order.products) {
        const products = await Product.findOne({ _id: item.product_id }).select(
          "title thumbnail price discountPercentage"
        );
        item.title = products.title;
        item.thumbnail = products.thumbnail;
        item.priceNew = ProductsHelper.priceNewProductsOne(products);
        item.productInfo = products;
        item.totalPrice = item.priceNew * item.quantity;
      }
      order.totalPrice = order.products.reduce((total, item) => {
        return total + item.totalPrice;
      }, 0);
      console.log(order);

      res.render("client/pages/checkout/success", {
        title: "Đặt hàng thành công",
        LayoutProductsCategory: res.locals.Categories,
        order: order,
      });
    }
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};
const pay = async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3000`;
  const cartID = req.cookies.cartID;
  const dataCart = await Cart.findOne({ _id: cartID });
  if (dataCart.products.length > 0) {
    for (const item of dataCart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false,
        status: "active",
      }).select("title price thumbnail slug discountPercentage");
      productInfo.priceNew = ProductsHelper.priceNewProductsOne(productInfo);
      productInfo.totalPrice = item.quantity * productInfo.priceNew;
      item.productInfo = productInfo;
    }
  }
  dataCart.totalPrice = dataCart.products.reduce((total, item) => {
    return total + item.productInfo.totalPrice;
  }, 0);
  const arrayProducts = dataCart.products.map((item) => {
    return {
      name: item.productInfo.title,
      quantity: item.quantity,
      price: item.productInfo.price,
    };
  });

  const userInfo = req.body || {};
  const returnUrl = new URL(`${YOUR_DOMAIN}/checkout/success`);
  Object.keys(userInfo).forEach((key) => {
    if (userInfo[key]) {
      returnUrl.searchParams.append(key, userInfo[key]);
    }
  });

  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: dataCart.totalPrice,
    description: "Thanh toan don hang",
    items: arrayProducts,
    returnUrl: returnUrl.toString(),
    cancelUrl: `${YOUR_DOMAIN}/checkout/cancel`,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    res.redirect(paymentLinkResponse.checkoutUrl);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
};
const cancel = async (req, res) => {
  res.render("client/pages/checkout/cancel", {
    title: "Đặt hàng thất bại",
  });
};
const payment = async (req, res) => {
  const { paymentMethod } = req.body;
  if (paymentMethod === "cod") {
    order(req, res);
  } else {
    pay(req, res);
  }
};
module.exports = {
  index,
  order,
  success,
  pay,
  cancel,
  payment,
};

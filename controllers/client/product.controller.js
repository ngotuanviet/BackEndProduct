const Product = require("../../models/Product.model");
const productsHelper = require("../../helper/products");
const Category = require("../../models/Category.model");
const productsCategoryHelper = require("../../helper/productsCategory");

// [get] /products
const index = async (req, res) => {
  const find = {
    status: "active",
    deleted: "false",
  };

  const products = await Product.find(find).sort({ position: "desc" });
  const newProducts = productsHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    title: "Sản phẩm",
    products: newProducts,
    LayoutProductsCategory: res.locals.Categories,
  });
};
// [GET] /products/:slugProduct
const detail = async (req, res) => {
  const { slugProduct } = req.params;
  try {
    const find = {
      deleted: "false",
      status: "active",
      slug: slugProduct,
    };
    const product = await Product.findOne(find);

    if (product.category_id) {
      const category = await Category.findOne({
        _id: product.category_id,
        status: "active",
        deleted: false,
      });

      product.category = category;
    }
    product.priceNew = productsHelper.priceNewProductsOne(product);

    console.log(product.category);

    res.render("client/pages/products/detail", {
      title: "Sản phẩm",
      LayoutProductsCategory: res.locals.Categories,
      product,
    });
  } catch (error) {
    console.log(error);
    // res.redirect('/');
  }
};
const ProductsByCategory = async (req, res) => {
  const { slugCategory } = req.params;
  try {
    const category = await Category.findOne({
      slug: slugCategory,
      status: "active",
      deleted: false,
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(
      category.id
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);
    const find = {
      deleted: "false",
      status: "active",
      category_id: { $in: [category.id, ...listSubCategoryId] },
    };
    const product = await Product.find(find).sort({ position: "desc" });
    const newProducts = productsHelper.priceNewProducts(product);
    res.render("client/pages/products/productsBycategory", {
      title: category.title,
      LayoutProductsCategory: res.locals.Categories,
      products: newProducts,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

module.exports = {
  index,
  ProductsByCategory,
  detail,
};

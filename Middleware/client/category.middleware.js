const Category = require("../../models/Category.model");
const createTreeHelper = require("../../helper/createTree")
const categories = async (req, res, next) => {

    const categories = await Category.find({ deleted: false })
    const newCategories = createTreeHelper.tree(categories)
    res.locals.Categories = newCategories
    next()
}
module.exports = {
    categories
}
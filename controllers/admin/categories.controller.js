// [Get] /admin/categories
const system = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");
const Category = require("../../models/Category.model")
const index = async (req, res) => {
    const { keyword, status } = req.query;
    const find = {
        deleted: 'false'
    }
    if (keyword) {
        find.title = { $regex: keyword, $options: 'i' }

    }
    if (status) {
        find.status = status
    }
    console.log(find);

    const filtersStatus = [
        {
            status: "",
            name: "Tất cả"
        },
        {
            status: 'active',
            name: 'Kích hoạt'
        },
        {
            status: 'inactive',
            name: 'Ẩn'
        }]


    const categories = await Category.find(find)
    const categoriesNew = createTreeHelper.tree(categories)
    res.render("admin/pages/categories/index", {
        title: "Trang quản lý danh mục",
        categories: categoriesNew,
        filtersStatus

    })
}
// [Get] /admin/categories/create
const create = async (req, res) => {
    let find = {
        deleted: 'false'
    }
    const categories = await Category.find(find).sort({ position: "asc" })
    const categoriesNew = createTreeHelper.tree(categories)
    console.log(categoriesNew);
    res.render("admin/pages/categories/create", {
        title: "Thêm danh mục",
        categories: categoriesNew
    })
}
// [POST] /admin/categories/create
const createPost = async (req, res) => {
    console.log(req.body);


    if (req.body.position == "") {
        req.body.position = await Category.countDocuments() + 1
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const category = new Category(req.body)
    await category.save()
    req.flash('success', 'Thêm danh mục thành công');
    res.redirect(`${system.prefixAdmin}/categories`)
}
// [PATCH]
const changeStatus = async (req, res) => {
    const { status, id } = req.params;
    console.log(status, id);

    await Category.updateOne({ _id: id }, { status: status })
    res.redirect(`${system.prefixAdmin}/categories`)
}
const changeMulti = async (req, res) => {
    const { type, ids } = req.body
    switch (type) {
        case "active":
            await Category.updateMany({ _id: { $in: ids.split(", ") } }, { status: type })
            req.flash('success', `Cập nhập trạng thái các danh mục thành công`);
            res.redirect(`${system.prefixAdmin}/categories`)

        case "inactive":
            await Category.updateMany({ _id: { $in: ids.split(", ") } }, { status: type })
            res.redirect(`${system.prefixAdmin}/categories`)


    }
}
module.exports = {
    index,
    create,
    createPost,
    changeStatus, changeMulti
}
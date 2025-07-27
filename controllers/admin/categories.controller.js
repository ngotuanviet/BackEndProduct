// [Get] /admin/categories
const system = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");
const Category = require("../../models/Category.model")
const index = async (req, res) => {
    const { keyword, status, page } = req.query;


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

    const countDocuments = await Category.countDocuments(find)
    const objectPanination = {
        limitItems: 4,
        currentPage: 1,
        skip: 0
    }
    if (page) {
        let pageInt = parseInt(page)
        if (isNaN(pageInt)) {
            pageInt = 1
        } else if (page < 1) {
            pageInt = 1
        } else {
            objectPanination.currentPage = pageInt
            // (trang hiện tại - 1) * Số lượng xuất hiện phần tử mỗi trang
            objectPanination.skip = (objectPanination.currentPage - 1) * objectPanination.limitItems
        }
    }
    const totalPages = Math.ceil(countDocuments / objectPanination.limitItems)
    objectPanination.totalPages = totalPages



    const categories = await Category.find(find).limit(objectPanination.limitItems).skip(objectPanination.skip).sort({ position: "asc" })
    const categoriesNew = createTreeHelper.tree(categories)
    res.render("admin/pages/categories/index", {
        title: "Trang quản lý danh mục",
        categories: categoriesNew,
        filtersStatus,
        objectPanination
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
    const permissions = res.locals.rolesUser.permissions
    if (permissions.includes("products-category_create")) {
        if (req.body.position == "") {
            req.body.position = await Category.countDocuments() + 1
        } else {
            req.body.position = parseInt(req.body.position);
        }
        const category = new Category({
            ...req.body,
            createdBy: {
                account_id: res.locals.user.id, createdAt: Date.now()
            }
        })
        await category.save()
        req.flash('success', 'Thêm danh mục thành công');
        res.redirect(`${system.prefixAdmin}/categories`)
    } else {
        res.status(403)
        return
    }
}
// [PATCH]
const changeStatus = async (req, res) => {
    const { status, id } = req.params;
    console.log(status, id);

    await Category.updateOne({ _id: id }, { status: status, $push: { updatedBy: { account_id: res.locals.user.id, updatedAt: Date.now() } } })
    res.redirect(`${system.prefixAdmin}/categories`)
}
const changeMulti = async (req, res) => {
    const { type, ids } = req.body
    switch (type) {
        case "active":
            await Category.updateMany({ _id: { $in: ids.split(", ") } }, { status: type, $push: { updatedBy: { account_id: res.locals.user.id, updatedAt: Date.now() } } })
            req.flash('success', `Cập nhập trạng thái các danh mục thành công`);
            res.redirect(`${system.prefixAdmin}/categories`)

        case "inactive":
            await Category.updateMany({ _id: { $in: ids.split(", ") } }, { status: type, $push: { updatedBy: { account_id: res.locals.user.id, updatedAt: Date.now() } } })
            res.redirect(`${system.prefixAdmin}/categories`)


    }
}
const edit = async (req, res) => {
    const { id } = req.params;
    try {
        const find = {
            deleted: 'false',
            _id: id
        }
        const dataCategory = await Category.findById(find)
        const category = await Category.find({ deleted: 'false' })

        const categoryNew = createTreeHelper.tree(category)
        if (!category) {
            req.flash('error', 'Danh mục không tồn tại');
            return res.redirect(`${system.prefixAdmin}/categories`)
        }


        res.render("admin/pages/categories/edit", {
            title: "Chỉnh sửa danh mục",
            dataCategory,
            categoryNew
        })
    } catch (error) {
        console.log(error);
        req.flash('error', 'Danh mục không tồn tại');
        return res.redirect(`${system.prefixAdmin}/categories`)

    }

}
// [POST] /admin/categories/edit/:id
const editPost = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    try {
        if (req.body.position == "") {
            req.body.position = await Category.countDocuments() + 1
        } else {
            req.body.position = parseInt(req.body.position);
        }
        const find = {
            deleted: 'false',
            _id: id
        }
        const category = await Category.findByIdAndUpdate(find, {
            ...req.body
            , $push: { updatedBy: { account_id: res.locals.user.id, updatedAt: Date.now() } }
        })

        if (!category) {
            req.flash('error', 'Danh mục không tồn tại');
            return res.redirect(`${system.prefixAdmin}/categories`)
        }
        req.flash('success', 'Cập nhật danh mục thành công');
        res.redirect(`${system.prefixAdmin}/categories`)
    } catch (error) {
        console.log(error);
        req.flash('error', 'Cập nhật danh mục thất bại');
        return res.redirect(`${system.prefixAdmin}/categories`)

    }


}
const deleteID = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await Category.updateOne({ _id: id }, { deleted: true, deleteBy: { account_id: res.locals.user.id, deletedAt: Date.now() } })
    res.redirect(`${system.prefixAdmin}/categories`)
}
module.exports = {
    index,
    create,
    deleteID,
    createPost,
    changeStatus, changeMulti, edit, editPost
}
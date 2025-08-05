const Categories_posts = require("../../models/Category_posts.model")
const createTreeHelper = require("../../helper/createTree");
const index = async (req, res) => {
    let find = {
        deleted: false
    };
    console.log('====================================');
    console.log(res.locals.user);
    console.log('====================================');
    if (req.query.keyword) {
        find.title = new RegExp(req.query.keyword, "i");
    }

    const getCategoryAndParents = async (categoryId) => {
        let categories = [];
        let currentCategory = await Categories_posts.findOne({ _id: categoryId, deleted: false });
        if (currentCategory) {
            categories.push(currentCategory);
            if (currentCategory.parent_id) {
                const parentCategories = await getCategoryAndParents(currentCategory.parent_id);
                categories = categories.concat(parentCategories);
            }
        }
        return categories;
    };

    let categories;
    if (req.query.keyword) {
        const searchedCategories = await Categories_posts.find(find).sort({ position: "asc" });
        let allCategories = [];
        for (const category of searchedCategories) {
            const categoriesAndParents = await getCategoryAndParents(category._id);
            allCategories = allCategories.concat(categoriesAndParents);
        }
        const uniqueCategories = Array.from(new Set(allCategories.map(cat => cat._id.toString())))
            .map(id => allCategories.find(cat => cat._id.toString() === id));
        categories = uniqueCategories;
    } else {
        categories = await Categories_posts.find({ deleted: false }).sort({ position: "asc" });
    }

    const categoriesNew = createTreeHelper.tree(categories);

    res.render('admin/pages/categories-posts/index', {
        title: "Trang quản lý danh mục bài viết",
        categories: categoriesNew,
        keyword: req.query.keyword
    });
};
const changeStatus = async (req, res) => {
    const { status, id } = req.params;

    const find = {
        deleted: 'false',
        _id: id

    }
    await Categories_posts.updateOne(find, { status: status })
    res.redirect('/admin/categories-posts')
}
const create = async (req, res) => {
    let find = {
        deleted: 'false'
    }
    const categories = await Categories_posts.find(find).sort({ position: "asc" })
    const categoriesNew = createTreeHelper.tree(categories)
    console.log(categoriesNew);
    res.render('admin/pages/categories-posts/create', {
        title: "Thêm danh mục bài viết",
        categories: categoriesNew
    })
}
const createPost = async (req, res) => {
    req.body.position = parseInt(req.body.position);
    if (isNaN(req.body.position)) {
        req.body.position = await Categories_posts.countDocuments() + 1
    }
    const category_posts = new Categories_posts({ ...req.body, createdBy: { account_id: res.locals.user.id, createdAt: Date.now() } })
    await category_posts.save()
    req.flash('success', 'Thêm danh mục bài viết thành công');
    res.redirect('/admin/categories-posts')

}
const edit = async (req, res) => {
    const { id } = req.params;
    const find = {
        deleted: 'false',
        _id: id
    }
    const dataCategory = await Categories_posts.findOne(find)
    const categories = await Categories_posts.find({ deleted: 'false' }).sort({ position: "asc" })
    const categoriesNew = createTreeHelper.tree(categories)

    res.render('admin/pages/categories-posts/edit', {
        title: "Sửa danh mục bài viết",
        dataCategory,
        categories: categoriesNew
    })
}
const editPost = async (req, res) => {
    const { id } = req.params;

    await Categories_posts.updateOne({ _id: id }, {
        ...req.body,
        updatedBy: {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
    })
    req.flash("success", "Sửa danh mục bài viết thành công");
    res.redirect("/admin/categories-posts")

}
const deleteID = async (req, res) => {
    const { id } = req.params;
    await Categories_posts.updateOne({ _id: id }, { deleted: true, deleteAt: Date.now(), deleteBy: { account_id: res.locals.user.id, deletedAt: Date.now() } })
    res.redirect("/admin/categories-posts")
}
module.exports = {
    index, create, createPost,
    edit, editPost,
    changeStatus, deleteID
}

const Product = require("../../models/Product.model")
const filtersStatusHelper = require("../../helper/filtersStatus")
const searchHelper = require("../../helper/search")
const paginationHelper = require("../../helper/pagination")
const systemConfig = require("../../config/system")
const createTreeHelper = require("../../helper/createTree");
const Category = require("../../models/Category.model")

// [Get] /admin/products
const index = async (req, res) => {
    const { status, keyword, page } = req.query;
    let find = {
        deleted: 'false',

    };
    // bộ lọc
    const filtersStatus = filtersStatusHelper(status, find)
    const keywordSearch = searchHelper(keyword)
    if (keywordSearch.keyword) {
        find.title = keywordSearch.regex
    }

    // pagination
    const countDocuments = await Product.countDocuments(find)
    let objectPanination = await paginationHelper({
        limitItems: 4,
        currentPage: 1,
        skip: 0

    }, page, countDocuments)
    // sort
    let sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }
    // end sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPanination.limitItems)
        .skip(objectPanination.skip)


    res.render('admin/pages/products/index', {
        title: "Trang quản lý sản phẩm",
        products,
        filtersStatus,
        keyword: keywordSearch.keyword,
        objectPanination
    })
}
// [Patch] /admin/products/change-status/:status/:id
const changeStatus = async (req, res) => {
    const { status, id } = req.params;
    await Product.updateOne({ _id: id }, { status: status })
    // back list product
    backURL = req.header('Referer') || '/admin/products';
    req.flash('success', 'Cập nhập trạng thái thành công');
    res.redirect(backURL)

}
// [Patch] /admin/products/change-multi
const changeMulti = async (req, res) => {
    const { type, ids } = req.body

    switch (type) {
        case "active":
            console.log(ids);

            await Product.updateMany({ _id: { $in: ids.split(", ") } }, { status: type })
            req.flash('success', `Cập nhập trạng thái các sản phẩm thành công`);

            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids.split(", ") } }, { status: type })
            req.flash('success', `Cập nhập trạng thái các sản phẩm thành công`);

            break;
        case "deleteAll":
            await Product.updateMany({ _id: { $in: ids.split(", ") } }, { deleted: true, deleteAt: Date.now() })
            req.flash('success', 'Xoá tất cả sản phẩm thành công');

            break;
        case "changePosition":
            const idsArray = ids.split(", ")
            for (const item of idsArray) {
                let [id, position] = item.split("-")

                position = parseInt(position)
                await Product.updateMany({ _id: id }, {
                    position: position
                })


            }


            // await Product.updateMany({ _id: { $in: ids.split(", ") } }, { deleted: true, deleteAt: Date.now() })
            break;
        default:
            break;
    }
    res.redirect(`${systemConfig.prefixAdmin}/products`)

}
// [Delete] /admin/products/delete/:id
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    await Product.updateOne({ _id: id }, { deleted: true, deleteAt: Date.now() })
    req.flash('success', 'Xoá sản phẩm thành công');
    res.redirect(`${systemConfig.prefixAdmin}/products`)

}
// [GET] /admin/products/create
const createProduct = async (req, res) => {
    const categories = await Category.find({ deleted: 'false' })
    const categoriesTree = await createTreeHelper.tree(categories)
    res.render(`admin/pages/products/create`, {
        title: "Thêm sản phẩm",
        categories: categoriesTree
    })
}
const createProductPOST = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    console.log(req.file, req.body)

    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (isNaN(req.body.position)) {
        req.body.position = await Product.countDocuments() + 1
    }
    // } else {
    //     req.body.position = parseInt(req.body.position)
    // }
    const product = new Product(req.body)
    await product.save()
    res.redirect(`${systemConfig.prefixAdmin}/products`)

}
// [Get] admin/products/edit/:id
const editProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const find = {
            deleted: 'false',
            _id: id
        }

        const categories = await Category.find({ deleted: 'false' })
        const categoriesTree = await createTreeHelper.tree(categories)
        const product = await Product.findOne(find);

        res.render(`admin/pages/products/edit`, {
            title: "Sửa sản phẩm",
            product,
            categories: categoriesTree
        })
    } catch (error) {
        req.flash('error', 'Không tìm thấy sản phẩm')
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}
// [Patch] admin/products/edit/:id
const editProductPatch = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    req.body.price = parseInt(req.body.price);
    console.log(req.body)
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`
    // }
    console.log(req.body);
    try {
        await Product.updateOne({ _id: id }, req.body)
        req.flash('success', 'Sửa sản phẩm thành công');
        res.redirect(`${systemConfig.prefixAdmin}/products`)
        req.flash('success', 'Sửa sản phẩm Thành Công');

    } catch (error) {
        req.flash('success', 'Sửa sản phẩm thất bại');
        console.log(error);

    }


}
const detailProduct = async (req, res) => {
    const { id } = req.params;
    const find = {
        deleted: 'false',
        _id: id
    }

    const product = await Product.findOne(find);
    res.render(`admin/pages/products/detail`, {
        title: product.title,
        product
    })
}
module.exports = {
    index,
    changeStatus,
    changeMulti,
    createProduct,
    deleteProduct,
    createProductPOST,
    editProduct,
    editProductPatch,
    detailProduct
}
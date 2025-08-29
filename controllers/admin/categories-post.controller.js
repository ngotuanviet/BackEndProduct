const Categories_posts = require("../../models/Category_posts.model");
const createTreeHelper = require("../../helper/createTree");
const filterStatusHelper = require("../../helper/filtersStatus");
const paginationHelper = require("../../helper/pagination");
const Accounts = require("../../models/Accounts.model");
const sortHelper = require("../../helper/sort");

const index = async (req, res) => {
  const { status, keyword, page, sort } = req.query;
  let find = {
    deleted: false,
  };

  const filtersStatus = filterStatusHelper(status, find);

  if (keyword) {
    find.title = new RegExp(keyword, "i");
  }

  let initPagination = {
    currentPage: 1,
    limitItems: 4,
    skip: 0,
  };

  const getCategoryAndParents = async (categoryId) => {
    let categories = [];
    let currentCategory = await Categories_posts.findOne({
      _id: categoryId,
      deleted: false,
    });
    if (currentCategory) {
      categories.push(currentCategory);
      if (currentCategory.parent_id) {
        const parentCategories = await getCategoryAndParents(
          currentCategory.parent_id
        );
        categories = categories.concat(parentCategories);
      }
    }
    return categories;
  };

  const { sort: sortKey, sortObject } = sortHelper(sort);

  let allMatchingCategories = await Categories_posts.find(find).sort(sortKey);

  if (keyword) {
    let allCategoriesWithParents = [];
    for (const category of allMatchingCategories) {
      const categoriesAndParents = await getCategoryAndParents(category._id);
      allCategoriesWithParents =
        allCategoriesWithParents.concat(categoriesAndParents);
    }
    const uniqueCategories = Array.from(
      new Set(allCategoriesWithParents.map((cat) => cat._id.toString()))
    ).map((id) =>
      allCategoriesWithParents.find((cat) => cat._id.toString() === id)
    );
    allMatchingCategories = uniqueCategories;
  }

  const countFilteredCategories = allMatchingCategories.length;
  const objectPanination = await paginationHelper(
    initPagination,
    page,
    countFilteredCategories
  );

  let categories = allMatchingCategories.slice(
    objectPanination.skip,
    objectPanination.skip + objectPanination.limitItems
  );

  for (const category of categories) {
    // Lấy data người tạo
    const fullNameAccount = await Accounts.findOne({
      _id: category.createdBy.account_id,
    });
    if (fullNameAccount) {
      category.fullName = fullNameAccount.fullName;
    }
    // Lấy data người cập nhật gần nhất
    const updatedBy = category.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const UserUpdate = await Accounts.findOne({ _id: updatedBy.account_id });
      if (UserUpdate) {
        updatedBy.fullName = UserUpdate.fullName;
      }
    }
  }

  const categoriesNew = createTreeHelper.tree(categories);

  const availableSortOptions = [
    {
      value: "position-desc",
      text: "Vị trí giảm dần",
    },
    {
      value: "position-asc",
      text: "Vị trí tăng dần",
    },
    {
      value: "title-asc",
      text: "Tên A-Z",
    },
    {
      value: "title-desc",
      text: "Tên Z-A",
    },
  ];

  res.render("admin/pages/categories-posts/index", {
    title: "Trang quản lý danh mục bài viết",
    categories: categoriesNew,
    keyword: keyword,
    filtersStatus: filtersStatus,
    objectPanination: objectPanination,
    sort: sortObject,
    availableSortOptions,
  });
};
const changeStatus = async (req, res) => {
  const { status, id } = req.params;

  const find = {
    deleted: "false",
    _id: id,
  };
  await Categories_posts.updateOne(find, { status: status });
  res.redirect("/admin/categories-posts");
};
const create = async (req, res) => {
  let find = {
    deleted: "false",
  };
  const categories = await Categories_posts.find(find).sort({
    position: "asc",
  });
  const categoriesNew = createTreeHelper.tree(categories);
  console.log(categoriesNew);
  res.render("admin/pages/categories-posts/create", {
    title: "Thêm danh mục bài viết",
    categories: categoriesNew,
  });
};
const createPost = async (req, res) => {
  req.body.position = parseInt(req.body.position);
  if (isNaN(req.body.position)) {
    req.body.position = (await Categories_posts.countDocuments()) + 1;
  }
  const category_posts = new Categories_posts({
    ...req.body,
    createdBy: { account_id: res.locals.user.id, createdAt: Date.now() },
  });
  await category_posts.save();
  req.flash("success", "Thêm danh mục bài viết thành công");
  res.redirect("/admin/categories-posts");
};
const edit = async (req, res) => {
  const { id } = req.params;
  const find = {
    deleted: "false",
    _id: id,
  };
  const dataCategory = await Categories_posts.findOne(find);
  const categories = await Categories_posts.find({ deleted: "false" }).sort({
    position: "asc",
  });
  const categoriesNew = createTreeHelper.tree(categories);

  res.render("admin/pages/categories-posts/edit", {
    title: "Sửa danh mục bài viết",
    dataCategory,
    categories: categoriesNew,
  });
};
const editPost = async (req, res) => {
  const { id } = req.params;

  await Categories_posts.updateOne(
    { _id: id },
    {
      ...req.body,
      updatedBy: {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      },
    }
  );
  req.flash("success", "Sửa danh mục bài viết thành công");
  res.redirect("/admin/categories-posts");
};
const deleteID = async (req, res) => {
  const { id } = req.params;
  await Categories_posts.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteAt: Date.now(),
      deleteBy: { account_id: res.locals.user.id, deletedAt: Date.now() },
    }
  );
  res.redirect("/admin/categories-posts");
};
module.exports = {
  index,
  create,
  createPost,
  edit,
  editPost,
  changeStatus,
  deleteID,
};

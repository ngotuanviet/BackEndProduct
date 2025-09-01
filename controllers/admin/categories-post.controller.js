const CategoryPost = require("../../models/Category_posts.model");
const createTreeHelper = require("../../helper/createTree");
const { Op } = require("sequelize"); // Import Op for operators

const index = async (req, res) => {
  let find = {
    deleted: false,
  };

  if (req.query.keyword) {
    find.title = { [Op.like]: `%${req.query.keyword}%` };
  }

  const getCategoryAndParents = async (categoryId) => {
    let categories = [];
    let currentCategory = await CategoryPost.findOne({
      where: { id: categoryId, deleted: false },
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

  let categories;
  if (req.query.keyword) {
    const searchedCategories = await CategoryPost.findAll({
      where: find,
      order: [["position", "ASC"]],
    });
    let allCategories = [];
    for (const category of searchedCategories) {
      const categoriesAndParents = await getCategoryAndParents(category.id);
      allCategories = allCategories.concat(categoriesAndParents);
    }
    const uniqueCategories = Array.from(
      new Set(allCategories.map((cat) => cat.id))
    ).map((id) => allCategories.find((cat) => cat.id === id));
    categories = uniqueCategories;
  } else {
    categories = await CategoryPost.findAll({
      where: { deleted: false },
      order: [["position", "ASC"]],
    });
  }

  const categoriesNew = createTreeHelper.tree(categories);

  res.render("admin/pages/categories-posts/index", {
    title: "Trang quản lý danh mục bài viết",
    categories: categoriesNew,
    keyword: req.query.keyword,
  });
};

const changeStatus = async (req, res) => {
  const { status, id } = req.params;

  const find = {
    deleted: false,
    id: id,
  };
  await CategoryPost.update({ status: status }, { where: find });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("/admin/categories-posts");
};

const create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const categories = await CategoryPost.findAll({
    where: find,
    order: [["position", "ASC"]],
  });
  const categoriesNew = createTreeHelper.tree(categories);
  res.render("admin/pages/categories-posts/create", {
    title: "Thêm danh mục bài viết",
    categories: categoriesNew,
  });
};

const createPost = async (req, res) => {
  req.body.position = parseInt(req.body.position);
  if (isNaN(req.body.position)) {
    req.body.position = (await CategoryPost.count()) + 1;
  }
  await CategoryPost.create({
    ...req.body,
    createdBy_account_id: res.locals.user.id,
    createdAt: new Date(),
  });
  req.flash("success", "Thêm danh mục bài viết thành công");
  res.redirect("/admin/categories-posts");
};

const edit = async (req, res) => {
  const { id } = req.params;
  const find = {
    deleted: false,
    id: id,
  };
  const dataCategory = await CategoryPost.findOne({ where: find });
  const categories = await CategoryPost.findAll({
    where: { deleted: false },
    order: [["position", "ASC"]],
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

  await CategoryPost.update(
    {
      ...req.body,
      updatedBy_account_id: res.locals.user.id,
      updatedAt: new Date(),
    },
    {
      where: { id: id },
    }
  );
  req.flash("success", "Sửa danh mục bài viết thành công");
  res.redirect("/admin/categories-posts");
};

const deleteID = async (req, res) => {
  const { id } = req.params;
  await CategoryPost.update(
    {
      deleted: true,
      deleteAt: new Date(),
      deleteBy_account_id: res.locals.user.id,
    },
    {
      where: { id: id },
    }
  );
  req.flash("success", "Xoá Danh Mục Bài Viết Thành Công!");
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

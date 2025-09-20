const Post = require("../../models/Posts.model");
const Categories_posts = require("../../models/Category_posts.model");
const Accounts = require("../../models/Accounts.model");
const filtersStatusHelper = require("../../helper/filtersStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");
const sortHelper = require("../../helper/sort"); // Add this line

// [Get] /admin/posts
const index = async (req, res) => {
  const { status, keyword, page, sort } = req.query;
  let find = {
    deleted: false,
  };

  const filtersStatus = filtersStatusHelper(status, find);
  const keywordSearch = searchHelper(keyword);
  if (keywordSearch.keyword) {
    find.title = keywordSearch.regex;
  }

  const countDocuments = await Post.countDocuments(find);
  let objectPanination = await paginationHelper(
    {
      limitItems: 4,
      currentPage: 1,
      skip: 0,
    },
    page,
    countDocuments
  );

  const { sort: sortKey, sortObject } = sortHelper(sort);

  const posts = await Post.find(find)
    .sort(sortKey)
    .limit(objectPanination.limitItems)
    .skip(objectPanination.skip);

  for (const post of posts) {
    const fullNameAccount = await Accounts.findOne({
      _id: post.createdBy.account_id,
    });
    if (fullNameAccount) {
      post.fullName = fullNameAccount.fullName;
    }

    const updatedBy = post.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const UserUpdate = await Accounts.findOne({ _id: updatedBy.account_id });
      if (UserUpdate) {
        updatedBy.fullName = UserUpdate.fullName;
      }
    }
  }

  res.render("admin/pages/posts/index", {
    title: "Trang quản lý bài viết",
    posts,
    filtersStatus,
    keyword: keywordSearch.keyword,
    objectPanination,
    sort: sortObject,
    availableSortOptions: [
      { value: "position-desc", text: "Vị trí giảm dần" },
      { value: "position-asc", text: "Vị trí tăng dần" },
      { value: "title-asc", text: "Tên A-Z" },
      { value: "title-desc", text: "Tên Z-A" },
    ],
  });
};

// [Patch] /admin/posts/change-status/:status/:id
const changeStatus = async (req, res) => {
  const { status, id } = req.params;
  const updatedBy = {
    account_id: res.locals.user._id,
    updatedAt: new Date(),
  };
  await Post.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhập trạng thái thành công");
  res.redirect("back");
};

// [Patch] /admin/posts/change-multi
const changeMulti = async (req, res) => {
  const { type, ids } = req.body;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await Post.updateMany(
        { _id: { $in: ids.split(", ") } },
        { status: type, $push: { updatedBy: updatedBy } }
      );
      req.flash("success", `Cập nhập trạng thái các bài viết thành công`);
      break;
    case "inactive":
      await Post.updateMany(
        { _id: { $in: ids.split(", ") } },
        { status: type, $push: { updatedBy: updatedBy } }
      );
      req.flash("success", `Cập nhập trạng thái các bài viết thành công`);
      break;
    case "deleteAll":
      await Post.updateMany(
        { _id: { $in: ids.split(", ") } },
        {
          deleted: true,
          deleteBy: { account_id: res.locals.user.id, deletedAt: Date.now() },
        }
      );
      req.flash("success", "Xoá tất cả bài viết thành công");
      break;
    case "changePosition":
      const idsArray = ids.split(", ");
      for (const item of idsArray) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Post.updateMany(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
      }
      break;
    default:
      break;
  }
  res.redirect(`${systemConfig.prefixAdmin}/posts`);
};

// [Delete] /admin/posts/delete/:id
const deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.updateOne(
    { _id: id },
    {
      deleted: true,
      deleteBy: { account_id: res.locals.user.id, deletedAt: Date.now() },
    }
  );
  req.flash("success", "Xoá bài viết thành công");
  res.redirect(`${systemConfig.prefixAdmin}/posts`);
};

// [GET] /admin/posts/create
const create = async (req, res) => {
  const categories = await Categories_posts.find({
    deleted: false,
    status: "active",
  });
  const categoriesTree = createTreeHelper.tree(categories);
  res.render(`admin/pages/posts/create`, {
    title: "Thêm bài viết",
    categories: categoriesTree,
  });
};

// [POST] /admin/posts/create
const createPost = async (req, res) => {
  try {
    req.body.createdBy = {
      account_id: res.locals.user._id,
    };

    req.body.position = parseInt(req.body.position);
    if (isNaN(req.body.position)) {
      req.body.position = (await Post.countDocuments()) + 1;
    }

    const post = new Post(req.body);
    await post.save();

    req.flash("success", "Tạo bài viết thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/posts`);
  } catch (error) {
    console.error("Error creating post:", error);
    req.flash("error", "Lỗi khi tạo bài viết: " + error.message);
    res.redirect("admin/posts/create");
  }
};

// [Get] admin/posts/edit/:id
const edit = async (req, res) => {
  try {
    const { id } = req.params;
    const find = {
      deleted: false,
      _id: id,
    };

    const categories = await Categories_posts.find({
      deleted: false,
      status: "active",
    });
    const categoriesTree = createTreeHelper.tree(categories);
    const post = await Post.findOne(find);

    res.render(`admin/pages/posts/edit`, {
      title: "Sửa bài viết",
      post,
      categories: categoriesTree,
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy bài viết");
    res.redirect(`${systemConfig.prefixAdmin}/posts`);
  }
};

// [Patch] admin/posts/edit/:id
const editPost = async (req, res) => {
  const { id } = req.params;

  req.body.position = parseInt(req.body.position);
  try {
    console.log("====================================");
    console.log(req.body);
    console.log("====================================");
    const updatedBy = {
      account_id: res.locals.user._id,
      updatedAt: new Date(),
    };
    await Post.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );
    req.flash("success", "Sửa bài viết thành công");
    res.redirect(`${systemConfig.prefixAdmin}/posts`);
  } catch (error) {
    req.flash("error", "Sửa bài viết thất bại");
    console.log(error);
  }
};

const detailPost = async (req, res) => {
  const { id } = req.params;
  const find = {
    deleted: false,
    _id: id,
  };

  const post = await Post.findOne(find);
  res.render(`admin/pages/posts/detail`, {
    title: post.title,
    post,
  });
};

module.exports = {
  index,
  changeStatus,
  changeMulti,
  create,
  deletePost,
  createPost,
  edit,
  editPost,
  detailPost,
};

const Posts = require("../../models/Posts.model");
const CategoriesPosts = require("../../models/Category_posts.model");

const formatVietnameseDate = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const index = async (req, res) => {
  const { category: categorySlug } = req.query;

  const categories = await CategoriesPosts.find({
    status: "active",
    deleted: false,
  })
    .select("title slug")
    .sort({ position: 1, createdAt: -1 })
    .lean();

  const filter = { status: "active", deleted: false };
  let activeCategory = null;

  if (categorySlug) {
    activeCategory =
      categories.find((category) => category.slug === categorySlug) || null;

    if (activeCategory) {
      filter.category_post_id = activeCategory._id.toString();
    }
  }

  const posts =
    categorySlug && !activeCategory
      ? []
      : await Posts.find(filter)
          .select("title thumbnail slug category_post_id")
          .sort({ position: 1, createdAt: -1 })
          .lean();

  res.render("client/pages/posts/index", {
    title: activeCategory ? activeCategory.title : "Danh sách bài viết",
    posts,
    categories,
    activeCategorySlug: activeCategory ? activeCategory.slug : "",
  });
};

const detail = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Posts.findOne({
      slug,
      status: "active",
      deleted: false,
    })
      .select("title body thumbnail description createdAt category_post_id")
      .lean();

    if (!post) {
      req.flash("error", "Bài viết không tồn tại");
      return res.redirect("/posts");
    }

    const categoryPromise = post.category_post_id
      ? CategoriesPosts.findOne({ _id: post.category_post_id, deleted: false })
          .select("title slug")
          .lean()
      : Promise.resolve(null);

    const relatedFilter = {
      status: "active",
      deleted: false,
      _id: { $ne: post._id },
    };

    if (post.category_post_id) {
      relatedFilter.category_post_id = post.category_post_id;
    }

    const relatedPromise = Posts.find(relatedFilter)
      .select("title thumbnail slug createdAt")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const [category, relatedPosts] = await Promise.all([
      categoryPromise,
      relatedPromise,
    ]);

    const plainText = post.body
      ? post.body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
      : "";
    const totalWords = plainText ? plainText.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(totalWords / 180));

    res.render("client/pages/posts/detail", {
      title: post.title,
      post,
      category,
      relatedPosts,
      meta: {
        formattedDate: formatVietnameseDate(post.createdAt),
        readingTime,
        description: post.description || "",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  index,
  detail,
};

const { default: mongoose } = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const postsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Bắt buộc phải có
    },
    category_post_id: {
      type: String,
    },
    body: {
      type: String,
    },
    status: {
      type: String,
      default: "active", // Giá trị mặc định là 'active'
    },
    thumbnail: String,
    featured: {
      type: String,
    },
    position: {
      type: Number,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
    deleted: {
      type: Boolean,
      default: false, // Mặc định là chưa bị xóa
    },
    deleteBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
    slug: { type: String, slug: "title", unique: true },
  },
  {
    // Tùy chọn này sẽ tự động thêm 2 trường createdAt và updatedAt
    timestamps: true,
  }
);
const Posts = mongoose.model("Posts", postsSchema, "Posts");
module.exports = Posts;

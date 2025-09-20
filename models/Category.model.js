const { default: mongoose } = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Bắt buộc phải có
    },
    parent_id: {
      type: String,
      default: "", // Bắt buộc phải có
    },
    description: {
      type: String,
    },

    thumbnail: {
      type: String,
    },
    status: {
      type: String,
      default: "active", // Giá trị mặc định là 'active'
    },
    position: {
      type: Number,
    },
    deleted: {
      type: Boolean,
      default: false, // Mặc định là chưa bị xóa
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
      },
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: {
          type: Date,
        },
      },
    ],
    deleteBy: {
      account_id: String,
      deletedAt: {
        type: Date,
      },
    },
    deleteAt: Date,
    slug: { type: String, slug: "title", unique: true },
  },
  {
    // Tùy chọn này sẽ tự động thêm 2 trường createdAt và updatedAt
    timestamps: true,
  }
);
const Category = mongoose.model("Category", CategorySchema, "categories");
module.exports = Category;

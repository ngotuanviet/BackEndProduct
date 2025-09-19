const Posts = require("../../models/Posts.model");
const index = async (req, res) => {
  const posts = await Posts.find();
  console.log("====================================");
  console.log(posts);
  console.log("====================================");
  res.render("client/pages/posts/index", {
    title: "Danh sách bài viết",
  });
};
module.exports = {
  index,
};

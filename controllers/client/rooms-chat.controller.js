const index = (req, res) => {
  res.render("client/pages/rooms-chat", {
    title: "Chat Room",
  });
};

module.exports = {
  index,
};

module.exports = async (objectPanination, page, countDocuments) => {
  if (page) {
    let pageInt = parseInt(page);
    if (isNaN(pageInt)) {
      objectPanination.currentPage = 1;
    } else if (page < 1) {
      objectPanination.currentPage = 1;
    } else {
      objectPanination.currentPage = pageInt;
      // (trang hiện tại - 1) * Số lượng xuất hiện phần tử mỗi trang
      objectPanination.skip =
        (objectPanination.currentPage - 1) * objectPanination.limitItems;
    }
  }

  const totalPages = Math.ceil(countDocuments / objectPanination.limitItems);
  objectPanination.totalPages = totalPages;
  return objectPanination;
};

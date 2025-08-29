const sortHelper = (sortKey) => {
  let sort = {};
  let sortObject = {};

  if (sortKey) {
    const [key, value] = sortKey.split("-");
    sort[key] = value;
    sortObject = {
      key: key,
      value: value,
    };
  } else {
    sort = {
      position: "desc",
    };
    sortObject = {
      key: "position",
      value: "desc",
    };
  }
  return {
    sort,
    sortObject,
  };
};

module.exports = sortHelper;

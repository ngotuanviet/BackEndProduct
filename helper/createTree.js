const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach(item => {
        if (item.parent_id === String(parentId)) {
            const newItem = item;
            const children = createTree(arr, item._id);
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
};
const tree = (arr, parentId = "") => {
    const tree = createTree(arr, parentId) = "";
    return tree;
};
module.exports = {
    tree
};
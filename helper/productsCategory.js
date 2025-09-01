const Category = require("../models/Category.model");

const getSubCategory = async (parentID) => {
    const getCategory = async (parentID) => {


        const subs = await Category.find({
            parent_id: parentID,
            status: 'active',
            deleted: false
        })

        let allsub = [...subs]

        for (const sub of subs) {

            const childs = await getCategory(sub.id)
            allsub = allsub.concat(childs)

        }
        return allsub
    }
    const result = await getCategory(parentID)
    return result
}
module.exports = {
    getSubCategory
}
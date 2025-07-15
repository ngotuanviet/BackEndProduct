const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connect Success");

    } catch (error) {
        console.log("connect Error");

    }
}


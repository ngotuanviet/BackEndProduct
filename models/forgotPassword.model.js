const { default: mongoose } = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    otp: {
        type: String,
        required: true, // Bắt buộc phải có
    },
    expiresAt: {
        type: Date,
        expires: 180
    }
}, {
    timestamps: true,
}
);
const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema, "forgotPassword")
module.exports = forgotPassword;
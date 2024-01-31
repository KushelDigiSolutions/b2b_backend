const mongoose = require("mongoose")

const mySchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    role: String,
    status: {
        type: String,
        default: "true"
    },
    designation: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    img: {
        type: Object,
        default: {}
    },
}, { timestamps: true });

const User = mongoose.model('User', mySchema);

module.exports = User;

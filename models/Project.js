const mongoose = require('mongoose');

const mySchema = mongoose.Schema({
    title: String,
    location: String,
    desc: String,
    defaultImg: String,
    createdBy: Object,
    ts: String,
    status: String,
    img: {
        type: Array,
        default: []
    },
    isFavorite: {
        type: String,
        default: "false"
    }
}, { timestamps: true });

const Project = mongoose.model('Project', mySchema);

module.exports = Project;

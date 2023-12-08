const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    courses: {
        type: Array,
        required: false
    },
});

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;
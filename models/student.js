const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({ // defines schema
    id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    courses: {
        type: Array,
        required: true
    },
    enrollment: {
        type: Boolean,
        default: false
    },
});

const Student = mongoose.model('Student', studentSchema); // creates model
module.exports = Student; // makes available for import
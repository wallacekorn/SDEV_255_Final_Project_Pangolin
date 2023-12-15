// Import necessary modules and packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Course Schema
const courseSchema = new Schema({
    courseID: {
        type: String,
        required: true,
        unique: true,
        default: 0
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    createdby: {
        type: String,
        required: true
    }
});

// Allow for export
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
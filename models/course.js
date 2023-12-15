// Import necessary modules and packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Course schema
const courseSchema = new Schema({
    courseID: {
        type: String,
        required: true,
        default: 0
    },
    name: {
        type: String,
        required: [true, 'Please enter a course name'],
    },
    description: {
        type: String,
        required:  [true, 'Please enter a course description'],
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
        required: [true, 'Please select an instructor for the course'],
    }
});

// Create and export the Course model
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
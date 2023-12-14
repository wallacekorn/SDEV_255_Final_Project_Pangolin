// Import necessary modules and packages
const mongoose = require('mongoose');

// Define the Course schema
const courseSchema = new mongoose.Schema({
  // Course details
  title: {
    type: String,
    required: [true, 'Please enter a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please enter a course description'],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: [true, 'Please select an instructor for the course'],
  },
  // Other fields can be added based on the requirements
});

// Create and export the Course model
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
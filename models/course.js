const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  schedule: {
    type: String,
    required: true
  },
  campus: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  credits: {
    type: String,
    required: true
  },
});

const Course = mongoose.model('Course', courseSchema); 
module.exports = Course;
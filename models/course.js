const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({ // defines schema
    courseNum: {
        type: Number,
        required: true
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

const Course = mongoose.model('Course', courseSchema); // creates model
module.exports = Course; // makes available for import
// Importing necessary modules and models
const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Course = require('../models/course');

// Authentication middleware
const authMW = require('../middleware/authMiddleware');
const authCheckStudent = authMW.authCheckStudent;
const loginCheck = authMW.loginCheck;

// Route to render the student home page
router.get('/', loginCheck, authCheckStudent, (req, res) => {
    // Rendering the 'students' view with the title 'Student Home Page'
    res.render('students', { title: 'Student Home Page' });
});

// Exporting the router for use in the application
module.exports = router;
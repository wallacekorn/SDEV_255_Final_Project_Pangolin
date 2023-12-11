const express = require('express');

const router = express.Router();
const Student = require('../models/student');
const Course = require('../models/course');

// Authentication
const authMW = require('../middleware/authMiddleware');
const authCheckStudent = authMW.authCheckStudent;
const loginCheck = authMW.loginCheck;

router.get('/', loginCheck, authCheckStudent,  (req, res) => {
    res.render('students', { title: 'Student Home Page' });
});

module.exports = router;
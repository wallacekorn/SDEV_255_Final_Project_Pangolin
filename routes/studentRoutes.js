// Importing necessary modules and models
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Student = require('../models/student');
const Course = require('../models/course');

// Authentication middleware
const authMW = require('../middleware/authMiddleware');
const authCheckStudent = authMW.authCheckStudent;
const loginCheck = authMW.loginCheck;

// creates new token
const createNewToken = (id, authType, email, firstName, lastName, courses) => {
    return jwt.sign({ id, authType, email, firstName, lastName, courses}, 'super secret code', {
        expiresIn: 172800 // 2 days in seconds
    });
}

router.get('/', loginCheck, authCheckStudent,  async (req, res) => {
    const email = res.locals.email;
    const student = await Student.findOne({ email }).exec(); // find student by email
    const courseIDs = student.courses; // stores the courseID's array
    const student_courses = await Course.find({ courseID: { $in: courseIDs } }).exec(); // looks up the course information by the courseIDs
    res.render('students', { title: 'Student Home Page', student_courses });
});

router.post('/registerCourse', authCheckStudent, async (req, res) => {
    const { courseID } = req.body;
    let email = res.locals.email;
    authType = res.locals.authType;
    
    try {
        const course = await Course.findOne({courseID}).exec(); // Find the course by ID
        const student = await Student.findOne({email}).exec(); // Find student by email
    
    // check if the course is already there
    if (student.courses.includes(course.courseID)) {
        return res.status(400).send({ error: 'Student is already registered for this course' });
    }
    // update the student's courses array
    await Student.updateOne(
        { email },
        { $push: { courses: courseID } }
    );
    // gets the updated student
    const updatedStudent = await Student.findOne({ email }).exec();
    console.log('updatedStudent: ', updatedStudent);
    // Extract fields for rebuiling the token, creates token, and assigns it to a cookie
    const { _id, firstName, lastName, courses } = updatedStudent;
    const token = createNewToken(_id, authType, email, firstName, lastName, courses);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 178000 });

    res.status(200).json({ success: true }); // sends response to the front end

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/deleteCourse', authCheckStudent, async (req, res) => {
    const { courseID } = req.body;
    let email = res.locals.email;
    
   await Student.findOneAndUpdate(
            { email },
            { $pull: { courses: courseID } }
        ).exec();
        
    res.status(200).json({ success: true });
});


module.exports = router;
const express = require('express');

const router = express.Router();
const Course = require('../models/course');

// Authentication
const authMW = require('../middleware/authMiddleware');
const authCheckInstructor = authMW.authCheckInstructor;
const loginCheck = authMW.loginCheck;


// Display the instructor page with courses
router.get('/', loginCheck, authCheckInstructor, async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('instructor', { title: 'Instructor Home Page', courses });
    } catch (err) {
        console.error(err);
        res.status(404).send('Page not found');
    }
});

// Display the course edit page
router.get('/edit/:title', loginCheck, authCheckInstructor, async (req, res) => {
    const courseTitle = req.params.title;
    try {
        const course = await Course.findOne({ name: courseTitle });
        res.render('editCourse', { title: 'Edit Course', course });
    } catch (err) {
        console.error(err);
        res.status(404).send('Course not found');
    }
});

// Handle course update
router.post('/edit/:title', async (req, res) => {
    const courseTitle = req.params.title;
    const updatedCourse = {
        courseID: req.body.courseID,
        name: req.body.name,
        description: req.body.description,
        subject: req.body.subject,
        credits: req.body.credits,
        createdby: req.body.createdby
    };
    try {
        const course = await Course.findOne({ name: courseTitle });
        await Course.updateOne({ name: courseTitle }, updatedCourse);
        res.redirect('/instructor');
    } catch (err) {
        console.error(err);
        res.status(404).send('Could not update the course');
    }
});

// Display the course deletion confirmation page
router.get('/delete/:name', loginCheck,authCheckInstructor, async (req, res) => {
    const courseTitle = req.params.name;
    try {
        const course = await Course.findOne({ name: courseTitle });
        res.render('deleteCourse', { title: 'Delete Course', course });
        res.status(404).render('404', { title: '404: Page Not Found' });
    } catch (err) {
        console.error(err);
        res.status(404).send('Course not found.');
    }
});

// Handle course deletion
router.post('/delete/:name', async (req, res) => {
    const courseTitle = req.params.name;
    try {
        const course = await Course.findOne({ name: courseTitle });
        await Course.deleteOne({ name: courseTitle });
        res.redirect('/instructor');
    } catch (err) {
        console.error(err);
        res.status(404).send('Course could not be deleted.');
    }
});


router.get('/add-course', loginCheck, authCheckInstructor, (req, res) => {
  res.render('addCourse', { title: 'Add Course' });
});

router.post('/add-course', async (req, res) => {
try {
    const newCourse = new Course({
        courseID: req.body.courseID,
        name: req.body.name,
        description: req.body.description,
        subject: req.body.subject,
        credits: req.body.credits,
        createdby: req.body.createdby
    });
    await newCourse.save();
    res.redirect('/instructor');
} catch (err) {
    console.error(err);
    res.status(404).send('Course not added');
}
});

module.exports = router;
// Import necessary modules and models
const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Import middleware for authentication check
const authMW = require('../middleware/authMiddleware');
const authCheckInstructor = authMW.authCheckInstructor;
const loginCheck = authMW.loginCheck;

// Display the instructor page with courses
router.get('/', loginCheck, authCheckInstructor, async (req, res) => {
    try {
        // Get the email of the currently logged-in instructor
        let email = res.locals.email;

        // Find courses created by the logged-in instructor
        const instructor_courses = await Course.find({ createdby: email });

        // Render the instructor page with the list of courses
        res.render('instructor', { title: 'Instructor Home Page', instructor_courses });
    } catch (err) {
        // Handle errors and send an error response if the page is not found
        console.error(err);
        res.status(404).send('Page not found');
    }
});

// Display the course edit page
router.get('/edit/:title', loginCheck, authCheckInstructor, async (req, res) => {
    const courseTitle = req.params.title;
    try {
        res.locals.instructor = req.params.createdby;
        // Find the course to be edited by its title
        const course = await Course.findOne({ name: courseTitle });

        // Render the editCourse page with the course details
        res.render('editCourse', { title: 'Edit Course', course });
    } catch (err) {
        // Handle errors and send an error response if the course is not found
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
        // Find the course to be updated by its title and update its details
        const course = await Course.findOne({ name: courseTitle });
        await Course.updateOne({ name: courseTitle }, updatedCourse);

        // Redirect to the instructor's home page after successfully updating the course
        res.redirect('/instructor');
    } catch (err) {
        // Handle errors and send an error response if the course update fails
        console.error(err);
        res.status(404).send('Could not update the course');
    }
});

// Display the course deletion confirmation page
router.get('/delete/:name', loginCheck, authCheckInstructor, async (req, res) => {
    const courseTitle = req.params.name;
    try {
        // Find the course to be deleted by its title
        const course = await Course.findOne({ name: courseTitle });

        // Render the deleteCourse page with the course details for confirmation
        res.render('deleteCourse', { title: 'Delete Course', course });
    } catch (err) {
        // Handle errors and render a 404 page if the course is not found
        console.error(err);
        res.status(404).render('404', { title: '404: Page Not Found' });
    }
});

// Handle course deletion
router.post('/delete/:name', async (req, res) => {
    const courseTitle = req.params.name;
    try {
        // Find the course to be deleted by its title and delete it
        const course = await Course.findOne({ name: courseTitle });
        await Course.deleteOne({ name: courseTitle });

        // Redirect to the instructor's home page after successfully deleting the course
        res.redirect('/instructor');
    } catch (err) {
        // Handle errors and send an error response if the course deletion fails
        console.error(err);
        res.status(404).send('Course could not be deleted.');
    }
});

// Display the page to add a new course
router.get('/add-course', loginCheck, authCheckInstructor, (req, res) => {
    res.render('addCourse', { title: 'Add Course' , createdby: res.locals.email });
});

// Handle the submission of the new course form
router.post('/add-course', async (req, res) => {
    try {
        // Create a new Course instance with the provided data from the form
        const newCourse = new Course({
            courseID: req.body.courseID,
            name: req.body.name,
            description: req.body.description,
            subject: req.body.subject,
            credits: req.body.credits,
            createdby: req.body.createdby
        });

        // Save the new course to the database
        await newCourse.save();

        // Redirect to the instructor's home page after successfully adding the course
        res.redirect('/instructor');
    } catch (err) {
        // Handle errors and send an error response if course addition fails
        console.error(err);
        res.status(404).send('Course not added');
    }
});

// Export the router for use in other parts of the application
module.exports = router;
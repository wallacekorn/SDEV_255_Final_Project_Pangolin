// Import required modules and models
const express = require('express');
const router = express.Router();
const Instructor = require('../models/instructor');
const Course = require('../models/course');
const Student = require('../models/student');
const Admin = require('../models/admin');

// Import authentication middleware
const authMW = require('../middleware/authMiddleware');
const authCheckAdmin = authMW.authCheckAdmin;
const loginCheck = authMW.loginCheck;

// Display the admin page with instructors
router.get('/', loginCheck, authCheckAdmin, async (req, res) => {
    try {
        // Fetch instructors, courses, and students from the database
        const instructors = await Instructor.find();
        const courses = await Course.find();
        const students = await Student.find();

        // Render the admin page with fetched data
        res.render('admin', { title: 'Administration Home Page', instructors, courses, students });
    } catch (err) {
        console.error(err);
        res.status(404).send('No instructors found');
    }
});

// Display the instructor edit page
router.get('/edit/:email', loginCheck, authCheckAdmin, async (req, res) => {
    const instructorEmail = req.params.email;
    try {
        // Find the instructor based on the provided email
        const instructor = await Instructor.findOne({ email: instructorEmail });

        // Render the instructor edit page with instructor data
        res.render('editInstructor', { title: 'Edit Instructor', instructor });
    } catch (err) {
        console.error(err);
        res.status(404).send('Instructor not found');
    }
});

// Handle instructor update
router.post('/edit/:email', async (req, res) => {
    const instructorEmail = req.params.email;
    const updatedInstructor = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        courses: req.body.courses,
        email: req.body.email,
        password: req.body.password
    };

    try {
        // Find and update the instructor based on the provided email
        const instructor = await Instructor.findOne({ email: instructorEmail });
        await Instructor.updateOne({ email: instructorEmail }, updatedInstructor);

        // Redirect to the admin page after successful update
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(404).send('Could not update the instructor');
    }
});

// Display the Instructor deletion confirmation page
router.get('/delete/:email', loginCheck, authCheckAdmin, async (req, res) => {
    const instructorEmail = req.params.email;
    try {
        // Find the instructor based on the provided email
        const instructor = await Instructor.findOne({ email: instructorEmail });

        // Render the instructor deletion confirmation page with instructor data
        res.render('deleteInstructor', { title: 'Delete Instructor', instructor });
    } catch (err) {
        console.error(err);
        res.status(404).send('Instructor not found.');
    }
});

// Handle instructor deletion
router.post('/delete/:email', async (req, res) => {
    const instructorEmail = req.params.email;
    try {
        // Find and delete the instructor based on the provided email
        const instructor = await Instructor.findOne({ email: instructorEmail });
        await Instructor.deleteOne({ email: instructorEmail });

        // Redirect to the admin page after successful deletion
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(404).send('Instructor could not be deleted.');
    }
});

// Display the page to add a new instructor
router.get('/add-instructor', loginCheck, authCheckAdmin, (req, res) => {
    res.render('addInstructor', { title: 'Add Instructor' });
});

// Handle the addition of a new instructor
router.post('/add-instructor', async (req, res) => {
    try {
        // Create a new instructor based on the provided data
        const newInstructor = new Instructor({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            courses: req.body.courses,
            email: req.body.email,
            password: req.body.password
        });

        // Save the new instructor to the database
        await newInstructor.save();

        // Redirect to the admin page after successful addition
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(404).send('Instructor not added');
    }
});

// Export the router for use in the main application
module.exports = router;
const express = require('express');

const router = express.Router();
const Instructor = require('../models/instructor');

// Authentication
const authMW = require('../middleware/authMiddleware');
const authCheckAdmin = authMW.authCheckAdmin;

// Display the admin page with instructors
router.get('/', authCheckAdmin,  async (req, res) => {
    try {
        const instructors = await Instructor.find();
        res.render('admin', { title: 'Administration Home Page', instructors });
    } catch (err) {
        console.error(err);
        res.status(404).send('No instructors found');
    }
});

// Display the instructor edit page
router.get('/edit/:email', authCheckAdmin, async (req, res) => {
    const instructorEmail = req.params.email;
    try {
        const instructor = await Instructor.findOne({ email: instructorEmail });
        res.render('editInstructor', { title: 'Edit Instructor', instructor });
    } catch (err) {
        console.error(err);
        res.status(404).send('Instructor not found');
    }
});

// Handle instructor update
router.post('/edit/:email', authCheckAdmin, async (req, res) => {
    const instructorEmail = req.params.email;
    const updatedInstructor = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        courses: req.body.courses,
        isTeacher: req.body.isTeacher,
        email: req.body.email,
        password: req.body.password
    };    
    try {
        const instructor = await Instructor.findOne({ email: instructorEmail });
        await Instructor.updateOne({ email: instructorEmail }, updatedInstructor);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(404).send('Could not update the instructor');
    }
});

// Display the Instructor deletion confirmation page
router.get('/delete/:email', authCheckAdmin, async (req, res) => {
    const instructorEmail = req.params.email;
    try {
        const instructor = await Instructor.findOne({ email: instructorEmail });
        res.render('deleteInstructor', { title: 'Delete Instructor', instructor });
    } catch (err) {
        console.error(err);
        res.status(404).send('Instructor not found.');
    }
});

// Handle instructor deletion
router.post('/delete/:email', authCheckAdmin, async (req, res) => {
    const instructorEmail = req.params.email;
    try {
        const instructor = await Instructor.findOne({ email: instructorEmail });
        await Instructor.deleteOne({ email: instructorEmail });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(404).send('Instructor could not be deleted.');
    }
});


router.get('/add-instructor', authCheckAdmin, (req, res) => {
  res.render('addInstructor', { title: 'Add Instructor' });
});

router.post('/add-instructor', authCheckAdmin, async (req, res) => {
try {
    const newInstructor = new Instructor({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        courses: req.body.courses,
        isTeacher: req.body.isTeacher,
        email: req.body.email,
        password: req.body.password
    });
    await newInstructor.save();
    res.redirect('/admin');
} catch (err) {
    console.error(err);
    res.status(404).send('instructor not added');
}
});

module.exports = router;
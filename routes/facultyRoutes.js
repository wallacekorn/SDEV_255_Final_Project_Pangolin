const express = require('express');

const router = express.Router();
const Course = require('../models/course');


// Display the faculty page with courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('faculty', { title: 'Faculty Home Page', courses });
    } catch (err) {
        console.error(err);
        res.status(404).send('Unable to retrieve courses');
    }
});

// Display the course edit page
router.get('/edit/:title', async (req, res) => {
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
        courseNum: req.body.courseNum,
        name: req.body.name,
        description: req.body.description,
        subject: req.body.subject,
        credits: req.body.credits,
        createdby: req.body.createdby
    };
    try {
        const course = await Course.findOne({ name: courseTitle });
        await Course.updateOne({ name: courseTitle }, updatedCourse);
        res.redirect('/faculty');
    } catch (err) {
        console.error(err);
        res.status(404).send('Could not update the course');
    }
});

// Display the course deletion confirmation page
router.get('/delete/:name', async (req, res) => {
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
        res.redirect('/faculty');
    } catch (err) {
        console.error(err);
        res.status(404).send('Course could not be deleted.');
    }
});


router.get('/add-course', (req, res) => {
  res.render('addCourse', { title: 'Add Course' });
});

router.post('/add-course', async (req, res) => {
try {
    const newCourse = new Course({
        courseNum: req.body.courseNum,
        name: req.body.name,
        description: req.body.description,
        subject: req.body.subject,
        credits: req.body.credits,
        createdby: req.body.createdby
    });
    await newCourse.save();
    res.redirect('/faculty');
} catch (err) {
    console.error(err);
    res.status(404).send('Course not added');
}
});

module.exports = router;
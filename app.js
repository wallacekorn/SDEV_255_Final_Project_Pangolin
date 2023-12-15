// Importing necessary modules and packages
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

// Importing route handlers for different user types
const authRoutes = require('./routes/authRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Importing models for database operations
const Instructor = require('./models/instructor');
const Student = require('./models/student');
const Course = require('./models/course');
const Admin = require('./models/admin');

// Importing Lodash utility function
const { identity } = require('lodash');

// Importing authentication middleware
const authMW = require('./middleware/authMiddleware');
const loginCheck = authMW.loginCheck;
const authCheckAdmin = authMW.authCheckAdmin;
const authCheckInstructor = authMW.authCheckInstructor;
const authCheckStudent = authMW.authCheckStudent;

// Creating an instance of the Express application
const app = express();

// mongodb+srv://PangolinPal:Pangolin_Pal_1@cluster0.i4h9m9n.mongodb.net/pangolin_data?retryWrites=true&w=majority
const dbURI = 'mongodb+srv://teacher1:teacherpass@pangolincluster.4zlie5n.mongodb.net/PangolinDB?retryWrites=true&w=majority';

// Connecting to MongoDB and starting the Express app
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// Setting the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Configuring middleware for JSON parsing and URL-encoded data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling cookies
app.use(cookieParser());

// Setting up routes for different parts of the application
app.get('/', loginCheck, (req, res) => {
    // Rendering the 'index' view with the title 'Home'
    res.render('index', { title: 'Home'}); 
});

app.get('/courses',loginCheck, async (req, res) => {
  try {        
        const student_courses = res.locals.student_courses;
        const courses = await Course.find();
        res.render('allCourses', { title: 'Courses', courses, student_courses });
  } catch (err) {
        console.error(err);
        res.status(404).send('Unable to retrieve courses');
  }
});

app.get('/adminCreation', (req, res) => {
    // Rendering the 'adminCreation' view with the title 'Admin Creation'
    res.render('adminCreation', { title: 'Admin Creation' });
});

app.post('/adminCreation', async (req, res) => {
    // Handling the creation of a new admin
    try {
        const newAdmin = new Admin({
            email: req.body.email,
            password: req.body.password
        });
        console.log(newAdmin, ' newAdmin');
        await newAdmin.save();
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(404).send('Admin was not added');
    }
});

// Using authentication routes
app.use(authRoutes);
// Using student routes
app.use('/students', studentRoutes);
// Using instructor routes
app.use('/instructor', instructorRoutes);
// Using admin routes
app.use('/admin', adminRoutes);

// Handling 404 errors
app.use((req, res) => {
    res.status(404).render('404', { title: '404: Page Not Found' });
});
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');

const Course = require('./models/course');
const Admin = require('./models/admin');

const { identity } = require('lodash');

//Auth
const authMW = require('./middleware/authMiddleware');
const loginCheck = authMW.loginCheck;
const authCheckAdmin = authMW.authCheckAdmin;
const authCheckInstructor = authMW.authCheckInstructor;

const app = express();
// mongodb+srv://PangolinPal:Pangolin_Pal_1@cluster0.i4h9m9n.mongodb.net/pangolin_data?retryWrites=true&w=majority
const dbURI = 'mongodb+srv://teacher1:teacherpass@pangolincluster.4zlie5n.mongodb.net/PangolinDB?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => app.listen(3001))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//cookies middleware
app.use(cookieParser());

// routes
app.get('/', loginCheck, (req, res) => {
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
    res.render('adminCreation', { title: 'Admin Creation' });
  });
  
app.post('/adminCreation', async (req, res) => {
try {
    const newAdmin = new Admin({
        email: req.body.email,
        password: req.body.password
    });
    console.log(newAdmin, ' newAdmin')
    await newAdmin.save();
    res.redirect('/admin');
} catch (err) {
    console.error(err);
    res.status(404).send('Admin was not added');
}
});

// authentication routes
app.use(authRoutes);
// student routes
app.use('/students', studentRoutes);
// instructor routes
app.use('/instructor', instructorRoutes);
// admin routes
app.use('/admin', adminRoutes);


// 404 route
app.use((req, res) => {
    res.status(404).render('404', { title: '404: Page Not Found' });
});
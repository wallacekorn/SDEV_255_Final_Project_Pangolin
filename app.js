const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const facultyRoutes = require('./routes/facultyRoutes');

const Instructor = require('./models/instructor');
const Student = require('./models/student');
const Course = require('./models/course');

const { identity } = require('lodash');

const app = express();

const dbURI = 'mongodb+srv://PangolinPal:Pangolin_Pal_1@cluster0.i4h9m9n.mongodb.net/pangolin_data?retryWrites=true&w=majority';
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

// faculty routes
app.use('/faculty', facultyRoutes);

// authentication routes
app.use(authRoutes);

// routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home'}); 
});

app.get('/courses', async (req, res) => {
  try {
      const courses = await Course.find();
      res.render('allCourses', { title: 'Courses', courses });
  } catch (err) {
      console.error(err);
      res.status(404).send('Unable to retrieve courses');
  }
});

app.get('/singleCourse', (req, res) => {
    res.render('singleCourse', { title: 'Courses'});
});

app.get('/students', (req, res) => {
    res.render('students', { title: 'Student Home Page' });
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404: Page Not Found' });
});

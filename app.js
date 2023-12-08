const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const facultyRoutes = require('./routes/facultyRoutes');

const Instructor = require('./models/instructor');
const Student = require('./models/student');
const Course = require('./models/course');

const { identity } = require('lodash');

const app = express();

const dbURI = 'mongodb+srv://teacher1:teacherpass@pangolincluster.4zlie5n.mongodb.net/PangolinDB?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// faculty routes
app.use('/faculty', facultyRoutes);


app.get('/', (req, res) => {
    res.render('index', { title: 'Home'}); 
});

app.get('/courses', async (req, res) => {
  try {
      const courses = await Course.find();
      res.render('course_page', { title: 'Courses', courses });
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

app.get('/login', (req, res) => {
    res.render('login', { title: 'Sign In' });
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404: Page Not Found' });
});

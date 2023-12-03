const express = require('express');
const mongoose = require('mongoose');
const Instructor = require('./models/instructor');
const Student = require('./models/student');
const Course = require('./models/course');

const app = express();

const dbURI = 'mongodb+srv://teacher1:teacherpass@pangolincluster.4zlie5n.mongodb.net/PangolinDB?retryWrites=true&w=majority';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));

//mongoose and mongo routes
// app.get('/add-student', (req,res) => {
//     const student = new Student({}
//         name: ''

//     })
// })






const courses = [
    {
        title: 'Scales 101', 
        description: 'Learn how to maintain your scales for peak shininess.',
        subject: 'Health',
        credits: '2'
    },
    {
        title: 'Effective Insect Hunting', 
        description: 'How to find the best insects to eat, and fast!',
        subject: 'Nutrition',
        credits: '1.5'
    },
    {
        title: 'Pangolin Taxonomy', 
        description: 'Learn about the taxonomy and history of the Pangolin species.',
        subject: 'History',
        credits: '3'
    },
    {
        title: 'Pangolinish 203', 
        description: 'Advanced study of the Pangolish language and literature.',
        subject: 'Pangolinish Studies',
        credits: '2'
    },
]

app.get('/', (req, res) => {
    res.render('index', { title: 'Home'}); 
});

app.get('/courses', (req, res) => {
    res.render('course_page', { title: 'Courses', courses });
});

app.get('/singleCourse', (req, res) => {
    res.render('singleCourse', { title: 'Courses'});
});

app.get('/faculty', (req, res) => {
    res.render('faculty', { title: 'Faculty Home Page' });
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
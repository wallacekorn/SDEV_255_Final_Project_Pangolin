const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.listen(3000);

app.use(express.static('public'));

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
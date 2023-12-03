  const express = require('express');

  const app = express();
  const mongoose = require('mongoose');
  const Course = require('./models/course');

  const dbURI = 'mongodb+srv://PangolinPal:Pangolin_Pal_1@cluster0.i4h9m9n.mongodb.net/pangolin_data?retryWrites=true&w=majority';
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3006))
    .catch((err) => console.log(err));


  app.set('view engine', 'ejs');



  app.use(express.static('public'));
  app.use(express.urlencoded({ extended: true }));

  app.get('/add-course', (req, res) => {
    const course = new Course({
      title: 'Pangolinish 203',
      instructor: 'Prof. Perry',
      description: 'Advanced study of the Pangolish language and literature.',
      schedule: '9am-10:30am MT',
      campus: 'Indianapolis',
      subject: 'Pangolinish Studies',
      credits: '2'
    });


    course.save()
      .then((result) => {
        res.send('Course added successfully'); 
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error adding course'); 
      });
  });

  app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
  });


  app.get('/courses', (req, res) => {
    Course.find()
      .then((result) => {
        res.render('course_page', { title: 'Courses', courses: result });
      })
      .catch((err) => {
        console.log(err);
      })
  })

  app.post('/courses', (req, res) => {
    const course = new Course(req.body);

    course.save()
      .then((result) => {
        res.redirect('/courses')
      })
      .catch((err) => {
        console.log(err);
      })
  })
  app.get('/staff', (req, res) => {
    Course.find()
      .then((result) => {
        res.render('create', { title: 'Staff', courses: result });
      })
      .catch((err) => {
        console.log(err);
      })
  })
  app.get('/staff', (req, res) => {
    res.render('create', { title: 'Create Course' });
  })

  app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  })
const express = require('express');
const mongoose = require('mongoose');
const Instructor = require('./models/instructor');
const Student = require('./models/student');
const Course = require('./models/course');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const dbURI = 'mongodb+srv://PangolinPal:Pangolin_Pal_1@cluster0.i4h9m9n.mongodb.net/pangolin_data?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

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

// Display the faculty page with courses
app.get('/faculty', (req, res) => {
    res.render('faculty', { title: 'Faculty Home Page', courses });
  });
  
  // Display the course edit page
  app.get('/faculty/edit/:title', (req, res) => {
    const courseTitle = req.params.title;
    const course = courses.find(course => course.title === courseTitle);
  
    if (course) {
      res.render('editCourse', { title: 'Edit Course', course });
    } else {
      res.status(404).render('404', { title: '404: Page Not Found' });
    }
  });
  
  // Handle course update
  app.post('/faculty/edit/:title', (req, res) => {
    const courseTitle = req.params.title;
    const updatedCourse = {
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      credits: req.body.credits,
    };
  
    // Update the course in the courses array (replace with MongoDB update logic)
    const index = courses.findIndex(course => course.title === courseTitle);
    if (index !== -1) {
      courses[index] = updatedCourse;
      res.redirect('/faculty');
    } else {
      res.status(404).render('404', { title: '404: Page Not Found' });
    }
  });
  
  // Display the course deletion confirmation page
  app.get('/faculty/delete/:title', (req, res) => {
    const courseTitle = req.params.title;
    const course = courses.find(course => course.title === courseTitle);
  
    if (course) {
      res.render('deleteCourse', { title: 'Delete Course', course });
    } else {
      res.status(404).render('404', { title: '404: Page Not Found' });
    }
  });
  
  // Handle course deletion
  app.post('/faculty/delete/:title', (req, res) => {
    const courseTitle = req.params.title;
  
    // Remove the course from the courses array (replace with MongoDB delete logic)
    const index = courses.findIndex(course => course.title === courseTitle);
    if (index !== -1) {
      courses.splice(index, 1);
      res.redirect('/faculty');
    } else {
      res.status(404).render('404', { title: '404: Page Not Found' });
    }
  });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  // Add this route to app.js
app.get('/faculty/add-course', (req, res) => {
    res.render('addCourse', { title: 'Add Course' });
});

app.post('/faculty/add-course', (req, res) => {
    // Logic to handle adding a new course (replace with MongoDB logic)
    const newCourse = {
        title: req.body.title,
        description: req.body.description,
        subject: req.body.subject,
        credits: req.body.credits,
    };

    // Add the new course to the courses array (replace with MongoDB logic)
    courses.push(newCourse);

    // Redirect to the faculty page after adding the course
    res.redirect('/faculty');
});



app.get('/', (req, res) => {
    res.render('index', { title: 'Home'}); 
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

  app.get('/login', (req, res) => {
    res.render('login', { title: 'Sign In' });
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404: Page Not Found' });
});

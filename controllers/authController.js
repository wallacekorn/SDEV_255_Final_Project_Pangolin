// Importing required modules and models
const { reduceRight } = require('lodash');
const Student = require('../models/student');
const Instructor = require('../models/instructor');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { loginCheck } = require('../middleware/authMiddleware');

// Handle errors during signup and login
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // Check for duplicate email (code 11000)
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // Incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'Email is not registered';
    }

    // Incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'Password is incorrect';
    }

    // Validation errors
    if (err.message.includes('Student validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const createToken = (id, authType, email, firstName, lastName, student_courses) => {
    return jwt.sign({ id, authType, email, firstName, lastName, student_courses}, 'super secret code', {
        expiresIn: 172800 // 2 days in seconds
    });
}

// Handle GET request to render signup page
module.exports.signup_get = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
}

// Handle GET request to render login page
module.exports.login_get = (req, res) => {
    res.render('login', { title: 'Log In' });
}

// Handle POST request for user signup
module.exports.signup_post = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const student = await Student.create({ firstName, lastName, email, password });
        const token = createToken(student._id, 'student');
        res.cookie('jwt', token, {httpOnly: true, maxAge: 178000});
        res.status(201).json({student: student._id, authType: 'student'});
    }
    catch(err) {
        const errors = handleErrors(err);  
        res.status(400).send({errors});
    }
}

// Handle POST request for user login
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Try to login as a student
        const student = await Student.login(email, password).catch(() => null);
        // Try to login as an instructor
        const instructor = await Instructor.login(email, password).catch(() => null);
        // Try to login as an admin
        const admin = await Admin.login(email, password).catch(() => null);

        if (student) {
            const firstName = student.firstName;
            const lastName = student.lastName;
            const student_courses = student.courses;

            const token = createToken(student._id, 'student', email, firstName, lastName, student_courses );
            res.cookie('jwt', token, { httpOnly: true, maxAge: 178000 });
            res.status(200).json({ student: student._id, authType: 'student', email});
        }
        else if(instructor) {
            const firstName = instructor.firstName;
            const lastName = instructor.lastName;
            const token = createToken(instructor._id, 'instructor', email, firstName, lastName);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 178000 });
            res.status(200).json({ instructor: instructor._id, authType: 'instructor', email });
        }
        else if(admin) {
            const token = createToken(admin._id, 'admin', email);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 178000 });
            res.status(200).json({ admin: admin._id, authType: 'admin', email });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    };
};

// Handle GET request to log out
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
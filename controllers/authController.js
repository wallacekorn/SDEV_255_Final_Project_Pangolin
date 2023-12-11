const { reduceRight } = require('lodash');
const Student = require('../models/student');
const Instructor = require('../models/instructor');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { loginCheck } = require('../middleware/authMiddleware');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: '' };

    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'Email is not registered';
      }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'Password is incorrect';
      }

    // validation errors
    if (err.message.includes('Student validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

const createToken = (id, authType) => {
    return jwt.sign({ id, authType }, 'super secret code', {
        expiresIn: 172800 //seconds
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup', { title: 'Sign Up' });
} 
  
module.exports.login_get = (req, res) => {
    res.render('login', { title: 'Log In' });
}

module.exports.signup_post = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const student = await Student.create({ firstName, lastName,  email, password });
        const token = createToken(student._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: 178000});
        res.status(201).json(student._id);
    }
    catch(err) {
        const errors = handleErrors(err);  
        res.status(400).send({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.login(email, password).catch(() => null);
        const instructor = await Instructor.login(email, password).catch(() => null);
        const admin = await Admin.login(email, password).catch(() => null);
        if (student) {
            const token = createToken(student._id, 'student');
            res.cookie('jwt', token, { httpOnly: true, maxAge: 178000 });
            res.status(200).json({ student: student._id, authType: 'student' });
        }
        else if(instructor) {
            const token = createToken(instructor._id, 'instructor');
            res.cookie('jwt', token, { httpOnly: true, maxAge: 178000 });
            res.status(200).json({ instructor: instructor._id, authType: 'instructor' });
        }
        else if(admin) {
            const token = createToken(admin._id, 'admin');
            res.cookie('jwt', token, { httpOnly: true, maxAge: 178000 });
            res.status(200).json({ admin: admin._id, authType: 'admin' });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    };
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}
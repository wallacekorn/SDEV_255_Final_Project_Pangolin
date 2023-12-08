const { reduceRight } = require('lodash');
const Student = require('../models/student');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email: '', password: '' };

    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('Student validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
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
        res.status(201).json(student);
    }
    catch(err) {
        const errors = handleErrors(err);  
        res.status(400).send({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password } = req.body;
    res.send('user login');
}

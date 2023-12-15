// Importing the JSON web token (JWT) module
const jwt = require('jsonwebtoken');

// Middleware function for checking if a user is logged in
const loginCheck = (req, res, next) => {
    // Checking if the JWT cookie exists in the request
    if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        
        jwt.verify(token, 'super secret code', (err, decodedToken) => { // verifies the token is valid
            if (err) {
                console.log(err); // Log error if token verification fails
            } else {
                // Set local variables for authentication type and login status
                res.locals.authType = decodedToken.authType || 'none';
                res.locals.loggedIn = true;
                next();
            }
        });
    } else {
        // Set local variables for authentication type and login status
        res.locals.loggedIn = false;
        res.locals.authType = 'none';
        next();
    }
};

// Middleware function for checking if a user is an admin
const authCheckAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    // Checking if the JWT token exists
    if (token) {
        // Verifying the token's validity
        jwt.verify(token, 'super secret code', (err, decodedToken) => {
            if (err || decodedToken.authType !== 'admin') { // Redirect if not admin
                res.redirect('/login');
            } else {
                // Set local variables for authentication type, email, and proceed to the next middleware or route
                res.locals.authType = 'admin'; // Set authType to admin if the user is an admin
                res.locals.email = decodedToken.email;
                next();
            }
        });
    } else {
        // Redirect to login page if no token is found
        res.redirect('/login');
    }
};

// Middleware function for checking if a user is an instructor
const authCheckInstructor = (req, res, next) => {
    const token = req.cookies.jwt;
    // Checking if the JWT token exists
    if (token) {
        // Verifying the token's validity
        jwt.verify(token, 'super secret code', (err, decodedToken) => {
            if (err || (decodedToken.authType !== 'admin' && decodedToken.authType !== 'instructor')) {
                res.redirect('/login');
            } else {
                // Preserving admin authType, and setting local variables for email, first name, last name, and proceeding to the next middleware or route
                if (res.locals.authType !== 'admin') {
                    res.locals.authType = 'instructor';
                }
                res.locals.email = decodedToken.email;
                res.locals.firstName = decodedToken.firstName;
                res.locals.lastName = decodedToken.lastName;
                next();
            }
        });
    } else {
        // Redirect to login page if no token is found
        res.redirect('/login');
    }
};

// Middleware function for checking if a user is a student
const authCheckStudent = (req, res, next) => {
    const token = req.cookies.jwt;
    // Checking if the JWT token exists
    if (token) {
        jwt.verify(token, 'super secret code', (err, decodedToken) => {
        if (err || (decodedToken.authType !== 'admin' && decodedToken.authType !== 'instructor' && decodedToken.authType !== 'student')) {
            res.redirect('/login');
        } else {
            // Preserving authType, and setting local variables
            if (res.locals.authType !== 'admin' && res.locals.authType !== 'instructor') {
                res.locals.authType = 'student';}
            res.locals.email = decodedToken.email;
            res.locals.firstName = decodedToken.firstName;
            res.locals.lastName = decodedToken.lastName;
            res.locals.student_courses = decodedToken.student_courses;
            next();
        }
        });
    } else {
        // Redirect to login page if no token is found
        res.redirect('/login');
    }
};

// Exporting the middleware functions
module.exports = { authCheckAdmin, authCheckInstructor, authCheckStudent, loginCheck };
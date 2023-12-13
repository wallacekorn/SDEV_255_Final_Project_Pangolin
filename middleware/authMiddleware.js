const jwt = require('jsonwebtoken');

const loginCheck = (req, res, next) => {
    if (req.cookies.jwt) {
        const token = req.cookies.jwt;
        // verifies the token is valid
        jwt.verify(token, 'super secret code', (err, decodedToken) => {
            if (err) {
                console.log(err);
            } else {
                res.locals.authType = decodedToken.authType || 'none';
                res.locals.loggedIn = true;
                next();
            }
        });
    } else {
        res.locals.loggedIn = false;
        res.locals.authType = 'none';
        next();
    }
};

const authCheckAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
    // verifies the token is valid
    if (token) {
        jwt.verify(token, 'super secret code', (err, decodedToken) => {
        if (err || decodedToken.authType !== 'admin') { //redirects if not admin
            res.redirect('/login');
        } else {
            res.locals.authType = 'admin'; // sets authType to admin if admin
            next();
        }
        });
    } else {
        res.redirect('/login');
    }
};

const authCheckInstructor = (req, res, next) => {
    const token = req.cookies.jwt;
        // verifies the token is valid
        if (token) {
            jwt.verify(token, 'super secret code', (err, decodedToken) => {
            if (err || (decodedToken.authType !== 'admin' && decodedToken.authType !== 'instructor')) {
                res.redirect('/login');
            } else {
                if (res.locals.authType !== 'admin') { // preserves admin authtype
                    res.locals.authType = 'instructor';
                }
                res.locals.email = decodedToken.email;
                next();
            }
            });
        } else {
            res.redirect('/login');
        }
};

const authCheckStudent = (req, res, next) => {
const token = req.cookies.jwt;
        // verifies the token is valid
        if (token) {
            jwt.verify(token, 'super secret code', (err, decodedToken) => {
            if (err || (decodedToken.authType !== 'admin' && decodedToken.authType !== 'instructor' && decodedToken.authType !== 'student')) {
                res.redirect('/login');
            } else {
                if (res.locals.authType !== 'admin' && res.locals.authType !== 'instructor') {
                    res.locals.authType = 'student';}
                next();
            }
            });
        } else {
            res.redirect('/login');
        }
};

module.exports = { authCheckAdmin, authCheckInstructor, authCheckStudent, loginCheck };
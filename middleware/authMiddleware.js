const jwt = require('jsonwebtoken');

const authCheckAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
    // verifies the token is valid
    if (token) {
        jwt.verify(token, 'super secret code', (err, decodedToken) => {
        if (err || decodedToken.authType !== 'admin') {
            res.redirect('/login');
        } else {
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
                next();
            }
            });
        } else {
            res.redirect('/login');
        }
};

module.exports = { authCheckAdmin, authCheckInstructor, authCheckStudent };
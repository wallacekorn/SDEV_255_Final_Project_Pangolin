// Import necessary modules and controllers
const { Router } = require('express');
const authController = require('../controllers/authController');

// Import middleware for authentication check
const authMW = require('../middleware/authMiddleware');
const loginCheck = authMW.loginCheck;

// Create a router instance
const router = Router();

// Define routes for signup, login, and logout
router.get('/signup', loginCheck, authController.signup_get);  // GET request for signup page
router.post('/signup', authController.signup_post);  // POST request for signup form submission
router.get('/login', loginCheck, authController.login_get);  // GET request for login page
router.post('/login', authController.login_post);  // POST request for login form submission
router.get('/logout', authController.logout_get);  // GET request for logout

// Export the router for use in other parts of the application
module.exports = router;
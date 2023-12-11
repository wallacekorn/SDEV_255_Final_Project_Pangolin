const { Router } = require('express');
const authController = require('../controllers/authController');

const authMW = require('../middleware/authMiddleware');
const loginCheck = authMW.loginCheck;

const router = Router();

router.get('/signup', loginCheck, authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', loginCheck, authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

module.exports = router;
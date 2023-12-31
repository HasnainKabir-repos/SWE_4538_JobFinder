const router = require('express').Router();
const {
    register, 
    login,
    getLogin,
    getSignUp,
    getWelcome,
    logout
} = require('../controller/auth.controller');

const isAuthenticated = require('../middleware/auth.middleware');

router.post('/signup', register);
router.get('/signup', getSignUp);
router.post('/login', login);
router.get('/login', getLogin);

router.get('/welcome', isAuthenticated, getWelcome);

router.post('/logout', logout);
module.exports = router;

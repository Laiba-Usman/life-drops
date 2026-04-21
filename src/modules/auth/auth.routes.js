const express = require('express');
const router = express.Router();

const { register, login, getMe, logout } = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');
const { registerValidator, loginValidator } = require('./auth.validator');
const validate = require('../../middleware/validate.middleware');

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;

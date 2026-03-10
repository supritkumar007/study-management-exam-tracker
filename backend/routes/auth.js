const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register student
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Login student
// @access  Public
router.post('/login', authController.login);

module.exports = router;

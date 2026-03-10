const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @route   GET /api/test/server
// @desc    Test server running
// @access  Public
router.get('/server', (req, res) => {
    res.json({ msg: '✅ Server Running' });
});

// @route   GET /api/test/db
// @desc    Test DB connection
// @access  Public
router.get('/db', (req, res) => {
    if (mongoose.connection.readyState === 1) {
        res.json({ msg: '✅ Database Connected' });
    } else {
        res.status(500).json({ msg: '❌ Database Not Connected' });
    }
});

module.exports = router;

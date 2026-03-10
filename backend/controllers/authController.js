const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

exports.register = async (req, res) => {
    console.log('Register Request Body:', req.body);
    const { name, email, password } = req.body;

    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState !== 1) {
        console.error('Database not connected during register attempt');
        return res.status(503).json({ msg: 'Database not connected. Check server logs for whitelist error.' });
    }

    if (!name || !email || !password) {
        console.log('Missing fields', req.body);
        return res.status(400).json({
            msg: `Missing fields. Received: ${JSON.stringify(req.body)}. Name: ${name}, Email: ${email}, Pass: ${password ? '***' : 'Missing'}`
        });
    }

    try {
        let student = await Student.findOne({ email });
        if (student) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: `User already exists with email: ${email}. Try logging in.` });
        }

        student = new Student({
            name,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(password, salt);

        await student.save();

        const payload = {
            student: {
                id: student.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            student: {
                id: student.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, studentId: student.id, name: student.name });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRegistration = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .matches(/^[a-zA-Z0-9._%+-]+@mnit\.ac\.in$/)
        .withMessage('Must be a valid MNIT email address'),
    
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    body('department')
        .trim()
        .notEmpty()
        .withMessage('Department is required')
        .isIn(['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Others'])
        .withMessage('Invalid department'),
    
    body('year')
        .notEmpty()
        .withMessage('Year is required')
        .isInt({ min: 1, max: 4 })
        .withMessage('Year must be between 1 and 4'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits')
];

// Register form
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Register logic
router.post('/register', validateRegistration, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(err => err.msg).join(', '));
            return res.redirect('/register');
        }

        const { email, username, password, department, year, phone } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            req.flash('error', 'Email or username already registered');
            return res.redirect('/register');
        }

        const user = new User({ 
            email, 
            username, 
            department, 
            year, 
            phone 
        });
        
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to MNIT Marketplace, ${username}!`);
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

// Login form
router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('auth/login');
});

// Login logic
router.post('/login', 
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        keepSessionInfo: true
    }), 
    (req, res) => {
        req.flash('success', `Welcome back, ${req.user.username}!`);
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    }
);

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
});

// Profile page
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to view your profile');
        return res.redirect('/login');
    }
    res.render('auth/profile', { user: req.user });
});

// Update profile
router.put('/profile', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            req.flash('error', 'You must be logged in to update your profile');
            return res.redirect('/login');
        }

        const { username, department, year, phone } = req.body;
        
        // Validate phone number if provided
        if (phone && !/^[0-9]{10}$/.test(phone)) {
            req.flash('error', 'Invalid phone number');
            return res.redirect('/profile');
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { username, department, year, phone },
            { runValidators: true, new: true }
        );

        req.flash('success', 'Profile updated successfully');
        res.redirect('/profile');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/profile');
    }
});

module.exports = router; 
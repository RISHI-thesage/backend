const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');

// Library main page
router.get('/', (req, res) => {
    try {
        res.render('library/library', {
            title: 'Library - MNIT Connect',
            user: req.user,
            departments: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Others'],
            semesters: [1, 2, 3, 4, 5, 6, 7, 8]
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/');
    }
});

// Department-specific page
router.get('/:department', (req, res) => {
    try {
        const { department } = req.params;
        const validDepartments = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Others'];
        
        if (!validDepartments.includes(department)) {
            req.flash('error', 'Invalid department');
            return res.redirect('/library');
        }

        res.render('library/department', {
            title: `${department} Library - MNIT Connect`,
            user: req.user,
            department,
            semesters: [1, 2, 3, 4, 5, 6, 7, 8]
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/library');
    }
});

// Semester-specific page
router.get('/:department/:semester', (req, res) => {
    try {
        const { department, semester } = req.params;
        const validDepartments = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Others'];
        const validSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
        
        if (!validDepartments.includes(department)) {
            req.flash('error', 'Invalid department');
            return res.redirect('/library');
        }

        if (!validSemesters.includes(parseInt(semester))) {
            req.flash('error', 'Invalid semester');
            return res.redirect(`/library/${department}`);
        }

        res.render('library/semester', {
            title: `${department} Semester ${semester} - MNIT Connect`,
            user: req.user,
            department,
            semester: parseInt(semester)
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/library');
    }
});

// Subject-specific page
router.get('/:department/:semester/:subject', (req, res) => {
    try {
        const { department, semester, subject } = req.params;
        const validDepartments = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Others'];
        const validSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
        
        if (!validDepartments.includes(department)) {
            req.flash('error', 'Invalid department');
            return res.redirect('/library');
        }

        if (!validSemesters.includes(parseInt(semester))) {
            req.flash('error', 'Invalid semester');
            return res.redirect(`/library/${department}`);
        }

        // Here you would typically fetch subject-specific content
        // For now, we'll just render the template
        res.render('library/subject', {
            title: `${subject} - ${department} Semester ${semester}`,
            user: req.user,
            department,
            semester: parseInt(semester),
            subject
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/library');
    }
});

module.exports = router; 
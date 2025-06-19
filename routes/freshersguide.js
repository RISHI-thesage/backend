const express = require('express');
const router = express.Router();

// Freshers Guide main page
router.get('/', (req, res) => {
    try {
        res.render('freshersguide/freshersguide', {
            title: 'Freshers Guide - MNIT Connect',
            user: req.user,
            sections: [
                {
                    title: 'Campus Life',
                    description: 'Everything you need to know about campus facilities, clubs, and activities',
                    icon: 'fa-building'
                },
                {
                    title: 'Academic Guide',
                    description: 'Information about courses, departments, and academic resources',
                    icon: 'fa-book'
                },
                {
                    title: 'Hostel Life',
                    description: 'Details about hostel facilities, rules, and living arrangements',
                    icon: 'fa-home'
                },
                {
                    title: 'Important Contacts',
                    description: 'Emergency numbers and important department contacts',
                    icon: 'fa-phone'
                }
            ]
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/');
    }
});

// Campus Life section
router.get('/campus-life', (req, res) => {
    try {
        res.render('freshersguide/campus-life', {
            title: 'Campus Life - Freshers Guide',
            user: req.user,
            facilities: [
                {
                    name: 'Sports Complex',
                    description: 'State-of-the-art sports facilities including swimming pool, gym, and various sports grounds',
                    image: '/images/sports-complex.jpg'
                },
                {
                    name: 'Central Library',
                    description: 'Well-equipped library with digital resources and study spaces',
                    image: '/images/library.jpg'
                },
                {
                    name: 'Student Activity Center',
                    description: 'Hub for cultural activities, clubs, and student organizations',
                    image: '/images/sac.jpg'
                }
            ]
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/freshersguide');
    }
});

// Academic Guide section
router.get('/academic-guide', (req, res) => {
    try {
        res.render('freshersguide/academic-guide', {
            title: 'Academic Guide - Freshers Guide',
            user: req.user,
            departments: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'Others'],
            resources: [
                {
                    name: 'Course Registration',
                    description: 'Step-by-step guide for course registration process',
                    link: '#'
                },
                {
                    name: 'Academic Calendar',
                    description: 'Important dates and deadlines for the academic year',
                    link: '#'
                },
                {
                    name: 'Study Resources',
                    description: 'Access to digital library, previous year papers, and study materials',
                    link: '#'
                }
            ]
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/freshersguide');
    }
});

// Hostel Life section
router.get('/hostel-life', (req, res) => {
    try {
        res.render('freshersguide/hostel-life', {
            title: 'Hostel Life - Freshers Guide',
            user: req.user,
            hostels: [
                {
                    name: 'Boys Hostel',
                    description: 'Information about boys hostel facilities and rules',
                    image: '/images/boys-hostel.jpg'
                },
                {
                    name: 'Girls Hostel',
                    description: 'Information about girls hostel facilities and rules',
                    image: '/images/girls-hostel.jpg'
                }
            ],
            rules: [
                'Check-in/Check-out timings',
                'Mess rules and timings',
                'Visitor policies',
                'Maintenance procedures'
            ]
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/freshersguide');
    }
});

// Important Contacts section
router.get('/contacts', (req, res) => {
    try {
        res.render('freshersguide/contacts', {
            title: 'Important Contacts - Freshers Guide',
            user: req.user,
            contacts: [
                {
                    category: 'Emergency',
                    numbers: [
                        { name: 'Campus Security', number: '0141-1234567' },
                        { name: 'Medical Emergency', number: '0141-1234568' }
                    ]
                },
                {
                    category: 'Administration',
                    numbers: [
                        { name: 'Registrar Office', number: '0141-1234569' },
                        { name: 'Dean Academics', number: '0141-1234570' }
                    ]
                },
                {
                    category: 'Hostel',
                    numbers: [
                        { name: 'Boys Hostel Warden', number: '0141-1234571' },
                        { name: 'Girls Hostel Warden', number: '0141-1234572' }
                    ]
                }
            ]
        });
    } catch (e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/freshersguide');
    }
});

module.exports = router; 
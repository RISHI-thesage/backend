const express = require('express');
const router = express.Router();
const ResellProductController = require('../controllers/ResellProductController');
const BookRentalProductController = require('../controllers/BookRentalProductController');
const isLoggedIn = require('../middleware/isLoggedIn');
const isOwner = require('../middleware/isOwner');
const validateProduct = require('../middleware/validateProduct');
const ProductController = require('../controllers/ProductController');
// Marketplace landing page
router.get('/', (req, res) => {
    res.render('marketplace/landing');
});

// Create resell product form
router.get('/resell/create', isLoggedIn, (req, res) => {
    res.render('marketplace/create', { type: 'resell', error: null });
});

// Resell routes
router.get('/resell', ResellProductController.index);
router.post('/resell', isLoggedIn, validateProduct, ResellProductController.create);
router.get('/resell/:id/edit', isLoggedIn, isOwner, ResellProductController.edit);
router.put('/resell/:id', isLoggedIn, isOwner, validateProduct, ResellProductController.update);
router.delete('/resell/:id', isLoggedIn, isOwner, ResellProductController.delete);

// Create book rental form
router.get('/book-rentals/create', isLoggedIn, (req, res) => {
    res.render('marketplace/create', { type: 'book', error: null });
});

// Book rental routes
router.get('/book-rentals', BookRentalProductController.index);
router.post('/book-rentals', isLoggedIn, validateProduct, BookRentalProductController.create);
router.get('/book-rentals/:id/edit', isLoggedIn, isOwner, BookRentalProductController.edit);
router.put('/book-rentals/:id', isLoggedIn, isOwner, validateProduct, BookRentalProductController.update);
router.delete('/book-rentals/:id', isLoggedIn, isOwner, BookRentalProductController.delete);

router.get('/our-products',ProductController.index);


module.exports = router; 
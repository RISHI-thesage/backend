const BookRentalProduct = require('../models/BookRentalProduct');

module.exports.index = async (req, res, next) => {
    try {
        const products = await BookRentalProduct.find({});
        res.render('marketplace/book-rentals', { products, user: req.user || null });
    } catch (err) {
        res.status(500).send('Error loading book rentals');
    }
};

module.exports.show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await BookRentalProduct.findById(id).populate('owner', 'username email');
        if (!product) {
            req.flash('error', 'Book not found');
            return res.redirect('/marketplace/book-rentals');
        }
        res.render('marketplace/show', { product });
    } catch (e) { next(e); }
};

module.exports.renderNewForm = (req, res) => {
    res.render('marketplace/create', { type: 'book' });
};

module.exports.create = async (req, res) => {
    try {
        const { name, author, description, price, rentalPeriod, imageUrl, phone } = req.body.product;
        if (!name || !price || !rentalPeriod || !imageUrl || !phone) {
            return res.status(400).render('marketplace/create', { type: 'book', error: 'All fields are required.' });
        }
        const product = new BookRentalProduct({
            name,
            author,
            description,
            price,
            rentalPeriod,
            imageUrl,
            phone,
            owner: req.user._id
        });
        await product.save();
        res.redirect('/marketplace/book-rentals');
    } catch (err) {
        res.status(500).render('marketplace/create', { type: 'book', error: 'Failed to create book rental.' });
    }
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await BookRentalProduct.findById(id);
        if (!product) {
            req.flash('error', 'Book not found');
            return res.redirect('/marketplace/book-rentals');
        }
        res.render('marketplace/edit', { product, type: 'book' });
    } catch (e) { next(e); }
};

module.exports.edit = async (req, res) => {
    try {
        const product = await BookRentalProduct.findById(req.params.id);
        if (!product) return res.status(404).send('Book not found');
        if (!req.user || product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }
        res.render('marketplace/edit', { product, type: 'book', user: req.user, error: null });
    } catch (err) {
        res.status(500).send('Error loading book for edit');
    }
};

module.exports.update = async (req, res) => {
    try {
        const product = await BookRentalProduct.findById(req.params.id);
        if (!product) return res.status(404).send('Book not found');
        if (!req.user || product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }
        const { name, author, description, price, rentalPeriod, imageUrl, phone } = req.body.product;
        if (!name || !price || !rentalPeriod || !imageUrl || !phone) {
            return res.status(400).render('marketplace/edit', { product, type: 'book', user: req.user, error: 'All fields are required.' });
        }
        product.name = name;
        product.author = author;
        product.description = description;
        product.price = price;
        product.rentalPeriod = rentalPeriod;
        product.imageUrl = imageUrl;
        product.phone = phone;
        await product.save();
        res.redirect('/marketplace/book-rentals');
    } catch (err) {
        res.status(500).send('Error updating book rental');
    }
};

module.exports.delete = async (req, res) => {
    try {
        const product = await BookRentalProduct.findById(req.params.id);
        if (!product) return res.status(404).send('Book not found');
        if (!req.user || product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }
        await product.deleteOne();
        res.redirect('/marketplace/book-rentals');
    } catch (err) {
        res.status(500).send('Error deleting book rental');
    }
}; 
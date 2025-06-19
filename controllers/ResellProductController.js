const ResellProduct = require('../models/ResellProduct');

module.exports.index = async (req, res, next) => {
    try {
        const products = await ResellProduct.find({});
        res.render('marketplace/resell', { products, user: req.user || null });
    } catch (err) {
        res.status(500).send('Error loading resell products');
    }
};

module.exports.show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ResellProduct.findById(id).populate('owner', 'username email');
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/marketplace/resell');
        }
        res.render('marketplace/show', { product });
    } catch (e) { next(e); }
};

module.exports.renderNewForm = (req, res) => {
    res.render('marketplace/create', { type: 'resell' });
};

module.exports.create = async (req, res) => {
    try {
        const { name, description, category, price, condition, imageUrl, phone } = req.body.product;
        if (!name || !category || !price || !condition || !imageUrl || !phone) {
            return res.status(400).render('marketplace/create', { type: 'resell', error: 'All fields are required.' });
        }
        const product = new ResellProduct({
            name,
            description,
            category,
            price,
            condition,
            imageUrl,
            phone,
            owner: req.user._id
        });
        await product.save();
        res.redirect('/marketplace/resell');
    } catch (err) {
        res.status(500).render('marketplace/create', { type: 'resell', error: 'Failed to create product.' });
    }
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ResellProduct.findById(id);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/marketplace/resell');
        }
        res.render('marketplace/edit', { product, type: 'resell' });
    } catch (e) { next(e); }
};

module.exports.edit = async (req, res) => {
    try {
        const product = await ResellProduct.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        if (!req.user || product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }
        res.render('marketplace/edit', { product, type: 'resell', user: req.user, error: null });
    } catch (err) {
        res.status(500).send('Error loading product for edit');
    }
};

module.exports.update = async (req, res) => {
    try {
        const product = await ResellProduct.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        if (!req.user || product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }
        const { name, description, category, price, condition, imageUrl, phone } = req.body.product;
        if (!name || !category || !price || !condition || !imageUrl || !phone) {
            return res.status(400).render('marketplace/edit', { product, type: 'resell', user: req.user, error: 'All fields are required.' });
        }
        product.name = name;
        product.description = description;
        product.category = category;
        product.price = price;
        product.condition = condition;
        product.imageUrl = imageUrl;
        product.phone = phone;
        await product.save();
        res.redirect('/marketplace/resell');
    } catch (err) {
        res.status(500).send('Error updating product');
    }
};

module.exports.delete = async (req, res) => {
    try {
        const product = await ResellProduct.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        if (!req.user || product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }
        await product.deleteOne();
        res.redirect('/marketplace/resell');
    } catch (err) {
        res.status(500).send('Error deleting product');
    }
}; 
const ResellProduct = require('../models/ResellProduct');
const BookRentalProduct = require('../models/BookRentalProduct');

module.exports = async function isOwner(req, res, next) {
    try {
        let product;
        if (req.baseUrl.includes('resell')) {
            product = await ResellProduct.findById(req.params.id);
        } else if (req.baseUrl.includes('book-rentals')) {
            product = await BookRentalProduct.findById(req.params.id);
        }
        if (!product) return res.status(404).send('Product not found');
        if (!req.user || product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }
        req.product = product;
        next();
    } catch (err) {
        res.status(500).send('Error checking ownership');
    }
}; 
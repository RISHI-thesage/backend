const { body, validationResult } = require('express-validator');

const validateProduct = [
    body('product.name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 100 })
        .withMessage('Product name cannot be more than 100 characters'),
    
    body('product.description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot be more than 1000 characters'),
    
    body('product.category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['Books', 'Electronics', 'Stationery', 'Sports', 'Others'])
        .withMessage('Invalid category'),
    
    body('product.price')
        .notEmpty()
        .withMessage('Price is required')
        .isFloat({ min: 0, max: 1000000 })
        .withMessage('Price must be between 0 and 10,00,000'),
    
    body('product.rentalPeriod')
        .optional()
        .isIn(['Daily', 'Weekly', 'Monthly', 'Semester', 'Yearly'])
        .withMessage('Invalid rental period'),
    
    body('product.condition')
        .optional()
        .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
        .withMessage('Invalid condition'),
    
    body('product.phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),
    
    body('product.imageUrl')
        .trim()
        .notEmpty()
        .withMessage('Image URL is required')
        .isURL()
        .withMessage('Invalid image URL'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(err => err.msg).join(', '));
            return res.redirect('back');
        }
        next();
    }
];

module.exports = (req, res, next) => {
    const data = req.body.product;
    if (req.baseUrl.includes('resell')) {
        if (!data || !data.name || !data.category || !data.price || !data.condition || !data.imageUrl || !data.phone) {
            return res.status(400).send('All fields are required for resell product.');
        }
    } else if (req.baseUrl.includes('book-rentals')) {
        if (!data || !data.name || !data.price || !data.rentalPeriod || !data.imageUrl || !data.phone) {
            return res.status(400).send('All fields are required for book rental.');
        }
    }
    next();
}; 
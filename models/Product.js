// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const productSchema = new Schema({
//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//         index: true 
//     },
//     name: {
//         type: String,
//         required: [true, 'Product name is required'],
//         trim: true,
//         maxlength: [100, 'Product name cannot be more than 100 characters']
//     },
//     description: {
//         type: String,
//         trim: true,
//         maxlength: [1000, 'Description cannot be more than 1000 characters']
//     },
//     category: {
//         type: String,
//         enum: {
//             values: ['Books', 'Electronics', 'Stationery', 'Sports', 'Others'],
//             message: '{VALUE} is not a valid category'
//         },
//         required: [true, 'Category is required'],
//         index: true
//     },
//     price: {
//         type: Number,
//         required: [true, 'Price is required'],
//         min: [0, 'Price cannot be negative'],
//         max: [1000000, 'Price cannot exceed 10,00,000']
//     },
//     rentalPeriod: {
//         type: String,
//         enum: ['Daily', 'Weekly', 'Monthly', 'Semester', 'Yearly'],
//         default: null
//     },
//     condition: {
//         type: String,
//         enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
//         default: 'Good'
//     },
//     phone: {
//         type: String,
//         required: [true, 'Contact number is required'],
//         validate: {
//             validator: function(v) {
//                 return /^[0-9]{10}$/.test(v);
//             },
//             message: props => `${props.value} is not a valid phone number!`
//         }
//     },
//     imageUrl: {
//         type: String,
//         required: [true, 'Product image is required'],
//         validate: {
//             validator: function(v) {
//                 return /^https?:\/\/.+/.test(v);
//             },
//             message: props => `${props.value} is not a valid URL!`
//         }
//     },
//     status: {
//         type: String,
//         enum: ['Available', 'Sold', 'Rented'],
//         default: 'Available',
//         index: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         index: true
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true
// });

// // Index for search functionality
// productSchema.index({ name: 'text', description: 'text' });

// // Pre-save middleware to update updatedAt
// productSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });

// module.exports = mongoose.model('Product', productSchema); 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookRentalProductSchema = new Schema({
    name: { type: String, required: true },
    author: String,
    description: String,
    price: { type: Number, required: true },
    rentalPeriod: { type: String, required: true },
    imageUrl: { type: String, required: true },
    phone: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('BookRentalProduct', BookRentalProductSchema); 
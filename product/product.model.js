const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate = require('mongoose-paginate-v2');
const { productCategoriesArr } = require('../enums/enum');

const productSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        enum: productCategoriesArr
    },
    images: {
        type: Array
    },
    uploaderId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });

productSchema.plugin(paginate);







const Product = mongoose.model('Product', productSchema);
module.exports = Product;

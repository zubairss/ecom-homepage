const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate = require('mongoose-paginate-v2');
const { bannerTypesArr } = require('../enums/enum');

const bannerSchema = new Schema({

    type: {
        type: String,
        enum: bannerTypesArr,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

bannerSchema.plugin(paginate);



const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;

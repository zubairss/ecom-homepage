const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const { func } = require('joi');
const paginate = require('mongoose-paginate-v2');
const { rolesArr, bannerTypesArr, productCategoriesArr, userType, genders } = require('../enums/enum');

const userSchema = new Schema({
    name: {
        type: String,
        required: "Name is required"
    },
    email: {
        type: String,
        required: "Email Address is required",
        validate: [isEmail, 'Enter a valid email'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: rolesArr,
        default: rolesArr[1]
    },
    type: {
        type: String,
        enum: userType,
        default: userType[0]
    },
    gender: {
        type: String,
        enum: genders
    },

}, { timestamps: true });


userSchema.plugin(paginate);


userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Mongoose - Pre-Save Middleware - Password Hashed")
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {

    const userToUpdate = await this.model.findOne(this.getQuery())
    const salt = await bcrypt.genSalt(8);
    if (this._update.password != undefined) {
        this._update.password = await bcrypt.hash(this._update.password, salt)
    }

    // if (userToUpdate.password !== this._update.password) {
    //     this._update.password = await bcrypt.hash(this._update.password, salt)
    // }
    console.log("Mongoose - Update Middleware - Password Hashed")
    next();
})







const User = mongoose.model('User', userSchema);
module.exports = User;

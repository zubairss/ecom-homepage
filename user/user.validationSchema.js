const Joi = require('joi');
const objectID = require('mongoose').Types.ObjectId;
const { rolesArr, bannerTypesArr, productCategoriesArr, userType } = require('../enums/enum');

const userValidationSchema = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required(),
        name: Joi.string().min(3).max(15).required(),
        type: Joi.valid(...userType),
        gender: Joi.valid('male', 'female'),
        role: Joi.valid(...rolesArr)
    }).min(1)
}

const userUpdateValidationSchema = {
    body: Joi.object().keys({
        email: Joi.string().email(),
        password: Joi.string().min(5).max(30),
        name: Joi.string().min(3).max(15),
        type: Joi.valid(...userType),
        gender: Joi.valid('male', 'female'),
        role: Joi.valid(...rolesArr)
    }).min(1)
}

const userLoginValidationScheme = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(30).required()
    }).min(1)
}

const userIdValidationSchema = {
    query: Joi.object().keys({
        id: Joi.custom((value, helper) => {
            if (objectID.isValid(value)) {
                return value;
            } else {
                // helper.error().message = "Ds";
                return helper.error();
            }
        }).message("Invalid Mongoose User ID")
    }).min(1)
}

const userIdParamsValidationSchema = {
    params: Joi.object().keys({
        userId: Joi.custom((value, helper) => {
            if (objectID.isValid(value)) {
                return value;
            } else {
                // helper.error().message = "Ds";
                return helper.error();
            }
        }).message("Invalid Mongoose User ID")
    }).min(1)
}

module.exports = { userValidationSchema, userIdValidationSchema, userLoginValidationScheme, userIdParamsValidationSchema, userUpdateValidationSchema };
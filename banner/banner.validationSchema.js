const Joi = require('joi');
const objectID = require('mongoose').Types.ObjectId;
const { rolesArr, bannerTypesArr, productCategoriesArr, userType } = require('../enums/enum');


const bannerValidationSchema = {
    body: Joi.object().keys({
        type: Joi.string().valid(...bannerTypesArr).required(),
        isActive: Joi.bool().default(true),
    }).min(1)
}

const bannerUpdateValidationSchema = {
    body: Joi.object().keys({
        type: Joi.string().valid(...bannerTypesArr),
        isActive: Joi.bool(),
    })
}


const mongooseQueryIdValidationSchema = {
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

const mongooseParamsIdValidationSchema = {
    params: Joi.object().keys({
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


module.exports = { bannerValidationSchema, mongooseQueryIdValidationSchema, bannerUpdateValidationSchema, mongooseParamsIdValidationSchema };
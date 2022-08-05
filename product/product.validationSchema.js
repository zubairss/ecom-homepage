const Joi = require('joi');
const objectID = require('mongoose').Types.ObjectId;
const { rolesArr, bannerTypesArr, productCategoriesArr, userType } = require('../enums/enum');

const productValidationSchema = {
    body: Joi.object().keys({

        title: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().required(),
        isActive: Joi.bool().default(true),
        category: Joi.valid(...productCategoriesArr).required(),
        uploaderId: Joi.string().custom((value, helper) => {
            if (objectID.isValid(value)) {
                return value;
            } else {
                // helper.error().message = "Ds";
                return helper.error();
            }
        }).message("Invalid Mongoose User ID").required(),
        description: Joi.string().required(),


    }).min(1)
}

const productUpdateValidationSchema = {

    // isActive
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




module.exports = { productValidationSchema, productUpdateValidationSchema, mongooseQueryIdValidationSchema, mongooseParamsIdValidationSchema };
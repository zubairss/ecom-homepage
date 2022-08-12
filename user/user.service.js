const User = require("../user/user.model");
const Product = require("../product/product.model");
const Banner = require("../banner/banner.model");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const pick = require('../utils/pick');
const envVars = require('../config/config');
const redis = require('redis');
const redisClient = redis.createClient({
    legacyMode: true
});


const createUser = async (userDetails, role = 'user') => {

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!(emailPattern.test(userDetails.email))) {
        return {
            "Error": "Validation Error",
            "Message": "\"email\" must be a valid email",
        }
    }

    var noSpacePattern = /^(?=.*\S).+$/
    if (!(noSpacePattern.test(userDetails.password))) {
        return {
            "Error": "Validation Error",
            "Message": "password cannot be only spaces",
        }
    }

    if (!(noSpacePattern.test(userDetails.name))) {
        return {
            "Error": "Validation Error",
            "Message": "name cannot be only spaces",
        }
    }


    const user = new User({ ...userDetails, role: role });
    try {
        await user.save();
        console.log(user);
        const accessToken = jwt.sign({ ...user, role: user.role }, envVars.jwt_scret);
        user.password = undefined;
        return {
            message: `${user.role} Created Successfully`,
            user: user,
            accessToken: accessToken
        }
    } catch (err) {
        console.log(err)
        return {
            "Message": `${user.role} Not Created`,
            "Details": err
        }
    }
};

const updateUser = async (userId, userDetails) => {

    if (userDetails.email != undefined) {
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        if (!(emailPattern.test(userDetails.email))) {
            return {
                "Error": "Validation Error",
                "Message": "\"email\" must be a valid email",
            }
        }

    }

    return await User.findByIdAndUpdate(userId, userDetails, { new: true }).then((res) => {
        if (res) return res;
        return "User Doesn't Exists";
    }).catch(err => err);

};

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId).then((res) => {
        if (res) return "User Deleted";
        return "User Doesn't Exists";
    })

}

const getUsers = async (paginateOptions, filterOptions) => {

    return await User.paginate(filterOptions, { ...paginateOptions, lean: true }).then((res) => {

        res.docs.map((item) => {
            delete item.password
            delete item.__v;
            delete item.createdAt;
            delete item.updatedAt;
        });

        return res;
    }).catch(err => err);
}

const getOneUser = async (userId) => await User.findOne({ _id: userId }).lean().then((res) => {

    if (res) {
        delete res.password;
        delete res.__v;
        delete res.createdAt;
        delete res.updatedAt;

        return res;

    }

    return "User Not Found";

}).catch(err => err);


module.exports = { createUser, updateUser, deleteUser, getUsers, getOneUser };



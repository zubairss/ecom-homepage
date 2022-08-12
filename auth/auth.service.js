const User = require("../user/user.model");
const Product = require("../product/product.model");
const Banner = require("../banner/banner.model");
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pick = require('../utils/pick');
const envVars = require('../config/config');
const { isEmail } = require('validator');

const Login = async (userCredentials, role) => {

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!(emailPattern.test(userCredentials.email))) {
        return {
            "Error": "Validation Error",
            "Message": "\"email\" must be a valid email",
        }
    }

    var noSpacePattern = /^(?=.*\S).+$/
    if (!(noSpacePattern.test(userCredentials.password))) {
        return {
            "Error": "Validation Error",
            "Message": "password cannot be only spaces",
        }
    }



    return await User.findOne({ $and: [{ email: userCredentials.email }, { role: role }] }).lean().then(async (res) => {
        if (res) {
            if (await bcrypt.compare(userCredentials.password, res.password)) {
                const accessToken = jwt.sign(res, envVars.jwt_scret);
                return {
                    user: res,
                    message: "Login Succesful",
                    authToken: accessToken
                }
            }
            return "Invalid Password";
        } else {
            return `${role} Not Found / Email Not Found`;
        }
    })
}




module.exports = { Login };
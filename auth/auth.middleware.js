const { func } = require('joi');
var jwt = require('jsonwebtoken');
const User = require("../user/user.model")
const { authRoles } = require('../enums/enum');
const envVars = require('../config/config');

const authenticate = (role) => async (req, res, next) => {
    console.log("Auth MD")

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, envVars.jwt_scret, (err, user) => {
        if (err) return res.sendStatus(403);

        if (user.role == 'admin') return next();

        if (authRoles.get(user.role).includes(role)) {

            if (req.query.id != undefined && req.params.userId == undefined) {
                console.log("Query Sent But No Params")
                if (user._id == req.query.id) {
                    next();
                } else {
                    return res.json({ Message: "Only Authorized for Self User Operations" })
                }
            }

            if (req.params.userId != undefined && req.query.id == undefined) {
                console.log("Params Sent But No Query")
                if (user._id == req.params.userId) {
                    next();
                } else {
                    return res.json({ Message: "Only Authorized for Self User Operations" })
                }
            }

            // return res.send("Access Guranteed");
            // next();
        } else {
            return res.json({ Message: `you don't have the Role/Permission for this route` })
        }
    });


    // const userRole = jwt.decode(token).role;





    // if (!(authRoles.get(userRole).includes(role))) {
    //     return res.send(`${userRole} don't have the Role/Permission for this route`)
    // }



}

const userExists = async (req, res, next) => {
    // res.send(req.params.id);
    const result = await User.find({ _id: req.params.id });
    if (result.length == 0) {
        res.send("User Not Found / Invalid Credentials");
    } else {
        console.log("User Exists MD");
        next();
    }
}


module.exports = { userExists, authenticate };







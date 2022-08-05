const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const userService = require('./user.service')//services

const createUser = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.params) != "{}") {
        res.json({ Messag: "This Route Accepts Request Only in Body - As JSON Format" });
        return;
    }

    const result = await userService.createUser(reqObject.body);
    res.json({ result: result });


});

const updateUser = catchAsync(async (req, res) => {

    const result = await userService.updateUser(req.query.id, req.body);
    res.json({ result: result });
});

const deleteUser = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Doesn't Accepts Body - It Only Accepts User ID in Query as id" });
        return;
    }
    const result = await userService.deleteUser(req.query.id);
    res.json({ result: result });
});

const getUsers = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    const paginateOptions = pick(req.query, ["page", "limit"]);
    const filterOptions = pick(req.query, ["age", "gender", "email", "name", "role", "type"])

    if (JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Doesn't Accepts Body - It Only Accepts Filters + Page&Limit in Query" });
        return;
    }

    const result = await userService.getUsers(paginateOptions, filterOptions)
    res.json({ result: result });
});

const getOneUser = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Only Accepts User ID in Params" });
        return;
    }

    const result = await userService.getOneUser(req.params.userId);
    res.json({ result: result });
})




module.exports = { createUser, updateUser, deleteUser, getUsers, getOneUser };



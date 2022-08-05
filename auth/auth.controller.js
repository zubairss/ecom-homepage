const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const authService = require('./auth.service')
const { createUser } = require('../user/user.service');

const userLogin = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.params) != "{}") {
        res.json({ Message: "This Route Accepts Request Only in Body - As JSON Format" });
        return;
    }

    const result = await authService.Login(reqObject.body, 'user');
    res.json({ result: result });
});

const adminLogin = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);

    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.params) != "{}") {
        res.json({ Message: "This Route Accepts Request Only in Body - As JSON Format" });
        return;
    }
    const result = await authService.Login(reqObject.body, 'admin');
    res.json({ result: result });
})


const userRegister = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.params) != "{}") {
        res.json({ Message: "This Route Accepts Request Only in Body - As JSON Format" });
        return;
    }

    const result = await createUser(req.body);
    res.json({ result: result });
});

const adminRegister = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.params) != "{}") {
        res.json({ Message: "This Route Accepts Request Only in Body - As JSON Format" });
        return;
    }

    const result = await createUser(req.body, 'admin');
    res.json({ result: result });
});



module.exports = { userLogin, adminLogin, userRegister, adminRegister };



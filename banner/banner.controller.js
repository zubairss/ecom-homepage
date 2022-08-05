const { bannerTypesArr } = require('../enums/enum');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const bannerService = require('./banner.service')//services
const Banner = require("../banner/banner.model");

const setBanner = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body", "files"]);

    const result = await bannerService.setBanner(reqObject.body, reqObject.files);
    res.json({ result: result });
});

const deleteBanner = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Doesn't Accepts Body - It Only Accepts User ID in Query as id" });
        return;
    }

    const result = await bannerService.deleteBanner(reqObject.query.id);

    res.json({ result: result });
});

const updateBanner = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body", "files"]);
    if (JSON.stringify(reqObject.query) == "{}") {
        res.json({ Message: "This Accepts Banner ID in Query & Image+Update Details as Form Data" });
        return;
    }

    const result = await bannerService.updateBanner(reqObject.query.id, reqObject.body, reqObject.files);

    res.json({ result: result });
});


const getBanners = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    const paginateOptions = pick(req.query, ["page", "limit"]);
    const filterOptions = pick(req.query, ["type", "isActive"])

    if (JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Doesn't Accepts Body - It Only Accepts Filters + Page&Limit in Query" });
        return;
    }

    const result = await bannerService.getBanners(paginateOptions, filterOptions);

    res.json({ result: result });
});

const getOneBanner = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Only Accepts User ID in Params" });
        return;
    }

    const result = await bannerService.getOneBanner(reqObject.params.id);
    res.json({ result: result });
});


const bannerExist = catchAsync(async (req, res, next) => {
    return await Banner.findById(req.query.id).then((result) => {

        if (result) {
            next();
            return;
        }

        return res.json({ "Result": "Banner Doesn't Exists" });

    })
});



module.exports = { setBanner, deleteBanner, updateBanner, getBanners, getOneBanner, bannerExist };



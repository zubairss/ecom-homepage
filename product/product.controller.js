const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const productService = require('./product.service')//services
const Product = require("../product/product.model");

const addProduct = catchAsync(async (req, res) => {

    const reqObject = pick(req, ["params", "query", "body", "files"]);

    const result = await productService.createProduct(reqObject.body, reqObject.files);
    res.json({ result: result });
});

const updateProduct = catchAsync(async (req, res) => {




    const result = await productService.updateProduct();
    res.json({ result: result });
});

const deleteProduct = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Doesn't Accepts Body - It Only Accepts User ID in Query as id" });
        return;
    }

    const result = await productService.deleteProduct(reqObject.query.id);
    res.json({ result: result });
});

const getProducts = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    const paginateOptions = pick(req.query, ["page", "limit"]);
    const filterOptions = pick(req.query, ["title", "price", "email", "isActive", "category"])

    if (JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Doesn't Accepts Body - It Only Accepts Filters + Page&Limit in Query" });
        return;
    }


    const result = await productService.getProducts(paginateOptions, filterOptions);
    res.json({ result: result });
});

const getOneProduct = catchAsync(async (req, res) => {
    const reqObject = pick(req, ["params", "query", "body"]);
    if (JSON.stringify(reqObject.query) != "{}" || JSON.stringify(reqObject.body) != "{}") {
        res.json({ Message: "This Route Only Accepts User ID in Params" });
        return;
    }

    const result = await productService.getOneProduct(req.params.id);
    res.json({ result: result });
});


const productExist = catchAsync(async (req, res, next) => {
    return await Product.findById(req.query.id).then((result) => {

        if (result) {
            next();
            return;
        }

        return res.json({ "Result": "Banner Doesn't Exists" });

    })
});




module.exports = { addProduct, updateProduct, deleteProduct, getProducts, getOneProduct, productExist };



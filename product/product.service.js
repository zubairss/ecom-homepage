
const User = require("../user/user.model");
const Product = require("../product/product.model");
const Banner = require("../banner/banner.model");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const pick = require('../utils/pick');
const envVars = require('../config/config');
const { S3Client, DeleteObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { S3 } = require('aws-sdk');

var s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: envVars.aws_access_key,
        secretAccessKey: envVars.aws_secret_key,
    },

});

const createProduct = async (productDetails, images) => {

    var noSpacePattern = /^(?=.*\S).+$/
    if (!(noSpacePattern.test(productDetails.title))) {
        return {
            "Error": "Validation Error",
            "Message": "title cannot be only spaces",
        }
    }

    if (images.length == 0) {
        return { message: "No File Uploaded - Please Send Product Image(s) as well" };
    }



    imagesData = images.map((data) => {
        return {
            location: data.location,
            size: data.size,
            key: data.key
        }
    })
    productDetails.images = imagesData;

    const product = new Product(productDetails);

    try {
        await product.save();

        return {
            message: `Product & Images Uploaded Successfully`,
            product: product
        }

    } catch (err) {

        imagesKeys = images.map(image => { return { Key: image.key } });

        const awsMessage = await s3.send(new DeleteObjectsCommand({
            Bucket: 'ecommerce-homepage-product',
            Delete: {
                Objects: imagesKeys
            }
        })).then((res) => { return { result: res, message: "Images Deleted from S3" } }).catch((err) => err);

        return {
            "Message": `Product & Images Not Uploaded`,
            "S3 Delete Messsage": awsMessage,
            "Details": err
        }

    }

}

const updateProduct = async (productId, productDetails) => {

    return "Update Product"
}

const deleteProduct = async (productId) => {


    return await Product.findByIdAndDelete(productId).then(async (res) => {

        if (res) {
            console.log("Product Deleted from DB");

            const imagesKeys = res.images.map((img) => { return { Key: img.key } });

            const awsResponse = await s3.send(new DeleteObjectsCommand({
                Bucket: 'ecommerce-homepage-product',
                Delete: {
                    Objects: imagesKeys
                }
            })).then((res) => {
                console.log(res);
                console.log("Product Images Deleted from S3");
                return "Product Successfully Deleted"

            }).catch(async (err) => {
                const product = new Product(res);
                await product.save();
                console.log("Product Saved Back in DB");
                return err
            });

            return awsResponse;
        }
        return "Product Doesn't Exists"


    }).catch(err => err);


}

const getOneProduct = async (productId) => await Product.findById(productId).lean().then(res => res).catch(err => err);

const getProducts = async (paginateOptions, filterOptions) => {

    return await Product.paginate(filterOptions, { ...paginateOptions, lean: true }).then((res) => res).catch(err => err);

}

module.exports = { createProduct, updateProduct, deleteProduct, getOneProduct, getProducts }
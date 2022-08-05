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



const setBanner = async (bannerDetails, image) => {

    if (image.length == 0) {
        return "No File Sent - Please Send Banner Image";
    }

    bannerDetails.image = {
        location: image[0].location,
        size: image[0].size,
        key: image[0].key
    }

    const banner = new Banner(bannerDetails);

    try {
        await banner.save();

        return {
            message: 'Banner Uploaded Successfully',
            banner: banner
        }

    } catch (err) {

        const awsMessage = await s3.send(new DeleteObjectCommand({
            Bucket: 'ecommerce-homepage-banner',
            Key: image[0].key
        })).then((res) => { return { result: res, message: "Banner Image Deleted from S3" } }).catch((err) => err);

        return {
            "Message": `Product & Images Not Uploaded`,
            "S3 Delete Messsage": awsMessage,
            "Details": err
        }

    }

};

const deleteBanner = async (bannerId) => {

    return await Banner.findByIdAndDelete(bannerId).then(async (res) => {

        // console.log(res);

        if (res) {
            console.log("Banner Deleted from DB");

            const awsResponse = await s3.send(new DeleteObjectCommand({
                Bucket: 'ecommerce-homepage-banner',
                Key: res.image[0].key
            })).then((res) => {

                console.log("Banner Image Deleted from S3");
                return "Banner Successfully Deleted"
            }).catch(async (err) => {
                const banner = new Banner(res);
                await banner.save();
                console.log("AWS ERROR - Banner Saved Back in DB");
                return { message: "Product Didn't Got Deleted - AWS Issue", error: err };
            })

            return awsResponse;

        }

        return "Banner Not Deleted / Doesn't Exists";

    }).catch(err => err);

};

const updateBanner = async (bannerId, bannerUpdateDetais, bannerImage) => {

    // console.log(bannerId);
    // console.log(bannerUpdateDetais.type);
    // console.log(bannerImage == undefined);
    const updatedBanner = bannerUpdateDetais;


    if (bannerImage.length == 0) {
        console.log(updatedBanner);
    } else {
        updatedBanner.image = [];
        updatedBanner.image.push({ "location": bannerImage[0].location, "size": bannerImage[0].size, "key": bannerImage[0].key })
    }

    return await Banner.findByIdAndUpdate(bannerId, updatedBanner).lean().then(async (res) => {

        if (bannerImage.length == 0) {
            if (updatedBanner.isActive != undefined) res.isActive = updatedBanner.isActive;
            if (updatedBanner.type != undefined) res.type = updatedBanner.type;
            return {
                "message": "Banner Properties Updated",
                "result": res
            }
        }

        await s3.send(new DeleteObjectCommand({
            Bucket: 'ecommerce-homepage-banner',
            Key: res.image[0].key
        })).then((res) => {
            console.log("Banner Image Delete from S3");
        }).catch(err => err);


        if (updatedBanner.isActive != undefined) res.isActive = updatedBanner.isActive;
        if (updatedBanner.type != undefined) res.type = updatedBanner.type;
        if (updatedBanner.image.length != 0) res.image = updatedBanner.image;

        return {
            "message": "Banner (Properties &) Image Updated",
            "result": res
        }


    })


};



const getBanners = async (paginateOptions, filterOptions) => {

    return await Banner.paginate(filterOptions, { ...paginateOptions, lean: true }).then((res) => res).catch(err => err);

};

const getOneBanner = async (bannerId) => await Banner.findById(bannerId).lean().then(res => res).catch(err => err);





module.exports = { setBanner, deleteBanner, updateBanner, getBanners, getOneBanner };


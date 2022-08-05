const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3')
const envVars = require('../config/config');
const catchAsync = require('./catchAsync');
const ApiError = require("./ApiError");

const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: envVars.aws_access_key,
        secretAccessKey: envVars.aws_secret_key,
    }
});


const uploadProductImages = (req, res, next) => {
    const imageUpload = multer({
        limits: { files: 6 },
        storage: multerS3({
            s3: s3,
            bucket: 'ecommerce-homepage-product',
            acl: 'public-read',
            metadata: function (req, file, cb) {

                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {

                const fileExtension = "." + file.mimetype.split("/")[1];
                cb(null, "product-" + (Date.now().toString().concat(fileExtension)));
            },
            contentType: async (req, file, cb) => {
                const fileTypes = []
                await fileTypes.push(file.mimetype);

                var isCorrectMimeType = true;
                fileTypes.forEach((t) => {
                    if (t != 'image/png' && t != 'image/jpeg' && t != 'image/jpg') {
                        isCorrectMimeType = false;
                    }
                })
                if (!isCorrectMimeType) {
                    // throw Error("Invalid Mimetype");
                    let error = new ApiError(612, "Invalid Mimetype");
                    cb(error);
                }

                cb(null);
            }

        })
    }).array('productimages', 6);

    imageUpload(req, res, (error) => {
        console.log("ERROR MD")

        if (error instanceof multer.MulterError) {
            return res.status(400).json({
                message: 'Image Upload unsuccessful',
                errorMessage: error.message,
                errorCode: error.code
            })
        }

        if (error) {
            return res.status(500).json({
                message: 'Error occured',
                errorMessage: error.message
            })
        }
        console.log('Image Upload to S3 Successful.')
        next()
    })

}



const uploadBannerImage = (req, res, next) => {
    const imageUpload = multer({
        limits: { files: 1 },
        storage: multerS3({
            s3: s3,
            bucket: 'ecommerce-homepage-banner',
            acl: 'public-read',
            metadata: function (req, file, cb) {

                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {

                const fileExtension = "." + file.mimetype.split("/")[1];
                cb(null, "product-" + (Date.now().toString().concat(fileExtension)));
            },
            contentType: async (req, file, cb) => {

                if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/jpg') {
                    let error = new ApiError(612, "Invalid Mimetype");
                    cb(error);
                }
                cb(null);
            }

        })
    }).array('bannerimage', 1);

    imageUpload(req, res, (error) => {
        console.log("ERROR MD")

        if (error instanceof multer.MulterError) {
            return res.status(400).json({
                message: 'Image Upload unsuccessful',
                errorMessage: error.message,
                errorCode: error.code
            })
        }

        if (error) {
            return res.status(500).json({
                message: 'Error occured',
                errorMessage: error.message
            })
        }
        console.log('Image Upload to S3 Successful.')
        next()
    })

}












module.exports = { uploadBannerImage, uploadProductImages };
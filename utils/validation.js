const Joi = require('joi');
const pick = require("./pick");
const httpStatus = require('http-status');

const { S3Client, DeleteObjectCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { S3 } = require('aws-sdk');
var s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },

});

const validate = (schema) => (req, res, next) => {
    // console.log(schema.body, schema.params, schema.query)
    const validSchema = pick(schema, ["params", "query", "body"]); const object = pick(req, Object.keys(validSchema));
    // console.log(schema.body);
    // console.log("BODY FROM VALIDATION MIDDLEWARE:" + req.body)
    console.log("Validation MD Ran");
    const { value, error } = Joi.compile(validSchema).prefs({ errors: { label: "key" } }).validate(object);
    // console.log("JOII ERRORR: " + error);
    if (error) {
        const errorMessage = error.details
            // console.log(errorMessage)
            .map((details) => {
                if (details && details.message && details.message.includes('ref:')) {
                    details.message = details.message.replace('"', "").replace("ref:", '')
                    return details.message
                } else {
                    //details.message?details.message.replace(/\\$/,''):''
                    if (details.message.includes == '"') {
                        return details.message.replaceAll('"', "")
                    } else {
                        return details.message
                    }

                }
            })
            .join(", ");

        // return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        // res.send("Validation Error");

        if (req.files != undefined) {
            imagesKeys = req.files.map(image => { return { Key: image.key } });
            try {
                (async () => {
                    await s3.send(new DeleteObjectsCommand({
                        Bucket: 'ecommerce-homepage-product',
                        Delete: {
                            Objects: imagesKeys
                        }
                    })).then((res) => { console.log({ result: res, message: "Images Deleted from S3" }) }).catch((err) => console.log(err));
                })()
            } catch (err) { console.log(err) };
        }


        res.json({
            result: {
                Error: "Validation Error",
                Message: error.details[0].message
            }
        })

        return
        // return next("Error")
    }
    Object.assign(req, value); return next();
};

module.exports = validate;



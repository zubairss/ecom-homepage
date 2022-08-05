const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });



const envVarsSchema = Joi.object().keys({
    PORT: Joi.number().default(3100),
    MONGODB_CONNECTION_STRING: Joi.string().required().description("MongoDB Connection URL"),
    JWT_SECRET: Joi.string().required().description("JWT Secret Key"),
    AWS_ACCESS_KEY_ID: Joi.string().required().description("AWS Access Key"),
    AWS_SECRET_ACCESS_KEY: Joi.string().required().description("AWS Secret Key")


}).unknown();


const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    console.log(new Error(`Config validation error: ${error.message}`));
    // throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    port: envVars.PORT,
    mongo: {
        url: envVars.MONGODB_CONNECTION_STRING
    },
    jwt_scret: envVars.JWT_SECRET,
    aws_access_key: envVars.AWS_ACCESS_KEY_ID,
    aws_secret_key: envVars.AWS_SECRET_ACCESS_KEY
}
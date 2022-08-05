var express = require('express');
var router = express.Router();
const authController = require('./auth.controller');//Controller
const validator = require('../utils/validation');
const validationSchema = require('../user/user.validationSchema');

//authenticate

router.get('/', (req, res) => res.send('Auth Route'));

router.post('/admin/login', validator(validationSchema.userLoginValidationScheme), authController.adminLogin);

router.post('/admin/register', validator(validationSchema.userValidationSchema), authController.adminRegister);

router.post('/user/login', validator(validationSchema.userLoginValidationScheme), authController.userLogin);

router.post('/user/register', validator(validationSchema.userValidationSchema), authController.userRegister);

module.exports = router;
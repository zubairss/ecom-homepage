var express = require('express');
var router = express.Router();
const userController = require('./user.controller');//userController
const validationSchema = require('./user.validationSchema');//validationSchema
const validator = require('../utils/validation');
const { authenticate } = require('../auth/auth.middleware')//authenticate

router.get('/', (req, res) => res.send('User Route'))


router.post('/', authenticate("manageUsers"), validator(validationSchema.userValidationSchema), userController.createUser);

router.route("/admin")
    .patch(authenticate("updateSelf"), validator(validationSchema.userIdValidationSchema), validator(validationSchema.userUpdateValidationSchema), userController.updateUser)
    .delete(authenticate("deleteSelf"), validator(validationSchema.userIdValidationSchema), userController.deleteUser)
    .get(authenticate("manageUsers"), userController.getUsers)

router.route("/admin/:userId").get(authenticate("getSelf"), validator(validationSchema.userIdParamsValidationSchema), userController.getOneUser);


module.exports = router;
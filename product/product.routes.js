var express = require('express');
var router = express.Router();
const productController = require('./product.controller');//Controller
const validationSchema = require('./product.validationSchema');//validationSchema
const validator = require('../utils/validation');
const { authenticate } = require('../auth/auth.middleware')//authenticate
const multerS3 = require('../utils/multer-s3');

// router.get('/', (req, res) => res.send('Product Route'))

router.route('/admin')
    // .post(productImageUploadS3.array('productImage', 5), validator(validationSchema.productValidationSchema), productController.addProduct)
    .post(authenticate("manageProducts"), multerS3.uploadProductImages, validator(validationSchema.productValidationSchema), productController.addProduct)
    .delete(authenticate("manageProducts"), validator(validationSchema.mongooseQueryIdValidationSchema), productController.deleteProduct)
    .patch((req, res) => res.send("Patch Product"));

router.get('/', productController.getProducts);
router.get('/:id', validator(validationSchema.mongooseParamsIdValidationSchema), productController.getOneProduct)


router.post('/admin/addImage');


//Append Images - Limit 6
//Set Main Image - Add in the start
//Override Images - Delete Old Add New


module.exports = router;
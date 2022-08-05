var express = require('express');
var router = express.Router();
const bannerController = require('./banner.controller');//Controller
const validationSchema = require('./banner.validationSchema');//validationSchema
const validator = require('../utils/validation');
const { authenticate } = require('../auth/auth.middleware');
const multers3 = require('../utils/multer-s3');
const bannerService = require('./banner.service');

// router.get('/', (req, res) => res.send('Banner Route'))

router.route('/admin')
    .post(authenticate("manageBanners"), multers3.uploadBannerImage, validator(validationSchema.bannerValidationSchema), bannerController.setBanner)
    .delete(authenticate("manageBanners"), validator(validationSchema.mongooseQueryIdValidationSchema), bannerController.deleteBanner)

router.patch('/admin/updateBanner', validator(validationSchema.mongooseQueryIdValidationSchema), bannerController.bannerExist, validator(validationSchema.bannerUpdateValidationSchema), multers3.uploadBannerImage, bannerController.updateBanner)

router.get('/', bannerController.getBanners);
router.get('/:id', validator(validationSchema.mongooseParamsIdValidationSchema), bannerController.getOneBanner)




module.exports = router;
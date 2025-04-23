const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../wrapasync');
const schemas = require('../schema');
const Review = require('../models/review');
const Listing = require('../models/listing');
const { loggedIn } = require('../middleware');
const reviewController = require('../controller/review');


router.post('/', loggedIn, wrapAsync(reviewController.createReview));

router.delete('/:reviewId', loggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;
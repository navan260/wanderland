const express = require('express');
const router = express.Router();
const wrapAsync = require('../wrapasync');
const schemas = require('../schema');
const Review = require('../models/review');
const Listing = require('../models/listing');
const {loggedIn, isOwner} = require('../middleware');
const User = require('../models/user');
const listingController = require('../controller/listings');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.get('/', wrapAsync(listingController.index));

router.get('/:id/edit', loggedIn, wrapAsync(listingController.renderEditForm));

router.get('/add', loggedIn, listingController.renderAddForm);

router.get('/:id', wrapAsync(listingController.showListing));

router.patch('/:id', upload.single('image'), wrapAsync(listingController.edit));

router.post('/', upload.single('image'),
 wrapAsync(listingController.insertion));

router.delete('/:id', loggedIn, wrapAsync(listingController.delete));


module.exports = router;
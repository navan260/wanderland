const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const passport = require('passport');

const schemas = require('../schema');
const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const review = {
        ...req.body.review,
        createdAt: new Date(),
        author: req.user._id
    }
    const listing = await Listing.findById(id);
    let result = schemas.reviewSchema.validate(review);
    console.log(result);
    if(!result.error){
        const revObj = await Review.create(review);
        listing.reviews.push(revObj);
        await listing.save()
        req.flash('success', 'Review added successfully!');
    }
    else{
        req.flash('error', 'Review not added!');
    }
    res.redirect('/listings/' + id);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const deleteReview = await Review.findByIdAndDelete(reviewId);
    const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await listing.save();
    res.redirect('/listings/' + id);
}

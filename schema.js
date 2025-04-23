const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: {
        url: Joi.string().required(),
        filename: Joi.string().required(),
    },
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
});

const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    description: Joi.string().required(),
    createdAt: Joi.date().default(Date.now),
    author: Joi.object().required(),
});

module.exports = {
    listingSchema,
    reviewSchema,
};
const mongoose = require('mongoose');

const reviewSchem = mongoose.Schema({
    description:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

module.exports = mongoose.model('Review', reviewSchem);
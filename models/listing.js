const mongoose = require('mongoose');
const Review = require('./review');

const listingSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://via.placeholder.com/150",
        }        
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Types.ObjectId,
        ref: 'Review'
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


listingSchema.post('findOneAndDelete',async function (doc) {
    console.log("Listing deleted: ", doc);
    try{
        if(this){
            const res = await Review.deleteMany({_id: {$in : doc.reviews}});
            console.log("deleted", res);
        }
    }
    catch(e){
        console.log("Error deleting reviews: ", e);
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
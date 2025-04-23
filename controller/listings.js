const Listing = require('../models/listing');
const schemas = require('../schema')

module.exports.index = async (req, res) => {
    const allListings = await Listing.find().populate('owner');
    res.render('listings/listings', { listings: allListings });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit', { listing });
}

module.exports.renderAddForm = (req, res) => {
    res.render('listings/add');
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate(
            {
                path: 'reviews',
                populate: { path: 'author' }
            })
        .populate('owner');
    res.render('listings/show', { listing });
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    let img;
    if (req.file) {
        img = {
            url: req.file.path,
            filename: req.file.filename
        }
        console.log(req.file);
    } else {
        const listing = await Listing.findById(id);
        img = {
            url: listing.image.url,
            filename: listing.image.filename
        }
    }
    console.log(req.file);
    console.log(img);

    await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        image: img
    });
    res.redirect('/listings/' + id);
}

module.exports.insertion = async (req, res) => {
    const listing = req.body.listing;
    listing.image = {
        url: req.file.path,
        filename: req.file.filename
    }

    let result = schemas.listingSchema.validate(listing);
    if (!result.error) {
        await Listing.create({
            ...listing,
            owner: req.user._id
        });
        req.flash('success', 'Successfully added a new listing!');
        res.redirect('/listings');
    }
    else {
        console.log(result.error)
        req.flash('error', 'Error in adding a new listing!');
        res.redirect('/listings/add');
    }
}

module.exports.delete = async (req, res) => {
    const deleteResponse = await Listing.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
}
const Listing = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

// Index Route
module.exports.index = async (req, res) => {

    const { category, search } = req.query;

    let allListings;

    if (search) {

        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ]
        });

        if (allListings.length === 0) {
            req.flash("error", `No listings found for "${search}"`);
            return res.redirect("/listings");
        }

    } else if (category === "Trending") {

        allListings = await Listing.find({}).limit(8);

    } else if (category) {

        allListings = await Listing.find({ category });

    } else {

        allListings = await Listing.find({});

    }

    res.render("listings/index.ejs", { allListings });
};
// New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Create Route
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url,
        filename
    };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings");
};

// Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


// Edit Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};


// Update Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    // Update title, description, price, country, location
    Object.assign(listing, req.body.listing);
    // If a new image was uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await listing.save();
    req.flash("success", "Listing Updated!!");
    res.redirect(`/listings/${id}`);
};


// Delete Route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
};
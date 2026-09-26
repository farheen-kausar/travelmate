const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {
    isLoggedIn,
    isOwner,
    validateListing
} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer = require("multer");

const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });


// Index Route

router.route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );


// New Route
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);


// Wishlist POST Route
router.post(
    "/:id/wishlist",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        const { id } = req.params;
        const user = req.user;

        const index = user.wishlist.findIndex(
            listingId => listingId.toString() === id
        );

        if (index === -1) {
            // Add to wishlist
            user.wishlist.push(id);
        } else {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
        }

        await user.save();

        res.redirect(`/listings/${id}`);
    })
);


// Wishlist GET Route
router.get(
    "/wishlist",
    isLoggedIn,
    wrapAsync(async (req, res) => {

        await req.user.populate("wishlist");

        res.render("listings/wishlist.ejs", {
            wishlist: req.user.wishlist
        });

    })
);

// Show, Update & Delete Routes
router.route("/:id")
    .get(
        wrapAsync(listingController.showListing)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),   // ✅ ADD THIS
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );


// Edit Route

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;
const express = require("express");
const router = express.Router();
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router.get("/search", wrapAsync(listingController.liveSearch));

router
  .route("/") //router.route is used to combine similar routes, difference request ke type ki vajah se pata chalta he GET or POST
  .get(wrapAsync(listingController.index)) //index route
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.renderCreateListing) //create route
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get( wrapAsync(listingController.renderShowListing)) //show route
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.renderUpdateListing) //Update route
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderDeleteListing)
  ); //delete route

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditListing)
);

module.exports = router;

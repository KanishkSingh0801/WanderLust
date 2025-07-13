const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
      { category: regex },
    ];
  }

  if (category && category !== "") {
    query.category = category;
  }

  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", { allListings, search, category });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.renderShowListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //Populate is used to show the whole review object
  if (!listing) {
    req.flash("error", "The requested listing doesn't exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.renderCreateListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing is Created!");
  res.redirect("/listings");
};

module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The requested listing doesn't exist!");
    res.redirect("/listings");
  } else {
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }
};

module.exports.renderUpdateListing = async (req, res) => {
  let { id } = req.params;
  let listingData = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listingData.image = { url, filename };
    await listingData.save();
  }

  if (!listingData.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }

  //If image URL is blank, assign default
  if (!listingData.image || listingData.image.url.trim() === "") {
    listingData.image = {
      url: "https://plus.unsplash.com/premium_photo-1669218057891-c79da315d253?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // default image URL
    };
  }

  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.renderDeleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

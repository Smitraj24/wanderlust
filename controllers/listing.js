const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const searchQuery = req.query.q;
  const category = req.query.category;

  let filter = {};

  if (category) filter.category = category;
  if (searchQuery) filter.title = { $regex: searchQuery, $options: "i" };

  console.log("Filter applied:", filter);

  const listings = await Listing.find(filter);
  const allListings = await Listing.find({});
  const wishlistIds = (req.user?.wishlist || []).map((id) => id.toString());
  const cartIds = (req.user?.cart || []).map((id) => id.toString());

  res.render("listings/index.ejs", {
    listings,
    allListings,
    searchQuery,
    category,
    wishlistIds,
    cartIds,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing requested for does not exists! ");
    return res.redirect("/listings");
  }
  const inWishlist = req.user && (req.user.wishlist || []).some((w) => w.toString() === listing._id.toString());
  const inCart = req.user && (req.user.cart || []).some((c) => c.toString() === listing._id.toString());
  res.render("listings/show.ejs", { listing, inWishlist, inCart });
};

module.exports.createListing = async (req, res, next) => {
  if (!req.file) {
    req.flash("error", "Image is required!");
    return res.redirect("/listings/new");
  }
  console.log(req.file);
  console.log(req.body);

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();

  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "New Listing Deleted!");
  res.redirect("/listings");
};

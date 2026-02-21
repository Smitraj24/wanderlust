const Listing = require("../../models/listing.js");
const Review = require("../../models/review.js");
const User = require("../../models/user.js");
const wrapAsync = require("../../utils/wrapAsync.js");

module.exports.dashboard = async (req, res) => {
  const totalListings = await Listing.countDocuments();
  const totalReviews = await Review.countDocuments();
  const totalUsers = await User.countDocuments();
  const recentListings = await Listing.find({})
    .populate("owner")
    .sort({ _id: -1 })
    .limit(5);
  const recentReviews = await Review.find({})
    .populate("author")
    .sort({ createdAt: -1 })
    .limit(5);

  res.render("admin/dashboard.ejs", {
    totalListings,
    totalReviews,
    totalUsers,
    recentListings,
    recentReviews,
  });
};

module.exports.listingsIndex = async (req, res) => {
  const searchQuery = req.query.q;
  const category = req.query.category;
  let filter = {};
  if (category) filter.category = category;
  if (searchQuery) filter.title = { $regex: searchQuery, $options: "i" };

  const listings = await Listing.find(filter).populate("owner").sort({ _id: -1 });
  res.render("admin/listings/index.ejs", { listings, searchQuery, category });
};

module.exports.listingsShow = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/admin/listings");
  }
  res.render("admin/listings/show.ejs", { listing });
};

module.exports.renderNewListing = (req, res) => {
  res.render("admin/listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  if (!req.file) {
    req.flash("error", "Image is required!");
    return res.redirect("/admin/listings/new");
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: req.file.path, filename: req.file.filename };
  await newListing.save();
  req.flash("success", "Listing created!");
  res.redirect("/admin/listings");
};

module.exports.renderEditListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/admin/listings");
  }
  let originalImageUrl = listing.image?.url;
  if (originalImageUrl) originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("admin/listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/admin/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/admin/listings");
};

module.exports.reviewsIndex = async (req, res) => {
  const reviewDocs = await Review.find({})
    .populate("author")
    .sort({ createdAt: -1 })
    .lean();
  const reviewIds = reviewDocs.map((r) => r._id);
  const listingsWithReviews = await Listing.find({ reviews: { $in: reviewIds } })
    .select("title _id reviews")
    .lean();
  const reviewToListing = {};
  for (const list of listingsWithReviews) {
    for (const rid of list.reviews) {
      reviewToListing[rid.toString()] = { title: list.title, _id: list._id };
    }
  }
  for (const r of reviewDocs) {
    r.listingRef = reviewToListing[r._id.toString()] || null;
  }
  res.render("admin/reviews/index.ejs", { reviews: reviewDocs });
};

module.exports.destroyReview = async (req, res) => {
  const { reviewId } = req.params;
  const listing = await Listing.findOneAndUpdate(
    { reviews: reviewId },
    { $pull: { reviews: reviewId } }
  );
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect("/admin/reviews");
};

module.exports.usersIndex = async (req, res) => {
  const users = await User.find({}).sort({ _id: -1 });
  res.render("admin/users/index.ejs", { users });
};

module.exports.destroyUser = async (req, res) => {
  const { userId } = req.params;
  if (req.user._id.toString() === userId) {
    req.flash("error", "You cannot delete your own account.");
    return res.redirect("/admin/users");
  }
  const user = await User.findById(userId);
  if (user && user.isAdmin) {
    req.flash("error", "Cannot delete another admin.");
    return res.redirect("/admin/users");
  }
  const userReviews = await Review.find({ author: userId }).select("_id");
  const reviewIds = userReviews.map((r) => r._id);
  await Listing.updateMany(
    { reviews: { $in: reviewIds } },
    { $pull: { reviews: { $in: reviewIds } } }
  );
  await Review.deleteMany({ author: userId });
  await Listing.deleteMany({ owner: userId });
  await User.findByIdAndDelete(userId);
  req.flash("success", "User deleted!");
  res.redirect("/admin/users");
};

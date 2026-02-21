const User = require("../models/user.js");

module.exports.addOrRemove = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const wishlist = user.wishlist || [];
  const index = wishlist.findIndex((w) => w.toString() === id);
  if (index === -1) {
    user.wishlist.push(id);
    req.flash("success", "Added to wishlist!");
  } else {
    wishlist.splice(index, 1);
    user.wishlist = wishlist;
    req.flash("success", "Removed from wishlist!");
  }
  await user.save();
  res.redirect("back");
};

module.exports.index = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  const listings = (user.wishlist || []).filter((l) => l != null);
  res.render("wishlist/index.ejs", { listings });
};

module.exports.remove = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: id } });
  req.flash("success", "Removed from wishlist!");
  res.redirect("back");
};

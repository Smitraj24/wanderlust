module.exports.isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to access the admin panel.");
    return res.redirect("/login");
  }
  if (!req.user.isAdmin) {
    req.flash("error", "You do not have permission to access the admin panel.");
    return res.redirect("/listings");
  }
  next();
};

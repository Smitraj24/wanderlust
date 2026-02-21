const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const wishlistController = require("../controllers/wishlist.js");

router.get("/", isLoggedIn, wishlistController.index);
router.post("/:id", isLoggedIn, wishlistController.addOrRemove);
router.delete("/:id", isLoggedIn, wishlistController.remove);

module.exports = router;

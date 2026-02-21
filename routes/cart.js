const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware.js");
const cartController = require("../controllers/cart.js");

router.get("/", isLoggedIn, cartController.index);
router.post("/:id", isLoggedIn, cartController.addOrRemove);
router.delete("/:id", isLoggedIn, cartController.remove);

module.exports = router;

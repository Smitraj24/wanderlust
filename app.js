if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const { createWebCryptoAdapter } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { Session } = require("inspector/promises");

const dbUrl = process.env.MONGO_URL;

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory

/*
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "SECRET",
  },
  touchAfter: 24 * 3600,
});
*/

const store = MongoStore.create({
  mongoUrl: dbUrl,
  cryptoAdapter: createWebCryptoAdapter({
    secret: process.env.SECRET,
  }),
  touchAfter: 24 * 3600,
})

store.on("error" , () => {
  console.log("Error in MONGO STORE" , err);
}); 

const sessionOptions = {
  store,
  secret: process.env.SECRET, //Session encryption માટે key
  resave: false, //Session modify ન થાય તો તેને re-save ન કરે
  saveUninitialized: true, //New session create થાય ત્યારે—even if empty—save કરે છે
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

/*app.get("/",(req,res)=>{
    res.send("Hi , I am root"); 
}) ;
*/



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // it is  use to static authenticate methood of model in localstratergy

passport.serializeUser(User.serializeUser()); // user related information store. serilaized
passport.deserializeUser(User.deserializeUser()); //unstore information

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // current user information  use for navbar in req.user directly nit work so use store in local variable
  next();
});

/*
app.get("/demouser", async(req,res) => {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student"
  });
 let registerdUser = await User.register (fakeUser,"helloworld"); 
 res.send(registerdUser);
} );

*/

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Your routes go above this
app.get("/home", (req, res) => {
  res.send("Home Page");
});

// Catch-all 404 handler (no `*`)
function handleNotFound(req, res, next) {
  next(new ExpressError(404, "Page not Found !"));
}
app.use(handleNotFound);

//middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

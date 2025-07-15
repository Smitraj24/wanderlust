const express =  require ("express");
const app= express();
const mongoose = require("mongoose");
const  Listing = require("./models/listing.js"); // Import the Listing model
const path = require("path");
const {data} =require("./init/data.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { required } = require("joi");
const {listingSchema} = require("./schema.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main() 
  .then(()=> {
    console.log("Connected to MongoDB"); 
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine",  "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the public directory

app.get("/",(req,res)=>{
    res.send("Hi , I am root"); 
});

const validateListing = (req,res, next)=>{
let {error}=  listingSchema.validate(req.body);
 
 if(error){
  let errMsg = error.details.map((el) => el.message).join(",");
  throw new ExpressError(400,errMsg);
 }
 else{
  next();
 }
};  


//index route
app.get("/listings",  wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
})
);

//New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route 
app.get("/listings/:id",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
})
);

//create route
app.post("/listings",validateListing, wrapAsync(async (req, res , next ) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
 } )      

);

//edit route

app.get("/listings/:id/edit",  wrapAsync(async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
     res.render("listings/edit.ejs",{listing});
})
);

//update route
app.put("/listings/:id",validateListing,  wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
})
);

// delete route

app.delete("/listings/:id",  wrapAsync(async(req,res)=>{
  let { id } = req.params;
   let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})
);

/* 
app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
      title: "My New Villa",
      description: "By the beach",
     price: 1200,
      location: "Calangute, Goa",
      country: "India",
     });
  
    await sampleListing.save();
     console.log("sample was saved");
    res.send("successful testing");
   });
*/
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
    let {statusCode=500, message="Something Went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
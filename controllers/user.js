const User = require ("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res)=>{
    try{
  let {username,email,password} = req.body ;
  const newUser = new User({email,username});
  let registeredUser = await User.register(newUser , password); 
  console.log(registeredUser);
  req.login(registeredUser, (err) =>{
    if(err){
        return next(err);
    }
    req.flash("success", "Welcome to wanderlust!");
  res.redirect("/listings");
  })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup"); 
    }
 
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
      req.flash("success","Welcome back to Wanderlust ");
      let redirectUrl = res.locals.redirectUrl || "/listings"; // use the saved redirect URL or default to listings
      res.redirect(redirectUrl); // redirect to the original URL or listings 
};

module.exports.logout =(req,res)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success","you are looged out!");
        res.redirect("/listings");
    })
}
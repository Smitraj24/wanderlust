/*
function wrapAsync(fn){
    return function(req, res, next){
        fn(req,res, next).catch(next);
    }
}
*/  /* basic type for every wrapAsync function */


// direct export using arrow function

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

//It automatically catches errors from async route functions and sends them to Express error middleware.

class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;

//“ExpressError is a custom error class used to attach HTTP status codes to errors, enabling proper and centralized error handling in Express applications.”
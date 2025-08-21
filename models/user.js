const mongoose = require("mongoose");
const Schema =  mongoose.Schema; //const Schema = mongoose.Schema; is just a shortcut so that you don’t have to write mongoose.Schema every time
const { required } = require("joi");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required:true
    }
}); 

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema); 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});


userSchema.plugin(passportLocalMongoose); //this passport-local-mongoose automatically includes a username, hash and salt field to store the username, the hashedpassword and the salt value

module.exports = mongoose.model("User", userSchema);
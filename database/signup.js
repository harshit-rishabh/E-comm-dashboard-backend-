const mongoose = require('mongoose');
const signupSchema = new mongoose.Schema({
    name:String, email:String, pass:String
},{collection:'signup'});
module.exports = mongoose.model('signup', signupSchema);
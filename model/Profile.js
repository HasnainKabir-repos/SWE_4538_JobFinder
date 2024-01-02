const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    email: {type:String,required:true},
    photo:{type: String},
    video:{type:String}
        
});
  
module.exports = mongoose.model('Profile', ProfileSchema);
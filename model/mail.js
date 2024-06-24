const mongoose = require("mongoose");


const mailSchema = new mongoose.Schema({
senderName:{
    type: String,
    // required: [true, "Please enter your name!"],
  },
  senderEmail:{
    type: String,
    // required: [true, "Please enter your email!"],
  },
  subject:{
    type: String,
    // required: true,
  },
  message:{
    type: String,
    // required: true,
  },
  createdAt:{
    type: Date,
    default: Date.now(),
   }
})


module.exports = mongoose.model("Mail", mailSchema);

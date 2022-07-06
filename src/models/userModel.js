const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: "Title is Required",
        enum: ["Mr", "Mrs", "Miss"]
    },

    name: {
      type: String,
      required: "Name is Required",
      
    },

    phone: {
      type: String,
      required: "Phone is Required",
      unique:true
      
    },

    email: {
      type: String,
      required: "EmailId is Required",
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      required: "Password is Required",
    },

    address:{
        street:{type:String,trim:true},
        city:{type:String,trim:true},
        pincode:{type:String,trim:true}
    },
    

  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
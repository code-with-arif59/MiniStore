import mongoose from "mongoose";

const usershema = new mongoose.Schema({
    name :{type : String, required : true },
    email :{type : String, required : true, unique:true },
    password :{type : String, required : true },

role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}

},{timestamps:true})

const Usermodel = mongoose.model("user",usershema)
export default Usermodel;
import mongoose from "mongoose";
const { Schema } = mongoose;
const EntrySchema = new mongoose.Schema({
 type:{
    type:String,
    enum:['income','expense','budget'],
     message: '{VALUE} is not a valid type! Allowed values are income, expense',
    required:true,
 },
    amount:{
    type:Number,
    required:true,
  },
   description:{
    type:String,
    required:true,
},
  
data:{
    type:Date,
    default:Date.now,
},

});
const Entry = mongoose.model("Entry", EntrySchema);

export { EntrySchema }; 
export default Entry
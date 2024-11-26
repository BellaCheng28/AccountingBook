import mongoose from "mongoose"
import {EntrySchema} from "./entry.js";
const{Schema} =mongoose;

const CategorySchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  type:{
    type:String,
    enum:["income","expense"],
    required:true,
  },
});

const accountingBookSchema = new mongoose.Schema(
  { 
      owner:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true,
      },
      sharedWith:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref:"User",
        
        },
      ],
       
  categories:[CategorySchema],
  
  entries: [EntrySchema],
},

{
  timestamps:true,
}

);

accountingBookSchema.index({owner:1})
const AccountingBook = mongoose.model("AccountingBook", accountingBookSchema);

export default AccountingBook
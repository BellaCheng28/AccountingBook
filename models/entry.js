import mongoose from "mongoose";
const { Schema } = mongoose;
const EntrySchema = new mongoose.Schema({
  type: {
    type: String,
    // enum: ["income", "expense", "budget"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Category",  
    required: true,

    
  },
});



const Entry = mongoose.model("Entry", EntrySchema);

export { EntrySchema }; 
export default Entry
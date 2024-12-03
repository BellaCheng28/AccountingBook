import mongoose from "mongoose"
import {EntrySchema} from "./entry.js";
const{Schema} =mongoose;


const accountingBookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: { type: String, enum: ["read", "write"], default: "read" }, 
      },
    ],


    entries: [EntrySchema],
  },

  {
    timestamps: true,
  }
);

accountingBookSchema.index({owner:1})
const AccountingBook = mongoose.model("AccountingBook", accountingBookSchema);

export default AccountingBook
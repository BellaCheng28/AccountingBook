import mongoose from "mongoose";
const { Schema } = mongoose;
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // minLength: 4,
    // maxLength: 10,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // minLength: 6,
  },
  personalBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountingBook",
    },
  ],
  sharedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountingBook",
    },
  ],
});

const User = mongoose.model("User", UserSchema);
export default User;

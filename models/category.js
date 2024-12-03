import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["income", "expense"], // 收入或支出
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true, // 分类名称唯一
  },
  subcategories: [
    {
      name: {
        type: String,
        required: true,
      },
      isDefault: {
        type: Boolean,
        default: false, // 区分预设和用户自定义
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 每个分类归属一个用户或家庭
    required: true,
  },
});
categorySchema.index({ name: 1, owner: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;

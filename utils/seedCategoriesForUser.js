import Category from "../models/category.js";

const defaultCategories = [
  {
    type: "income",
    name: "Full-time Salary",
    subcategories: [
      { name: "Salary", isDefault: true },
      { name: "Bonus", isDefault: true },
    ],
  },
  {
    type: "income",
    name: "Part-time Salary",
    subcategories: [
      { name: "Salary", isDefault: true },
      { name: "Freelance Work", isDefault: true },
    ],
  },
  {
    type: "income",
    name: "Stock Dividends",
    subcategories: [{ name: "Dividends", isDefault: true }],
  },
  {
    type: "expense",
    name: "Food",
    subcategories: [
      { name: "Groceries", isDefault: true },
      { name: "Dining Out", isDefault: true },
    ],
  },
  {
    type: "expense",
    name: "Rent",
    subcategories: [
      { name: "Apartment", isDefault: true },
      { name: "House", isDefault: true },
    ],
  },
  {
    type: "expense",
    name: "Utilities",
    subcategories: [
      { name: "Electricity", isDefault: true },
      { name: "Water", isDefault: true },
      { name: "Internet", isDefault: true },
    ],
  },
  {
    type: "expense",
    name: "Transportation",
    subcategories: [
      { name: "Public Transport", isDefault: true },
      { name: "Fuel", isDefault: true },
    ],
  },
];

const seedCategoriesForUser = async (userId) => {
  try {
    if (!userId) {
      console.error("Cannot seed categories: userId is undefined.");
      return;
    }
    const existingCategories = await Category.find({ owner: userId });
    if (existingCategories.length > 0) {
      console.log(`Categories already exist for user ${userId}.`);
      return;
    }

    for (const defaultCategory of defaultCategories) {
      const categoryExists = await Category.findOne({
        owner: userId,
        name: defaultCategory.name,
      });

      if (!categoryExists) {
        const categoryWithOwner = { ...defaultCategory, owner: userId };
        await Category.create(categoryWithOwner);
      }
    }

    console.log(`Default categories have been added for user ${userId}.`);
  } catch (error) {
    console.error(`Error inserting categories for user ${userId}:`, error);
  }
};
export default seedCategoriesForUser;

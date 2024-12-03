import express from "express";
import mongoose from "mongoose";
import moment from "moment-timezone";
import Entry from "../models/entry.js";
import AccountingBook from "../models/acountingBook.js";
import Category from "../models/category.js";
import getDateRange from "../utils/getDateRange.js";
const router = express.Router();

router.get("/:bookId/entries", async (req, res) => {
  try {
    // console.log("2222", req.originalUrl);
    // console.log("1111", req.params);
    const bookId = req.params.bookId;

    const { dateRange = "day", specificDate } = req.query;
    // personal or sharedwith
    if (!req.session.user) {
      return res.status(401).send("You must be logged in to access this page.");
    }
    const accountingBook = await AccountingBook.findById(bookId)
      .populate("owner", "username")
      .populate("sharedWith.userId", "username")
      .populate("entries.category"); //new insert

    if (!accountingBook) {
      return res.status(404).send("accounting book not found");
    }

    // Ensure user has access
    const userId = req.session.user._id;
    const isOwner = accountingBook.owner._id.toString() === userId.toString();
    const isSharedUser = accountingBook.sharedWith.some(
      (shared) =>
        shared.userId._id.toString() === userId.toString() &&
        shared.permission === "write"
    );
    if (!isOwner && !isSharedUser) {
      return res.status(403).send("you don not have access to this book");
    }

    // Sort entries by date descending
    const entries = accountingBook.entries.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    // Convert UTC dates to Eastern Time (ET) for each entry
    const formattedEntries = accountingBook.entries.map((entry) => {
      // 使用 moment.utc() 格式化日期为 UTC 时间
      const formattedDate = moment.utc(entry.date).format("MMM D, YYYY"); // 格式化为 "Dec 2, 2024"
      return {
        ...entry.toObject(), // 保持原有的字段
        localDate: formattedDate, // 添加一个新的字段 localDate，作为格式化后的 UTC 日期
      };
    });

    let startDate, endDate;
    // Filter entries based on date range or specific date
    try {
      // Get date range using the utility function
      ({ startDate, endDate } = getDateRange(dateRange, specificDate));
    } catch (error) {
      return res.status(400).send(error.message);
    }

    // Filter entries based on the start and end date range
    const filteredEntries = formattedEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });

     console.log("formattedEntries:", formattedEntries);
     console.log("filteredEntries:", filteredEntries);
    // console.log("localDate:", localDate);

    /// Split entries into income and expense
    let incomeEntries = filteredEntries.filter(
      (entry) => entry.type === "income"
    );
    let expenseEntries = filteredEntries.filter(
      (entry) => entry.type === "expense"
    );

    // Calculate total income and expense
    const totalIncome = incomeEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const totalExpense = expenseEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const totalAmount = totalIncome - totalExpense;
    
    res.render("entries/index.ejs", {
      accountingBook,
      incomeEntries,
      expenseEntries,
      totalAmount,
      totalIncome,
      totalExpense,
      bookId,
      entries: formattedEntries,
      dateRange,
      specificDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating share permissions.");
  }
});

// create new entry
router.get("/:bookId/entries/new", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const bookId = req.params.bookId;
    const accountingBook = await AccountingBook.findById(bookId);
    if (!accountingBook) {
      return res.status(404).send("Accounting book not found");
    }
    const categories = await Category.find({ owner: req.session.user._id });

    console.log("Current Date:", currentDate); // Log to make sure it's correctly passed

    res.render("entries/new.ejs", {
      categories,
      bookId,
      accountingBook,
      currentDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error for  create new entries");
  }
});

router.post("/:bookId/entries", async (req, res) => {
  try {
    console.log("Form data:", req.body);
    // console.log("Request URL:", req.originalUrl);
    const { type, date, amount, description, categoryId } = req.body;
    const bookId = req.params.bookId;
    //  console.log("bookId:", bookId);

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).send("Invalid date format");
    }

    const [month, day, year] = date.split("/");
    //YYYY/MM/DD  submit  date to mongoDB
    const formattedDate = new Date(`${year}-${month}-${day}`);

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    //  console.log("Request body:", req.body);
    //  console.log("Category ID:", new mongoose.Types.ObjectId(categoryId));
    // MM/DD/YYYY

    const entry = new Entry({
      type,
      amount,
      description,
      date: parsedDate, //新改
      category: new mongoose.Types.ObjectId(categoryId),
      accountingBook: new mongoose.Types.ObjectId(bookId),
    });
    await entry.save();
    console.log("Entry object:", entry);

    const accountingBook = await AccountingBook.findById(bookId);
    if (!accountingBook) {
      return res.status(404).send("AccountingBook not found");
    }
    accountingBook.entries.push(entry); // Add the entry ID to the entries array
    await accountingBook.save(); // Save the updated AccountingBook
    console.log("AccountingBook updated:", accountingBook);

    res.redirect(`/accountingbooks/${bookId}/entries`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error for  create new entries");
  }
});

router.delete("/:bookId/entries/:entryId/delete", async (req, res) => {
  try {
    console.log("Request Params:", req.params);
    const { bookId, entryId } = req.params;
    console.log("bookId:", bookId);
    console.log("entryId:", entryId);

    const accountingBook = await AccountingBook.findById(bookId);
    console.log("entries before deletion:", accountingBook.entries);

    await Entry.findByIdAndDelete(entryId);
    console.log(`Entry ${entryId} deleted successfully.`);

    accountingBook.entries = accountingBook.entries.filter(
      (entry) => entry._id.toString() !== entryId
    );
    await accountingBook.save();
    console.log("entries after deletion:", accountingBook.entries);

    // res.render("entries/index.ejs", {
    //   bookId,
    //   accountingBook,
    //   entries: accountingBook.entries,
    // });
    // console.log('1111')
    res.redirect(`/accountingbooks/${bookId}/entries`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting entry");
  }
});

router.get("/:bookId/entries/:entryId/edit", async (req, res) => {
  try {
    const { bookId, entryId } = req.params;
    console.log("Book ID:", bookId);
    console.log("Entry ID:", entryId);

    const accountingBook = await AccountingBook.findById(bookId);
    if (!accountingBook) {
      console.error("Accounting Book not found");
      return res.status(404).send("Accounting Book not found");
    }
    // const entries = accountingBook.entries;
    const entry = accountingBook.entries.id(entryId);
    if (!entry) {
      console.error("Entry not found");
      return res.status(404).send("Entry not found");
    }
    const formattedDate = new Date(entry.date).toLocaleDateString("en-US");

    console.log("Entry found:", entry);
    console.log("entries:", entries);

    const categories = await Category.find({ owner: req.session.user._id });

    // const entryDate = new Date(entry.date);
    // const formattedDate = entryDate.toLocaleDateString("en-US");

    res.render("entries/edit.ejs", {
      accountingBook,
      entry,
      categories,
      bookId,
      formattedDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving entry");
  }
});

router.put("/:bookId/entries/:entryId", async (req, res) => {
  try {
    const { type, date, amount, description, categoryId } = req.body;
    const { bookId, entryId } = req.params;

    const [month, day, year] = date.split("/");
    const formattedDate = new Date(`${year}-${month}-${day}`);

    // const entryDate = new Date(date);
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send("Category not found");
    }

    //update entry
    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).send("Entry not found");
    }
    entry.type = type;
    entry.amount = amount;
    entry.description = description;
    entry.date = formattedDate;
    entry.category = new mongoose.Types.ObjectId(categoryId);

    await entry.save();

    const accountingBook = await AccountingBook.findById(bookId);
    if (!accountingBook) {
      return res.status(404).send("AccountingBook not found");
    }
    await accountingBook.save(); // 只需保存 AccountingBook，entries 数组已经保持同步
    console.log("AccountingBook updated:", accountingBook);

    await accountingBook.save();

    res.redirect(`/accountingbooks/${bookId}/entries`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating entry");
  }
});

export default router;

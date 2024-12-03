import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import seedCategoriesForUser from "../utils/seedCategoriesForUser.js";
import User from "../models/user.js";

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs", { user: req.session });
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs", { user: req.session.user || null });
});

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/sign-up", async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    // Username is not taken already!
    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    // Must hash the password before sending to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // All ready to create the new user!
    await User.create(req.body);

    res.redirect("/auth/sign-in");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    // First, get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.status(401).send("Login failed. Please try again.");
    }
    console.log("Seeding categories for user ID:", userInDatabase._id);

    // There is a user! Time to test their password with bcrypt
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.status(401).send("Login failed. Please try again.");
    }
    console.log(userInDatabase);
    // There is a user AND they had the correct password. Time to make a session!
    // Avoid storing the password, even in hashed format, in the session
    // If there is other data you want to save to `req.session.user`, do so here!
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    if (!userInDatabase.categoriesSeeded) {
      await seedCategoriesForUser(userInDatabase._id);
      userInDatabase.categoriesSeeded = true; // 标记已完成分类种植
      await userInDatabase.save();
    }
    // if (!userInDatabase._id) {
    //   console.error("User ID is undefined. Cannot seed categories.");
    // } else {
    //   await seedCategoriesForUser(userInDatabase._id);
    // }
    // 在登录时只调用一次

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

export default router;

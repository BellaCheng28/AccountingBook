 import express from "express";
 import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import morgan from "morgan";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);


import usersRouter from "./controllers/users.js";
import accountingBooksRouter from "./controllers/accountingBooks.js";
import entriesRouter from "./controllers/entries.js";
import authRouter from "./controllers/auth.js";

import validSession from "./middleware/validSession.js";
import passUserToView from "./middleware/pass-user-to-view.js";

const app = express();
app.use(express.static(path.join(__dirname,"public")));
// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for handling sessions

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {maxAge: 1000 * 60 * 30}, // 30mins,
  })
);

app.use("/auth", authRouter);
app.use(validSession);
app.use(passUserToView);

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));

// http://localhost:3000/auth/sing-up

app.use("/users", usersRouter);
app.use("/accoutingbooks", accountingBooksRouter);
app.use("/entry", entriesRouter);




app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});


// app.get("/",(req,res)=> {
//   if(req.session.user){
//     res.redirect(`/users/${req.session.user._id}/accountingbook`);
//   }else
//   res.send("welcome to our accoutingbook");
// });




app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

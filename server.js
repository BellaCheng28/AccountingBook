import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import methodOverride from "method-override";
import morgan from "morgan";
import path from "path";
import ejs from "ejs";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

import usersRouter from "./controllers/users.js";
import accountingBooksRouter from "./controllers/accountingBooks.js";
import entriesRouter from "./controllers/entries.js";
import authRouter from "./controllers/auth.js";
import validSession from "./middleware/validSession.js";
import passUserToView from "./middleware/pass-user-to-view.js";

const app = express();
// app.use(express.static(path.join(__dirname, "view","accountingbooks")));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.set("views", path.join(__dirname, "views", "accountingbooks"));

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  
});
// Middleware for method-override (allowing PUT, DELETE from forms)
// Middleware for handling sessions
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  console.log(`Request Method (After Override): ${req.method}`);
  next();
});
// Middleware to parse URL-encoded data from forms
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: 1000 * 60 * 30 }, // 30mins,
  })
);

app.use("/auth", authRouter);
app.use(validSession);
app.use(passUserToView);

// Middleware for using HTTP verbs such as PUT or DELETE

// Morgan for logging HTTP requests
app.use(morgan("dev"));

// http://localhost:3000/auth/sing-up

app.use("/users", usersRouter);
app.use("/accountingbooks", accountingBooksRouter);
app.use("/accountingbooks", entriesRouter);

app.get("/", (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});
// Catch-all for undefined routes
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();

});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

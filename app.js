import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";
import Review from "./models/review.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import Joi from "joi";
import session from "express-session";
import flash from "connect-flash";
import campgroundRoutes from "./routes/campgrounds.js";
import reviewRoutes from "./routes/reviews.js";
import userRoutes from "./routes/users.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected.");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // In ES Modules, this is the workflow.
app.set("views", path.join(__dirname, "views")); // This tells Express where to look for our template files.
app.set("view engine", "ejs"); // This tells which template engine to use for rendering views which in our case it's ejs.
app.use(express.urlencoded({ extended: true })); // Forms
app.use(methodOverride("_method")); // Delete + Put addition
app.engine("ejs", ejsMate); // EJS boilerplating, etc.
app.use(express.static(path.join(__dirname, "public"))); // Serve static files such as images, etc.

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh no, something went wrong!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});

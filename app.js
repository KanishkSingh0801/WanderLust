const express = require("express");
const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const User = require("./models/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.listen(8080, () => {
  console.log("Server is listening to port 8080");
});

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hi, i am root");
});

app.use(session(sessionOptions));
app.use(flash()); //this should come before the routes such as listings and reviews

app.use(passport.initialize()); //A middlewasre that initializes passport
app.use(passport.session()); //Used to help identify is the same user is navigating through different pages or not
passport.use(new LocalStrategy(User.authenticate()));
//This passport method is used to authenticate every user that arrives

passport.serializeUser(User.serializeUser()); //Serialize = storing user related info in session
passport.deserializeUser(User.deserializeUser()); //Deserialize = removing user related info in session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//DEMONSTRATION OF DUMMY ENTRY
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld"); //register() is a static method of passport which is used to store the user and it automatically checks if the username is unique or not, "helloworld" is password for the user ID
//   res.send(registeredUser);
// });

app.use("/listings", listingsRouter); //using router to handle all listing related paths
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  console.log("Request Path:", req.path);
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

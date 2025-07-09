const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode")); //this secretcode is used to almost encrypt the cookie

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("made-in", "India", { signed: true });
//   res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//   console.log(req.cookies); //this will not print signed cookies
//   console.log(req.signedCookies); //this will print signed cookies and if someone tampers with the signed cookie, then this method will not acknowledge it
//   res.send("verified");
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("Greet", "Hello");
//   res.cookie("Name", "Kanishk");
//   res.send("Sent you some cookies");
// });

// app.get("/greet", (req, res) => {
//   let { Name = "anonymous" } = req.cookies;
//   res.send(`Hello, ${Name}`);
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
};

app.use(
  //This creates a session ID which will be used in every request
  session(sessionOptions)
);
app.use(flash());

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  req.flash("success", "user registered successfully");
  req.flash("error", "Some error occurred");
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.locals.messages = req.flash("success");
  res.render("page.ejs", { name: req.session.name });
});

//USED TO DEMONSTRATE THE SESSION MEMORY FEATURE
// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//     res.send("Test successfull");
// })

app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Hi, i am root");
});

app.use("/users", users); //Iski vajah se / ke baad ka jo bhi URL hoga, voh pehle user ke router se match hoga

app.use("/posts", posts);

app.listen(3000, () => {
  console.log("Port is listening on 3000");
});

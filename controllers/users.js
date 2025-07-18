const User = require("../models/user");

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      //login() is used to automatically login after signing up
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup", {error});
  }
};

module.exports.renderSignUpForm = (req, res) => {
  const error = req.flash("error");
  res.render("users/signup.ejs", {error});
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    //logout() method is a static method of passport and it deserializes the data of user
    if (err) {
      return next(err);
    }
    req.flash("success", "You are successfully logged out");
    res.redirect("listings");
  });
};

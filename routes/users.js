const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const db = require("../models");

// user login routes
router.get("/login", (req, res) => {
  const serverData = db.Server_data.findAll();
  const users = db.User.findAll();
  if (serverData.length === 0 && users.length === 0)
    return res.redirect("/config");
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("users/login");
});

/* router.get("/register", (req, res) => {
    res.render("users/register");
}); */

// Login form
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    successRedirect: req.query.next ? req.query.next : "/",
    // failureFlash: true,
  })(req, res, next);
});

// Register Form POST
router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      username: req.body.username,
      phonenumber: req.body.phonenumber,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    //console.log(db.User);

    db.User.findOne({ where: { username: req.body.username } }).then((user) => {
      if (user) {
        // console.log("username deja pris");
        res.redirect("/users/register");
      } else {
        const newUser = {
          name: req.body.name,
          username: req.body.username,
          phonenumber: req.body.phonenumber,
          password: req.body.password,
        };

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            db.User.create(newUser)
              .then((user) => {
                // console.log(user);
                res.redirect("/users/login");
              })
              .catch((err) => {
                // console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load user model
//require("../models/User");
//const User = mongoose.model("users");
const db = require("../models");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(
      /* { usernameField: "username" }, */
      (username, password, done) => {
        // Match user
        db.User.findOne({ where: { username: username } }).then((user) => {
          if (!user) {
            //console.log("No User Found");
            return done(null, false, { message: "No User Found" });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password Incorrect" });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    /*console.log(user);*/
    done(null, user.id);
  });

/*   passport.deserializeUser(function (id, cb) {
    db.User.findByPk(id)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }); */

  // Deserialize when needed by querying the DB for full user details
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await db.User.findByPk(id);
      return done(null, user);
    } catch (err) {
      //passLog.error(`Error Deserializing User: ${id}: ${err}`);
    }
  });

  /*passport.deserializeUser(function (id, done) {
    db.User.findOne({ where: { id: id } }).then(function ({ err, user }) {
      done(err, user);
      console.log(user);
    });

 db.User.findByPk(id, function (err, user) {
      done(err, user);
    });
  });*/
};
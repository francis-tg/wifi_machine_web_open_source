const passport = require("passport");
const db = require("../models");
module.exports = {
  ensureAuthenticated: async function (req, res, next) {
    // console.log(req.user);
    const serverData = await db.Server_data.findAll();
    const users = await db.User.findAll();
    if (serverData.length === 0 && users.length === 0)
      return res.redirect("/config");
    if (req.isAuthenticated()) {
      // console.log(req.user.admin);
      return next();
    }
    // req.flash("error_msg", "Not Authorized");
    let path = "/users/login";
    path += req.headers.referer ? `?next=${req.headers.referer}` : "";
    return res.redirect(path);
  },

  protect: () => {
    return passport.authenticate("jwt", { session: false });
  },
};

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const routes = express.Router();

const { checkAuth, SECRET_KEY } = require("../middleware/validation");

require("../middleware/passport");

routes.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email", "openid"],
  })
);

routes.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { name, email, providerId, profilePicture, _id } = req.user;

    const userInToken = {
      id: _id,
      name: name,
      email: email,
      providerId: `google-${providerId}`,
      avatar: profilePicture,
    };

    const token = jwt.sign(userInToken, SECRET_KEY, {
      expiresIn: "336h",
    });

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.redirect("/");
  }
);

// get the current logged in user
routes.get("/me", checkAuth, (req, res) => {
  const { name, email, avatar } = req.user;
  const clientUser = {
    name: name,
    email: email,
    avatar: avatar,
  };
  res.status(200).json(clientUser);
});

routes.get("/logout", checkAuth, (req, res) => {
  res.clearCookie("token").sendStatus(200).redirect("/");
});

module.exports = routes;

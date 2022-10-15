const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

// verify token cookie middleware
const checkAuth = (req, res, next) => {
  const token = req.cookies.token;

  try {
    const loggedUser = jwt.verify(token, SECRET_KEY);
    req.user = loggedUser;
    next();
  } catch (error) {
    res.clearCookie('token').sendStatus(401);
  }
};

module.exports = {
  checkAuth,
  SECRET_KEY,
};
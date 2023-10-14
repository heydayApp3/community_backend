const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, 'shhh', {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
require("dotenv").config();
const user = require("../Schemas/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = (req, res) => {
  user
    .findOne({ email: req.body.email })
    .then(async (data) => {
      let user = data;
      //hashing the plain password for authentication
      let sPassword = await bcrypt.hash(req.body.password, user.salt);
      if (user.password === sPassword) {
        const accessToken = generateAccessToken(req.body.email);
        const refreshToken = jwt.sign(
          req.body.email,
          process.env.REFRESH_TOKEN_SECRET
        );
        res
          .status(201)
          .send({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        //using error code 203 for invalid password
        res.status(203).send();
      }
    })
    .catch((err) => {
      //using error code 204 for invalid credential
      res.status(204).send();
      console.log(err);
    });
};

function generateAccessToken(email) {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.body.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    if (err) {
      res.sendStatus(403);
    }
    //req.email = email;
    res.locals.email = email.email;
    next();
  });
}

module.exports = { login, authenticateToken };

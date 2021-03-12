require("dotenv").config();

const jwt = require("jsonwebtoken");
const status = require("http-status");
const models = require("../models");
const constVariables = require("./../constants");
const apiMessage = require("./../language/en.json");

module.exports = (req, res, next) => {
  try {
    // Decode the token & get the user id
    const token = req.headers.authorization.split(" ")[constVariables.NUMBER_1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    // Locate the user
    models.User
      .findOne({ where: { id: userId } })
      .then((user) => {
        if (user) {
          next();
        } // user found
        else {
          throw "User not found";
        } // user not found
      })
      .catch((err) => {
        throw err;
      });
  } catch {
    res.status(status.UNAUTHORIZED).send({
      type: "auth",
      message: apiMessage.user.api_message.common.unauthorized_request,
    });
  }
};

const express = require("express");
const router = express.Router();
const status = require("http-status");
const jwt = require("jsonwebtoken");

const models = require("./../../../models");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");

// ****************
// Login User route - currently assumes username & password data attributes
// ****************
router.post("/", async (req, res) => {
  // Check if username and password seem valid
  if (!req.body.email || !req.body.password)
    return apiError(res, {
      type: "other",
      message: apiMessage.user.api_message.common.invalid_email_or_password,
    });

  try {
    // Locate the user
    let userToLogin = await models.User.findOne({
      where: { email: req.body.email },
    });
    console.log(userToLogin);
    if (userToLogin) {
      // If the user was found
      if (userToLogin.isVerified) {
        // If user has been verified
        // Check the password
        const isValidPassword = await userToLogin.validPassword(
          req.body.password
        );
        if (isValidPassword) {
          // If the password was valid
          // Create the payload & JWT token
          const payload = {
            id: userToLogin.id,
            name: userToLogin.name,
            email: userToLogin.email,
            userType: userToLogin.userType
          };

          let token;
          try {
            token = jwt.sign(payload, process.env.JWT_SECRET);
          } catch (error) {
            return apiError(
              res,
              {
                type: "unknown",
                message: apiMessage.user.api_message.common.server_error,
              },
              status.INTERNAL_SERVER_ERROR
            );
          }

          const response = {
            success: true,
            user: {
              id: userToLogin.id,
              email: userToLogin.email,
              name: userToLogin.name,
              userType: userToLogin.userType,
              displayName: userToLogin.displayName,
            },
            token: token,
            message: apiMessage.user.api_message.login.user_authenticated,
          };

          // Send the response
          return res.status(status.OK).send(response);
        } // Password was invalid
        else
          return apiError(
            res,
            {
              type: "password",
              message: apiMessage.user.api_message.common.wrong_password,
            },
            status.UNAUTHORIZED
          );
      } // Employee was not verified
      else
        return apiError(
          res,
          {
            type: "verification",
            message: apiMessage.user.api_message.login.user_not_verified,
          },
          status.UNAUTHORIZED
        );
    } // Employee not found
    else
      return apiError(
        res,
        {
          type: "username",
          message: apiMessage.user.api_message.common.not_find_your_account,
        },
        status.UNAUTHORIZED
      );
  } catch (error) {
    //  Handle other errors
    if (error.errors)
      return apiError(
        res,
        {
          type: "unknown",
          message: error.errors[constVariables.NUMBER_0].message,
        },
        status.INTERNAL_SERVER_ERROR
      );
    else
      return apiError(
        res,
        { type: "unknown", message: error },
        status.INTERNAL_SERVER_ERROR
      );
  }
});

module.exports = router;

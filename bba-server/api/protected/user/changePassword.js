const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const status = require("http-status");

const models = require("./../../../models");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");
const verifyAuthHeader = require("./../../extensions/verifyAuthHeader");

// *********************
// Change Password Route
// *********************
router.put("/", async (req, res) => {
  console.log("Change Password: New request received.");
  // Authenticate request & decode token
  const decodedToken = verifyAuthHeader(req.headers.authorization);
  if (!decodedToken || !decodedToken.id)
    return apiError(
      res,
      {
        type: "authentication",
        message: apiMessage.user.api_message.common.unauthorized_request,
      },
      status.UNAUTHORIZED
    );

  // Check if all the password data exists
  if (
    !req.body.password ||
    !req.body.newPassword ||
    !req.body.confirmNewPassword
  )
    return apiError(res, {
      type: "other",
      message:
        apiMessage.user.api_message.change_password.missing_password_data,
    });
  // Check if both new passwords are the same
  if (req.body.newPassword !== req.body.confirmNewPassword)
    return apiError(res, {
      type: "other",
      message:
        apiMessage.user.api_message.change_password.password_do_not_match,
    });

  try {
    // Find the user in the database
    const userToLogin = await models.User.findOne({
      where: { id: decodedToken.id },
    });

    if (!userToLogin)
      return apiError(res, {
        type: "user",
        message: apiMessage.user.api_message.common.not_find_your_account,
      });
    else {
      // If we found the user
      if (userToLogin.isVerified) {
        // If user has been verified
        // Check the password
        const isValidPassword = await userToLogin.validPassword(
          req.body.password
        );

        // If the current password was valid
        if (isValidPassword) {
          // Change the password
          userToLogin.password = req.body.newPassword;

          // Save the password
          await userToLogin.save();

          // Create the payload & JWT token
          const payload = {
            id: userToLogin.id,
            name: userToLogin.name,
            email: userToLogin.email,
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
              displayName: userToLogin.displayName,
            },
            token: token,
            message:
              apiMessage.user.api_message.change_password.password_updated,
          };

          // Send the response
          console.log(
            "Login: Employee successfully changed their password.  Sending response."
          );

          return res.send(response);
        } else
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
        return err(
          {
            type: "verification",
            message:
              apiMessage.user.api_message.change_password.user_not_verified,
          },
          status.UNAUTHORIZED
        );
    }
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

const express = require("express");
const router = express.Router();
const status = require("http-status");
const cryptoRandomString = require("crypto-random-string");

const models = require("./../../../models");
const email = require("./../../extensions/email");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");

// *********************
// Forgot Password Route
// *********************
router.post("/", async (req, res) => {
  console.log("Forgot Password: New request received.");
  // Check if an email was provided
  if (!req.body.email)
    return apiError(res, {
      type: "email",
      message: apiMessage.user.api_message.common.email_required,
    });

  try {
    // Locate the user
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (!user)
      return err({
        type: "email",
        message: apiMessage.user.api_message.forgot_password.account_not_exists,
      });
    else {
      // If we found the user
      if (user.isVerified) {
        // If user has been verified
        // Locate and delete any preexisting token
        const existingToken = await models.ResetToken.findOne({
          where: { userId: user.id },
        });

        if (existingToken) await existingToken.destroy();
        // Create a new token
        const token = await models.ResetToken
          .build({
            userId: user.id,
            token: cryptoRandomString({
              length: constVariables.NUMBER_64,
              type: "url-safe",
            }),
          })
          .save();

        // Send password reset email
        console.log("Forgot Password: Sending password reset email message...");
        const emailHTML = email.createResetPasswordMessage(
          token.token,
          user.email
        );
        const emailText =
          "Visit " +
          process.env.CLIENT_URL +
          "/resetPassword?token=" +
          token.token +
          "&email=" +
          user.email +
          " to reset your password.";
        const appName = process.env.APP_NAME ? process.env.APP_NAME : "PMC";

        try {
          email.sendEmail({
            to: req.body.email, // list of receivers
            subject: appName + ": Reset your Password", // Subject line
            text: emailText, // plain text body
            html: emailHTML, // html body
          });
        } catch (error) {
          console.log("Forgot Password: Error sending verification email");
        }

        // Send the response
        console.log("Forgot Password: Email sent, sending response.");
        const response = {
          success: true,
          email: req.body.email,
          message:
            apiMessage.user.api_message.forgot_password.password_reset_email,
        };

        return res.send(response);
      } // User was not verified
      else
        return apiError(
          res,
          {
            type: "verification",
            message: apiMessage.user.api_message.forgot_password.not_verified,
          },
          status.UNAUTHORIZED
        );
    } //asdf
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

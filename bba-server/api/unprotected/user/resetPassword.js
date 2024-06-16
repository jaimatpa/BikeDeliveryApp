const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("./../../../models");
const email = require("./../../extensions/email");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");

// ********************
// Reset Password Route
// *******************
router.post("/", async (req, res) => {
  // Check if an email was provided
  if (!req.body.email)
    return apiError(res, {
      type: "email",
      message: apiMessage.user.api_message.common.email_required,
    });

  // Check if a token was provided
  if (!req.body.token)
    return apiError(res, {
      type: "token",
      message:
        apiMessage.user.api_message.reset_password.reset_token_not_provided,
    });

  // Check if passwords were provided & match
  if (
    !req.body.password ||
    !req.body.confirmPassword ||
    req.body.password !== req.body.confirmPassword
  )
    return apiError(res, {
      type: "password",
      message: apiMessage.user.api_message.reset_password.problem_with_password,
    });

  try {
    // Locate the user
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (!user)
      return apiError(res, {
        type: "email",
        message: apiMessage.user.api_message.common.no_account_exists,
      });
    else {
      // If a user was found
      // Get the stored token
      const storedToken = await models.ResetToken.findOne({
        where: { userId: user.id, token: req.body.token },
      });

      if (!storedToken)
        return apiError(res, {
          type: "token",
          message:
            apiMessage.user.api_message.reset_password
              .verification_token_not_provided,
        });
      else if (req.body.token == storedToken.token) {
        // Token successfully verified!
        // Delete the token
        await storedToken.destroy();

        // Update the user's password
        user.password = req.body.password;
        user.save();

        // Send email notification
        console.log(
          "Reset Password: Password Reset, sending email notification message..."
        );

        const appName = process.env.APP_NAME ? process.env.APP_NAME : "BDA";
        const emailHTML = email.createPasswordWasResetMessage(user.email);
        const emailText = `Your ${appName} password was reset.`;
        try {
          email.sendEmail({
            to: user.email, // list of receivers
            subject: `${appName}: Your password was reset.`, // Subject line
            text: emailText, // plain text body
            html: emailHTML, // html body
          });
        } catch (error) {
          console.log(
            "Reset Password: Error sending password reset notification email"
          );
        }

        // Send the response
        console.log(
          "Reset Password: Reset Password completed.  Sending response."
        );
        return res.send({
          success: true,
          message: apiMessage.user.api_message.common.password_changed,
        });
      } // If token did not match
      else
        return apiError(res, {
          type: "token",
          message: apiMessage.user.api_message.common.token_invalid,
        });
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

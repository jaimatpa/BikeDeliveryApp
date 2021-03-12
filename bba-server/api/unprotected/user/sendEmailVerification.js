const express = require("express");
const router = express.Router();
const status = require("http-status");
const cryptoRandomString = require("crypto-random-string");

const models = require("./../../../models");
const email = require("./../../extensions/email");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");

// *************************
// Create Verify Token route
// *************************
router.post("/", async (req, res) => {
  console.log(
    "Send Verify Token: Attempt to create a new verify token for " +
      (req.body.email ? req.body.email : "[email not provided]")
  );

  // Check if email was provided
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

    if (user) {
      // If the user was found
      // Check if this user was already verified
      if (user.isVerified)
        return apiError(res, {
          type: "other",
          message: apiMessage.user.api_message.common.account_already_verified,
        });
      else {
        // If the user has not yet verified
        // Locate and delete any preexisting tokens
        const existingToken = await models.VerificationToken.findOne({
          where: { userId: user.id },
        });

        if (existingToken) await existingToken.destroy();

        // Create a new token
        const token = await models.VerificationToken
          .build({
            userId: user.id,
            token: cryptoRandomString({
              length: constVariables.NUMBER_32,
              type: "url-safe",
            }),
          })
          .save();

        // Send email verfication
        console.log(
          "Send Verify Token: Token created, sending email verification message..."
        );
        const appName = process.env.APP_NAME ? process.env.APP_NAME : "BDA";
        const emailHTML = email.createVerifyEmailMessage(
          token.token,
          user.email
        );
        const emailText =
          "Visit " +
          process.env.CLIENT_URL +
          "/verifyEmail?token=" +
          token.token +
          "&email=" +
          user.email +
          " to verify your email address.";
        email.sendEmail({
          to: req.body.email, // list of receivers
          subject: `${appName}: Verify your Email address.`, // Subject line
          text: emailText, // plain text body
          html: emailHTML, // html body
        });

        // Send the response
        console.log("Send Verify Token: Token sent. Sending response.");
        const response = {
          success: true,
          email: req.body.email,
          message: apiMessage.user.api_message.common.new_email_verification,
        };

        return res.send(response);
      }
    } else
      return apiError(res, {
        type: "email",
        message: apiMessage.user.api_message.common.no_account_exists,
      });
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

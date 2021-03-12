const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("./../../../models");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");

// ******************
// Verify Email Route
// ******************
router.post("/", async (req, res) => {
  // Check if token was provided
  if (!req.body.token)
    return apiError(res, {
      type: "token",
      message:
        apiMessage.user.api_message.verify_email
          .verification_token_not_provided,
    });
  // Check if email was provided
  else if (!req.body.email)
    return apiError(res, {
      type: "email",
      message: apiMessage.user.api_message.common.email_required,
    });

  try {
    // Locate the user
    console.log("Verify Email: Locating user...");
    const verificationToken = await models.VerificationToken.findOne({
      where: { token: req.body.token },
    });

    if (verificationToken) {
      let userToVerify = await models.User.findOne({
        where: { id: verificationToken.userId, email: req.body.email },
      });

      // If the user was NOT found
      if (!userToVerify)
        return err(res, {
          type: "other",
          message: apiMessage.user.api_message.verify_email.account_not_found,
        });
      else {
        // Get the stored token
        const storedToken = await models.VerificationToken.findOne({
          where: { userId: userToVerify.id },
        });

        if (req.body.token === storedToken.token) {
          // Token successfully verified!
          // Update the user & delete the token
          userToVerify.isVerified = true;
          await userToVerify.save();
          await storedToken.destroy();

          const response = {
            success: true,
            email: req.body.email,
            message: apiMessage.user.api_message.common.email_verified,
          };

          console.log("Verify Email: Email Verified. Sending response.");
          return res.send(response);
        } // Token found, but not verified
        else
          return apiError(res, {
            type: "token",
            message: apiMessage.user.api_message.common.token_invalid,
          });
      }
    } // No verification token
    else
      return apiError(res, {
        type: "token",
        message:
          apiMessage.user.api_message.verify_email.verification_token_not_found,
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

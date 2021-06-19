const express = require("express");
const router = express.Router();
const status = require("http-status");
const crypto = require("crypto-random-string");

const models = require("./../../../models");
const email = require("./../../extensions/email");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const validateEmail = require("./../../../libs/validateEmail");
const apiMessage = require("./../../../language/en.json");

// *****************
// Register User route
// *****************
router.post("/", async (req, res) => {
  // Check if email was provided
  if (!req.body.email)
    return apiError(res, {
      type: "email",
      message: apiMessage.user.api_message.common.email_required,
    });
  // Check if email is valid
  else if (!validateEmail(req.body.email))
    return apiError(res, {
      type: "email",
      message: apiMessage.user.api_message.common.invalid_email,
    });

  // Check if password was provided
  if (!req.body.password)
    return apiError(res, {
      type: "password",
      message: apiMessage.user.api_message.common.password_required,
    });

  // Check if userType was provided. userType should be an integer like: [client: 1, deliveryDriver: 2, systemAdmin: 3]
  if (!req.body.userType)
    return apiError(res, {
      type: "userType",
      message: apiMessage.user.api_message.register.user_type_required,
    });

  try {
    // Locate the user
    let userToLogin = await models.User.findOne({
      where: { email: req.body.email },
    });

    if (!userToLogin) {
      // If the user was NOT found
      try {
        // Create the user        
        let newUser = await models.User.build({
          email: req.body.email,
          name: req.body.name || "",
          password: req.body.password,
          userType: parseInt(req.body.userType.userTypeVal, 10),
          isVerified: true,
        }).save();

        if (newUser) {
          const response = {
            success: true,
            email: req.body.email,
            name: req.body.name || "",
            message: apiMessage.user.api_message.register.user_created,
          };

          // Generate a verification token
          const verifyToken = await models.VerificationToken.build({
            userId: newUser.id,
            token: crypto({ length: constVariables.NUMBER_16 }),
          }).save();

          // Send email verfication
          const emailHTML = email.createVerifyEmailMessage(
            verifyToken.token,
            newUser.email
          );

          const emailText =
            "Visit " +
            process.env.CLIENT_URL +
            "/verifyEmail?token=" +
            verifyToken.token +
            "&email=" +
            newUser.email +
            " to verify your email address.";

          const appName = process.env.APP_NAME ? process.env.APP_NAME : "BDA";

          try {
            email.sendEmail({
              to: req.body.email, // list of receivers
              subject: `${appName}: Verify your Email address.`, // Subject line
              text: emailText, // plain text body
              html: emailHTML, // html body
            });
          } catch (error) {
            console.log("Register: Error sending verification email");
          }

          // Send the response
          return res.send(response);
        } else
          return apiError(
            res,
            {
              type: "unknown",
              message:
                apiMessage.user.api_message.register.error_creating_new_user,
            },
            status.INTERNAL_SERVER_ERROR
          );
      } catch (error) {
        return apiError(
          res,
          {
            type: "unknown",
            message:
              apiMessage.user.api_message.register.error_creating_new_user,
          },
          status.INTERNAL_SERVER_ERROR
        );
      }
    } else
      return apiError(res, {
        type: "email",
        message: apiMessage.user.api_message.common.account_exists,
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

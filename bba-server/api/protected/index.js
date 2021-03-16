const finale = require("finale-rest");
const crypto = require("crypto-random-string");

const models = require("./../../models");
const email = require("./../extensions/email");
const upload = require("./upload");
const constVariables = require("./../../constants");

const changePassword = require("./user/changePassword");
const allUsers = require("./user/allUsers");
const updateUser = require("./user/updateUsers");
const deleteUser = require("./user/deleteUser");
const restoreUsers = require("./user/restoreUsers");

module.exports = {
  create: (app) => {
    // Create the routes
    app.use("/api/user/changePassword", changePassword);
    app.use("/api/user/allUsers", allUsers);
    app.use("/api/user/restoreUsers", restoreUsers);
    app.use("/api/user/updateUser", updateUser);
    app.use("/api/user/deleteUser", deleteUser);

    app.use("/api/upload", upload);

    // User
    const resource = finale.resource({
      model: models.User,
      excludeAttributes: [
        "isVerified",
        "displayName",
        "password",
        "updatedAt",
        "deletedAt",
      ],
      endpoints: ["/api/users", "/api/users/:id"],
      sort: {
        default: "-createdAt",
      },
      actions: ["create", "list", "read", "update", "delete"],
    });

    /*Send Verify Email For New user which is Super Admin Create*/
    resource.create.write.after(async function (req, res, context) {
      try {
        // Find the response user object
        const newUser = context?.instance?.dataValues;

        if (newUser) {
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
        }
      } catch (error) {
        console.log("error", error);
      }

      return context.continue;
    });
  },
};

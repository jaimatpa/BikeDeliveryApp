const finale = require("finale-rest");
const crypto = require("crypto-random-string");
const status = require("http-status");

const models = require("./../../models");
const email = require("./../extensions/email");
const upload = require("./upload");
const constVariables = require("./../../constants");
const verifyAuthHeader = require("./../extensions/verifyAuthHeader");
const apiError = require("./../../libs/apiError");
const apiMessage = require("./../../language/en.json");

const changePassword = require("./user/changePassword");
const allUsers = require("./user/allUsers");
const updateUser = require("./user/updateUsers");
const deleteUser = require("./user/deleteUser");
const restoreUsers = require("./user/restoreUsers");

const allWebHooks = require("./webHook/allWebHooks");
const createWebHook = require("./webHook/createWebHook");
const updateWebHook = require("./webHook/updateWebHook");

module.exports = {
  create: (app) => {
    // Create the protected user routes
    app.use("/api/user/changePassword", changePassword);
    app.use("/api/user/allUsers", allUsers);
    app.use("/api/user/restoreUsers", restoreUsers);
    app.use("/api/user/updateUser", updateUser);
    app.use("/api/user/deleteUser", deleteUser);

    // Create Protected Web hook route
    app.use("/api/webHook/allWebHooks", allWebHooks);
    app.use("/api/webHook/createWebHook", createWebHook);
    app.use("/api/webHook/updateWebHook", updateWebHook);

    app.use("/api/upload", upload);

    // User
    const userResource = finale.resource({
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

    userResource.create.write.after(async function (req, res, context) {
      /*Send Verify Email For New user which is System Admin Create*/
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
            newUser.email,
            req.body.password
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

    // Web Hooks
    const webHookresource = finale.resource({
      model: models.WebHook,
      excludeAttributes: ["userId", "updatedAt"],
      endpoints: ["/api/webHooks", "/api/webHooks/:id"],
      sort: {
        default: "-createdAt",
      },
      actions: ["create", "list", "read", "update", "delete"],
    });

    webHookresource.create.write.before(async function (req, res, context) {
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

      // Check if webHookUrl was provided
      if (!req.body.webHookUrl)
        return apiError(res, {
          type: "webHook",
          message: apiMessage.web_hook.api_message.web_hook_url_required,
        });

      try {
        // Create the web hook url
        const newWebHookUrl = await models.WebHook.build({
          webHookUrl: req.body.webHookUrl,
          isActive: req.body.isActive,
          userId: decodedToken.id,
        }).save();

        if (newWebHookUrl) {
          const response = {
            success: true,
            webHookUrl: req.body.webHookUrl,
            isActive: req.body.isActive,
            message: apiMessage.web_hook.api_message.web_hook_created,
          };

          // Send the response
          return res.send(response);
        } else
          return apiError(
            res,
            {
              type: "unknown",
              message:
                apiMessage.web_hook.api_message.error_creating_web_hook_url,
            },
            status.INTERNAL_SERVER_ERROR
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
  },
};

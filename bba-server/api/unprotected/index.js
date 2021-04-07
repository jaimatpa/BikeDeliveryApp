const login = require("./user/login");
const register = require("./user/register");
const sendSMS = require("./user/sendSMS");
const verifyEmail = require("./user/verifyEmail");
const forgotPassword = require("./user/forgotPassword");
const resetPassword = require("./user/resetPassword");
const sendEmailVerification = require("./user/sendEmailVerification");
const deliveryOrder = require("./user/deliveryorder");
const webhookmap = require("./user/webhookmap");
const template = require("./user/template");

module.exports = {
  create: (app) => {
    // Create the routes
    app.use("/api/user/login", login);
    app.use("/api/user/register", register);
    app.use("/api/user/verifyEmail", verifyEmail);
    app.use("/api/user/sendSMS", sendSMS);
    app.use("/api/user/sendEmailVerification", sendEmailVerification);
    app.use("/api/user/forgotPassword", forgotPassword);
    app.use("/api/user/resetPassword", resetPassword);
    app.use("/api/user/deliveryOrder", deliveryOrder);
    app.use("/api/user/webhookmap", webhookmap);
    app.use("/api/user/template", template);

  },
};

const login = require("./user/login");
const register = require("./user/register");
const sendSMS = require("./user/sendSMS");
const verifyEmail = require("./user/verifyEmail");
const forgotPassword = require("./user/forgotPassword");
const resetPassword = require("./user/resetPassword");
const sendEmailVerification = require("./user/sendEmailVerification");
const deliveryOrder = require("./user/deliveryorder");
const searchHistory = require("./user/searchhistory");
const locking = require("./user/locking");
const deliveryOrderUpdate = require("./user/deliveryorderupdate");
const webhookmap = require("./user/webhookmap");
const template = require("./user/template");
const upload = require("./user/upload");
const downloadBackUpPhotos = require("./user/downloadBackUpPhotos");

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
    app.use("/api/user/searchHistory", searchHistory);
    app.use("/api/user/locking", locking);
    app.use("/api/user/deliveryOrderUpdate", deliveryOrderUpdate);
    app.use("/api/user/webhookmap", webhookmap);
    app.use("/api/user/template", template);
    app.use("/api/user/upload", upload);
    app.use("/api/user/downloadBackUpPhotos", downloadBackUpPhotos);
  },
};

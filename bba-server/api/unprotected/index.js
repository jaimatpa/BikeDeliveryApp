const login = require("./user/login");
const register = require("./user/register");
const sendSMS = require("./user/sendSMS");
const verifyEmail = require("./user/verifyEmail");
const forgotPassword = require("./user/forgotPassword");
const resetPassword = require("./user/resetPassword");
const sendEmailVerification = require("./user/sendEmailVerification");
const deliveryOrder = require("./user/deliveryorder");
const locking = require("./user/locking");
const deliveryOrderUpdate = require("./user/deliveryorderupdate");
const webhookmap = require("./user/webhookmap");
const template = require("./user/template");
const upload = require("./user/upload");
const downloadBackUpPhotos = require("./user/downloadBackUpPhotos");
const resend = require("./user/resend");
const sendDeliveryEmail = require("./user/sendDeliveryEmail");
const searchHistory = require("./user/searchhistory");
const getOrder = require("./user/getOrder");
const asset = require("./user/asset");
const truck = require("./user/truck");
const deliveryItem = require("./user/deliveryItem");
const uploadPickup = require("./user/uploadPickup");
const deliveryOrderManagement = require("./user/deliveryOrderManagement");
const cors = require('cors');

module.exports = {
  create: (app) => {
    app.use(cors());
    // Create the routes
    app.use("/api/user/login", login);
    app.use("/api/user/register", register);
    app.use("/api/user/verifyEmail", verifyEmail);
    app.use("/api/user/sendSMS", sendSMS);
    app.use("/api/user/sendEmailVerification", sendEmailVerification);
    app.use("/api/user/forgotPassword", forgotPassword);
    app.use("/api/user/resetPassword", resetPassword);
    app.use("/api/user/deliveryOrder", deliveryOrder);
    app.use("/api/user/locking", locking);
    app.use("/api/user/deliveryOrderUpdate", deliveryOrderUpdate);
    app.use("/api/user/webhookmap", webhookmap);
    app.use("/api/user/template", template);
    app.use("/api/user/upload", upload);
    app.use("/api/user/downloadBackUpPhotos", downloadBackUpPhotos);
    app.use("/api/user/resend", resend);
    app.use("/api/user/sendDeliveryEmail", sendDeliveryEmail);
    app.use("/api/user/getOrder", getOrder);
    app.use("/api/user/searchHistory", searchHistory);
    app.use("/api/user/asset/", asset);
    app.use("/api/user/asset/:id", asset);
    app.use("/api/user/truck/", truck);
    app.use("/api/user/truck/:id", truck);
    app.use("/api/user/deliveryItem/", deliveryItem);
    app.use("/api/user/deliveryItem/:id", deliveryItem);
    app.use("/api/user/uploadPickup/", uploadPickup);
    app.use("/api/user/uploadPickup/", uploadPickup);
    app.use("/api/user/deliveryOrderManagement/", deliveryOrderManagement);
    app.use("/api/user/deliveryOrderManagement/:id", deliveryOrderManagement);
  },
};

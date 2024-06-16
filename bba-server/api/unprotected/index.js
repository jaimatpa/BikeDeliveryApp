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
const twilio = require("./user/twilio");
const equipmentType = require("./user/equipmentType");
 

const problem = require("./user/problem");
const problemType = require("./user/problemType");
const activity = require("./user/activity");
const deal = require("./user/deal");
const communicationMessage = require("./user/communicationMessage");
const location = require("./user/location.controller");
const trip = require("./user/trip.controller");
const notification = require("./user/notification");
const drivers = require("./user/drivers");
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
    app.use("/api/user/twilio/", twilio);

    // * Equipment Types
    app.use("/api/user/equipment-types", equipmentType);
    app.use("/api/user/equipment-types/:id", equipmentType);

    // * Problems
    app.use("/api/user/problems", problem);
    app.use("/api/user/problems/:id", problem);

    // * Problem Types
    app.use("/api/user/problem-types", problemType);
    app.use("/api/user/problem-types/:id", problemType);

    // * Notifications
    app.use("/api/user/notifications", notification);
    app.use("/api/user/notifications/:id", notification);

    // * Activities
    app.use("/api/user/activities", activity);
    app.use("/api/user/activities/:id", activity);

    // * Deals
    app.use("/api/user/deals", deal);
    app.use("/api/user/deals/:id", deal);

    // * Communication Message
    app.use("/api/user/communication-message", communicationMessage);
    app.use("/api/user/communication-message/:id", communicationMessage);

    // * Location management
    app.use("/api/user/locations", location);

    // * Trips
    app.use("/api/user/trips", trip);

    // * Drivers
    app.use("/api/user/drivers", drivers);
  },
};

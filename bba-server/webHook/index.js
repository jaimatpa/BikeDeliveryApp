const webHook = require("./webHook");


module.exports = {
  create: (app) => {
    // Create the routes
    app.use("/webhook", webHook);
  },
};

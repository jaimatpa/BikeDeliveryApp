const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("./../../../models");
const apiError = require("./../../../libs/apiError");
const constVariables = require("./../../../constants");
const apiMessage = require("./../../../language/en.json");

// *****************
// Create Web Hook route
// *****************
router.post("/", async (req, res) => {
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
    }).save();

    if (newWebHookUrl) {
      const response = {
        success: true,
        webHookUrl: req.body.webHookUrl,
        message: apiMessage.web_hook.api_message.web_hook_created,
      };

      // Send the response
      return res.send(response);
    } else
      return apiError(
        res,
        {
          type: "unknown",
          message: apiMessage.web_hook.api_message.error_creating_web_hook_url,
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

module.exports = router;

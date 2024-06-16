const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("./../../../models");
const apiError = require("../../../libs/apiError");
const constVariables = require("../../../constants");
const apiMessage = require("./../../../language/en.json");
const verifyAuthHeader = require("./../../extensions/verifyAuthHeader");

// *****************
// Get All Web Hooks Route
// *****************
router.get("/", async (req, res) => {
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

  try {
    const webHookUrl = req.query.webHookUrl;
    const condition = webHookUrl
      ? { webHookUrl: { [models.Sequelize.Op.like]: `%${webHookUrl}%` } }
      : null;

    // Find all web hooks in the database
    const allWebHooks = await models.WebHook.findAll({
      where: condition,
    });

    if (!allWebHooks)
      return apiError(
        res,
        {
          type: "webHook",
          message:
            apiMessage.web_hook.api_message.retrieving_all_web_hook_error,
        },
        status.INTERNAL_SERVER_ERROR
      );
    else {
      const response = {
        success: true,
        allWebHooks: allWebHooks,
        message:
          apiMessage.web_hook.api_message.retrieving_all_web_hook_success,
      };

      // Send the response
      return res.send(response);
    }
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

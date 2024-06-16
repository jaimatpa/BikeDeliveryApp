const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("../../../models");
const apiError = require("../../../libs/apiError");
const constVariables = require("../../../constants");
const apiMessage = require("./../../../language/en.json");
const verifyAuthHeader = require("../../extensions/verifyAuthHeader");

// *****************
// Delete User Route
// *****************
router.delete("/:id", async (req, res) => {
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
    // Check user id
    const userId = req.params.id;

    if (!userId)
      return apiError(res, {
        type: "user",
        message: `${apiMessage.user.api_message.delete_user.not_delete_user_with_id} + ${userId}`,
      });
    else {
      // If we found the user
      // Delete the user
      const result = await models.User.destroy({
        where: { id: userId },
      });

      if (result === 1) {
        const response = {
          success: true,
          result: result,
          message:
            apiMessage.user.api_message.delete_user.user_successfully_deleted,
        };

        // Send the response
        return res.send(response);
      } else {
        const response = {
          success: false,
          result: result,
          message: `${apiMessage.user.api_message.delete_user.not_delete_user_with_id} ${userId}. ${apiMessage.user.api_message.delete_user.maybe_user_was_not_found}`,
        };

        // Send the response
        return res.send(response);
      }
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

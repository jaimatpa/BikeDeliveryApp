const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("../../../models");
const apiError = require("../../../libs/apiError");
const constVariables = require("../../../constants");
const apiMessage = require("./../../../language/en.json");
const verifyAuthHeader = require("../../extensions/verifyAuthHeader");

// *****************
// Update User Route
// *****************
router.put("/", async (req, res) => {
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

  // Check if we have new user data to update
  if (!req.body.name || !req.body.name.length)
    return apiError(res, {
      type: "other",
      message: apiMessage.user.api_message.update_user.no_user_data_to_update,
    });

  try {
    // Find the user in the database
    let userToUpdate = await models.User.findOne({
      where: { id: decodedToken.id },
    });

    if (!userToUpdate)
      return apiError(res, {
        type: "user",
        message: apiMessage.user.api_message.common.not_find_your_account,
      });
    else {
      // If we found the user
      // Update the user
      userToUpdate.name = req.body.name;

      // Save the user
      await userToUpdate.save();

      const response = {
        success: true,
        user: {
          id: userToUpdate.id,
          name: userToUpdate.name,
          email: userToUpdate.email,
        },
        message:
          apiMessage.user.api_message.update_user.user_successfully_updated,
      };

      // Send the response
      console.log(
        "Update User: User successfully updated.  Sending response."
      );
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

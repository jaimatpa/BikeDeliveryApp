const express = require("express");
const router = express.Router();
const status = require("http-status");

const models = require("../../../models");
const apiError = require("../../../libs/apiError");
const constVariables = require("../../../constants");
const apiMessage = require("./../../../language/en.json");
const verifyAuthHeader = require("../../extensions/verifyAuthHeader");

// *****************
// All Users Route
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
    const email = req.query.email;
    const condition = email
      ? { email: { [models.Sequelize.Op.like]: `%${email}%` } }
      : null;

    // Find all users in the database
    const allUsers = await models.User.findAll({
      where: condition,
    });

    if (!allUsers)
      return apiError(
        res,
        {
          type: "user",
          message:
            apiMessage.user.api_message.all_users.retrieving_all_users_error,
        },
        status.INTERNAL_SERVER_ERROR
      );
    else {
      const response = {
        success: true,
        allUsers: allUsers,
        message:
          apiMessage.user.api_message.all_users.retrieving_all_users_success,
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

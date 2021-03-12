const jwt = require("jsonwebtoken");
const constVariables = require("./../../constants");

module.exports = (authHeader) => {
  // Check if a valid JWT token exists in the header
  if (
    authHeader &&
    authHeader.split(" ")[constVariables.NUMBER_0] === "Bearer"
  ) {
    const authorization = authHeader.split(" ")[constVariables.NUMBER_1];
    try {
      const decoded = jwt.verify(
        authorization,
        process.env.JWT_SECRET /*, { ignoreExpiration: true } */
      );

      return decoded;
    } catch (e) {
      return null;
    }
  } else return null;
};

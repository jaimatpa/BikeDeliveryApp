const status = require('http-status');

module.exports = (res, msg, code) => {
  code = code ? code : status.BAD_REQUEST;
  console.log(`Error ${code}: ${msg.message}`);
  return res.status(code).send(msg);
};

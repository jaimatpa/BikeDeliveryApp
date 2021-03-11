const jwt = require('jsonwebtoken')
module.exports = (authHeader) => {
  // Check if a valid JWT token exists in the header
  console.log('Authentication: Checking that auth header exists...')
  if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
    let authorization = authHeader.split(' ')[1]
    try {
      console.log('Authentication: Header found, decoding...')
      let decoded = jwt.verify(authorization, process.env.JWT_SECRET /*, { ignoreExpiration: true } */);
      console.log('Authentication: Header successfully decoded.')
      return decoded
    } catch (e) {
      return null
    }
  } else
    return null
}

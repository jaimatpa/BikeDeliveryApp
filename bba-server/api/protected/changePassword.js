const express = require('express')
const router = express.Router()
const models = require('./../../../models')
const email = require('./../../extensions/email')
const verifyAuthHeader = require('./../../extensions/verifyAuthHeader')
const cryptoRandomString = require('crypto-random-string')
const jwt = require('jsonwebtoken')

// *********************
// Forgot Password Route
// *********************
router.post('/', async (req, res) => {

  function err(msg, code) {
    code = code ? code : 400
    console.log(`Change Password: Error ${code}: ${msg.message}`)
    return res.status(code).send(msg)
  }

  console.log('Change Password: New request received.')

  // Authenticate request & decode token
  let decodedToken = verifyAuthHeader(req.headers.authorization)
  if (!decodedToken || !decodedToken.id)
    return err({ 'type': 'authentication', 'message': 'Unauthorized request.' }, 401)

  // Check if all the password data exists
  if (!req.body.password || !req.body.newPassword || !req.body.confirmNewPassword)
    return err({ 'type': 'other', 'message': 'Missing required password data.' })
  // Check if both new passwords are the same
  if (req.body.newPassword != req.body.confirmNewPassword)
    return err({ 'type': 'other', 'message': 'Passwords do not match.' })

  try {
    // Find the user in the database
    let userToLogin = await models.User.findOne({ where: { id: decodedToken.id }})

    if (!userToLogin)
      return err({ 'type': 'user', 'message': 'Couldn\'t find your account.' })
    else { // If we found the user
      if (userToLogin.isVerified) { // If user has been verified
        // Check the password
        let isValidPassword = await userToLogin.validPassword(req.body.password)
        // If the current password was valid
        if (isValidPassword) {
          // Change the password
          userToLogin.password = req.body.newPassword
          const savedUser = await userToLogin.save()
          // Create the payload & JWT token
          let payload = { id: userToLogin.id, email: userToLogin.email }
          let token
          try {
            token = jwt.sign(payload, process.env.JWT_SECRET)
          } catch(error) {
            return err({ 'type': 'unknown', 'message': 'Server authentication error.' }, 500)
          }
          let response = {
            'success': true,
            'user': {
              id: userToLogin.id,
              email: userToLogin.email,
              name: userToLogin.name,
              displayName: userToLogin.displayName,
            },
            'token': token,
            'message': 'Password Successfully Updated'
          }
          // Send the response
          console.log('Login: User successfully changed their password.  Sending response.')
          return res.send(response)
        } else
          return err({ 'type': 'password', 'message': 'Wrong password.' }, 401)

      } else // User was not verified
        return err({ 'type': 'verification', 'message': 'User not verified.' }, 401)
    }
  }
  catch(error) {
    //  Handle other errors
    if (error.errors)
      return err({ 'type': 'unknown', 'message': error.errors[0].message }, 500)
    else
      return err({ 'type': 'unknown', 'message': error }, 500)
  }
})

module.exports = router

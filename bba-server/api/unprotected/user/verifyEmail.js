const express = require('express')
const router = express.Router()
const models = require('./../../../models')

// ******************
// Verify Email Route
// ******************
router.post('/', async (req, res) => {

  function err(msg, code) {
    code = code ? code : 400
    console.log(`Verify Email: Error ${code}: ${msg.message}`)
    return res.status(code).send(msg)
  }

  console.log('Verify Email: Attempting to verify user email')
  // Check if token was provided
  if (!req.body.token)
    return err({ 'type': 'token', 'message': 'A verification token was not provided.' })
  // Check if email was provided
  else if (!req.body.email)
    return err({'type': 'email', 'message': 'An email address is required.'})

  try {
    // Locate the user
    console.log('Verify Email: Locating user...')
    let verificationToken = await models.VerificationToken.findOne({ where: { token: req.body.token }})
    if (verificationToken) {
      let userToVerify = await models.User.findOne({ where: { id: verificationToken.userId, email: req.body.email } })
      // If the user was NOT found
      if (!userToVerify)
        return err({ 'type': 'other', 'message': 'The user account was not found.' })
      else {
        // Get the stored token
        let storedToken = await models.VerificationToken.findOne({ where: { userId: userToVerify.id }})
        if (req.body.token == storedToken.token) { // Token successfully verified!
          // Update the user & delete the token
          userToVerify.isVerified = true
          await userToVerify.save()
          await storedToken.destroy()
          let response = {
            'success': true,
            'email': req.body.email,
            'message': 'Email address verified.'
          }
          console.log('Verify Email: Email Verified. Sending response.')
          return res.send(response)
        } else // Token found, but not verified
          return err({ 'type': 'token', 'message': 'The token was invalid.' })
      }
    } else // No verification token
      return err({ 'type': 'token', 'message': 'The verification token provided was not found.' })
  }
  catch(error) {
    //  Handle other errors
    if (error.errors)
      return err({ 'type': 'unknown', 'message': error.errors[0].message })
    else
      return err({ 'type': 'unknown', 'message': error })
  }
})

module.exports = router
